//!*script

//
// ListFileの履歴を進める
//
// PPx.Arguments.item(0) : 履歴用の基本ListFile
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

var fs = util.getFs();

var base_listfile = PPx.Arguments.item(0);
if (base_listfile == '') {
	PPx.Echo('not found listfile path');
	PPx.Quit(-1);
}

var history_listfile = util.getCurrentPath();
// listfile名が履歴用と一致してるかどうか
if (!util.checkListFileName(base_listfile, history_listfile)) {
	// 一致していない(= 履歴ListFileではない、通常のディレクトリ)
	// 履歴の最初へジャンプしておく
	history_listfile = base_listfile;
	if (fs.FileExists(base_listfile)) {
		PPx.Execute("%j" + base_listfile);
	}
}

var last_index = -1;
for (var i = 0; i < MAX_COUNT + 1; i++) {
	if (!fs.FileExists(base_listfile + ((i > 0) ? i : ""))) {
		break;
	}
	last_index = i;
}
if (last_index < 0) {
	var names = base_listfile.split(/[\\\/]/);
	PPx.Execute('*linemessage !"履歴ListFile(' + names[names.length - 1] + ')のindex取得に失敗');
	PPx.Quit(-1);
}

// 履歴番号を取得
var number = -999;
{
	var m = history_listfile.match(/[0-9]+$/);
	if (m) number = parseInt(history_listfile.substr(m.index));
}

// 進める
var success = false;
if (number > 0) {
	number--;

	var prev_listfile = base_listfile + ((number > 0) ? number : "");
	if (fs.FileExists(prev_listfile)) {
		PPx.Execute("%j" + prev_listfile);
		PPx.Execute('*linemessage !"' + util.nextLineMessage(number, last_index));
		util.dispMySearch(fs, prev_listfile);
		success = true;
	}
}

if (!success) PPx.Execute('*linemessage !"' + util.nextLineMessage(0, last_index) + 'ここまで');
