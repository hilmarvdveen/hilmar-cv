import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

type AppLocale = (typeof routing.locales)[number];

const isAppLocale = (value: string | undefined): value is AppLocale =>
  routing.locales.includes(value as AppLocale);

export const resolveLocale = (requested: string | undefined): AppLocale =>
  isAppLocale(requested) ? requested : routing.defaultLocale;

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const resolved = resolveLocale(locale ?? (await requestLocale));
  return {
    locale: resolved,
    messages: (await import(`./messages/${resolved}.json`)).default,
  };
});
