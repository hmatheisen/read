import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { MdFontDownload, MdOutlineHeight } from "react-icons/md";

import { useSettings } from "../../context/settings";
import useDebounce from "../../hooks/useDebounce";
import SettingsBar from "./SettingsBar";

type Props = {
  isSettingsHidden: boolean;
};

type SelectedSetting = "text-resize" | "line-height-resize";

const Settings = ({ isSettingsHidden }: Props) => {
  const { settings, setSettings } = useSettings();

  const [selectedSetting, setSelectedSetting] = useState<SelectedSetting | null>(null);
  const toggleTextResize = () =>
    setSelectedSetting(prev => (prev !== "text-resize" ? "text-resize" : null));
  const toggleLineHeightResize = () =>
    setSelectedSetting(prev => (prev !== "line-height-resize" ? "line-height-resize" : null));

  const [inputSettings, setInputSettings] = useState(settings);
  const debouncedSettings = useDebounce(inputSettings, 1000);

  useEffect(() => {
    setSettings(debouncedSettings);
  }, [debouncedSettings]);

  return (
    <SettingsBar isHidden={isSettingsHidden}>
      <div className="flex justify-around">
        <MdFontDownload onClick={toggleTextResize} className="text-3xl" />
        <MdOutlineHeight onClick={toggleLineHeightResize} className="text-3xl" />
      </div>

      <AnimatePresence>
        {selectedSetting !== null && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {selectedSetting === "text-resize" && (
              <div className="flex flex-col w-full items-center">
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

            {selectedSetting === "line-height-resize" && (
              <div className="flex flex-col w-full items-center">
                <span>{inputSettings.readerLineHeight}</span>
                <input
                  className="w-3/4 p-3"
                  type="range"
                  min={0}
                  max={5}
                  value={inputSettings.readerLineHeight}
                  onChange={e =>
                    setInputSettings({ ...inputSettings, readerLineHeight: e.target.value })
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
