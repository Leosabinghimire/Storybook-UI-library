import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Select } from "./Select";

const options = [
  { value: "eu-west", label: "Europe (Ireland)" },
  { value: "us-east", label: "US East (Virginia)" },
  { value: "us-west", label: "US West (Oregon)" },
  { value: "ap-south", label: "Asia Pacific (Mumbai)", disabled: true },
];

const meta = {
  title: "Forms/Select",
  component: Select,
  args: { label: "Region", options, placeholder: "Choose a region" },
  argTypes: { size: { control: "select", options: ["sm", "md", "lg"] } },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = { args: { defaultValue: "us-east", placeholder: undefined } };

export const WithError: Story = { args: { error: "Pick a region before continuing.", required: true } };

export const Disabled: Story = { args: { disabled: true, defaultValue: "eu-west" } };

function ControlledExample() {
  const [value, setValue] = useState("");
  return (
    <div className="sb-col">
      <Select label="Region" options={options} placeholder="Choose a region" value={value} onChange={(e) => setValue(e.currentTarget.value)} />
      <span style={{ fontSize: "var(--ui-text-sm)", color: "var(--ui-text-muted)" }}>Selected: {value || "none"}</span>
    </div>
  );
}

export const Controlled: Story = { render: () => <ControlledExample /> };
