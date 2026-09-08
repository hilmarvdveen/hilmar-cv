import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalDocument, getLegalDoc } from "@/features/legal";
import { brandedTitle, localizedAlternates, localizedOpenGraph } from "@/lib/seo";
import { legalPageSchema } from "@/lib/seo/legalSchema";

const SLUG = "disclaimer" as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const doc = getLegalDoc(SLUG, locale);
  const description = doc.metaDescription;
  return {
    title: brandedTitle(doc.title),
    description,
    alternates: localizedAlternates(SLUG, locale),
    ...localizedOpenGraph(SLUG, locale, doc.title, description),
  };
}

export default async function DisclaimerPage({ params }: Props) {
  const { locale } = await params;
  const doc = getLegalDoc(SLUG, locale);
  const t = await getTranslations({ locale, namespace: "legal" });
  const breadcrumb = await getTranslations({ locale, namespace: "breadcrumb" });
  const structuredData = legalPageSchema({
    locale: locale === "en" ? "en" : "nl",
    slug: SLUG,
    title: doc.title,
    description: doc.metaDescription,
    homeLabel: breadcrumb("home"),
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <LegalDocument doc={doc} lastUpdatedLabel={t("lastUpdated")} />
    </>
  );
}
