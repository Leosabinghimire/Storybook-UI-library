import type { CSSProperties } from "react";
import { cx } from "@/utils/cx";
import styles from "./Skeleton.module.css";

export interface SkeletonProps {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  /** Round placeholder for avatars. */
  circle?: boolean;
  className?: string;
}

export function Skeleton({ width = "100%", height = "1rem", circle = false, className }: SkeletonProps) {
  return <span aria-hidden="true" className={cx(styles.root, circle && styles.circle, className)} style={{ width, height: circle ? width : height }} />;
}

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

/** Several text-like lines, the last one shorter. */
export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <span className={cx(styles.text, className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} height="0.875rem" width={i === lines - 1 && lines > 1 ? "60%" : "100%"} />
      ))}
    </span>
  );
}
