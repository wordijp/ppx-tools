//!*script

//
// LOADEVENT処理
//

// ListFileの場合
var VFSDT_LFILE = 4; // 4:ListFile

if (PPx.DirectoryType == VFSDT_LFILE) {
	// 19: 読み込み順ソート
	PPx.Execute('*sortentry 19');
	// タブ色
	PPx.Execute('*pane color t,_BLA,_GRE');
} else {
	PPx.Execute('*pane color t,_AUTO,_AUTO');
	PPx.Execute('*viewstyle -temp "default"'); // 影響範囲が広いので欲しい時だけ有効
}

