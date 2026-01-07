import { useState } from "react";

import type { Epub } from "lib/epub";

import BookPagination from "./BookPagination";
import Page from "./Page";

type Direction = "left" | "right";
export type PushChaptersFn = (direction: Direction) => boolean;

type Props = {
  epub: Epub;
};

const EpubReader = ({ epub }: Props) => {
  const [chaptersIndex, setChaptersIndex] = useState([0, 1, 2]);

  console.log(chaptersIndex);
  const pushChapters: PushChaptersFn = direction => {
    const chaptersCount = epub.chapters.length;
    const firstIndex = chaptersIndex[0];
    const lastIndex = chaptersIndex[chaptersIndex.length - 1];

    // beggining of book
    if (direction === "left" && firstIndex === 0) {
      return false;
    }

    // end of book
    if (direction === "right" && lastIndex === chaptersCount) {
      return false;
    }

    // scroll chapters right
    if (direction === "right") {
      setChaptersIndex(prevIndices => prevIndices.map(i => i + 1));
      return true;
    }

    // scroll chapters left
    setChaptersIndex(prevIndices => prevIndices.map(i => i - 1));
    return true;
  };

  return (
    <BookPagination pushChapters={pushChapters}>
      {chaptersIndex
        .map(i => epub.chapters[i])
        .map(chapter => !!chapter && <Page key={chapter.id} content={chapter.content} />)}
    </BookPagination>
  );
};

export default EpubReader;
