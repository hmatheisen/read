import type { Dispatch, SetStateAction } from "react";

import { Epub } from "lib/epub";

type Props = {
  setEpub: Dispatch<SetStateAction<Epub | null>>;
};

const EpubInput = ({ setEpub }: Props) => {
  return (
    <div
      style={{
        height: "100dvh",
        width: "100dvw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <input
        type="file"
        onChange={async e => {
          const startTime = performance.now();
          const file = e.target.files![0];
          const bytes = await file.arrayBuffer();

          const epub = await Epub.fromBytes(bytes);
          const endTime = performance.now();
          const duration = endTime - startTime;

          console.log(`Loaded epub in ${duration}ms`);
          setEpub(epub);
        }}
      />
    </div>
  );
};

export default EpubInput;
