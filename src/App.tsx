import { useState } from "react";

import { Epub } from "lib/epub";

import EpubInput from "./EpubInput";
import EpubReader from "./Reader/EpubReader";

const App = () => {
  const [epub, setEpub] = useState<Epub | null>(null);

  if (epub === null) {
    return <EpubInput setEpub={setEpub} />;
  }

  return <EpubReader epub={epub} />;
};

export default App;
