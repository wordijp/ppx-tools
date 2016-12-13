//! script

//
// find用の引数を展開する
// 独自オプションを使えるようにするヘルパスクリプト
//
// PPx.Arguments.item(0) : 検索オプション
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

// 独自オプション内の、ファイルタイプリストを展開する
// NOTE : ripgrepの--type-listを真似ている
function preReplacePattern(pattern) {
	pattern = ';' + pattern; // 先頭をなくし、常に/\Wxxx:/で単語単位検索になるように
	// C/C++
	pattern = pattern.replace(/\Wcpp:/, ';*.C;*.H;*.cc;*.cpp;*.cxx;*.h;*.hh;*.hpp');
	pattern = pattern.replace(/\Wcc:/, ';*.H;*.c;*.h');
	pattern = pattern.replace(/\Wh:/, ';*.h;*.hpp');
	// JavaScript
	pattern = pattern.replace(/\Wjs:/, ';*.js;*.jsx;*.vue');
	// その他
	// ...

	pattern = pattern.substring(1); // ';'を取り除く
	//PPx.Echo(pattern);

	var m = pattern.match(/\w+:/);
	if (m) {
		PPx.Echo('未実装のファイルパターンがあります\n>' + pattern.substring(m.index, m.lastIndex));
	}

	return pattern;
}

// 独自オプションをオリジナルへ置換する
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
	// 独自オプションの展開
	arg = sepReplace(arg, '-SEPiname', '-iname');
	arg = sepReplace(arg, '-SEPname', '-name');
	//PPx.Echo(arg);

	result = arg;
}

PPx.Result = result;
