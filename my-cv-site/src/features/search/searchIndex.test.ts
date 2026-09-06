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

describe("searchEntries with extra entries", () => {
  it("searches the extra entries next to the static index", () => {
    const extra = [
      {
        href: "/experience#experience-bol",
        title: { en: "bol.com", nl: "bol.com" },
        description: { en: "Kobo Plus pages", nl: "Kobo Plus-pagina's" },
        keywords: ["bol", "kobo"],
      },
    ];
    expect(searchEntries("", "en", extra).some((entry) => entry.href === "/experience#experience-bol")).toBe(true);
    expect(searchEntries("kobo plus", "nl", extra).map((entry) => entry.href)).toContain("/experience#experience-bol");
    expect(searchEntries("kobo plus", "nl").map((entry) => entry.href)).not.toContain("/experience#experience-bol");
  });

  it("finds a region page by its city in both languages", () => {
    expect(searchEntries("rotterdam", "nl").map((entry) => entry.href)).toContain("/freelance-frontend-developer/rotterdam");
    expect(searchEntries("the hague", "en").map((entry) => entry.href)).toContain("/freelance-frontend-developer/den-haag");
  });
});
