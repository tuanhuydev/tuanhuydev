"use client";

import { TextField } from "@mui/material";
import { Ref, forwardRef, memo } from "react";
import { UseControllerProps, useController } from "react-hook-form";

export interface DynamicTextV2Props extends UseControllerProps<any> {
  type: "text" | "email" | "password" | "number" | "textarea";
  options?: {
    placeholder?: string;
    disabled?: boolean;
    rows?: number;
  };
  keyProp?: string;
  className?: string;
  validate?: Record<string, any>;
}

const DynamicTextV2 = memo(
  forwardRef<any, DynamicTextV2Props>(function DynamicTextV2(
    { type, options = { disabled: false }, keyProp, className = "w-full", validate = {}, ...restProps },
    ref: Ref<any>,
  ) {
    const { field, fieldState, formState } = useController(restProps);
    const { isSubmitting } = formState;
    const { invalid, error } = fieldState;

    const { value = "", ...restField } = field;

    const subElementProps = {
      ...restField,
      ...options,
      value,
      ref,
      disabled: isSubmitting || options.disabled,
      error: invalid,
      helperText: error?.message,
    };

    let element;
    switch (type) {
      case "password":
        element = (
          <TextField key={keyProp} {...subElementProps} type="password" variant="outlined" size="small" fullWidth />
        );
        break;
      case "email":
        element = (
          <TextField key={keyProp} {...subElementProps} type="email" variant="outlined" size="small" fullWidth />
        );
        break;
      case "number":
        element = (
          <TextField key={keyProp} {...subElementProps} type="number" variant="outlined" size="small" fullWidth />
        );
        break;
      case "textarea":
        element = (
          <TextField
            key={keyProp}
            {...subElementProps}
            multiline
            rows={options.rows || 4}
            placeholder={options.placeholder || "Enter text..."}
            variant="outlined"
            size="small"
            fullWidth
          />
        );
        break;
      default:
        element = (
          <TextField key={keyProp} {...subElementProps} type="text" variant="outlined" size="small" fullWidth />
        );
        break;
    }

    return <div className={`p-2 self-stretch ${className}`}>{element}</div>;
  }),
);

export default DynamicTextV2;
