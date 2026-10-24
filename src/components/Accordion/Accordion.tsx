import { useId, type ReactNode } from "react";
import { useControllableState } from "@/hooks/useControllableState";
import { IconChevronDown } from "@/icons";
import { cx } from "@/utils/cx";
import styles from "./Accordion.module.css";

export interface AccordionItem {
  value: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Open item values. */
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** Allow several items open at once. */
  multiple?: boolean;
  /** separated = each item is its own card; default = one bordered list. */
  variant?: "default" | "separated";
  className?: string;
}

/** Collapsible sections. Headers are buttons with aria-expanded; panels are labelled regions. */
export function Accordion({ items, value, defaultValue = [], onChange, multiple = false, variant = "default", className }: AccordionProps) {
  const id = useId();
  const [open, setOpen] = useControllableState({ value, defaultValue, onChange });

  const toggle = (item: string) => {
    if (open.includes(item)) setOpen(open.filter((v) => v !== item));
    else setOpen(multiple ? [...open, item] : [item]);
  };

  return (
    <div className={cx(styles.root, styles[variant], className)}>
      {items.map((item) => {
        const expanded = open.includes(item.value);
        return (
          <div key={item.value} className={cx(styles.item, expanded && styles.expanded)}>
            <h3 className={styles.heading}>
              <button
                type="button"
                id={`${id}-trigger-${item.value}`}
                aria-expanded={expanded}
                aria-controls={`${id}-panel-${item.value}`}
                disabled={item.disabled}
                className={styles.trigger}
                onClick={() => toggle(item.value)}
              >
                <span className={styles.title}>{item.title}</span>
                <IconChevronDown size={16} className={styles.chevron} />
              </button>
            </h3>
            <div id={`${id}-panel-${item.value}`} role="region" aria-labelledby={`${id}-trigger-${item.value}`} hidden={!expanded} className={styles.panel}>
              <div className={styles.content}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
