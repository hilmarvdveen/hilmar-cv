export const HOME_CITY_NAME = "Zandvoort";

export const MAP_VIEWBOX = { width: 440, height: 500 };

export const MAP_COLORS = {
  primary: "#12314e",
  primaryLight: "#dde4ea",
  secondary: "#f3f4f6",
  accent: "#10b981",
  home: "#047857",
};

export type CityLocation = {
  name: string;
  province: string;
  coordinates: [number, number];
  companies: string[];
  isHome?: boolean;
};

export const workCities: CityLocation[] = [
  {
    name: HOME_CITY_NAME,
    province: "Noord-Holland",
    coordinates: [4.5386, 52.3749],
    companies: ["Home Base"],
    isHome: true,
  },
  {
    name: "Amsterdam",
    province: "Noord-Holland",
    coordinates: [4.8952, 52.3702],
    companies: ["Conclusion", "Randstad", "Nationale Postcode Loterij", "Omniplan"],
  },
  {
    name: "Apeldoorn",
    province: "Gelderland",
    coordinates: [5.9699, 52.2112],
    companies: ["Belastingdienst"],
  },
  {
    name: "Hilversum",
    province: "Noord-Holland",
    coordinates: [5.1606, 52.2292],
    companies: ["Transdev"],
  },
  {
    name: "Hoorn",
    province: "Noord-Holland",
    coordinates: [5.0594, 52.6425],
    companies: ["Niped"],
  },
  {
    name: "Utrecht",
    province: "Utrecht",
    coordinates: [5.1214, 52.0907],
    companies: ["Bluefield Smart Access", "bol.com"],
  },
  {
    name: "Zoetermeer",
    province: "Zuid-Holland",
    coordinates: [4.4933, 52.0607],
    companies: ["Ortec"],
  },
  {
    name: "Almere",
    province: "Flevoland",
    coordinates: [5.2141, 52.3508],
    companies: ["Athlon"],
  },
  {
    name: "Rotterdam",
    province: "Zuid-Holland",
    coordinates: [4.47917, 51.9225],
    companies: ["Opinity"],
  },
];

const engagementCities = workCities.filter((city) => !city.isHome);

export const workCitiesInProvince = (province: string) =>
  engagementCities.filter((city) => city.province === province);

export const highlightedRegions = Array.from(
  new Set(engagementCities.map((city) => city.province))
);

export const workCityCount = engagementCities.length;

export const highlightedRegionCount = highlightedRegions.length;

export const workCompanyCount = new Set(
  engagementCities.flatMap((city) => city.companies)
).size;
