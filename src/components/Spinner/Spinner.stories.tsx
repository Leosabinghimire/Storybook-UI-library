import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";
import sourceSpinnerTsx from "./Spinner.tsx?raw";
import sourceSpinnerModuleCss from "./Spinner.module.css?raw";

const meta = {
  title: "Feedback/Spinner",
  component: Spinner,
  args: { size: "md" },
  argTypes: { size: { control: "select", options: ["sm", "md", "lg"] } },
  parameters: { componentSource: { files: { "Spinner.tsx": sourceSpinnerTsx, "Spinner.module.css": sourceSpinnerModuleCss } } },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="sb-row" style={{ gap: 24 }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size={48} />
    </div>
  ),
};

export const Colored: Story = {
  render: () => (
    <div className="sb-row" style={{ gap: 24 }}>
      <span style={{ color: "var(--ui-primary)" }}>
        <Spinner />
      </span>
      <span style={{ color: "var(--ui-success)" }}>
        <Spinner />
      </span>
      <span style={{ color: "var(--ui-text-muted)" }}>
        <Spinner label="Syncing" />
      </span>
    </div>
  ),
  parameters: { docs: { description: { story: "The spinner uses `currentColor`, so wrap it in a colored element or pass `className`." } } },
};
