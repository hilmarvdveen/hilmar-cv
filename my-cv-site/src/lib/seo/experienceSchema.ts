import { BUSINESS_PROFILE } from "./constants/meta-constants";

type ExperienceLocale = "en" | "nl";

type ExperienceDetailSchemaInput = {
  locale: ExperienceLocale;
  id: string;
  company: string;
  headline: string;
  summary: string;
  from: string;
  to: string;
};

type ExperienceHubSchemaInput = {
  locale: ExperienceLocale;
  title: string;
  description: string;
  entries: Array<{ id: string; company: string }>;
};

const siteBase = () => BUSINESS_PROFILE.CONTACT.WEBSITE.replace(/\/+$/, "");
const homeLabel = "Home";

const breadcrumbList = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

const person = () => ({
  "@type": "Person",
  "@id": `${siteBase()}/#person`,
  name: BUSINESS_PROFILE.NAME,
  url: siteBase(),
});

export function experienceDetailSchema(input: ExperienceDetailSchemaInput): string {
  const base = `${siteBase()}/${input.locale}`;
  const url = `${base}/experience/${input.id}`;
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name: input.headline,
    description: input.summary,
    inLanguage: input.locale === "nl" ? "nl-NL" : "en-US",
    about: {
      "@type": "OrganizationRole",
      roleName: input.headline,
      startDate: input.from,
      endDate: input.to,
      memberOf: { "@type": "Organization", name: input.company },
    },
    mainEntity: person(),
  };
  return JSON.stringify([webPage]);
}

export function experienceHubSchema(input: ExperienceHubSchemaInput): string {
  const base = `${siteBase()}/${input.locale}`;
  const url = `${base}/experience`;
  const profilePage = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": url,
    url,
    name: input.title,
    description: input.description,
    inLanguage: input.locale === "nl" ? "nl-NL" : "en-US",
    mainEntity: {
      ...person(),
      hasOccupation: input.entries.map((entry) => ({
        "@type": "Role",
        roleName: entry.company,
        url: `${url}/${entry.id}`,
      })),
    },
  };
  return JSON.stringify([
    profilePage,
    breadcrumbList([
      { name: homeLabel, url: base },
      { name: input.title, url },
    ]),
  ]);
}
