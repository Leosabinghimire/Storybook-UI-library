import { IconChevronLeft, IconChevronRight } from "@/icons";
import { cx } from "@/utils/cx";
import styles from "./Pagination.module.css";

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  /** Hide the "Showing x–y of z" text. */
  hideSummary?: boolean;
  /** Number of page buttons around the current page. */
  siblings?: number;
  className?: string;
}

function pageRange(page: number, pages: number, siblings: number): (number | "…")[] {
  const total = siblings * 2 + 5;
  if (pages <= total) return Array.from({ length: pages }, (_, i) => i + 1);
  const left = Math.max(2, page - siblings);
  const right = Math.min(pages - 1, page + siblings);
  const items: (number | "…")[] = [1];
  if (left > 2) items.push("…");
  for (let i = left; i <= right; i++) items.push(i);
  if (right < pages - 1) items.push("…");
  items.push(pages);
  return items;
}

/** Page controls with a range summary. Renders nothing when everything fits on one page. */
export function Pagination({ page, pageSize, total, onChange, hideSummary = false, siblings = 1, className }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <nav aria-label="Pagination" className={cx(styles.root, className)}>
      {!hideSummary && (
        <p className={styles.summary}>
          Showing {from}–{to} of {total}
        </p>
      )}
      <div className={styles.controls}>
        <button type="button" className={styles.button} onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <IconChevronLeft size={16} />
        </button>
        {pageRange(page, pages, siblings).map((item, index) =>
          item === "…" ? (
            <span key={`gap-${index}`} className={styles.gap} aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={cx(styles.button, item === page && styles.active)}
              aria-current={item === page ? "page" : undefined}
              aria-label={`Page ${item}`}
              onClick={() => onChange(item)}
            >
              {item}
            </button>
          ),
        )}
        <button type="button" className={styles.button} onClick={() => onChange(page + 1)} disabled={page >= pages} aria-label="Next page">
          <IconChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}
