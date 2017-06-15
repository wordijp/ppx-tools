#coding: utf-8

sedargfile = ARGV[0]
sedffile = ARGV[1]
sedarg = File.read(sedargfile)

while STDIN.gets
  a = $_.split(':')
  fmt = '%ss/%s/g'

  str = nil
  cmd = nil
  if a[1] =~ /^\d+$/ then
    farg = sprintf(fmt, a[1], sedarg)
    File.write(sedffile, farg)

    str = %Q(sed -i -E -f <<#{farg}>> #{a[0]})
    cmd = %Q(sed -i -E -f #{sedffile} #{a[0]})
  else
    farg = sprintf(fmt, '', sedarg)
    File.write(sedffile, farg)

    str = %Q(sed -i -E -f <<#{farg}>> #{a[0]})
    cmd = %Q(sed -i -E -f #{sedffile} #{a[0]})
  end

  puts "$ #{str}"
  system cmd
end
