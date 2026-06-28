import type { ComponentType } from "react";
import type { Locale } from "@/lib/seo";

/**
 * Blog domain model.
 *
 * Posts are authored as typed React components (one file per post under
 * `components/`). Each post file exports its `meta` plus a `Body` component so
 * ReactFlow diagrams, code blocks and callouts can be embedded natively. The
 * long-form copy is bilingual: every text node is a {@link LocalizedText} and
 * the `Body` renders the active locale.
 */

/** The article categories surfaced on the index and in breadcrumbs. */
export type BlogCategory =
  | "architecture"
  | "testing"
  | "seo"
  | "routing"
  | "fundamentals";

/** A string available in every site locale (`nl` + `en`). */
export type LocalizedText = Record<Locale, string>;

/** Serializable metadata for a post — safe to read on the server and client. */
export type BlogPostMeta = {
  /** URL segment, e.g. `react-folder-structure`. Unique across all posts. */
  slug: string;
  category: BlogCategory;
  /** Publish date as `YYYY-MM-DD` (used for sitemap + BlogPosting schema). */
  publishedDate: string;
  /** Optional last-meaningful-edit date as `YYYY-MM-DD`. */
  updatedDate?: string;
  /** Estimated reading time in minutes, shown on cards and the article header. */
  readingTimeMin: number;
  title: LocalizedText;
  description: LocalizedText;
  /** Short teaser for the index cards. */
  excerpt: LocalizedText;
  /** SEO keywords (language-neutral tokens) fed into the BlogPosting schema. */
  keywords: string[];
};

/** A fully-resolved post: metadata + its renderable body. */
export type BlogPost = BlogPostMeta & {
  Body: ComponentType<{ locale: Locale }>;
};

/** Translated chrome strings passed into the presentational blog components. */
export type BlogLabels = {
  eyebrow: string;
  indexTitle: string;
  indexSubtitle: string;
  minRead: string;
  publishedOn: string;
  updatedOn: string;
  writtenBy: string;
  readArticle: string;
  backToList: string;
  category: Record<BlogCategory, string>;
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
};
