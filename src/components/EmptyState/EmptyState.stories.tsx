import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { IconPlus, IconSearch } from "@/icons";
import { EmptyState } from "./EmptyState";
import sourceEmptyStateTsx from "./EmptyState.tsx?raw";
import sourceEmptyStateModuleCss from "./EmptyState.module.css?raw";

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  args: {
    title: "No projects yet",
    description: "Create your first project to start tracking work.",
    action: (
      <Button leftIcon={<IconPlus size={16} />}>New project</Button>
    ),
  },
  argTypes: { icon: { control: false }, action: { control: false } },
  decorators: [
    (Story) => (
      <div style={{ width: 560, maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
  parameters: { componentSource: { files: { "EmptyState.tsx": sourceEmptyStateTsx, "EmptyState.module.css": sourceEmptyStateModuleCss } } },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoResults: Story = {
  args: { icon: <IconSearch size={28} />, title: "No results for “billing”", description: "Try a different keyword or clear the filters.", action: <Button variant="outline">Clear filters</Button> },
};

export const WithoutAction: Story = { args: { action: undefined } };

export const Compact: Story = {
  args: { compact: true },
  render: (args) => (
    <Card title="Recent activity">
      <EmptyState {...args} />
    </Card>
  ),
  parameters: { docs: { description: { story: "`compact` removes the dashed border and tightens spacing for use inside cards and tables." } } },
};
