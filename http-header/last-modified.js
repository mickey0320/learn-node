const http = require("http");
const path = require("path");
const fs = require("fs");
const url = require("url");
const mime = require("mime");

const staticPath = path.resolve(__dirname, "public");

const server = http.createServer(async (req, res) => {
  console.log(req.url);
  const { pathname } = url.parse(req.url, true);
  const requestFile = path.join(staticPath, pathname);
  try {
    const statObj = await fs.statSync(requestFile);
    if (statObj.isFile()) {
      res.setHeader("Cache-Control", "max-age=10");
      const ifModifiedSince = req.headers["if-modified-since"];
      const ctime = statObj.ctime;
      if (ifModifiedSince === ctime.toUTCString()) {
        res.statusCode = 304;
        res.end();
      } else {
        res.setHeader(
          "Content-Type",
          mime.getType(requestFile) + ";charset=utf-8"
        );
        res.setHeader("last-modified", ctime.toUTCString());
        fs.createReadStream(requestFile).pipe(res);
      }
    } else {
      try {
        const indexPath = await fs.accessSync(
          path.join(requestFile, "index.html")
        );
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        fs.createReadStream(indexPath).pipe(res);
      } catch {
        res.statusCode = 404;
        res.end("NOT FOUND");
      }
    }
  } catch {
    res.statusCode = 404;
    res.end("NOT FOUND");
  }
});

server.listen(3000);
