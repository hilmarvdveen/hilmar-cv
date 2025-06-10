import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ProjectsHero } from "@/components/ProjectsHero";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SEOFactory } from "@/lib/seo";
import type { Locale } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seoData = SEOFactory.projects(locale as Locale);
  return seoData.metadata;
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const seoData = SEOFactory.projects(locale as Locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: seoData.structuredData,
        }}
      />
      <main>
        <ProjectsHero />
        <Breadcrumb />
        <ProjectShowcase />
      </main>
    </>
  );
}
