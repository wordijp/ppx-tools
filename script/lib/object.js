//!*script
// Objectインスタンスを返す場合

// ここに書くとグローバル変数になる
var g_value = "global string";

// 匿名関数内でreturnすると、読込先で変数で受け取れる
(function() {
	var o = {};
	o.say = function() {
		PPx.Echo("hello!");
	};
	o.value = 0;
	return o;
})();
