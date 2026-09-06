import { BUSINESS_PROFILE } from "./constants/meta-constants";

export type RegionSchemaLocale = "en" | "nl";

type RegionCity = { id: string; name: string };

type SharedInput = {
  locale: RegionSchemaLocale;
  title: string;
  description: string;
  homeLabel: string;
  hubLabel: string;
  hubPath: string;
};

export type RegionPageSchemaInput = SharedInput & { city: RegionCity };

export type RegionHubSchemaInput = SharedInput & { cities: RegionCity[] };

const PRICE_RANGE = "€95-€125";
const COUNTRY = "Netherlands";

const siteBase = () => BUSINESS_PROFILE.CONTACT.WEBSITE.replace(/\/+$/, "");

const cityNode = (city: RegionCity) => ({
  "@type": "City",
  name: city.name,
  containedInPlace: { "@type": "Country", name: COUNTRY },
});

const webPage = (url: string, input: SharedInput) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": url,
  url,
  name: input.title,
  description: input.description,
  inLanguage: input.locale === "nl" ? "nl-NL" : "en-US",
  dateModified: process.env.NEXT_PUBLIC_BUILD_DATE,
  isPartOf: { "@type": "WebSite", "@id": `${siteBase()}/#website`, name: BUSINESS_PROFILE.NAME },
});

const breadcrumbs = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

const service = (locale: RegionSchemaLocale, areaServed: unknown) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Frontend development",
  provider: {
    "@type": "Organization",
    name: BUSINESS_PROFILE.COMPANY,
    url: siteBase(),
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS_PROFILE.REGISTERED_ADDRESS.CITY,
      addressRegion: BUSINESS_PROFILE.REGISTERED_ADDRESS.REGION,
      addressCountry: "NL",
    },
    identifier: { "@type": "PropertyValue", propertyID: "KVK", value: BUSINESS_PROFILE.REGISTRATION.KVK },
  },
  areaServed,
  offers: { "@type": "Offer", priceRange: PRICE_RANGE, priceCurrency: "EUR" },
  availableChannel: { "@type": "ServiceChannel", serviceUrl: `${siteBase()}/${locale}/book` },
});

const person = (workLocation: unknown) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteBase()}/#person`,
  name: BUSINESS_PROFILE.NAME,
  url: siteBase(),
  workLocation,
});

export function regionPageSchema(input: RegionPageSchemaInput): string {
  const base = `${siteBase()}/${input.locale}`;
  const hubUrl = `${base}${input.hubPath}`;
  const url = `${hubUrl}/${input.city.id}`;
  const city = cityNode(input.city);
  return JSON.stringify([webPage(url, input), service(input.locale, city), person(city)]);
}

export function regionHubSchema(input: RegionHubSchemaInput): string {
  const base = `${siteBase()}/${input.locale}`;
  const url = `${base}${input.hubPath}`;
  return JSON.stringify([
    webPage(url, input),
    breadcrumbs([
      { name: input.homeLabel, url: base },
      { name: input.hubLabel, url },
    ]),
    service(input.locale, input.cities.map(cityNode)),
  ]);
}
