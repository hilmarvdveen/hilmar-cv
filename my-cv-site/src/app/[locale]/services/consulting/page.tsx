import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Users, BookOpen, Target, Settings, Brain, Zap, Shield, TrendingUp, Award, BarChart3, Search } from "lucide-react";
import { ServiceDetailPage } from "@/features/services";
import type {
  ServiceEngagementDeliverable,
  ServiceProcessStep,
  ServiceTitledItem,
} from "@/features/services";
import { SEOFactory } from "@/lib/seo";
import type { Locale } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

const HERO_ICON = Users;
const DELIVERABLE_ICONS = [BookOpen, Target, Settings, Users];
const BENEFIT_ICONS = [Brain, Zap, Shield, TrendingUp, Award, BarChart3];
const PROCESS_ICONS = [Search, Target, Settings, TrendingUp];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seoData = SEOFactory.consultingService(locale as Locale);
  return seoData.metadata;
}

export default async function TechnicalConsultingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.consulting" });
  const tServices = await getTranslations({ locale, namespace: "services" });
  const seoData = SEOFactory.consultingService(locale as Locale);

  const processSteps = t.raw("process.steps") as Array<{
    title: string;
    description: string;
    details: string[];
  }>;
  const benefitItems = t.raw("benefits.items") as Array<{
    title: string;
    description: string;
  }>;
  const deliverableItems = t.raw("deliverables.items") as Array<{
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
      deliverables={{
        title: t("deliverables.title"),
        description: t("deliverables.description"),
        items: deliverableItems.map<ServiceTitledItem>((item, index) => ({
          ...item,
          Icon: DELIVERABLE_ICONS[index] ?? DELIVERABLE_ICONS[0],
        })),
      }}
      benefits={{
        title: t("benefits.title"),
        description: t("benefits.description"),
        items: benefitItems.map<ServiceTitledItem>((item, index) => ({
          ...item,
          Icon: BENEFIT_ICONS[index] ?? BENEFIT_ICONS[0],
        })),
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
