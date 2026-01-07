import { type ReactNode, type TouchEvent, useRef } from "react";

import type { PushChaptersFn } from "./EpubReader";

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
  pushChapters: PushChaptersFn;
  children: ReactNode;
};

const BookPagination = ({ children, pushChapters }: Props) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const touchStateRef = useRef(touchStateInit);

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

  const pushChaptersRight = () => {
    if (!divRef.current) {
      return;
    }

    const firstChapter = divRef.current.childNodes.item(1) as HTMLDivElement;
    const offsetLeft = firstChapter.offsetLeft;
    const hasMoved = pushChapters("right");
    if (!hasMoved) {
      return;
    }

    divRef.current.scrollBy({ left: -offsetLeft });

    const columnWidth = divRef.current.clientWidth;
    const scrollLeft = divRef.current.scrollLeft;
    const columnIndex = Math.round(scrollLeft / columnWidth);
    const targetScrollLeft = columnIndex * columnWidth;

    divRef.current.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
  };

  const pushChaptersLeft = () => {
    if (!divRef.current) {
      return;
    }

    const hasMoved = pushChapters("left");
    if (!hasMoved) {
      return;
    }

    const firstChapter = divRef.current.childNodes.item(1) as HTMLDivElement;
    const offsetLeft = firstChapter.offsetLeft;
    divRef.current.scrollBy({ left: offsetLeft });

    const columnWidth = divRef.current.clientWidth;
    const scrollLeft = divRef.current.scrollLeft;
    const columnIndex = Math.round(scrollLeft / columnWidth);
    const targetScrollLeft = columnIndex * columnWidth;

    divRef.current.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
  };

  const onTouchEnd = () => {
    if (!divRef.current) {
      return;
    }

    const columnWidth = divRef.current.clientWidth;
    const scrollLeft = divRef.current.scrollLeft;
    const columnIndex = Math.round(scrollLeft / columnWidth);
    const targetScrollLeft = columnIndex * columnWidth;

    divRef.current.scrollTo({ left: targetScrollLeft, behavior: "smooth" });

    const totalWidth = divRef.current.scrollWidth;
    const totalColumns = totalWidth / columnWidth;
    if (columnIndex > totalColumns - 2) {
      console.log("right");
      pushChaptersRight();
    }

    if (columnIndex < 1) {
      console.log("left");
      pushChaptersLeft();
    }
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="h-dvh columns-[100dvw] gap-x-0 overflow-hidden box-border py-10"
      ref={divRef}
    >
      {children}
    </div>
  );
};

export default BookPagination;
