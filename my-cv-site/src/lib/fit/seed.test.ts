import { describe, expect, it } from "vitest";
import {
  BUSINESS_PROFILE,
  PRICING,
  QUALIFICATIONS,
  RATE_TEXT,
} from "@/lib/seo/constants/meta-constants";
import { SEED_SCHEMA_VERSION, buildSeedRecord, type SeedRecordInput } from "./seed";

const messagesFor = (suffix: string) => ({
  work: {
    tech: { react: "React", kotlin: "Kotlin", wcag22: "WCAG 2.2 AA" },
    bol: {
      company: "bol.com",
      location: "Utrecht",
      role: `Senior Frontend Engineer ${suffix}`,
      headline: `Loyalty on a new platform ${suffix}`,
      summary: `Moved the account pages ${suffix}`,
      delivered: [`Subscriptions on React ${suffix}`, `Reversible cut-over ${suffix}`],
      body: [
        { paragraph: `The storefront ran on Java ${suffix}` },
        { heading: `The cut-over ${suffix}`, paragraph: `Traffic moved per percentage ${suffix}` },
      ],
    },
    niped: {
      company: "Niped",
      location: "Hoorn",
      role: `Frontend Developer ${suffix}`,
      headline: `Health insight ${suffix}`,
      summary: `Rebuilt the intake ${suffix}`,
      delivered: [`Intake in React ${suffix}`],
      body: [{ paragraph: `The intake became a wizard ${suffix}` }],
    },
  },
  faq: {
    categories: {
      general: {
        title: `General ${suffix}`,
        questions: [
          { question: `Who are you ${suffix}`, answer: `A frontend engineer ${suffix}` },
          { question: `Where do you work ${suffix}`, answer: `The Randstad ${suffix}` },
        ],
      },
      pricing: {
        title: `Pricing ${suffix}`,
        questions: [{ question: `What does it cost ${suffix}`, answer: `Scoped on the call ${suffix}` }],
      },
    },
  },
});

const input: SeedRecordInput = {
  generatedAt: "2026-09-13T10:00:00.000Z",
  engagements: [
    {
      id: "bol",
      company: "bol.com",
      from: "2025-07",
      to: "2026-10",
      location: "Utrecht",
      mode: "workMode.hybrid",
      language: "language.dutch",
      tech: ["tech.react", "tech.wcag22"],
    },
    {
      id: "niped",
      company: "Niped",
      from: "2017-12",
      to: "2018-03",
      location: "Hoorn",
      mode: "workMode.onSite",
      language: "language.english",
      tech: ["tech.kotlin"],
    },
  ],
  posts: [
    {
      slug: "reversible-cut-over",
      category: "architecture",
      track: "fullstack",
      publishedDate: "2026-09-06",
      updatedDate: "2026-09-08",
      title: { en: "Moving live traffic", nl: "Live verkeer verplaatsen" },
      description: { en: "The method", nl: "De methode" },
      keywords: ["cut-over"],
    },
    {
      slug: "graphql-contract",
      category: "architecture",
      track: "fullstack",
      publishedDate: "2026-09-06",
      title: { en: "GraphQL as a contract", nl: "GraphQL als contract" },
      description: { en: "One schema", nl: "Eén schema" },
      keywords: ["graphql"],
    },
  ],
  messages: { en: messagesFor("EN"), nl: messagesFor("NL") },
};

describe("buildSeedRecord", () => {
  const record = buildSeedRecord(input);

  it("carries the schema version, the generation stamp and the site", () => {
    expect(record.schemaVersion).toBe(SEED_SCHEMA_VERSION);
    expect(record.schemaVersion).toBe(1);
    expect(record.generatedAt).toBe("2026-09-13T10:00:00.000Z");
    expect(record.site).toBe(BUSINESS_PROFILE.CONTACT.WEBSITE);
  });

  it("builds the profile from the identity constants", () => {
    expect(record.profile.name).toBe(BUSINESS_PROFILE.NAME);
    expect(record.profile.registration.kvk).toBe(BUSINESS_PROFILE.REGISTRATION.KVK);
    expect(record.profile.city).toBe("Zandvoort");
    expect(record.profile.region).toBe("Randstad");
    expect(record.profile.country).toBe("NL");
    expect(record.profile.serviceArea.cities).toEqual([...BUSINESS_PROFILE.SERVICE_AREA.CITIES]);
    expect(record.profile.availableFrom).toEqual({
      en: BUSINESS_PROFILE.AVAILABLE_FROM,
      nl: BUSINESS_PROFILE.AVAILABLE_FROM_DUTCH,
    });
    expect(record.profile.rate).toEqual({
      minimum: PRICING.HOURLY_RATE_MIN,
      maximum: PRICING.HOURLY_RATE_MAX,
      currency: PRICING.CURRENCY,
      vatIncluded: false,
      text: { en: RATE_TEXT.en, nl: RATE_TEXT.nl },
    });
    expect(record.profile.qualifications.certifications).toEqual([
      ...QUALIFICATIONS.CERTIFICATIONS,
    ]);
  });

  it("maps the mode and language keys to their plain values", () => {
    expect(record.engagements.map((engagement) => engagement.mode)).toEqual(["hybrid", "onSite"]);
    expect(record.engagements.map((engagement) => engagement.language)).toEqual([
      "dutch",
      "english",
    ]);
  });

  it("writes the English technology labels beside their keys", () => {
    expect(record.engagements[0].technologies).toEqual(["React", "WCAG 2.2 AA"]);
    expect(record.engagements[0].technologyKeys).toEqual(["react", "wcag22"]);
    expect(record.engagements[1].technologies).toEqual(["Kotlin"]);
  });

  it("carries the engagement url, role, headline, summary and delivered per locale", () => {
    const [bol] = record.engagements;
    expect(bol.url).toBe("/experience/bol");
    expect(bol.from).toBe("2025-07");
    expect(bol.to).toBe("2026-10");
    expect(bol.role).toEqual({
      en: "Senior Frontend Engineer EN",
      nl: "Senior Frontend Engineer NL",
    });
    expect(bol.headline.nl).toBe("Loyalty on a new platform NL");
    expect(bol.summary.en).toBe("Moved the account pages EN");
    expect(bol.delivered.nl).toEqual(["Subscriptions on React NL", "Reversible cut-over NL"]);
  });

  it("carries the story paragraphs of the engagement page in order, per locale", () => {
    const [bol, niped] = record.engagements;
    expect(bol.stories.en).toEqual([
      "The storefront ran on Java EN",
      "Traffic moved per percentage EN",
    ]);
    expect(bol.stories.nl).toEqual([
      "The storefront ran on Java NL",
      "Traffic moved per percentage NL",
    ]);
    expect(niped.stories.nl).toEqual(["The intake became a wizard NL"]);
  });

  it("gives every post a url and turns a missing update date into null", () => {
    expect(record.posts[0]).toMatchObject({
      slug: "reversible-cut-over",
      url: "/blog/reversible-cut-over",
      track: "fullstack",
      category: "architecture",
      publishedDate: "2026-09-06",
      updatedDate: "2026-09-08",
      keywords: ["cut-over"],
    });
    expect(record.posts[1].updatedDate).toBeNull();
    expect(record.posts[1].title.nl).toBe("GraphQL als contract");
  });

  it("flattens the faq into one entry per question with both locales", () => {
    expect(record.faq).toHaveLength(3);
    expect(record.faq[0]).toEqual({
      category: "general",
      categoryTitle: { en: "General EN", nl: "General NL" },
      question: { en: "Who are you EN", nl: "Who are you NL" },
      answer: { en: "A frontend engineer EN", nl: "A frontend engineer NL" },
    });
    expect(record.faq[2].category).toBe("pricing");
  });
});
