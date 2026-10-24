import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { IconSearch } from "@/icons";
import { NativeSelect } from "./NativeSelect";
import { Select } from "./Select";
import sourceSelectTsx from "./Select.tsx?raw";
import sourceSelectModuleCss from "./Select.module.css?raw";

const options = [
  { value: "eu-west", label: "Europe (Ireland)", description: "eu-west-1" },
  { value: "us-east", label: "US East (Virginia)", description: "us-east-1" },
  { value: "us-west", label: "US West (Oregon)", description: "us-west-2" },
  { value: "ap-south", label: "Asia Pacific (Mumbai)", description: "Coming soon", disabled: true },
];

const plain = options.map(({ value, label }) => ({ value, label }));

const meta = {
  title: "Forms/Select",
  component: Select,
  args: { label: "Region", options: plain, placeholder: "Choose a region", onChange: fn() },
  argTypes: { size: { control: "select", options: ["sm", "md", "lg"] }, options: { control: false }, value: { control: false }, leftSection: { control: false } },
  parameters: {
    componentSource: { files: { "Select.tsx": sourceSelectTsx, "Select.module.css": sourceSelectModuleCss } },
    docs: {
      description: {
        component:
          "Themed single-select (combobox + listbox). Arrow keys move, Enter/Space select, Escape closes, Home/End jump, and typing jumps to a matching option. Pass `name` to submit the value with a form.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360, maxWidth: "100%", minHeight: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = { args: { defaultValue: "us-east" } };

export const WithDescriptions: Story = {
  args: { options, defaultValue: "eu-west", hint: "Disabled options stay visible but cannot be chosen." },
};

export const WithError: Story = { args: { error: "Pick a region before continuing.", required: true } };

export const Disabled: Story = { args: { disabled: true, defaultValue: "eu-west" } };

export const WithIcon: Story = { args: { leftSection: <IconSearch size={16} />, placeholder: "Search region" } };

export const Sizes: Story = {
  render: (args) => (
    <div className="sb-col">
      <Select {...args} size="sm" label="Small" />
      <Select {...args} size="md" label="Medium" />
      <Select {...args} size="lg" label="Large" />
    </div>
  ),
};

function ControlledExample() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="sb-col">
      <Select label="Region" options={plain} placeholder="Choose a region" value={value} onChange={setValue} />
      <span style={{ fontSize: "var(--ui-text-sm)", color: "var(--ui-text-muted)" }}>Selected: {value ?? "none"}</span>
    </div>
  );
}

export const Controlled: Story = { render: () => <ControlledExample /> };

export const ManyOptions: Story = {
  args: {
    label: "Country",
    placeholder: "Choose a country",
    options: ["Australia", "Brazil", "Canada", "Denmark", "Egypt", "France", "Germany", "India", "Japan", "Kenya", "Mexico", "Nepal", "Norway", "Spain", "Sweden"].map((c) => ({ value: c.toLowerCase(), label: c })),
  },
  parameters: { docs: { description: { story: "Long lists scroll inside the popover. Type a letter to jump." } } },
};

export const Native: Story = {
  render: () => <NativeSelect label="Region" placeholder="Choose a region" options={plain} />,
  parameters: { docs: { description: { story: "`NativeSelect` keeps the operating system's picker. The open list cannot be themed, but it behaves natively on mobile." } } },
};
