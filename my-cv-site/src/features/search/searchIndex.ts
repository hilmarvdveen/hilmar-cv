import { REGIONS, regionPath } from "@/data/regions";
export type SearchLocale = "en" | "nl";

export type SearchKind = "page" | "engagement" | "post";

export type SearchEntry = {
  kind?: SearchKind;
  href: string;
  title: Record<SearchLocale, string>;
  description: Record<SearchLocale, string>;
  keywords: string[];
};

const STATIC_ENTRIES: SearchEntry[] = [
  {
    href: "/",
    kind: "page",
    title: { en: "Home", nl: "Home" },
    description: {
      en: "Senior frontend engineer, React and Angular, freelance via Hilmar ICT Services for the Randstad and remote.",
      nl: "Senior frontend engineer, React en Angular, freelance via Hilmar ICT Services voor de Randstad en remote.",
    },
    keywords: ["home", "hilmar", "developer", "frontend", "fullstack"],
  },
  {
    href: "/about",
    kind: "page",
    title: { en: "About me", nl: "Over mij" },
    description: {
      en: "What changes for your team and your platform when I join, with the engagement behind each change.",
      nl: "Wat er verandert voor je team en je platform als ik meedoe, met de opdracht achter elke verandering.",
    },
    keywords: ["about", "over", "experience", "ervaring", "cv", "resume"],
  },
  {
    href: "/experience",
    kind: "page",
    title: { en: "Work history", nl: "Werkervaring" },
    description: {
      en: "Every engagement since 2016, including bol.com, with role, stack and results.",
      nl: "Elke opdracht sinds 2016, inclusief bol.com, met rol, stack en wat er is opgeleverd.",
    },
    keywords: ["experience", "ervaring", "work", "werk", "bol", "kobo", "select", "cv", "resume"],
  },
  {
    href: "/services",
    kind: "page",
    title: { en: "Services", nl: "Diensten" },
    description: {
      en: "Frontend, fullstack, design systems and consulting, each with the problem it solves and a real example.",
      nl: "Frontend, fullstack, design systems en consultancy, elk met het probleem dat het oplost en een echt voorbeeld.",
    },
    keywords: ["services", "diensten", "hire", "inhuren"],
  },
  {
    href: "/services/frontend",
    kind: "page",
    title: { en: "Frontend development", nl: "Frontend-ontwikkeling" },
    description: {
      en: "Pages that earn money, rebuilt without interruption. React, Angular and Next.js.",
      nl: "Pagina's die geld verdienen, vernieuwd zonder onderbreking. React, Angular en Next.js.",
    },
    keywords: ["frontend", "react", "angular", "next.js", "typescript"],
  },
  {
    href: "/services/fullstack",
    kind: "page",
    title: { en: "Fullstack development", nl: "Fullstack-ontwikkeling" },
    description: {
      en: "The whole chain from frontend to API and data, so a feature ships as one piece.",
      nl: "De hele keten van frontend tot API en data, zodat een feature als één geheel live gaat.",
    },
    keywords: ["fullstack", "node", "api", "backend"],
  },
  {
    href: "/services/design-systems",
    kind: "page",
    title: { en: "Design systems", nl: "Design systems" },
    description: {
      en: "A component library that lets the team build pages in days, tested and documented in Storybook.",
      nl: "Een componentenbibliotheek waarmee het team pagina's in dagen bouwt, getest en gedocumenteerd in Storybook.",
    },
    keywords: ["design system", "components", "storybook", "ui", "accessibility"],
  },
  {
    href: "/services/consulting",
    kind: "page",
    title: { en: "Consulting", nl: "Consultancy" },
    description: {
      en: "Architecture and migration advice from someone who has done the cut-over, plus coaching for the team.",
      nl: "Architectuur- en migratieadvies van iemand die de cut-over zelf heeft gedaan, plus begeleiding van het team.",
    },
    keywords: ["consulting", "consultancy", "architecture", "advies"],
  },
  {
    href: "/projects",
    kind: "page",
    title: { en: "Results", nl: "Resultaten" },
    description: {
      en: "Four engagements and what the client could measure afterwards.",
      nl: "Vier opdrachten, en wat de opdrachtgever daarna kon meten.",
    },
    keywords: ["projects", "projecten", "portfolio", "work", "cases"],
  },
  {
    href: "/blog",
    kind: "page",
    title: { en: "Blog", nl: "Blog" },
    description: {
      en: "Articles on frontend, the contract with the backend, and APIs in C#, Kotlin and Java.",
      nl: "Artikelen over frontend, het contract met de backend, en API's in C#, Kotlin en Java.",
    },
    keywords: ["blog", "artikelen", "articles", "frontend", "fullstack", "backend"],
  },
  {
    href: "/faq",
    kind: "page",
    title: { en: "FAQ", nl: "Veelgestelde vragen" },
    description: {
      en: "Answers on rate, availability, the Wet DBA, accessibility and how an engagement runs.",
      nl: "Antwoorden over tarief, beschikbaarheid, de Wet DBA, toegankelijkheid en hoe een opdracht loopt.",
    },
    keywords: [
      "faq",
      "vragen",
      "pricing",
      "prijzen",
      "tarief",
      "uurtarief",
      "rate",
      "beschikbaar",
      "beschikbaarheid",
      "availability",
      "toegankelijkheid",
      "accessibility",
      "wcag",
      "wet dba",
      "performance",
      "snelheid",
      "freelance",
      "zzp",
    ],
  },
  {
    href: "/book",
    kind: "page",
    title: { en: "Book a consultation", nl: "Plan een gesprek" },
    description: {
      en: "Pick a moment for a 30-minute call that ends with a scope.",
      nl: "Kies een moment voor een gesprek van dertig minuten dat eindigt met een scope.",
    },
    keywords: ["book", "boeken", "schedule", "afspraak", "consultation"],
  },
  {
    href: "/contact",
    kind: "page",
    title: { en: "Contact", nl: "Contact" },
    description: {
      en: "Book the call, send a WhatsApp message, or write. The recruiter facts in one card.",
      nl: "Plan het gesprek, app me, of schrijf. De praktische gegevens in één kaart.",
    },
    keywords: ["contact", "email", "phone", "telefoon", "whatsapp", "bellen"],
  },
];

const REGION_ENTRIES: SearchEntry[] = [
  {
    href: regionPath(),
    kind: "page",
    title: { en: "Where I work", nl: "Werkregio" },
    description: {
      en: "Amsterdam, Utrecht, Rotterdam and The Hague, hybrid or remote from Zandvoort.",
      nl: "Amsterdam, Utrecht, Rotterdam en Den Haag, hybride of remote vanuit Zandvoort.",
    },
    keywords: ["randstad", "regio", "region", "werkregio", "op locatie", "on site", "hybride", "hybrid", "remote"],
  },
  ...REGIONS.map((region) => ({
    href: regionPath(region),
    kind: "page" as const,
    title: {
      en: `Freelance frontend developer in ${region.cityEnglish}`,
      nl: `Freelance frontend developer ${region.city}`,
    },
    description: {
      en: `Engagements, on-site rhythm and reading for teams in ${region.cityEnglish}.`,
      nl: `Opdrachten, werkritme op locatie en leesvoer voor teams in ${region.city}.`,
    },
    keywords: [region.city.toLowerCase(), region.cityEnglish.toLowerCase(), ...region.searchTerms],
  })),
];

export const SEARCH_INDEX: SearchEntry[] = [...STATIC_ENTRIES, ...REGION_ENTRIES];

export function searchEntries(
  query: string,
  locale: SearchLocale,
  extraEntries: SearchEntry[] = []
): SearchEntry[] {
  const entries = [...SEARCH_INDEX, ...extraEntries];
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return entries;
  return entries.filter((entry) => {
    const haystack = [
      entry.title[locale],
      entry.description[locale],
      ...entry.keywords,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}
