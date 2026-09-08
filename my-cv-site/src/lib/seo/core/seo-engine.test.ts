import { describe, it, expect, vi, afterEach } from "vitest";
import { SEOEngine } from "./seo-engine";
import type { JsonLdSchema, SEOPageConfig } from "../types/seo-types";

afterEach(() => vi.unstubAllEnvs());

function secondBreadcrumbName(jsonLd: JsonLdSchema[]): string {
  const crumbs = jsonLd.find(
    (schema) => (schema as { "@type": string })["@type"] === "BreadcrumbList"
  ) as { itemListElement: Array<{ name: string }> };
  return crumbs.itemListElement[1].name;
}

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
    expect(jsonLd.some((schema) => (schema as { "@type": string })["@type"] === "BlogPosting")).toBe(true);
    expect(jsonLd.some((schema) => (schema as { "@type": string })["@type"] === "BreadcrumbList")).toBe(true);
    expect(structuredData).toContain("@type");
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
    expect(jsonLd.some((schema) => (schema as { "@type": string })["@type"] === "BlogPosting")).toBe(true);
    const crumbs = jsonLd.find(
      (schema) => (schema as { "@type": string })["@type"] === "BreadcrumbList"
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
    const match = entries.find((entry) => entry.url.endsWith("/blog/my-post"));
    expect(match).toBeDefined();
    expect(match?.priority).toBe(0.6);
    expect(match?.changeFrequency).toBe("daily");
    expect(match?.lastModified).toBe("2026-01-01T00:00:00.000Z");
  });

  it("falls back to defaults when a dynamic page omits optional fields", () => {
    const engine = new SEOEngine();
    const entries = engine.generateSitemapData([{ path: "blog/other" }]);
    const match = entries.find((entry) => entry.url.endsWith("/blog/other"));
    expect(match?.priority).toBe(0.7);
    expect(match?.changeFrequency).toBe("monthly");
    expect(entries.some((entry) => entry.url.endsWith("/blog"))).toBe(true);
  });
});

describe("SEOEngine breadcrumb labels match the visible breadcrumb", () => {
  it("names the About page breadcrumb in both locales", () => {
    const engine = new SEOEngine();
    expect(secondBreadcrumbName(engine.createAboutSEO("nl").jsonLd)).toBe("Over mij");
    expect(secondBreadcrumbName(engine.createAboutSEO("en").jsonLd)).toBe("About me");
  });

  it("names the Projects page breadcrumb in both locales", () => {
    const engine = new SEOEngine();
    expect(secondBreadcrumbName(engine.createProjectsSEO("nl").jsonLd)).toBe("Resultaten");
    expect(secondBreadcrumbName(engine.createProjectsSEO("en").jsonLd)).toBe("Results");
  });

  it("names the Book page breadcrumb in both locales", () => {
    const engine = new SEOEngine();
    expect(secondBreadcrumbName(engine.createBookingSEO("nl").jsonLd)).toBe("Plan een gesprek");
    expect(secondBreadcrumbName(engine.createBookingSEO("en").jsonLd)).toBe("Book a call");
  });
});

describe("SEOEngine.validateSEOConfig", () => {
  it("flags a too-short title/description and too-few keywords as warnings", () => {
    const engine = new SEOEngine();
    const result = engine.validateSEOConfig(baseConfig({ title: "Short", description: "Tiny", keywords: ["x"] }));
    expect(result.isValid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("flags an over-long title and description as errors (invalid)", () => {
    const engine = new SEOEngine();
    const result = engine.validateSEOConfig(
      baseConfig({
        title: "T".repeat(70),
        description: "D".repeat(200),
        keywords: Array.from({ length: 16 }, (_, index) => `k${index}`),
      })
    );
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("passes a well-formed config", () => {
    const engine = new SEOEngine();
    const result = engine.validateSEOConfig(
      baseConfig({
        title: "A reasonably descriptive page title for SEO testing",
        description:
          "This description is intentionally between one hundred twenty and one hundred sixty characters so that it passes the SEO validation rules cleanly today.",
        keywords: ["a", "b", "c", "d", "e", "f"],
      })
    );
    expect(result.isValid).toBe(true);
  });
});
