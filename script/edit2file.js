//!*script

//
// 範囲編集内容をファイルへ書き出す
//
// PPx.Arguments.item(0) : 保存ファイル
// PPx.Arguments.item(1) : message
// PPx.Arguments.item(2) : edit
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

var savefile = PPx.Arguments.item(0);
if (savefile == '') {
	PPx.Echo('not found savefile');
	PPx.Quit(-1);
}
var message = PPx.Arguments.item(1);
if (message == '') {
	PPx.Echo('not found message');
	PPx.Quit(-1);
}
var edit = PPx.Arguments.item(2);
if (edit == '') {
	PPx.Echo('not found edit');
	PPx.Quit(-1);
}

var cmd = PPx.Extract('%"'+message+'"%{'+edit+'%}');
if (cmd == '') {
	PPx.Quit(-1);
}

var f = util.getFs().OpenTextFile(savefile, 2, true);
f.Write(cmd);
f.Close();
