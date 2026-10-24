import { useId, type ReactNode } from "react";
import { cx } from "@/utils/cx";
import styles from "./FormField.module.css";

export interface FormFieldBaseProps {
  label?: ReactNode;
  /** Helper text shown under the control. */
  hint?: ReactNode;
  /** Validation message. When set, the control is marked invalid and the message replaces the hint. */
  error?: ReactNode;
  required?: boolean;
}

export interface FormFieldRenderProps {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
  "aria-required": true | undefined;
}

export interface FormFieldProps extends FormFieldBaseProps {
  /** Id for the control; generated when omitted. */
  id?: string;
  className?: string;
  /** Render the control, spreading the given props on it so label, hint and error are wired up. */
  children: (props: FormFieldRenderProps) => ReactNode;
}

/** Label + control + hint/error with the right ARIA relationships. Inputs in this library use it internally. */
export function FormField({ id, label, hint, error, required, className, children }: FormFieldProps) {
  const generated = useId();
  const controlId = id ?? generated;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cx(styles.root, className)}>
      {label && (
        <label htmlFor={controlId} className={styles.label}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children({ id: controlId, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined, "aria-required": required || undefined })}
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className={styles.hint}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}
