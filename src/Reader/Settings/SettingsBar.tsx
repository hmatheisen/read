import { motion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  isHidden?: boolean;
  children: ReactNode;
};

const SettingsBar = ({ isHidden = false, children }: Props) => {
  return (
    <motion.div
      className="fixed bottom-0 w-full m-0 p-3 bg-neutral-900 text-neutral-300 rounded-t-2xl h-"
      initial={{ y: "100%" }}
      animate={{ y: isHidden ? "100%" : "0%" }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      layout
    >
      {children}
    </motion.div>
  );
};

export default SettingsBar;
