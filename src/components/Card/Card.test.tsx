import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ToastProvider } from "@/components/Toast/Toast";
import { Card } from "./Card";
import cardStyles from "./Card.module.css";
import toastStyles from "@/components/Toast/Toast.module.css";

// CSS Modules export camelCase keys; these guard the dynamic class lookups that depend on it.
describe("Card", () => {
  it("applies the body padding class for every padding option", () => {
    const { rerender } = render(<Card title="T">body</Card>);
    expect(screen.getByText("body")).toHaveClass(cardStyles.paddingMd!);
    rerender(<Card padding="none">body</Card>);
    expect(screen.getByText("body")).toHaveClass(cardStyles.paddingNone!);
    rerender(<Card padding="lg">body</Card>);
    expect(screen.getByText("body")).toHaveClass(cardStyles.paddingLg!);
    expect(cardStyles.paddingMd).toBeTruthy();
  });
});

describe("ToastProvider", () => {
  it("positions the notification region", () => {
    render(
      <ToastProvider position="bottom-center">
        <span />
      </ToastProvider>,
    );
    expect(screen.getByRole("region", { name: "Notifications" })).toHaveClass(toastStyles.bottomCenter!);
    expect(toastStyles.bottomCenter).toBeTruthy();
  });
});
