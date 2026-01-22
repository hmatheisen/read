import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { SettingsProvider } from "./context/settings.tsx";
import { ThemeProvider } from "./context/theme.tsx";
import "./style.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SettingsProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </SettingsProvider>
  </StrictMode>,
);
