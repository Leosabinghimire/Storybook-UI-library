import { cloneElement, isValidElement, useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from "react";
import { cx } from "@/utils/cx";
import styles from "./Dropdown.module.css";

export interface DropdownItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Red text for destructive actions. */
  danger?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface DropdownProps {
  /** The trigger button. It receives aria-haspopup/aria-expanded and the click handler. */
  trigger: ReactElement<TriggerProps>;
  items: DropdownItem[];
  align?: "start" | "end";
  className?: string;
}

interface TriggerProps {
  id?: string;
  "aria-haspopup"?: "menu";
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  onClick?: (event: React.MouseEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

/** Action menu: opens on click, supports arrow keys, Home/End, Escape and click-outside. */
export function Dropdown({ trigger, items, align = "start", className }: DropdownProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const enabledIndexes = items.map((item, index) => (item.disabled ? -1 : index)).filter((i) => i >= 0);

  const openMenu = (focusLast = false) => {
    setActive(focusLast ? (enabledIndexes[enabledIndexes.length - 1] ?? 0) : (enabledIndexes[0] ?? 0));
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelectorAll<HTMLElement>("[role='menuitem']")[active]?.focus();
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const move = (delta: number) => {
    const position = enabledIndexes.indexOf(active);
    const next = enabledIndexes[(position + delta + enabledIndexes.length) % enabledIndexes.length];
    if (next !== undefined) setActive(next);
  };

  const onMenuKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        move(-1);
        break;
      case "Home":
        event.preventDefault();
        setActive(enabledIndexes[0] ?? 0);
        break;
      case "End":
        event.preventDefault();
        setActive(enabledIndexes[enabledIndexes.length - 1] ?? 0);
        break;
      case "Escape":
      case "Tab":
        setOpen(false);
        (rootRef.current?.firstElementChild as HTMLElement | null)?.focus();
        if (event.key === "Escape") event.preventDefault();
        break;
    }
  };

  const select = (item: DropdownItem) => {
    if (item.disabled) return;
    setOpen(false);
    item.onSelect?.();
    (rootRef.current?.firstElementChild as HTMLElement | null)?.focus();
  };

  if (!isValidElement(trigger)) return trigger;
  const triggerElement = cloneElement(trigger, {
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-controls": open ? id : undefined,
    onClick: (event: React.MouseEvent) => {
      trigger.props.onClick?.(event);
      if (open) setOpen(false);
      else openMenu();
    },
    onKeyDown: (event: React.KeyboardEvent) => {
      trigger.props.onKeyDown?.(event);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        openMenu();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        openMenu(true);
      }
    },
  });

  return (
    <div ref={rootRef} className={cx(styles.root, className)}>
      {triggerElement}
      {open && (
        <div ref={menuRef} id={id} role="menu" className={cx(styles.menu, align === "end" && styles.alignEnd)} onKeyDown={onMenuKeyDown}>
          {items.map((item, index) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              tabIndex={index === active ? 0 : -1}
              disabled={item.disabled}
              className={cx(styles.item, item.danger && styles.danger)}
              onClick={() => select(item)}
              onMouseEnter={() => !item.disabled && setActive(index)}
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
