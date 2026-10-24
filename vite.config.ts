/// <reference types="vitest/config" />
import { fileURLToPath } from "node:url";
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
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: true,
  },
});
