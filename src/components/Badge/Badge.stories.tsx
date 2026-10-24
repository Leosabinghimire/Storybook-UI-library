import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconCheck } from "@/icons";
import { Badge } from "./Badge";
import sourceBadgeTsx from "./Badge.tsx?raw";
import sourceBadgeModuleCss from "./Badge.module.css?raw";

const TONES = ["neutral", "primary", "success", "warning", "danger", "info"] as const;

const meta = {
  title: "Data Display/Badge",
  component: Badge,
  args: { children: "Active", tone: "success" },
  argTypes: {
    tone: { control: "select", options: TONES },
    variant: { control: "radio", options: ["soft", "solid", "outline"] },
    size: { control: "radio", options: ["sm", "md"] },
    icon: { control: false },
  },
  parameters: { componentSource: { files: { "Badge.tsx": sourceBadgeTsx, "Badge.module.css": sourceBadgeModuleCss } } },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div className="sb-row">
      {TONES.map((tone) => (
        <Badge key={tone} {...args} tone={tone}>
          {tone}
        </Badge>
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="sb-col">
      {(["soft", "solid", "outline"] as const).map((variant) => (
        <div key={variant} className="sb-row">
          {TONES.map((tone) => (
            <Badge key={tone} {...args} tone={tone} variant={variant}>
              {tone}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const WithDot: Story = {
  render: (args) => (
    <div className="sb-row">
      <Badge {...args} dot tone="success">
        Online
      </Badge>
      <Badge {...args} dot tone="warning">
        Degraded
      </Badge>
      <Badge {...args} dot tone="danger">
        Outage
      </Badge>
    </div>
  ),
};

export const WithIcon: Story = { args: { icon: <IconCheck size={12} strokeWidth={3} />, children: "Verified", tone: "primary" } };

export const Small: Story = { args: { size: "sm", children: "v2.4.0", tone: "neutral" } };
