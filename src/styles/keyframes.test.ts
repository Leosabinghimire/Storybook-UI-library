import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// CSS Modules rename animation names per file, so a module may only use keyframes it defines itself.
// A reference to a keyframe defined elsewhere silently produces a non-animating element.

function cssModules(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return cssModules(path);
    return entry.endsWith(".module.css") ? [path] : [];
  });
}

const ROOT = join(import.meta.dirname, "..");

describe("CSS module animations", () => {
  for (const file of cssModules(join(ROOT, "components"))) {
    it(`${file.replace(ROOT, "src")} defines every keyframe it animates`, () => {
      const css = readFileSync(file, "utf8");
      const defined = new Set([...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]));
      const used = [...css.matchAll(/animation(?:-name)?\s*:\s*([\w-]+)/g)].map((m) => m[1]!).filter((name) => name !== "none");
      for (const name of used) expect(defined, `keyframe "${name}" is used but not defined in this file`).toContain(name);
    });
  }
});
