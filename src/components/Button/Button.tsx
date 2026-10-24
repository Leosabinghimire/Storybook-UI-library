import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Spinner } from "@/components/Spinner/Spinner";
import { cx } from "@/utils/cx";
import type { Size } from "@/utils/types";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual hierarchy: primary for the main action, secondary/outline for the rest, ghost for low emphasis. */
  variant?: ButtonVariant;
  size?: Size;
  /** Shows a spinner and disables the button while keeping its width stable. */
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, leftIcon, rightIcon, fullWidth = false, disabled, className, children, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(styles.root, styles[variant], styles[size], fullWidth && styles.fullWidth, loading && styles.loading, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <span className={styles.spinner}>
          <Spinner size={size === "lg" ? 20 : 16} />
        </span>
      )}
      <span className={styles.content}>
        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        {children}
        {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </span>
    </button>
  );
});
