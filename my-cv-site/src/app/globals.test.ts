import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

describe("client-logos carousel animation is GPU-composited", () => {
  // Regression guard for the Lighthouse "Avoid non-composited animations"
  // finding: the autoRun keyframe must animate `transform`, not `left`
  // (animating `left` forces layout/paint each frame -> jank + CLS).
  const idx = css.indexOf("@keyframes autoRun");
  // Capture through the closing brace of the keyframe (the next "\n}" at column 0).
  const end = css.indexOf("\n}", idx);
  const block = css.slice(idx, end + 2);

  it("the autoRun keyframe exists", () => {
    expect(idx).toBeGreaterThan(-1);
  });

  it("animates transform: translateX, not the left property", () => {
    expect(block).toContain("translateX");
    expect(block).not.toMatch(/\bleft\s*:/);
  });
});
