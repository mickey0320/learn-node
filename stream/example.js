const path = require("path");

const ReadStream = require("./ReadStream");

const rs = new ReadStream(path.resolve(__dirname, "a.txt"), {
  highWaterMark: 3,
  end: 4
});

rs.on("open", (fd) => {
  console.log("open:" + fd);
});

rs.on("close", () => {
  console.log("close");
});

rs.on("data", (chunk) => {
  console.log("data:" + chunk);
});

rs.on("error", () => {
  console.log("error");
});

rs.on("end", () => {
  console.log("end");
});
