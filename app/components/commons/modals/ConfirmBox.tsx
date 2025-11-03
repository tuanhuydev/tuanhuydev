import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{description && <p className="mt-0 mb-4">{description}</p>}</DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={cancel}>
          {cancelLabel}
        </Button>
        <Button variant="contained" onClick={confirm}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
