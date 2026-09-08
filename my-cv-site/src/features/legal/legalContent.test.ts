import { describe, it, expect } from "vitest";
import { LEGAL_CONTENT, type LegalLocale, type LegalSlug } from "./legalContent";

const SLUGS: LegalSlug[] = ["privacy", "terms", "cookies", "disclaimer"];
const LOCALES: LegalLocale[] = ["en", "nl"];
const DESCRIPTION_LIMIT = 160;

describe("LEGAL_CONTENT meta descriptions", () => {
  for (const slug of SLUGS) {
    for (const locale of LOCALES) {
      it(`${slug}/${locale}: stays under the length limit and ends on a full stop`, () => {
        const { metaDescription } = LEGAL_CONTENT[slug][locale];
        expect(metaDescription.length).toBeGreaterThan(0);
        expect(metaDescription.length).toBeLessThanOrEqual(DESCRIPTION_LIMIT);
        expect(metaDescription.endsWith(".")).toBe(true);
        expect(metaDescription).not.toContain("…");
      });
    }
  }

  it("gives every page a distinct description per locale", () => {
    for (const locale of LOCALES) {
      const descriptions = SLUGS.map((slug) => LEGAL_CONTENT[slug][locale].metaDescription);
      expect(new Set(descriptions).size).toBe(descriptions.length);
    }
  });
});
