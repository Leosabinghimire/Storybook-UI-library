import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PasswordInput } from "./PasswordInput";
import { SearchInput } from "./SearchInput";
import { TextInput } from "./TextInput";

describe("TextInput", () => {
  it("links label, hint and error to the input", () => {
    const { rerender } = render(<TextInput label="Email" hint="Work email preferred" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAccessibleDescription("Work email preferred");
    expect(input).not.toHaveAttribute("aria-invalid");

    rerender(<TextInput label="Email" hint="Work email preferred" error="Enter a valid email" required />);
    expect(screen.getByLabelText(/Email/)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/Email/)).toHaveAttribute("aria-required", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email");
    expect(screen.getByLabelText(/Email/)).toHaveAccessibleDescription("Enter a valid email");
  });
});

describe("PasswordInput", () => {
  it("toggles between hidden and visible text", async () => {
    render(<PasswordInput label="Password" defaultValue="secret" />);
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute("aria-pressed", "true");
  });
});

describe("SearchInput", () => {
  it("reports typed text and clears it", async () => {
    const onChange = vi.fn();
    const { rerender } = render(<SearchInput value="" onChange={onChange} placeholder="Search" />);
    await userEvent.type(screen.getByRole("searchbox", { name: "Search" }), "a");
    expect(onChange).toHaveBeenCalledWith("a");
    expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();

    rerender(<SearchInput value="acme" onChange={onChange} placeholder="Search" />);
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onChange).toHaveBeenLastCalledWith("");
  });
});
