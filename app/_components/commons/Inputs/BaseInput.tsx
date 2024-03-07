import { InputProps } from "@mui/base/Input";
import { useInput } from "@mui/base/useInput/useInput";
import { unstable_useForkRef as useForkRef } from "@mui/utils";
import React from "react";

export const BaseInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className = "", startAdornment, ...restProps } = props;
  const { getRootProps, getInputProps } = useInput(restProps);
  const inputProps = getInputProps();

  // Make sure that both the forwarded ref and the ref returned from the getInputProps are applied on the input element
  inputProps.ref = useForkRef(inputProps.ref, ref);

  return (
    <div
      {...getRootProps()}
      className="py-2 px-3 w-full rounded-md flex items-center border-solid border focus-within:outline outline-1 transition-all border-slate-300 focus-within:border-primary bg-white dark:border-primary dark:focus-within:border-slate-300">
      {startAdornment}
      <input {...restProps} {...inputProps} className="w-full  font-normal outline-none border-none bg-transparent" />
    </div>
  );
});

BaseInput.displayName = "BaseInput";
export default BaseInput;
