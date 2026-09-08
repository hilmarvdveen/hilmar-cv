import { describe, it, expect } from "vitest";
import { workHistory } from "@/data/workHistory";
import {
  HOME_CITY_NAME,
  highlightedRegionCount,
  highlightedRegions,
  workCities,
  workCitiesInProvince,
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

  it("derives the five highlighted provinces from the cities the work history names", () => {
    expect(highlightedRegions).toEqual([
      "Noord-Holland",
      "Gelderland",
      "Utrecht",
      "Zuid-Holland",
      "Flevoland",
    ]);
    expect(highlightedRegionCount).toBe(5);
  });

  it("places every city in one of the highlighted provinces, the home base included", () => {
    for (const city of workCities) {
      expect(highlightedRegions).toContain(city.province);
    }
  });

  it("gathers the three Noord-Holland engagements under their province", () => {
    expect(workCitiesInProvince("Noord-Holland").map((city) => city.name)).toEqual([
      "Amsterdam",
      "Hilversum",
      "Hoorn",
    ]);
  });

  it("answers for a province the map draws plain with an empty list", () => {
    expect(workCitiesInProvince("Limburg")).toEqual([]);
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
