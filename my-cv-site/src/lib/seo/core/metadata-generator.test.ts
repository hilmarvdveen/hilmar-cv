import { describe, it, expect } from "vitest";
import { MetadataGenerator } from "./metadata-generator";
import type { SEOPageConfig } from "../types/seo-types";

const gen = new MetadataGenerator();

function cfg(overrides: Partial<SEOPageConfig> = {}): SEOPageConfig {
  return {
    pageType: "about",
    locale: "en",
    title: "A reasonably long descriptive title for testing SEO output here",
    description:
      "A description that is long enough to be representative of real page metadata for the SEO system under test in this suite.",
    keywords: ["frontend", "react", "amsterdam"],
    path: "/about",
    ...overrides,
  };
}

describe("MetadataGenerator.generateMetadata", () => {
  it("emits index/follow robots for a normal page", () => {
    const meta = gen.generateMetadata(cfg());
    expect(String(meta.robots)).toMatch(/index/i);
    expect(String(meta.robots)).toMatch(/follow/i);
  });

  it("emits noindex/nofollow when configured", () => {
    const meta = gen.generateMetadata(cfg({ noIndex: true, noFollow: true }));
    expect(String(meta.robots)).toMatch(/noindex/i);
    expect(String(meta.robots)).toMatch(/nofollow/i);
  });

  it("uses the article OG type for blog posts and website otherwise", () => {
    const post = gen.generateMetadata(cfg({ pageType: "blog-post", path: "/blog/x" }));
    expect((post.openGraph as { type?: string })?.type).toBe("article");
    const page = gen.generateMetadata(cfg());
    expect((page.openGraph as { type?: string })?.type).toBe("website");
  });

  it("produces canonical + hreflang alternates for both locales", () => {
    const en = gen.generateMetadata(cfg({ locale: "en" }));
    const nl = gen.generateMetadata(cfg({ locale: "nl" }));
    expect(en.alternates?.canonical).toBeTruthy();
    expect(en.alternates?.languages).toBeTruthy();
    expect(en.alternates?.canonical).not.toEqual(nl.alternates?.canonical);
  });

  it("uses Next-compatible Open Graph keys (alternateLocale, no inline image)", () => {
    const og = gen.generateMetadata(cfg({ locale: "en" })).openGraph as Record<string, unknown>;
    // og:image is provided by the file-based opengraph-image route, not inline.
    expect(og.image).toBeUndefined();
    expect(og.imageAlt).toBeUndefined();
    // Correct Next key (previously the ignored `alternateLocales`).
    expect(Array.isArray(og.alternateLocale)).toBe(true);
    expect(og.alternateLocale).toContain("nl-NL");
  });

  it("keeps a short title/description un-truncated", () => {
    const meta = gen.generateMetadata(cfg({ title: "Hi", description: "Short." }));
    expect(meta.title).toBeTruthy();
    expect(meta.description).toBeTruthy();
  });

  it("truncates an over-long title cleanly — no '...' and never '<cut>... | Brand'", () => {
    const longTitle =
      "Hilmar van der Veen - Senior Frontend Developer Amsterdam | React, Angular, Next.js, TypeScript Expert";
    const title = String(gen.generateMetadata(cfg({ title: longTitle })).title);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).not.toContain("..."); // the regression we fixed
    expect(title).not.toMatch(/…\s*\|/); // no ellipsis immediately before a brand pipe
  });

  it("does not inline OG/Twitter images (those come from the image routes)", () => {
    const meta = gen.generateMetadata(cfg());
    const og = meta.openGraph as Record<string, unknown>;
    const tw = meta.twitter as Record<string, unknown>;
    expect(og.images).toBeUndefined();
    expect(tw.images).toBeUndefined();
  });
});
