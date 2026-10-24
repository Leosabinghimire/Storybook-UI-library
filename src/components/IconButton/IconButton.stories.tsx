import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { IconDots, IconPlus, IconX } from "@/icons";
import { Tooltip } from "@/components/Tooltip/Tooltip";
import { IconButton } from "./IconButton";

const meta = {
  title: "Actions/IconButton",
  component: IconButton,
  args: { label: "Close", icon: <IconX size={18} />, onClick: fn() },
  argTypes: {
    variant: { control: "select", options: ["ghost", "outline", "primary", "danger"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    icon: { control: false },
  },
  parameters: { docs: { description: { component: "Icon-only button. `label` is required and becomes the accessible name and native tooltip." } } },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="sb-row">
      <IconButton {...args} variant="ghost" label="More options" icon={<IconDots size={18} />} />
      <IconButton {...args} variant="outline" label="Add" icon={<IconPlus size={18} />} />
      <IconButton {...args} variant="primary" label="Add" icon={<IconPlus size={18} />} />
      <IconButton {...args} variant="danger" label="Remove" icon={<IconX size={18} />} />
      <IconButton {...args} disabled label="Disabled" icon={<IconX size={18} />} />
    </div>
  ),
};

export const WithTooltip: Story = {
  render: (args) => (
    <Tooltip content="Add a new item">
      <IconButton {...args} variant="outline" label="Add" icon={<IconPlus size={18} />} title={undefined} />
    </Tooltip>
  ),
};
