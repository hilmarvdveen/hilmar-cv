import { BUSINESS_PROFILE, LOCALE_CONFIG } from "./constants/meta-constants";

type SupportedLocale = (typeof LOCALE_CONFIG.SUPPORTED)[number];

export type LocalizedAlternates = {
  canonical: string;
  languages: Record<string, string>;
};

const isSupported = (locale: string): locale is SupportedLocale =>
  (LOCALE_CONFIG.SUPPORTED as readonly string[]).includes(locale);

export const localizedAlternates = (path: string, locale: string): LocalizedAlternates => {
  const base = BUSINESS_PROFILE.CONTACT.WEBSITE.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "").replace(/\/+$/, "");
  const urlFor = (code: SupportedLocale) =>
    `${base}/${code}${cleanPath ? `/${cleanPath}` : ""}`;
  const languages: Record<string, string> = {};
  for (const code of LOCALE_CONFIG.SUPPORTED) {
    languages[LOCALE_CONFIG.HREFLANG[code]] = urlFor(code);
  }
  languages["x-default"] = urlFor(LOCALE_CONFIG.DEFAULT);
  const current = isSupported(locale) ? locale : LOCALE_CONFIG.DEFAULT;
  return { canonical: urlFor(current), languages };
};
