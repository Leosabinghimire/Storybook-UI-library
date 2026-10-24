import { forwardRef, useEffect, useId, useImperativeHandle, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { IconCheck } from "@/icons";
import { cx } from "@/utils/cx";
import styles from "./Checkbox.module.css";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  /** Mixed state for "select all" controls. Visual only; `checked` still drives the value. */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, error, indeterminate = false, id, className, disabled, ...rest },
  ref,
) {
  const generated = useId();
  const inputId = id ?? generated;
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <div className={cx(styles.root, disabled && styles.disabled, className)}>
      <span className={styles.control}>
        <input
          ref={inputRef}
          id={inputId}
          type="checkbox"
          className={styles.input}
          disabled={disabled}
          aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
          aria-invalid={error ? true : undefined}
          {...rest}
        />
        <span className={styles.box} aria-hidden="true">
          {indeterminate ? <span className={styles.dash} /> : <IconCheck size={12} strokeWidth={3} />}
        </span>
      </span>
      {(label || description) && (
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
          {error && (
            <span id={errorId} className={styles.error} role="alert">
              {error}
            </span>
          )}
        </span>
      )}
    </div>
  );
});
