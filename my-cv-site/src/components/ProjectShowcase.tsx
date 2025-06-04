"use client";
import { useTranslations } from "next-intl";
import { Icon, IconName } from "./Icon";
import { Check, ArrowRight, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";

const iconNames: IconName[] = [
  "idea",
  "ai",
  "design",
  "integration",
  "mentorship",
  "scale",
];

export const ProjectShowcase = () => {
  const t = useTranslations("projects");

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
            {t("showcase.title")}
          </h2>
          <p className="text-lg text-textMuted max-w-3xl mx-auto">
            {t("showcase.description")}
          </p>
        </div>

        {/* Project Cases */}
        <div className="space-y-20">
          {iconNames.map((iconName, i) => (
            <div
              key={i}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? "lg:grid-flow-col-dense" : ""
              }`}
            >
              {/* Content */}
              <div className={i % 2 === 1 ? "lg:col-start-2" : ""}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl">
                    <Icon
                      name={iconName}
                      className="w-6 h-6 text-emerald-600"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary">
                    {t(`showcase.cases.${i}.title`)}
                  </h3>
                </div>

                <p className="text-lg text-textMuted mb-6 leading-relaxed">
                  {t(`showcase.cases.${i}.description`)}
                </p>

                {/* Challenge & Solution */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-primary mb-3">
                    {t("showcase.challengeTitle")}
                  </h4>
                  <p className="text-textMain mb-4">
                    {t(`showcase.cases.${i}.challenge`)}
                  </p>

                  <h4 className="text-lg font-semibold text-emerald-600 mb-3">
                    {t("showcase.solutionTitle")}
                  </h4>
                  <p className="text-textMain mb-6">
                    {t(`showcase.cases.${i}.solution`)}
                  </p>
                </div>

                {/* Key Results */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-primary mb-4">
                    {t("showcase.resultsTitle")}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {(t.raw(`showcase.cases.${i}.results`) as string[]).map(
                      (result, resultIndex) => (
                        <div
                          key={resultIndex}
                          className="flex items-start gap-3"
                        >
                          <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                            <Check
                              className="w-3 h-3 text-emerald-600"
                              strokeWidth={3}
                            />
                          </div>
                          <span className="text-sm text-textMain font-medium">
                            {result}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Business Impact */}
                <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100 mb-8">
                  <h4 className="text-lg font-semibold text-emerald-700 mb-3">
                    {t("showcase.businessImpact")}
                  </h4>
                  <p className="text-emerald-800 font-medium">
                    {t(`showcase.cases.${i}.impact`)}
                  </p>
                </div>

                {/* Technologies Used */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    {t("showcase.technologiesUsed")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(
                      t.raw(`showcase.cases.${i}.technologies`) as string[]
                    ).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/book"
                    className="group inline-flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-200 hover:scale-105"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>{t("showcase.actions.discuss")}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>

                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center space-x-2 px-6 py-3 border border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-600 hover:text-white transition-all duration-200"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>{t("showcase.actions.moreInfo")}</span>
                  </Link>
                </div>
              </div>

              {/* Visual Element */}
              <div className={`${i % 2 === 1 ? "lg:col-start-1" : ""}`}>
                <div className="relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl p-8 flex items-center justify-center">
                    <div className="text-center">
                      <Icon
                        name={iconName}
                        className="w-20 h-20 text-emerald-600 mx-auto mb-4"
                      />
                      <h4 className="text-xl font-bold text-primary mb-2">
                        {t(`showcase.cases.${i}.visualTitle`)}
                      </h4>
                      <p className="text-textMuted">
                        {t(`showcase.cases.${i}.visualSubtitle`)}
                      </p>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-500 rounded-full opacity-20"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-500 rounded-full opacity-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20 p-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl">
          <h3 className="text-2xl font-bold text-primary mb-4">
            {t("showcase.cta.title")}
          </h3>
          <p className="text-lg text-textMuted mb-6 max-w-2xl mx-auto">
            {t("showcase.cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-all duration-200 hover:scale-105"
            >
              <Calendar className="w-5 h-5" />
              <span>{t("showcase.cta.book")}</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 px-8 py-4 border border-emerald-600 text-emerald-600 font-bold rounded-lg hover:bg-emerald-600 hover:text-white transition-all duration-200"
            >
              <span>{t("showcase.cta.contact")}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
