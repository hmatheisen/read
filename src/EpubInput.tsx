import {
  type ChangeEventHandler,
  type Dispatch,
  type SetStateAction,
  useRef,
  useState,
} from "react";

import { Epub } from "lib/epub";

import { Spinner } from "components/Spinner";

type Props = {
  setEpub: Dispatch<SetStateAction<Epub | null>>;
};

const EpubInput = ({ setEpub }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileUpload: ChangeEventHandler<HTMLInputElement> = async e => {
    if (e.target.files === null) {
      console.error("no files selected");
      return;
    }
    const startTime = performance.now();

    setIsLoading(true);

    const file = e.target.files[0];
    const bytes = await file.arrayBuffer();
    const epub = await Epub.fromBytes(bytes);
    setEpub(epub);

    const endTime = performance.now();
    const duration = endTime - startTime;

    setIsLoading(false);
    console.log(`Loaded epub in ${duration}ms`);
  };

  const onClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="h-dvh w-dvw flex flex-col justify-center items-center">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            id="epub-upload"
            accept=".epub"
            onChange={onFileUpload}
          />

          <button
            className="bg-black text-white dark:bg-white dark:text-black py-2 px-4 rounded"
            onClick={onClick}
          >
            Select book
          </button>
        </>
      )}
    </div>
  );
};

export default EpubInput;
