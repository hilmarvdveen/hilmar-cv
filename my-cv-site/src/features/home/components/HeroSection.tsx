"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Download, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/Button";
import { useState } from "react";
import { CVDownloadModal } from "@/features/cv-download";
import { useParams } from "next/navigation";

export const HeroSection = () => {
  const t = useTranslations("home");
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const params = useParams();
  const locale = params.locale as string;

  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-[#12314e] text-gray-800 py-24 sm:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16 items-center">
        <div className="md:col-span-2">
          <p className="text-md text-gray-100 mb-2 tracking-widest uppercase">
            {t("hero.greeting")}
          </p>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-300 mb-4 tracking-tight"
          >
            {t("hero.title.first")}
            <br />
            {t("hero.title.second")}
            <br />
            <span className="text-emerald-600"> {t("hero.title.name")} </span>
          </h1>

          <p className="text-lg text-gray-300 mb-10 max-w-xl leading-relaxed">
            {t("hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Primary CTA - Book Me Now */}
            <Button href="/book" variant="primary" size="lg">
              <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span>Book Me Now</span>
            </Button>

            {/* Secondary Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button href="/contact" variant="outlineOnDark" size="md">
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span>Schedule a call</span>
              </Button>

              <Button
                variant="outlineOnDark"
                size="md"
                onClick={() => setIsCVModalOpen(true)}
              >
                <Download className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span>Download CV</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <figure className="rounded-2xl overflow-hidden shadow-lg bg-white p-2">
            <Image
              src="/images/profile.jpg"
              alt={t("hero.imageAlt")}
              width={250}
              height={250}
              className="rounded-xl object-cover"
              priority
            />
            <figcaption className="sr-only">{t("hero.name")}</figcaption>
          </figure>
        </div>
      </div>

      {/* CV Download Modal */}
      <CVDownloadModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
        locale={locale}
      />
    </section>
  );
};
