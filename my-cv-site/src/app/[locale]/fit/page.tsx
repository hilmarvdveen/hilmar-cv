import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { FitCheck } from "@/features/fit";
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
  const breadcrumb = await getTranslations({ locale, namespace: "breadcrumb" });

  const structuredData = fitPageSchema({
    locale: locale === "en" ? "en" : "nl",
    title: t("meta.title"),
    description: t("meta.description"),
    homeLabel: breadcrumb("home"),
    pageLabel: breadcrumb("fit"),
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <PageHero
        width="narrow"
        badge={t("hero.badge")}
        badgeIcon={Sparkles}
        title={t("hero.title")}
        description={t("hero.description")}
      >
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">
            {t("disclosure.title")}
          </p>
          <p className="mt-3 text-base leading-relaxed text-slate-300">
            {t("disclosure.assistant")}
          </p>
          <p className="mt-2 text-base leading-relaxed text-slate-300">
            {t("disclosure.processing")}
          </p>
        </div>
      </PageHero>

      <Section aria-labelledby="fit-check-heading">
        <Container width="narrow">
          <SectionTitle
            id="fit-check-heading"
            title={t("section.title")}
            subtitle={t("section.intro")}
          />
          <FitCheck />
        </Container>
      </Section>
    </>
  );
}
