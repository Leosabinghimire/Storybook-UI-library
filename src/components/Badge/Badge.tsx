import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "@/utils/cx";
import type { Size, Tone } from "@/utils/types";
import styles from "./Badge.module.css";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  /** soft = tinted background (default), solid = filled, outline = border only. */
  variant?: "soft" | "solid" | "outline";
  size?: Exclude<Size, "lg">;
  /** Leading dot in the tone color, useful for status lists. */
  dot?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function Badge({ tone = "neutral", variant = "soft", size = "md", dot = false, icon, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cx(styles.root, styles[tone], styles[variant], styles[size], className)} {...rest}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </span>
  );
}
