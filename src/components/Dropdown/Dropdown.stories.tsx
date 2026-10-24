import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import { IconArrowDown, IconChevronDown, IconDots, IconPlus, IconX } from "@/icons";
import { Dropdown } from "./Dropdown";

const items = [
  { key: "edit", label: "Edit", icon: <IconPlus size={16} />, onSelect: fn() },
  { key: "export", label: "Export CSV", icon: <IconArrowDown size={16} />, onSelect: fn() },
  { key: "archive", label: "Archive", disabled: true, onSelect: fn() },
  { key: "delete", label: "Delete", icon: <IconX size={16} />, danger: true, onSelect: fn() },
];

const meta = {
  title: "Actions/Dropdown",
  component: Dropdown,
  args: {
    items,
    trigger: (
      <Button variant="outline" rightIcon={<IconChevronDown size={16} />}>
        Actions
      </Button>
    ),
  },
  argTypes: { trigger: { control: false }, align: { control: "radio", options: ["start", "end"] } },
  parameters: {
    docs: { description: { component: "Opens on click or Arrow Down/Up. Arrow keys move, Home/End jump, Escape closes and returns focus to the trigger." } },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IconTrigger: Story = {
  args: { trigger: <IconButton label="More options" icon={<IconDots size={18} />} variant="outline" />, align: "end" },
  render: (args) => (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Dropdown {...args} />
    </div>
  ),
};
