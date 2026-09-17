import type { FitLocale } from "./types";

export function formatFitCheckDate(isoDate: string, locale: FitLocale): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Amsterdam",
  }).format(parsed);
}

export function fillDatePlaceholder(template: string, formattedDate: string): string {
  return template.replace("{date}", formattedDate);
}
