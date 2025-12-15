import { useEffect, useState } from "react";

import "lib/epub";
import chapter1 from "lib/epub";

const App = () => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const content = await chapter1();
        setHtml(content);
      } catch (error) {
        console.error("Failed to load chapter:", error);
      }
    })();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
};

export default App;
