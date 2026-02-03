import { AnimatePresence, motion } from "motion/react";
import { type Dispatch, type ReactNode, type SetStateAction, useEffect, useState } from "react";
import { MdFontDownload, MdOutlineHeight, MdPadding } from "react-icons/md";

import { useSettings } from "context/settings";
import useDebounce from "hooks/useDebounce";

import RangeInput from "components/RangeInput";

import SettingsBar from "./SettingsBar";

const stringToPx = (px: string) => `${px}px`;
const pxToString = (string: string) => string.slice(0, -2);

export type SelectedSetting = "reader-text-size" | "reader-padding" | "reader-line-height";

type SubBarProps = {
  setting: SelectedSetting;
  isSelected?: boolean;
  children: ReactNode;
};

const SubBar = ({ setting, isSelected = false, children }: SubBarProps) => {
  return (
    <AnimatePresence>
      {isSelected && (
        <motion.div
          key={setting}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex flex-col w-full items-center mt-3"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

type Props = {
  isSettingsHidden: boolean;
  selectedSetting: SelectedSetting | null;
  setSelectedSetting: Dispatch<SetStateAction<SelectedSetting | null>>;
};

const Settings = ({ isSettingsHidden, selectedSetting, setSelectedSetting }: Props) => {
  const { settings, setSettings } = useSettings();
  const toggleSettings = (setting: SelectedSetting) => () => {
    setSelectedSetting(prev => (prev !== setting ? setting : null));
  };

  const [inputSettings, setInputSettings] = useState(settings);
  const debouncedSettings = useDebounce(inputSettings, 1000);

  useEffect(() => {
    setSettings(debouncedSettings);
  }, [debouncedSettings]);

  return (
    <SettingsBar isHidden={isSettingsHidden}>
      <div className="flex justify-around">
        <MdFontDownload
          color={
            selectedSetting === "reader-text-size"
              ? "var(--color-white)"
              : "var(--color-neutral-500)"
          }
          onClick={toggleSettings("reader-text-size")}
          className="text-3xl"
        />
        <MdOutlineHeight
          color={
            selectedSetting === "reader-line-height"
              ? "var(--color-white)"
              : "var(--color-neutral-500)"
          }
          onClick={toggleSettings("reader-line-height")}
          className="text-3xl"
        />
        <MdPadding
          color={
            selectedSetting === "reader-padding" ? "var(--color-white)" : "var(--color-neutral-500)"
          }
          onClick={toggleSettings("reader-padding")}
          className="text-3xl"
        />
      </div>

      <SubBar setting="reader-text-size" isSelected={selectedSetting === "reader-text-size"}>
        <span>{inputSettings.readerTextSize}</span>
        <RangeInput
          className="w-3/4"
          min={5}
          max={30}
          value={pxToString(inputSettings.readerTextSize)}
          onChange={value =>
            setInputSettings({ ...inputSettings, readerTextSize: stringToPx(value) })
          }
        />
      </SubBar>

      <SubBar setting="reader-line-height" isSelected={selectedSetting === "reader-line-height"}>
        <span>{inputSettings.readerLineHeight}</span>
        <RangeInput
          className="w-3/4"
          min={0}
          max={5}
          step={0.1}
          value={inputSettings.readerLineHeight}
          onChange={value => setInputSettings({ ...inputSettings, readerLineHeight: value })}
        />
      </SubBar>

      <SubBar setting="reader-padding" isSelected={selectedSetting === "reader-padding"}>
        <span>{inputSettings.readerTopPadding}</span>
        <RangeInput
          className="w-3/4"
          min={1}
          max={100}
          step={1}
          value={pxToString(inputSettings.readerTopPadding)}
          onChange={value =>
            setInputSettings({ ...inputSettings, readerTopPadding: stringToPx(value) })
          }
        />
        <span>{inputSettings.readerBottomPadding}</span>
        <RangeInput
          className="w-3/4"
          min={1}
          max={100}
          step={1}
          value={pxToString(inputSettings.readerBottomPadding)}
          onChange={value =>
            setInputSettings({ ...inputSettings, readerBottomPadding: stringToPx(value) })
          }
        />
        <span>{inputSettings.readerXPadding}</span>
        <RangeInput
          className="w-3/4"
          min={1}
          max={100}
          step={1}
          value={pxToString(inputSettings.readerXPadding)}
          onChange={value =>
            setInputSettings({ ...inputSettings, readerXPadding: stringToPx(value) })
          }
        />
      </SubBar>
    </SettingsBar>
  );
};

export default Settings;
