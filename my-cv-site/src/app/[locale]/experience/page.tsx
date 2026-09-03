import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { WorkExperienceSection } from "@/features/experience";
import { PageHero } from "@/components/PageHero";
import { localizedAlternates } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experiencePage" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates("experience", locale),
  };
}

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "experiencePage" });

  return (
    <>
      <PageHero title={t("title")} description={t("description")} />
      <WorkExperienceSection />
    </>
  );
}
