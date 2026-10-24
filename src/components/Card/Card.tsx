import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "@/utils/cx";
import styles from "./Card.module.css";

const PADDING = { none: styles.paddingNone, sm: styles.paddingSm, md: styles.paddingMd, lg: styles.paddingLg } as const;

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  /** Right-aligned header content, e.g. buttons or a menu. */
  actions?: ReactNode;
  footer?: ReactNode;
  /** "none" removes body padding for edge-to-edge content such as tables. */
  padding?: "none" | "sm" | "md" | "lg";
  /** Lift the card with a shadow instead of a flat border. */
  elevated?: boolean;
  children?: ReactNode;
}

/** The standard surface: optional header (title, description, actions), body and footer. */
export function Card({ title, description, actions, footer, padding = "md", elevated = false, className, children, ...rest }: CardProps) {
  const hasHeader = Boolean(title || description || actions);
  return (
    <div className={cx(styles.root, elevated && styles.elevated, className)} {...rest}>
      {hasHeader && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      {children !== undefined && <div className={cx(styles.body, PADDING[padding])}>{children}</div>}
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
