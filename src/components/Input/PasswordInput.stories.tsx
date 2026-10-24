import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasswordInput } from "./PasswordInput";

const meta = {
  title: "Forms/PasswordInput",
  component: PasswordInput,
  args: { label: "Password", placeholder: "At least 8 characters" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = { args: { hint: "Use a passphrase you do not use anywhere else." } };

export const WithError: Story = { args: { error: "Password must be at least 8 characters.", defaultValue: "abc" } };

export const Disabled: Story = { args: { disabled: true, defaultValue: "hunter2hunter2" } };
