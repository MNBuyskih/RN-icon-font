#!/usr/bin/env node
exports.__esModule = true;
var commander_1 = require("commander");
var __1 = require("..");
commander_1.program
    .requiredOption("-s, --svg [pattern]", "glob pattern for svg files")
    .requiredOption("-o, --output [path]", "output directory")
    .option("-n, --fontName [string]", "output font name");
commander_1.program.parse(process.argv);
var generator = new __1.Generator({
    svg: commander_1.program.svg,
    output: commander_1.program.output,
    name: commander_1.program.fontName
});
generator.generate().then(function () {
    console.log("Icon font and components was generated");
    process.exit(0);
})["catch"](function (e) {
    console.error(e);
    process.exit(1);
});
