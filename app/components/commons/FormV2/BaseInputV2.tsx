"use client";

import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

export interface BaseInputV2Props extends Omit<TextFieldProps, "variant"> {
  startAdornment?: React.ReactNode;
}

export const BaseInputV2 = React.forwardRef<HTMLInputElement, BaseInputV2Props>((props, ref) => {
  const { className = "", startAdornment, ...restProps } = props;

  return (
    <TextField
      ref={ref}
      variant="outlined"
      size="small"
      fullWidth
      {...restProps}
      slotProps={{
        input: {
          startAdornment: startAdornment ? <div className="pl-1 flex items-center">{startAdornment}</div> : undefined,
        },
      }}
      className={className}
    />
  );
});

BaseInputV2.displayName = "BaseInputV2";
export default BaseInputV2;
