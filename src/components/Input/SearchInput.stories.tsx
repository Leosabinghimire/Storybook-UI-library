import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { SearchInput } from "./SearchInput";
import sourceSearchInputTsx from "./SearchInput.tsx?raw";
import sourceInputModuleCss from "./Input.module.css?raw";

const meta = {
  title: "Forms/SearchInput",
  component: SearchInput,
  args: { value: "", onChange: fn(), placeholder: "Search customers" },
  decorators: [
    (Story) => (
      <div style={{ width: 360, maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
  parameters: { componentSource: { files: { "SearchInput.tsx": sourceSearchInputTsx, "Input.module.css": sourceInputModuleCss } } },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled({ initial = "", ...rest }: { initial?: string; placeholder?: string; label?: string; disabled?: boolean }) {
  const [value, setValue] = useState(initial);
  return <SearchInput {...rest} value={value} onChange={setValue} />;
}

export const Default: Story = { render: (args) => <Controlled placeholder={args.placeholder} /> };

export const WithValue: Story = {
  render: (args) => <Controlled placeholder={args.placeholder} initial="acme" />,
  parameters: { docs: { description: { story: "A clear button appears once there is text." } } },
};

export const WithLabel: Story = { render: () => <Controlled label="Search" placeholder="Name, email or company" /> };

export const Disabled: Story = { render: (args) => <Controlled placeholder={args.placeholder} disabled /> };
