"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { SectionTitle } from "./SectionTitle";
import Link from "next/link";
import {
  Calendar,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers,
  Rocket,
  Zap,
  Users,
  Code,
  BarChart3,
  CheckCircle,
} from "lucide-react";

const serviceIcons = [
  Layers, // Design consistency
  Rocket, // Platform building
  Zap, // Integration
  Users, // Team capacity
  Code, // Team mentoring
  BarChart3, // Automation/AI
];

export const UspSection = () => {
  const t = useTranslations("home");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="py-16 bg-bgLight text-textMain">
      <SectionTitle title={t("usp.title", { defaultValue: "Usp" })} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
        {serviceIcons.map((IconComponent, i) => {
          const isExpanded = expandedItems.includes(i);

          return (
            <div
              key={i}
              className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <IconComponent className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {t(`usp.items.${i}.title`)}
                  </h3>
                </div>

                <p className="text-gray-700 leading-relaxed text-sm">
                  {t(`usp.items.${i}.problem`)}
                </p>

                {/* Mobile expand/collapse button */}
                <button
                  onClick={() => toggleExpanded(i)}
                  className="md:hidden flex items-center justify-center w-full py-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <span className="text-sm font-medium mr-2">
                    {isExpanded
                      ? t("usp.collapse", { defaultValue: "Minder details" })
                      : t("usp.expand", { defaultValue: "Meer details" })}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Expandable content */}
              <div
                className={`px-6 flex-1 flex flex-col justify-between ${isExpanded ? "block" : "hidden md:flex"}`}
              >
                <div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {t(`usp.items.${i}.solution`)}
                  </p>

                  <p className="text-gray-700 leading-relaxed text-sm mt-4">
                    {t(`usp.items.${i}.result`)}
                  </p>
                </div>

                {/* Business Impact Box - Improved styling */}
                <div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 my-4">
                    <p className="text-xs font-medium uppercase text-gray-500 mb-2 tracking-widest">
                      {t("usp.businessImpact")}
                    </p>
                    <div className="space-y-2">
                      {Array.isArray(t.raw(`usp.items.${i}.impact`)) ? (
                        (t.raw(`usp.items.${i}.impact`) as string[]).map(
                          (impactItem: string, impactIndex: number) => (
                            <div
                              key={impactIndex}
                              className="flex items-start space-x-2"
                            >
                              <CheckCircle className="w-3 h-3 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-gray-700">
                                {impactItem}
                              </span>
                            </div>
                          )
                        )
                      ) : (
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-3 h-3 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-700">
                            {t(
                              `usp.items.${i}.impact` as `usp.items.${number}.impact`
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons - Improved responsiveness */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <Link
                      href="/book"
                      className="group inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:scale-105 text-sm w-full sm:w-auto"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{t("usp.actions.bookConsultation")}</span>
                    </Link>

                    <Link
                      href="/projects"
                      className="group inline-flex items-center justify-center space-x-2 px-4 py-2.5 border border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-600 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:scale-105 text-sm w-full sm:w-auto"
                    >
                      <span>{t("usp.actions.readMore")}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
