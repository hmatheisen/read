import type { Epub } from "lib/epub";

import BookPagination from "./BookPagination";
import Page from "./Page";

type Props = {
  epub: Epub;
};

const EpubReader = ({ epub }: Props) => {
  return (
    <BookPagination>
      {epub.chapters.map(chapter => (
        <Page key={chapter.id} content={chapter.content} />
      ))}
    </BookPagination>
  );
};

export default EpubReader;
