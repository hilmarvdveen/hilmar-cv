import { describe, it, expect } from "vitest";
import { workHistory } from "@/data/workHistory";
import {
  HOME_CITY_NAME,
  highlightedRegionCount,
  highlightedRegions,
  workCities,
  workCityCount,
  workCompanyCount,
} from "./netherlandsMapData";

const engagementCities = workCities.filter((city) => !city.isHome);

describe("netherlands map data", () => {
  it("counts eight work cities, leaving the home base out", () => {
    expect(workCityCount).toBe(8);
    expect(workCities).toHaveLength(9);
    expect(workCities.filter((city) => city.name === HOME_CITY_NAME)).toHaveLength(1);
  });

  it("highlights the five provinces the work history supports", () => {
    expect(highlightedRegions).toEqual([
      "Noord-Holland",
      "Utrecht",
      "Zuid-Holland",
      "Gelderland",
      "Flevoland",
    ]);
    expect(highlightedRegionCount).toBe(5);
  });

  it("counts twelve companies across those cities", () => {
    expect(workCompanyCount).toBe(12);
    expect(workCompanyCount).toBe(workHistory.length);
  });

  it("names every company exactly as the work history does, so the panel finds its period", () => {
    const companyNames = engagementCities.flatMap((city) => city.companies);
    for (const company of companyNames) {
      expect(workHistory.map((entry) => entry.company)).toContain(company);
    }
  });

  it("places every company in the city its work history entry names", () => {
    for (const city of engagementCities) {
      for (const company of city.companies) {
        const entry = workHistory.find((candidate) => candidate.company === company);
        expect(entry?.location).toBe(city.name);
      }
    }
  });
});
