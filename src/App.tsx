// import { useEffect, useState } from "react";
import { useState } from "react";

import { Epub } from "lib/epub";

// import BookPagination from "lib/BookPagination";
// import Page from "lib/Page";
// import { Epub } from "lib/epub";

// import epubUrl from "./lib/epub/examples/alice.epub?url";

const App = () => {
  const [title, setTitle] = useState("");
  // const [pages, setPages] = useState<Array<string>>([]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const startTime = performance.now();
  //       const epub = await Epub.fromUrl(epubUrl);

  //       const pages: Array<string> = [];
  //       [6, 7, 8].map(i => {
  //         pages.push(epub.getChapter(i).content);
  //       });
  //       setPages(pages);

  //       const endTime = performance.now();
  //       const duration = endTime - startTime;

  //       console.log(`Loaded 3 chapters in ${duration} ms`);
  //     } catch (error) {
  //       console.error("Failed to load chapter:", error);
  //     }
  //   })();
  // }, []);

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
      {title !== "" && <h1 style={{ textAlign: "center" }}>{title}</h1>}
      <input
        type="file"
        onChange={async e => {
          const file = e.target.files![0];
          const bytes = await file.arrayBuffer();

          const epub = await Epub.fromBytes(bytes);
          setTitle(epub.rootfile.metadata.title);
        }}
      />
    </div>
    // <BookPagination>
    //   <Page content={pages[0]} />
    //   <Page content={pages[1]} />
    //   <Page content={pages[2]} />
    // </BookPagination>
  );
};

export default App;
