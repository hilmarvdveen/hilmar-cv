"use client";
import { useTranslations } from "next-intl";
import {
  FolderOpen,
  Target,
  TrendingUp,
  Calendar,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export const ProjectsHero = () => {
  const t = useTranslations("projects");

  return (
    <section className="bg-[#12314e] text-gray-800 py-24 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Content */}
        <div>
          <p className="text-md text-gray-100 mb-2 tracking-widest uppercase">
            {t("hero.badge")}
          </p>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-300 mb-4 tracking-tight">
            {t("hero.title")}
          </h1>

          <p className="text-lg text-gray-300 mb-10 max-w-xl leading-relaxed">
            {t("hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Primary CTA */}
            <Link
              href="/book"
              className="group inline-flex items-center justify-center space-x-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 hover:shadow-xl hover:scale-105 text-base"
            >
              <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span>{t("showcase.cta.book")}</span>
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center space-x-2 px-6 py-3 border-2 border-emerald-600/50 text-emerald-400 font-medium rounded-lg hover:border-emerald-600 hover:bg-emerald-600/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 hover:shadow-lg"
            >
              <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span>{t("showcase.cta.contact")}</span>
            </Link>
          </div>
        </div>

        {/* Visual Element - Stats Cards */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-emerald-600/20">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-full mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold mb-2 text-gray-100">
                {t("hero.stats.projects")}
              </div>
              <div className="text-emerald-400 text-sm font-medium">
                {t("hero.stats.projectsLabel")}
              </div>
            </div>

            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-emerald-600/20">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold mb-2 text-gray-100">
                {t("hero.stats.impact")}
              </div>
              <div className="text-emerald-400 text-sm font-medium">
                {t("hero.stats.impactLabel")}
              </div>
            </div>

            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-emerald-600/20">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full mb-4">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold mb-2 text-gray-100">
                {t("hero.stats.industries")}
              </div>
              <div className="text-emerald-400 text-sm font-medium">
                {t("hero.stats.industriesLabel")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
