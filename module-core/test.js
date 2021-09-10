const ejs = require("ejs");
const path = require("path");

(async function () {
  const content = await ejs.renderFile(
    path.resolve(__dirname, "template.html"),
    {
      arr: [1, 2, 3],
    }
  );

  console.log(content);
})();
