//!*script

// グローバル領域

function assert(b, str) {
	if (!b) {
		PPx.Echo(str);
		PPx.Quit(-1);
	}
}

function trim(str) {
	return str.replace(/(^[\s\r\n]+)|([\s\r\n]+$)/g, '');
}

///

(function() {
	// TODO : 収集つかなくなったら分割

	var o = {};

	var _insts = new Object();
	o.getWshShell = function() { return _insts.sh = _insts.sh || new ActiveXObject("WScript.Shell"); }
	o.getFs = function() { return _insts.fs = _insts.fs || new ActiveXObject("Scripting.FileSystemObject"); }

	// 同期実行
	o.execSync = function(cmd) {
		var oRet = o.getWshShell().Exec(cmd);
		while (oRet.Status == 0) PPx.Sleep(100);
		return oRet;
	}

	// コマンドプロンプトの出ないexecSync
	o.execSyncBackground = function(cmd) {
		// Runで実行し、結果をテキストでやりとりする
		var tmp_stdout = PPx.Extract("%'temp'" + '\\execsyncbackgroundstdout.tmp');
		var tmp_stderr = PPx.Extract("%'temp'" + '\\execsyncbackgroundstderr.tmp');

		o.getWshShell().Run('cmd /c ' + cmd + ' > ' + tmp_stdout + ' 2> ' + tmp_stderr, 0, true);

		var stdout, stderr;
		{
			var fs = o.getFs();
			var file_stdout = fs.OpenTextFile(tmp_stdout, 1);
			stdout = (!file_stdout.AtEndOfStream) ? file_stdout.ReadAll() : '';
			file_stdout.Close();

			var file_stderr = fs.OpenTextFile(tmp_stderr, 1);
			stderr = (!file_stderr.AtEndOfStream) ? file_stderr.ReadAll() : '';
			file_stderr.Close();
		}

		return [stdout, stderr];
	}

	// 現在のパスを取得
	// NOTE : ListFileの場合は実際のListFileファイルパスを取得する
	o.getCurrentPath = function() {
		return PPx.Extract('%FDV'); // NOTE : V:RealPath?(V無しの時にcinfo->RealPathを返すが意味が逆?)
	};

	// listfile名が履歴用と一致してるかどうか
	o.checkListFileName = function(base_listfile, history_listfile) {
		assert(base_listfile != "", "base_listfile is empty");
		assert(history_listfile != "", "history_listfile is empty");

		return history_listfile.replace(/[0-9]+$/g, "") == base_listfile;
	}
	// test
	{
		assert(o.checkListFileName("cin2listfile.tmp", "cin2listfile.tmp"),    "wrong 1");
		assert(o.checkListFileName("cin2listfile.tmp", "cin2listfile.tmp1"),   "wrong 2");
		assert(o.checkListFileName("cin2listfile.tmp", "cin2listfile.tmp2"),   "wrong 3");
		assert(!o.checkListFileName("cin2listfile.tmp", "cin2listfile.tmpXXX"), "wrong 4");
		assert(!o.checkListFileName("hoge_listfile.tmp", "wronglistfile.tmp"), "wrong 5");
	}

	///

	o.tryDeleteFile = function(fs, src) {
		if (fs.FileExists(src)) fs.DeleteFile(src);
	}

	o.tryMoveFile = function(fs, src, dest) {
		if (fs.FileExists(src)) fs.MoveFile(src, dest);
	}

	o.isSjisFile = function(fs, file) {
		var oNkf = o.execSyncBackground("nkf -g " + file);

		var stdout = trim(oNkf[0]);
		var stderr = trim(oNkf[1]);

		if (stderr != "") {
			PPx.Echo("isSjisFile error:" + stderr);
			return false;
		}

		return stdout == "Shift_JIS";
	}

	///

	// 独自の検索条件(MySearch)の内容を表示
	o.dispMySearch = function(fs, listfile) {
		var mysearch = false;
		var file = fs.OpenTextFile(listfile, 1);
		while (!file.AtEndOfStream) {
			var line = file.ReadLine();
			if (line.substring(0, 1) != ';') break;

			if (line.substring(0, ';MySearch'.length) == ';MySearch') {
				PPx.Execute('*linemessage ' + line);
				mysearch = true;
				break;
			}
		}
		if (!mysearch) PPx.Execute('*linemessage ;MySearch=*not found*');
		file.Close();
	}

	// 履歴の位置をラインメッセージで表現
	// ex) '< 4 < 3 < [2] < 1 <   S :'
	//     '    E 9 < [8] < 7 < 6 < :'
	//     '        E [9] < 8 < 7 < :'
	function _historyLineMessage(number, last_index, arrow) {
		function toMarkStr(idx) {
			return (idx > last_index) ? ' '
				: (idx == last_index) ? 'E'
				: (idx >= 0)          ? arrow
				: (idx == -1)         ? 'S'
				: ' ';
		}
		function toNoStr(idx) {
			return (idx > last_index) ? ' '
				: (idx > 0)           ? ('' + idx)
				: (idx == 0)          ? ' '
				: ' ';
		}

		return toMarkStr(number + 2) + ' ' + toNoStr(number + 2) + ' '
			+ toMarkStr(number + 1)  + ' ' + toNoStr(number + 1) + ' '
			+ toMarkStr(number)      + ' ' + '[' + toNoStr(number) + ']' + ' '
			+ toMarkStr(number - 1)  + ' ' + toNoStr(number - 1) + ' '
			+ toMarkStr(number - 2)  + ' ' + toNoStr(number - 2) + ' '
			+ toMarkStr(number - 3)  + ' ' + ':';
	}
	o.prevLineMessage = function(number, last_index) { return _historyLineMessage(number, last_index, '<'); }
	o.nextLineMessage = function(number, last_index) { return _historyLineMessage(number, last_index, '>'); }

	return o;
})();


