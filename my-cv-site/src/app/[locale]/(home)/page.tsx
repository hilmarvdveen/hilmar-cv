import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import {
  HeroSection,
  ResultsStrip,
  ClientLogosCarousel,
  FlagshipSection,
  TrackRecordSection,
  DeliveryMethodSection,
  StandardsSection,
  CallToActionSection,
  ValidationSection,
  StackSection,
  HiringSection,
  CloseSection,
} from "@/features/home";
import { SEOFactory } from "@/lib/seo";
import type { Locale } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seoData = SEOFactory.homepage(locale as Locale);

  return seoData.metadata;
}

/**
 * The homepage is a sales page, ordered as a funnel: outcome and proof first,
 * method and standards next, then the external validation, and only then the
 * mid-page ask, so the button lands where conviction peaks. Practical hiring
 * facts and one closing ask come last.
 * The full work history lives on /experience, reachable from the logo
 * carousel and the flagship section.
 */
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
      <ResultsStrip />
      <ClientLogosCarousel />
      <FlagshipSection />
      <TrackRecordSection />
      <DeliveryMethodSection />
      <StandardsSection />
      <ValidationSection />
      <CallToActionSection />
      <StackSection />
      <HiringSection />
      <CloseSection />
    </>
  );
}
