import { useState } from "react";

import { Epub } from "lib/epub";

import EpubInput from "./EpubInput";
import EpubReader from "./EpubReader";

const App = () => {
  const [epub, setEpub] = useState<Epub | null>(null);

  return <>{epub === null ? <EpubInput setEpub={setEpub} /> : <EpubReader epub={epub} />}</>;
};

export default App;
