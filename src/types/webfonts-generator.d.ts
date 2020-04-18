type FontTypes = "svg" | "ttf" | "woff" | "woff2" | "eot";

interface IOptions {
  /**
   * List of SVG files.
   */
  files: string[];

  /**
   * Directory for generated font files.
   */
  dest: string;

  /**
   * Default: 'iconfont'
   * Name of font and base name of font files.
   */
  fontName?: string

  /**
   * Default: true
   * Whether to generate CSS file.
   */
  css?: boolean

  /**
   * Default: false
   * Whether to generate HTML preview.
   */
  html?: boolean

  /**
   * Default: ['woff2', 'woff', 'eot']
   * Font file types to generate. Possible values: svg, ttf, woff, woff2, eot.
   */
  types?: FontTypes[]

  /**
   * Default: basename of file
   * Function that takes path of file and return name of icon.
   */
  rename?: (fileName: string) => string

  /**
   * Default: 0xF101
   * Starting codepoint. Defaults to beginning of unicode private area.
   */
  startCodepoint?: number

  /**
   * Specific codepoints for certain icons. Icons without codepoints will have codepoints incremented from startCodepoint skipping duplicates.
   */
  codepoints?: Record<string, number>

  normalize?: boolean;
  fontHeight?: number;
  round?: boolean;
  descent?: boolean

  /**
   * Default: true
   */
  writeFiles?: boolean
}

declare function webfont(options: IOptions, done: (error: Error | null, result: webfont.IResult) => void): void;

declare namespace webfont {
  interface IResult {
    generateCss: (urls?: string[]) => string;
  }
}

declare module "webfonts-generator" {
  export = webfont;
}
