import type { ReactNode } from "react";

type Props = {
  isHidden?: boolean;
  children: ReactNode;
};

const SettingsBar = ({ isHidden = false, children }: Props) => {
  return (
    <div
      className={`fixed bottom-0 w-full m-0 p-3 bg-neutral-900 text-neutral-300 rounded-t-2xl pb-(--reader-bottom-padding) transition-transform duration-150 ${isHidden ? "translate-y-full" : "translate-y-0"}`}
    >
      {children}
    </div>
  );
};

export default SettingsBar;
