"use client";
import { useTranslations } from "next-intl";
import { SectionTitle } from "./SectionTitle";
import { Icon, IconName } from "./Icon";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

const iconNames: IconName[] = [
  "idea",
  "ai",
  "design",
  "integration",
  "mentorship",
  "scale",
];

export const UspSection = () => {
  const t = useTranslations("home");

  return (
    <section className="py-16 bg-bgLight text-textMain">
      <SectionTitle title={t("usp.title", { defaultValue: "Usp" })} />
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
        {iconNames.map((iconName, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <Icon name={iconName} className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-semibold text-primary">
                {t(`usp.items.${i}.title`)}
              </h3>
            </div>

            <p className="text-textMuted leading-relaxed mb-6 flex-grow">
              {t(`usp.items.${i}.description`)}
            </p>

            {/* Business Impact */}
            <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <h4 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                {t("usp.businessImpact")}
              </h4>
              <p className="text-emerald-800 text-sm font-medium leading-relaxed">
                {t(`usp.items.${i}.impact`)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <Link
                href="/book"
                className="group inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:scale-105 text-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>{t("usp.actions.bookConsultation")}</span>
              </Link>

              <Link
                href="/projects"
                className="group inline-flex items-center justify-center space-x-2 px-4 py-2.5 border border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-600 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:scale-105 text-sm"
              >
                <span>{t("usp.actions.readMore")}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
