import type { Metadata } from "next";
import { BUSINESS_PROFILE, LOCALE_CONFIG, SOCIAL_OPTIMIZATION } from "./constants/meta-constants";
import { socialCardUrl } from "./socialCard";

type SupportedLocale = (typeof LOCALE_CONFIG.SUPPORTED)[number];

export type LocalizedAlternates = {
  canonical: string;
  languages: Record<string, string>;
};

export type LocalizedOpenGraph = Pick<Metadata, "openGraph" | "twitter">;

const isSupported = (locale: string): locale is SupportedLocale =>
  (LOCALE_CONFIG.SUPPORTED as readonly string[]).includes(locale);

const resolveLocale = (locale: string): SupportedLocale =>
  isSupported(locale) ? locale : LOCALE_CONFIG.DEFAULT;

const siteBase = () => BUSINESS_PROFILE.CONTACT.WEBSITE.replace(/\/+$/, "");

const cleanPathFor = (path: string) => path.replace(/^\/+/, "").replace(/\/+$/, "");

const localizedUrl = (path: string, locale: SupportedLocale) => {
  const cleanPath = cleanPathFor(path);
  return `${siteBase()}/${locale}${cleanPath ? `/${cleanPath}` : ""}`;
};

export const localizedAlternates = (path: string, locale: string): LocalizedAlternates => {
  const languages: Record<string, string> = {};
  for (const code of LOCALE_CONFIG.SUPPORTED) {
    languages[LOCALE_CONFIG.HREFLANG[code]] = localizedUrl(path, code);
  }
  languages["x-default"] = localizedUrl(path, LOCALE_CONFIG.DEFAULT);
  return { canonical: localizedUrl(path, resolveLocale(locale)), languages };
};

const DESCRIPTION_LIMIT = 160;

export const clampDescription = (description: string): string => {
  const clean = description.replace(/\s+/g, " ").trim();
  if (clean.length <= DESCRIPTION_LIMIT) return clean;
  const cut = clean.slice(0, DESCRIPTION_LIMIT - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > DESCRIPTION_LIMIT / 2 ? cut.slice(0, lastSpace) : cut).trim()}…`;
};

export const localizedOpenGraph = (
  path: string,
  locale: string,
  title: string,
  rawDescription: string
): LocalizedOpenGraph => {
  const currentLocale = resolveLocale(locale);
  const description = clampDescription(rawDescription);
  const canonicalUrl = localizedUrl(path, currentLocale);
  const ogLocale = LOCALE_CONFIG.OPEN_GRAPH_LOCALE[currentLocale];
  const alternateLocale = Object.values(LOCALE_CONFIG.OPEN_GRAPH_LOCALE).filter(
    (value) => value !== ogLocale
  );

  return {
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: BUSINESS_PROFILE.NAME,
      locale: ogLocale,
      alternateLocale,
      images: [
        {
          url: socialCardUrl(siteBase(), currentLocale, title),
          width: SOCIAL_OPTIMIZATION.OPEN_GRAPH.IMAGE_SIZE.WIDTH,
          height: SOCIAL_OPTIMIZATION.OPEN_GRAPH.IMAGE_SIZE.HEIGHT,
          alt: title,
        },
      ],
    },
    twitter: {
      card: SOCIAL_OPTIMIZATION.TWITTER.CARD,
      title,
      description,
      images: [socialCardUrl(siteBase(), currentLocale, title)],
    },
  };
};

export const brandedTitle = (title: string): string => `${title} | ${BUSINESS_PROFILE.NAME}`;
