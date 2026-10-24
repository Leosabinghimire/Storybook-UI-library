import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Badge } from "@/components/Badge/Badge";
import { Button } from "@/components/Button/Button";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { IconPlus } from "@/icons";
import { Table, type Column, type SortState } from "./Table";

interface Customer {
  id: number;
  name: string;
  email: string;
  plan: "Free" | "Pro" | "Enterprise";
  status: "active" | "trial" | "churned";
  mrr: number | null;
  joined: string;
}

const CUSTOMERS: Customer[] = [
  { id: 1, name: "Acme Corp", email: "ops@acme.com", plan: "Enterprise", status: "active", mrr: 4200, joined: "2024-02-11" },
  { id: 2, name: "Globex", email: "it@globex.io", plan: "Pro", status: "active", mrr: 890, joined: "2024-06-30" },
  { id: 3, name: "Initech", email: "peter@initech.com", plan: "Free", status: "trial", mrr: null, joined: "2025-09-02" },
  { id: 4, name: "Umbrella", email: "admin@umbrella.co", plan: "Pro", status: "churned", mrr: 0, joined: "2023-11-18" },
  { id: 5, name: "Hooli", email: "gavin@hooli.xyz", plan: "Enterprise", status: "active", mrr: 12800, joined: "2022-05-04" },
  { id: 6, name: "Stark Industries", email: "pepper@stark.com", plan: "Pro", status: "active", mrr: 1450, joined: "2024-10-21" },
  { id: 7, name: "Wayne Enterprises", email: "lucius@wayne.com", plan: "Enterprise", status: "trial", mrr: null, joined: "2025-10-01" },
  { id: 8, name: "Vandelay", email: "art@vandelay.com", plan: "Free", status: "churned", mrr: 0, joined: "2023-03-14" },
];

const STATUS_TONE = { active: "success", trial: "info", churned: "neutral" } as const;
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const columns: Column<Customer>[] = [
  {
    key: "name",
    header: "Customer",
    sortValue: (c) => c.name,
    render: (c) => (
      <div>
        <div style={{ fontWeight: 600 }}>{c.name}</div>
        <div style={{ fontSize: "var(--ui-text-xs)", color: "var(--ui-text-muted)" }}>{c.email}</div>
      </div>
    ),
  },
  { key: "plan", header: "Plan", sortValue: (c) => c.plan },
  { key: "status", header: "Status", sortValue: (c) => c.status, render: (c) => <Badge tone={STATUS_TONE[c.status]} dot>{c.status}</Badge> },
  { key: "mrr", header: "MRR", align: "right", sortValue: (c) => c.mrr, render: (c) => (c.mrr === null ? "—" : money.format(c.mrr)) },
  { key: "joined", header: "Joined", sortValue: (c) => new Date(c.joined), width: 120 },
];

const meta = {
  title: "Data Display/Table",
  component: Table,
  args: { columns, data: CUSTOMERS, caption: "Customers" },
  argTypes: { columns: { control: false }, data: { control: false } },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Columns with `sortValue` get sortable headers (click to toggle asc/desc). Pass `pageSize` for client-side pagination or `pagination` when the server pages. Empty values sort last in both directions.",
      },
    },
  },
} satisfies Meta<typeof Table<Customer>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultSort: Story = { args: { defaultSort: { key: "mrr", direction: "desc" } } };

export const Paginated: Story = { args: { pageSize: 3 } };

export const Striped: Story = { args: { striped: true, compact: true } };

export const Loading: Story = { args: { loading: true, loadingRows: 4 } };

export const Empty: Story = {
  args: {
    data: [],
    emptyState: (
      <EmptyState
        compact
        title="No customers yet"
        description="Customers appear here once they sign up."
        action={
          <Button size="sm" leftIcon={<IconPlus size={16} />}>
            Add customer
          </Button>
        }
      />
    ),
  },
};

function ServerSideExample() {
  const [sort, setSort] = useState<SortState | null>({ key: "name", direction: "asc" });
  const [page, setPage] = useState(1);
  const pageSize = 3;
  // In a real app this is where the request goes; here we sort and slice locally to imitate the server.
  const sorted = [...CUSTOMERS].sort((a, b) => {
    const key = sort?.key as keyof Customer;
    const factor = sort?.direction === "desc" ? -1 : 1;
    return String(a[key] ?? "").localeCompare(String(b[key] ?? ""), undefined, { numeric: true }) * factor;
  });
  const rows = sorted.slice((page - 1) * pageSize, page * pageSize);
  return (
    <div className="sb-col" style={{ maxWidth: "none" }}>
      <span style={{ fontSize: "var(--ui-text-sm)", color: "var(--ui-text-muted)" }}>
        Parent owns sort and page: {sort ? `${sort.key} ${sort.direction}` : "none"}, page {page}
      </span>
      <Table
        columns={columns.map((c) => ({ ...c, sortValue: undefined, sortable: true }))}
        data={rows}
        sort={sort}
        onSortChange={(next) => {
          setSort(next);
          setPage(1);
        }}
        pagination={{ page, pageSize, total: CUSTOMERS.length, onChange: setPage }}
      />
    </div>
  );
}

export const ServerSide: Story = { render: () => <ServerSideExample /> };

function SelectableExample() {
  const [selected, setSelected] = useState<number | null>(2);
  return <Table columns={columns} data={CUSTOMERS} isRowSelected={(c) => c.id === selected} onRowClick={(c) => setSelected(c.id)} />;
}

export const SelectableRows: Story = { render: () => <SelectableExample /> };
