import { useId, useRef, type ReactNode } from "react";
import { useControllableState } from "@/hooks/useControllableState";
import { cx } from "@/utils/cx";
import styles from "./Tabs.module.css";

export interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** line = underlined tabs (default), pill = segmented buttons. */
  variant?: "line" | "pill";
  className?: string;
}

/** Tabs with the WAI-ARIA pattern: arrow keys move between tabs, Home/End jump to the ends. */
export function Tabs({ items, value, defaultValue, onChange, variant = "line", className }: TabsProps) {
  const id = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const firstEnabled = items.find((item) => !item.disabled)?.value ?? "";
  const [current, setCurrent] = useControllableState({ value, defaultValue: defaultValue ?? firstEnabled, onChange });

  const focusTab = (index: number) => {
    const tabs = listRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']:not(:disabled)");
    if (!tabs?.length) return;
    const target = tabs[(index + tabs.length) % tabs.length];
    target?.focus();
    const next = target?.dataset.value;
    if (next) setCurrent(next);
  };

  const onKeyDown = (event: React.KeyboardEvent, enabledIndex: number, enabledCount: number) => {
    const keys: Record<string, number> = { ArrowRight: enabledIndex + 1, ArrowLeft: enabledIndex - 1, Home: 0, End: enabledCount - 1 };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    focusTab(next);
  };

  const enabled = items.filter((item) => !item.disabled);
  const active = items.find((item) => item.value === current);

  return (
    <div className={cx(styles.root, className)}>
      <div ref={listRef} role="tablist" className={cx(styles.list, styles[variant])}>
        {items.map((item) => {
          const selected = item.value === current;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={`${id}-tab-${item.value}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${item.value}`}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              data-value={item.value}
              className={cx(styles.tab, selected && styles.selected)}
              onClick={() => setCurrent(item.value)}
              onKeyDown={(event) => onKeyDown(event, enabled.indexOf(item), enabled.length)}
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              {item.label}
            </button>
          );
        })}
      </div>
      {active && (
        <div role="tabpanel" id={`${id}-panel-${active.value}`} aria-labelledby={`${id}-tab-${active.value}`} tabIndex={0} className={styles.panel}>
          {active.content}
        </div>
      )}
    </div>
  );
}
