import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { FitCheck, FitDisclosure, FIT_CHECK_HEADING_ID } from "@/features/fit";
import { brandedTitle, localizedAlternates, localizedOpenGraph } from "@/lib/seo";
import { fitPageSchema } from "@/lib/seo/fitSchema";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "fit" });
  const title = t("meta.title");
  const description = t("meta.description");

  return {
    title: brandedTitle(title),
    description,
    alternates: localizedAlternates("fit", locale),
    ...localizedOpenGraph("fit", locale, title, description),
  };
}

export default async function FitPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "fit" });
  const breadcrumbLabels = await getTranslations({ locale, namespace: "breadcrumb" });

  const structuredData = fitPageSchema({
    locale: locale === "en" ? "en" : "nl",
    title: t("meta.title"),
    description: t("meta.description"),
    homeLabel: breadcrumbLabels("home"),
    pageLabel: breadcrumbLabels("fit"),
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <PageHero
        width="narrow"
        padding="compact"
        badge={t("hero.badge")}
        badgeIcon={Sparkles}
        title={t("hero.title")}
        description={t("hero.description")}
        breadcrumb={<Breadcrumb />}
      />

      <Section padding="compact" aria-labelledby={FIT_CHECK_HEADING_ID}>
        <Container width="narrow">
          <FitCheck
            heading={t("section.title")}
            intro={t("section.intro")}
            disclosure={<FitDisclosure />}
          />
        </Container>
      </Section>
    </>
  );
}
