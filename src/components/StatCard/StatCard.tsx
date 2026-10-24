import type { ReactNode } from "react";
import { IconArrowDown, IconArrowUp } from "@/icons";
import { cx } from "@/utils/cx";
import styles from "./StatCard.module.css";

export interface StatCardProps {
  label: string;
  value: ReactNode;
  /** Change versus a previous period. Positive renders green, negative red (unless `invertTrend`). */
  delta?: number;
  /** Formats the delta, e.g. as a percentage. Defaults to a signed number. */
  formatDelta?: (delta: number) => string;
  /** For metrics where going down is good (errors, churn). */
  invertTrend?: boolean;
  hint?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

const defaultFormat = (delta: number) => `${delta > 0 ? "+" : ""}${delta}`;

/** A key metric with an optional trend and hint, for dashboards. */
export function StatCard({ label, value, delta, formatDelta = defaultFormat, invertTrend = false, hint, icon, className }: StatCardProps) {
  const positive = delta !== undefined && (invertTrend ? delta < 0 : delta > 0);
  const negative = delta !== undefined && (invertTrend ? delta > 0 : delta < 0);
  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.main}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
        {(delta !== undefined || hint) && (
          <span className={styles.meta}>
            {delta !== undefined && (
              <span className={cx(styles.delta, positive && styles.up, negative && styles.down)}>
                {delta > 0 ? <IconArrowUp size={12} /> : delta < 0 ? <IconArrowDown size={12} /> : null}
                {formatDelta(delta)}
              </span>
            )}
            {hint && <span className={styles.hint}>{hint}</span>}
          </span>
        )}
      </div>
      {icon && <span className={styles.icon}>{icon}</span>}
    </div>
  );
}
