import { describe, it, expect } from "vitest";
import { mergeClasses, TYPE_ROLE_CLASSES } from "./mergeClasses";

describe("mergeClasses", () => {
  it("keeps a type role next to a text colour instead of treating it as a colour", () => {
    expect(mergeClasses("text-section-title text-white")).toBe("text-section-title text-white");
    expect(mergeClasses("text-display", "text-textMain")).toBe("text-display text-textMain");
  });

  it("lets a later size override an earlier role", () => {
    expect(mergeClasses("text-section-title", "text-lg")).toBe("text-lg");
    expect(mergeClasses("text-lg", "text-figure")).toBe("text-figure");
  });

  it("still merges ordinary conflicts", () => {
    expect(mergeClasses("p-7 bg-white", "p-4")).toBe("bg-white p-4");
    expect(TYPE_ROLE_CLASSES).toContain("text-code-inline");
  });
});
