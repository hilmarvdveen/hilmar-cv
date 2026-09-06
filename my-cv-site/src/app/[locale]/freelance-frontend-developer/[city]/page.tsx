import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/Button";
import { Link } from "@/i18n/navigation";
import { RegionPage } from "@/features/regions";
import { workHistory } from "@/data/workHistory";
import {
  REGION_PATH,
  otherRegions,
  regionById,
  regionEngagements,
  regionNearbyEngagements,
  regionPath,
  regionSectorEngagements,
} from "@/data/regions";
import { getPostBySlug } from "@/features/blog";
import { localizedAlternates, localizedOpenGraph } from "@/lib/seo";
import { regionPageSchema } from "@/lib/seo/regionSchema";

type Props = {
  params: Promise<{ locale: string; city: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city } = await params;
  const region = regionById(city);
  if (!region) return {};
  const t = await getTranslations({ locale, namespace: "regions" });
  const count = regionEngagements(region).length;
  const title = t(`${region.id}.title`);
  const description = t(`${region.id}.description`, { count });
  const path = `${REGION_PATH}/${region.id}`;
  return {
    title,
    description,
    alternates: localizedAlternates(path, locale),
    ...localizedOpenGraph(path, locale, title, description),
  };
}

export default async function RegionCityPage({ params }: Props) {
  const { locale, city } = await params;
  const region = regionById(city);
  if (!region) notFound();
  const t = await getTranslations({ locale, namespace: "regions" });
  const home = await getTranslations({ locale, namespace: "home" });
  const breadcrumb = await getTranslations({ locale, namespace: "breadcrumb" });
  const engagements = regionEngagements(region);
  const count = engagements.length;
  const total = workHistory.length;
  const posts = region.postSlugs.flatMap((slug) => {
    const post = getPostBySlug(slug);
    return post ? [post] : [];
  });
  const structuredData = regionPageSchema({
    locale: locale === "en" ? "en" : "nl",
    title: t(`${region.id}.title`),
    description: t(`${region.id}.description`, { count }),
    homeLabel: breadcrumb("home"),
    hubLabel: breadcrumb("regions"),
    hubPath: regionPath(),
    city: { id: region.id, name: t(`${region.id}.name`) },
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <PageHero
        title={t(`${region.id}.heroTitle`)}
        description={t(`${region.id}.heroDescription`, { count, total })}
        badge={t("shared.eyebrow")}
        breadcrumb={<Breadcrumb currentLabel={t(`${region.id}.name`)} />}
        actions={
          <>
            <Button href="/book" variant="primary" size="lg" data-placement={`region-${region.id}-hero`}>
              {home("hero.bookCall")}
            </Button>
            <Link
              href="/contact"
              className="inline-flex min-h-6 items-center rounded-md text-sm font-semibold text-slate-300 underline underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
            >
              {home("close.alternative")}
            </Link>
          </>
        }
      />
      <RegionPage
        region={region}
        locale={locale === "en" ? "en" : "nl"}
        engagements={engagements}
        nearby={regionNearbyEngagements(region)}
        sector={regionSectorEngagements(region)}
        posts={posts}
        siblings={otherRegions(region)}
        totalEngagements={total}
      />
    </>
  );
}
