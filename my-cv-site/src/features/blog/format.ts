import type { Locale } from "@/lib/seo";

const LOCALE_TAG: Record<Locale, string> = { en: "en-US", nl: "nl-NL" };

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${iso}T00:00:00`));
}
