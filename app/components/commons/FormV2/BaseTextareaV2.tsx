"use client";

import { FormHelperText } from "@mui/material";
import React, { memo } from "react";

export interface BaseTextareaV2Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
  error: boolean;
  isSubmitting?: boolean;
  helperText?: string;
}

const BaseTextareaV2 = memo(function BaseTextareaV2({
  className = "",
  minRows = 4,
  style,
  error = false,
  isSubmitting,
  helperText,
  ...restProps
}: BaseTextareaV2Props) {
  const defaultClasses =
    "w-full font-sans rounded-md border bg-white p-3 text-sm outline-none transition-all " +
    "placeholder:text-slate-400 placeholder:opacity-100 placeholder:text-sm placeholder:font-normal " +
    "dark:bg-slate-800 dark:text-slate-50 " +
    (error
      ? "focus:ring-1 focus:ring-[#d32f2f]"
      : "border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-1 focus:ring-primary") +
    (isSubmitting ? " bg-slate-50 cursor-not-allowed" : "");

  return (
    <div className="self-stretch">
      <textarea
        rows={minRows}
        className={`${defaultClasses} ${className}`}
        style={{
          ...style,
          ...(error && { borderColor: "#d32f2f" }),
          ...(error && ({ "--tw-ring-color": "#d32f2f" } as any)),
        }}
        placeholder={restProps.placeholder}
        disabled={isSubmitting}
        {...restProps}
      />
      {error && helperText && (
        <FormHelperText error={error} sx={{ margin: "0.25rem 0.875rem" }}>
          {helperText}
        </FormHelperText>
      )}
    </div>
  );
});

BaseTextareaV2.displayName = "BaseTextareaV2";

export default BaseTextareaV2;
