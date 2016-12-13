//!*script

//
// ファイル操作系のラッパー
// TODO : 必要になったら作る
//

(function() {
	// Fileクラス
	function File(name) {
		this.name = name;
	}
	
	// アクセスモード定数
	File.prototype.MODE = {
		R : 1,
		W : 2,
		RW: 3,
		A : 4
	};
//	
//	File.prototype._stream = (function() {
//		var stream = new ActiveXObject("ADODB.Stream");
//		stream.Charset = "UTF-8";
//	})();
//
//	
	File.prototype.say = function() {
		PPx.Echo("file name:" + this.nae);
	}

	return File;
})();
