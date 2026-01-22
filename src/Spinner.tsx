import { animate } from "motion";
import { useEffect } from "react";

export const Spinner = () => {
  useEffect(() => {
    animate(".spinner", { transform: "rotate(360deg)" }, { duration: 1.0, repeat: Infinity });
  });

  return (
    <div className="spinner w-12 h-12 rounded-full border-4 border-gray-600 border-t-white will-change-transform" />
  );
};
