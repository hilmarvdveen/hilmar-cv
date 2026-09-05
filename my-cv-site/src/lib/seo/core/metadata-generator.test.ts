import { describe, it, expect } from "vitest";
import { MetadataGenerator } from "./metadata-generator";
import type { SEOPageConfig } from "../types/seo-types";

const gen = new MetadataGenerator();

function buildConfiguration(overrides: Partial<SEOPageConfig> = {}): SEOPageConfig {
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
    const meta = gen.generateMetadata(buildConfiguration());
    expect(String(meta.robots)).toMatch(/index/i);
    expect(String(meta.robots)).toMatch(/follow/i);
  });

  it("emits noindex/nofollow when configured", () => {
    const meta = gen.generateMetadata(buildConfiguration({ noIndex: true, noFollow: true }));
    expect(String(meta.robots)).toMatch(/noindex/i);
    expect(String(meta.robots)).toMatch(/nofollow/i);
  });

  it("uses the article OG type for blog posts and website otherwise", () => {
    const post = gen.generateMetadata(buildConfiguration({ pageType: "blog-post", path: "/blog/x" }));
    expect((post.openGraph as { type?: string })?.type).toBe("article");
    const page = gen.generateMetadata(buildConfiguration());
    expect((page.openGraph as { type?: string })?.type).toBe("website");
  });

  it("produces canonical + hreflang alternates for both locales", () => {
    const en = gen.generateMetadata(buildConfiguration({ locale: "en" }));
    const nl = gen.generateMetadata(buildConfiguration({ locale: "nl" }));
    expect(en.alternates?.canonical).toBeTruthy();
    expect(en.alternates?.languages).toBeTruthy();
    expect(en.alternates?.canonical).not.toEqual(nl.alternates?.canonical);
  });

  it("prefixes every locale, the Dutch default included, because routing always prefixes", () => {
    const nl = gen.generateMetadata(buildConfiguration({ locale: "nl", path: "/about" }));
    const home = gen.generateMetadata(buildConfiguration({ locale: "nl", path: "/" }));
    expect(String(nl.alternates?.canonical)).toBe("https://www.hilmarvanderveen.com/nl/about");
    expect(String(home.alternates?.canonical)).toBe("https://www.hilmarvanderveen.com/nl");
    const languages = nl.alternates?.languages as Record<string, string>;
    expect(languages["nl-NL"]).toBe("https://www.hilmarvanderveen.com/nl/about");
    expect(languages["en-US"]).toBe("https://www.hilmarvanderveen.com/en/about");
    expect(languages["x-default"]).toBe("https://www.hilmarvanderveen.com/nl/about");
  });

  it("uses Next-compatible Open Graph keys (alternateLocale)", () => {
    const og = gen.generateMetadata(buildConfiguration({ locale: "en" })).openGraph as Record<string, unknown>;
    expect(og.image).toBeUndefined();
    expect(og.imageAlt).toBeUndefined();
    expect(Array.isArray(og.alternateLocale)).toBe(true);
    expect(og.alternateLocale).toContain("nl_NL");
    expect(og.locale).toBe("en_US");
  });

  it("keeps a short title/description un-truncated", () => {
    const meta = gen.generateMetadata(buildConfiguration({ title: "Hi", description: "Short." }));
    expect(meta.title).toBeTruthy();
    expect(meta.description).toBeTruthy();
  });

  it("truncates an over-long title cleanly, without three dots or an ellipsis before the brand", () => {
    const longTitle =
      "Hilmar van der Veen - Senior Frontend Developer Amsterdam | React, Angular, Next.js, TypeScript Expert";
    const title = String(gen.generateMetadata(buildConfiguration({ title: longTitle })).title);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).not.toContain("...");
    expect(title).not.toMatch(/…\s*\|/);
  });

  it("truncates an over-long description on a word boundary with one ellipsis", () => {
    const longDescription = Array.from({ length: 40 }, () => "word").join(" ");
    const description = String(gen.generateMetadata(buildConfiguration({ description: longDescription })).description);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(description.endsWith("word…")).toBe(true);
  });

  it("uses the name alone as the Open Graph site name, matching the developer titles", () => {
    const og = gen.generateMetadata(buildConfiguration()).openGraph as { siteName?: string };
    expect(og.siteName).toBe("Hilmar van der Veen");
  });

  it("points OG and Twitter images at the generated card routes of the same locale", () => {
    const meta = gen.generateMetadata(buildConfiguration({ locale: "nl" }));
    const og = meta.openGraph as { images: { url: string; width: number; height: number }[] };
    const tw = meta.twitter as { images: string[] };
    expect(og.images[0].url).toContain("https://www.hilmarvanderveen.com/api/og?locale=nl&title=");
    expect(og.images[0].width).toBe(1200);
    expect(og.images[0].height).toBe(630);
    expect(tw.images[0]).toContain("https://www.hilmarvanderveen.com/api/og?locale=nl&title=");
  });
});
