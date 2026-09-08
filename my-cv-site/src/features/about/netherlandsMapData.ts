export const HOME_CITY_NAME = "Zandvoort";

export const MAP_VIEWBOX = { width: 440, height: 500 };

export const MAP_COLORS = {
  primary: "#12314e",
  primaryLight: "#dde4ea",
  secondary: "#f3f4f6",
  accent: "#10b981",
  home: "#047857",
};

export const highlightedRegions = [
  "Noord-Holland",
  "Utrecht",
  "Zuid-Holland",
  "Gelderland",
  "Flevoland",
];

export type CityLocation = {
  name: string;
  coordinates: [number, number];
  companies: string[];
  isHome?: boolean;
};

export const workCities: CityLocation[] = [
  {
    name: HOME_CITY_NAME,
    coordinates: [4.5386, 52.3749],
    companies: ["Home Base"],
    isHome: true,
  },
  {
    name: "Amsterdam",
    coordinates: [4.8952, 52.3702],
    companies: ["Conclusion", "Randstad", "Nationale Postcode Loterij", "Omniplan"],
  },
  {
    name: "Apeldoorn",
    coordinates: [5.9699, 52.2112],
    companies: ["Belastingdienst"],
  },
  {
    name: "Hilversum",
    coordinates: [5.1606, 52.2292],
    companies: ["Transdev"],
  },
  { name: "Hoorn", coordinates: [5.0594, 52.6425], companies: ["Niped"] },
  { name: "Utrecht", coordinates: [5.1214, 52.0907], companies: ["Bluefield Smart Access", "bol.com"] },
  { name: "Zoetermeer", coordinates: [4.4933, 52.0607], companies: ["Ortec"] },
  { name: "Almere", coordinates: [5.2141, 52.3508], companies: ["Athlon"] },
  {
    name: "Rotterdam",
    coordinates: [4.47917, 51.9225],
    companies: ["Opinity"],
  },
];

export const workCityCount = workCities.filter((city) => !city.isHome).length;

export const highlightedRegionCount = highlightedRegions.length;

export const workCompanyCount = new Set(
  workCities.filter((city) => !city.isHome).flatMap((city) => city.companies)
).size;
