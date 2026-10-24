import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Accordion } from "./Accordion";

const items = [
  { value: "refunds", title: "How do refunds work?", content: "Request a refund within 14 days of purchase. Refunds are returned to the original payment method within 5–10 business days." },
  { value: "cancel", title: "Can I cancel any time?", content: "Yes. Cancelling stops future charges; you keep access until the end of the billing period." },
  { value: "invoices", title: "Where do I find invoices?", content: "Settings → Billing → Invoices. Each invoice can be downloaded as a PDF." },
  { value: "enterprise", title: "Enterprise agreements", content: "Contact sales.", disabled: true },
];

const meta = {
  title: "Navigation/Accordion",
  component: Accordion,
  args: { items, defaultValue: ["refunds"], onChange: fn() },
  argTypes: { variant: { control: "radio", options: ["default", "separated"] }, items: { control: false }, value: { control: false } },
  decorators: [
    (Story) => (
      <div style={{ width: 560, maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Multiple: Story = {
  args: { multiple: true, defaultValue: ["refunds", "cancel"] },
  parameters: { docs: { description: { story: "With `multiple`, opening one item does not close the others." } } },
};

export const Separated: Story = { args: { variant: "separated" } };

export const AllClosed: Story = { args: { defaultValue: [] } };
