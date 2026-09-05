import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { workHistory } from "@/data/workHistory";
import { ExperienceDetail, ExperienceClose } from "@/features/experience";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/Button";
import { formatMonthYear } from "@/lib/workPeriod";
import { clampDescription, localizedAlternates, localizedOpenGraph } from "@/lib/seo";
import { experienceDetailSchema } from "@/lib/seo/experienceSchema";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

const findEntryIndex = (id: string) => workHistory.findIndex((entry) => entry.id === id);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const index = findEntryIndex(id);
  if (index < 0) return {};
  const work = await getTranslations({ locale, namespace: "work" });
  const title = `${work(`${id}.headline`)} | ${work(`${id}.company`)}`;
  const description = clampDescription(work(`${id}.summary`));

  return {
    title,
    description,
    alternates: localizedAlternates(`experience/${id}`, locale),
    ...localizedOpenGraph(`experience/${id}`, locale, title, description),
  };
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const index = findEntryIndex(id);
  if (index < 0) notFound();
  const entry = workHistory[index];
  setRequestLocale(locale);
  const work = await getTranslations({ locale, namespace: "work" });
  const page = await getTranslations({ locale, namespace: "experiencePage" });
  const home = await getTranslations({ locale, namespace: "home" });
  const company = work(`${id}.company`);
  const period = work("period", {
    from: formatMonthYear(entry.from, locale),
    to: formatMonthYear(entry.to, locale),
  });
  const structuredData = experienceDetailSchema({
    locale: locale === "en" ? "en" : "nl",
    id,
    company,
    headline: work(`${id}.headline`),
    summary: work(`${id}.summary`),
    hubTitle: page("title"),
    from: entry.from,
    to: entry.to,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <PageHero
        width="narrow"
        title={work(`${id}.headline`)}
        description={work(`${id}.role`)}
        badge={`${company} · ${period}`}
        breadcrumb={<Breadcrumb currentLabel={company} />}
        actions={
          <Button href="/book" variant="primary" size="lg" data-placement="experience-detail-hero">
            {home("hero.bookCall")}
          </Button>
        }
      />
      <ExperienceDetail
        entry={entry}
        previous={workHistory[index - 1]}
        next={workHistory[index + 1]}
        others={workHistory.filter((other) => other.id !== id)}
      />
      <ExperienceClose />
    </>
  );
}
