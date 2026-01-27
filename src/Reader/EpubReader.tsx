import { SystemBars } from "@capacitor/core";
import { useEffect, useMemo, useState } from "react";

import { Epub } from "lib/epub";

import BookPagination from "./BookPagination";
import Chapter from "./Chapter";
import Footer from "./Footer";
import Header from "./Header";
import Settings, { type SelectedSetting } from "./Settings/Settings";

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
  const [isSettingsHidden, setIsSettingsHidden] = useState(true);
  const [selectedSetting, setSelectedSetting] = useState<SelectedSetting | null>(null);
  const toggleSettings = () =>
    setIsSettingsHidden(prev => {
      const next = !prev;
      if (next) {
        setSelectedSetting(null);
      }
      return next;
    });

  const currentChapterPages = paginationInfo.chapterPages.find(
    chapter =>
      chapter.startPage <= paginationInfo.currentPage &&
      chapter.endPage >= paginationInfo.currentPage,
  ) || { startPage: 0, endPage: 0, totalPages: 0 };

  const currentChapterIndex = paginationInfo.chapterPages.indexOf(currentChapterPages);
  const chapterName = useMemo(() => {
    if (currentChapterIndex === -1) {
      return null;
    }

    return epub.findChapterTitle(epub.chapters[currentChapterIndex]);
  }, [currentChapterIndex, epub.chapters]);

  const headerText = chapterName === null ? epub.title : chapterName;

  useEffect(() => {
    if (isSettingsHidden) {
      SystemBars.hide({});
    } else {
      SystemBars.show({});
    }
  }, [isSettingsHidden]);

  return (
    <div className="pt-(--reader-top-padding) pb-(--reader-bottom-padding) m-0 px-0">
      <Header text={headerText} />

      <BookPagination setPaginationInfo={setPaginationInfo} toggleSettings={toggleSettings}>
        {epub.chapters.map(chapter => (
          <Chapter key={chapter.id} content={chapter.content} />
        ))}
      </BookPagination>

      <Footer currentChapterPages={currentChapterPages} paginationInfo={paginationInfo} />

      <Settings
        isSettingsHidden={isSettingsHidden}
        selectedSetting={selectedSetting}
        setSelectedSetting={setSelectedSetting}
      />
    </div>
  );
};

export default EpubReader;
