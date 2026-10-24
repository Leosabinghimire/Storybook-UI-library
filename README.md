# my-ui-library

A standalone, reusable UI component library built with **React 19**, **TypeScript** and **Storybook 10**.

**Live Storybook:** https://leosabinghimire.github.io/Storybook-UI-library/ (published from `main` by GitHub Actions)
Styling is plain CSS Modules on top of a token-based design system (CSS custom properties) with light
and dark themes, so the only runtime dependency is React.

## Components

| Category | Components |
|---|---|
| Actions | `Button`, `IconButton`, `Dropdown` |
| Forms | `TextInput`, `PasswordInput`, `SearchInput`, `Textarea`, `Select`, `Checkbox`, `Radio` + `RadioGroup`, `Switch`, `FormField` |
| Data display | `Badge`, `StatusIndicator`, `Card`, `StatCard`, `Table` (sorting + pagination), `Pagination` |
| Feedback | `Alert`, `ToastProvider` + `useToast`, `Tooltip`, `Spinner`, `Skeleton` + `SkeletonText`, `EmptyState` |
| Overlays | `Modal`, `ConfirmDialog` |
| Navigation | `Tabs`, `Accordion` |
| Theme | `ThemeProvider` + `useTheme`, design tokens, built-in icon set |

Every component is typed, keyboard accessible, documented with stories, and reads its colors,
spacing, radii and shadows from the tokens in `src/styles/tokens.css`.

## Getting started

```bash
npm install
npm run storybook        # http://localhost:6006
```

| Script | What it does |
|---|---|
| `npm run storybook` | Start Storybook with hot reload |
| `npm run build-storybook` | Static Storybook site in `storybook-static/` (deployable anywhere) |
| `npm run build` | Library build: `dist/index.js`, `dist/index.css` and `.d.ts` files |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (TypeScript + React hooks rules) |
| `npm test` | Vitest: unit tests (jsdom) plus every story rendered in headless Chromium via the Storybook Vitest addon |
| `npm run test:unit` | Unit tests only (fast) |

Stories double as tests: the **Storybook Vitest addon** renders each story in Chromium and fails on
render errors, play-function failures and accessibility violations. In Storybook, the *Testing module*
panel in the sidebar runs them on demand. On every push, the GitHub Actions workflow in
`.github/workflows/storybook.yml` runs the checks and publishes the static Storybook to GitHub Pages.

## Project structure

```
my-ui-library/
├─ .github/workflows/     CI: typecheck, lint, tests, builds, GitHub Pages deploy of the Storybook
├─ .storybook/            Storybook config: framework, docs + a11y + vitest addons, theme toolbar, preview styles
├─ src/
│  ├─ index.ts            Public entry point: everything the library exports
│  ├─ styles/
│  │  ├─ tokens.css       Design tokens (light on :root, dark under [data-theme="dark"])
│  │  └─ global.css       Minimal base styles and keyframes
│  ├─ theme/              ThemeProvider + useTheme
│  ├─ components/
│  │  └─ Button/
│  │     ├─ Button.tsx            Component (typed props, JSDoc on each prop)
│  │     ├─ Button.module.css     Styles, scoped, tokens only
│  │     ├─ Button.stories.tsx    Storybook stories
│  │     └─ Button.test.tsx       Unit tests (where practical)
│  ├─ hooks/              useControllableState, useFocusTrap
│  ├─ icons/              Small inline SVG icon set (no icon dependency)
│  ├─ utils/              cx() class joiner, shared types (Size, Tone)
│  └─ docs/               Introduction, Theming and Design System pages
├─ tests/setup.ts         Vitest setup (jest-dom matchers, jsdom shims)
├─ vite.config.ts         Library build (ESM + CSS, React external) and Vitest projects (unit + storybook)
├─ tsconfig.json          Type-check config · tsconfig.build.json emits .d.ts only
└─ package.json           peerDependencies: react, react-dom
```

## Using the library in an app

Import the styles once, wrap the app in the providers, then use components anywhere:

```tsx
// app root
import { ThemeProvider, ToastProvider } from "my-ui-library";
import "my-ui-library/styles.css";

export function App({ children }) {
  return (
    <ThemeProvider defaultPreference="system">
      <ToastProvider position="top-right">{children}</ToastProvider>
    </ThemeProvider>
  );
}
```

```tsx
// a page
import { Button, Card, Table, TextInput, useToast, type Column } from "my-ui-library";

interface User { id: number; name: string; email: string; }

const columns: Column<User>[] = [
  { key: "name", header: "Name", sortValue: (u) => u.name },
  { key: "email", header: "Email" },
];

export function UsersPage({ users }: { users: User[] }) {
  const toast = useToast();
  return (
    <Card title="Users" actions={<Button size="sm" onClick={() => toast.success("Invited!")}>Invite</Button>} padding="none">
      <Table columns={columns} data={users} pageSize={10} defaultSort={{ key: "name", direction: "asc" }} />
    </Card>
  );
}
```

### Next.js

Components that use state or browser APIs (`Modal`, `Dropdown`, `Tabs`, `ToastProvider`, …) are
client components. Either add `"use client"` to the file that imports them or wrap the providers in a
small client component. The CSS import goes in `app/layout.tsx` (App Router) or `pages/_app.tsx`.

Set `data-theme` on `<html>` during SSR to avoid a flash: `<html data-theme="light">` (ThemeProvider
updates it on the client).

## Design system

- **Tokens** live in `src/styles/tokens.css` and are the only values components use. Override any of
  them in your app's CSS to rebrand (see *Design System → Theming* in Storybook).
- **Themes**: light values on `:root`, dark values under `[data-theme="dark"]`. `ThemeProvider` sets the
  attribute and follows the system preference by default.
- **Semantic tones** (`neutral | primary | success | warning | danger | info`) are shared by Badge,
  Alert, Toast and StatusIndicator so meaning maps to the same colors everywhere.
- **Sizes** (`sm | md | lg`) share control heights (`--ui-control-*`) so inputs and buttons line up.

## Adding a component

1. Create `src/components/MyThing/MyThing.tsx` with a typed props interface. Add a one-line JSDoc on
   the component and on any non-obvious prop; Storybook shows them in the Controls panel.
   Use `forwardRef` for form controls and spread `...rest` onto the root element.
2. Style it in `MyThing.module.css` using tokens only (`var(--ui-…)`); never hard-code colors.
3. Export it from `src/index.ts`.
4. Add `MyThing.stories.tsx`:

   ```tsx
   import type { Meta, StoryObj } from "@storybook/react-vite";
   import { MyThing } from "./MyThing";

   const meta = {
     title: "Data Display/MyThing",
     component: MyThing,
     args: { label: "Example" },
   } satisfies Meta<typeof MyThing>;

   export default meta;
   type Story = StoryObj<typeof meta>;

   export const Default: Story = {};
   export const Disabled: Story = { args: { disabled: true } };
   ```

   Cover the default look, each variant and size, and every state (loading, disabled, error, empty).
   Use `render` for stories that need local state and `fn()` from `storybook/test` for callbacks.
5. Add `MyThing.test.tsx` for behavior worth protecting (keyboard interaction, ARIA, callbacks).
6. Check the Accessibility panel in Storybook, then run `npm run typecheck && npm run lint && npm test`.

## Reusing the library in other projects

The package is already shaped for distribution: a single entry point, `peerDependencies` on React,
`exports` for the JS bundle and the CSS file, and type declarations emitted by `npm run build`.

**Option A: install from a Git repository (private, no registry needed)**

```bash
# in the consuming project
npm install git+ssh://git@github.com/your-org/my-ui-library.git#main
```

Add a `prepare` script (`"prepare": "npm run build"`) to this package so the build runs on install.

**Option B: npm workspaces / monorepo**

Move the folder under `packages/ui` in a workspace repo and reference it as `"my-ui-library": "*"`.
Apps resolve it locally; no publishing step.

**Option C: publish to a private registry (GitHub Packages, Verdaccio, npm private)**

```bash
npm run build
npm version minor
npm publish --access restricted
```

Set `"name": "@your-org/ui"` and add `"publishConfig": { "registry": "https://npm.pkg.github.com" }`
first. Remove `"private": true` only when you are ready to publish.

**Local development against an app**: run `npm link` here and `npm link my-ui-library` in the app, or
point the app at the folder with `"my-ui-library": "file:../my-ui-library"`.

## Accessibility notes

- Every form control is labelled and links its hint/error with `aria-describedby`; errors use `role="alert"`.
- Modal traps focus, restores it on close, and closes on Escape and backdrop click.
- Dropdown, Tabs and Accordion follow the WAI-ARIA patterns (arrow keys, Home/End, Escape).
- Tooltips open on focus as well as hover and are linked with `aria-describedby`.
- `IconButton` requires a `label`; `Button` keeps its label in the accessible name while loading.
- Focus rings use `:focus-visible`, and animations respect `prefers-reduced-motion`.
