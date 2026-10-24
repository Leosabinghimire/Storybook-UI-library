import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/Button/Button";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("shows on focus, links the trigger with aria-describedby and hides on Escape", async () => {
    render(
      <Tooltip content="Copies the link" openDelay={0}>
        <Button>Copy</Button>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).toBeNull();
    await userEvent.tab();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Copies the link");
    expect(screen.getByRole("button", { name: "Copy" })).toHaveAccessibleDescription("Copies the link");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("shows on hover and hides when the pointer leaves", async () => {
    render(
      <Tooltip content="Hint" openDelay={0}>
        <Button>Hover</Button>
      </Tooltip>,
    );
    await userEvent.hover(screen.getByRole("button"));
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
    await userEvent.unhover(screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});
