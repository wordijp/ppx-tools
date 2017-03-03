//! script

//
// コマンド実行結果を返す(コマンド置換対応)
//

function _read(file) {
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var cwd = fs.GetParentFolderName(PPx.ScriptFullName);
	var fullpath = cwd + '\\' + file;
	if (!fs.FileExists(fullpath)) { PPx.Echo('* file not found:' + file); PPx.Quit(-1); }
	var f = fs.OpenTextFile(fullpath, 1);
	try { return f.ReadAll(); } finally { f.Close(); }
}

var util = eval(_read('./lib/util.js'));

///

// 環境変数の記号を置換する
function replaceEnvSymbol(cmd, sep, newsep) {
	while (true) {
		var m = cmd.match(new RegExp(sep + "[^ \\\/]+?" + sep));
		if (!m) break;

		var left = cmd.substring(0, m.index);
		var target = cmd.substring(m.index + sep.length, m.lastIndex - sep.length);
		var right = cmd.substring(m.lastIndex);

		cmd = left + newsep + target + newsep + right;
	}
	return cmd;
}
function escapeEnv(cmd) { return replaceEnvSymbol(cmd, '%', '_@ENV@_'); }
function restoreEnv(cmd) { return replaceEnvSymbol(cmd, '_@ENV@_', '%'); }


// 文字列を置換する
var g_escape_i = 1;
var g_escaped = {};
function escapeString(cmd) {
	while (true) {
		var m = null;
		if (!m) m = cmd.match(/'.*?[^\\]'/);
		if (!m) m = cmd.match(/".*?[^\\]"/);

		if (!m) break;

		var left = cmd.substring(0, m.index);
		var l = cmd.substring(m.index, m.index + 1);
		var target = cmd.substring(m.index + 1, m.lastIndex - 1);
		var r = cmd.substring(m.lastIndex - 1, m.lastIndex);
		var right = cmd.substring(m.lastIndex);

		target = internalCommand(target).cmd;

		var key = "__@ESCAPED{" + g_escape_i++ + "}@__";
		g_escaped[key] = l + target + r;
		cmd = left + key + right;
	}
	return cmd;
}
function restoreString(cmd) {
	var m;
	while ((m = cmd.match(/__@ESCAPED{\d+}@__/))) {
		var key = cmd.substring(m.index, m.lastIndex);
		cmd = cmd.replace(key, g_escaped[key]);
	}
	return cmd;
}


// 内部のコマンドを実行し、結果へと置き換える
function internalCommand(_cmd) {
	// 文字列を退避
	var cmd = escapeString(_cmd);

	var m, l, r;
	if ((m = cmd.match(/`.+?`/))) {
		l = '`';
		r = '`';
	} else if ((m = cmd.match(/\$\((?!.*\$\().*?\)/))) {
		l = '$(';
		r = ')';
	}

	if (!m) {
		return {
			'cmd': _cmd,
			'exec': false
		};
	}

	// 内部のコマンドを発見
	var left = cmd.substring(0, m.index);
	var target = cmd.substring(m.index + l.length, m.lastIndex - r.length);
	var right = cmd.substring(m.lastIndex);

	left = restoreString(left);
	target = restoreString(target);
	right = restoreString(right);

	var ret = internalCommand(target);

	if (ret.exec) {
		// コマンドのネスト
		cmd = left + l + ret.cmd + r + right;
	} else {
		var ret = util.execSync('cmd /c ' + target);
		var stdout = ret.StdOut.ReadAll().replace(/\r?\n/g, ' ').replace(/ $/, '');
		var stderr = ret.StdErr.ReadAll().replace(/\r?\n/g, ' ').replace(/ $/, '');
		if (ret.ExitCode != 0) {
			PPx.Echo('エラー発生!\n'
				+ 'command:' + target + "\n"
				+ 'StdOut:' + stdout + "\n"
				+ 'StdErr:' + stderr);
			PPx.Quit(-1);
		}
		cmd = left + stdout + right; // 対話モードへの対応はこっち
		//cmd = left + util.execSyncBackground(target)[0] + right; // 対話モードが不要ならこっち
	}

	return {
		'cmd': cmd,
		'exec': true
	};
}


var cmd = PPx.Arguments.item(0);
while (true) {
	// エイリアス/マクロ文字を展開、環境変数はそのまま
	while (true) {
		var exec = false;
		cmd = escapeEnv(cmd); // 環境変数をPPx.Extractの対象にならないように退避して

		if (cmd.match(/%/)) { // エイリアス/マクロ文字を展開
			cmd = PPx.Extract(cmd);
			exec = true;
		}

		cmd = restoreEnv(cmd); // 退避してた環境変数を戻す
		if (!exec) break;
	}

	var ret = internalCommand(cmd);
	cmd = ret.cmd;
	if (!ret.exec) break;
}

PPx.Result = cmd;
