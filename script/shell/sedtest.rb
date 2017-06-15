#coding: utf-8

require 'kconv'

sedargfile = ARGV[0]
sedffile = ARGV[1]
sedarg = File.read(sedargfile)

while STDIN.gets
  a = NKF.nkf('-w', $_).split(':') # to utf8
  fmt = '%ss/%s/g'

  str = nil
  cmd = nil
  if a[1] =~ /^\d+$/ then
    farg = sprintf(fmt, a[1], sedarg)
    File.write(sedffile, farg)

    str = %Q(sed -E -f <<#{farg}>> #{a[0]} | sed -n #{a[1]}p)
    cmd = %Q(sed -E -f #{sedffile} #{a[0]} | sed -n #{a[1]}p)
  else
    farg = sprintf(fmt, '', sedarg)
    File.write(sedffile, farg)

    str = %Q(sed -E -f <<#{farg}>> #{a[0]})
    cmd = %Q(sed -E -f #{sedffile} #{a[0]})
  end

  puts "$ #{str}"
  system cmd
end
