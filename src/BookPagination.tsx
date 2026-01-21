import {
  type Dispatch,
  type MouseEventHandler,
  type ReactNode,
  type SetStateAction,
  type TouchEvent,
  useEffect,
  useRef,
} from "react";

import type { PaginationInfo } from "./EpubReader";
import { waitForScrollEnd } from "./helpers/waitFroScrollToEnd";

type ComputedChapterPages = {
  startPage: number;
  endPage: number;
  totalPages: number;
};

type TouchState = {
  x: number;
  vx: number;
  time: number;
};

const touchStateInit: TouchState = {
  x: 0,
  vx: 0,
  time: 0,
};

type Props = {
  children: ReactNode;
  setPaginationInfo: Dispatch<SetStateAction<PaginationInfo>>;
};

const BookPagination = ({ children, setPaginationInfo }: Props) => {
  const touchStateRef = useRef(touchStateInit);
  const divRef = useRef<HTMLDivElement>(null);

  const setTotalPages = () => {
    if (!divRef.current) {
      return;
    }

    const columnWidth = divRef.current.clientWidth;
    const scrollWidth = divRef.current.scrollWidth;
    const totalPages = Math.ceil(scrollWidth / columnWidth);

    setPaginationInfo(info => ({ ...info, totalPages }));
  };

  const setCurrentPage = () => {
    if (!divRef.current) {
      return;
    }

    const columnWidth = divRef.current.clientWidth;
    const scrollLeft = divRef.current.scrollLeft;
    const columnIndex = Math.round(scrollLeft / columnWidth);

    setPaginationInfo(info => ({ ...info, currentPage: columnIndex + 1 }));
  };

  const computeChapterPages = () => {
    if (!divRef.current) {
      return;
    }

    const columnWidth = divRef.current.clientWidth;
    const totalScrollWidth = divRef.current.scrollWidth;

    const elements: Array<HTMLElement> = [];
    divRef.current.childNodes.forEach(node => elements.push(node as HTMLElement));

    const chapterPages = elements.map((element, index) => {
      // Get the element's left offset relative to the scroll container
      const offsetLeft = element.offsetLeft;
      const offsetRight =
        index < elements.length - 1 ? elements[index + 1].offsetLeft : totalScrollWidth;

      // Calculate start page and page count
      const startPage = Math.floor(offsetLeft / columnWidth);
      const endPage = Math.ceil(offsetRight / columnWidth);
      const totalPages = endPage - startPage;

      return { startPage, endPage, totalPages } as ComputedChapterPages;
    });

    setPaginationInfo(info => ({ ...info, chapterPages }));
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage();
      setTotalPages();
      computeChapterPages();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [children]);

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.changedTouches[0];
    const newTouchState: TouchState = {
      x: touch.screenX,
      vx: 0,
      time: e.timeStamp,
    };

    touchStateRef.current = newTouchState;
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!divRef.current) {
      return;
    }

    const touch = e.changedTouches[0];
    const x = touch.screenX;
    const dx = touchStateRef.current.x - x;
    const dt = e.timeStamp - touchStateRef.current.time;

    touchStateRef.current.x = x;
    touchStateRef.current.vx = dx / dt;
    touchStateRef.current.time = e.timeStamp;

    divRef.current.scrollBy({ left: dx });
  };

  const onTouchEnd = async (e: TouchEvent<HTMLDivElement>) => {
    if (!divRef.current) {
      return;
    }

    const columnWidth = divRef.current.clientWidth;

    // Simple touch event
    if (touchStateRef.current.vx === 0) {
      const clientX = e.changedTouches[0].clientX;

      if (clientX <= columnWidth / 3.0) {
        divRef.current.scrollBy({ left: -columnWidth, behavior: "smooth" });
        await waitForScrollEnd(divRef.current);
      }

      if (clientX >= (columnWidth * 2) / 3.0) {
        divRef.current.scrollBy({ left: columnWidth, behavior: "smooth" });
        await waitForScrollEnd(divRef.current);
      }
    }

    const scrollLeft = divRef.current.scrollLeft;
    const columnIndex = Math.round(scrollLeft / columnWidth);
    const targetScrollLeft = columnIndex * columnWidth;

    setCurrentPage();

    divRef.current.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
  };

  const onClick: MouseEventHandler<HTMLDivElement> = e => {
    if (!divRef.current) {
      return;
    }

    e.preventDefault();
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={onClick}
      className="columns-[100dvw] h-(--reader-height) gap-x-0 overflow-hidden box-border"
      ref={divRef}
    >
      {children}
    </div>
  );
};

export default BookPagination;
