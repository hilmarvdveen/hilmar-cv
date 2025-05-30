"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

export const CallToActionSection = () => {
  const t = useTranslations("home");

  return (
    <section className="py-16 bg-gradient-to-br from-sky-600 via-sky-700 to-blue-700 text-white text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
          {t("cta.title", { defaultValue: "Klaar om samen te bouwen?" })}
        </h2>
        <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
          {t("cta.subtitle", {
            defaultValue:
              "Neem contact op en ontdek hoe ik jouw frontend naar het volgende niveau kan tillen.",
          })}
        </p>
        <Link
          href="/contact"
          className="group inline-flex items-center space-x-2 px-8 py-4 bg-white text-sky-700 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <span>
            {t("cta.button", { defaultValue: "Plan een kennismaking" })}
          </span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </section>
  );
};
