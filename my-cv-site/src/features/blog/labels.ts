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
      accessibility: t("category.accessibility"),
      api: t("category.api"),
    },
    track: {
      frontend: t("track.frontend"),
      fullstack: t("track.fullstack"),
      backend: t("track.backend"),
    },
    group: {
      frontend: t("group.frontend"),
      fullstack: t("group.fullstack"),
      backend: t("group.backend"),
    },
    ctaTitle: t("cta.title"),
    ctaText: t("cta.text"),
    ctaButton: t("cta.button"),
    breadcrumbLabel: t("breadcrumbLabel"),
    homeLabel: t("homeLabel"),
  };
}
