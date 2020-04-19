#!/usr/bin/env node

import {program} from "commander";
import {Generator} from "..";

program
  .requiredOption("-s, --svg [pattern]", "glob pattern for svg files")
  .requiredOption("-o, --output [path]", "output directory")
  .option("-n, --fontName [string]", "output font name")
;
program.parse(process.argv);

const generator = new Generator({
  svg: program.svg,
  output: program.output,
  name: program.fontName,
});

generator.generate().then(() => {
  console.log(`Icon font and components was generated`);
  process.exit(0);
}).catch((e: Error) => {
  console.error(e);
  process.exit(1);
});
