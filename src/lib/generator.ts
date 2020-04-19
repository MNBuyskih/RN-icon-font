import {promises as fs} from "fs";
import glob from "glob";
import path from "path";
import util from "util";
import generator from "webfonts-generator";

const asyncGlob = util.promisify(glob);
const asyncGenerator = util.promisify(generator);
const CSS_PARSE_REGEX = /-(.*):before.*\r?\n\s*content: "(.*)"/gm;
const COMPONENT_TEMPLATE = `  #{ICON_NAME}({style}) {
    const style = props.style;
    const glyph = String.fromCharCode(parseInt("#{GLYPH}", 16));
    return <Text {...props} style={{...style, ...defaultStyle}}>{glyph}</Text>;
  },`;
const DEFINITION_TEMPLATE = `  export function #{ICON_NAME}(props: TextProps): JSX.Element;`;

export interface IGeneratorOptions {
  svg: string;
  output: string;
  name?: string;
}

export class Generator {
  private options: IGeneratorOptions;
  private readonly outputPath: string;
  private readonly name: string;

  constructor(options: IGeneratorOptions) {
    this.options = options;
    this.outputPath = path.resolve(this.options.output);
    this.name = this.options.name || "IconFont";
  }

  async generate(): Promise<void> {
    const fontGenerator = await this.generateFont();
    const maps = await this.generateData(fontGenerator);
    await this.generateComponents(maps);
    await this.generateDefinitions(maps);
  }

  private getSvgFiles(): Promise<string[]> {
    return asyncGlob(this.options.svg);
  }

  private async generateFont(): Promise<generator.IResult> {
    const svgFiles = await this.getSvgFiles();

    return asyncGenerator({
      files: svgFiles,
      dest: this.outputPath,
      fontName: this.name,
      css: false,
      html: false,
      types: ["ttf"],
    });
  }

  private async generateData(fontGenerator: generator.IResult): Promise<Record<string, string>> {
    const css = fontGenerator.generateCss();
    const map: Record<string, string> = {};

    css.replace(CSS_PARSE_REGEX, (match, name, code) => map[name] = code);

    return map;
  }

  private async generateComponents(maps: Record<string, string>): Promise<void> {
    const names = Object.keys(maps);
    const filePath = path.resolve(this.outputPath, this.name + ".js");
    const components = names.map(name => {
      return COMPONENT_TEMPLATE
        .replace("#{FONT_NAME}", this.name)
        .replace("#{ICON_NAME}", this.capitalize(name))
        .replace("#{GLYPH}", maps[name].replace('\\', '0x'))
        ;
    }).join("\n\n");
    let content = `import React from "react";
import {Text} from "react-native";

const defaultStyle = {
  fontFamily: "${this.name}",
};

export const ${this.name} = {
${components}
}`;

    await fs.writeFile(filePath, content);
  }

  private async generateDefinitions(maps: Record<string, string>) {
    const names = Object.keys(maps);
    const filePath = path.resolve(this.outputPath, this.name + ".d.ts");
    const components = names.map(name => {
      return DEFINITION_TEMPLATE
        .replace("#{FONT_NAME}", this.name)
        .replace("#{ICON_NAME}", this.capitalize(name))
        .replace("#{GLYPH}", maps[name])
        ;
    }).join("\n\n");
    let content = `import {TextProps} from "react-native";

export namespace ${this.name} {
${components}
}`;

    await fs.writeFile(filePath, content);
  }

  private capitalize(name: string): string {
    return name[0].toUpperCase() + name.substr(1);
  }
}
