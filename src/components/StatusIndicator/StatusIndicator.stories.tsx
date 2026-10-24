import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusIndicator } from "./StatusIndicator";
import sourceStatusIndicatorTsx from "./StatusIndicator.tsx?raw";
import sourceStatusIndicatorModuleCss from "./StatusIndicator.module.css?raw";

const meta = {
  title: "Data Display/StatusIndicator",
  component: StatusIndicator,
  args: { status: "online", label: "Online" },
  argTypes: {
    status: { control: "select", options: ["online", "offline", "busy", "away", "pending"] },
    tone: { control: "select", options: [undefined, "neutral", "primary", "success", "warning", "danger", "info"] },
    size: { control: "radio", options: ["sm", "md"] },
  },
  parameters: { componentSource: { files: { "StatusIndicator.tsx": sourceStatusIndicatorTsx, "StatusIndicator.module.css": sourceStatusIndicatorModuleCss } } },
} satisfies Meta<typeof StatusIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllStatuses: Story = {
  render: () => (
    <div className="sb-col">
      <StatusIndicator status="online" label="Online" />
      <StatusIndicator status="away" label="Away" />
      <StatusIndicator status="busy" label="Do not disturb" />
      <StatusIndicator status="offline" label="Offline" />
      <StatusIndicator status="pending" label="Pending approval" />
    </div>
  ),
};

export const Pulse: Story = { args: { status: "online", label: "Live", pulse: true } };

export const DotOnly: Story = {
  args: { label: undefined, "aria-label": "Online" },
  parameters: { docs: { description: { story: "Without a visible label, pass `aria-label` so the status is still announced." } } },
};
