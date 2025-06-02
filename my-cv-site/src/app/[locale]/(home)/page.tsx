import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ClientLogosCarousel } from "@/components/ClientLogosCarousel";
import { UspSection } from "@/components/UspSection";
import { CallToActionSection } from "@/components/CallToActionSection";
import { WorkExperienceSection } from "@/components/WorkExperienceSection";
import { ProjectHighlightsSection } from "@/components/ProjectHighlightsSection";
import { TechStackSection } from "@/components/TechSTackSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CertificationsSection } from "@/components/CertificationSection";
import { NetherlandsMap } from "@/components/NetherlandsMap";
import { PageSEO } from "@/components/SEO/PageSEO";
import { homepageSEO } from "@/lib/seo.pages";
import { generatePageSEO } from "@/lib/seo.config";
import { siteConfig } from "@/lib/seo.config";

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
