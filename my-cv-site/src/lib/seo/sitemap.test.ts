import { describe, expect, it } from "vitest";
import { SEOFactory } from "./factory";

const HOST = "https://www.hilmarvanderveen.com";

describe("sitemap data", () => {
  const entries = SEOFactory.generateSitemapData([{ path: "experience", priority: 0.8 }]);

  it("prefixes every URL with a locale, the Dutch default included", () => {
    for (const entry of entries) {
      expect(entry.url).toMatch(new RegExp(`^${HOST}/(nl|en)(/|$)`));
    }
    expect(entries.map((entry) => entry.url)).toContain(`${HOST}/nl`);
    expect(entries.map((entry) => entry.url)).toContain(`${HOST}/nl/experience`);
  });

  it("gives every entry both language alternates and an x-default on the Dutch URL", () => {
    for (const entry of entries) {
      const byLanguage = Object.fromEntries(
        entry.alternates.map((alternate) => [alternate.hreflang, alternate.href])
      );
      const path = entry.url.replace(new RegExp(`^${HOST}/(nl|en)`), "");
      expect(byLanguage["nl-NL"]).toBe(`${HOST}/nl${path}`);
      expect(byLanguage["en-US"]).toBe(`${HOST}/en${path}`);
      expect(byLanguage["x-default"]).toBe(`${HOST}/nl${path}`);
    }
  });
});
