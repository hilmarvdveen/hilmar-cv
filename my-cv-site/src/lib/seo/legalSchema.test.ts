import { describe, it, expect } from "vitest";
import { legalPageSchema } from "./legalSchema";

describe("legalPageSchema", () => {
  it("describes a Dutch legal page with its breadcrumb trail", () => {
    const parsed = JSON.parse(
      legalPageSchema({
        locale: "nl",
        slug: "privacy",
        title: "Privacyverklaring",
        description: "Hoe persoonsgegevens worden verwerkt.",
        homeLabel: "Home",
      })
    );
    expect(parsed[0]["@type"]).toBe("WebPage");
    expect(parsed[0].url).toBe("https://www.hilmarvanderveen.com/nl/privacy");
    expect(parsed[0].inLanguage).toBe("nl-NL");
    expect(parsed[0].isPartOf["@id"]).toBe("https://www.hilmarvanderveen.com/#website");
    expect(parsed[1]["@type"]).toBe("BreadcrumbList");
    expect(parsed[1].itemListElement.map((item: { name: string }) => item.name)).toEqual(["Home", "Privacyverklaring"]);
  });

  it("marks an English page as en-US under the English home", () => {
    const parsed = JSON.parse(
      legalPageSchema({ locale: "en", slug: "terms", title: "Terms of use", description: "The terms.", homeLabel: "Home" })
    );
    expect(parsed[0].inLanguage).toBe("en-US");
    expect(parsed[1].itemListElement[0].item).toBe("https://www.hilmarvanderveen.com/en");
  });
});
