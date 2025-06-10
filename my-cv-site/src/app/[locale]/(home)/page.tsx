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
import { SEOFactory } from "@/lib/seo";
import type { Locale } from "@/lib/seo";

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
  const seoData = SEOFactory.homepage(locale as Locale);

  return seoData.metadata;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const seoData = SEOFactory.homepage(locale as Locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: seoData.structuredData,
        }}
      />

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
