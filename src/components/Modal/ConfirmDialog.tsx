import type { ReactNode } from "react";
import { Button } from "@/components/Button/Button";
import { Modal, type ModalProps } from "./Modal";

export interface ConfirmDialogProps extends Pick<ModalProps, "open" | "onClose" | "title" | "size"> {
  /** The question or consequence, e.g. "This cannot be undone." */
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Red confirm button for irreversible actions. */
  destructive?: boolean;
  /** Spinner on the confirm button; the dialog cannot be dismissed while true. */
  loading?: boolean;
  onConfirm: () => void;
}

/** A small modal that asks the user to confirm an action. */
export function ConfirmDialog({
  open,
  onClose,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  size = "sm",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size={size}
      dismissible={!loading}
      hideCloseButton
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? "danger" : "primary"} onClick={onConfirm} loading={loading} data-autofocus>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {message}
    </Modal>
  );
}
