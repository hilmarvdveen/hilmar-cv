import { describe, it, expect, vi, afterEach } from "vitest";
import { SEOEngine } from "./seo-engine";
import type { SEOPageConfig } from "../types/seo-types";

afterEach(() => vi.unstubAllEnvs());

function baseConfig(overrides: Partial<SEOPageConfig> = {}): SEOPageConfig {
  return {
    pageType: "blog-post",
    locale: "en",
    title: "Hi",
    description: "Short.",
    keywords: ["a", "b"],
    path: "/blog/post",
    breadcrumbs: [{ name: "Home", url: "https://x.com", position: 1 }],
    ...overrides,
  };
}

describe("SEOEngine.generatePageSEO", () => {
  it("builds a blog-post page (schema, short metadata, breadcrumbs)", () => {
    const engine = new SEOEngine();
    const { metadata, jsonLd, structuredData } = engine.generatePageSEO(baseConfig());
    expect(typeof metadata.title).toBe("string");
    expect(jsonLd.some((s) => (s as { "@type": string })["@type"] === "BlogPosting")).toBe(true);
    expect(jsonLd.some((s) => (s as { "@type": string })["@type"] === "BreadcrumbList")).toBe(true);
    expect(structuredData).toContain("@type");
  });
});

describe("SEOEngine analytics initialization", () => {
  it("initializes the analytics manager when a GA id is present, and tracks", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-TEST123");
    const engine = new SEOEngine();
    expect(engine.getAnalytics()).toBeDefined();
    expect(() => engine.trackPageView("homepage", "en", "Home", "/")).not.toThrow();
    // Unknown page type exercises the getContentGroup `|| 'Other'` fallback.
    expect(() =>
      engine.trackPageView("not-a-real-type" as never, "en", "X", "/x")
    ).not.toThrow();
  });
});

describe("SEOEngine.validateSEOConfig", () => {
  it("flags a too-short title/description and too-few keywords as warnings", () => {
    const engine = new SEOEngine();
    const r = engine.validateSEOConfig(baseConfig({ title: "Short", description: "Tiny", keywords: ["x"] }));
    expect(r.isValid).toBe(true); // warnings only
    expect(r.warnings.length).toBeGreaterThan(0);
  });

  it("flags an over-long title and description as errors (invalid)", () => {
    const engine = new SEOEngine();
    const r = engine.validateSEOConfig(
      baseConfig({
        title: "T".repeat(70),
        description: "D".repeat(200),
        keywords: Array.from({ length: 16 }, (_, i) => `k${i}`),
      })
    );
    expect(r.isValid).toBe(false);
    expect(r.errors.length).toBeGreaterThan(0);
  });

  it("passes a well-formed config", () => {
    const engine = new SEOEngine();
    const r = engine.validateSEOConfig(
      baseConfig({
        title: "A reasonably descriptive page title for SEO testing",
        description:
          "This description is intentionally between one hundred twenty and one hundred sixty characters so that it passes the SEO validation rules cleanly today.",
        keywords: ["a", "b", "c", "d", "e", "f"],
      })
    );
    expect(r.isValid).toBe(true);
  });
});
