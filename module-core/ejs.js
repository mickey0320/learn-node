const fs = require("fs");
const path = require("path");

const ejs = {
  //   async renderFile(file, data) {
  //     let content = await fs.readFileSync(file, "utf-8");
  //     content = content.replace(/<%=(.+?)%>/g, function (...args) {
  //       return data[args[1]];
  //     });

  //     return content;
  //   },
  async renderFile(file, data) {
    let content = await fs.readFileSync(file, "utf-8");
    let head = "let str = ''\nwith(data){\nstr+=`";
    let body = "";
    let footer = "";
    body = content = content.replace(/<%=(.+?)%>/g, function (...args) {
      return "${" + args[1] + "}";
    });
    body = content.replace(/<%(.+?)%>/g, function (...args) {
      return "`\n" + args[1] + "\nstr+=`";
    });

    footer += "`\n}\nreturn str";

    const fnBody = head + body + footer;
    const fn = new Function("data", fnBody);

    return fn(data);
  },
};

(async function () {
  const content = await ejs.renderFile(
    path.resolve(__dirname, "template.html"),
    {
      arr: [1, 2, 3],
    }
  );
    console.log(content);
})();

module.exports = ejs;
