import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Alert } from "./Alert";
import sourceAlertTsx from "./Alert.tsx?raw";
import sourceAlertModuleCss from "./Alert.module.css?raw";

const TONES = ["info", "success", "warning", "danger", "neutral", "primary"] as const;

const meta = {
  title: "Feedback/Alert",
  component: Alert,
  args: { tone: "info", title: "Scheduled maintenance", children: "The API will be unavailable on Sunday from 02:00 to 03:00 UTC." },
  argTypes: { tone: { control: "select", options: TONES }, icon: { control: false } },
  decorators: [
    (Story) => (
      <div style={{ width: 560, maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
  parameters: { componentSource: { files: { "Alert.tsx": sourceAlertTsx, "Alert.module.css": sourceAlertModuleCss } } },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div className="sb-col" style={{ maxWidth: "none" }}>
      <Alert {...args} tone="info" title="Heads up" children="Exports can take a few minutes for large workspaces." />
      <Alert {...args} tone="success" title="Saved" children="Your changes are live." />
      <Alert {...args} tone="warning" title="Trial ending" children="Your trial ends in 3 days. Add a payment method to keep access." />
      <Alert {...args} tone="danger" title="Payment failed" children="We could not charge your card. Update your billing details." />
    </div>
  ),
};

export const Dismissible: Story = { args: { onDismiss: fn() } };

export const WithoutTitle: Story = { args: { title: undefined, children: "A short message without a title." } };

export const WithoutIcon: Story = { args: { icon: null } };
