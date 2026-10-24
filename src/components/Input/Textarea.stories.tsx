import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./Textarea";

const meta = {
  title: "Forms/Textarea",
  component: Textarea,
  args: { label: "Description", placeholder: "Describe the issue in a few sentences", rows: 4 },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = { args: { hint: "Markdown is supported.", maxLength: 500 } };

export const WithError: Story = { args: { error: "Description is required." } };

export const Disabled: Story = { args: { disabled: true, defaultValue: "Read-only content" } };
