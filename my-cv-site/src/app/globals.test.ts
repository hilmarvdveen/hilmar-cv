import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

describe("client logos render as a static grid, not an animated carousel", () => {
  it("does not define the retired autoRun keyframe", () => {
    expect(css).not.toContain("@keyframes autoRun");
  });

  it("does not define the retired slider styles", () => {
    expect(css).not.toContain(".slider");
  });
});
