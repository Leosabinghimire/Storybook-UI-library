import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Table, sortRows, type Column } from "./Table";

interface Row {
  id: number;
  name: string;
  score: number | null;
}

const ROWS: Row[] = [
  { id: 1, name: "Beta", score: 40 },
  { id: 2, name: "alpha", score: null },
  { id: 3, name: "Gamma", score: 90 },
  { id: 4, name: "Delta", score: 10 },
];

const COLUMNS: Column<Row>[] = [
  { key: "name", header: "Name", sortValue: (r) => r.name },
  { key: "score", header: "Score", sortValue: (r) => r.score, render: (r) => r.score ?? "—" },
  { key: "actions", header: "Actions", render: () => "…" },
];

function column(index: number): string[] {
  const [, ...rows] = screen.getAllByRole("row");
  return rows.map((row) => within(row).getAllByRole("cell")[index]?.textContent ?? "");
}

describe("sortRows", () => {
  it("sorts strings case-insensitively and keeps empty values last in both directions", () => {
    expect(sortRows(ROWS, COLUMNS, { key: "name", direction: "asc" }).map((r) => r.name)).toEqual(["alpha", "Beta", "Delta", "Gamma"]);
    expect(sortRows(ROWS, COLUMNS, { key: "score", direction: "asc" }).map((r) => r.score)).toEqual([10, 40, 90, null]);
    expect(sortRows(ROWS, COLUMNS, { key: "score", direction: "desc" }).map((r) => r.score)).toEqual([90, 40, 10, null]);
    expect(sortRows(ROWS, COLUMNS, null)).toBe(ROWS);
  });
});

describe("Table", () => {
  it("sorts on header click and exposes aria-sort", async () => {
    render(<Table columns={COLUMNS} data={ROWS} />);
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute("aria-sort", "none");
    expect(within(screen.getByRole("columnheader", { name: "Actions" })).queryByRole("button")).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "Score" }));
    expect(screen.getByRole("columnheader", { name: "Score" })).toHaveAttribute("aria-sort", "ascending");
    expect(column(1)).toEqual(["10", "40", "90", "—"]);

    await userEvent.click(screen.getByRole("button", { name: "Score" }));
    expect(screen.getByRole("columnheader", { name: "Score" })).toHaveAttribute("aria-sort", "descending");
    expect(column(1)).toEqual(["90", "40", "10", "—"]);
  });

  it("paginates on the client and resets to page 1 after sorting", async () => {
    render(<Table columns={COLUMNS} data={ROWS} pageSize={2} />);
    expect(column(0)).toEqual(["Beta", "alpha"]);
    expect(screen.getByText("Showing 1–2 of 4")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(column(0)).toEqual(["Gamma", "Delta"]);

    await userEvent.click(screen.getByRole("button", { name: "Name" }));
    expect(column(0)).toEqual(["alpha", "Beta"]);
    expect(screen.getByText("Showing 1–2 of 4")).toBeInTheDocument();
  });

  it("delegates sorting and paging to the parent when controlled", async () => {
    const onSortChange = vi.fn();
    const onPage = vi.fn();
    render(
      <Table
        columns={COLUMNS.map((c) => ({ ...c, sortValue: undefined, sortable: c.key !== "actions" }))}
        data={ROWS}
        sort={{ key: "name", direction: "asc" }}
        onSortChange={onSortChange}
        pagination={{ page: 1, pageSize: 4, total: 12, onChange: onPage }}
      />,
    );
    // Controlled: rows are rendered as given, not re-sorted.
    expect(column(0)).toEqual(["Beta", "alpha", "Gamma", "Delta"]);
    await userEvent.click(screen.getByRole("button", { name: "Name" }));
    expect(onSortChange).toHaveBeenCalledWith({ key: "name", direction: "desc" });
    await userEvent.click(screen.getByRole("button", { name: "Page 3" }));
    expect(onPage).toHaveBeenCalledWith(3);
  });

  it("shows skeleton rows while loading and an empty state without data", () => {
    const { rerender } = render(<Table columns={COLUMNS} data={[]} loading loadingRows={3} />);
    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
    expect(screen.getAllByRole("row")).toHaveLength(4);

    rerender(<Table columns={COLUMNS} data={[]} emptyState={<p>Nothing here</p>} />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
