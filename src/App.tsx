import { useEffect, useState } from "react";

import BookPagination from "lib/BookPagination";
import Page from "lib/Page";
import { Epub } from "lib/epub";

import epubUrl from "./lib/epub/examples/alice.epub?url";

const App = () => {
  const [pages, setPages] = useState<Array<string>>([]);

  useEffect(() => {
    (async () => {
      try {
        const startTime = performance.now();
        const epub = await Epub.fromUrl(epubUrl);

        const pages: Array<string> = [];
        [6, 7, 8].map((i) => {
          pages.push(epub.getChapter(i).content);
        });
        setPages(pages);

        const endTime = performance.now();
        const duration = endTime - startTime;

        console.log(`Loaded 3 chapters in ${duration} ms`);
      } catch (error) {
        console.error("Failed to load chapter:", error);
      }
    })();
  }, []);

  return (
    <BookPagination>
      <Page content={pages[0]} />
      <Page content={pages[1]} />
      <Page content={pages[2]} />
    </BookPagination>
  );
};

export default App;
