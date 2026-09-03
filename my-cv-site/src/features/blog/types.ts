import type { ComponentType } from "react";
import type { Locale } from "@/lib/seo";

export type BlogCategory =
  | "architecture"
  | "testing"
  | "seo"
  | "routing"
  | "fundamentals";

export type LocalizedText = Record<Locale, string>;

export type BlogPostMeta = {
  slug: string;
  category: BlogCategory;
  publishedDate: string;
  updatedDate?: string;
  readingTimeMin: number;
  title: LocalizedText;
  description: LocalizedText;
  excerpt: LocalizedText;
  keywords: string[];
};

export type BlogPost = BlogPostMeta & {
  Body: ComponentType<{ locale: Locale }>;
};

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
  breadcrumbLabel: string;
  homeLabel: string;
};
