const INTL_LOCALES: Record<string, string> = {
  nl: "nl-NL",
  en: "en-GB",
};

export function formatMonthYear(yearMonth: string, locale: string): string {
  const [year, month] = yearMonth.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  const intlLocale = INTL_LOCALES[locale] ?? locale;
  return new Intl.DateTimeFormat(intlLocale, {
    month: "long",
    year: "numeric",
  }).format(date);
}
