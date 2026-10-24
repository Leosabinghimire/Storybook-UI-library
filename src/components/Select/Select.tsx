import { forwardRef, type SelectHTMLAttributes } from "react";
import { FormField, type FormFieldBaseProps } from "@/components/FormField/FormField";
import { IconChevronDown } from "@/icons";
import { cx } from "@/utils/cx";
import type { Size } from "@/utils/types";
import inputStyles from "@/components/Input/Input.module.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">, FormFieldBaseProps {
  options: SelectOption[];
  /** Shown as a disabled first option while nothing is selected. */
  placeholder?: string;
  size?: Size;
  wrapperClassName?: string;
}

/** Native select styled like the other inputs: keyboard and screen-reader behavior come from the browser. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, placeholder, label, hint, error, required, size = "md", id, className, wrapperClassName, defaultValue, ...rest },
  ref,
) {
  const uncontrolledDefault = rest.value === undefined ? (defaultValue ?? "") : undefined;
  return (
    <FormField id={id} label={label} hint={hint} error={error} required={required} className={wrapperClassName}>
      {(field) => (
        <div className={inputStyles.wrapper}>
          <select ref={ref} className={cx(inputStyles.control, inputStyles.select, inputStyles[size], className)} defaultValue={uncontrolledDefault} {...field} {...rest}>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <span className={cx(inputStyles.section, inputStyles.right)}>
            <IconChevronDown size={16} />
          </span>
        </div>
      )}
    </FormField>
  );
});
