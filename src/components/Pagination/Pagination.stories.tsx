import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { Pagination } from "./Pagination";

const meta = {
  title: "Data Display/Pagination",
  component: Pagination,
  args: { page: 1, pageSize: 10, total: 95, onChange: fn() },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function Interactive({ pageSize, total, siblings }: { pageSize: number; total: number; siblings?: number }) {
  const [page, setPage] = useState(1);
  return <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} siblings={siblings} />;
}

export const Default: Story = { render: (args) => <Interactive pageSize={args.pageSize} total={args.total} /> };

export const MiddlePage: Story = { args: { page: 5 } };

export const ManyPages: Story = { render: () => <Interactive pageSize={10} total={2500} siblings={2} /> };

export const WithoutSummary: Story = { args: { hideSummary: true, page: 3 } };

export const SinglePage: Story = {
  args: { total: 8 },
  parameters: { docs: { description: { story: "Renders nothing when all rows fit on one page." } } },
};
