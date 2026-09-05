import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { SearchPageContent, type SearchEntry, type SearchLocale } from "@/features/search";
import { BLOG_POSTS } from "@/features/blog";
import { workHistory } from "@/data/workHistory";
import { PageHero } from "@/components/PageHero";
import { localizedAlternates, localizedOpenGraph } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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
  const rawQuery = (await searchParams)["q"];
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "search" });
  const work = await getTranslations({ locale, namespace: "work" });
  const initialQuery = Array.isArray(rawQuery) ? (rawQuery[0] ?? "") : (rawQuery ?? "");
  const searchLocale: SearchLocale = locale === "nl" ? "nl" : "en";

  const blogEntries: SearchEntry[] = BLOG_POSTS.map((post) => ({
    href: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    keywords: [...post.keywords, "blog"],
  }));
  const engagementEntries: SearchEntry[] = workHistory.map((entry) => {
    const summary = work(`${entry.id}.summary`);
    const role = work(`${entry.id}.role`);
    return {
      href: `/experience#experience-${entry.id}`,
      title: { en: entry.company, nl: entry.company },
      description: { en: `${role}. ${summary}`, nl: `${role}. ${summary}` },
      keywords: [entry.id, entry.location, ...entry.tech.map((tech) => tech.replace("tech.", ""))],
    };
  });

  return (
    <>
      <PageHero title={t("title")} description={t("description")} />
      <SearchPageContent
        locale={searchLocale}
        initialQuery={initialQuery}
        extraEntries={[...engagementEntries, ...blogEntries]}
      />
    </>
  );
}
