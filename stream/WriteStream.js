const fs = require("fs");
const { EventEmitter } = require("events");

class WriteStream extends EventEmitter {
  constructor(path, options) {
    super();
    this.path = path;
    this.flags = options.flags || "w";
    this.mode = options.mode || 0x666;
    this.highWaterMark = options.highWaterMark || 16 * 1024;
    this.start = options.start || 0;

    this.writing = false;
    this.offset = this.start;
    this.cache = [];
    this.length = 0

    this.open();
  }
  open = () => {
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
      this.fd = fd;
      if (err) this.emit("error", err);
      this.emit("open", fd);
    });
  };
  write = (data, encoding = 'utf8', cb = () => {}) => {
    if (typeof this.fd !== "number") {
      this.once("open", () => {
        this.write(data, encoding, cb);
      });
    }
    data = Buffer.isBuffer(data) ? data : Buffer.from(data);
    this.length += data.length
    const returnValue = this.length < this.highWaterMark

    // if (!this.writing) {
    //   this.writing = true;
    //   fs.write(this.fd, data, 0, data.length, this.offset, (err, written) => {
    //     if (err) this.emit("error", err);
    //   });
    // } else {
    //   this.cache.push({
    //     data,
    //     encoding,
    //     cb,
    //   });
    // }

    return returnValue
  };
  _write = (data) => {};
}

module.exports = WriteStream;
