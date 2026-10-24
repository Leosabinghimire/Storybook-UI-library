import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/Button/Button";
import { ConfirmDialog } from "./ConfirmDialog";
import { Modal } from "./Modal";

function Host({ dismissible = true }: { dismissible?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Invite" description="Send an invite" dismissible={dismissible} footer={<Button onClick={() => setOpen(false)}>Done</Button>}>
        <input aria-label="Email" data-autofocus />
      </Modal>
    </>
  );
}

describe("Modal", () => {
  it("is an accessible dialog that focuses the autofocus element and restores focus on close", async () => {
    render(<Host />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await userEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Invite" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription("Send an invite");
    expect(screen.getByLabelText("Email")).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("keeps Tab focus inside the dialog", async () => {
    render(<Host />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await userEvent.tab(); // Email -> Done
    expect(screen.getByRole("button", { name: "Done" })).toHaveFocus();
    await userEvent.tab(); // Done -> wraps to Close
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Done" })).toHaveFocus();
  });

  it("ignores Escape when not dismissible", async () => {
    render(<Host dismissible={false} />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("ConfirmDialog", () => {
  it("calls onConfirm and onClose from its buttons", async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(<ConfirmDialog open onClose={onClose} onConfirm={onConfirm} title="Delete?" message="Gone forever." confirmLabel="Delete" destructive />);
    expect(screen.getByRole("button", { name: "Delete" })).toHaveFocus();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
