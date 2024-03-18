import BaseButton from "../buttons/BaseButton";
import { Modal as BaseModal } from "@mui/base/Modal";
import React, { PropsWithChildren } from "react";

export interface ConfirmBoxProps extends PropsWithChildren {
  open: boolean;
  title?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onClose: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export default function ConfirmBox({
  open,
  title,
  description,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  onCancel,
  onClose,
  onConfirm,
}: ConfirmBoxProps) {
  const confirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };
  const cancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      slots={{
        root: ({ children }: PropsWithChildren) => <div>{children}</div>,
        backdrop: ({ children }: PropsWithChildren) => (
          <div className="absolute top-0 z-[2000] w-screen h-screen bg-slate-50 opacity-50 ">{children}</div>
        ),
      }}>
      <div className="z-[3000] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 bg-white border border-solid border-slate-100 shadow-sm rounded-md flex flex-col">
        {title && <h4 className="text-lg mt-0 mb-3">{title}</h4>}
        {description && <p className=" mt-0 mb-3">{description}</p>}
        <div className="flex gap-2 justify-end w-full self-end">
          <BaseButton variants="outline" onClick={cancel} label={cancelLabel}></BaseButton>
          <BaseButton onClick={confirm} label={confirmLabel}></BaseButton>
        </div>
      </div>
    </BaseModal>
  );
}
