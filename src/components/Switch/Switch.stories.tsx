import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./Switch";

const meta = {
  title: "Forms/Switch",
  component: Switch,
  args: { label: "Enable notifications" },
  argTypes: { size: { control: "radio", options: ["sm", "md"] }, labelPosition: { control: "radio", options: ["left", "right"] } },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const WithDescription: Story = { args: { description: "Get an email when someone comments on your post." } };

export const Small: Story = { args: { size: "sm" } };

export const LabelLeft: Story = { args: { labelPosition: "left" } };

export const Disabled: Story = {
  render: (args) => (
    <div className="sb-col">
      <Switch {...args} disabled />
      <Switch {...args} disabled defaultChecked />
    </div>
  ),
};
