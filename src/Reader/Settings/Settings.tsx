import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { MdFontDownload, MdOutlineHeight, MdPadding } from "react-icons/md";

import { useSettings } from "../../context/settings";
import useDebounce from "../../hooks/useDebounce";
import SettingsBar from "./SettingsBar";

type Props = {
  isSettingsHidden: boolean;
};

type SelectedSetting = "reader-text-size" | "reader-padding" | "reader-line-height";

const Settings = ({ isSettingsHidden }: Props) => {
  const { settings, setSettings } = useSettings();

  const [selectedSetting, setSelectedSetting] = useState<SelectedSetting | null>(null);
  const toggleTextResize = () =>
    setSelectedSetting(prev => (prev !== "reader-text-size" ? "reader-text-size" : null));
  const toggleLineHeightResize = () =>
    setSelectedSetting(prev => (prev !== "reader-line-height" ? "reader-line-height" : null));
  const toggleReaderPadding = () =>
    setSelectedSetting(prev => (prev !== "reader-padding" ? "reader-padding" : null));

  const [inputSettings, setInputSettings] = useState(settings);
  const debouncedSettings = useDebounce(inputSettings, 1000);

  useEffect(() => {
    setSettings(debouncedSettings);
  }, [debouncedSettings]);

  useEffect(() => {
    if (isSettingsHidden) {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setSelectedSetting(null);
    }
  }, [isSettingsHidden]);

  return (
    <SettingsBar isHidden={isSettingsHidden}>
      <div className="flex justify-around">
        <MdFontDownload
          color={
            selectedSetting === "reader-text-size"
              ? "var(--color-white)"
              : "var(--color-neutral-500)"
          }
          onClick={toggleTextResize}
          className="text-3xl"
        />
        <MdOutlineHeight
          color={
            selectedSetting === "reader-line-height"
              ? "var(--color-white)"
              : "var(--color-neutral-500)"
          }
          onClick={toggleLineHeightResize}
          className="text-3xl"
        />
        <MdPadding
          color={
            selectedSetting === "reader-padding" ? "var(--color-white)" : "var(--color-neutral-500)"
          }
          onClick={toggleReaderPadding}
          className="text-3xl"
        />
      </div>

      <AnimatePresence>
        {selectedSetting !== null && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
            layout
          >
            {selectedSetting === "reader-text-size" && (
              <div className="flex flex-col w-full items-center mt-3">
                <span>{inputSettings.readerTextSize}</span>
                <input
                  className="w-3/4 p-3"
                  type="range"
                  min={5}
                  max={30}
                  value={inputSettings.readerTextSize.slice(0, -2)}
                  onChange={e =>
                    setInputSettings({ ...inputSettings, readerTextSize: `${e.target.value}px` })
                  }
                />
              </div>
            )}

            {selectedSetting === "reader-line-height" && (
              <div className="flex flex-col w-full items-center mt-3">
                <span>{inputSettings.readerLineHeight}</span>
                <input
                  className="w-3/4 p-3"
                  type="range"
                  min={0}
                  max={5}
                  step={0.1}
                  value={inputSettings.readerLineHeight}
                  onChange={e =>
                    setInputSettings({ ...inputSettings, readerLineHeight: e.target.value })
                  }
                />
              </div>
            )}

            {selectedSetting === "reader-padding" && (
              <div className="flex flex-col w-full items-center mt-3">
                <span>Top padding: {inputSettings.readerTopPadding}</span>
                <input
                  className="w-3/4 p-3"
                  type="range"
                  min={1}
                  max={100}
                  step={1}
                  value={inputSettings.readerTopPadding.slice(0, -2)}
                  onChange={e =>
                    setInputSettings({ ...inputSettings, readerTopPadding: `${e.target.value}px` })
                  }
                />

                <span>Bottom padding: {inputSettings.readerBottomPadding}</span>
                <input
                  className="w-3/4 p-3"
                  type="range"
                  min={1}
                  max={100}
                  step={1}
                  value={inputSettings.readerBottomPadding.slice(0, -2)}
                  onChange={e =>
                    setInputSettings({
                      ...inputSettings,
                      readerBottomPadding: `${e.target.value}px`,
                    })
                  }
                />

                <span>X padding: {inputSettings.readerXPadding}</span>
                <input
                  className="w-3/4 p-3"
                  type="range"
                  min={1}
                  max={100}
                  step={1}
                  value={inputSettings.readerXPadding.slice(0, -2)}
                  onChange={e =>
                    setInputSettings({ ...inputSettings, readerXPadding: `${e.target.value}px` })
                  }
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </SettingsBar>
  );
};

export default Settings;
