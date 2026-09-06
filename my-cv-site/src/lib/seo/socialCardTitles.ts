import englishMessages from "@/i18n/messages/en.json";
import dutchMessages from "@/i18n/messages/nl.json";
import { LEGAL_CONTENT } from "@/features/legal/legalContent";
import { BLOG_POSTS } from "@/features/blog";
import { REGION_IDS } from "@/data/regions";
import { SEOFactory } from "./factory";
import { socialCardTitle } from "./socialCard";
import type { Locale } from "./types/seo-types";

type WorkEntryMessages = { headline?: string; company?: string };

const messagesFor = (locale: Locale) =>
  (locale === "en" ? englishMessages : dutchMessages) as unknown as {
    work: Record<string, WorkEntryMessages | string>;
    experiencePage: { title: string };
    search: { title: string };
    regions: Record<string, { title?: string } | string>;
  };

const metadataTitle = (title: unknown): string => (typeof title === "string" ? title : "");

function engineTitles(locale: Locale): string[] {
  const pages = [
    SEOFactory.homepage(locale),
    SEOFactory.about(locale),
    SEOFactory.services(locale),
    SEOFactory.projects(locale),
    SEOFactory.contact(locale),
    SEOFactory.booking(locale),
    SEOFactory.blog(locale),
    SEOFactory.privacy(locale),
    SEOFactory.faq(locale, []),
    SEOFactory.frontendService(locale),
    SEOFactory.fullstackService(locale),
    SEOFactory.designSystemsService(locale),
    SEOFactory.consultingService(locale),
  ];
  return pages.map((page) => metadataTitle(page.metadata.title));
}

function blogTitles(locale: Locale): string[] {
  return BLOG_POSTS.flatMap((post) => {
    const title = post.title[locale];
    return [title, metadataTitle(SEOFactory.blogPost(locale, {
      slug: post.slug,
      title,
      description: post.description[locale],
      keywords: post.keywords,
      category: post.category,
      publishedDate: post.publishedDate,
      updatedDate: post.updatedDate,
    }).metadata.title)];
  });
}

function pageTitles(locale: Locale): string[] {
  const messages = messagesFor(locale);
  const engagements = Object.values(messages.work)
    .filter((entry): entry is WorkEntryMessages => typeof entry === "object" && entry !== null)
    .filter((entry) => entry.headline && entry.company)
    .map((entry) => `${entry.headline} | ${entry.company}`);
  const legal = Object.values(LEGAL_CONTENT).map((document) => document[locale].title);
  return [messages.experiencePage.title, messages.search.title, ...engagements, ...legal];
}

function regionTitles(locale: Locale): string[] {
  const regions = messagesFor(locale).regions;
  return ["hub", ...REGION_IDS].flatMap((id) => {
    const entry = regions[id];
    return typeof entry === "object" && entry !== null && entry.title ? [entry.title] : [];
  });
}

const cache = new Map<Locale, Set<string>>();

export function knownSocialCardTitles(locale: Locale): Set<string> {
  const cached = cache.get(locale);
  if (cached) return cached;
  const titles = new Set(
    [...engineTitles(locale), ...blogTitles(locale), ...pageTitles(locale), ...regionTitles(locale)]
      .map((title) => socialCardTitle(title))
      .filter((title) => title.length > 0)
  );
  cache.set(locale, titles);
  return titles;
}

export function isKnownSocialCardTitle(locale: Locale, title: string): boolean {
  return knownSocialCardTitles(locale).has(socialCardTitle(title));
}
