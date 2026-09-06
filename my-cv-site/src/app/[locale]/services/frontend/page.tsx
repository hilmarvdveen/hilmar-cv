import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Code, Eye, Search, Smartphone, Users, BarChart3, Zap, Palette } from "lucide-react";
import { ServiceDetailPage } from "@/features/services";
import type {
  ServiceEngagementDeliverable,
  ServiceProcessStep,
  ServiceTechnologyItem,
  ServiceTitledItem,
} from "@/features/services";
import { SEOFactory } from "@/lib/seo";
import type { Locale } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

const HERO_ICON = Code;
const BENEFIT_ICONS = [Smartphone, Zap, Eye, Search, Users, BarChart3];
const PROCESS_ICONS = [Search, Palette, Code, Zap];

const GRAPHQL_POST_HREF = "/blog/graphql-as-a-contract-between-frontend-and-backend";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seoData = SEOFactory.frontendService(locale as Locale);
  return seoData.metadata;
}

export default async function FrontendDevelopmentPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.frontend" });
  const tServices = await getTranslations({ locale, namespace: "services" });
  const seoData = SEOFactory.frontendService(locale as Locale);

  const technologyItems = t.raw("technologies.items") as ServiceTechnologyItem[];
  const processSteps = t.raw("process.steps") as Array<{
    title: string;
    description: string;
    details: string[];
  }>;
  const benefitItems = t.raw("benefits.items") as Array<{
    title: string;
    description: string;
  }>;
  const engagementDeliverables = t.raw(
    "engagement.deliverables"
  ) as ServiceEngagementDeliverable[];

  const bookLabel = tServices("cta.book");

  return (
    <ServiceDetailPage
      structuredData={seoData.structuredData}
      hero={{
        badge: t("hero.badge"),
        Icon: HERO_ICON,
        title: t("hero.title"),
        titleAccent: t("hero.titleAccent"),
        description: t("hero.description"),
        features: t.raw("hero.features") as string[],
        bookLabel,
        actionLabel: t("cta.action"),
      }}
      engagement={{
        title: t("engagement.title"),
        description: t("engagement.description"),
        deliverables: engagementDeliverables,
        terms: t.raw("engagement.terms") as string[],
        termsLabel: tServices("termsLabel"),
      }}
      benefits={{
        title: t("benefits.title"),
        description: t("benefits.description"),
        article: { href: GRAPHQL_POST_HREF, label: t("benefits.articleLabel") },
        items: benefitItems.map<ServiceTitledItem>((item, index) => ({
          ...item,
          Icon: BENEFIT_ICONS[index] ?? BENEFIT_ICONS[0],
        })),
      }}
      technologies={{
        title: t("technologies.title"),
        description: t("technologies.description"),
        groups: [{ items: technologyItems }],
      }}
      process={{
        title: t("process.title"),
        description: t("process.description"),
        steps: processSteps.map<ServiceProcessStep>((step, index) => ({
          ...step,
          Icon: PROCESS_ICONS[index] ?? PROCESS_ICONS[0],
        })),
      }}
      callToAction={{
        title: t("cta.title"),
        description: t("cta.description"),
        bookLabel,
        viewAllLabel: t("cta.viewAllServices"),
      }}
    />
  );
}
