import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SearchPageContent, type SearchLocale } from "@/features/search";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isNl = locale === "nl";
  return {
    title: isNl ? "Zoeken" : "Search",
    description: isNl
      ? "Zoek op hilmarvanderveen.com."
      : "Search hilmarvanderveen.com.",
    // Search results pages should not be indexed.
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);

  const initialQuery = Array.isArray(q) ? (q[0] ?? "") : (q ?? "");
  const searchLocale: SearchLocale = locale === "nl" ? "nl" : "en";

  return <SearchPageContent locale={searchLocale} initialQuery={initialQuery} />;
}
