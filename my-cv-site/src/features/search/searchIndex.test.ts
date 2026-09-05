import { describe, it, expect } from "vitest";
import { searchEntries, SEARCH_INDEX } from "./searchIndex";

describe("searchEntries", () => {
  it("returns the full index for an empty query", () => {
    expect(searchEntries("", "en")).toHaveLength(SEARCH_INDEX.length);
    expect(searchEntries("   ", "nl")).toHaveLength(SEARCH_INDEX.length);
  });

  it("matches title, description and keywords case-insensitively", () => {
    expect(searchEntries("FRONTEND", "en").some((entry) => entry.href === "/services/frontend")).toBe(true);
    expect(searchEntries("projecten", "nl").some((entry) => entry.href === "/projects")).toBe(true);
  });

  it("returns nothing for a non-matching query", () => {
    expect(searchEntries("zzz-no-match", "en")).toEqual([]);
  });
});
