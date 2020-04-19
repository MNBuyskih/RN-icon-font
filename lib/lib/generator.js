var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_1 = require("fs");
var glob_1 = __importDefault(require("glob"));
var path_1 = __importDefault(require("path"));
var util_1 = __importDefault(require("util"));
var webfonts_generator_1 = __importDefault(require("webfonts-generator"));
var asyncGlob = util_1["default"].promisify(glob_1["default"]);
var asyncGenerator = util_1["default"].promisify(webfonts_generator_1["default"]);
var CSS_PARSE_REGEX = /-(.*):before.*\r?\n\s*content: "(.*)"/gm;
var COMPONENT_TEMPLATE = "  #{ICON_NAME}({style}) {\n    const style = props.style;\n    const glyph = String.fromCharCode(parseInt(\"#{GLYPH}\", 16));\n    return <Text {...props} style={{...style, ...defaultStyle}}>{glyph}</Text>;\n  },";
var DEFINITION_TEMPLATE = "  export function #{ICON_NAME}(props: TextProps): JSX.Element;";
var Generator = /** @class */ (function () {
    function Generator(options) {
        this.options = options;
        this.outputPath = path_1["default"].resolve(this.options.output);
        this.name = this.options.name || "IconFont";
    }
    Generator.prototype.generate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fontGenerator, maps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generateFont()];
                    case 1:
                        fontGenerator = _a.sent();
                        return [4 /*yield*/, this.generateData(fontGenerator)];
                    case 2:
                        maps = _a.sent();
                        return [4 /*yield*/, this.generateComponents(maps)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.generateDefinitions(maps)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Generator.prototype.getSvgFiles = function () {
        return asyncGlob(this.options.svg);
    };
    Generator.prototype.generateFont = function () {
        return __awaiter(this, void 0, void 0, function () {
            var svgFiles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSvgFiles()];
                    case 1:
                        svgFiles = _a.sent();
                        return [2 /*return*/, asyncGenerator({
                                files: svgFiles,
                                dest: this.outputPath,
                                fontName: this.name,
                                css: false,
                                html: false,
                                types: ["ttf"]
                            })];
                }
            });
        });
    };
    Generator.prototype.generateData = function (fontGenerator) {
        return __awaiter(this, void 0, void 0, function () {
            var css, map;
            return __generator(this, function (_a) {
                css = fontGenerator.generateCss();
                map = {};
                css.replace(CSS_PARSE_REGEX, function (match, name, code) { return map[name] = code; });
                return [2 /*return*/, map];
            });
        });
    };
    Generator.prototype.generateComponents = function (maps) {
        return __awaiter(this, void 0, void 0, function () {
            var names, filePath, components, content;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        names = Object.keys(maps);
                        filePath = path_1["default"].resolve(this.outputPath, this.name + ".js");
                        components = names.map(function (name) {
                            return COMPONENT_TEMPLATE
                                .replace("#{FONT_NAME}", _this.name)
                                .replace("#{ICON_NAME}", _this.capitalize(name))
                                .replace("#{GLYPH}", maps[name].replace('\\', '0x'));
                        }).join("\n\n");
                        content = "import React from \"react\";\nimport {Text} from \"react-native\";\n\nconst defaultStyle = {\n  fontFamily: \"" + this.name + "\",\n};\n\nexport const " + this.name + " = {\n" + components + "\n}";
                        return [4 /*yield*/, fs_1.promises.writeFile(filePath, content)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Generator.prototype.generateDefinitions = function (maps) {
        return __awaiter(this, void 0, void 0, function () {
            var names, filePath, components, content;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        names = Object.keys(maps);
                        filePath = path_1["default"].resolve(this.outputPath, this.name + ".d.ts");
                        components = names.map(function (name) {
                            return DEFINITION_TEMPLATE
                                .replace("#{FONT_NAME}", _this.name)
                                .replace("#{ICON_NAME}", _this.capitalize(name))
                                .replace("#{GLYPH}", maps[name]);
                        }).join("\n\n");
                        content = "import {TextProps} from \"react-native\";\n\nexport namespace " + this.name + " {\n" + components + "\n}";
                        return [4 /*yield*/, fs_1.promises.writeFile(filePath, content)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Generator.prototype.capitalize = function (name) {
        return name[0].toUpperCase() + name.substr(1);
    };
    return Generator;
}());
exports.Generator = Generator;
