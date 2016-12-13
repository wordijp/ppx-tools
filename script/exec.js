//! script

//
// コマンド実行結果を返す
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

var cmd = PPx.Arguments.item(0);
if (cmd == "") {
	result = "";
} else {
	result = util.execSyncBackground(cmd)[0];
}

PPx.Result = result;
