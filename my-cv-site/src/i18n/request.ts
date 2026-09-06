import * as rootParams from "next/root-params";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "./routing";

const readRootLocale = async (): Promise<string | undefined> => {
  try {
    return await rootParams.locale();
  } catch {
    return undefined;
  }
};

export default getRequestConfig(async ({ locale }) => {
  const requested = locale ?? (await readRootLocale());
  if (!hasLocale(routing.locales, requested)) {
    notFound();
  }
  return {
    locale: requested,
    messages: (await import(`./messages/${requested}.json`)).default,
  };
});
