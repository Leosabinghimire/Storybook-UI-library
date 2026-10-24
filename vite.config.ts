/// <reference types="vitest/config" />
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Library build: one ESM bundle plus one CSS file; React stays external so the consuming app provides it.
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  css: { modules: { localsConvention: "camelCaseOnly", generateScopedName: "ui-[name]-[local]-[hash:base64:5]" } },
  build: {
    lib: { entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)), formats: ["es"], fileName: "index" },
    rollupOptions: { external: ["react", "react-dom", "react/jsx-runtime"] },
    sourcemap: true,
  },
  test: {
    projects: [
      {
        // Unit tests: fast, in jsdom.
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          globals: true,
          setupFiles: ["./tests/setup.ts"],
          include: ["src/**/*.test.{ts,tsx}"],
          css: true,
        },
      },
      {
        // Every story becomes a test that renders in headless Chromium (smoke test + play functions + a11y).
        extends: true,
        plugins: [storybookTest({ configDir: fileURLToPath(new URL("./.storybook", import.meta.url)) })],
        test: {
          name: "storybook",
          browser: { enabled: true, headless: true, provider: playwright(), instances: [{ browser: "chromium" }] },
        },
      },
    ],
  },
});
