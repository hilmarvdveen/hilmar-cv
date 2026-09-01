import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { WorkExperienceSection } from "@/features/experience";
import { Container } from "@/components/Container";
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

/**
 * The full work history, one dossier per engagement. The homepage links here
 * from the logo carousel (per-client anchors) and the flagship section.
 */
export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "experiencePage" });

  return (
    <>
      <section
        aria-labelledby="experience-heading"
        className="bg-brand-navy py-16 sm:py-20"
      >
        <Container>
          <h1
            id="experience-heading"
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3"
          >
            {t("title")}
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            {t("description")}
          </p>
        </Container>
      </section>

      <WorkExperienceSection />
    </>
  );
}
