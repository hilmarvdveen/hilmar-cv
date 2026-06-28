import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { SEOFactory } from "@/lib/seo";
import type { Locale } from "@/lib/seo";
import { BlogIndex, BLOG_POSTS } from "@/features/blog";
import { buildBlogLabels } from "@/features/blog/labels";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seoData = SEOFactory.blog(locale as Locale);
  return seoData.metadata;
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const seoData = SEOFactory.blog(locale as Locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const labels = buildBlogLabels(t);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: seoData.structuredData }}
      />
      <BlogIndex posts={BLOG_POSTS} locale={locale as Locale} labels={labels} />
    </>
  );
}
