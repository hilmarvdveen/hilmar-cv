import { describe, it, expect } from "vitest";
import { regionHubSchema, regionPageSchema } from "./regionSchema";

const shared = {
  title: "Freelance frontend developer in Amsterdam",
  description: "Senior frontend developer, freelance.",
  homeLabel: "Home",
  hubLabel: "Werkregio",
  hubPath: "/freelance-frontend-developer",
};

describe("regionPageSchema", () => {
  it("describes the page, the trail, the service area and the person", () => {
    const parsed = JSON.parse(regionPageSchema({ ...shared, locale: "nl", city: { id: "amsterdam", name: "Amsterdam" } }));
    expect(parsed.map((block: { "@type": string }) => block["@type"])).toEqual(["WebPage", "BreadcrumbList", "Service", "Person"]);
    expect(parsed[0].url).toBe("https://www.hilmarvanderveen.com/nl/freelance-frontend-developer/amsterdam");
    expect(parsed[0].inLanguage).toBe("nl-NL");
    expect(parsed[1].itemListElement.map((item: { name: string }) => item.name)).toEqual(["Home", "Werkregio", "Amsterdam"]);
    expect(parsed[2].areaServed).toEqual({
      "@type": "City",
      name: "Amsterdam",
      containedInPlace: { "@type": "Country", name: "Netherlands" },
    });
    expect(parsed[2].offers.priceRange).toBe("€95-€125");
    expect(parsed[2].offers.price).toBeUndefined();
    expect(parsed[2].provider.address.addressLocality).toBe("Zandvoort");
    expect(parsed[2].availableChannel.serviceUrl).toBe("https://www.hilmarvanderveen.com/nl/book");
    expect(parsed[3].workLocation.name).toBe("Amsterdam");
    const serialized = JSON.stringify(parsed);
    expect(serialized).not.toContain("LocalBusiness");
    expect(serialized).not.toContain("FAQPage");
    expect(serialized).not.toContain("ProfessionalService");
  });
});

describe("regionHubSchema", () => {
  it("serves every city from one page in English", () => {
    const parsed = JSON.parse(
      regionHubSchema({
        ...shared,
        locale: "en",
        hubLabel: "Where I work",
        cities: [
          { id: "amsterdam", name: "Amsterdam" },
          { id: "den-haag", name: "The Hague" },
        ],
      })
    );
    expect(parsed).toHaveLength(3);
    expect(parsed[0].inLanguage).toBe("en-US");
    expect(parsed[1].itemListElement).toHaveLength(2);
    expect(parsed[2].areaServed.map((city: { name: string }) => city.name)).toEqual(["Amsterdam", "The Hague"]);
  });
});
