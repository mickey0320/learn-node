const path = require("path");

const WriteStream = require("./WriteStream");
const ws = new WriteStream(path.resolve(__dirname, "./b.txt"), {
  highWaterMark: 3,
});
// const ws = require("fs").createWriteStream(path.resolve(__dirname, "./b.txt"), {
//     highWaterMark: 3,
// });
let i = 0;
function write() {
  let flag = true;
  while (i < 10 && flag) {
    flag = ws.write((i++).toString());
    console.log(flag);
  }
}
write()
ws.on("drain", () => {
  console.log("写完了");
  write();
});

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
