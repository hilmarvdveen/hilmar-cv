"use client";

import { useTranslations } from "next-intl";

import { Icon } from "@/components/Icon";
import { Link } from "i18n/navigation";

export function AboutPageContent() {
  const t = useTranslations("about");

  const majorClients = [
    {
      name: "Belastingdienst",
      role: "Dutch Tax Authority",
      period: "2023-2024",
    },
    { name: "Postcode Loterij", role: "National Lottery", period: "2022-2023" },
    { name: "Ziggo", role: "Telecommunications", period: "2021-2022" },
    { name: "Omniplan", role: "Enterprise Software", period: "2020-2021" },
    { name: "Ortec", role: "Analytics Solutions", period: "2019-2020" },
  ];

  const strengthIcons = ["shipping", "mentorship", "award"] as const;

  return (
    <div className="bg-gray-50">
      {/* Hero Section - Using homepage color scheme */}
      <section className="bg-[#12314e] text-white py-24 sm:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6 text-gray-300">
              {t("title")}
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
            <div className="flex items-center justify-center space-x-6 text-gray-300">
              <div className="flex items-center space-x-2">
                <Icon name="location" className="w-5 h-5" />
                <span>Zandvoort, Netherlands</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="education" className="w-5 h-5" />
                <span>BSc Physics, University of Amsterdam</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Purpose & Introduction */}
          <div className="bg-white rounded-2xl p-8 mb-12 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t("purpose.title")}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {t("purpose.intro")}
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  <strong>{t("purpose.mission")}</strong>
                </p>

                <div className="space-y-3">
                  {t
                    .raw("purpose.features")
                    .map((feature: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Icon
                          name="award"
                          className="w-5 h-5 text-emerald-600"
                        />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {t("purpose.foundation.title")}
                </h3>
                <p className="text-gray-700 mb-4">
                  {t("purpose.foundation.description")}
                </p>
                <p className="text-gray-700">
                  <strong>{t("purpose.foundation.education")}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* What Makes Me Different */}
          <div className="bg-white rounded-2xl p-8 mb-12 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t("strengths.title")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {t.raw("strengths.items").map((item: any, index: number) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Icon
                      name={strengthIcons[index]}
                      className="w-5 h-5 mr-2 text-emerald-600"
                    />
                    {item.title}
                  </h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience with Major Clients */}
          <div className="bg-white rounded-2xl p-8 mb-12 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t("experience.title")}
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              {t("experience.intro")}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {majorClients.map((client, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-600">{client.role}</p>
                  <p className="text-xs text-gray-500 mt-1">{client.period}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t("experience.impact.title")}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {t("experience.impact.belastingdienst.title")}
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {t
                      .raw("experience.impact.belastingdienst.items")
                      .map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {t("experience.impact.postcodeloterij.title")}
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {t
                      .raw("experience.impact.postcodeloterij.items")
                      .map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Expertise */}
          <div className="bg-white rounded-2xl p-8 mb-12 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t("technical.title")}
            </h2>
            <p className="text-lg text-gray-700 mb-6">{t("technical.intro")}</p>

            <div className="grid md:grid-cols-4 gap-6">
              {t
                .raw("technical.categories")
                .map((category: any, index: number) => {
                  const iconNames = [
                    "code",
                    "database",
                    "cloud",
                    "architecture",
                  ] as const;
                  const colorClasses = [
                    "text-blue-600 bg-blue-50",
                    "text-emerald-600 bg-emerald-50",
                    "text-purple-600 bg-purple-50",
                    "text-orange-600 bg-orange-50",
                  ];

                  return (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Icon
                          name={iconNames[index]}
                          className={`w-5 h-5 mr-2 ${colorClasses[index].split(" ")[0]}`}
                        />
                        {category.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {category.technologies.map((tech: string) => (
                          <span
                            key={tech}
                            className={`text-xs px-2 py-1 rounded ${colorClasses[index]}`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Call to Action - Using emerald gradient like homepage */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
              {t("cta.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/book"
                className="group inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Icon name="calendar" className="w-5 h-5" />
                <span>{t("cta.consultation")}</span>
              </Link>

              <Link
                href="/contact"
                className="group inline-flex items-center justify-center space-x-2 px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-emerald-600 transition-all duration-300"
              >
                <Icon name="phone" className="w-5 h-5" />
                <span>{t("cta.contact")}</span>
              </Link>
            </div>

            <p className="text-emerald-100 mt-6 text-sm">{t("cta.features")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
