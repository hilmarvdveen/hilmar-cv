import type { FitLocale } from "./types";

const SLUG_MAXIMUM_LENGTH = 40;

const DIACRITICS = /[̀-ͯ]/g;

export function vacancySlug(title: string): string {
  return title
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAXIMUM_LENGTH)
    .replace(/-+$/g, "");
}

export function tailoredCvFileName(title: string, locale: FitLocale): string {
  const slug = vacancySlug(title);
  const suffix = slug ? `-${slug}` : "";
  return `cv-hilmar-van-der-veen-${locale}${suffix}.pdf`;
}
