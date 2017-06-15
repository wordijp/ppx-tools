#coding: utf-8

sedargfile = ARGV[0]
sedarg = File.read(sedargfile)

while STDIN.gets
  a = $_.split(':')
  fmt = %Q(sed -i -E "%ss/#{sedarg}/g" %s)

  if a[1] =~ /^\d+$/ then
    cmd = sprintf(fmt, a[1], a[0])
    puts '$ ' + cmd
    system cmd
  else
    cmd = sprintf(fmt, '', a[0])
    puts '$ ' + cmd
    system cmd
  end
end
