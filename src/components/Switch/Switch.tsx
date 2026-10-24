import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "@/utils/cx";
import type { Size } from "@/utils/types";
import styles from "./Switch.module.css";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: ReactNode;
  description?: ReactNode;
  size?: Exclude<Size, "lg">;
  /** Put the label before the switch. */
  labelPosition?: "left" | "right";
}

/** An on/off toggle. Use a Checkbox when the change needs a form submit; a Switch applies immediately. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, description, size = "md", labelPosition = "right", id, className, disabled, ...rest },
  ref,
) {
  const generated = useId();
  const inputId = id ?? generated;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const text = (label || description) && (
    <span className={styles.text}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      {description && (
        <span id={descriptionId} className={styles.description}>
          {description}
        </span>
      )}
    </span>
  );
  return (
    <div className={cx(styles.root, disabled && styles.disabled, className)}>
      {labelPosition === "left" && text}
      <span className={cx(styles.control, styles[size])}>
        <input ref={ref} id={inputId} type="checkbox" role="switch" className={styles.input} disabled={disabled} aria-describedby={descriptionId} {...rest} />
        <span className={styles.track} aria-hidden="true">
          <span className={styles.thumb} />
        </span>
      </span>
      {labelPosition === "right" && text}
    </div>
  );
});
