import { workHistory, type WorkEntry } from "./workHistory";

export type RegionId = "amsterdam" | "utrecht" | "rotterdam" | "den-haag";

export type Region = {
  id: RegionId;
  city: string;
  cityEnglish: string;
  published: boolean;
  engagementIds: string[];
  nearbyEngagementIds: string[];
  sectorEngagementIds: string[];
  postSlugs: string[];
  coordinates: [number, number];
  searchTerms: string[];
};

export const REGION_PATH = "freelance-frontend-developer";

const cityTerms = (city: string, dutchCity: string) => [
  `freelance frontend developer ${city}`,
  `frontend developer ${city} inhuren`,
  `senior frontend developer ${city}`,
  `zzp frontend developer ${city}`,
  `react developer ${city}`,
  `angular developer ${city}`,
  `frontend ontwikkelaar ${dutchCity}`,
];

export const ALL_REGIONS: Region[] = [
  {
    id: "amsterdam",
    city: "Amsterdam",
    cityEnglish: "Amsterdam",
    published: true,
    engagementIds: ["conclusion", "randstad", "postcode-loterij", "omniplan"],
    nearbyEngagementIds: ["transdev", "athlon", "niped"],
    sectorEngagementIds: [],
    postSlugs: [
      "react-folder-structure",
      "modern-react-architecture-vite-router-vitest-storybook",
      "unit-testing-react-the-right-way",
    ],
    coordinates: [4.8952, 52.3702],
    searchTerms: cityTerms("amsterdam", "amsterdam"),
  },
  {
    id: "utrecht",
    city: "Utrecht",
    cityEnglish: "Utrecht",
    published: true,
    engagementIds: ["bol", "bluefield"],
    nearbyEngagementIds: [],
    sectorEngagementIds: [],
    postSlugs: [
      "react-router-remix-routes-loaders-actions-folder-structure",
      "hexagonal-architecture-kotlin",
      "100-percent-seo-score-and-what-actually-ranks",
    ],
    coordinates: [5.1214, 52.0907],
    searchTerms: cityTerms("utrecht", "utrecht"),
  },
  {
    id: "rotterdam",
    city: "Rotterdam",
    cityEnglish: "Rotterdam",
    published: true,
    engagementIds: ["opinity"],
    nearbyEngagementIds: [],
    sectorEngagementIds: [],
    postSlugs: [
      "hexagonal-architecture-csharp-dotnet",
      "unit-testing-react-the-right-way",
      "modern-react-architecture-vite-router-vitest-storybook",
    ],
    coordinates: [4.47917, 51.9225],
    searchTerms: cityTerms("rotterdam", "rotterdam"),
  },
  {
    id: "den-haag",
    city: "Den Haag",
    cityEnglish: "The Hague",
    published: false,
    engagementIds: [],
    nearbyEngagementIds: ["ortec"],
    sectorEngagementIds: ["belastingdienst"],
    postSlugs: ["hexagonal-architecture-java", "react-folder-structure", "hexagonal-architecture-csharp-dotnet"],
    coordinates: [4.3007, 52.0705],
    searchTerms: [...cityTerms("the hague", "den haag"), "freelance frontend developer den haag"],
  },
];

export const REGIONS: Region[] = ALL_REGIONS.filter((region) => region.published);

export const SCHEDULED_REGIONS: Region[] = ALL_REGIONS.filter((region) => !region.published);

export const REGION_IDS = REGIONS.map((region) => region.id);

export const isRegionId = (value: string): value is RegionId => REGION_IDS.includes(value as RegionId);

export const regionById = (id: string): Region | undefined => REGIONS.find((region) => region.id === id);

export const regionForCity = (city: string): Region | undefined =>
  REGIONS.find((region) => region.city === city && region.engagementIds.length > 0);

const entriesFor = (ids: string[]): WorkEntry[] =>
  ids.flatMap((id) => {
    const entry = workHistory.find((candidate) => candidate.id === id);
    return entry ? [entry] : [];
  });

export const regionEngagements = (region: Region): WorkEntry[] => entriesFor(region.engagementIds);

export const regionNearbyEngagements = (region: Region): WorkEntry[] => entriesFor(region.nearbyEngagementIds);

export const regionSectorEngagements = (region: Region): WorkEntry[] => entriesFor(region.sectorEngagementIds);

export const otherRegions = (region: Region): Region[] => REGIONS.filter((candidate) => candidate.id !== region.id);

export const engagementsOutsideRegions = (): WorkEntry[] => {
  const covered = new Set(REGIONS.flatMap((region) => region.engagementIds));
  return workHistory.filter((entry) => !covered.has(entry.id));
};

export const regionPath = (region?: Region): string =>
  region ? `/${REGION_PATH}/${region.id}` : `/${REGION_PATH}`;
