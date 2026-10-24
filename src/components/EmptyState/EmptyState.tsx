import type { ReactNode } from "react";
import { IconInbox } from "@/icons";
import { cx } from "@/utils/cx";
import styles from "./EmptyState.module.css";

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Primary call to action, usually a Button. */
  action?: ReactNode;
  /** Smaller spacing for use inside cards and tables. */
  compact?: boolean;
  className?: string;
}

/** Explains why a list is empty and what to do next. */
export function EmptyState({ title, description, icon = <IconInbox size={28} />, action, compact = false, className }: EmptyStateProps) {
  return (
    <div className={cx(styles.root, compact && styles.compact, className)}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
