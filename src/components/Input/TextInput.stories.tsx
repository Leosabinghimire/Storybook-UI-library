import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconSearch } from "@/icons";
import { TextInput } from "./TextInput";
import sourceTextInputTsx from "./TextInput.tsx?raw";
import sourceInputModuleCss from "./Input.module.css?raw";

const meta = {
  title: "Forms/TextInput",
  component: TextInput,
  args: { label: "Email", placeholder: "you@example.com" },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    leftSection: { control: false },
    rightSection: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360, maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
  parameters: { componentSource: { files: { "TextInput.tsx": sourceTextInputTsx, "Input.module.css": sourceInputModuleCss } } },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = { args: { hint: "We only use this to send receipts." } };

export const Required: Story = { args: { required: true } };

export const WithError: Story = { args: { error: "Enter a valid email address.", defaultValue: "not-an-email" } };

export const Disabled: Story = { args: { disabled: true, defaultValue: "you@example.com" } };

export const WithIcon: Story = { args: { label: "Filter", placeholder: "Type to filter", leftSection: <IconSearch size={16} /> } };

export const Sizes: Story = {
  render: (args) => (
    <div className="sb-col">
      <TextInput {...args} size="sm" label="Small" />
      <TextInput {...args} size="md" label="Medium" />
      <TextInput {...args} size="lg" label="Large" />
    </div>
  ),
};
