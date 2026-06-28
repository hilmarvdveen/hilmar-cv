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

describe("SEOEngine.createBlogPostSEO", () => {
  const post = {
    slug: "react-folder-structure",
    title: "A clear, descriptive blog post title about React folders",
    description: "How to structure a modern React project for scale.",
    keywords: ["react", "folder structure", "architecture"],
    category: "architecture",
    publishedDate: "2026-06-01",
    updatedDate: "2026-06-10",
  };

  it("emits BlogPosting + breadcrumb schema for the default locale", () => {
    const engine = new SEOEngine();
    const { jsonLd, metadata } = engine.createBlogPostSEO("nl", post);
    expect(jsonLd.some((s) => (s as { "@type": string })["@type"] === "BlogPosting")).toBe(true);
    const crumbs = jsonLd.find(
      (s) => (s as { "@type": string })["@type"] === "BreadcrumbList"
    ) as { itemListElement: unknown[] };
    expect(crumbs.itemListElement).toHaveLength(3);
    expect(metadata.alternates?.canonical).toBeTruthy();
  });

  it("builds a locale-prefixed canonical for the non-default locale and tolerates a missing updatedDate", () => {
    const engine = new SEOEngine();
    const { metadata } = engine.createBlogPostSEO("en", {
      ...post,
      updatedDate: undefined,
    });
    expect(String(metadata.alternates?.canonical)).toContain("/en/blog/react-folder-structure");
  });
});

describe("SEOEngine.generateSitemapData with dynamic pages", () => {
  it("appends dynamic pages using provided lastmod/priority/changefreq", () => {
    const engine = new SEOEngine();
    const entries = engine.generateSitemapData([
      { path: "blog/my-post", lastModified: "2026-01-01T00:00:00.000Z", changeFrequency: "daily", priority: 0.6 },
    ]);
    const match = entries.find((e) => e.url.endsWith("/blog/my-post"));
    expect(match).toBeDefined();
    expect(match?.priority).toBe(0.6);
    expect(match?.changeFrequency).toBe("daily");
    expect(match?.lastModified).toBe("2026-01-01T00:00:00.000Z");
  });

  it("falls back to defaults when a dynamic page omits optional fields", () => {
    const engine = new SEOEngine();
    const entries = engine.generateSitemapData([{ path: "blog/other" }]);
    const match = entries.find((e) => e.url.endsWith("/blog/other"));
    expect(match?.priority).toBe(0.7);
    expect(match?.changeFrequency).toBe("monthly");
    // the static blog index is also present
    expect(entries.some((e) => e.url.endsWith("/blog"))).toBe(true);
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
