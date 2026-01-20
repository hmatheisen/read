import { useRef } from "react";

type Props = {
  content: string;
};

const Chapter = ({ content }: Props) => {
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={divRef}
      className="break-inside-avoid-column break-before-column break-after-column px-7"
      // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default Chapter;
