//!*script

//
// �G���g���[�ꗗ��filepath�ւƏ����o��
// �����̃T�C�Y�����ׂ̈Ɏ��s�������ւƕ������Ȃ��悤�ɂ���̂Ɏg�p
//
// PPx.Arguments.item(0) : �Ώۂ̃t�@�C���p�X
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

// �G���g���[�ꗗ���t�@���N�^�ւƓn��
function enumEntryName(callback) {
    for (var items = new Enumerator(PPx.Entry); !items.atEnd(); items.moveNext()) {
        callback(items.item().Name);
    }
}

// �G���g���[�ꗗ�̏����o��
// ListFile�̏ꍇ
//file.WriteLine(";ListFile");
//file.WriteLine(";Base=" + PPx.Extract("%1") + "|1");
var fs = util.getFs();
var file = fs.OpenTextFile(filepath, 2, true);
enumEntryName(function (entryName) {
    file.WriteLine(entryName);
});
file.Close();
