import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { SEOFactory } from "./factory";
import type { Locale } from "./types/seo-types";

/**
 * Validates the JSON-LD that each page injects into its
 * <script type="application/ld+json"> (seoData.structuredData). The single
 * most important check: the whole script must be ONE valid JSON value — a
 * regression here (e.g. concatenating objects) silently breaks rich results.
 */

const LOCALES: Locale[] = ["en", "nl"];
const CANONICAL_HOST = "www.hilmarvanderveen.com";
const FAQ = [
  { question: "What do you charge?", answer: "It depends on the project scope." },
  { question: "Where are you based?", answer: "Amsterdam, the Netherlands." },
];

function pagesFor(locale: Locale): Record<string, string> {
  return {
    homepage: SEOFactory.homepage(locale).structuredData,
    about: SEOFactory.about(locale).structuredData,
    services: SEOFactory.services(locale).structuredData,
    projects: SEOFactory.projects(locale).structuredData,
    contact: SEOFactory.contact(locale).structuredData,
    booking: SEOFactory.booking(locale).structuredData,
    blog: SEOFactory.blog(locale).structuredData,
    privacy: SEOFactory.privacy(locale).structuredData,
    faq: SEOFactory.faq(locale, FAQ).structuredData,
    frontendService: SEOFactory.frontendService(locale).structuredData,
    fullstackService: SEOFactory.fullstackService(locale).structuredData,
    designSystemsService: SEOFactory.designSystemsService(locale).structuredData,
    consultingService: SEOFactory.consultingService(locale).structuredData,
  };
}

// Depth-first walk over the parsed JSON, calling visit(key, value) for every
// key/value pair encountered (including inside arrays).
function walk(node: unknown, visit: (key: string, value: unknown) => void): void {
  if (Array.isArray(node)) {
    node.forEach((n) => walk(n, visit));
    return;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      visit(k, v);
      walk(v, visit);
    }
  }
}

// Recursively collect every object whose @type matches (handles nesting/arrays).
function collectByType(
  node: unknown,
  type: string,
  out: Array<Record<string, unknown>> = []
): Array<Record<string, unknown>> {
  if (Array.isArray(node)) {
    node.forEach((n) => collectByType(n, type, out));
    return out;
  }
  if (node && typeof node === "object") {
    const obj = node as Record<string, unknown>;
    if (obj["@type"] === type) out.push(obj);
    for (const v of Object.values(obj)) collectByType(v, type, out);
  }
  return out;
}

function typeSet(schemas: Array<Record<string, unknown>>): Set<string> {
  const set = new Set<string>();
  for (const s of schemas) {
    const t = s["@type"];
    (Array.isArray(t) ? t : [t]).forEach((x) => typeof x === "string" && set.add(x));
  }
  return set;
}

function hasType(schema: Record<string, unknown>, type: string): boolean {
  const t = schema["@type"];
  return Array.isArray(t) ? t.includes(type) : t === type;
}

describe("structured data (JSON-LD) per page", () => {
  for (const locale of LOCALES) {
    for (const [name, raw] of Object.entries(pagesFor(locale))) {
      describe(`${name} [${locale}]`, () => {
        it("is ONE valid JSON value (array of schema objects)", () => {
          let parsed: unknown;
          expect(() => {
            parsed = JSON.parse(raw);
          }).not.toThrow();
          expect(Array.isArray(parsed)).toBe(true);
          expect((parsed as unknown[]).length).toBeGreaterThan(0);
        });

        it("every schema has @context schema.org and a @type", () => {
          const schemas = JSON.parse(raw) as Array<Record<string, unknown>>;
          for (const s of schemas) {
            expect(String(s["@context"])).toMatch(/schema\.org/);
            const t = s["@type"];
            expect(typeof t === "string" || Array.isArray(t)).toBe(true);
          }
        });

        it("includes the core entity types (WebSite, Organization, Person, WebPage)", () => {
          const types = typeSet(JSON.parse(raw));
          for (const t of ["WebSite", "Organization", "Person", "WebPage"]) {
            expect(types.has(t)).toBe(true);
          }
        });

        it("has no leaked 'undefined', and valid URLs / sameAs", () => {
          walk(JSON.parse(raw), (key, value) => {
            if (typeof value === "string") {
              expect(value.includes("undefined"), `'${key}' = "${value}"`).toBe(false);
              if (
                ["url", "@id", "logo", "contentUrl"].includes(key) &&
                /^https?:/.test(value)
              ) {
                expect(() => new URL(value)).not.toThrow();
                expect(new URL(value).protocol).toBe("https:");
              }
            }
            if (key === "sameAs") {
              const arr = Array.isArray(value) ? value : [value];
              for (const v of arr) expect(String(v)).toMatch(/^https?:\/\//);
            }
          });
        });

        it("self/canonical URLs use the www host", () => {
          const schemas = JSON.parse(raw) as Array<Record<string, unknown>>;
          const webpage = schemas.find((s) => hasType(s, "WebPage"));
          expect(webpage?.url).toBeTruthy();
          expect(new URL(String(webpage!.url)).host).toBe(CANONICAL_HOST);
        });

        it("WebSite SearchAction (if present) targets /search", () => {
          const schemas = JSON.parse(raw) as Array<Record<string, unknown>>;
          const site = schemas.find((s) => hasType(s, "WebSite"));
          const action = site?.potentialAction as
            | { target?: unknown }
            | undefined;
          if (action?.target) {
            const target =
              typeof action.target === "string"
                ? action.target
                : (action.target as { urlTemplate?: string }).urlTemplate;
            expect(String(target)).toContain("/search");
          }
        });
      });
    }
  }

  it("every self-hosted image/logo URL resolves to a real file in public/", () => {
    // Catches schema images that 404 (e.g. /images/logo.png when only
    // logo_v1.png exists) — something URL-shape validation can't see.
    const imgExt = /\.(png|jpe?g|webp|svg|gif|ico)$/i;
    const missing = new Set<string>();
    for (const locale of LOCALES) {
      for (const raw of Object.values(pagesFor(locale))) {
        walk(JSON.parse(raw), (_key, value) => {
          if (
            typeof value === "string" &&
            value.startsWith(`https://${CANONICAL_HOST}/`) &&
            imgExt.test(value)
          ) {
            const path = new URL(value).pathname; // e.g. /images/logo_v1.png
            if (!existsSync(resolve(process.cwd(), "public", `.${path}`))) {
              missing.add(value);
            }
          }
        });
      }
    }
    expect([...missing]).toEqual([]);
  });

  it("Person.hasCredential entries are credential objects, not bare strings", () => {
    const schemas = JSON.parse(
      SEOFactory.homepage("en").structuredData
    ) as Array<Record<string, unknown>>;
    const person = schemas.find((s) => hasType(s, "Person")) as
      | { hasCredential?: unknown[] }
      | undefined;
    if (person?.hasCredential) {
      for (const c of person.hasCredential) {
        expect(typeof c).toBe("object");
        expect((c as Record<string, unknown>)["@type"]).toBe(
          "EducationalOccupationalCredential"
        );
      }
    }
  });

  it("every Offer has a numeric price and a currency", () => {
    const schemas = JSON.parse(SEOFactory.homepage("en").structuredData);
    const offers = collectByType(schemas, "Offer");
    expect(offers.length).toBeGreaterThan(0);
    for (const o of offers) {
      expect(String(o.price)).toMatch(/^\d+(\.\d+)?$/);
      expect(o.priceCurrency).toBeTruthy();
    }
  });

  it("schema dates are stable across calls (not new Date() per request)", () => {
    const a = JSON.parse(SEOFactory.homepage("en").structuredData) as Array<
      Record<string, unknown>
    >;
    const b = JSON.parse(SEOFactory.homepage("en").structuredData) as Array<
      Record<string, unknown>
    >;
    const dm = (s: Array<Record<string, unknown>>) =>
      s.find((x) => hasType(x, "WebPage"))?.dateModified;
    expect(dm(a)).toBe(dm(b));
  });

  it("FAQ page exposes a non-empty FAQPage with answered questions", () => {
    const schemas = JSON.parse(
      SEOFactory.faq("en", FAQ).structuredData
    ) as Array<Record<string, unknown>>;
    const faqPage = schemas.find((s) => hasType(s, "FAQPage")) as
      | { mainEntity?: Array<Record<string, unknown>> }
      | undefined;
    expect(faqPage).toBeTruthy();
    expect(Array.isArray(faqPage!.mainEntity)).toBe(true);
    expect(faqPage!.mainEntity!.length).toBeGreaterThan(0);
    for (const q of faqPage!.mainEntity!) {
      expect(hasType(q, "Question")).toBe(true);
      expect(q.name).toBeTruthy();
      expect((q.acceptedAnswer as { text?: string } | undefined)?.text).toBeTruthy();
    }
  });
});
