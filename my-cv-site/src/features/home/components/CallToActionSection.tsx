"use client";
import { Button } from "@/components/Button";
import { ArrowRight, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

export const CallToActionSection = () => {
  const t = useTranslations("home.cta");

  return (
    <section className="py-16 bg-gradient-to-br from-sky-600 via-sky-700 to-blue-700 text-white text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
          {t("title")}
        </h2>
        <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            href="/book"
            variant="white"
            size="lg"
            className="text-sky-700 hover:bg-blue-50 rounded-xl"
          >
            <Calendar className="w-5 h-5" />
            <span>{t("button")}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          <Button
            href="/contact"
            variant="outlineOnDark"
            size="md"
            className="border-white text-white hover:bg-white hover:text-sky-700 hover:border-white focus-visible:ring-white rounded-xl"
          >
            <span>{t("buttonAlt")}</span>
          </Button>
        </div>
      </div>
    </section>
  );
};
