const path = require("path");

const WriteStream = require('./WriteStream')
const ws = new WriteStream(path.resolve(__dirname, "./b.txt"), {
  highWaterMark: 3
});
// const ws = require("fs").createWriteStream(path.resolve(__dirname, "./b.txt"), {
//     highWaterMark: 3
// });
console.log(ws.write('1'))
console.log(ws.write('1'))
console.log(ws.write('1'))
console.log(ws.write('1'))

// const ReadStream = require("./ReadStream");

// const rs = new ReadStream(path.resolve(__dirname, "a.txt"), {
//   highWaterMark: 3,
//   end: 4
// });

// rs.on("open", (fd) => {
//   console.log("open:" + fd);
// });

// rs.on("close", () => {
//   console.log("close");
// });

// rs.on("data", (chunk) => {
//   console.log("data:" + chunk);
// });

// rs.on("error", () => {
//   console.log("error");
// });

// rs.on("end", () => {
//   console.log("end");
// });
