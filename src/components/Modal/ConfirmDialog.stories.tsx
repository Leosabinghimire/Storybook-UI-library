import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "@/components/Button/Button";
import { useToast } from "@/components/Toast/Toast";
import { ConfirmDialog } from "./ConfirmDialog";

const meta = {
  title: "Overlays/ConfirmDialog",
  component: ConfirmDialog,
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj;

function DeleteExample({ destructive = true, async = false }: { destructive?: boolean; async?: boolean }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const confirm = () => {
    if (!async) {
      setOpen(false);
      toast.success("Project deleted.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      toast.success("Project deleted.");
    }, 1200);
  };
  return (
    <>
      <Button variant={destructive ? "danger" : "primary"} onClick={() => setOpen(true)}>
        {destructive ? "Delete project" : "Publish"}
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={confirm}
        loading={loading}
        destructive={destructive}
        title={destructive ? "Delete this project?" : "Publish changes?"}
        message={destructive ? "All tasks, files and comments will be permanently removed. This cannot be undone." : "Your changes will be visible to everyone immediately."}
        confirmLabel={destructive ? "Delete" : "Publish"}
      />
    </>
  );
}

export const Destructive: Story = { render: () => <DeleteExample /> };

export const Default: Story = { render: () => <DeleteExample destructive={false} /> };

export const AsyncConfirm: Story = {
  render: () => <DeleteExample async />,
  parameters: { docs: { description: { story: "While `loading` is true the confirm button shows a spinner and the dialog cannot be dismissed." } } },
};
