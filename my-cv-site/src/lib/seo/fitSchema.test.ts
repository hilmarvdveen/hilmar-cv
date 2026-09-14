import { describe, expect, it } from "vitest";
import { fitPageSchema } from "./fitSchema";

const parse = (locale: "en" | "nl") =>
  JSON.parse(
    fitPageSchema({
      locale,
      title: locale === "nl" ? "Vacaturecheck" : "Vacancy check",
      description: "Paste a vacancy and see what the record holds.",
      homeLabel: locale === "nl" ? "Home" : "Home",
      pageLabel: locale === "nl" ? "Vacaturecheck" : "Vacancy check",
    })
  );

describe("fitPageSchema", () => {
  it("emits a WebPage on the prefixed url with the locale", () => {
    const [webPage] = parse("nl");
    expect(webPage["@type"]).toBe("WebPage");
    expect(webPage.url).toBe("https://www.hilmarvanderveen.com/nl/fit");
    expect(webPage["@id"]).toBe(webPage.url);
    expect(webPage.inLanguage).toBe("nl-NL");
    expect(webPage.isPartOf["@id"]).toBe("https://www.hilmarvanderveen.com/#website");
    expect(webPage.about["@id"]).toBe("https://www.hilmarvanderveen.com/#person");
  });

  it("uses the English locale tag on the English page", () => {
    const [webPage] = parse("en");
    expect(webPage.url).toBe("https://www.hilmarvanderveen.com/en/fit");
    expect(webPage.inLanguage).toBe("en-US");
  });

  it("emits a two-item breadcrumb with the visible labels", () => {
    const [, breadcrumbs] = parse("nl");
    expect(breadcrumbs["@type"]).toBe("BreadcrumbList");
    expect(breadcrumbs.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.hilmarvanderveen.com/nl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Vacaturecheck",
        item: "https://www.hilmarvanderveen.com/nl/fit",
      },
    ]);
  });
});
