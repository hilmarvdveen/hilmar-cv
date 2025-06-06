import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";

import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ClientLogosCarousel } from "@/components/ClientLogosCarousel";
import { UspSection } from "@/components/UspSection";
import { CallToActionSection } from "@/components/CallToActionSection";
import { WorkExperienceSection } from "@/components/WorkExperienceSection";
import { ProjectHighlightsSection } from "@/components/ProjectHighlightsSection";
import { TechStackSection } from "@/components/TechSTackSection";
import { PageSEO } from "@/components/SEO/PageSEO";
import { homepageSEO } from "@/lib/seo.pages";
import { generatePageSEO } from "@/lib/seo.config";
import { siteConfig } from "@/lib/seo.config";

// Lazy load heavy components for better performance
const TestimonialsSection = dynamic(
  () =>
    import("@/components/TestimonialsSection").then((mod) => ({
      default: mod.TestimonialsSection,
    })),
  {
    loading: () => (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    ),
  }
);

const CertificationsSection = dynamic(
  () =>
    import("@/components/CertificationSection").then((mod) => ({
      default: mod.CertificationsSection,
    })),
  {
    loading: () => (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    ),
  }
);

const NetherlandsMap = dynamic(
  () =>
    import("@/components/NetherlandsMap").then((mod) => ({
      default: mod.NetherlandsMap,
    })),
  {
    loading: () => (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    ),
  }
);

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const config = homepageSEO(locale);
  const baseUrl = siteConfig.url;
  const currentUrl = `${baseUrl}/${locale}`;

  const seoConfig = generatePageSEO({
    ...config.seo,
    url: currentUrl,
  });

  const alternateLanguages: Record<string, string> = {
    en: currentUrl.replace(`/${locale}`, "/en"),
    nl: currentUrl.replace(`/${locale}`, "/nl"),
    "x-default": currentUrl.replace(`/${locale}`, "/nl"),
  };

  return {
    metadataBase: new URL(baseUrl),
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    robots: {
      index: !seoConfig.noIndex,
      follow: !seoConfig.noFollow,
      googleBot: {
        index: !seoConfig.noIndex,
        follow: !seoConfig.noFollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: seoConfig.type || "website",
      locale: locale === "nl" ? "nl_NL" : "en_US",
      alternateLocale: locale === "nl" ? "en_US" : "nl_NL",
      url: currentUrl,
      siteName: siteConfig.name,
      title: seoConfig.title,
      description: seoConfig.description,
      images: seoConfig.image
        ? [
            {
              url: seoConfig.image,
              width: 1200,
              height: 630,
              alt: seoConfig.title || siteConfig.name,
              type: "image/jpeg",
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seoConfig.title,
      description: seoConfig.description,
      images: seoConfig.image ? [seoConfig.image] : [],
      creator: siteConfig.author.twitter,
      site: siteConfig.author.twitter,
    },
    alternates: {
      canonical: currentUrl,
      languages: alternateLanguages,
    },
    other: {
      "article:author": siteConfig.author.name,
      "article:publisher": baseUrl,
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const config = homepageSEO(locale);

  // Generate structured data for the page
  const structuredData = [
    ...(config.structuredData?.map((schema) => ({
      "@context": "https://schema.org",
      "@type": schema.type,
      ...schema.data,
    })) || []),
  ];

  return (
    <>
      <PageSEO structuredData={structuredData} />

      <HeroSection />
      <AboutSection />
      <ClientLogosCarousel />
      <UspSection />
      <CallToActionSection />
      <WorkExperienceSection />
      <CallToActionSection />
      <ProjectHighlightsSection />
      <TechStackSection />
      <TestimonialsSection />
      <CertificationsSection />
      <NetherlandsMap />
      <CallToActionSection />
    </>
  );
}
