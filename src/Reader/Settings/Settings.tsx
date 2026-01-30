import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { MdFontDownload, MdOutlineHeight, MdPadding } from "react-icons/md";

import RangeInput from "components/RangeInput";

import { useSettings } from "../../context/settings";
import useDebounce from "../../hooks/useDebounce";
import SettingsBar from "./SettingsBar";

const stringToPx = (px: string) => `${px}px`;
const pxToString = (string: string) => string.slice(0, -2);

export type SelectedSetting = "reader-text-size" | "reader-padding" | "reader-line-height";

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

      {selectedSetting === "reader-text-size" && (
        <div className="flex flex-col w-full items-center mt-3">
          <span>{inputSettings.readerTextSize}</span>
          <RangeInput
            className="w-3/4 p-3"
            min={5}
            max={30}
            value={pxToString(inputSettings.readerTextSize)}
            onChange={value =>
              setInputSettings({ ...inputSettings, readerTextSize: stringToPx(value) })
            }
          />
        </div>
      )}

      {selectedSetting === "reader-line-height" && (
        <div className="flex flex-col w-full items-center mt-3">
          <span>{inputSettings.readerLineHeight}</span>
          <RangeInput
            className="w-3/4 p-3"
            min={0}
            max={5}
            step={0.1}
            value={pxToString(inputSettings.readerLineHeight)}
            onChange={value =>
              setInputSettings({ ...inputSettings, readerLineHeight: stringToPx(value) })
            }
          />
        </div>
      )}

      {selectedSetting === "reader-padding" && (
        <div className="flex flex-col w-full items-center mt-3">
          <span>Top padding: {inputSettings.readerTopPadding}</span>
          <RangeInput
            className="w-3/4 p-3"
            min={1}
            max={100}
            step={1}
            value={pxToString(inputSettings.readerTopPadding)}
            onChange={value =>
              setInputSettings({ ...inputSettings, readerTopPadding: stringToPx(value) })
            }
          />

          <span>Bottom padding: {inputSettings.readerBottomPadding}</span>
          <RangeInput
            className="w-3/4 p-3"
            min={1}
            max={100}
            step={1}
            value={pxToString(inputSettings.readerBottomPadding)}
            onChange={value =>
              setInputSettings({
                ...inputSettings,
                readerBottomPadding: stringToPx(value),
              })
            }
          />

          <span>X padding: {inputSettings.readerXPadding}</span>
          <RangeInput
            className="w-3/4 p-3"
            min={1}
            max={100}
            step={1}
            value={pxToString(inputSettings.readerXPadding)}
            onChange={value =>
              setInputSettings({ ...inputSettings, readerXPadding: stringToPx(value) })
            }
          />
        </div>
      )}
    </SettingsBar>
  );
};

export default Settings;
