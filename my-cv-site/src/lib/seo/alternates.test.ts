import { describe, expect, it } from "vitest";
import { localizedAlternates, localizedOpenGraph } from "./alternates";

describe("localizedAlternates", () => {
  it("builds a prefixed canonical and one alternate per locale plus x-default", () => {
    const alternates = localizedAlternates("experience", "en");
    expect(alternates.canonical).toBe("https://www.hilmarvanderveen.com/en/experience");
    expect(alternates.languages).toEqual({
      "nl-NL": "https://www.hilmarvanderveen.com/nl/experience",
      "en-US": "https://www.hilmarvanderveen.com/en/experience",
      "x-default": "https://www.hilmarvanderveen.com/nl/experience",
    });
  });

  it("tolerates slashes around the path and an empty path", () => {
    expect(localizedAlternates("/search/", "nl").canonical).toBe(
      "https://www.hilmarvanderveen.com/nl/search"
    );
    expect(localizedAlternates("", "nl").canonical).toBe("https://www.hilmarvanderveen.com/nl");
  });

  it("falls back to the default locale for an unknown segment", () => {
    expect(localizedAlternates("experience", "fr").canonical).toBe(
      "https://www.hilmarvanderveen.com/nl/experience"
    );
  });
});

describe("localizedOpenGraph", () => {
  it("builds an absolute canonical url and locale for the page", () => {
    const result = localizedOpenGraph("experience", "en", "Work history", "Every engagement.");
    const openGraph = result.openGraph as Record<string, unknown>;
    expect(openGraph.url).toBe("https://www.hilmarvanderveen.com/en/experience");
    expect(openGraph.title).toBe("Work history");
    expect(openGraph.description).toBe("Every engagement.");
    expect(openGraph.type).toBe("website");
    expect(openGraph.siteName).toBe("Hilmar van der Veen");
    expect(openGraph.locale).toBe("en_US");
  });

  it("lists the other supported locale as the alternate", () => {
    const en = (localizedOpenGraph("search", "en", "Search", "Search description.")
      .openGraph as Record<string, unknown>);
    expect(en.alternateLocale).toEqual(["nl_NL"]);

    const nl = (localizedOpenGraph("search", "nl", "Zoeken", "Zoekbeschrijving.")
      .openGraph as Record<string, unknown>);
    expect(nl.locale).toBe("nl_NL");
    expect(nl.alternateLocale).toEqual(["en_US"]);
  });

  it("points the image at the generated card route for the same locale, sized 1200x630", () => {
    const result = localizedOpenGraph("privacy", "nl", "Privacyverklaring", "Hoe gegevens worden verwerkt.");
    const openGraph = result.openGraph as {
      images: Array<{ url: string; width: number; height: number; alt: string }>;
    };
    expect(openGraph.images).toEqual([
      {
        url: "https://www.hilmarvanderveen.com/nl/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Privacyverklaring",
      },
    ]);
    const twitter = result.twitter as { card: string; images: string[] };
    expect(twitter.card).toBe("summary_large_image");
    expect(twitter.images).toEqual(["https://www.hilmarvanderveen.com/nl/twitter-image"]);
  });

  it("falls back to the default locale for an unsupported locale code", () => {
    const result = localizedOpenGraph("terms", "fr", "Terms", "Terms description.");
    const openGraph = result.openGraph as Record<string, unknown>;
    expect(openGraph.url).toBe("https://www.hilmarvanderveen.com/nl/terms");
    expect(openGraph.locale).toBe("nl_NL");
  });
});
