import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

const options = [
  { value: "eu", label: "Europe" },
  { value: "us", label: "United States" },
  { value: "ap", label: "Asia Pacific", disabled: true },
  { value: "sa", label: "South America" },
];

describe("Select", () => {
  it("opens from the trigger, selects with the mouse and submits through a hidden input", async () => {
    const onChange = vi.fn();
    const { container } = render(<Select label="Region" name="region" options={options} placeholder="Choose" onChange={onChange} />);
    const trigger = screen.getByRole("combobox", { name: "Region" });
    expect(trigger).toHaveTextContent("Choose");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("option", { name: "United States" }));
    expect(onChange).toHaveBeenCalledWith("us");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(trigger).toHaveTextContent("United States");
    expect(container.querySelector("input[name='region']")).toHaveValue("us");
  });

  it("supports keyboard navigation, skips disabled options and closes on Escape", async () => {
    const onChange = vi.fn();
    render(<Select label="Region" options={options} onChange={onChange} />);
    const trigger = screen.getByRole("combobox", { name: "Region" });
    trigger.focus();

    await userEvent.keyboard("{ArrowDown}"); // opens, first option active
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Europe" }).id);

    await userEvent.keyboard("{ArrowDown}{ArrowDown}"); // United States -> skips Asia Pacific -> South America
    expect(trigger).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "South America" }).id);

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
    expect(trigger).toHaveFocus();

    await userEvent.keyboard("{Enter}"); // reopen
    await userEvent.keyboard("{End}{Enter}");
    expect(onChange).toHaveBeenLastCalledWith("sa");
    expect(trigger).toHaveTextContent("South America");
  });

  it("jumps to an option by typing while closed", async () => {
    const onChange = vi.fn();
    render(<Select label="Region" options={options} onChange={onChange} />);
    screen.getByRole("combobox").focus();
    await userEvent.keyboard("u");
    expect(onChange).toHaveBeenCalledWith("us");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("marks the selected option, reflects errors and respects disabled", async () => {
    const { rerender } = render(<Select label="Region" options={options} defaultValue="eu" error="Required" />);
    const trigger = screen.getByRole("combobox", { name: /Region/ });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    await userEvent.click(trigger);
    expect(screen.getByRole("option", { name: "Europe" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "Asia Pacific" })).toHaveAttribute("aria-disabled", "true");

    rerender(<Select label="Region" options={options} defaultValue="eu" disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
