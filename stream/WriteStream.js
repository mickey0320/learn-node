const fs = require("fs");
const { EventEmitter } = require("events");

class WriteStream extends EventEmitter {
  constructor(path, options) {
    super();
    this.path = path;
    this.flags = options.flags || "w";
    this.mode = options.mode || 0o666;
    this.highWaterMark = options.highWaterMark || 16 * 1024;
    this.start = options.start || 0;
    this.emitClose = options.emitClose || true;

    this.writing = false;
    this.offset = this.start;
    this.cache = [];
    this.length = 0;
    this.needDrain = false;

    this.open();
  }
  open = () => {
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
      this.fd = fd;
      if (err) this.emit("error", err);
      this.emit("open", fd);
    });
  };
  write = (data, encoding = "utf8", cb = () => {}) => {
    data = Buffer.isBuffer(data) ? data : Buffer.from(data);
    this.length += data.length;
    const returnValue = this.length < this.highWaterMark;
    this.needDrain = !returnValue;
    const userCb = cb;
    cb = () => {
      userCb();
      this.clearCache();
    };
    if (!this.writing) {
      this.writing = true;
      this._write(data, encoding, cb);
    } else {
      this.cache.push({
        data,
        encoding,
        cb,
      });
    }

    return returnValue;
  };
  _write = (data, encoding, cb) => {
    if (typeof this.fd !== "number") {
      this.once("open", () => {
        this._write(data, encoding, cb);
      });
      return;
    }
    fs.write(this.fd, data, 0, data.length, this.offset, (err, written) => {
      if (err) this.emit("error", err);
      this.offset += written;
      this.length -= written;
      cb();
    });
  };
  clearCache = () => {
    if (this.cache.length === 0) {
      this.writing = false;
      if (this.needDrain) {
        this.needDrain = false;
        this.emit("drain");
      }
    } else {
      const { data, encoding, cb } = this.cache.shift();
      this._write(data, encoding, cb);
    }
  }
}

module.exports = WriteStream;
