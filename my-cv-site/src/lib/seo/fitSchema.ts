import { BUSINESS_PROFILE } from "./constants/meta-constants";

export type FitSchemaLocale = "en" | "nl";

export type FitSchemaInput = {
  locale: FitSchemaLocale;
  title: string;
  description: string;
  homeLabel: string;
  pageLabel: string;
};

const siteBase = () => BUSINESS_PROFILE.CONTACT.WEBSITE.replace(/\/+$/, "");

export function fitPageSchema(input: FitSchemaInput): string {
  const base = `${siteBase()}/${input.locale}`;
  const url = `${base}/fit`;
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name: input.title,
    description: input.description,
    inLanguage: input.locale === "nl" ? "nl-NL" : "en-US",
    isPartOf: { "@type": "WebSite", "@id": `${siteBase()}/#website`, name: BUSINESS_PROFILE.NAME },
    about: { "@type": "Person", "@id": `${siteBase()}/#person`, name: BUSINESS_PROFILE.NAME },
    publisher: { "@type": "Person", name: BUSINESS_PROFILE.NAME, url: siteBase() },
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: input.homeLabel, item: base },
      { "@type": "ListItem", position: 2, name: input.pageLabel, item: url },
    ],
  };
  return JSON.stringify([webPage, breadcrumbs]);
}
