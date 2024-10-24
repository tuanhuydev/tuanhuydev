import React, { memo } from "react";

export interface LoaderProps {
  variant?: "dark" | "light";
}

const LoaderVariants = {
  dark: "border-primary dark:border-slate-50 dark:border-t-primary",
  light: "border-slate-50 dark:border-primary dark:border-t-slate-50",
};

export default memo(function Loader({ variant = "dark" }: LoaderProps) {
  return (
    <div className="motion-safe:animate-spin w-5 h-5">
      <div
        className={`spin border-solid border-2 rounded-full w-5 h-5 border-t-transparent ${LoaderVariants[variant]}`}></div>
    </div>
  );
});
