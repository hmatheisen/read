import { useState } from "react";

import { Epub } from "lib/epub";

import BookPagination from "./BookPagination";
import Chapter from "./Chapter";

export type ComputedChapterPages = {
  startPage: number;
  endPage: number;
  totalPages: number;
};

export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  chapterPages: Array<ComputedChapterPages>;
};

const initPaginationInfo: PaginationInfo = {
  currentPage: 0,
  totalPages: 0,
  chapterPages: [],
};

type Props = {
  epub: Epub;
};

const EpubReader = ({ epub }: Props) => {
  const [paginationInfo, setPaginationInfo] = useState(initPaginationInfo);

  const currentChapterPages = paginationInfo.chapterPages.find(
    chapter =>
      chapter.startPage <= paginationInfo.currentPage &&
      chapter.endPage >= paginationInfo.currentPage,
  ) || { startPage: 0, endPage: 0, totalPages: 0 };

  return (
    <>
      <div className="h-(--header-height) text-gray-400 text-sm flex items-center justify-center">
        {epub.rootfile.metadata.title} - {epub.rootfile.metadata.creator}
      </div>

      <BookPagination setPaginationInfo={setPaginationInfo}>
        {epub.chapters.map(chapter => (
          <Chapter key={chapter.id} content={chapter.content} />
        ))}
      </BookPagination>

      <div className="h-(--footer-height) text-gray-400 text-sm flex items-center justify-around">
        <span>{`${paginationInfo.currentPage}/${paginationInfo.totalPages}`}</span>
        <span>
          {`${paginationInfo.currentPage - currentChapterPages.startPage}/${currentChapterPages.totalPages}`}
        </span>
      </div>
    </>
  );
};

export default EpubReader;
