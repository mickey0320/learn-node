const fs = require("fs");
const path = require("path");

const ejs = {
//   async render(file, data) {
//     let content = await fs.readFileSync(file, "utf-8");
//     content = content.replace(/<%=(.+?)%>/g, function (...args) {
//       return data[args[1]];
//     });

//     return content;
//   },
async render(file, data){}
};

(async function () {
  const content = await ejs.render(path.resolve(__dirname, "template.html"), {
    name: "yj",
    age: 25,
  });
  console.log(content);
})();

module.exports = ejs;
