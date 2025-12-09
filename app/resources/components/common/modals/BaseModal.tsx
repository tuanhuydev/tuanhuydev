"use client";

import { Button } from "@resources/components/common/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@resources/components/common/Dialog";
import { X } from "lucide-react";
import React, { PropsWithChildren } from "react";

export interface ConfirmBoxProps extends PropsWithChildren {
  open: boolean;
  title?: string;
  closable?: boolean;
  className?: string;
  onClose: () => void;
  prefix?: React.ReactNode;
}

const BaseModal = React.forwardRef(
  ({ open, closable = false, title, children, onClose, className = "", prefix }: ConfirmBoxProps, ref: any) => {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className={className} hideCloseButton={!closable}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              {prefix && <div>{prefix}</div>}
              {title && <DialogTitle>{title}</DialogTitle>}
            </div>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  },
);
BaseModal.displayName = "BaseModal";

export default BaseModal;
