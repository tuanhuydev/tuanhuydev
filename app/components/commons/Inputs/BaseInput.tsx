import { InputProps } from "@mui/base/Input";
import { useInput } from "@mui/base/useInput/useInput";
import React from "react";

export const BaseInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className = "", startAdornment, ...restProps } = props;
  const { getRootProps, getInputProps } = useInput(restProps);
  const { value, ...inputProps } = getInputProps();

  const defaultClasses =
    "w-full font-sans rounded-md flex items-center border-solid border outline-1 transition-all border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50";
  return (
    <div
      {...getRootProps()}
      className={`${defaultClasses} focus-within:outline focus-within:border-primary dark:border-primary dark:focus-within:border-slate-600`}>
      {startAdornment && <div className="pl-3 flex items-center">{startAdornment}</div>}
      <input
        {...restProps}
        {...inputProps}
        value={value}
        ref={ref}
        className="w-full rounded-md font-sans font-normal outline-none border-none bg-transparent placeholder:text-slate-400 disabled:bg-slate-200 disabled:cursor-not-allowed py-2 px-3"
      />
    </div>
  );
});

BaseInput.displayName = "BaseInput";
export default BaseInput;
