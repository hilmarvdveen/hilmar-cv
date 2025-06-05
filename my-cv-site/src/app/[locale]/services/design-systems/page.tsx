import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  Palette,
  ArrowRight,
  CheckCircle,
  Layers,
  Zap,
  Users,
  Globe,
  Calendar,
  Grid,
  Code,
  BookOpen,
  Sparkles,
  Workflow,
  RefreshCw,
  Target,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

interface DesignSystemsPageProps {
  params: Promise<{ locale: string }>;
}

interface TechItem {
  name: string;
  description: string;
  level: string;
}

interface TechCategory {
  name: string;
  items: TechItem[];
}

interface ProcessStep {
  title: string;
  description: string;
  details: string[];
}

interface Benefit {
  title: string;
  description: string;
}

interface Deliverable {
  title: string;
  description: string;
}

export async function generateMetadata({
  params,
}: DesignSystemsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "services.designSystems.meta",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function DesignSystemsPage({
  params,
}: DesignSystemsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "services.designSystems",
  });

  const technologies = t.raw("technologies.categories");
  const processes = t.raw("process.steps");
  const benefits = t.raw("benefits.items");
  const deliverables = t.raw("deliverables.items");
  const heroFeatures = t.raw("hero.features");

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-6">
              <Palette className="w-8 h-8 text-purple-300" />
              <span className="text-purple-300 font-medium">
                {t("hero.badge")}
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              {t("hero.title")}
              <br />
              <span className="text-purple-300">{t("hero.titleAccent")}</span>
            </h1>

            <p className="text-xl text-purple-100 mb-8 max-w-3xl leading-relaxed">
              {t("hero.description")}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {heroFeatures.map((feature: string, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  {index === 0 ? (
                    <Sparkles className="w-5 h-5 text-purple-300" />
                  ) : (
                    <Workflow className="w-5 h-5 text-purple-300" />
                  )}
                  <span className="text-purple-100">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/book"
                className="inline-flex items-center space-x-2 bg-white text-purple-700 px-8 py-4 rounded-lg font-bold hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Calendar className="w-5 h-5" />
                <span>{t("hero.cta.book")}</span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 border-2 border-purple-300 text-purple-300 px-8 py-4 rounded-lg font-bold hover:bg-purple-300 hover:text-purple-900 transition-all duration-300"
              >
                <span>{t("hero.cta.discuss")}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Breadcrumb />

      {/* What You Get */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t("deliverables.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("deliverables.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {deliverables.map((deliverable: Deliverable, index: number) => {
              const iconMap = [Palette, Grid, BookOpen, Code];
              const Icon = iconMap[index] || Grid;
              return (
                <div
                  key={deliverable.title}
                  className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {deliverable.title}
                  </h3>
                  <p className="text-gray-600">{deliverable.description}</p>
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit: Benefit, index: number) => {
              const iconMap = [Zap, Layers, RefreshCw, Users, Globe, BookOpen];
              const Icon = iconMap[index] || Zap;
              return (
                <div
                  key={benefit.title}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t("technologies.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("technologies.description")}
            </p>
          </div>

          <div className="space-y-12">
            {technologies.map((category: TechCategory) => (
              <div key={category.name}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-2 h-8 bg-purple-600 rounded-full mr-4"></div>
                  {category.name}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((tech: TechItem) => (
                    <div
                      key={tech.name}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-bold text-gray-900">
                          {tech.name}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tech.level === "Expert"
                              ? "bg-green-100 text-green-700"
                              : tech.level === "Advanced" ||
                                  tech.level === "Gevorderd"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {tech.level}
                        </span>
                      </div>
                      <p className="text-gray-600">{tech.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t("process.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("process.description")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {processes.map((process: ProcessStep, index: number) => {
              const iconMap = [Target, Grid, Code, Users];
              const Icon = iconMap[index] || Target;
              return (
                <div
                  key={process.title}
                  className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-purple-600 font-medium mb-1">
                        Step {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {process.title}
                      </h3>
                      <p className="text-gray-600">{process.description}</p>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {process.details.map((detail: string) => (
                      <li key={detail} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            {t("cta.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center space-x-2 bg-white text-purple-700 px-8 py-4 rounded-lg font-bold hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Calendar className="w-5 h-5" />
              <span>{t("cta.bookConsultation")}</span>
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center space-x-2 border-2 border-purple-300 text-purple-300 px-8 py-4 rounded-lg font-bold hover:bg-purple-300 hover:text-purple-900 transition-all duration-300"
            >
              <span>{t("cta.viewAllServices")}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
