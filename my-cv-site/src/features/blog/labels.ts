import type { BlogLabels } from "./types";

export function buildBlogLabels(t: (key: string) => string): BlogLabels {
  return {
    eyebrow: t("eyebrow"),
    indexTitle: t("index.title"),
    indexSubtitle: t("index.subtitle"),
    minRead: t("minRead"),
    publishedOn: t("publishedOn"),
    updatedOn: t("updatedOn"),
    writtenBy: t("writtenBy"),
    readArticle: t("readArticle"),
    backToList: t("backToList"),
    category: {
      architecture: t("category.architecture"),
      testing: t("category.testing"),
      seo: t("category.seo"),
      routing: t("category.routing"),
      fundamentals: t("category.fundamentals"),
    },
    ctaTitle: t("cta.title"),
    ctaText: t("cta.text"),
    ctaButton: t("cta.button"),
    breadcrumbLabel: t("breadcrumbLabel"),
    homeLabel: t("homeLabel"),
  };
}
