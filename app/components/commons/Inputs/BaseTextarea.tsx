import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import React from "react";

const BaseTextarea = React.forwardRef<HTMLTextAreaElement, any>((props, ref) => {
  const { className = "", value, ...restProps } = props;

  const defaultClasses =
    "!w-full font-sans p-3 font-normal rounded-md flex items-center border-solid border outline-1 outline-slate-300 transition-all border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50";

  const textareaProps = {
    ...restProps,
    defaultValue: "",
    ref: ref,
    className: `${defaultClasses} placeholder:font-normal placeholder:text-slate-400 focus-within:outline focus-within:border-primary dark:border-primary dark:focus-within:border-slate-600 disabled:bg-slate-200 disabled:cursor-not-allowed ${className}`,
  };
  return <BaseTextareaAutosize {...(textareaProps as any)} />;
});

BaseTextarea.displayName = "BaseTextarea";

export default BaseTextarea;
