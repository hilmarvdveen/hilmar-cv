import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/Button";
import { RegionHub } from "@/features/regions";
import { REGIONS, REGION_PATH, engagementsOutsideRegions, regionEngagements, regionPath } from "@/data/regions";
import { localizedAlternates, localizedOpenGraph } from "@/lib/seo";
import { regionHubSchema } from "@/lib/seo/regionSchema";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "regions" });
  const title = t("hub.title");
  const description = t("hub.description");
  return {
    title,
    description,
    alternates: localizedAlternates(REGION_PATH, locale),
    ...localizedOpenGraph(REGION_PATH, locale, title, description),
  };
}

export default async function RegionHubPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "regions" });
  const home = await getTranslations({ locale, namespace: "home" });
  const breadcrumb = await getTranslations({ locale, namespace: "breadcrumb" });
  const engagementCounts = Object.fromEntries(REGIONS.map((region) => [region.id, regionEngagements(region).length]));
  const structuredData = regionHubSchema({
    locale: locale === "en" ? "en" : "nl",
    title: t("hub.title"),
    description: t("hub.description"),
    homeLabel: breadcrumb("home"),
    hubLabel: breadcrumb("regions"),
    hubPath: regionPath(),
    cities: REGIONS.map((region) => ({ id: region.id, name: t(`${region.id}.name`) })),
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <PageHero
        title={t("hub.heroTitle")}
        description={t("hub.heroDescription")}
        badge={t("shared.eyebrow")}
        breadcrumb={<Breadcrumb />}
        actions={
          <Button href="/book" variant="primary" size="lg" data-placement="region-hub-hero">
            {home("hero.bookCall")}
          </Button>
        }
      />
      <RegionHub regions={REGIONS} engagementCounts={engagementCounts} outside={engagementsOutsideRegions()} />
    </>
  );
}
