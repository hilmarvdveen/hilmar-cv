import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Zap, Layers, Shield, Database, Workflow, Cloud, GitBranch, Server, Globe } from "lucide-react";
import { ServiceDetailPage } from "@/features/services";
import type {
  ServiceEngagementDeliverable,
  ServiceProcessStep,
  ServiceTechnologyGroup,
  ServiceTitledItem,
} from "@/features/services";
import { SEOFactory } from "@/lib/seo";
import type { Locale } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

const HERO_ICON = Zap;
const BENEFIT_ICONS = [Layers, Shield, Database, Workflow, Cloud, GitBranch];
const PROCESS_ICONS = [Layers, Server, Globe, Cloud];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seoData = SEOFactory.fullstackService(locale as Locale);
  return seoData.metadata;
}

export default async function FullStackSolutionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services.fullstack" });
  const tServices = await getTranslations({ locale, namespace: "services" });
  const seoData = SEOFactory.fullstackService(locale as Locale);

  const technologyGroups = t.raw("technologies.categories") as ServiceTechnologyGroup[];
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
      }}
      benefits={{
        title: t("benefits.title"),
        description: t("benefits.description"),
        items: benefitItems.map<ServiceTitledItem>((item, index) => ({
          ...item,
          Icon: BENEFIT_ICONS[index] ?? BENEFIT_ICONS[0],
        })),
      }}
      technologies={{
        title: t("technologies.title"),
        description: t("technologies.description"),
        groups: technologyGroups,
      }}
      process={{
        title: t("process.title"),
        description: t("process.description"),
        steps: processSteps.map<ServiceProcessStep>((step, index) => ({
          ...step,
          label: tServices("processStep", { number: index + 1 }),
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
