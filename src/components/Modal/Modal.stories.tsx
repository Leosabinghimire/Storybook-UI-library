import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "@/components/Button/Button";
import { TextInput } from "@/components/Input/TextInput";
import { Select } from "@/components/Select/Select";
import { Modal } from "./Modal";

const meta = {
  title: "Overlays/Modal",
  component: Modal,
  argTypes: { size: { control: "select", options: ["sm", "md", "lg", "xl"] } },
  parameters: {
    docs: {
      description: {
        component: "Focus is trapped inside the dialog and returned to the trigger on close. Escape and backdrop clicks close it unless `dismissible` is false.",
      },
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj;

function InviteExample({ size, dismissible }: { size?: "sm" | "md" | "lg" | "xl"; dismissible?: boolean }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const submit = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setOpen(false);
    }, 1200);
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>Invite member</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Invite a team member"
        description="They will get an email with a link to join this workspace."
        size={size}
        dismissible={dismissible ?? !saving}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={submit} loading={saving}>
              Send invite
            </Button>
          </>
        }
      >
        <div className="sb-col" style={{ maxWidth: "none" }}>
          <TextInput label="Email" type="email" placeholder="name@company.com" data-autofocus />
          <Select
            label="Role"
            defaultValue="member"
            options={[
              { value: "admin", label: "Admin" },
              { value: "member", label: "Member" },
              { value: "viewer", label: "Viewer" },
            ]}
          />
        </div>
      </Modal>
    </>
  );
}

export const Default: Story = { render: () => <InviteExample /> };

export const Large: Story = { render: () => <InviteExample size="lg" /> };

export const NotDismissible: Story = {
  render: () => <InviteExample dismissible={false} />,
  parameters: { docs: { description: { story: "Escape and backdrop clicks are ignored; only the buttons close it." } } },
};

function ScrollExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open terms
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Terms of service" footer={<Button onClick={() => setOpen(false)}>I agree</Button>}>
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i}>
            Section {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh
            elementum imperdiet.
          </p>
        ))}
      </Modal>
    </>
  );
}

export const ScrollingContent: Story = { render: () => <ScrollExample /> };
