//! script

//
// �R�}���h���s���ʂ�Ԃ�(�R�}���h�u���Ή�)
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

// ���ϐ��̋L����u������
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


// �������u������
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


// �����̃R�}���h�����s���A���ʂւƒu��������
function internalCommand(_cmd) {
	// �������ޔ�
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

	// �����̃R�}���h�𔭌�
	var left = cmd.substring(0, m.index);
	var target = cmd.substring(m.index + l.length, m.lastIndex - r.length);
	var right = cmd.substring(m.lastIndex);

	left = restoreString(left);
	target = restoreString(target);
	right = restoreString(right);

	var ret = internalCommand(target);

	if (ret.exec) {
		// �R�}���h�̃l�X�g
		cmd = left + l + ret.cmd + r + right;
	} else {
		var ret = util.execSync('cmd /c ' + target);
		var stdout = ret.StdOut.ReadAll().replace(/\r?\n/g, ' ').replace(/ $/, '');
		var stderr = ret.StdErr.ReadAll().replace(/\r?\n/g, ' ').replace(/ $/, '');
		if (ret.ExitCode != 0) {
			PPx.Echo('�G���[����!\n'
				+ 'command:' + target + "\n"
				+ 'StdOut:' + stdout + "\n"
				+ 'StdErr:' + stderr);
			PPx.Quit(-1);
		}
		cmd = left + stdout + right; // �Θb���[�h�ւ̑Ή��͂�����
		//cmd = left + util.execSyncBackground(target)[0] + right; // �Θb���[�h���s�v�Ȃ炱����
	}

	return {
		'cmd': cmd,
		'exec': true
	};
}


var cmd = PPx.Arguments.item(0);
while (true) {
	// �G�C���A�X/�}�N��������W�J�A���ϐ��͂��̂܂�
	while (true) {
		var exec = false;
		cmd = escapeEnv(cmd); // ���ϐ���PPx.Extract�̑ΏۂɂȂ�Ȃ��悤�ɑޔ�����

		if (cmd.match(/%/)) { // �G�C���A�X/�}�N��������W�J
			cmd = PPx.Extract(cmd);
			exec = true;
		}

		cmd = restoreEnv(cmd); // �ޔ����Ă����ϐ���߂�
		if (!exec) break;
	}

	var ret = internalCommand(cmd);
	cmd = ret.cmd;
	if (!ret.exec) break;
}

PPx.Result = cmd;
