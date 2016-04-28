#!/usr/bin/ruby

while l = gets
  print $1 if /<em:version>(.+)<\/em:version>/ =~ l
end
