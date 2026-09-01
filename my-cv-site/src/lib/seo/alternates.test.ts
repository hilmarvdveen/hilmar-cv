import { describe, expect, it } from "vitest";
import { localizedAlternates } from "./alternates";

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
