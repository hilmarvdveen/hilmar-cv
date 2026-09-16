import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SEOFactory } from "@/lib/seo";
import type { Locale } from "@/lib/seo";
import { BlogArticle, getPostBySlug, BLOG_POSTS } from "@/features/blog";
import { buildBlogLabels } from "@/features/blog/labels";
import { findPostNeighbours } from "@/lib/postNeighbours";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

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

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const loc = locale as Locale;
  const seoData = SEOFactory.blogPost(loc, postSeoInput(post, loc));
  const t = await getTranslations({ locale, namespace: "blog" });
  const labels = buildBlogLabels(t);
  const { previous, next } = findPostNeighbours(BLOG_POSTS, slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: seoData.structuredData }}
      />
      <BlogArticle
        post={post}
        locale={loc}
        labels={labels}
        previous={previous}
        next={next}
      />
    </>
  );
}
