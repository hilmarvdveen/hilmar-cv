"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Mail, FolderOpen, Check } from "lucide-react";

export const AboutSection = () => {
  const t = useTranslations("home");

  const bulletPoints = t.raw("about.solutions") as string[];

  return (
    <section className="bg-white py-16 text-textMain">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 px-6 items-start">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 text-primary">
            {t("about.title")}
          </h2>

          <p className="text-lg text-textMuted leading-relaxed mb-6">
            {t("about.intro")}
          </p>

          <p className="text-base text-textMain leading-relaxed mb-8">
            {t("about.summary")}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center space-x-2 px-6 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 hover:shadow-lg hover:scale-105"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span>{t("about.contact")}</span>
            </Link>
            <Link
              href="/projects"
              className="group inline-flex items-center space-x-2 px-6 py-3 border border-sky-600 text-sky-600 font-medium rounded-lg hover:bg-sky-700 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-600 hover:shadow-lg hover:scale-105"
            >
              <FolderOpen className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span>{t("about.cta")}</span>
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-primary mb-6">
            {t("about.solutionsTitle")}
          </h3>
          <ul className="space-y-4 text-base text-textMain">
            {bulletPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5 group-hover:bg-emerald-200 transition-colors duration-200">
                  <Check
                    className="w-4 h-4 text-emerald-600"
                    strokeWidth={2.5}
                  />
                </div>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
