import { useRef } from "react";

type Props = {
  content: string;
};

const Chapter = ({ content }: Props) => {
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={divRef}
      className="m-0 py-0 break-inside-avoid-column break-before-column break-after-column px-(--reader-x-padding)"
      // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default Chapter;
