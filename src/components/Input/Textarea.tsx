import { forwardRef, type TextareaHTMLAttributes } from "react";
import { FormField, type FormFieldBaseProps } from "@/components/FormField/FormField";
import { cx } from "@/utils/cx";
import styles from "./Input.module.css";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FormFieldBaseProps {
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, required, id, className, wrapperClassName, rows = 4, ...rest },
  ref,
) {
  return (
    <FormField id={id} label={label} hint={hint} error={error} required={required} className={wrapperClassName}>
      {(field) => <textarea ref={ref} rows={rows} className={cx(styles.control, styles.textarea, className)} {...field} {...rest} />}
    </FormField>
  );
});
