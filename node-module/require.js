const path = require("path");
const fs = require("fs");
const vm = require("vm");

function Module(id) {
  this.id = id;
}
Module._extention = {
  ".js"(module) {
    const script = fs.readFileSync(module.id, "utf-8");
    const code = `(function(module,exports,req,__dirname,__filename){${script}})`;
    const fn = vm.runInThisContext(code);
    const dirname = path.dirname(module.id);
    const filename = module.id;
    fn.call(module.exports, module, module.exports, req, dirname, filename);
  },
  ".json"(module) {
    const content = fs.readFileSync(module.id, "utf-8");

    module.exports = JSON.parse(content);
  },
};
Module._resolveFilename = function (filename) {
  const filepath = path.resolve(__dirname, filename);
  if (fs.existsSync(filepath)) return filepath;
  const keys = Object.keys(Module._extention);
  for (let i = 0; i < keys.length; i++) {
    if (fs.existsSync(filepath + keys[i])) {
      return filepath + keys[i];
    }
  }

  throw new Error("模块没找到~");
};
Module._cache = {};
Module.prototype.load = function () {
  const extname = path.extname(this.id);
  Module._extention[extname](this);
};
function req(filename) {
  filename = Module._resolveFilename(filename);
  if (Module._cache[filename]) {
    return Module._cache[filename].exports;
  }
  const module = new Module(filename);
  Module._cache[filename] = module;
  module.load();

  return module.exports;
}

const x = req("./b.js");
console.log(x);
