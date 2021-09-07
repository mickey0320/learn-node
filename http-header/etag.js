const http = require("http");
const path = require("path");
const fs = require("fs");
const url = require("url");
const mime = require("mime");
const crypto = require("crypto");

const staticPath = path.resolve(__dirname, "public");

const server = http.createServer(async (req, res) => {
  console.log(req.url);
  const { pathname } = url.parse(req.url, true);
  const requestFile = path.join(staticPath, pathname);
  try {
    const statObj = await fs.statSync(requestFile);
    if (statObj.isFile()) {
      res.setHeader("Cache-Control", "max-age=10");
      const content = fs.readFileSync(requestFile);
      const etag = crypto.createHash("md5").update(content).digest("base64");
      const ifNoneMatch = req.headers["if-none-match"];
      if (etag === ifNoneMatch) {
        res.statusCode = 304;
        res.end();
      } else {
        res.setHeader("etag", etag);
        res.setHeader(
          "Content-Type",
          mime.getType(requestFile) + ";charset=utf-8"
        );
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
