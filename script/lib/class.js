//!*script
// クラス定義を返す場合
// 匿名関数内でreturnすると、読込先で変数で受け取れる
(function() {
	function Class(name) {
		this.name = name; // フィールド
	}
	// 定数
	Class.prototype.VALUE = {A : 1, B : 2, C : 3};
	// メソッド
	Class.prototype.say = function() {
		PPx.Echo("my name is " + this.nam);
	}
	return Class;
})();
