import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import "./style.css";
import { ThemeProvider } from "./theme.tsx";

const body = document.body;
body.style.margin = "0";
body.style.padding = "0";
body.style.overflow = "hidden";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
