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

        // Simple speed test.
        // This is ridiculously fast
        // ~0.2ms
        const startTime = performance.now();

        // Load first 10 chapters
        let content = "";
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
          const itemRef = epub.rootfile.spine.itemRefs[i];
          const item = epub.rootfile.manifest.items.find((item) => item.id === itemRef.idref);
          const chapter = epub.getFileContent(item!.href);

          content += chapter;
        });
        setHtml(content);

        const endTime = performance.now();
        const duration = endTime - startTime;

        console.log(`Loaded 10 chapters in ${duration} ms`);
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
