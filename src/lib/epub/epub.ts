import { loadAsync } from "jszip";

import epub from "./examples/alice.epub?url";

const chapter1 = async () => {
  const res = await fetch(epub);
  const bytes = await res.arrayBuffer();
  const zip = await loadAsync(bytes);

  const chapter1 = zip.files["OPS/chapter_001.xhtml"];
  const content = await chapter1.async("string");

  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "application/xhtml+xml");

  const links = doc.querySelectorAll("link");
  for (const link of links) {
    const stylesheetPath = link.getAttribute("href");
    const stylesheetBlob = await zip.files[`OPS/${stylesheetPath}`].async("blob");
    const stylesheetUrl = URL.createObjectURL(stylesheetBlob);

    link.setAttribute("href", stylesheetUrl);
  }

  const images = doc.querySelectorAll("img");
  for (const img of images) {
    const imagePath = img.getAttribute("src");
    const imageBlob = await zip.files[`OPS/${imagePath}`].async("blob");
    const imageUrl = URL.createObjectURL(imageBlob);

    img.setAttribute("src", imageUrl);
  }

  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
};

export default chapter1;
