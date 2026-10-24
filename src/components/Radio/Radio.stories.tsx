import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Radio, RadioGroup } from "./Radio";

const meta = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
  args: {
    label: "Billing cycle",
    defaultValue: "monthly",
    onChange: fn(),
    children: (
      <>
        <Radio value="monthly" label="Monthly" description="Pay as you go, cancel any time." />
        <Radio value="yearly" label="Yearly" description="Two months free." />
        <Radio value="lifetime" label="Lifetime" disabled />
      </>
    ),
  },
  argTypes: { children: { control: false }, value: { control: false } },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Inline: Story = {
  args: {
    inline: true,
    children: (
      <>
        <Radio value="monthly" label="Monthly" />
        <Radio value="yearly" label="Yearly" />
      </>
    ),
  },
};

export const WithDescriptionAndError: Story = {
  args: { description: "You can change this later.", error: "Choose a billing cycle.", defaultValue: null },
};

export const Disabled: Story = { args: { disabled: true } };
