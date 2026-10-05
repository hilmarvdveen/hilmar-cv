import { describe, expect, it } from "vitest";
import englishMessages from "@/i18n/messages/en.json";
import dutchMessages from "@/i18n/messages/nl.json";
import * as metaConstants from "./constants/meta-constants";
import * as pageContent from "./constants/page-content";
import { AVAILABILITY } from "./constants/meta-constants";
import { isPastStartDate, pastAvailabilityDates } from "./availability";

const REVIEW_DAY = new Date("2026-10-05T12:00:00Z");

const messagesByLocale = { en: englishMessages, nl: dutchMessages } as const;

const STATEMENT_KEYS = [
  "common.nav.availability",
  "footer.about.availability",
  "booking.summary.practical.0",
  "services.frontend.engagement.terms.0",
  "services.fullstack.engagement.terms.0",
  "services.designSystems.engagement.terms.0",
  "services.consulting.engagement.terms.0",
];

const SHORT_KEYS = [
  "home.hiring.facts.0.value",
  "about.hiring.facts.0.value",
  "faq.hero.features.quick",
  "contact.facts.items.0.value",
];

const STATEMENT_SENTENCE_KEYS = ["regions.amsterdam.questions.1.answer"];

const SHORT_SENTENCE_KEYS = ["regions.utrecht.questions.2.answer"];

const STATEMENT_ENDING_KEYS = [
  "regions.hub.description",
  "regions.amsterdam.description",
  "regions.utrecht.description",
  "regions.rotterdam.description",
  "regions.den-haag.description",
];

function valueAt(source: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (node, key) => (node as Record<string, unknown> | undefined)?.[key],
      source,
    );
}

function textAt(source: unknown, path: string): string {
  const value = valueAt(source, path);
  if (typeof value !== "string") throw new Error(`no text at ${path}`);
  return value;
}

function collectStrings(node: unknown, path: string, found: [string, string][]): [string, string][] {
  if (typeof node === "string") {
    found.push([path, node]);
  } else if (node && typeof node === "object") {
    for (const [key, child] of Object.entries(node)) {
      collectStrings(child, path ? `${path}.${key}` : key, found);
    }
  }
  return found;
}

describe("pastAvailabilityDates", () => {
  it("flags an availability date that has passed", () => {
    expect(pastAvailabilityDates("Available from 1 October 2026, earlier by arrangement", REVIEW_DAY)).toEqual([
      "Available from 1 October 2026",
    ]);
    expect(pastAvailabilityDates("Beschikbaar vanaf 1 oktober 2026", REVIEW_DAY)).toEqual([
      "Beschikbaar vanaf 1 oktober 2026",
    ]);
  });

  it("flags a bare from date and a date without a year", () => {
    expect(pastAvailabilityDates("From 1 October 2026", REVIEW_DAY)).toEqual(["From 1 October 2026"]);
    expect(pastAvailabilityDates("Can you start before 1 October?", REVIEW_DAY)).toEqual([
      "start before 1 October",
    ]);
  });

  it("accepts a date that is still ahead", () => {
    expect(pastAvailabilityDates("Beschikbaar vanaf 1 december 2026", REVIEW_DAY)).toEqual([]);
    expect(pastAvailabilityDates("Available from 5 October 2026", REVIEW_DAY)).toEqual([]);
  });

  it("ignores a past date outside an availability phrase", () => {
    expect(
      pastAvailabilityDates("On 1 October 2026 bol.com ended the engagement of all external staff.", REVIEW_DAY),
    ).toEqual([]);
  });
});

describe("isPastStartDate", () => {
  it("treats no start date as available now", () => {
    expect(isPastStartDate(null, REVIEW_DAY)).toBe(false);
  });

  it("flags a start date before today and accepts today", () => {
    expect(isPastStartDate("2026-10-01", REVIEW_DAY)).toBe(true);
    expect(isPastStartDate("2026-10-05", REVIEW_DAY)).toBe(false);
  });
});

describe("availability stays current", () => {
  const today = new Date();

  it.each(Object.entries(messagesByLocale))("%s messages name no availability date that has passed", (_, messages) => {
    const stale = collectStrings(messages, "", [])
      .map(([path, text]) => [path, pastAvailabilityDates(text, today)] as const)
      .filter(([, phrases]) => phrases.length > 0);
    expect(stale).toEqual([]);
  });

  it("the SEO constants name no availability date that has passed", () => {
    const stale = collectStrings({ ...metaConstants, ...pageContent }, "", [])
      .map(([path, text]) => [path, pastAvailabilityDates(text, today)] as const)
      .filter(([, phrases]) => phrases.length > 0);
    expect(stale).toEqual([]);
  });

  it("the start date has not passed", () => {
    expect(isPastStartDate(AVAILABILITY.START_DATE, today)).toBe(false);
  });
});

describe("every availability line follows the one source", () => {
  it.each(Object.entries(messagesByLocale))("%s", (locale, messages) => {
    const statement = AVAILABILITY.STATEMENT[locale as keyof typeof AVAILABILITY.STATEMENT];
    const short = AVAILABILITY.SHORT[locale as keyof typeof AVAILABILITY.SHORT];
    for (const key of STATEMENT_KEYS) expect(textAt(messages, key), key).toBe(statement);
    for (const key of SHORT_KEYS) expect(textAt(messages, key), key).toBe(short);
    for (const key of STATEMENT_SENTENCE_KEYS) expect(textAt(messages, key), key).toBe(`${statement}.`);
    for (const key of SHORT_SENTENCE_KEYS) expect(textAt(messages, key), key).toBe(`${short}.`);
    for (const key of STATEMENT_ENDING_KEYS) expect(textAt(messages, key).endsWith(` ${statement}.`), key).toBe(true);
    expect(textAt(messages, "home.hero.badge").startsWith(`${statement} · `)).toBe(true);
    expect(textAt(messages, "faq.categories.general.questions.1.answer").startsWith(`${short}. `)).toBe(true);
  });
});
