import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { WorkExperienceSection, ExperienceClose } from "@/features/experience";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { localizedAlternates, localizedOpenGraph } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experiencePage" });
  const title = t("title");
  const description = t("metaDescription");

  return {
    title,
    description,
    alternates: localizedAlternates("experience", locale),
    ...localizedOpenGraph("experience", locale, title, description),
  };
}

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "experiencePage" });
  const tHome = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      <PageHero
        title={t("title")}
        description={t("description")}
        actions={
          <Button href="/book" variant="primary" size="lg" data-placement="experience-hero">
            {tHome("hero.bookCall")}
          </Button>
        }
      />
      <WorkExperienceSection />
      <ExperienceClose />
    </>
  );
}
