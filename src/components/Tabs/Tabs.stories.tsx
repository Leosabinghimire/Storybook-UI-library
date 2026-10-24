import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { Badge } from "@/components/Badge/Badge";
import { IconInbox, IconInfo, IconSearch } from "@/icons";
import { Tabs } from "./Tabs";
import sourceTabsTsx from "./Tabs.tsx?raw";
import sourceTabsModuleCss from "./Tabs.module.css?raw";

const items = [
  { value: "overview", label: "Overview", content: <p style={{ margin: 0 }}>Project summary, owners and recent activity.</p> },
  { value: "tasks", label: "Tasks", content: <p style={{ margin: 0 }}>12 open tasks, 3 overdue.</p> },
  { value: "files", label: "Files", content: <p style={{ margin: 0 }}>Attachments and shared documents.</p> },
  { value: "settings", label: "Settings", content: <p style={{ margin: 0 }}>Only admins can change these.</p>, disabled: true },
];

const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
  args: { items, onChange: fn() },
  argTypes: { variant: { control: "radio", options: ["line", "pill"] }, items: { control: false }, value: { control: false } },
  parameters: {
    componentSource: { files: { "Tabs.tsx": sourceTabsTsx, "Tabs.module.css": sourceTabsModuleCss } }, docs: { description: { component: "Arrow keys move between tabs, Home/End jump to the first/last. Disabled tabs are skipped." } } },
  decorators: [
    (Story) => (
      <div style={{ width: 560, maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {};

export const Pill: Story = { args: { variant: "pill" } };

export const WithIcons: Story = {
  args: {
    items: [
      { value: "inbox", icon: <IconInbox size={16} />, label: "Inbox", content: "Unread messages." },
      { value: "search", icon: <IconSearch size={16} />, label: "Search", content: "Search across everything." },
      {
        value: "about",
        icon: <IconInfo size={16} />,
        label: (
          <>
            About <Badge size="sm">new</Badge>
          </>
        ),
        content: "Version and credits.",
      },
    ],
  },
};

function ControlledExample() {
  const [value, setValue] = useState("tasks");
  return (
    <div className="sb-col" style={{ maxWidth: "none" }}>
      <span style={{ fontSize: "var(--ui-text-sm)", color: "var(--ui-text-muted)" }}>Active: {value}</span>
      <Tabs items={items} value={value} onChange={setValue} />
    </div>
  );
}

export const Controlled: Story = { render: () => <ControlledExample /> };
