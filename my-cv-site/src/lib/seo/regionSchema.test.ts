import { describe, it, expect, vi, afterEach } from "vitest";
import { regionHubSchema, regionPageSchema } from "./regionSchema";

afterEach(() => vi.unstubAllEnvs());

const shared = {
  title: "Freelance frontend developer in Amsterdam",
  description: "Senior frontend developer, freelance.",
  homeLabel: "Home",
  hubLabel: "Werkregio",
  hubPath: "/freelance-frontend-developer",
};

describe("regionPageSchema", () => {
  it("describes the page, the service area and the person, and leaves the trail to the breadcrumb component", () => {
    const parsed = JSON.parse(regionPageSchema({ ...shared, locale: "nl", city: { id: "amsterdam", name: "Amsterdam" } }));
    expect(parsed.map((block: { "@type": string }) => block["@type"])).toEqual(["WebPage", "Service", "Person"]);
    expect(parsed[0].url).toBe("https://www.hilmarvanderveen.com/nl/freelance-frontend-developer/amsterdam");
    expect(parsed[0].inLanguage).toBe("nl-NL");
    expect(parsed[1].areaServed).toEqual({
      "@type": "City",
      name: "Amsterdam",
      containedInPlace: { "@type": "Country", name: "Netherlands" },
    });
    expect(parsed[1].offers.priceRange).toBe("€95-€125");
    expect(parsed[1].offers.price).toBeUndefined();
    expect(parsed[1].provider.address.addressLocality).toBe("Zandvoort");
    expect(parsed[1].availableChannel.serviceUrl).toBe("https://www.hilmarvanderveen.com/nl/book");
    expect(parsed[2].workLocation.name).toBe("Amsterdam");
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

describe("region schema dates", () => {
  it("declares no dateModified, even when the environment carries a build date", () => {
    vi.stubEnv("NEXT_PUBLIC_BUILD_DATE", "2026-09-08T10:00:00.000Z");
    const page = JSON.parse(
      regionPageSchema({ ...shared, locale: "nl", city: { id: "utrecht", name: "Utrecht" } })
    );
    const hub = JSON.parse(
      regionHubSchema({ ...shared, locale: "nl", cities: [{ id: "utrecht", name: "Utrecht" }] })
    );
    expect(page[0].dateModified).toBeUndefined();
    expect(hub[0].dateModified).toBeUndefined();
  });
});
