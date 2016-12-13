//!*script

//
// ListFileを1世代バックアップする、最大9世代
// 引数のサイズ制限の為に実行が複数へと分けられないようにするのに使用
//
// PPx.Arguments.item(0) : 対象のListFile
//

function _read(file) {
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var cwd = fs.GetParentFolderName(PPx.ScriptFullName);
	var fullpath = cwd + '\\' + file;
	if (!fs.FileExists(fullpath)) { PPx.Echo('* file not found:' + file); PPx.Quit(-1); }
	var f = fs.OpenTextFile(fullpath, 1);
	try { return f.ReadAll(); } finally { f.Close(); }
}

eval(_read('./config.js'));
var util = eval(_read('./lib/util.js'));

///

// ListFileを1世代バックアップする
function backupListFile(fs, listfile) {
	util.tryDeleteFile(fs, listfile + MAX_COUNT);
	for (var i = MAX_COUNT - 1; i > 0; i--) {
		util.tryMoveFile(fs, listfile + i, listfile + (i + 1));
	}
	util.tryMoveFile(fs, listfile, listfile + 1);
}

///

var base_listfile = PPx.Arguments.item(0);
if (base_listfile == '') {
	PPx.Echo('not found listfile path');
	PPx.Quit(-1);
}

// ファイルシステムオブジェクトの作成
var fs = util.getFs();


var history_listfile = util.getCurrentPath();
if (!util.checkListFileName(base_listfile, history_listfile)) {
	// 新規にListFileを作った場合

	// ListFileの書き込み
	// バックアップする
	backupListFile(fs, base_listfile);
} else {
	// ListFile上から履歴を更新する場合

	// 途中の履歴を削除する
	var find_i = -1;
	for (var i = 0; i < MAX_COUNT; i++) {
		if (i > 0) {
			var prev_listfile = base_listfile + ((i - 1 > 0) ? (i - 1) : '');
			util.tryDeleteFile(fs, prev_listfile);
		}

		var listfile = base_listfile + ((i > 0) ? i : '');
		if (listfile == history_listfile) {
			find_i = i;
			break;
		}
	}
	if (find_i > 0) {
		// XXX : 無駄なmovefileがある
		for (var dest_i = 0, src_i = find_i; src_i < MAX_COUNT; dest_i++, src_i++) {
			var src = base_listfile + ((src_i > 0) ? src_i : '');
			var dest = base_listfile + ((dest_i > 0) ? dest_i : '');
			util.tryMoveFile(fs, src, dest);
		}
	}
	backupListFile(fs, base_listfile);
}

