import { describe, it, expect } from "vitest";
import { formatMonthYear } from "./workPeriod";

describe("formatMonthYear", () => {
  it("formats a Dutch month and year", () => {
    expect(formatMonthYear("2025-07", "nl")).toBe("juli 2025");
  });

  it("formats an English month and year", () => {
    expect(formatMonthYear("2025-07", "en")).toBe("July 2025");
  });

  it("does not roll a December value into the following year", () => {
    expect(formatMonthYear("2025-12", "nl")).toBe("december 2025");
    expect(formatMonthYear("2025-12", "en")).toBe("December 2025");
  });

  it("falls back to the given locale tag when it is not mapped", () => {
    expect(formatMonthYear("2025-12", "de-DE")).toBe("Dezember 2025");
  });
});
