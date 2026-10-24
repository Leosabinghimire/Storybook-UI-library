import type { HTMLAttributes, ReactNode } from "react";
import { IconButton } from "@/components/IconButton/IconButton";
import { IconAlertTriangle, IconCircleCheck, IconCircleX, IconInfo, IconX } from "@/icons";
import { cx } from "@/utils/cx";
import type { Tone } from "@/utils/types";
import styles from "./Alert.module.css";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: Tone;
  title?: ReactNode;
  /** Replace the default tone icon. Pass `null` to hide it. */
  icon?: ReactNode | null;
  /** Shows a close button that calls this handler. */
  onDismiss?: () => void;
  children?: ReactNode;
}

export const TONE_ICON: Record<Tone, ReactNode> = {
  neutral: <IconInfo size={18} />,
  primary: <IconInfo size={18} />,
  info: <IconInfo size={18} />,
  success: <IconCircleCheck size={18} />,
  warning: <IconAlertTriangle size={18} />,
  danger: <IconCircleX size={18} />,
};

/** Inline message that stays on the page. For transient messages use toasts. */
export function Alert({ tone = "info", title, icon, onDismiss, className, children, role, ...rest }: AlertProps) {
  const resolvedIcon = icon === undefined ? TONE_ICON[tone] : icon;
  return (
    <div className={cx(styles.root, styles[tone], className)} role={role ?? (tone === "danger" || tone === "warning" ? "alert" : "status")} {...rest}>
      {resolvedIcon && <span className={styles.icon}>{resolvedIcon}</span>}
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.body}>{children}</div>}
      </div>
      {onDismiss && <IconButton size="sm" label="Dismiss" icon={<IconX size={16} />} onClick={onDismiss} className={styles.close} />}
    </div>
  );
}
