import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  Zap,
  ArrowRight,
  CheckCircle,
  Database,
  Cloud,
  Shield,
  Layers,
  Globe,
  Server,
  Calendar,
  Cpu,
  Lock,
  Workflow,
  GitBranch,
} from "lucide-react";
import { SEOFactory } from "@/lib/seo";
import type { Locale } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seoData = SEOFactory.fullstackService(locale as Locale);
  return seoData.metadata;
}

export default async function FullStackSolutionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services.fullstack" });
  const seoData = SEOFactory.fullstackService(locale as Locale);

  const technologies = t.raw("technologies.categories") as Array<{
    name: string;
    items: Array<{
      name: string;
      description: string;
      level: string;
    }>;
  }>;

  const processes = t.raw("process.steps") as Array<{
    title: string;
    description: string;
    details: string[];
  }>;

  const benefits = t.raw("benefits.items") as Array<{
    title: string;
    description: string;
  }>;

  const benefitIcons = [Layers, Shield, Database, Workflow, Cloud, GitBranch];
  const processIcons = [Layers, Server, Globe, Cloud];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: seoData.structuredData,
        }}
      />

      <div className="bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-4xl">
              <div className="flex items-center space-x-3 mb-6">
                <Zap className="w-8 h-8 text-emerald-300" />
                <span className="text-emerald-300 font-medium">
                  {t("hero.badge")}
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
                {t("hero.title")}
                <br />
                <span className="text-emerald-300">
                  {t("hero.titleAccent")}
                </span>
              </h1>

              <p className="text-xl text-emerald-100 mb-8 max-w-3xl leading-relaxed">
                {t("hero.description")}
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {(t.raw("hero.features") as string[]).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {index === 0 ? (
                      <Cpu className="w-5 h-5 text-emerald-300" />
                    ) : (
                      <Lock className="w-5 h-5 text-emerald-300" />
                    )}
                    <span className="text-emerald-100">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/book"
                  className="inline-flex items-center space-x-2 bg-white text-emerald-700 px-8 py-4 rounded-lg font-bold hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{t("hero.cta.book")}</span>
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center space-x-2 border-2 border-emerald-300 text-emerald-300 px-8 py-4 rounded-lg font-bold hover:bg-emerald-300 hover:text-emerald-900 transition-all duration-300"
                >
                  <span>{t("hero.cta.discuss")}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Breadcrumb />

        {/* What I Deliver */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t("benefits.title")}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t("benefits.description")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefitIcons[index];
                return (
                  <div
                    key={benefit.title}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-emerald-600" />
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
              {technologies.map((category) => (
                <div key={category.name}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-2 h-8 bg-emerald-600 rounded-full mr-4"></div>
                    {category.name}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.items.map((tech) => (
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
              {processes.map((process, index) => {
                const Icon = processIcons[index];
                return (
                  <div
                    key={process.title}
                    className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-sm text-emerald-600 font-medium mb-1">
                          Step {index + 1}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {process.title}
                        </h3>
                        <p className="text-gray-600">{process.description}</p>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {process.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
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
        <section className="bg-emerald-900 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              {t("cta.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center space-x-2 bg-white text-emerald-700 px-8 py-4 rounded-lg font-bold hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Calendar className="w-5 h-5" />
                <span>{t("cta.bookConsultation")}</span>
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center justify-center space-x-2 border-2 border-emerald-300 text-emerald-300 px-8 py-4 rounded-lg font-bold hover:bg-emerald-300 hover:text-emerald-900 transition-all duration-300"
              >
                <span>{t("cta.viewAllServices")}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
