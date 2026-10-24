import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import type { ButtonVariant } from "@/components/Button/Button";
import { cx } from "@/utils/cx";
import type { Size } from "@/utils/types";
import styles from "./IconButton.module.css";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Required accessible name; icon-only buttons have no visible text. */
  label: string;
  icon: ReactNode;
  variant?: Extract<ButtonVariant, "outline" | "ghost" | "primary" | "danger">;
  size?: Size;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, variant = "ghost", size = "md", className, type = "button", ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} aria-label={label} title={label} className={cx(styles.root, styles[variant], styles[size], className)} {...rest}>
      {icon}
    </button>
  );
});
