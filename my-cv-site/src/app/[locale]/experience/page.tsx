import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { workHistory } from "@/data/workHistory";
import { WorkExperienceSection, ExperienceClose } from "@/features/experience";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { localizedAlternates, localizedOpenGraph } from "@/lib/seo";
import { experienceHubSchema } from "@/lib/seo/experienceSchema";

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
  const work = await getTranslations({ locale, namespace: "work" });
  const structuredData = experienceHubSchema({
    locale: locale === "en" ? "en" : "nl",
    title: t("title"),
    description: t("metaDescription"),
    entries: workHistory.map((entry) => ({ id: entry.id, company: work(`${entry.id}.company`) })),
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <PageHero
        width="narrow"
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
