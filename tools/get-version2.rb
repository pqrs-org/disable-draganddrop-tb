#!/usr/bin/ruby

while l = gets
  print Regexp.last_match(1) if /"version": "(.+)"/ =~ l
end
