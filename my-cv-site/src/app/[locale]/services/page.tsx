import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ServicesHero } from "@/components/ServicesHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Code,
  Palette,
  Users,
  Zap,
} from "lucide-react";
import { SEOFactory } from "@/lib/seo";
import type { Locale } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seoData = SEOFactory.services(locale as Locale);

  return seoData.metadata;
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  const seoData = SEOFactory.services(locale as Locale);

  const services = [
    {
      id: "frontend",
      title: t("main.services.frontend.title"),
      icon: Code,
      shortDescription: t("main.services.frontend.shortDescription"),
      fullDescription: t("main.services.frontend.fullDescription"),
      technologies: [
        "React",
        "Next.js",
        "Vue.js",
        "TypeScript",
        "Tailwind CSS",
        "Redux",
      ],
      benefits: t.raw("main.services.frontend.benefits.items") as string[],
      href: "/services/frontend",
      color: "bg-blue-500",
      accent: "text-blue-600",
    },
    {
      id: "fullstack",
      title: t("main.services.fullstack.title"),
      icon: Zap,
      shortDescription: t("main.services.fullstack.shortDescription"),
      fullDescription: t("main.services.fullstack.fullDescription"),
      technologies: [
        "Node.js",
        "Express",
        "PostgreSQL",
        "MongoDB",
        "AWS",
        "Docker",
      ],
      benefits: t.raw("main.services.fullstack.benefits.items") as string[],
      href: "/services/fullstack",
      color: "bg-emerald-500",
      accent: "text-emerald-600",
    },
    {
      id: "design-systems",
      title: t("main.services.designSystems.title"),
      icon: Palette,
      shortDescription: t("main.services.designSystems.shortDescription"),
      fullDescription: t("main.services.designSystems.fullDescription"),
      technologies: [
        "Storybook",
        "Figma",
        "React",
        "Styled Components",
        "Sass",
        "Design Tokens",
      ],
      benefits: t.raw("main.services.designSystems.benefits.items") as string[],
      href: "/services/design-systems",
      color: "bg-purple-500",
      accent: "text-purple-600",
    },
    {
      id: "consulting",
      title: t("main.services.consulting.title"),
      icon: Users,
      shortDescription: t("main.services.consulting.shortDescription"),
      fullDescription: t("main.services.consulting.fullDescription"),
      technologies: [
        "Architecture Review",
        "Performance Audit",
        "Code Review",
        "Team Training",
        "Process Optimization",
      ],
      benefits: t.raw("main.services.consulting.benefits.items") as string[],
      href: "/services/consulting",
      color: "bg-orange-500",
      accent: "text-orange-600",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: seoData.structuredData,
        }}
      />

      <div className="bg-gray-50">
        <ServicesHero />
        <Breadcrumb />
        {/* Services Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <header className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t("main.title")}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t("main.description")}
              </p>
            </header>

            <div className="grid lg:grid-cols-2 gap-8">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4 mb-6">
                      <div
                        className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {service.title}
                        </h3>
                        <p className="text-gray-600">
                          {service.shortDescription}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {service.fullDescription}
                    </p>

                    {/* Technologies */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {t("main.services.frontend.technologies.title")}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {t("main.services.frontend.benefits.title")}
                      </h4>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle
                              className={`w-4 h-4 ${service.accent}`}
                            />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={service.href}
                      className={`group inline-flex items-center space-x-2 ${service.accent} font-semibold hover:underline`}
                    >
                      <span>{t("main.learnMore")}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              {t("finalCta.title")}
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {t("finalCta.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center space-x-2 bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>{t("finalCta.bookConsultation")}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center space-x-2 border-2 border-emerald-600 text-emerald-400 px-8 py-4 rounded-lg font-bold hover:bg-emerald-600 hover:text-white transition-all duration-300"
              >
                <span>{t("finalCta.getInTouch")}</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
