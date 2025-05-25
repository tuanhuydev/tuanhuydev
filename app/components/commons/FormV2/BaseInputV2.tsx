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
          ...restProps.InputProps,
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          backgroundColor: "white",
          height: "2.5rem",
          "&.Mui-disabled": {
            backgroundColor: "rgb(248, 250, 252)",
            cursor: "not-allowed",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(203, 213, 225)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-primary, #172733)",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(203, 213, 225)",
          },
        },
        "& .MuiInputBase-input": {
          padding: "0.5rem 0.75rem",
          "&::placeholder": {
            color: "rgb(148, 163, 184)",
            opacity: 1,
            fontSize: "0.875rem",
            fontWeight: 400,
          },
          "&:disabled": {
            backgroundColor: "rgb(248, 250, 252)",
            cursor: "not-allowed",
          },
        },
        ...restProps.sx,
      }}
      className={className}
    />
  );
});

BaseInputV2.displayName = "BaseInputV2";
export default BaseInputV2;
