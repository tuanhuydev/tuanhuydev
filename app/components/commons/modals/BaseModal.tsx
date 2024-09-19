"use client";

import BaseButton from "../buttons/BaseButton";
import { Modal as MuiBaseModal, ModalProps as MuiBaseModalProps } from "@mui/base/Modal";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import React, { forwardRef, PropsWithChildren } from "react";

export interface ConfirmBoxProps extends PropsWithChildren {
  open: boolean;
  title?: string;
  closable?: boolean;
  className?: string;
  onClose: () => void;
  prefix?: React.ReactNode;
  BaseModalProps?: Partial<MuiBaseModalProps>;
}

const CustomBackdrop = ({ children }: PropsWithChildren) => {
  return <div className="absolute top-0 z-[20] w-screen h-screen bg-slate-900 opacity-50">{children}</div>;
};

const CustomRoot = forwardRef<HTMLDivElement, PropsWithChildren>(({ children }, ref) => {
  return (
    <div ref={ref} className="z-[10]">
      {children}
    </div>
  );
});
CustomRoot.displayName = "CustomRoot";

const BaseModal = React.forwardRef(
  (
    { open, closable = false, title, children, onClose, className = "", BaseModalProps = {}, prefix }: ConfirmBoxProps,
    ref: any,
  ) => {
    return (
      <MuiBaseModal
        {...BaseModalProps}
        ref={ref}
        open={open}
        onClose={onClose}
        slots={{
          root: CustomRoot,
          backdrop: CustomBackdrop,
        }}>
        <div
          className={`z-[30] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 bg-white border-none rounded-md ${className}`}>
          <div className="flex justify-between items-center mb-3">
            {prefix && <div className="mr-2">{prefix}</div>}
            {title && <h4 className="text-lg m-0">{title}</h4>}
            {closable && <BaseButton icon={<CloseOutlined fontSize="small" />} variants="text" onClick={onClose} />}
          </div>
          {children && <div className=" mt-0 mb-4">{children}</div>}
        </div>
      </MuiBaseModal>
    );
  },
);
BaseModal.displayName = "BaseModal";

export default BaseModal;
