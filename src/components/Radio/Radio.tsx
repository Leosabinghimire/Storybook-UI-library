import { createContext, forwardRef, useContext, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { useControllableState } from "@/hooks/useControllableState";
import { cx } from "@/utils/cx";
import styles from "./Radio.module.css";

interface RadioGroupContextValue {
  name: string;
  value: string | null;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  /** Group label, rendered as the fieldset legend. */
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  name?: string;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  disabled?: boolean;
  /** Lay the options out horizontally. */
  inline?: boolean;
  className?: string;
  children: ReactNode;
}

export function RadioGroup({ label, description, error, name, value, defaultValue = null, onChange, disabled, inline, className, children }: RadioGroupProps) {
  const generatedName = useId();
  const [current, setCurrent] = useControllableState<string | null>({ value, defaultValue, onChange: onChange as ((v: string | null) => void) | undefined });
  const errorId = `${generatedName}-error`;
  const descriptionId = `${generatedName}-description`;
  return (
    <fieldset
      className={cx(styles.group, className)}
      disabled={disabled}
      aria-describedby={[description ? descriptionId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined}
      aria-invalid={error ? true : undefined}
    >
      {label && <legend className={styles.legend}>{label}</legend>}
      {description && (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      )}
      <div className={cx(styles.options, inline && styles.inline)}>
        <RadioGroupContext.Provider value={{ name: name ?? generatedName, value: current, disabled, onChange: (v) => setCurrent(v) }}>{children}</RadioGroupContext.Provider>
      </div>
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "size"> {
  value: string;
  label: ReactNode;
  description?: ReactNode;
}

/** A single option. Place inside a RadioGroup, which manages the selected value. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({ value, label, description, id, className, disabled, onChange, ...rest }, ref) {
  const group = useContext(RadioGroupContext);
  const generated = useId();
  const inputId = id ?? generated;
  const isDisabled = disabled || group?.disabled;
  return (
    <div className={cx(styles.root, isDisabled && styles.disabled, className)}>
      <span className={styles.control}>
        <input
          ref={ref}
          id={inputId}
          type="radio"
          className={styles.input}
          name={group?.name}
          value={value}
          checked={group ? group.value === value : undefined}
          disabled={isDisabled}
          onChange={(event) => {
            group?.onChange(value);
            onChange?.(event);
          }}
          {...rest}
        />
        <span className={styles.circle} aria-hidden="true" />
      </span>
      <span className={styles.text}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        {description && <span className={styles.description}>{description}</span>}
      </span>
    </div>
  );
});
