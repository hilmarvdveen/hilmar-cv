"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  Mail,
  FolderOpen,
  CheckCircle,
  TrendingUp,
  Wrench,
  Monitor,
  Server,
} from "lucide-react";

export const AboutSection = () => {
  const t = useTranslations("home");

  const tiles = [
    {
      icon: TrendingUp,
      title: t("about.tiles.businessImpact.title"),
      items: t.raw("about.tiles.businessImpact.items") as string[],
    },
    {
      icon: Wrench,
      title: t("about.tiles.structural.title"),
      items: t.raw("about.tiles.structural.items") as string[],
    },
    {
      icon: Monitor,
      title: t("about.tiles.frontend.title"),
      items: t.raw("about.tiles.frontend.items") as string[],
    },
    {
      icon: Server,
      title: t("about.tiles.backend.title"),
      items: t.raw("about.tiles.backend.items") as string[],
    },
  ];

  return (
    <section
      className="bg-white py-16 text-textMain"
      aria-labelledby="about-title"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Main content - centered intro */}
        <header className="text-center mb-16">
          <h2
            id="about-title"
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6"
          >
            {t("about.title")}
          </h2>

          <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
            {t("about.intro")}
          </p>

          <div className="max-w-4xl mx-auto space-y-6 text-base text-gray-700 leading-relaxed">
            <p>{t("about.summary.part1")}</p>
            <p>{t("about.summary.part2")}</p>
          </div>
        </header>
        <div className="text-center mb-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 hover:shadow-lg"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
              <span>{t("about.contact")}</span>
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 border border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-600 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <FolderOpen className="w-5 h-5" aria-hidden="true" />
              <span>{t("about.cta")}</span>
            </Link>
          </div>
        </div>

        {/* 4 Tiles - 2x2 grid */}
        <div
          className="grid md:grid-cols-2 gap-8 mb-12"
          role="region"
          aria-label="Key service areas"
        >
          {tiles.map((tile, index) => {
            const IconComponent = tile.icon;
            return (
              <article key={index} className="bg-gray-50 rounded-xl p-6">
                <header className="flex items-center mb-4">
                  <div
                    className="inline-flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-lg mr-3"
                    aria-hidden="true"
                  >
                    <IconComponent className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {tile.title}
                  </h3>
                </header>
                <ul className="space-y-3" role="list">
                  {tile.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <CheckCircle
                        className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-gray-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {/* Simple stats */}
        <aside
          className="bg-gray-50 rounded-xl p-8 mb-12"
          role="region"
          aria-label="Key statistics"
        >
          <dl className="grid grid-cols-3 gap-8 text-center">
            <div>
              <dt className="text-2xl font-bold text-emerald-600 mb-1">10+</dt>
              <dd className="text-sm text-gray-600">
                {t("about.stats.experience")}
              </dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-emerald-600 mb-1">50+</dt>
              <dd className="text-sm text-gray-600">
                {t("about.stats.projects")}
              </dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-emerald-600 mb-1">10+</dt>
              <dd className="text-sm text-gray-600">
                {t("about.stats.industries")}
              </dd>
            </div>
          </dl>
        </aside>

        {/* Clean CTA */}
        <footer className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 hover:shadow-lg"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
              <span>{t("about.contact")}</span>
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 border border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-600 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <FolderOpen className="w-5 h-5" aria-hidden="true" />
              <span>{t("about.cta")}</span>
            </Link>
          </div>
        </footer>
      </div>
    </section>
  );
};
