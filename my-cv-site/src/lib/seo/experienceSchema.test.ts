import { describe, it, expect } from "vitest";
import { experienceDetailSchema, experienceHubSchema } from "./experienceSchema";

describe("experienceDetailSchema", () => {
  it("emits a WebPage about the engagement and a three-step breadcrumb", () => {
    const schemas = JSON.parse(
      experienceDetailSchema({
        locale: "nl",
        id: "bol",
        company: "bol.com",
        headline: "Loyalty en Digital naar een nieuw platform",
        summary: "Samenvatting.",
        hubTitle: "Werkervaring",
        from: "2025-07",
        to: "2026-10",
      })
    );
    expect(schemas).toHaveLength(2);
    expect(schemas[0]["@type"]).toBe("WebPage");
    expect(schemas[0].url).toBe("https://www.hilmarvanderveen.com/nl/experience/bol");
    expect(schemas[0].inLanguage).toBe("nl-NL");
    expect(schemas[0].about.memberOf.name).toBe("bol.com");
    expect(schemas[1]["@type"]).toBe("BreadcrumbList");
    expect(schemas[1].itemListElement.map((item: { name: string }) => item.name)).toEqual([
      "Home",
      "Werkervaring",
      "bol.com",
    ]);
  });
});

describe("experienceHubSchema", () => {
  it("emits a ProfilePage whose person lists every engagement as an occupation", () => {
    const schemas = JSON.parse(
      experienceHubSchema({
        locale: "en",
        title: "Work history",
        description: "Twelve engagements.",
        entries: [
          { id: "bol", company: "bol.com" },
          { id: "athlon", company: "Athlon" },
        ],
      })
    );
    expect(schemas[0]["@type"]).toBe("ProfilePage");
    expect(schemas[0].inLanguage).toBe("en-US");
    expect(schemas[0].mainEntity.hasOccupation).toHaveLength(2);
    expect(schemas[0].mainEntity.hasOccupation[1].url).toBe(
      "https://www.hilmarvanderveen.com/en/experience/athlon"
    );
    expect(schemas[1].itemListElement).toHaveLength(2);
  });
});
