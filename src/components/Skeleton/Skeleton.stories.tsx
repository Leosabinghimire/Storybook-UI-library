import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "@/components/Card/Card";
import { Skeleton, SkeletonText } from "./Skeleton";

const meta = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  args: { width: 240, height: 16 },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Circle: Story = { args: { circle: true, width: 48 } };

export const Text: Story = { render: () => <SkeletonText lines={4} /> , decorators: [(Story) => <div style={{ width: 360, maxWidth: "100%" }}><Story /></div>] };

export const CardPlaceholder: Story = {
  render: () => (
    <Card style={{ width: 360, maxWidth: "100%" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <Skeleton circle width={40} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <Skeleton height={12} width="50%" />
          <Skeleton height={10} width="30%" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <Skeleton width={80} height={32} />
        <Skeleton width={80} height={32} />
      </div>
    </Card>
  ),
  parameters: { docs: { description: { story: "Compose skeletons to mirror the layout that is loading, so content does not shift when it arrives." } } },
};
