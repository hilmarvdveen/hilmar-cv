import { describe, it, expect } from "vitest";
import { SEOUtils } from "./utils";

describe("SEOUtils.validateURL", () => {
  it("accepts valid http(s) URLs", () => {
    expect(SEOUtils.validateURL("https://www.hilmarvanderveen.com")).toBe(true);
    expect(SEOUtils.validateURL("https://www.example.com/path?q=1")).toBe(true);
  });
  it("rejects non-URLs", () => {
    expect(SEOUtils.validateURL("not a url")).toBe(false);
    expect(SEOUtils.validateURL("ftp://example.com")).toBe(false);
  });
});

describe("SEOUtils.generateJSONLD", () => {
  it("serializes schemas to pretty JSON joined by blank lines", () => {
    const out = SEOUtils.generateJSONLD([{ "@type": "WebSite" }, { "@type": "Person" }]);
    expect(out).toContain('"@type": "WebSite"');
    expect(out).toContain('"@type": "Person"');
    expect(out).toContain("\n\n");
  });
});

describe("SEOUtils.createMetaTags", () => {
  it("maps title/description/keywords and OG/twitter into tag objects", () => {
    const tags = SEOUtils.createMetaTags({
      title: "Hi",
      description: "Desc",
      keywords: ["a", "b"],
      openGraph: { title: "OG" },
      twitter: { card: "summary" },
    } as never);
    expect(tags).toContainEqual({ name: "title", content: "Hi" });
    expect(tags).toContainEqual({ name: "description", content: "Desc" });
    expect(tags).toContainEqual({ name: "keywords", content: "a, b" });
    expect(tags.some((t) => "property" in t && t.property === "og:title")).toBe(true);
    expect(tags.some((t) => "name" in t && t.name === "twitter:card")).toBe(true);
  });

  it("handles a string keyword and skips falsy OG/twitter values", () => {
    const tags = SEOUtils.createMetaTags({
      keywords: "single",
      openGraph: { title: "OG", description: undefined },
      twitter: { card: undefined },
    } as never);
    expect(tags).toContainEqual({ name: "keywords", content: "single" });
    expect(tags.some((t) => "property" in t && t.property === "og:title")).toBe(true);
    // falsy values are not emitted
    expect(tags.some((t) => "property" in t && t.property === "og:description")).toBe(false);
    expect(tags.some((t) => "name" in t && t.name === "twitter:card")).toBe(false);
  });

  it("returns no tags for empty metadata", () => {
    expect(SEOUtils.createMetaTags({} as never)).toEqual([]);
  });
});

describe("SEOUtils.generateRobotsTxt", () => {
  const txt = SEOUtils.generateRobotsTxt();
  it("blocks the API and disallows AI crawlers", () => {
    expect(txt).toContain("Disallow: /api/");
    expect(txt).toContain("User-agent: GPTBot");
    expect(txt).toContain("User-agent: ClaudeBot");
  });
  it("declares sitemap locations", () => {
    expect(txt).toMatch(/Sitemap:\s+https?:\/\/\S+\/sitemap\.xml/);
  });
});
