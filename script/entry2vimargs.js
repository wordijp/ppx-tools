//!script

//
// �G���g���[��vim�p�̋N�������ւƕϊ�����
//
// �]���̃p�X�݂̂̑��ɁA�s�ԍ��t����grep�������ʂɂ��Ή�
// * �s�ԍ��t����grep�������ʂ̏ꍇ
//   �p�X:�s�ԍ�:���e -> �p�X +�s�ԍ�
//

function getPath(str) {
	return str.split(/\:[^\\]/)[0];
}

function getLineNumber(str) {
	var m = str.match(/:\d+:/);
	if (!m) return null;

	return parseInt(str.substring(m.index + 1, m.lastIndex - 1));
}

///

var line_path = (function() {
	var args = PPx.Arguments.item(0);
	if (('' + args) == "") {
		// �L�����Z��
		PPx.Quit(-1);
	}
	if (arg == "") {
		PPx.Echo('arg is empty');
		PPx.Quit(-1);
	}

	return [getLineNumber(arg), getPath(arg)];
})();

var args = [];
if (line_path[0] != null) args.push('+' + line_path[0]);
args.push(line_path[1]);

PPx.Result = args.join(' ');
