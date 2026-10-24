import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@/components/Badge/Badge";
import { Button } from "@/components/Button/Button";
import { Card } from "./Card";
import sourceCardTsx from "./Card.tsx?raw";
import sourceCardModuleCss from "./Card.module.css?raw";

const meta = {
  title: "Data Display/Card",
  component: Card,
  args: {
    title: "Team members",
    description: "People with access to this project.",
    children: <p style={{ margin: 0, fontSize: "var(--ui-text-sm)" }}>Card body content. Put any component here: lists, forms, tables or charts.</p>,
  },
  argTypes: {
    padding: { control: "radio", options: ["none", "sm", "md", "lg"] },
    children: { control: false },
    actions: { control: false },
    footer: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480, maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
  parameters: { componentSource: { files: { "Card.tsx": sourceCardTsx, "Card.module.css": sourceCardModuleCss } } },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    actions: (
      <Button size="sm" variant="outline">
        Invite
      </Button>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    footer: (
      <>
        <span style={{ color: "var(--ui-text-muted)" }}>Last updated 2 hours ago</span>
        <Badge tone="info" style={{ marginLeft: "auto" }}>
          Synced
        </Badge>
      </>
    ),
  },
};

export const Elevated: Story = { args: { elevated: true } };

export const BodyOnly: Story = { args: { title: undefined, description: undefined } };
