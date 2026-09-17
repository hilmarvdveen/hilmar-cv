import { describe, expect, it } from "vitest";
import { fillDatePlaceholder, formatFitCheckDate } from "./checkDate";

describe("formatFitCheckDate", () => {
  it("writes the day, the month and the year in the reader's language", () => {
    expect(formatFitCheckDate("2026-09-17T09:12:44.000Z", "nl")).toBe("17 september 2026");
    expect(formatFitCheckDate("2026-09-17T09:12:44.000Z", "en")).toBe("17 September 2026");
  });

  it("answers an empty string for a date it cannot read", () => {
    expect(formatFitCheckDate("", "nl")).toBe("");
    expect(formatFitCheckDate("not a date", "en")).toBe("");
  });
});

describe("fillDatePlaceholder", () => {
  it("puts the date in the sentence from the message file", () => {
    expect(fillDatePlaceholder("Gecheckt op {date}", "17 september 2026")).toBe(
      "Gecheckt op 17 september 2026"
    );
  });
});
