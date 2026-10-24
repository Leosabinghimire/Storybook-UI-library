import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  args: { label: "Email me about product updates" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = { args: { description: "No more than one email per week. Unsubscribe any time." } };

export const Checked: Story = { args: { defaultChecked: true } };

export const Disabled: Story = {
  render: (args) => (
    <div className="sb-col">
      <Checkbox {...args} disabled />
      <Checkbox {...args} disabled defaultChecked />
    </div>
  ),
};

export const WithError: Story = { args: { label: "I agree to the terms", error: "You must accept the terms to continue." } };

function SelectAllExample() {
  const [items, setItems] = useState([true, false, true]);
  const all = items.every(Boolean);
  const some = items.some(Boolean) && !all;
  return (
    <div className="sb-col">
      <Checkbox label="Select all" checked={all} indeterminate={some} onChange={(e) => setItems(items.map(() => e.currentTarget.checked))} />
      {items.map((checked, i) => (
        <Checkbox key={i} label={`Item ${i + 1}`} checked={checked} onChange={(e) => setItems(items.map((v, j) => (j === i ? e.currentTarget.checked : v)))} style={{ marginLeft: 24 }} />
      ))}
    </div>
  );
}

export const Indeterminate: Story = { render: () => <SelectAllExample /> };
