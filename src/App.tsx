import { useEffect, useState } from "react";

import BookPagination from "lib/BookPagination";
import { Epub } from "lib/epub";

import epubUrl from "./lib/epub/examples/alice.epub?url";

const App = () => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const epub = await Epub.fromUrl(epubUrl);

        const itemRef = epub.rootfile.spine.itemRefs[3];
        const item = epub.rootfile.manifest.items.find((item) => item.id === itemRef.idref);
        const content = epub.getFileContent(item!.href);

        setHtml(content);
      } catch (error) {
        console.error("Failed to load chapter:", error);
      }
    })();
  }, []);

  return (
    <BookPagination>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </BookPagination>
  );
};

export default App;
