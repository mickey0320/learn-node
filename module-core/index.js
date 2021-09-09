const path = require('path')
const vm = require('vm')

// 默认以process.cwd()为路径
console.log(path.resolve('a','b'))
// path.resolve如果遇到/，会回到根路径
console.log(path.resolve('a','b','/'))

console.log(path.join('a','b'))

console.log(path.extname('a.min.js'))

console.log(path.basename('a.js','.js'))
console.log(path.basename('a.js','s'))

console.log(path.relative('a/b/c/1.js','a'))

// 获取文件的目录名
console.log(path.dirname('a/b/c'))