var fs = require('fs')

//创建可读写流

var write = fs.createWriteStream('./demo.txt')

var _b = Buffer.alloc(2)

write.write('123')
write.write('456')

write.end()

