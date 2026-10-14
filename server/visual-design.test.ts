import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const publicSources = [
  "client/src/index.css",
  "client/src/pages/Home.tsx",
  "client/src/pages/Admin.tsx",
  "client/src/pages/PaymentSuccess.tsx",
  "client/src/pages/NotFound.tsx",
  "client/src/components/ManusDialog.tsx",
];

function source(path: string) {
  return readFileSync(resolve(projectRoot, path), "utf8");
}

describe("Public visual language", () => {
  it("uses visibly sapphire-navy text tokens rather than near-black", () => {
    const css = source("client/src/index.css");

    expect(css).toContain("--ink: #123e80;");
    expect(css).toContain("--ink-secondary: #1d4b91;");
    expect(css).toContain("--ink-muted: #2f63ab;");
  });

  it("does not keep near-black text utility classes or hex values in visible UI", () => {
    const forbidden = /text-(?:black|slate-(?:7|8|9)00|gray-(?:7|8|9)00|neutral-(?:7|8|9)00|zinc-(?:7|8|9)00|indigo-950)|#(?:0f172a|111827|111b33|1e1b4b|000000|34322d)/i;

    for (const path of publicSources) {
      expect(source(path), `${path} should contain no near-black text token`).not.toMatch(forbidden);
    }
  });

  it("keeps public sections compact without reducing base readability", () => {
    const css = source("client/src/index.css");

    expect(css).toContain("font-size: 16px;");
    expect(css).toContain("padding-top: 38px;");
    expect(css).toContain("padding-bottom: 30px;");
  });
});
