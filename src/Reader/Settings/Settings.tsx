import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MdFontDownload } from "react-icons/md";

import { useSettings } from "../../context/settings";
import SettingsBar from "./SettingsBar";

type Props = {
  isSettingsHidden: boolean;
};

const Settings = ({ isSettingsHidden }: Props) => {
  const { settings, setSettings } = useSettings();

  const [isExtended, setIsExtended] = useState(false);
  const [fontSize, setFontSize] = useState(settings.readerTextSize.slice(0, -2));

  const onFontSizeChange = (value: string) => {
    setFontSize(value);
    setSettings({ readerTextSize: `${value}px` });
  };

  return (
    <SettingsBar isHidden={isSettingsHidden}>
      <div className="flex justify-around">
        <MdFontDownload onClick={() => setIsExtended(prev => !prev)} className="text-3xl" />
      </div>

      <AnimatePresence>
        {isExtended && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden flex justify-center"
          >
            <input
              className="w-3/4 p-3"
              type="range"
              min={5}
              max={30}
              value={fontSize}
              onChange={e => onFontSizeChange(e.target.value)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SettingsBar>
  );
};

export default Settings;
