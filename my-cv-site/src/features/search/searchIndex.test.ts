import { describe, it, expect } from "vitest";
import { searchEntries, SEARCH_INDEX } from "./searchIndex";

describe("searchEntries", () => {
  it("returns the full index for an empty query", () => {
    expect(searchEntries("", "en")).toHaveLength(SEARCH_INDEX.length);
    expect(searchEntries("   ", "nl")).toHaveLength(SEARCH_INDEX.length);
  });

  it("matches title, description and keywords case-insensitively", () => {
    expect(searchEntries("FRONTEND", "en").some((e) => e.href === "/services/frontend")).toBe(true);
    expect(searchEntries("projecten", "nl").some((e) => e.href === "/projects")).toBe(true);
  });

  it("returns nothing for a non-matching query", () => {
    expect(searchEntries("zzz-no-match", "en")).toEqual([]);
  });
});
