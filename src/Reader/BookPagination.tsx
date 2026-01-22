import { animate } from "motion";
import {
  type Dispatch,
  type MouseEventHandler,
  type ReactNode,
  type SetStateAction,
  type TouchEvent,
  useEffect,
  useRef,
} from "react";

import { useSettings } from "../context/settings";
import type { PaginationInfo } from "./EpubReader";

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
  toggleSettings: () => void;
};

const BookPagination = ({ children, setPaginationInfo, toggleSettings }: Props) => {
  const touchStateRef = useRef(touchStateInit);
  const divRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();

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
      const startPage = Math.round(offsetLeft / columnWidth);
      const endPage = Math.round(offsetRight / columnWidth);
      const totalPages = endPage - startPage;

      return { startPage, endPage, totalPages } as ComputedChapterPages;
    });

    setPaginationInfo(info => ({ ...info, chapterPages }));
  };

  const scrollTo = (div: HTMLDivElement, distance: number) =>
    animate(div.scrollLeft, div.scrollLeft + distance, {
      duration: 0.2,
      ease: "easeInOut",
      onUpdate: latest => {
        div.scrollLeft = latest;
      },
    });

  const scrollBy = (div: HTMLDivElement, distance: number) =>
    animate(div.scrollLeft, distance, {
      duration: 0.2,
      ease: "easeInOut",
      onUpdate: latest => {
        div.scrollLeft = latest;
      },
    });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage();
      setTotalPages();
      computeChapterPages();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [settings]);

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
      const firstThird = columnWidth / 3.0;
      const secondThird = (columnWidth * 2) / 3.0;

      if (clientX <= firstThird) {
        await scrollTo(divRef.current, -columnWidth);
      }

      if (clientX >= firstThird && clientX <= secondThird) {
        toggleSettings();
      }

      if (clientX >= secondThird) {
        await scrollTo(divRef.current, columnWidth);
      }
    }

    const scrollLeft = divRef.current.scrollLeft;
    const velocityThreshold = 0.5;

    let targetColumnIndex;
    if (Math.abs(touchStateRef.current.vx) > velocityThreshold) {
      // Fast swipe - move to next/prev page based on direction
      const currentColumn = Math.round(scrollLeft / columnWidth);
      targetColumnIndex = touchStateRef.current.vx > 0 ? currentColumn + 1 : currentColumn - 1;
    } else {
      // Slow drag - use a lower threshold (e.g., 30%)
      const columnIndex = Math.floor(scrollLeft / columnWidth);
      const remainder = scrollLeft % columnWidth;
      targetColumnIndex = remainder > columnWidth * 0.3 ? columnIndex + 1 : columnIndex;
    }

    const targetScrollLeft = targetColumnIndex * columnWidth;
    await scrollBy(divRef.current, targetScrollLeft);
    setCurrentPage();
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
      className="columns-[100dvw] h-(--reader-height) text-(--reader-text-size) gap-x-0 overflow-hidden box-border"
      ref={divRef}
    >
      {children}
    </div>
  );
};

export default BookPagination;
