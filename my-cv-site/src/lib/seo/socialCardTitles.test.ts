import { describe, it, expect } from "vitest";
import { isKnownSocialCardTitle, knownSocialCardTitles } from "./socialCardTitles";
import { SEOFactory } from "./factory";
import { socialCardTitle } from "./socialCard";

describe("knownSocialCardTitles", () => {
  it("collects the engine pages, the posts, the engagements and the legal pages per locale", () => {
    const dutch = knownSocialCardTitles("nl");
    const english = knownSocialCardTitles("en");
    expect(dutch.size).toBeGreaterThan(30);
    expect(english.size).toBeGreaterThan(30);
    const servicesTitle = String(SEOFactory.services("nl").metadata.title);
    expect(dutch.has(socialCardTitle(servicesTitle))).toBe(true);
    expect(dutch.has("Werkervaring")).toBe(true);
    expect(dutch.has("Privacyverklaring")).toBe(true);
    expect([...english].some((title) => title.endsWith("| bol.com"))).toBe(true);
  });

  it("accepts a real page title with the brand suffix and refuses a made-up claim", () => {
    const servicesTitle = String(SEOFactory.services("en").metadata.title);
    expect(isKnownSocialCardTitle("en", servicesTitle)).toBe(true);
    expect(isKnownSocialCardTitle("en", `${servicesTitle} | Hilmar van der Veen`)).toBe(true);
    expect(isKnownSocialCardTitle("en", "Rate 35 euro per hour")).toBe(false);
  });
});
