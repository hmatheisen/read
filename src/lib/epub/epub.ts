import { type JSZipLoadOptions, loadAsync } from "jszip";

import Parser from "./parser";
import type { Rootfile } from "./types";

export type EpubFiles = { [key: string]: string };
export type Chapter = { id: string; content: string };

class Epub {
  readonly rootfile: Rootfile;
  readonly chapters: Array<Chapter>;

  private constructor(rootfile: Rootfile, chapters: Array<Chapter>) {
    this.rootfile = rootfile;
    this.chapters = chapters;
  }

  public static async fromUrl(url: string, options?: JSZipLoadOptions): Promise<Epub> {
    const res = await fetch(url);
    const bytes = await res.arrayBuffer();

    return this.fromBytes(bytes, options);
  }

  public static async fromBytes(bytes: ArrayBuffer, options?: JSZipLoadOptions): Promise<Epub> {
    const zip = await loadAsync(bytes, options);
    const parser = new Parser(zip);

    const rootfile = await parser.parseRootfile();
    const files = await parser.extractFiles(rootfile);
    const chapters = await parser.extractChapters(files, rootfile);

    return new Epub(rootfile, chapters);
  }
}

export default Epub;
