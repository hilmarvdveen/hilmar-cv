import { describe, it, expect } from "vitest";
import { formatDate } from "./format";

describe("formatDate", () => {
  it("formats an ISO date in English", () => {
    expect(formatDate("2026-06-10", "en")).toMatch(/June/);
    expect(formatDate("2026-06-10", "en")).toMatch(/2026/);
  });

  it("formats an ISO date in Dutch", () => {
    expect(formatDate("2026-06-10", "nl")).toMatch(/juni/);
  });
});
