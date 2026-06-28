import { describe, it, expect } from "vitest";
import { SEOFactory } from "./factory";
import type { Locale } from "./types/seo-types";

// Exercising SEOFactory transitively covers SEOEngine + MetadataGenerator +
// SchemaGenerator (the bulk of the SEO logic) with no mocking.

const PAGES = [
  "homepage",
  "about",
  "services",
  "projects",
  "contact",
  "booking",
  "privacy",
  "blog",
  "frontendService",
  "fullstackService",
  "designSystemsService",
  "consultingService",
] as const;

const locales: Locale[] = ["en", "nl"];

describe("SEOFactory page builders", () => {
  for (const locale of locales) {
    for (const page of PAGES) {
      it(`${page} (${locale}) returns metadata + jsonLd + structuredData`, () => {
        const result = SEOFactory[page](locale);
        expect(typeof result.metadata.title).toBe("string");
        expect((result.metadata.title as string).length).toBeGreaterThan(0);
        expect(typeof result.metadata.description).toBe("string");

        // canonical + language alternates present
        expect(result.metadata.alternates?.canonical).toBeTruthy();
        expect(result.metadata.alternates?.languages).toBeTruthy();

        // at least one JSON-LD schema, each with an @type
        expect(Array.isArray(result.jsonLd)).toBe(true);
        expect(result.jsonLd.length).toBeGreaterThan(0);
        for (const schema of result.jsonLd) {
          expect(schema).toHaveProperty("@type");
        }

        // structuredData is a serialized <script>-ready string
        expect(typeof result.structuredData).toBe("string");
        expect(result.structuredData).toContain("@type");
      });
    }
  }

  it("produces locale-specific canonical URLs", () => {
    const en = SEOFactory.homepage("en");
    const nl = SEOFactory.homepage("nl");
    expect(en.metadata.alternates?.canonical).not.toEqual(
      nl.metadata.alternates?.canonical
    );
  });

  it("builds the FAQ page schema from provided items (both locales)", () => {
    for (const locale of locales) {
      const result = SEOFactory.faq(locale, [
        { question: "Q1?", answer: "A1" },
        { question: "Q2?", answer: "A2" },
      ]);
      const hasFaq = result.jsonLd.some((s) => (s as { "@type": string })["@type"] === "FAQPage");
      expect(hasFaq).toBe(true);
    }
  });
});

describe("SEOFactory analytics passthroughs", () => {
  it("trackPageView runs without throwing (no-op without window.gtag)", () => {
    expect(() => SEOFactory.trackPageView("homepage", "en", "Home", "/")).not.toThrow();
  });

  it("getAnalytics returns undefined in a non-browser environment", () => {
    expect(SEOFactory.getAnalytics()).toBeUndefined();
  });
});

describe("metadata quality across all pages (regression: title/desc/robots)", () => {
  const PAGE_FNS = [
    "homepage",
    "about",
    "services",
    "projects",
    "contact",
    "booking",
    "privacy",
    "blog",
    "frontendService",
    "fullstackService",
    "designSystemsService",
    "consultingService",
  ] as const;

  for (const locale of locales) {
    for (const page of PAGE_FNS) {
      const meta = SEOFactory[page](locale).metadata;
      const title = String(meta.title);

      it(`${page}/${locale}: title is clean and within length`, () => {
        expect(title.length).toBeGreaterThan(0);
        // Google truncates titles around 60 chars.
        expect(title.length).toBeLessThanOrEqual(60);
        // The bug we fixed: a literal three-dot ellipsis, and never
        // "<truncated>… | Brand".
        expect(title).not.toContain("...");
        expect(title).not.toMatch(/…\s*\|/);
        // The brand name must not be duplicated in one title.
        expect(title.split("Hilmar van der Veen").length - 1).toBeLessThanOrEqual(1);
      });

      it(`${page}/${locale}: description, robots and canonical are sound`, () => {
        const description = String(meta.description ?? "");
        expect(description.length).toBeGreaterThan(50);
        expect(description.length).toBeLessThanOrEqual(165);
        // Content pages must be indexable with large image previews.
        expect(String(meta.robots)).toMatch(/index/);
        expect(String(meta.robots)).not.toMatch(/noindex/);
        expect(String(meta.robots)).toContain("max-image-preview:large");
        expect(meta.alternates?.canonical).toBeTruthy();
        expect(meta.alternates?.languages).toBeTruthy();
      });
    }
  }

  it("faq: title is clean and within length", () => {
    const title = String(SEOFactory.faq("en", [{ question: "Q?", answer: "A" }]).metadata.title);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).not.toContain("...");
  });
});

describe("SEO structured-data & robots correctness", () => {
  const home = SEOFactory.homepage("en");

  it("uses valid (URL) sameAs entries on Person/Organization schemas", () => {
    const withSameAs = home.jsonLd.filter(
      (s) => Array.isArray((s as { sameAs?: unknown[] }).sameAs)
    ) as Array<{ sameAs: string[] }>;
    expect(withSameAs.length).toBeGreaterThan(0);
    for (const schema of withSameAs) {
      for (const ref of schema.sameAs) {
        expect(ref).toMatch(/^https?:\/\//); // no bare @handles
      }
    }
  });

  it("references an existing profile image in the Person schema", () => {
    const person = home.jsonLd.find(
      (s) => (s as { "@type"?: string })["@type"] === "Person"
    ) as { image?: string } | undefined;
    expect(person?.image).toContain("/images/profile.jpg");
  });

  it("requests large image previews via robots", () => {
    expect(String(home.metadata.robots)).toContain("max-image-preview:large");
  });
});

describe("SEOFactory.generateSitemapData", () => {
  const entries = SEOFactory.generateSitemapData();
  it("returns entries with url, priority and hreflang alternates", () => {
    expect(entries.length).toBeGreaterThan(0);
    for (const e of entries) {
      expect(typeof e.url).toBe("string");
      expect(typeof e.priority).toBe("number");
      expect(Array.isArray(e.alternates)).toBe(true);
      expect(e.alternates.length).toBeGreaterThan(0);
      expect(e.alternates[0]).toHaveProperty("hreflang");
      expect(e.alternates[0]).toHaveProperty("href");
    }
  });
});
