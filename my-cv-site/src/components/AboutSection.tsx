"use client";

import { useTranslation } from "next-i18next";
import Link from "next/link";

export const AboutSection = () => {
  const { t } = useTranslation("home");

  const bulletPoints = t("about.solutions", {
    returnObjects: true,
  }) as string[];

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

          <p className="text-base text-textMain leading-relaxed">
            {t("about.summary")}
          </p>

          <Link
            href="/contact"
            className="mt-6 w-full text-center md:w-auto inline-block px-6 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            {t("about.contact")}
          </Link>
          <Link
            href="/projects"
            className="mt-6 w-full text-center md:w-auto md:ml-4 inline-block px-6 py-3 border border-sky-600 text-sky-600 font-medium rounded-lg hover:bg-sky-700 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-sky-600"
          >
            {t("about.cta")}
          </Link>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-primary mb-4">
            {t("about.solutionsTitle")}
          </h3>
          <ul className="space-y-3 text-base text-textMain">
            {bulletPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1 align-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
