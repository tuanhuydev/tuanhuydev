import BaseModal from "./BaseModal";
import { Button } from "@app/components/ui/button";
import { PropsWithChildren } from "react";

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
    <BaseModal open={open} onClose={onClose} title={title}>
      {description && <p className=" mt-0 mb-4">{description}</p>}
      <div className="flex gap-2 justify-end w-full self-end">
        <Button variant="outline" onClick={cancel}>
          {cancelLabel}
        </Button>
        <Button onClick={confirm}>{confirmLabel}</Button>
      </div>
    </BaseModal>
  );
}
