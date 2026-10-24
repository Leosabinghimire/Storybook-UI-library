import { forwardRef, type SelectHTMLAttributes } from "react";
import { FormField, type FormFieldBaseProps } from "@/components/FormField/FormField";
import { IconChevronDown } from "@/icons";
import { cx } from "@/utils/cx";
import type { Size } from "@/utils/types";
import inputStyles from "@/components/Input/Input.module.css";

export interface NativeSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface NativeSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">, FormFieldBaseProps {
  options: NativeSelectOption[];
  /** Shown as a disabled first option while nothing is selected. */
  placeholder?: string;
  size?: Size;
  wrapperClassName?: string;
}

/**
 * The browser's own <select>, styled like the other inputs. The open list is drawn by the OS, so it
 * cannot be themed; use it where native behavior matters more (e.g. mobile forms). See `Select` for the
 * themed version.
 */
export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(function NativeSelect(
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
