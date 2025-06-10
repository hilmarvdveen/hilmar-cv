import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SEOFactory } from "@/lib/seo";
import type { Locale } from "@/lib/seo";

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: seoData.structuredData,
        }}
      />
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>
          <div className="bg-white rounded-lg p-8">
            <p className="text-lg text-gray-600 mb-6">
              Technical insights, project updates, and thoughts on full-stack
              development.
            </p>
            <p className="text-gray-600">
              Blog posts coming soon. Follow my journey and get valuable
              insights from 10+ years of experience.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
