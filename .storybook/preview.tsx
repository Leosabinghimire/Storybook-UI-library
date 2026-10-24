import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect, type ReactNode } from "react";
import { ToastProvider } from "../src/components/Toast/Toast";
import { ComponentDocs } from "./ComponentDocs";
import "../src/styles/index.css";
import "./preview.css";

function ThemeFrame({ theme, children }: { theme: "light" | "dark"; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return <ToastProvider>{children}</ToastProvider>;
}

const withTheme: Decorator = (Story, context) => (
  <ThemeFrame theme={context.globals.theme === "dark" ? "dark" : "light"}>
    <Story />
  </ThemeFrame>
);

const preview: Preview = {
  decorators: [withTheme],
  // Generates a Docs page for every component (props table, examples, and the component source).
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  parameters: {
    // Small components sit in the middle of the canvas; wide ones opt into "padded" per story.
    layout: "centered",
    backgrounds: { disable: true },
    a11y: { test: "todo" },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i }, expanded: true },
    // "Code" tab in the addon panel showing the source of the current story.
    docs: { codePanel: true, page: ComponentDocs },
    options: {
      storySort: {
        order: ["Introduction", "Design System", "Actions", "Forms", "Data Display", "Feedback", "Overlays", "Navigation"],
      },
    },
  },
};

export default preview;
