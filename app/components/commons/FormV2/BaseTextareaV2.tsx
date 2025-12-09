"use client";

import { Textarea } from "@app/components/ui/textarea";
import { cn } from "@app/lib/utils";
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
  return (
    <div className="self-stretch">
      <Textarea
        rows={minRows}
        className={cn(error && "border-red-500 focus-visible:ring-red-500", className)}
        disabled={isSubmitting}
        {...restProps}
      />
      {error && helperText && <p className="text-sm text-red-500 mt-1.5 mx-3.5">{helperText}</p>}
    </div>
  );
});

BaseTextareaV2.displayName = "BaseTextareaV2";

export default BaseTextareaV2;
