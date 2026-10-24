import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";

/** The tokens in `src/styles/tokens.css`. Components only ever reference these variables. */
const meta = {
  title: "Design System/Tokens",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const label: CSSProperties = { fontSize: "var(--ui-text-xs)", color: "var(--ui-text-muted)", fontFamily: "var(--ui-font-mono)" };

function Swatch({ name, text }: { name: string; text?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          height: 56,
          borderRadius: "var(--ui-radius-md)",
          background: `var(${name})`,
          border: "1px solid var(--ui-border)",
          display: "flex",
          alignItems: "flex-end",
          padding: 8,
          color: text ? `var(${text})` : undefined,
          fontSize: "var(--ui-text-sm)",
          fontWeight: 600,
        }}
      >
        {text ? "Aa" : ""}
      </div>
      <span style={label}>{name}</span>
    </div>
  );
}

const SEMANTIC = ["primary", "success", "warning", "danger", "info", "neutral"] as const;

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <section>
        <h3 style={{ margin: "0 0 12px" }}>Surfaces and text</h3>
        <div className="sb-grid">
          <Swatch name="--ui-bg" />
          <Swatch name="--ui-surface" />
          <Swatch name="--ui-surface-muted" />
          <Swatch name="--ui-surface-hover" />
          <Swatch name="--ui-border" />
          <Swatch name="--ui-border-strong" />
          <Swatch name="--ui-text" text="--ui-bg" />
          <Swatch name="--ui-text-muted" text="--ui-bg" />
          <Swatch name="--ui-text-subtle" text="--ui-bg" />
        </div>
      </section>
      {SEMANTIC.map((tone) => (
        <section key={tone}>
          <h3 style={{ margin: "0 0 12px", textTransform: "capitalize" }}>{tone}</h3>
          <div className="sb-grid">
            <Swatch name={`--ui-${tone}`} text="--ui-text-on-primary" />
            <Swatch name={`--ui-${tone}-soft`} text={`--ui-${tone}-text`} />
            <Swatch name={`--ui-${tone}-text`} text="--ui-bg" />
          </div>
        </section>
      ))}
    </div>
  ),
};

const TEXT_SIZES = ["3xl", "2xl", "xl", "lg", "md", "sm", "xs"] as const;

export const Typography: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {TEXT_SIZES.map((size) => (
        <div key={size} style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span style={{ ...label, width: 120 }}>--ui-text-{size}</span>
          <span style={{ fontSize: `var(--ui-text-${size})`, fontWeight: size === "xs" || size === "sm" || size === "md" ? 400 : 600 }}>
            The quick brown fox jumps over the lazy dog
          </span>
        </div>
      ))}
      <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
        {[400, 500, 600, 700].map((weight) => (
          <span key={weight} style={{ fontWeight: weight }}>
            Weight {weight}
          </span>
        ))}
      </div>
    </div>
  ),
};

const SPACES = ["1", "2", "3", "4", "5", "6", "8", "10", "12"] as const;

export const Spacing: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {SPACES.map((step) => (
        <div key={step} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ ...label, width: 120 }}>--ui-space-{step}</span>
          <div style={{ width: `var(--ui-space-${step})`, height: 16, background: "var(--ui-primary)", borderRadius: 2 }} />
        </div>
      ))}
    </div>
  ),
};

export const RadiiAndShadows: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="sb-row">
        {(["sm", "md", "lg", "xl", "full"] as const).map((r) => (
          <div key={r} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 64, height: 64, borderRadius: `var(--ui-radius-${r})`, background: "var(--ui-primary-soft)", border: "1px solid var(--ui-primary)" }} />
            <span style={label}>radius-{r}</span>
          </div>
        ))}
      </div>
      <div className="sb-row" style={{ gap: 32 }}>
        {(["sm", "md", "lg"] as const).map((s) => (
          <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 96, height: 64, borderRadius: "var(--ui-radius-md)", background: "var(--ui-surface)", boxShadow: `var(--ui-shadow-${s})` }} />
            <span style={label}>shadow-{s}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};
