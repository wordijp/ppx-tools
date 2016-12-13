//!*script

//
// ListFile��1����o�b�N�A�b�v����A�ő�9����
// �����̃T�C�Y�����ׂ̈Ɏ��s�������ւƕ������Ȃ��悤�ɂ���̂Ɏg�p
//
// PPx.Arguments.item(0) : �Ώۂ�ListFile
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

// ListFile��1����o�b�N�A�b�v����
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

// �t�@�C���V�X�e���I�u�W�F�N�g�̍쐬
var fs = util.getFs();


var history_listfile = util.getCurrentPath();
if (!util.checkListFileName(base_listfile, history_listfile)) {
	// �V�K��ListFile��������ꍇ

	// ListFile�̏�������
	// �o�b�N�A�b�v����
	backupListFile(fs, base_listfile);
} else {
	// ListFile�ォ�痚�����X�V����ꍇ

	// �r���̗������폜����
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
		// XXX : ���ʂ�movefile������
		for (var dest_i = 0, src_i = find_i; src_i < MAX_COUNT; dest_i++, src_i++) {
			var src = base_listfile + ((src_i > 0) ? src_i : '');
			var dest = base_listfile + ((dest_i > 0) ? dest_i : '');
			util.tryMoveFile(fs, src, dest);
		}
	}
	backupListFile(fs, base_listfile);
}

