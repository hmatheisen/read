import { type CSSProperties, type ReactNode, type TouchEvent, useRef } from "react";

type TouchState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  time: number;
};

const touchStateInit: TouchState = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  time: 0,
};

const paginationStyleSheet: CSSProperties = {
  height: "100dvh",
  columnWidth: "100dvw",
  columnGap: 0,
  overflow: "hidden",
  boxSizing: "border-box",
};

type Props = {
  children: ReactNode;
};

const BookPagination = ({ children }: Props) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const touchStateRef = useRef(touchStateInit);

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.changedTouches[0];
    const newTouchState = {
      x: touch.screenX,
      y: touch.screenY,
      vx: 0,
      vy: 0,
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
    const y = touch.screenY;
    const dx = touchStateRef.current.x - x;
    const dy = touchStateRef.current.y - y;
    const dt = e.timeStamp - touchStateRef.current.time;

    touchStateRef.current.x = x;
    touchStateRef.current.vx = dx / dt;
    touchStateRef.current.y = y;
    touchStateRef.current.vy = dy / dt;
    touchStateRef.current.time = e.timeStamp;

    divRef.current.scrollBy({ left: dx });
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
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={paginationStyleSheet}
      ref={divRef}
    >
      {children}
    </div>
  );
};

export default BookPagination;
