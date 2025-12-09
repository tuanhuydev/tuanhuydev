"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@app/components/ui/dialog";
import { cn } from "@app/lib/utils";
import React, { memo } from "react";

export interface BaseModalV2Props {
  open: boolean;
  title?: string;
  closable?: boolean;
  className?: string;
  onClose: () => void;
  prefix?: React.ReactNode;
  children?: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

const maxWidthClasses = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const BaseModalV2 = memo(function BaseModalV2({
  open,
  closable = true,
  title,
  children,
  onClose,
  className = "",
  prefix,
  maxWidth = "sm",
}: BaseModalV2Props) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closable && onClose()}>
      <DialogContent className={cn(maxWidth && maxWidthClasses[maxWidth], className)}>
        {closable === false && (
          <style jsx global>{`
            [data-radix-dialog-content] > button[aria-label="Close"] {
              display: none !important;
            }
          `}</style>
        )}
        {(title || prefix) && (
          <DialogHeader>
            <div className="flex items-center gap-2">
              {prefix && <div>{prefix}</div>}
              {title && <DialogTitle>{title}</DialogTitle>}
            </div>
          </DialogHeader>
        )}
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
});

export default BaseModalV2;
