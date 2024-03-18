import BaseButton, { BaseButtonProps } from "./BaseButton";
import React from "react";

const ghostButtonClasses =
  "bg-transparent text-primary active:bg-slate-400 active:text-slate-50 hover:bg-slate-300 hover:text-black dark:hover:bg-slate-500 dark:hover:text-slate-300";
export default function GhostButton(props: BaseButtonProps) {
  return <BaseButton {...props} className={ghostButtonClasses} />;
}
