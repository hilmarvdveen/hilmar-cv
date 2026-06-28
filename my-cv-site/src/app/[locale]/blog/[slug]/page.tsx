import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { SEOFactory } from "@/lib/seo";
import type { Locale } from "@/lib/seo";
import { BlogArticle, getPostBySlug } from "@/features/blog";
import { buildBlogLabels } from "@/features/blog/labels";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// Rendered dynamically per request (like every other page on the site) so the
// URL locale is always respected and the per-request CSP nonce from proxy.ts
// applies. A static generateStaticParams without `locale` would prerender posts
// under the default locale (nl) and break /en/blog/* — see git history.

function postSeoInput(post: NonNullable<ReturnType<typeof getPostBySlug>>, locale: Locale) {
  return {
    slug: post.slug,
    title: post.title[locale],
    description: post.description[locale],
    keywords: post.keywords,
    category: post.category,
    publishedDate: post.publishedDate,
    updatedDate: post.updatedDate,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return SEOFactory.blogPost(locale as Locale, postSeoInput(post, locale as Locale)).metadata;
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const loc = locale as Locale;
  const seoData = SEOFactory.blogPost(loc, postSeoInput(post, loc));
  const t = await getTranslations({ locale, namespace: "blog" });
  const labels = buildBlogLabels(t);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: seoData.structuredData }}
      />
      <BlogArticle post={post} locale={loc} labels={labels} />
    </>
  );
}
