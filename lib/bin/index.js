"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const __1 = require("..");
commander_1.program
    .requiredOption("-s, --svg [pattern]", "glob pattern for svg files")
    .requiredOption("-o, --output [path]", "output directory")
    .option("-n, --fontName [string]", "output font name");
commander_1.program.parse(process.argv);
const generator = new __1.Generator({
    svg: commander_1.program.svg,
    output: commander_1.program.output,
    name: commander_1.program.fontName,
});
generator.generate().then(() => {
    console.log(`Icon font and components was generated`);
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
