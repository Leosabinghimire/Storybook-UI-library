import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/Button/Button";
import { ToastProvider, useToast } from "./Toast";

const meta = {
  title: "Feedback/Toast",
  component: ToastProvider,
  parameters: {
    docs: {
      description: {
        component: "Mount `ToastProvider` once, then call `useToast()` from any component. Toasts auto-dismiss (errors stay longer) and are announced through an aria-live region.",
      },
    },
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj;

function Demo() {
  const toast = useToast();
  return (
    <div className="sb-row">
      <Button variant="outline" onClick={() => toast.success("Project created.", "Done")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error("The server returned 500. Try again in a minute.", "Could not save")}>
        Error
      </Button>
      <Button variant="outline" onClick={() => toast.warning("You are about to exceed your plan limit.")}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.info("A new version is available.")}>
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.show({
            tone: "neutral",
            title: "File deleted",
            message: "report-q3.pdf was moved to trash.",
            duration: 0,
            action: { label: "Undo", onClick: () => toast.success("Restored report-q3.pdf.") },
          })
        }
      >
        With action (sticky)
      </Button>
    </div>
  );
}

export const Playground: Story = {
  render: () => <Demo />,
  parameters: { docs: { description: { story: "The Storybook preview already wraps stories in a ToastProvider positioned top-right." } } },
};

export const BottomCenter: Story = {
  render: () => (
    <ToastProvider position="bottom-center">
      <Demo />
    </ToastProvider>
  ),
};
