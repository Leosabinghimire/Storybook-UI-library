import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

/** The tokens in `src/styles/tokens.css`. Components only ever reference these variables. */
const meta = {
  title: "Design System/Tokens",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const label: CSSProperties = { fontSize: "var(--ui-text-xs)", color: "var(--ui-text-muted)", fontFamily: "var(--ui-font-mono)" };

type TokenGroups = Record<string, { name: string; value: string }[]>;

/** Reads every `--ui-*` color token from the loaded stylesheets, so this page always matches tokens.css. */
function readColorTokens(theme: string): TokenGroups {
  const names = new Set<string>();
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // cross-origin stylesheet (fonts)
    }
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSStyleRule) || !/:root|\[data-theme/.test(rule.selectorText)) continue;
      for (const prop of Array.from(rule.style)) if (prop.startsWith("--ui-")) names.add(prop);
    }
  }
  // `theme` is only a cache key: the computed values below change with the data-theme attribute.
  void theme;
  const computed = getComputedStyle(document.documentElement);
  const isColor = (name: string, value: string) => name === "--ui-focus-ring" || /^(#|rgb|hsl|color\(|oklch|transparent)/.test(value.trim());
  const groups: TokenGroups = {};
  for (const name of Array.from(names).sort()) {
    const value = computed.getPropertyValue(name).trim();
    if (!isColor(name, value)) continue;
    const group = GROUPS.find((g) => g.test(name))?.label ?? "Other";
    (groups[group] ??= []).push({ name, value });
  }
  return groups;
}

const GROUPS: { label: string; test: (name: string) => boolean }[] = [
  { label: "Surfaces and borders", test: (n) => /^--ui-(bg|surface|border|overlay)/.test(n) },
  { label: "Text", test: (n) => /^--ui-text/.test(n) },
  { label: "Primary", test: (n) => /^--ui-primary/.test(n) },
  { label: "Success", test: (n) => /^--ui-(success|on-success)/.test(n) },
  { label: "Warning", test: (n) => /^--ui-(warning|on-warning)/.test(n) },
  { label: "Danger", test: (n) => /^--ui-(danger|on-danger)/.test(n) },
  { label: "Info", test: (n) => /^--ui-(info|on-info)/.test(n) },
  { label: "Neutral", test: (n) => /^--ui-(neutral|on-neutral)/.test(n) },
  { label: "Focus and skeleton", test: (n) => /^--ui-(focus|skeleton)/.test(n) },
];

/** Re-renders the token list when the Storybook theme toolbar flips `data-theme`. */
function useThemeAttribute() {
  const [theme, setTheme] = useState(document.documentElement.getAttribute("data-theme") ?? "light");
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(document.documentElement.getAttribute("data-theme") ?? "light"));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return { theme };
}

/** Text-like tokens are shown as "Aa" on the surface they are meant for; everything else as a filled swatch. */
function swatchStyle(name: string): { background: string; color?: string; boxShadow?: string } {
  if (name === "--ui-focus-ring") return { background: "var(--ui-surface)", boxShadow: "var(--ui-focus-ring)" };
  if (name === "--ui-text-on-primary") return { background: "var(--ui-primary)", color: "var(--ui-text-on-primary)" };
  const onTone = name.match(/^--ui-on-(\w+)$/);
  if (onTone) return { background: `var(--ui-${onTone[1]})`, color: `var(${name})` };
  if (/^--ui-text/.test(name) || /-text$/.test(name)) return { background: "var(--ui-surface)", color: `var(${name})` };
  return { background: `var(${name})` };
}

function Swatch({ name, value }: { name: string; value: string }) {
  const style = swatchStyle(name);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <div
        style={{
          ...style,
          height: 56,
          borderRadius: "var(--ui-radius-md)",
          border: "1px solid var(--ui-border)",
          display: "flex",
          alignItems: "flex-end",
          padding: 8,
          fontSize: "var(--ui-text-md)",
          fontWeight: 600,
        }}
      >
        {style.color ? "Aa" : ""}
      </div>
      <span style={{ ...label, overflowWrap: "anywhere" }}>{name}</span>
      <span style={label}>{value}</span>
    </div>
  );
}

function ColorTokens() {
  const { theme } = useThemeAttribute();
  // Recomputed when the theme attribute changes, since the resolved values differ per theme.
  const groups = useMemo(() => readColorTokens(theme), [theme]);
  const total = Object.values(groups).reduce((n, g) => n + g.length, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <p style={{ margin: 0, fontSize: "var(--ui-text-sm)", color: "var(--ui-text-muted)" }}>
        {total} color tokens, read live from <code>tokens.css</code>. Switch the Theme toolbar to see the dark values.
      </p>
      {GROUPS.map(({ label: group }) =>
        groups[group]?.length ? (
          <section key={group}>
            <h3 style={{ margin: "0 0 12px" }}>{group}</h3>
            <div className="sb-grid">
              {groups[group].map((token) => (
                <Swatch key={token.name} {...token} />
              ))}
            </div>
          </section>
        ) : null,
      )}
    </div>
  );
}

export const Colors: Story = {
  render: () => <ColorTokens />,
  parameters: { docs: { description: { story: "Every color token in the system, grouped by role. Values update with the theme." } } },
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
