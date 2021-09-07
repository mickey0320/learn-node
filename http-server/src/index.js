const http = require("http");
const chalk = require("chalk");
const url = require("url");
const path = require("path");
const fs = require("fs").promises;
const { createReadStream, readFileSync } = require("fs");
const ejs = require("ejs");
const mime = require("mime");
const crypto = require("crypto");

const util = require("./util");

const template = readFileSync(
  path.resolve(__dirname, "./template.ejs"),
  "utf-8"
);

class Server {
  constructor(options) {
    this.port = options.port;
    this.directory = options.directory;
    this.cache = options.cache;
    this.gzip = options.gzip;
  }
  cache(req, res, requestFile, statObj) {
    res.setHeader("Cache-Control", "max-age=10");
    res.setHeader("Expires", new Date(Date.now() + 10 * 1000)).toUTCString();
    const ifModifiedSine = req.headers["if-modified-since"];
    // 有可能时间一样，但内容不一样，所以要走接下来的etag逻辑
    if (ifModifiedSine !== statObj.ctime.toUTCString()) {
      return false;
    }
    const ifNoneMatch = req.headers["if-none-match"];
    const content = fs.readFileSync(requestFile);
    const etag = crypto.createHash("md5").update(content).digest("base64");
    if (etag !== ifNoneMatch) {
      return false;
    }

    return true;
  }
  sendFile(req, res, requestFile, statObj) {
    if (this.cache(req, res, requestFile, statObj)) {
      res.statusCode = 304;
      res.end();
    } else {
      res.setHeader(
        "Content-Type",
        `${mime.getType(requestFile)};charset=utf-8`
      );
      createReadStream(requestFile).pipe(res);
    }
  }
  sendError(res, err) {
    res.statusCode = 404;
    res.end();
  }
  async handleRequest(req, res) {
    const { pathname } = url.parse(req.url);
    const requestFile = path.join(this.directory, pathname);
    try {
      const stat = await fs.stat(requestFile);
      if (stat.isDirectory()) {
        const dirs = await fs.readdir(requestFile);
        const html = await ejs.render(template, {
          dirs: dirs.map((dir) => ({
            name: dir,
            href: `${pathname}/${dir}`,
          })),
        });
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        res.end(html);
      } else {
        this.sendFile(req, res, requestFile, stat);
      }
    } catch (err) {
      this.sendError(res, err);
    }
  }
  start() {
    const server = http.createServer(this.handleRequest.bind(this));
    server.listen(this.port, () => {
      console.log(chalk.yellow("Starting up http-server, serving ./"));
      console.log(chalk.yellow("Available on:"));
      console.log(
        `http://` + util.getIp().address + `:${chalk.green(this.port)}`
      );
      console.log(`http://127.0.0.1:${chalk.green(this.port)}`);
    });
    server.on("error", (err) => {
      if (err.errno === "EADDRINUSE") {
        server.listen(++this.port);
      }
    });
  }
}
console.log(process.cwd());
console.log(require("path").resolve(__dirname));
module.exports = Server;
