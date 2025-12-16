import { type JSZipLoadOptions, loadAsync } from "jszip";

import Parser from "./parser";
import type { Rootfile } from "./types";

export type EpubFiles = { [key: string]: string };

class Epub {
  readonly rootfile: Rootfile;
  private readonly files: EpubFiles;

  private constructor(rootfile: Rootfile, files: EpubFiles) {
    this.rootfile = rootfile;
    this.files = files;
  }

  public static async fromUrl(url: string, options?: JSZipLoadOptions): Promise<Epub> {
    const res = await fetch(url);
    const bytes = await res.arrayBuffer();

    const zip = await loadAsync(bytes, options);
    const parser = new Parser(zip);

    const rootfile = await parser.parseRootfile();
    const files = await parser.extractFiles(rootfile);

    return new Epub(rootfile, files);
  }

  public getFileContent = (filePath: string): string => this.files[filePath];
}

export default Epub;
