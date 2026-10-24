import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { IconPlus, IconArrowDown } from "@/icons";
import { Button } from "./Button";

const meta = {
  title: "Actions/Button",
  component: Button,
  args: { children: "Save changes", onClick: fn() },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "outline", "ghost", "danger"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    leftIcon: { control: false },
    rightIcon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="sb-row">
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="danger">
        Danger
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="sb-row">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true },
  parameters: { docs: { description: { story: "The spinner replaces the label while the width stays the same, so layouts do not jump." } } },
};

export const Disabled: Story = { args: { disabled: true } };

export const WithIcons: Story = {
  render: (args) => (
    <div className="sb-row">
      <Button {...args} leftIcon={<IconPlus size={16} />}>
        New item
      </Button>
      <Button {...args} variant="outline" rightIcon={<IconArrowDown size={16} />}>
        Export
      </Button>
    </div>
  ),
};

export const FullWidth: Story = { args: { fullWidth: true, children: "Sign in" }, parameters: { layout: "padded" } };
