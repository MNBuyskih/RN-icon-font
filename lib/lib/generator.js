"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const webfonts_generator_1 = __importDefault(require("webfonts-generator"));
const asyncGlob = util_1.default.promisify(glob_1.default);
const asyncGenerator = util_1.default.promisify(webfonts_generator_1.default);
const CSS_PARSE_REGEX = /-(.*):before.*\r?\n\s*content: "(.*)"/gm;
const COMPONENT_TEMPLATE = `#{FONT_NAME}.#{ICON_NAME} = function ({style}) {
  return <Text style={{...style, ...defaultStyle}}>#{GLYPH}</Text>;
}`;
const DEFINITION_TEMPLATE = `  export function #{ICON_NAME}(props: {style: TextStyle}): JSX.Element;`;
class Generator {
    constructor(options) {
        this.options = options;
        this.outputPath = path_1.default.resolve(this.options.output);
        this.name = this.options.name || "IconFont";
    }
    generate() {
        return __awaiter(this, void 0, void 0, function* () {
            const fontGenerator = yield this.generateFont();
            const maps = yield this.generateData(fontGenerator);
            yield this.generateComponents(maps);
            yield this.generateDefinitions(maps);
        });
    }
    getSvgFiles() {
        return asyncGlob(this.options.svg);
    }
    generateFont() {
        return __awaiter(this, void 0, void 0, function* () {
            const svgFiles = yield this.getSvgFiles();
            return asyncGenerator({
                files: svgFiles,
                dest: this.outputPath,
                fontName: this.name,
                css: false,
                html: false,
                types: ["ttf"],
            });
        });
    }
    generateData(fontGenerator) {
        return __awaiter(this, void 0, void 0, function* () {
            const css = fontGenerator.generateCss();
            const map = {};
            css.replace(CSS_PARSE_REGEX, (match, name, code) => map[name] = code);
            return map;
        });
    }
    generateComponents(maps) {
        return __awaiter(this, void 0, void 0, function* () {
            const names = Object.keys(maps);
            const filePath = path_1.default.resolve(this.outputPath, this.name + ".jsx");
            const components = names.map(name => {
                return COMPONENT_TEMPLATE
                    .replace("#{FONT_NAME}", this.name)
                    .replace("#{ICON_NAME}", this.capitalize(name))
                    .replace("#{GLYPH}", maps[name]);
            }).join("\n\n");
            let content = `import React, {Text} from "react-native";

export const ${this.name} = {};
const defaultStyle = {
  fontFamily: ${this.name},
};

${components}
`;
            yield fs_1.promises.writeFile(filePath, content);
        });
    }
    generateDefinitions(maps) {
        return __awaiter(this, void 0, void 0, function* () {
            const names = Object.keys(maps);
            const filePath = path_1.default.resolve(this.outputPath, this.name + ".d.ts");
            const components = names.map(name => {
                return DEFINITION_TEMPLATE
                    .replace("#{FONT_NAME}", this.name)
                    .replace("#{ICON_NAME}", this.capitalize(name))
                    .replace("#{GLYPH}", maps[name]);
            }).join("\n\n");
            let content = `import {TextStyle} from "react-native";

export namespace ${this.name} {
${components}
}`;
            yield fs_1.promises.writeFile(filePath, content);
        });
    }
    capitalize(name) {
        return name[0].toUpperCase() + name.substr(1);
    }
}
exports.Generator = Generator;
