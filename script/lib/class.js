//!*script
// �N���X��`��Ԃ��ꍇ
// �����֐�����return����ƁA�Ǎ���ŕϐ��Ŏ󂯎���
(function() {
	function Class(name) {
		this.name = name; // �t�B�[���h
	}
	// �萔
	Class.prototype.VALUE = {A : 1, B : 2, C : 3};
	// ���\�b�h
	Class.prototype.say = function() {
		PPx.Echo("my name is " + this.nam);
	}
	return Class;
})();
