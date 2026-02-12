import { type JSZipLoadOptions, loadAsync } from "jszip";
import * as p from "path";

import Parser from "./parser";
import type { Rootfile } from "./types";

export type EpubFiles = { [key: string]: string };
export type Chapter = { id: string; content: string; href: string };
export type TOC = {
  type: "nav" | "ncx";
  document: Document;
};

class Epub {
  readonly rootfile: Rootfile;
  readonly chapters: Array<Chapter>;

  private readonly toc: TOC;

  private constructor(rootfile: Rootfile, chapters: Array<Chapter>, toc: TOC) {
    this.rootfile = rootfile;
    this.chapters = chapters;
    this.toc = toc;
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
    const toc = parser.findTocDocument(files, rootfile);
    const chapters = await parser.extractChapters(files, rootfile);

    return new Epub(rootfile, chapters, toc);
  }

  public findChapterTitle(chapter: Chapter): string | null {
    switch (this.toc.type) {
      case "nav":
        return this.findChapterTitleNav(chapter);
      case "ncx":
        return this.findChapterTitleNcx(chapter);
      default:
        console.warn("Unkonwn TOC type: ", this.toc.type);
        return null;
    }
  }

  private findChapterTitleNav(chapter: Chapter): string | null {
    const href = chapter.href;
    const anchors = this.toc.document.querySelectorAll("a");

    const chapterAnchor = Array.from(anchors).find(
      anchor => p.basename(anchor.getAttribute("href")!) === p.basename(href),
    );

    return chapterAnchor?.textContent || null;
  }

  private findChapterTitleNcx(chapter: Chapter): string | null {
    const href = chapter.href;
    const contents = this.toc.document.querySelectorAll("content");

    const chapterContent = Array.from(contents).find(
      content => p.basename(content.getAttribute("src")!) === p.basename(href),
    );
    const navPoint = chapterContent?.parentElement;
    const text = navPoint?.querySelector("text");

    return text?.textContent || null;
  }

  public get title() {
    return this.rootfile.metadata.title;
  }
}

export default Epub;
