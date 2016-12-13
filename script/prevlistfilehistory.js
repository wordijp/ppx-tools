//!*script

//
// ListFileの履歴を巻き戻す
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
		PPx.Execute("%j" + base_listfile); // XXX : prevがある時、ここのジャンプが無駄になる
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
var number = 0;
{
	var m = history_listfile.match(/[0-9]+$/);
	if (m) number = parseInt(history_listfile.substr(m.index));
}

// 巻き戻す
var success = false;
if (number < MAX_COUNT) {
	number++;

	var next_listfile = base_listfile + number;
	if (fs.FileExists(next_listfile)) {
		PPx.Execute("%j" + next_listfile);
		PPx.Execute('*linemessage !"' + util.prevLineMessage(number, last_index));
		util.dispMySearch(fs, next_listfile);
		success = true;
	}
}

if (!success) PPx.Execute('*linemessage !"' + util.prevLineMessage(last_index, last_index) + 'ここまで');
