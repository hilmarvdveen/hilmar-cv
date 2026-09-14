import { describe, expect, it } from "vitest";
import { SEOFactory } from "./factory";
import type { Locale } from "./types/seo-types";
import { META_LIMITS } from "./constants/meta-constants";
import { brandedTitle } from "./alternates";
import englishMessages from "@/i18n/messages/en.json";
import dutchMessages from "@/i18n/messages/nl.json";

const FIT_TITLE_LIMIT = 38;
const DESCRIPTION_MINIMUM = 50;

const pages = {
  homepage: (locale: Locale) => SEOFactory.homepage(locale),
  about: (locale: Locale) => SEOFactory.about(locale),
  services: (locale: Locale) => SEOFactory.services(locale),
  projects: (locale: Locale) => SEOFactory.projects(locale),
  contact: (locale: Locale) => SEOFactory.contact(locale),
  booking: (locale: Locale) => SEOFactory.booking(locale),
  blog: (locale: Locale) => SEOFactory.blog(locale),
  frontendService: (locale: Locale) => SEOFactory.frontendService(locale),
  fullstackService: (locale: Locale) => SEOFactory.fullstackService(locale),
  designSystemsService: (locale: Locale) => SEOFactory.designSystemsService(locale),
  consultingService: (locale: Locale) => SEOFactory.consultingService(locale),
};

const bannedInCopy = [/Amsterdam,? Netherlands$/, /8\+/, /MSc/, /Ziggo/, /Vue/, /—/];

describe("SEO copy stays inside the limits and the guardrails", () => {
  for (const [page, build] of Object.entries(pages)) {
    for (const locale of ["nl", "en"] as Locale[]) {
      it(`${page}/${locale}: title and description fit without truncation`, () => {
        const { metadata } = build(locale);
        const title = String(metadata.title);
        const description = String(metadata.description);
        expect(title.length).toBeLessThanOrEqual(META_LIMITS.TITLE.MAX);
        expect(title).not.toContain("…");
        expect(description.length).toBeLessThanOrEqual(META_LIMITS.DESCRIPTION.MAX);
        expect(description).not.toContain("…");
        for (const pattern of bannedInCopy) {
          expect(title).not.toMatch(pattern);
          expect(description).not.toMatch(pattern);
        }
      });
    }
  }

  it("keeps the vacancy check title short enough for the brand suffix", () => {
    for (const messages of [englishMessages, dutchMessages]) {
      const title = messages.fit.meta.title;
      const description = messages.fit.meta.description;
      expect(title.length).toBeLessThanOrEqual(FIT_TITLE_LIMIT);
      expect(brandedTitle(title).length).toBeLessThanOrEqual(META_LIMITS.TITLE.MAX);
      expect(description.length).toBeGreaterThanOrEqual(DESCRIPTION_MINIMUM);
      expect(description.length).toBeLessThanOrEqual(META_LIMITS.DESCRIPTION.MAX);
      for (const pattern of bannedInCopy) {
        expect(title).not.toMatch(pattern);
        expect(description).not.toMatch(pattern);
      }
    }
  });

  it("keeps the rate out of the vacancy check copy", () => {
    for (const messages of [englishMessages, dutchMessages]) {
      expect(JSON.stringify(messages.fit)).not.toMatch(/€\s?\d/);
    }
  });

  it("gives every page a distinct title per locale", () => {
    for (const locale of ["nl", "en"] as Locale[]) {
      const titles = Object.values(pages).map((build) => String(build(locale).metadata.title));
      expect(new Set(titles).size).toBe(titles.length);
    }
  });
});
