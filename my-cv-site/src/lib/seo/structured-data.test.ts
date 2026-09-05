import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { SEOFactory } from "./factory";
import type { Locale } from "./types/seo-types";

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

function walk(node: unknown, visit: (key: string, value: unknown) => void): void {
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child, visit));
    return;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      visit(key, value);
      walk(value, visit);
    }
  }
}

function collectByType(
  node: unknown,
  type: string,
  out: Array<Record<string, unknown>> = []
): Array<Record<string, unknown>> {
  if (Array.isArray(node)) {
    node.forEach((child) => collectByType(child, type, out));
    return out;
  }
  if (node && typeof node === "object") {
    const object = node as Record<string, unknown>;
    if (object["@type"] === type) out.push(object);
    for (const value of Object.values(object)) collectByType(value, type, out);
  }
  return out;
}

function typeSet(schemas: Array<Record<string, unknown>>): Set<string> {
  const set = new Set<string>();
  for (const schema of schemas) {
    const schemaType = schema["@type"];
    (Array.isArray(schemaType) ? schemaType : [schemaType]).forEach((x) => typeof x === "string" && set.add(x));
  }
  return set;
}

function hasType(schema: Record<string, unknown>, type: string): boolean {
  const schemaType = schema["@type"];
  return Array.isArray(schemaType) ? schemaType.includes(type) : schemaType === type;
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
          for (const schema of schemas) {
            expect(String(schema["@context"])).toMatch(/schema\.org/);
            const schemaType = schema["@type"];
            expect(typeof schemaType === "string" || Array.isArray(schemaType)).toBe(true);
          }
        });

        it("includes the core entity types (WebSite, Organization, Person, WebPage)", () => {
          const types = typeSet(JSON.parse(raw));
          for (const schemaType of ["WebSite", "Organization", "Person", "WebPage"]) {
            expect(types.has(schemaType)).toBe(true);
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
              const array = Array.isArray(value) ? value : [value];
              for (const value of array) expect(String(value)).toMatch(/^https?:\/\//);
            }
          });
        });

        it("self/canonical URLs use the www host", () => {
          const schemas = JSON.parse(raw) as Array<Record<string, unknown>>;
          const webpage = schemas.find((schema) => hasType(schema, "WebPage"));
          expect(webpage?.url).toBeTruthy();
          expect(new URL(String(webpage!.url)).host).toBe(CANONICAL_HOST);
        });

        it("WebSite SearchAction (if present) targets /search", () => {
          const schemas = JSON.parse(raw) as Array<Record<string, unknown>>;
          const site = schemas.find((schema) => hasType(schema, "WebSite"));
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
            const path = new URL(value).pathname;
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
    const person = schemas.find((schema) => hasType(schema, "Person")) as
      | { hasCredential?: unknown[] }
      | undefined;
    if (person?.hasCredential) {
      for (const credential of person.hasCredential) {
        expect(typeof credential).toBe("object");
        expect((credential as Record<string, unknown>)["@type"]).toBe(
          "EducationalOccupationalCredential"
        );
      }
    }
  });

  it("every paid Offer carries the published range and never a single price", () => {
    const schemas = JSON.parse(SEOFactory.homepage("en").structuredData);
    const offers = collectByType(schemas, "Offer");
    expect(offers.length).toBeGreaterThan(0);
    const paidOffers = offers.filter((offer) => offer.price !== "0");
    expect(paidOffers.length).toBeGreaterThan(0);
    for (const offer of paidOffers) {
      expect(offer.price).toBeUndefined();
      expect(offer.priceCurrency).toBeUndefined();
      expect(String(offer.priceRange)).toMatch(/^€\d+-\d+$/);
    }
  });

  it("schema dates are stable across calls (not new Date() per request)", () => {
    const first = JSON.parse(SEOFactory.homepage("en").structuredData) as Array<
      Record<string, unknown>
    >;
    const second = JSON.parse(SEOFactory.homepage("en").structuredData) as Array<
      Record<string, unknown>
    >;
    const dm = (schema: Array<Record<string, unknown>>) =>
      schema.find((x) => hasType(x, "WebPage"))?.dateModified;
    expect(dm(first)).toBe(dm(second));
  });

  it("Organization carries the legal identity (legalName + KvK number)", () => {
    const schemas = JSON.parse(
      SEOFactory.homepage("en").structuredData
    ) as Array<Record<string, unknown>>;
    const org = schemas.find((schema) => hasType(schema, "Organization"));
    expect(org?.legalName).toBe("Hilmar ICT Services");
    const id = org?.identifier as
      | { propertyID?: string; value?: string }
      | undefined;
    expect(id?.propertyID).toBe("KvK");
    expect(id?.value).toBe("97564303");
  });

  it("no PostalAddress in any page's schema exposes a street address (privacy)", () => {
    for (const locale of LOCALES) {
      for (const raw of Object.values(pagesFor(locale))) {
        for (const addr of collectByType(JSON.parse(raw), "PostalAddress")) {
          expect(
            addr.streetAddress,
            "home street address must never be published in schema"
          ).toBeUndefined();
        }
      }
    }
  });

  it("emits the WebSite entity once at top level, referenced by @id from WebPage.isPartOf", () => {
    const schemas = JSON.parse(SEOFactory.homepage("en").structuredData) as Array<
      Record<string, unknown>
    >;
    const topLevelWebSites = schemas.filter((schema) => hasType(schema, "WebSite"));
    expect(topLevelWebSites).toHaveLength(1);
    expect(String(topLevelWebSites[0]["@id"])).toMatch(/^https:\/\/.+#website$/);

    const webPage = schemas.find((schema) => hasType(schema, "WebPage")) as
      | { isPartOf?: Record<string, unknown> }
      | undefined;
    expect(webPage?.isPartOf).toEqual({
      "@type": "WebSite",
      "@id": topLevelWebSites[0]["@id"],
    });
  });

  it("service detail pages carry no BreadcrumbList from the engine (the rendered Breadcrumb component supplies the one on the live page)", () => {
    for (const locale of LOCALES) {
      for (const page of [
        SEOFactory.frontendService(locale),
        SEOFactory.fullstackService(locale),
        SEOFactory.designSystemsService(locale),
        SEOFactory.consultingService(locale),
      ]) {
        const schemas = JSON.parse(page.structuredData) as Array<Record<string, unknown>>;
        expect(schemas.some((schema) => hasType(schema, "BreadcrumbList"))).toBe(false);
      }
    }
  });

  it("the services overview page still carries exactly one BreadcrumbList from the engine", () => {
    for (const locale of LOCALES) {
      const schemas = JSON.parse(SEOFactory.services(locale).structuredData) as Array<
        Record<string, unknown>
      >;
      expect(schemas.filter((schema) => hasType(schema, "BreadcrumbList"))).toHaveLength(1);
    }
  });

  it("FAQ page exposes a non-empty FAQPage with answered questions", () => {
    const schemas = JSON.parse(
      SEOFactory.faq("en", FAQ).structuredData
    ) as Array<Record<string, unknown>>;
    const faqPage = schemas.find((schema) => hasType(schema, "FAQPage")) as
      | { mainEntity?: Array<Record<string, unknown>> }
      | undefined;
    expect(faqPage).toBeTruthy();
    expect(Array.isArray(faqPage!.mainEntity)).toBe(true);
    expect(faqPage!.mainEntity!.length).toBeGreaterThan(0);
    for (const question of faqPage!.mainEntity!) {
      expect(hasType(question, "Question")).toBe(true);
      expect(question.name).toBeTruthy();
      expect((question.acceptedAnswer as { text?: string } | undefined)?.text).toBeTruthy();
    }
  });
});
