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

  public getFileContent(filePath: string): string {
    return this.files[filePath];
  }
}

// const chapter1 = async () => {
//   const res = await fetch(epub);
//   const bytes = await res.arrayBuffer();
//   const zip = await loadAsync(bytes);

//   const chapter1 = zip.files["OPS/chapter_001.xhtml"];
//   const content = await chapter1.async("string");

//   const parser = new DOMParser();
//   const doc = parser.parseFromString(content, "application/xhtml+xml");

//   const links = doc.querySelectorAll("link");
//   for (const link of links) {
//     const stylesheetPath = link.getAttribute("href");
//     const stylesheetBlob = await zip.files[`OPS/${stylesheetPath}`].async("blob");
//     const stylesheetUrl = URL.createObjectURL(stylesheetBlob);

//     link.setAttribute("href", stylesheetUrl);
//   }

//   const images = doc.querySelectorAll("img");
//   for (const img of images) {
//     const imagePath = img.getAttribute("src");
//     const imageBlob = await zip.files[`OPS/${imagePath}`].async("blob");
//     const imageUrl = URL.createObjectURL(imageBlob);

//     img.setAttribute("src", imageUrl);
//   }

//   const serializer = new XMLSerializer();
//   return serializer.serializeToString(doc);
// };

export { Epub };
