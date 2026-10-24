import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/Button/Button";
import { Tooltip } from "./Tooltip";

const meta = {
  title: "Feedback/Tooltip",
  component: Tooltip,
  args: { content: "Copies the link to your clipboard", children: <Button variant="outline">Copy link</Button> },
  argTypes: { placement: { control: "select", options: ["top", "bottom", "left", "right"] }, children: { control: false } },
  parameters: { docs: { description: { component: "Appears on hover and keyboard focus; Escape hides it. The trigger must be focusable (buttons, links, inputs)." } } },
  decorators: [
    (Story) => (
      <div style={{ padding: 48, display: "flex", justifyContent: "center" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Placements: Story = {
  render: (args) => (
    <div className="sb-row" style={{ gap: 24 }}>
      {(["top", "bottom", "left", "right"] as const).map((placement) => (
        <Tooltip key={placement} {...args} placement={placement} content={`Placement: ${placement}`}>
          <Button variant="outline">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const LongContent: Story = {
  args: { content: "Long tooltips wrap at 18rem. Keep them short; use a popover or help text for anything that needs more than a sentence." },
};
