import { cx } from "@/utils/cx";
import type { Size } from "@/utils/types";
import styles from "./Spinner.module.css";

export interface SpinnerProps {
  size?: Size | number;
  /** Accessible name announced to screen readers. */
  label?: string;
  className?: string;
}

const SIZES: Record<Size, number> = { sm: 16, md: 24, lg: 36 };

export function Spinner({ size = "md", label = "Loading", className }: SpinnerProps) {
  const px = typeof size === "number" ? size : SIZES[size];
  return (
    <span role="status" aria-label={label} className={cx(styles.root, className)} style={{ width: px, height: px }}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  );
}
