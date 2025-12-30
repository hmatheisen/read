import type JSZip from "jszip";
import type { JSZipObject } from "jszip";

import type { Chapter, EpubFiles } from "./epub";
import type { Item, ItemRef, Manifest, Metadata, Rootfile, Spine } from "./types";

class Parser {
  private readonly mimeTypePath = "mimetype";
  private readonly mimeType = "application/epub+zip";
  private readonly containerPath = "META-INF/container.xml";
  private readonly rootFileMediaType = "application/oebps-package+xml";
  private readonly xhtmlMediaType = "application/xhtml+xml";

  private readonly domParser = new DOMParser();
  private readonly xmlSerializer = new XMLSerializer();
  private readonly zip: JSZip;

  constructor(zip: JSZip) {
    this.zip = zip;
  }

  public async parseRootfile(): Promise<Rootfile> {
    await this.checkMimeType();

    const rootfileZipObject = await this.findRootFile();
    const rootfileContent = await rootfileZipObject.async("string");
    const rootfileXml = this.domParser.parseFromString(rootfileContent, "application/xml");

    const metadataEl = rootfileXml.querySelector("metadata");
    const manifestEl = rootfileXml.querySelector("manifest");
    const spineEl = rootfileXml.querySelector("spine");

    const rootfile: Rootfile = {
      name: rootfileZipObject.name,
      metadata: this.parseMetadata(metadataEl),
      manifest: this.parseManifest(manifestEl),
      spine: this.parseSpine(spineEl),
    };

    return rootfile;
  }

  public async extractFiles(rootfile: Rootfile): Promise<EpubFiles> {
    const tempFiles: Array<[Item, JSZipObject]> = [];

    rootfile.manifest.items.forEach((item) => {
      const zipObject = this.findFile(item.href, rootfile);

      tempFiles.push([item, zipObject]);
    });

    const files: EpubFiles = {};
    await Promise.all(
      tempFiles.map(async ([item, obj]) => {
        const content = await obj.async("string");

        if (item.mediaType === this.xhtmlMediaType) {
          files[item.href] = await this.parseChapter(content, rootfile);

          return;
        }

        files[item.href] = content;
      }),
    );

    return files;
  }

  public async extractChapters(files: EpubFiles, rootfile: Rootfile): Promise<Array<Chapter>> {
    const itemRefs = rootfile.spine.itemRefs;
    const idrefs = itemRefs.map((itemRefs) => itemRefs.idref);
    const items = idrefs.map((idref) => rootfile.manifest.items.find((item) => item.id === idref)!);

    return items.map((item) => ({ content: files[item.href] }));
  }

  private async parseChapter(content: string, rootfile: Rootfile): Promise<string> {
    const doc = this.domParser.parseFromString(content, "application/xhtml+xml");

    const links = doc.querySelectorAll("link");
    for (const link of links) {
      const stylesheetPath = link.getAttribute("href");
      const stylesheetBlob = await this.findFile(stylesheetPath!, rootfile).async("blob");
      const stylesheetUrl = URL.createObjectURL(stylesheetBlob);

      link.setAttribute("href", stylesheetUrl);
    }

    const images = doc.querySelectorAll("img");
    for (const img of images) {
      const imagePath = img.getAttribute("src");
      const imageBlob = await this.findFile(imagePath!, rootfile).async("blob");
      const imageUrl = URL.createObjectURL(imageBlob);

      img.setAttribute("src", imageUrl);
    }

    return this.xmlSerializer.serializeToString(doc);
  }

  private parseSpine(spineEl: Element | null): Spine {
    if (!spineEl) {
      throw new Error("spine element not found");
    }

    const itemRefs: Array<ItemRef> = [];

    spineEl.childNodes.forEach((node) => {
      if (node.nodeName !== "itemref") {
        return;
      }

      const itemref = node as Element;

      const idref = itemref.getAttribute("idref")!;
      const id = itemref.getAttribute("id");
      const linear = itemref.getAttribute("linear");
      const properties = itemref.getAttribute("properties");

      itemRefs.push({ idref, id, linear, properties });
    });

    return { itemRefs: itemRefs } as Spine;
  }

  private parseManifest(manifestEl: Element | null): Manifest {
    if (!manifestEl) {
      throw new Error("manifest element not found");
    }

    const items: Array<Item> = [];

    manifestEl.childNodes.forEach((node) => {
      if (node.nodeName !== "item") {
        return;
      }

      const item = node as Element;

      const href = item.getAttribute("href")!;
      const id = item.getAttribute("id")!;
      const mediaType = item.getAttribute("media-type")!;

      const fallback = item.getAttribute("fallback");
      const mediaOverlay = item.getAttribute("media-overlay");
      const properties = item.getAttribute("properties");

      items.push({ href, id, mediaType, fallback, mediaOverlay, properties });
    });

    return { items } as Manifest;
  }

  private parseMetadata(metadataEl: Element | null): Metadata {
    if (!metadataEl) {
      throw new Error("metadata element not found");
    }

    type Attributes = { [k: string]: string | null };
    const attributes: Attributes = {
      "dc:identifier": null,
      "dc:language": null,
      "dc:title": null,
      "dc:contributor": null,
      "dc:coverage": null,
      "dc:creator": null,
      "dc:date": null,
      "dc:description": null,
      "dc:format": null,
      "dc:publisher": null,
      "dc:relation": null,
      "dc:rights": null,
      "dc:source": null,
      "dc:subject": null,
      "dc:type": null,
    };

    metadataEl.childNodes.forEach((node) => {
      Object.keys(attributes).map((key) => {
        if (node.nodeName === key) {
          attributes[key] = node.textContent;

          return;
        }
      });
    });

    const mandatoryAttribtues = ["dc:identifier", "dc:language", "dc:title"];
    mandatoryAttribtues.forEach((attr) => {
      if (attributes[attr] === null) {
        throw new Error(`Mandatory attribute ${attr} is missing`);
      }
    });

    return {
      identifier: attributes["dc:identifier"],
      language: attributes["dc:language"],
      title: attributes["dc:title"],
      contributor: attributes["dc:contributor"],
      coverage: attributes["dc:coverage"],
      creator: attributes["dc:creator"],
      date: attributes["dc:date"],
      description: attributes["dc:description"],
      format: attributes["dc:format"],
      publisher: attributes["dc:publisher"],
      relation: attributes["dc:relation"],
      rights: attributes["dc:rights"],
      source: attributes["dc:source"],
      subject: attributes["dc:subject"],
      type: attributes["dc:type"],
    } as Metadata;
  }

  private async checkMimeType() {
    const file = this.findFile(this.mimeTypePath);

    const content = await file.async("string");
    if (content !== this.mimeType) {
      throw new Error("Mimetype is incorrect");
    }
  }

  private async findRootFile(): Promise<JSZipObject> {
    const file = this.findFile(this.containerPath);
    const content = await file.async("string");
    const doc = this.domParser.parseFromString(content, "application/xml");

    const element = doc.querySelector("rootfile");
    if (!element) {
      throw new Error("no rootfile found");
    }

    const mediaType = element.getAttribute("media-type");
    if (mediaType != this.rootFileMediaType) {
      throw new Error(`invalid rootfile media type: ${mediaType}`);
    }

    const rootfilePath = element.getAttribute("full-path");
    if (!rootfilePath) {
      throw new Error(`rootfile element has no 'full-path' attribute`);
    }
    const rootfile = this.findFile(rootfilePath);

    return rootfile;
  }

  private findFile(path: string, rootfile: Rootfile): JSZipObject;
  private findFile(path: string): JSZipObject;
  private findFile(path: string, rootfile?: Rootfile): JSZipObject {
    if (rootfile) {
      path = rootfile.name.split("/").slice(0, -1).join("/") + "/" + path;
    }

    const file = this.zip.file(path);
    if (!file) {
      throw new Error(`file not found: ${path}`);
    }

    return file!;
  }
}

export default Parser;
