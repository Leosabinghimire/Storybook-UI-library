import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "@/utils/cx";
import type { Tone } from "@/utils/types";
import styles from "./StatusIndicator.module.css";

export type Status = "online" | "offline" | "busy" | "away" | "pending";

const STATUS_TONE: Record<Status, Tone> = { online: "success", offline: "neutral", busy: "danger", away: "warning", pending: "info" };

export interface StatusIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  /** Named status (maps to a tone) or a tone directly. */
  status?: Status;
  tone?: Tone;
  /** Visible text. Without it, pass `aria-label` or wrap the indicator in labelled content. */
  label?: ReactNode;
  /** Pulsing ring to show live activity. */
  pulse?: boolean;
  size?: "sm" | "md";
}

/** A colored dot with an optional label: "Online", "Syncing", "Failed", … */
export function StatusIndicator({ status, tone, label, pulse = false, size = "md", className, ...rest }: StatusIndicatorProps) {
  const resolvedTone: Tone = tone ?? (status ? STATUS_TONE[status] : "neutral");
  return (
    <span className={cx(styles.root, styles[size], className)} {...rest}>
      <span className={cx(styles.dot, styles[resolvedTone], pulse && styles.pulse)} aria-hidden="true" />
      {label && <span className={styles.label}>{label}</span>}
    </span>
  );
}
