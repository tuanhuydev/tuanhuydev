import BaseModal from "./BaseModal";
import styles from "./ConfirmBox.module.css";
import { Button } from "@resources/components/common/Button";
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
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.actions}>
        <Button variant="outline" onClick={cancel}>
          {cancelLabel}
        </Button>
        <Button onClick={confirm}>{confirmLabel}</Button>
      </div>
    </BaseModal>
  );
}
