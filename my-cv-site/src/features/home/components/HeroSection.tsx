import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Calendar, Check } from "lucide-react";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { CvDownloadTrigger } from "./CvDownloadTrigger";
import { RampDevice } from "@/components/RampDevice";

export const HeroSection = () => {
  const t = useTranslations("home.hero");
  const locale = useLocale();
  const chips = t.raw("chips") as string[];

  return (
    <Section
      background="navy"
      className="py-12 sm:py-24"
      aria-labelledby="hero-heading"
    >
      <Container>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-center">
          <div className="md:col-span-2 flex flex-col">
            <p className="order-1 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 mb-4 sm:px-4 sm:py-2 sm:text-sm sm:mb-6">
              <span
                className="h-2 w-2 rounded-full bg-emerald-400"
                aria-hidden="true"
              />
              {t("badge")}
            </p>

            <p className="hidden text-base font-medium text-emerald-200 sm:order-2 sm:mb-3 sm:block sm:text-lg">
              {t("readerLine")}
            </p>

            <h1
              id="hero-heading"
              className="order-2 text-3xl sm:text-5xl font-extrabold leading-tight text-white mb-4 sm:mb-5 tracking-tight text-balance sm:order-3"
            >
              {t("heading")}
            </h1>

            <div className="order-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:order-5">
              <Button
                href="/book"
                variant="primary"
                size="lg"
                className="w-full px-4 text-[15px] sm:w-auto sm:px-8 sm:text-base"
                data-placement="hero"
              >
                <Calendar className="hidden w-5 h-5 sm:block group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
                <span>{t("bookCall")}</span>
              </Button>

              <CvDownloadTrigger label={t("downloadCv")} locale={locale} />
            </div>

            <p className="order-4 text-base sm:text-lg text-slate-300 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
              {t("description")}
            </p>

            <p className="order-5 text-sm text-slate-300 sm:order-6">{t("ctaNote")}</p>

            <p className="order-6 text-[13px] text-slate-400 sm:order-7">{t("credentials")}</p>
          </div>

          <div className="order-first flex items-center gap-4 md:order-none md:flex-col">
            <figure className="rounded-full overflow-hidden ring-2 ring-white/15 md:ring-4">
              <Image
                src="/images/profile.jpg"
                alt={t("imageAlt")}
                width={200}
                height={200}
                className="object-cover h-12 w-12 md:h-50 md:w-50"
                priority
              />
              <figcaption className="sr-only">{t("name")}</figcaption>
            </figure>
            <div className="text-left md:text-center">
              <p className="text-[15px] font-bold text-white">{t("name")}</p>
              <p className="text-[13px] text-slate-400">{t("role")}</p>
            </div>
            <RampDevice
              tone="onNavy"
              width={340}
              height={170}
              className="hidden md:block mt-6 w-full max-w-[340px] h-auto"
            />
          </div>
        </div>

        <ul className="mt-8 flex flex-wrap gap-2 sm:mt-10 sm:gap-3" aria-label={t("heading")}>
          {chips.map((chip) => (
            <li
              key={chip}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 sm:gap-2 sm:rounded-lg sm:px-4 sm:py-2.5 sm:text-[13.5px]"
            >
              <Check className="h-3.5 w-3.5 text-emerald-300 sm:h-4 sm:w-4" aria-hidden="true" />
              {chip}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
};
