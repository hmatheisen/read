import { useEffect, useState } from "react";

import type { Epub } from "lib/epub";

import BookPagination from "./BookPagination";
import Page from "./Page";

type Props = {
  epub: Epub;
};

const EpubReader = ({ epub }: Props) => {
  const [pages, setPages] = useState<Array<string>>([]);

  useEffect(() => {
    if (epub === null) {
      return;
    }

    (async () => {
      try {
        const pages: Array<string> = [];
        [6, 7, 8].map(i => {
          pages.push(epub.getChapter(i).content);
        });
        setPages(pages);
      } catch (error) {
        console.error("Failed to load chapter:", error);
      }
    })();
  }, [epub]);

  return (
    <BookPagination>
      <Page content={pages[0]} />
      <Page content={pages[1]} />
      <Page content={pages[2]} />
    </BookPagination>
  );
};

export default EpubReader;
