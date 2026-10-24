import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { FormField, type FormFieldBaseProps } from "@/components/FormField/FormField";
import { cx } from "@/utils/cx";
import type { Size } from "@/utils/types";
import styles from "./Input.module.css";

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">, FormFieldBaseProps {
  size?: Size;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  /** Lets clicks reach the right section (e.g. a clear button). */
  rightSectionInteractive?: boolean;
  /** Class for the outer field wrapper. `className` goes on the input itself. */
  wrapperClassName?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { label, hint, error, required, size = "md", leftSection, rightSection, rightSectionInteractive, id, className, wrapperClassName, ...rest },
  ref,
) {
  return (
    <FormField id={id} label={label} hint={hint} error={error} required={required} className={wrapperClassName}>
      {(field) => (
        <div className={styles.wrapper}>
          {leftSection && <span className={cx(styles.section, styles.left)}>{leftSection}</span>}
          <input
            ref={ref}
            className={cx(styles.control, styles[size], leftSection ? styles.withLeft : undefined, rightSection ? styles.withRight : undefined, className)}
            {...field}
            {...rest}
          />
          {rightSection && <span className={cx(styles.section, styles.right, rightSectionInteractive ? styles.interactive : undefined)}>{rightSection}</span>}
        </div>
      )}
    </FormField>
  );
});
