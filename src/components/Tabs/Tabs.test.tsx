import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "./Tabs";

const items = [
  { value: "a", label: "Alpha", content: "Alpha panel" },
  { value: "b", label: "Beta", content: "Beta panel", disabled: true },
  { value: "c", label: "Gamma", content: "Gamma panel" },
];

describe("Tabs", () => {
  it("selects tabs by click and skips disabled tabs with the keyboard", async () => {
    const onChange = vi.fn();
    render(<Tabs items={items} onChange={onChange} />);
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Alpha panel");

    await userEvent.click(screen.getByRole("tab", { name: "Gamma" }));
    expect(onChange).toHaveBeenCalledWith("c");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Gamma panel");

    await userEvent.keyboard("{ArrowRight}"); // wraps past the end to Alpha
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Alpha panel");

    await userEvent.keyboard("{ArrowRight}"); // Beta is disabled, so Gamma
    expect(screen.getByRole("tab", { name: "Gamma" })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveFocus();
  });

  it("works as a controlled component", () => {
    const { rerender } = render(<Tabs items={items} value="c" />);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Gamma panel");
    rerender(<Tabs items={items} value="a" />);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Alpha panel");
  });
});
