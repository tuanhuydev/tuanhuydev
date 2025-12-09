"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@resources/components/common/Dialog";
import { cn } from "@resources/utils/helper";
import React, { memo } from "react";

export interface ModalProps {
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

const Modal = memo(function Modal({
  open,
  closable = true,
  title,
  children,
  onClose,
  className = "",
  prefix,
  maxWidth = "sm",
}: ModalProps) {
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

export default Modal;
