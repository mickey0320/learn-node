// crypto里包含着很多摘要算法(hash算法)和加密算法
// md5是摘要算法，不是加密算法
// 摘要算法的特点：
// 1. 不可逆
// 2. 相同的内容经过摘要算法结果是相同的，内容不同，摘要算法出来的内容肯定不同
// 3. 不同的内容经过摘要算法后的长度是一样的
const crypto = require("crypto");

const r1 = crypto.createHash("md5").update("abc").digest("base64");
// 内部会进行缓存，最要一次摘要
const r2 = crypto
  .createHash("md5")
  .update("a")
  .update("b")
  .update("c")
  .digest("base64");
console.log(r1 === r2);
const r3 = crypto.createHash("md5").update("abcxxx").digest("base64");
console.log(r3);

// 加盐
const r4 = crypto.createHmac("sha256", "yj").update("abc").digest("base64");
console.log(r4);
