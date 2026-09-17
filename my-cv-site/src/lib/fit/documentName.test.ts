import { describe, expect, it } from "vitest";
import { tailoredCvFileName, vacancySlug } from "./documentName";

describe("vacancySlug", () => {
  it("keeps letters and digits and joins the rest with a hyphen", () => {
    expect(vacancySlug("Senior Frontend Engineer")).toBe("senior-frontend-engineer");
    expect(vacancySlug("React / GraphQL (Utrecht)")).toBe("react-graphql-utrecht");
  });

  it("drops diacritics and leading or trailing hyphens", () => {
    expect(vacancySlug("  Éen Vacature!  ")).toBe("een-vacature");
  });

  it("caps the length without leaving a trailing hyphen", () => {
    const slug = vacancySlug("Senior frontend engineer voor de winkelomgeving van een retailer");
    expect(slug.length).toBeLessThanOrEqual(40);
    expect(slug.endsWith("-")).toBe(false);
  });

  it("answers an empty slug for a title without letters", () => {
    expect(vacancySlug("***")).toBe("");
    expect(vacancySlug("")).toBe("");
  });
});

describe("tailoredCvFileName", () => {
  it("carries the locale and the slug of the vacancy title", () => {
    expect(tailoredCvFileName("Senior Frontend Engineer", "nl")).toBe(
      "cv-hilmar-van-der-veen-nl-senior-frontend-engineer.pdf"
    );
    expect(tailoredCvFileName("Senior Frontend Engineer", "en")).toBe(
      "cv-hilmar-van-der-veen-en-senior-frontend-engineer.pdf"
    );
  });

  it("falls back to the plain name when the vacancy has no title", () => {
    expect(tailoredCvFileName("", "nl")).toBe("cv-hilmar-van-der-veen-nl.pdf");
  });
});
