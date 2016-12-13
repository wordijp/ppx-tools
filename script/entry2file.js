//!*script

//
// エントリー一覧をfilepathへと書き出す
// 引数のサイズ制限の為に実行が複数へと分けられないようにするのに使用
//
// PPx.Arguments.item(0) : 対象のファイルパス
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

var filepath = PPx.Arguments.item(0);
if (filepath == '') {
    PPx.Echo('not found path');
    PPx.Quit(-1);
}

// エントリー一覧をファンクタへと渡す
function enumEntryName(callback) {
    for (var items = new Enumerator(PPx.Entry); !items.atEnd(); items.moveNext()) {
        callback(items.item().Name);
    }
}

// エントリー一覧の書き出し
// ListFileの場合
//file.WriteLine(";ListFile");
//file.WriteLine(";Base=" + PPx.Extract("%1") + "|1");
var fs = util.getFs();
var file = fs.OpenTextFile(filepath, 2, true);
enumEntryName(function (entryName) {
    file.WriteLine(entryName);
});
file.Close();
