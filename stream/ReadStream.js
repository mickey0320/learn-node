const fs = require("fs");
const { EventEmitter } = require("events");

class ReadStream extends EventEmitter {
  constructor(path, options = {}) {
    super();
    this.path = path;
    this.flags = options.flags || "r";
    this.encoding = options.encoding || "utf8";
    this.emitClose = options.emitClose ?? true;
    this.start = options.start || 0;
    this.end = options.end;
    this.highWaterMark = options.highWaterMark || 64 * 1024;
    this.offset = this.start;
    this.flowing = false;

    this.open();
    this.on("newListener", (type) => {
      if (type === "data") {
        this.flowing = true;
        this.read();
      }
    });
  }
  pause = () => {
    this.flowing = false;
  };
  resume = () => {
    if (!this.flowing) {
      this.flowing = true;
      this.read();
    }
  };
  open = () => {
    fs.open(this.path, this.flags, (err, fd) => {
      this.fd = fd;
      this.emit("open", fd);
    });
  };
  read = () => {
    if (typeof this.fd !== "number") {
      this.once("open", () => {
        this.read();
      });
      return;
    }
    const readLength = this.end
      ? Math.min(this.highWaterMark, this.end - this.offset + 1)
      : this.highWaterMark;
    const buffer = Buffer.alloc(this.highWaterMark);
    fs.read(
      this.fd,
      buffer,
      0,
      readLength,
      this.offset,
      (err, readBytes) => {
        if (err) this.emit("error", err);
        if (readBytes) {
          this.emit("data", buffer.slice(0, readBytes));
          this.offset += readBytes;
          if (this.flowing) {
            this.read();
          }
        } else {
          this.destroy();
        }
      }
    );
  };
  destroy = () => {
    this.emit("end");
    if (this.emitClose) {
      this.emit("close");
    }
  };
}

module.exports = ReadStream;
