import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/Button/Button";
import { Dropdown } from "./Dropdown";

describe("Dropdown", () => {
  it("opens from the trigger, navigates with arrows and selects with Enter", async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <Dropdown
        trigger={<Button>Actions</Button>}
        items={[
          { key: "edit", label: "Edit", onSelect: onEdit },
          { key: "archive", label: "Archive", disabled: true },
          { key: "delete", label: "Delete", danger: true, onSelect: onDelete },
        ]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(screen.queryByRole("menu")).toBeNull();

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();

    await userEvent.keyboard("{ArrowDown}"); // skips the disabled item
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onDelete).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("closes on Escape without selecting", async () => {
    const onEdit = vi.fn();
    render(<Dropdown trigger={<Button>Actions</Button>} items={[{ key: "edit", label: "Edit", onSelect: onEdit }]} />);
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
    expect(onEdit).not.toHaveBeenCalled();
  });
});
