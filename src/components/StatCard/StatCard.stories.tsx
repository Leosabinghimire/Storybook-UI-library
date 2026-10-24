import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconArrowUp, IconCircleCheck, IconInbox, IconInfo } from "@/icons";
import { StatCard } from "./StatCard";
import sourceStatCardTsx from "./StatCard.tsx?raw";
import sourceStatCardModuleCss from "./StatCard.module.css?raw";

const meta = {
  title: "Data Display/StatCard",
  component: StatCard,
  args: { label: "Monthly revenue", value: "$48,250", delta: 12.5, formatDelta: (d: number) => `${d > 0 ? "+" : ""}${d}%`, hint: "vs last month" },
  argTypes: { icon: { control: false }, formatDelta: { control: false } },
  decorators: [
    (Story) => (
      <div style={{ width: 320, maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
  parameters: { componentSource: { files: { "StatCard.tsx": sourceStatCardTsx, "StatCard.module.css": sourceStatCardModuleCss } } },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Negative: Story = { args: { label: "Active users", value: "1,284", delta: -3.2 } };

export const InvertedTrend: Story = {
  args: { label: "Error rate", value: "0.42%", delta: -0.1, invertTrend: true, hint: "lower is better" },
  parameters: { docs: { description: { story: "With `invertTrend`, a falling number is shown as positive." } } },
};

export const WithIcon: Story = { args: { icon: <IconArrowUp size={22} /> } };

export const NoTrend: Story = { args: { delta: undefined, hint: "Updated just now" } };

export const Dashboard: Story = {
  render: () => (
    <div className="sb-grid" style={{ width: 1000, maxWidth: "100%" }}>
      <StatCard label="Revenue" value="$48,250" delta={12.5} formatDelta={(d) => `${d > 0 ? "+" : ""}${d}%`} hint="vs last month" icon={<IconArrowUp size={22} />} />
      <StatCard label="Orders" value="1,284" delta={-3.2} formatDelta={(d) => `${d}%`} icon={<IconInbox size={22} />} />
      <StatCard label="Conversion" value="3.8%" delta={0.4} formatDelta={(d) => `+${d} pt`} icon={<IconCircleCheck size={22} />} />
      <StatCard label="Open tickets" value={27} delta={-5} invertTrend icon={<IconInfo size={22} />} />
    </div>
  ),
  decorators: [(Story) => <Story />],
  parameters: { layout: "padded" },
};
