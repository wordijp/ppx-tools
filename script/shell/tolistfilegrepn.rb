# coding: utf-8
#
# grep -nの行単位の検索結果専用
#

require 'kconv'

def putsUtf8(str)
  puts NKF.nkf('-w', str)
end

putsUtf8 ";ListFile"
putsUtf8 ";Base=" + `cwd`
# Windows用バイナリのRubyならこちらでも良い
#putsUtf8 ";Base=" + Dir.pwd.gsub(/\//, '\\')

ARGV.each{|arg|
  putsUtf8 arg
}

while STDIN.gets
  begin
    # 複数の文字コードが混じってる一行を、utf8へ統一する
    # NOTE : 文字コードがsjisのファイルへのgrep -n結果は「utf8文字列:行数:sjis文字列」となっているため、
    #        分割して個別に文字コード変換する
    puts $_.split(':')
      .map(){|token| NKF.nkf('-w', token)}
      .join(':')
  rescue ArgumentError => e
    puts $_
  end
end
