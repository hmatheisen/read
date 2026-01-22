import { type FC, type ReactNode, createContext, use, useEffect, useReducer } from "react";

import Settings from "../Reader/Settings/Settings";

type Settings = {
  readerTextSize: string;
  readerTopPadding: string;
  readerBottomPadding: string;
  readerXPadding: string;
  readerLineHeight: string;
};

type SettingsContextType = {
  settings: Settings;
  setSettings: (settings: Partial<Settings>) => void;
};

const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);

const settingsReducer = (settings: Settings, action: Partial<Settings>) => ({
  ...settings,
  ...action,
});

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const styles = getComputedStyle(document.documentElement);
  const initSettings = {
    readerTextSize: styles.getPropertyValue("--reader-text-size"),
    readerTopPadding: styles.getPropertyValue("--reader-top-padding"),
    readerBottomPadding: styles.getPropertyValue("--reader-bottom-padding"),
    readerXPadding: styles.getPropertyValue("--reader-x-padding"),
    readerLineHeight: styles.getPropertyValue("--reader-line-height"),
  } as Settings;

  const [settings, setSettings] = useReducer(settingsReducer, initSettings);

  useEffect(() => {
    const style = document.documentElement.style;

    style.setProperty("--reader-text-size", settings.readerTextSize);
    style.setProperty("--reader-top-padding", settings.readerTopPadding);
    style.setProperty("--reader-bottom-padding", settings.readerBottomPadding);
    style.setProperty("--reader-x-padding", settings.readerXPadding);
    style.setProperty("--reader-line-height", settings.readerLineHeight);
  }, [settings]);

  return <SettingsContext value={{ settings, setSettings }}>{children}</SettingsContext>;
};

export const useSettings = () => {
  const context = use(SettingsContext);

  return context;
};
