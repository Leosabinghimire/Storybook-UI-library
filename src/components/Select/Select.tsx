import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { FormField, type FormFieldBaseProps } from "@/components/FormField/FormField";
import { useControllableState } from "@/hooks/useControllableState";
import { IconCheck, IconChevronDown } from "@/icons";
import { cx } from "@/utils/cx";
import type { Size } from "@/utils/types";
import inputStyles from "@/components/Input/Input.module.css";
import styles from "./Select.module.css";

export interface SelectOption {
  value: string;
  label: string;
  /** Secondary line under the label. */
  description?: string;
  disabled?: boolean;
}

export interface SelectProps extends FormFieldBaseProps {
  options: SelectOption[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: Size;
  disabled?: boolean;
  /** Submitted with forms through a hidden input. */
  name?: string;
  id?: string;
  /** Content shown before the selected label, e.g. an icon. */
  leftSection?: ReactNode;
  className?: string;
  wrapperClassName?: string;
}

/**
 * Themed single-select built on the combobox + listbox pattern. The list is rendered by the
 * library (rounded, themed, scrollable) instead of the operating system. Keyboard: Arrow keys move,
 * Enter/Space select, Escape closes, Home/End jump, typing jumps to a matching option.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { options, value, defaultValue = null, onChange, placeholder = "Select…", size = "md", disabled, name, id, label, hint, error, required, leftSection, className, wrapperClassName },
  ref,
) {
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: "", at: 0 });
  useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);

  const [selected, setSelected] = useControllableState<string | null>({ value, defaultValue, onChange: onChange as ((v: string | null) => void) | undefined });
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const enabled = options.filter((o) => !o.disabled);
  const selectedIndex = options.findIndex((o) => o.value === selected);
  const [active, setActive] = useState(Math.max(0, selectedIndex));
  const current = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const openList = () => {
    if (disabled) return;
    const trigger = triggerRef.current;
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      setPlacement(window.innerHeight - rect.bottom < 300 && rect.top > 300 ? "top" : "bottom");
    }
    const start = selectedIndex >= 0 ? selectedIndex : options.findIndex((o) => !o.disabled);
    setActive(Math.max(0, start));
    setOpen(true);
  };
  const closeList = (refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };
  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    setSelected(option.value);
    closeList();
  };
  const moveActive = (delta: number) => {
    if (enabled.length === 0) return;
    const position = enabled.findIndex((o) => o === options[active]);
    const next = enabled[(position + delta + enabled.length) % enabled.length];
    if (next) setActive(options.indexOf(next));
  };

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelectorAll<HTMLElement>("[role='option']")[active]?.scrollIntoView?.({ block: "nearest" });
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      const root = triggerRef.current?.parentElement;
      if (root && !root.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        if (!open) openList();
        else moveActive(event.key === "ArrowDown" ? 1 : -1);
        return;
      case "Home":
      case "End":
        if (!open) return;
        event.preventDefault();
        setActive(options.indexOf(event.key === "Home" ? enabled[0]! : enabled[enabled.length - 1]!));
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) choose(active);
        else openList();
        return;
      case "Escape":
        if (open) {
          event.preventDefault();
          closeList();
        }
        return;
      case "Tab":
        if (open) closeList(false);
        return;
    }
    if (event.key.length === 1 && /\S/.test(event.key)) {
      const now = Date.now();
      const text = (now - typeahead.current.at < 600 ? typeahead.current.text : "") + event.key.toLowerCase();
      typeahead.current = { text, at: now };
      const match = enabled.find((o) => o.label.toLowerCase().startsWith(text));
      if (!match) return;
      const index = options.indexOf(match);
      if (open) setActive(index);
      else setSelected(match.value);
    }
  };

  return (
    <FormField id={id} label={label} hint={hint} error={error} required={required} className={wrapperClassName}>
      {(field) => (
        <div className={cx(inputStyles.wrapper, styles.root)}>
          <button
            ref={triggerRef}
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-activedescendant={open ? `${listId}-${active}` : undefined}
            disabled={disabled}
            className={cx(inputStyles.control, inputStyles.select, inputStyles[size], styles.trigger, leftSection ? inputStyles.withLeft : undefined, className)}
            onClick={() => (open ? closeList() : openList())}
            onKeyDown={onKeyDown}
            {...field}
          >
            {leftSection && <span className={cx(inputStyles.section, inputStyles.left)}>{leftSection}</span>}
            <span className={cx(styles.value, !current && styles.placeholder)}>{current ? current.label : placeholder}</span>
          </button>
          <span className={cx(inputStyles.section, inputStyles.right, styles.chevron, open && styles.chevronOpen)}>
            <IconChevronDown size={16} />
          </span>
          {name && <input type="hidden" name={name} value={selected ?? ""} />}
          {open && (
            <ul ref={listRef} id={listId} role="listbox" aria-labelledby={label ? undefined : field.id} className={cx(styles.list, placement === "top" && styles.listTop)}>
              {options.map((option, index) => {
                const isSelected = option.value === selected;
                return (
                  <li
                    key={option.value}
                    id={`${listId}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    className={cx(styles.option, index === active && styles.active, isSelected && styles.selected, option.disabled && styles.disabled)}
                    onMouseEnter={() => !option.disabled && setActive(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => choose(index)}
                  >
                    <span className={styles.optionText}>
                      <span className={styles.optionLabel}>{option.label}</span>
                      {option.description && <span className={styles.optionDescription}>{option.description}</span>}
                    </span>
                    {isSelected && <IconCheck size={16} className={styles.check} />}
                  </li>
                );
              })}
              {options.length === 0 && <li className={styles.empty}>No options</li>}
            </ul>
          )}
        </div>
      )}
    </FormField>
  );
});
