//!*script

//
// LOADEVENT����
//

// ListFile�̏ꍇ
var VFSDT_LFILE = 4; // 4:ListFile

if (PPx.DirectoryType == VFSDT_LFILE) {
	// 19: �ǂݍ��ݏ��\�[�g
	PPx.Execute('*sortentry 19');
	// �^�u�F
	PPx.Execute('*pane color t,_BLA,_GRE');
} else {
	PPx.Execute('*pane color t,_AUTO,_AUTO');
	PPx.Execute('*viewstyle -temp "default"'); // �e���͈͂��L���̂ŗ~�����������L��
}

