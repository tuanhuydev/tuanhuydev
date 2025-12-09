"use client";

import { Input } from "@app/components/ui/input";
import { Label } from "@app/components/ui/label";
import { cn } from "@app/lib/utils";
import React from "react";

export interface BaseInputV2Props extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: React.ReactNode;
  label?: string;
  error?: boolean;
  helperText?: string;
}

export const BaseInputV2 = React.forwardRef<HTMLInputElement, BaseInputV2Props>((props, ref) => {
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
        <Input
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

BaseInputV2.displayName = "BaseInputV2";
export default BaseInputV2;
