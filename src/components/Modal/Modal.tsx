import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IconButton } from "@/components/IconButton/IconButton";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { IconX } from "@/icons";
import { cx } from "@/utils/cx";
import styles from "./Modal.module.css";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Buttons, right-aligned. */
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  /** Close when clicking the backdrop or pressing Escape. Set false while a request is in flight. */
  dismissible?: boolean;
  /** Hide the top-right close button. */
  hideCloseButton?: boolean;
  className?: string;
}

/**
 * Accessible dialog: rendered in a portal, traps focus, closes on Escape and backdrop click, restores
 * focus when closed. Mark the field that should receive focus with `data-autofocus`.
 */
export function Modal({ open, onClose, title, description, children, footer, size = "md", dismissible = true, hideCloseButton = false, className }: ModalProps) {
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dismissible) {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, dismissible, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && dismissible && onClose()}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `${id}-title` : undefined}
        aria-describedby={description ? `${id}-description` : undefined}
        className={cx(styles.panel, styles[size], className)}
        tabIndex={-1}
      >
        {(title || !hideCloseButton) && (
          <div className={styles.header}>
            <div className={styles.headerText}>
              {title && (
                <h2 id={`${id}-title`} className={styles.title}>
                  {title}
                </h2>
              )}
              {description && (
                <p id={`${id}-description`} className={styles.description}>
                  {description}
                </p>
              )}
            </div>
            {!hideCloseButton && <IconButton label="Close" icon={<IconX size={18} />} onClick={onClose} className={styles.close} />}
          </div>
        )}
        {children !== undefined && <div className={styles.body}>{children}</div>}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
