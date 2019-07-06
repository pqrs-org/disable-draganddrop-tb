#!/usr/bin/ruby

while l = gets
  print Regexp.last_match(1) if /<em:version>(.+)<\/em:version>/ =~ l
end
