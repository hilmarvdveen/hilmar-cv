import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { HeroSection } from "@/components/HeroSection";
import { UspSection } from "@/components/UspSection";
import { ProjectHighlightsSection } from "@/components/ProjectHighlightsSection";
import { TechStackSection } from "@/components/TechSTackSection";
import { CallToActionSection } from "@/components/CallToActionSection";
import { AboutSection } from "@/components/AboutSection";
import { NetherlandsMap } from "@/components/NetherlandsMap";
import { WorkExperienceSection } from "@/components/WorkExperienceSection";
import { CertificationsSection } from "@/components/CertificationSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: "Hilmar van der Veen – Senior Frontend Developer",
    description: t("hero.description", {
      defaultValue:
        "Schaalbare, toegankelijke en toekomstbestendige frontends in React, Angular en Next.js.",
    }),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <HeroSection />
      <AboutSection />
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
    </main>
  );
}
