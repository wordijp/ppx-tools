# coding: utf-8
require 'kconv'

while STDIN.gets
  puts NKF.nkf('-w', $_)
end
