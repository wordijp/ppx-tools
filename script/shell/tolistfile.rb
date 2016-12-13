# coding: utf-8
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
  putsUtf8 $_
end
