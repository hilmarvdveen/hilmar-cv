import {
  BUSINESS_PROFILE,
  PRICING,
  QUALIFICATIONS,
  RATE_TEXT,
} from "@/lib/seo/constants/meta-constants";
import type { FitLocale } from "./types";

export type SeedWorkMode = "remote" | "onSite" | "hybrid";
export type SeedLanguage = "dutch" | "english";

export type SeedWorkEntry = {
  id: string;
  company: string;
  from: string;
  to: string;
  location: string;
  mode: string;
  language: string;
  tech: string[];
};

export type SeedPostEntry = {
  slug: string;
  category: string;
  track: string;
  publishedDate: string;
  updatedDate?: string;
  title: Record<FitLocale, string>;
  description: Record<FitLocale, string>;
  keywords: string[];
};

export type SeedWorkEntrySection = {
  heading?: string;
  paragraph: string;
};

export type SeedWorkEntryMessages = {
  company: string;
  location: string;
  role: string;
  headline: string;
  summary: string;
  delivered: string[];
  body: SeedWorkEntrySection[];
};

export type SeedFaqCategoryMessages = {
  title: string;
  questions: Array<{ question: string; answer: string }>;
};

export type SeedMessages = {
  work: Record<string, unknown>;
  faq: { categories: Record<string, SeedFaqCategoryMessages> };
};

export type SeedRecordInput = {
  generatedAt: string;
  engagements: SeedWorkEntry[];
  posts: SeedPostEntry[];
  messages: Record<FitLocale, SeedMessages>;
};

export type SeedLocalizedText = Record<FitLocale, string>;
export type SeedLocalizedList = Record<FitLocale, string[]>;

export type SeedEngagement = {
  id: string;
  url: string;
  company: string;
  location: string;
  from: string;
  to: string;
  mode: SeedWorkMode;
  language: SeedLanguage;
  technologies: string[];
  technologyKeys: string[];
  role: SeedLocalizedText;
  headline: SeedLocalizedText;
  summary: SeedLocalizedText;
  delivered: SeedLocalizedList;
  stories: SeedLocalizedList;
};

export type SeedPost = {
  slug: string;
  url: string;
  track: string;
  category: string;
  publishedDate: string;
  updatedDate: string | null;
  title: SeedLocalizedText;
  description: SeedLocalizedText;
  keywords: string[];
};

export type SeedFaqEntry = {
  category: string;
  categoryTitle: SeedLocalizedText;
  question: SeedLocalizedText;
  answer: SeedLocalizedText;
};

export type SeedProfile = {
  name: string;
  title: string;
  company: string;
  registration: { kvk: string; legalForm: string; establishmentNumber: string };
  city: string;
  region: string;
  country: string;
  serviceArea: { name: string; cities: string[]; citiesEnglish: string[] };
  contact: {
    email: string;
    phone: string;
    phoneDisplay: string;
    whatsapp: string;
    website: string;
  };
  social: { linkedin: string; github: string };
  established: string;
  yearsExperience: string;
  availableFrom: SeedLocalizedText;
  specialization: string;
  rate: {
    minimum: number;
    maximum: number;
    currency: string;
    vatIncluded: boolean;
    text: SeedLocalizedText;
  };
  qualifications: {
    education: string;
    certifications: string[];
    languages: string[];
    previousClients: string[];
  };
};

export type SeedRecord = {
  generatedAt: string;
  site: string;
  profile: SeedProfile;
  engagements: SeedEngagement[];
  posts: SeedPost[];
  faq: SeedFaqEntry[];
};

const WORK_MODES: Record<string, SeedWorkMode> = {
  "workMode.remote": "remote",
  "workMode.onSite": "onSite",
  "workMode.hybrid": "hybrid",
};

const LANGUAGES: Record<string, SeedLanguage> = {
  "language.dutch": "dutch",
  "language.english": "english",
};

const technologyKeyOf = (value: string): string => value.replace(/^tech\./, "");

const entryMessages = (
  messages: Record<FitLocale, SeedMessages>,
  locale: FitLocale,
  id: string
): SeedWorkEntryMessages => messages[locale].work[id] as SeedWorkEntryMessages;

const technologyLabels = (messages: Record<FitLocale, SeedMessages>): Record<string, string> =>
  messages.en.work.tech as Record<string, string>;

const perLocale = <T>(read: (locale: FitLocale) => T): Record<FitLocale, T> => ({
  en: read("en"),
  nl: read("nl"),
});

function buildProfile(): SeedProfile {
  return {
    name: BUSINESS_PROFILE.NAME,
    title: BUSINESS_PROFILE.TITLE,
    company: BUSINESS_PROFILE.COMPANY,
    registration: {
      kvk: BUSINESS_PROFILE.REGISTRATION.KVK,
      legalForm: BUSINESS_PROFILE.REGISTRATION.LEGAL_FORM,
      establishmentNumber: BUSINESS_PROFILE.REGISTRATION.ESTABLISHMENT_NUMBER,
    },
    city: BUSINESS_PROFILE.LOCATION.CITY,
    region: BUSINESS_PROFILE.SERVICE_AREA.NAME,
    country: BUSINESS_PROFILE.LOCATION.COUNTRY_CODE,
    serviceArea: {
      name: BUSINESS_PROFILE.SERVICE_AREA.NAME,
      cities: [...BUSINESS_PROFILE.SERVICE_AREA.CITIES],
      citiesEnglish: [...BUSINESS_PROFILE.SERVICE_AREA.CITIES_ENGLISH],
    },
    contact: {
      email: BUSINESS_PROFILE.CONTACT.EMAIL,
      phone: BUSINESS_PROFILE.CONTACT.PHONE,
      phoneDisplay: BUSINESS_PROFILE.CONTACT.PHONE_DISPLAY,
      whatsapp: BUSINESS_PROFILE.CONTACT.WHATSAPP,
      website: BUSINESS_PROFILE.CONTACT.WEBSITE,
    },
    social: {
      linkedin: BUSINESS_PROFILE.SOCIAL.LINKEDIN,
      github: BUSINESS_PROFILE.SOCIAL.GITHUB,
    },
    established: BUSINESS_PROFILE.ESTABLISHED,
    yearsExperience: BUSINESS_PROFILE.YEARS_EXPERIENCE,
    availableFrom: {
      en: BUSINESS_PROFILE.AVAILABLE_FROM,
      nl: BUSINESS_PROFILE.AVAILABLE_FROM_DUTCH,
    },
    specialization: BUSINESS_PROFILE.SPECIALIZATION,
    rate: {
      minimum: PRICING.HOURLY_RATE_MIN,
      maximum: PRICING.HOURLY_RATE_MAX,
      currency: PRICING.CURRENCY,
      vatIncluded: PRICING.VAT_INCLUDED,
      text: { en: RATE_TEXT.en, nl: RATE_TEXT.nl },
    },
    qualifications: {
      education: QUALIFICATIONS.EDUCATION,
      certifications: [...QUALIFICATIONS.CERTIFICATIONS],
      languages: [...QUALIFICATIONS.LANGUAGES],
      previousClients: [...QUALIFICATIONS.PREVIOUS_CLIENTS],
    },
  };
}

function buildEngagements(input: SeedRecordInput): SeedEngagement[] {
  const labels = technologyLabels(input.messages);
  return input.engagements.map((entry) => {
    const technologyKeys = entry.tech.map(technologyKeyOf);
    return {
      id: entry.id,
      url: `/experience/${entry.id}`,
      company: entry.company,
      location: entry.location,
      from: entry.from,
      to: entry.to,
      mode: WORK_MODES[entry.mode],
      language: LANGUAGES[entry.language],
      technologies: technologyKeys.map((key) => labels[key]),
      technologyKeys,
      role: perLocale((locale) => entryMessages(input.messages, locale, entry.id).role),
      headline: perLocale((locale) => entryMessages(input.messages, locale, entry.id).headline),
      summary: perLocale((locale) => entryMessages(input.messages, locale, entry.id).summary),
      delivered: perLocale((locale) => [
        ...entryMessages(input.messages, locale, entry.id).delivered,
      ]),
      stories: perLocale((locale) =>
        entryMessages(input.messages, locale, entry.id).body.map((section) => section.paragraph)
      ),
    };
  });
}

function buildPosts(input: SeedRecordInput): SeedPost[] {
  return input.posts.map((post) => ({
    slug: post.slug,
    url: `/blog/${post.slug}`,
    track: post.track,
    category: post.category,
    publishedDate: post.publishedDate,
    updatedDate: post.updatedDate ?? null,
    title: { en: post.title.en, nl: post.title.nl },
    description: { en: post.description.en, nl: post.description.nl },
    keywords: [...post.keywords],
  }));
}

function buildFaq(input: SeedRecordInput): SeedFaqEntry[] {
  const entries: SeedFaqEntry[] = [];
  for (const category of Object.keys(input.messages.en.faq.categories)) {
    const questions = input.messages.en.faq.categories[category].questions;
    for (let position = 0; position < questions.length; position += 1) {
      entries.push({
        category,
        categoryTitle: perLocale(
          (locale) => input.messages[locale].faq.categories[category].title
        ),
        question: perLocale(
          (locale) => input.messages[locale].faq.categories[category].questions[position].question
        ),
        answer: perLocale(
          (locale) => input.messages[locale].faq.categories[category].questions[position].answer
        ),
      });
    }
  }
  return entries;
}

export function buildSeedRecord(input: SeedRecordInput): SeedRecord {
  return {
    generatedAt: input.generatedAt,
    site: BUSINESS_PROFILE.CONTACT.WEBSITE,
    profile: buildProfile(),
    engagements: buildEngagements(input),
    posts: buildPosts(input),
    faq: buildFaq(input),
  };
}
