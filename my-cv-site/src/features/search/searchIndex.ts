export type SearchLocale = "en" | "nl";

export type SearchKind = "page" | "engagement" | "post";

export type SearchEntry = {
  kind?: SearchKind;
  href: string;
  title: Record<SearchLocale, string>;
  description: Record<SearchLocale, string>;
  keywords: string[];
};

export const SEARCH_INDEX: SearchEntry[] = [
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
    title: { en: "About", nl: "Over mij" },
    description: {
      en: "Experience, strengths and background.",
      nl: "Ervaring, sterke punten en achtergrond.",
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
      en: "Frontend, fullstack, design systems and consulting services.",
      nl: "Frontend, fullstack, design systems en consultancy diensten.",
    },
    keywords: ["services", "diensten", "hire", "inhuren"],
  },
  {
    href: "/services/frontend",
    kind: "page",
    title: { en: "Frontend development", nl: "Frontend-ontwikkeling" },
    description: {
      en: "React, Angular and Next.js frontend development.",
      nl: "React-, Angular- en Next.js-frontendontwikkeling.",
    },
    keywords: ["frontend", "react", "angular", "next.js", "typescript"],
  },
  {
    href: "/services/fullstack",
    kind: "page",
    title: { en: "Fullstack development", nl: "Fullstack-ontwikkeling" },
    description: {
      en: "End-to-end fullstack web application development.",
      nl: "End-to-end fullstack webapplicatieontwikkeling.",
    },
    keywords: ["fullstack", "node", "api", "backend"],
  },
  {
    href: "/services/design-systems",
    kind: "page",
    title: { en: "Design systems", nl: "Design systems" },
    description: {
      en: "Scalable, accessible component libraries and design systems.",
      nl: "Schaalbare, toegankelijke componentbibliotheken en design systems.",
    },
    keywords: ["design system", "components", "storybook", "ui", "accessibility"],
  },
  {
    href: "/services/consulting",
    kind: "page",
    title: { en: "Consulting", nl: "Consultancy" },
    description: {
      en: "Frontend architecture and technical consulting.",
      nl: "Frontend-architectuur en technische consultancy.",
    },
    keywords: ["consulting", "consultancy", "architecture", "advies"],
  },
  {
    href: "/projects",
    kind: "page",
    title: { en: "Projects", nl: "Projecten" },
    description: {
      en: "Selected work and case studies.",
      nl: "Geselecteerd werk en casestudy's.",
    },
    keywords: ["projects", "projecten", "portfolio", "work", "cases"],
  },
  {
    href: "/faq",
    kind: "page",
    title: { en: "FAQ", nl: "Veelgestelde vragen" },
    description: {
      en: "Answers about services, pricing and collaboration.",
      nl: "Antwoorden over diensten, prijzen en samenwerking.",
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
      "freelance",
      "zzp",
    ],
  },
  {
    href: "/book",
    kind: "page",
    title: { en: "Book a consultation", nl: "Plan een gesprek" },
    description: {
      en: "Schedule a consultation slot.",
      nl: "Plan een gesprek in.",
    },
    keywords: ["book", "boeken", "schedule", "afspraak", "consultation"],
  },
  {
    href: "/contact",
    kind: "page",
    title: { en: "Contact", nl: "Contact" },
    description: {
      en: "Get in touch by email or phone.",
      nl: "Neem contact op via e-mail of telefoon.",
    },
    keywords: ["contact", "email", "phone", "telefoon"],
  },
];

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
