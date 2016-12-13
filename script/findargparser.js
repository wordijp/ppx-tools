//! script

//
// find�p�̈�����W�J����
// �Ǝ��I�v�V�������g����悤�ɂ���w���p�X�N���v�g
//
// PPx.Arguments.item(0) : �����I�v�V����
//
// usage)
//   -SEPname "*.cpp;*.h" ->
//     \( -name "*.cpp" -o -name "*.h" \)
//
//   -SEPname "cc:" ->
//     -SEPname "*.H;*.c;*.h" ->
//     \( -name "*.H" -o -name "*.c" -o -name "*.h" \)
//
//   -SEPname "cc:;h:" ->
//     -SEPname "*.H;*.c;*.h;*.h;*.hpp" ->
//     \( -name "*.H" -o -name "*.c" -o -name "*.h" -o -name "*.h" -o -name "*.hpp" \)


function argsJoin(args) {
	if (args.length == 0) return "";
	if (args.length == 1) return args[0];

	return '\\( ' + args.join(' -o ') + ' \\)';
}

///

// �Ǝ��I�v�V�������́A�t�@�C���^�C�v���X�g��W�J����
// NOTE : ripgrep��--type-list��^���Ă���
function preReplacePattern(pattern) {
	pattern = ';' + pattern; // �擪���Ȃ����A���/\Wxxx:/�ŒP��P�ʌ����ɂȂ�悤��
	// C/C++
	pattern = pattern.replace(/\Wcpp:/, ';*.C;*.H;*.cc;*.cpp;*.cxx;*.h;*.hh;*.hpp');
	pattern = pattern.replace(/\Wcc:/, ';*.H;*.c;*.h');
	pattern = pattern.replace(/\Wh:/, ';*.h;*.hpp');
	// JavaScript
	pattern = pattern.replace(/\Wjs:/, ';*.js;*.jsx;*.vue');
	// ���̑�
	// ...

	pattern = pattern.substring(1); // ';'����菜��
	//PPx.Echo(pattern);

	var m = pattern.match(/\w+:/);
	if (m) {
		PPx.Echo('�������̃t�@�C���p�^�[��������܂�\n>' + pattern.substring(m.index, m.lastIndex));
	}

	return pattern;
}

// �Ǝ��I�v�V�������I���W�i���֒u������
function sepReplaceInternal(str, sepstr, restr, origname) {
	var m2 = sepstr.match(/"[^\"]*"/);
	if (!m2) return str;

	var pattern = sepstr.substring(m2.index + 1, m2.lastIndex - 1);
	pattern = preReplacePattern(pattern);
	var patterns = pattern.split(';');

	var origs = [];
	for (var i = 0; i < patterns.length; i++) {
		if (patterns[i] != "") origs.push(origname +' "' + patterns[i] + '"');
	}
	return str.replace(new RegExp(restr), argsJoin(origs));
}
function sepReplace(str, sepname, origname) {
	var restr = sepname + ' "[^\"]*"';
	while (true) {
		var m = str.match(new RegExp(restr));
		if (!m) break;

		var sepstr = str.substring(m.index, m.lastIndex);
		str = sepReplaceInternal(str, sepstr, restr, origname);
	}

	return str;
}

///

var result;
var arg = PPx.Arguments.item(0);
if (arg == "") {
	result = "";
} else {
	// �Ǝ��I�v�V�����̓W�J
	arg = sepReplace(arg, '-SEPiname', '-iname');
	arg = sepReplace(arg, '-SEPname', '-name');
	//PPx.Echo(arg);

	result = arg;
}

PPx.Result = result;
