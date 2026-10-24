import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { TONE_ICON } from "@/components/Alert/Alert";
import { IconButton } from "@/components/IconButton/IconButton";
import { IconX } from "@/icons";
import { cx } from "@/utils/cx";
import type { Tone } from "@/utils/types";
import styles from "./Toast.module.css";

export interface ToastOptions {
  title?: ReactNode;
  message: ReactNode;
  tone?: Tone;
  /** Milliseconds before auto-dismiss. 0 keeps the toast until closed. */
  duration?: number;
  /** Optional action button. */
  action?: { label: string; onClick: () => void };
}

export interface ToastInstance extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  show: (options: ToastOptions) => number;
  success: (message: ReactNode, title?: ReactNode) => number;
  error: (message: ReactNode, title?: ReactNode) => number;
  warning: (message: ReactNode, title?: ReactNode) => number;
  info: (message: ReactNode, title?: ReactNode) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export type ToastPosition = "top-right" | "top-center" | "bottom-right" | "bottom-center";

export interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  /** Maximum toasts shown at once; older ones are dropped. */
  limit?: number;
  defaultDuration?: number;
}

/** Mount once near the app root, then call `useToast()` anywhere. */
export function ToastProvider({ children, position = "top-right", limit = 4, defaultDuration = 5000 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((current) => current.filter((t) => t.id !== id)), []);
  const show = useCallback(
    (options: ToastOptions) => {
      const id = ++counter.current;
      setToasts((current) => [...current, { id, duration: defaultDuration, tone: "neutral" as Tone, ...options }].slice(-limit));
      return id;
    },
    [defaultDuration, limit],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      dismiss,
      success: (message, title) => show({ message, title, tone: "success" }),
      error: (message, title) => show({ message, title, tone: "danger", duration: 8000 }),
      warning: (message, title) => show({ message, title, tone: "warning" }),
      info: (message, title) => show({ message, title, tone: "info" }),
    }),
    [show, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div role="region" aria-label="Notifications" aria-live="polite" className={cx(styles.region, styles[position])}>
            {toasts.map((toast) => (
              <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastInstance; onDismiss: () => void }) {
  const tone = toast.tone ?? "neutral";
  useEffect(() => {
    if (!toast.duration) return;
    const timer = setTimeout(onDismiss, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onDismiss]);
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cx(styles.toast, styles[tone])}>
      <span className={styles.icon}>{TONE_ICON[tone]}</span>
      <div className={styles.content}>
        {toast.title && <p className={styles.title}>{toast.title}</p>}
        <p className={styles.message}>{toast.message}</p>
        {toast.action && (
          <button
            type="button"
            className={styles.action}
            onClick={() => {
              toast.action?.onClick();
              onDismiss();
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <IconButton size="sm" label="Dismiss notification" icon={<IconX size={16} />} onClick={onDismiss} className={styles.close} />
    </div>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>.");
  return context;
}
