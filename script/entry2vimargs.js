//!script

//
// エントリーをvim用の起動引数へと変換する
//
// 従来のパスのみの他に、行番号付きのgrep検索結果にも対応
// * 行番号付きのgrep検索結果の場合
//   パス:行番号:内容 -> パス +行番号
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
		// キャンセル
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
