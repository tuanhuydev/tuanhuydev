"use client";

import { Textarea as BaseTextarea } from "@resources/components/common/Textarea";
import { cn } from "@resources/utils/helper";
import React, { memo } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
  error: boolean;
  isSubmitting?: boolean;
  helperText?: string;
}

const Textarea = memo(function Textarea({
  className = "",
  minRows = 4,
  style,
  error = false,
  isSubmitting,
  helperText,
  ...restProps
}: TextareaProps) {
  return (
    <div className="self-stretch">
      <BaseTextarea
        rows={minRows}
        className={cn(error && "border-red-500 focus-visible:ring-red-500", className)}
        disabled={isSubmitting}
        {...restProps}
      />
      {error && helperText && <p className="text-sm text-red-500 mt-1.5 mx-3.5">{helperText}</p>}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;
