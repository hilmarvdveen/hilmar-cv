import type { BlogLabels } from "./types";

/**
 * Build the presentational {@link BlogLabels} from a translation function.
 * Kept as a pure function (takes `t`, returns strings) so the route stays thin
 * and this mapping is unit-testable without mocking the i18n runtime.
 */
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
  };
}
