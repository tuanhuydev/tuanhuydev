"use client";

import { Input as BaseInput } from "@resources/components/common/Input";
import { Label } from "@resources/components/common/Label";
import { cn } from "@resources/utils/helper";
import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: React.ReactNode;
  label?: string;
  error?: boolean;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className = "", startAdornment, label, error, helperText, id, ...restProps } = props;

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={inputId} className="mb-1.5">
          {label}
        </Label>
      )}
      <div className="relative">
        {startAdornment && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">{startAdornment}</div>
        )}
        <BaseInput
          ref={ref}
          id={inputId}
          className={cn(error && "border-red-500", startAdornment && "pl-10", className)}
          {...restProps}
        />
      </div>
      {helperText && (
        <p className={cn("text-sm mt-1.5 mx-3.5", error ? "text-red-500" : "text-muted-foreground")}>{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
