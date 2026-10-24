import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Pagination } from "@/components/Pagination/Pagination";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { IconChevronDown, IconChevronUp, IconSelector } from "@/icons";
import { cx } from "@/utils/cx";
import styles from "./Table.module.css";

export type SortDirection = "asc" | "desc";

export interface SortState {
  key: string;
  direction: SortDirection;
}

export type SortValue = string | number | boolean | Date | null | undefined;

export interface Column<T> {
  key: string;
  header: ReactNode;
  /** Cell content. Defaults to `row[key]` when the key is a property of the row. */
  render?: (row: T, index: number) => ReactNode;
  /** Value to compare when sorting. Setting it makes the column sortable. */
  sortValue?: (row: T) => SortValue;
  /** Mark sortable without a value function, for server-side sorting. */
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: CSSProperties["width"];
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  /** Unique key for each row. Defaults to `row.id` when present, else the index. */
  rowKey?: (row: T, index: number) => string | number;
  caption?: string;
  /** Controlled sort. When omitted the table manages sorting itself (see `defaultSort`). */
  sort?: SortState | null;
  onSortChange?: (sort: SortState) => void;
  defaultSort?: SortState;
  /** Client-side pagination: rows per page. Omit to show all rows. */
  pageSize?: number;
  /** Server-side pagination: the data is already one page. */
  pagination?: { page: number; pageSize: number; total: number; onChange: (page: number) => void };
  loading?: boolean;
  loadingRows?: number;
  emptyState?: ReactNode;
  /** Zebra stripes. */
  striped?: boolean;
  /** Tighter rows. */
  compact?: boolean;
  /** Mark a row as selected. */
  isRowSelected?: (row: T) => boolean;
  onRowClick?: (row: T) => void;
  className?: string;
}

function compare(a: NonNullable<SortValue>, b: NonNullable<SortValue>): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

/** Sorts rows by a column's sortValue; empty values go last in both directions and ties keep their order. */
export function sortRows<T>(rows: T[], columns: Column<T>[], sort: SortState | null): T[] {
  const sortValue = sort ? columns.find((c) => c.key === sort.key)?.sortValue : undefined;
  if (!sort || !sortValue) return rows;
  const factor = sort.direction === "asc" ? 1 : -1;
  return rows
    .map((row, index) => ({ row, index, value: sortValue(row) }))
    .sort((x, y) => {
      if (x.value == null || y.value == null) {
        if (x.value == null && y.value == null) return x.index - y.index;
        return x.value == null ? 1 : -1;
      }
      return compare(x.value, y.value) * factor || x.index - y.index;
    })
    .map((entry) => entry.row);
}

function defaultCell<T>(row: T, key: string): ReactNode {
  const value = (row as Record<string, unknown>)[key];
  return value === null || value === undefined ? "" : String(value);
}

function defaultRowKey<T>(row: T, index: number): string | number {
  const id = (row as { id?: string | number }).id;
  return id ?? index;
}

/**
 * Data table with sortable headers, client- or server-side pagination, loading skeletons and an empty
 * state. Rows are typed through the `columns` definition.
 */
export function Table<T>({
  columns,
  data,
  rowKey = defaultRowKey,
  caption,
  sort,
  onSortChange,
  defaultSort,
  pageSize,
  pagination,
  loading = false,
  loadingRows = 5,
  emptyState,
  striped = false,
  compact = false,
  isRowSelected,
  onRowClick,
  className,
}: TableProps<T>) {
  const [internalSort, setInternalSort] = useState<SortState | null>(defaultSort ?? null);
  const [internalPage, setInternalPage] = useState(1);
  const controlledSort = sort !== undefined;
  const activeSort = controlledSort ? sort : internalSort;
  const sortable = Boolean(onSortChange) || !controlledSort;

  const changeSort = (next: SortState) => {
    if (!controlledSort) setInternalSort(next);
    onSortChange?.(next);
    setInternalPage(1);
  };

  const sorted = useMemo(() => (controlledSort ? data : sortRows(data, columns, activeSort)), [controlledSort, data, columns, activeSort]);
  const pageRows = pageSize ? sorted.slice((internalPage - 1) * pageSize, internalPage * pageSize) : sorted;
  const clientPagination = pageSize ? { page: internalPage, pageSize, total: sorted.length, onChange: setInternalPage } : null;
  const activePagination = pagination ?? clientPagination;

  let body: ReactNode;
  if (loading) {
    body = Array.from({ length: loadingRows }, (_, i) => (
      <tr key={`loading-${i}`}>
        {columns.map((column) => (
          <td key={column.key}>
            <Skeleton height="0.875rem" />
          </td>
        ))}
      </tr>
    ));
  } else if (pageRows.length === 0) {
    body = (
      <tr>
        <td colSpan={columns.length} className={styles.emptyCell}>
          {emptyState ?? <span className={styles.emptyText}>No data</span>}
        </td>
      </tr>
    );
  } else {
    body = pageRows.map((row, index) => (
      <tr
        key={rowKey(row, index)}
        className={cx(isRowSelected?.(row) && styles.selected, onRowClick && styles.clickable)}
        onClick={onRowClick ? () => onRowClick(row) : undefined}
      >
        {columns.map((column) => (
          <td key={column.key} className={cx(column.align && styles[column.align])}>
            {column.render ? column.render(row, index) : defaultCell(row, column.key)}
          </td>
        ))}
      </tr>
    ));
  }

  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.scroll}>
        <table className={cx(styles.table, striped && styles.striped, compact && styles.compact)} aria-busy={loading || undefined}>
          {caption && <caption className={styles.caption}>{caption}</caption>}
          <thead>
            <tr>
              {columns.map((column) => {
                const canSort = sortable && (column.sortable ?? column.sortValue !== undefined);
                const direction = activeSort?.key === column.key ? activeSort.direction : null;
                const Icon = direction === "asc" ? IconChevronUp : direction === "desc" ? IconChevronDown : IconSelector;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    style={{ width: column.width }}
                    className={cx(column.align && styles[column.align])}
                    aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : canSort ? "none" : undefined}
                  >
                    {canSort ? (
                      <button type="button" className={styles.sortButton} onClick={() => changeSort({ key: column.key, direction: direction === "asc" ? "desc" : "asc" })}>
                        {column.header}
                        <Icon size={14} className={cx(styles.sortIcon, direction && styles.sortActive)} />
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>{body}</tbody>
        </table>
      </div>
      {activePagination && !loading && <Pagination {...activePagination} className={styles.pagination} />}
    </div>
  );
}
