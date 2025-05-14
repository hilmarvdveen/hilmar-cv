"use client";

import { useTranslation } from "next-i18next";
import Link from "next/link";

export const AboutSection = () => {
  const { t } = useTranslation("home");

  const paragraphs = t("about.body", { returnObjects: true }) as Array<string>;

  return (
    <section className="bg-white py-10 text-textMain">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 text-primary">
          {t("about.title")}
        </h2>

        <p className="text-lg text-textMuted mb-6">{t("about.intro")}</p>

        <div className="space-y-4 text-base text-textMain leading-relaxed mb-8">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        <Link
          href="/projects"
          className="inline-block px-6 py-3 bg-sky-200 text-white font-semibold rounded hover:brightness-110 transition focus:outline focus:ring-2 focus:ring-primary"
        >
          {t("about.cta")}
        </Link>
      </div>
    </section>
  );
};
