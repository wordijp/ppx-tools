//!*script
// Object�C���X�^���X��Ԃ��ꍇ

// �����ɏ����ƃO���[�o���ϐ��ɂȂ�
var g_value = "global string";

// �����֐�����return����ƁA�Ǎ���ŕϐ��Ŏ󂯎���
(function() {
	var o = {};
	o.say = function() {
		PPx.Echo("hello!");
	};
	o.value = 0;
	return o;
})();
