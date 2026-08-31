"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Download, Calendar, Check } from "lucide-react";
import { Button } from "@/components/Button";
import { useState } from "react";
import { CVDownloadModal } from "@/features/cv-download";
import { useParams } from "next/navigation";

export const HeroSection = () => {
  const t = useTranslations("home.hero");
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const params = useParams();
  const locale = params.locale as string;
  const chips = t.raw("chips") as string[];

  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-brand-navy py-20 sm:py-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 items-center">
          <div className="md:col-span-2">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 mb-6">
              <span
                className="h-2 w-2 rounded-full bg-emerald-400"
                aria-hidden="true"
              />
              {t("badge")}
            </p>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl font-extrabold leading-tight text-white mb-5 tracking-tight text-balance"
            >
              {t("heading")}
            </h1>

            <p className="text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
              {t("description")}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <Button href="/book" variant="primary" size="lg">
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span>{t("bookCall")}</span>
              </Button>

              <button
                type="button"
                onClick={() => setIsCVModalOpen(true)}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium underline underline-offset-4 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{t("downloadCv")}</span>
              </button>
            </div>

            <p className="text-[13px] text-slate-400">{t("credentials")}</p>
          </div>

          <div className="order-first flex flex-col items-center gap-4 md:order-none">
            <figure className="rounded-full overflow-hidden ring-4 ring-white/15">
              <Image
                src="/images/profile.jpg"
                alt={t("imageAlt")}
                width={200}
                height={200}
                className="object-cover h-28 w-28 md:h-50 md:w-50"
                priority
              />
              <figcaption className="sr-only">{t("name")}</figcaption>
            </figure>
            <div className="hidden text-center md:block">
              <p className="text-[15px] font-bold text-white">{t("name")}</p>
              <p className="text-[13px] text-slate-400">{t("role")}</p>
            </div>
          </div>
        </div>

        <ul className="mt-10 flex flex-wrap gap-3" aria-label={t("heading")}>
          {chips.map((chip) => (
            <li
              key={chip}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-[13.5px] font-semibold text-slate-200"
            >
              <Check className="w-4 h-4 text-emerald-300" aria-hidden="true" />
              {chip}
            </li>
          ))}
        </ul>
      </div>

      <CVDownloadModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
        locale={locale}
      />
    </section>
  );
};
