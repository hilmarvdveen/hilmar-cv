import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { SearchPageContent, type SearchLocale } from "@/features/search";
import { PageHero } from "@/components/PageHero";
import { localizedAlternates, localizedOpenGraph } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "search" });
  const title = t("title");
  const description = t("description");
  return {
    title,
    description,
    alternates: localizedAlternates("search", locale),
    ...localizedOpenGraph("search", locale, title, description),
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "search" });
  const initialQuery = Array.isArray(q) ? (q[0] ?? "") : (q ?? "");
  const searchLocale: SearchLocale = locale === "nl" ? "nl" : "en";

  return (
    <>
      <PageHero title={t("title")} description={t("description")} />
      <SearchPageContent locale={searchLocale} initialQuery={initialQuery} />
    </>
  );
}
