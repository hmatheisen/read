import type { ComputedChapterPages, PaginationInfo } from "./EpubReader";

type Props = {
  currentChapterPages: ComputedChapterPages;
  paginationInfo: PaginationInfo;
};

const Footer = ({ currentChapterPages, paginationInfo }: Props) => {
  return (
    <div className="h-(--footer-height) text-gray-400 text-xs flex items-center justify-around m-0 p-0">
      <span>{`${paginationInfo.currentPage}/${paginationInfo.totalPages}`}</span>
      <span>
        {`${paginationInfo.currentPage - currentChapterPages.startPage}/${currentChapterPages.totalPages}`}
      </span>
    </div>
  );
};

export default Footer;
