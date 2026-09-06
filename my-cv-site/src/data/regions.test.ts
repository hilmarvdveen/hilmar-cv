import { describe, it, expect } from "vitest";
import { workHistory } from "./workHistory";
import { getPostBySlug } from "@/features/blog";
import { workCities } from "@/features/about/netherlandsMapData";
import {
  ALL_REGIONS,
  REGIONS,
  SCHEDULED_REGIONS,
  engagementsOutsideRegions,
  isRegionId,
  otherRegions,
  regionById,
  regionEngagements,
  regionForCity,
  regionNearbyEngagements,
  regionPath,
  regionSectorEngagements,
} from "./regions";

describe("regions", () => {
  it("publishes three cities now and holds Den Haag for the week after", () => {
    expect(REGIONS.map((region) => region.id)).toEqual(["amsterdam", "utrecht", "rotterdam"]);
    expect(SCHEDULED_REGIONS.map((region) => region.id)).toEqual(["den-haag"]);
    expect(ALL_REGIONS).toHaveLength(4);
  });

  it("lists engagements only in the city they were in", () => {
    for (const region of ALL_REGIONS) {
      for (const entry of regionEngagements(region)) {
        expect(entry.location).toBe(region.city);
      }
      expect(regionEngagements(region)).toHaveLength(region.engagementIds.length);
    }
  });

  it("keeps nearby and sector engagements in other cities and never twice", () => {
    for (const region of ALL_REGIONS) {
      const nearby = regionNearbyEngagements(region);
      const sector = regionSectorEngagements(region);
      expect(nearby).toHaveLength(region.nearbyEngagementIds.length);
      expect(sector).toHaveLength(region.sectorEngagementIds.length);
      for (const entry of [...nearby, ...sector]) {
        expect(entry.location).not.toBe(region.city);
        expect(region.engagementIds).not.toContain(entry.id);
      }
      const ids = [...region.engagementIds, ...region.nearbyEngagementIds, ...region.sectorEngagementIds];
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("links only published posts", () => {
    for (const region of ALL_REGIONS) {
      for (const slug of region.postSlugs) {
        expect(getPostBySlug(slug), slug).toBeDefined();
      }
      expect(new Set(region.postSlugs).size).toBe(region.postSlugs.length);
    }
  });

  it("shares its coordinates with the map where the map knows the city", () => {
    for (const region of ALL_REGIONS) {
      const mapped = workCities.find((city) => city.name === region.city);
      if (mapped) expect(region.coordinates).toEqual(mapped.coordinates);
    }
  });

  it("finds regions by id and by city, and lists the rest of the map", () => {
    expect(regionById("utrecht")?.city).toBe("Utrecht");
    expect(regionById("leiden")).toBeUndefined();
    expect(regionById("den-haag")).toBeUndefined();
    expect(isRegionId("rotterdam")).toBe(true);
    expect(isRegionId("leiden")).toBe(false);
    expect(isRegionId("den-haag")).toBe(false);
    expect(regionForCity("Amsterdam")?.id).toBe("amsterdam");
    expect(regionForCity("Den Haag")).toBeUndefined();
    expect(otherRegions(REGIONS[0]).map((region) => region.id)).toEqual(["utrecht", "rotterdam"]);
    const outside = engagementsOutsideRegions();
    expect(outside.map((entry) => entry.id)).toEqual(
      workHistory.filter((entry) => !["conclusion", "randstad", "postcode-loterij", "omniplan", "bol", "bluefield", "opinity"].includes(entry.id)).map((entry) => entry.id)
    );
    expect(regionPath()).toBe("/freelance-frontend-developer");
    expect(regionPath(ALL_REGIONS[3])).toBe("/freelance-frontend-developer/den-haag");
  });
});
