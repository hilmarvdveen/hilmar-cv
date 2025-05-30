"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Download, Calendar, Phone } from "lucide-react";

export const HeroSection = () => {
  const t = useTranslations("home");

  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-[#12314e] text-gray-800 py-24 sm:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
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
            <span className="text-emerald-600"> {t("hero.title.name")} </span>
          </h1>

          <p className="text-lg text-gray-300 mb-10 max-w-xl leading-relaxed">
            {t("hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Primary CTA - Book Me Now */}
            <Link
              href="/book"
              className="group inline-flex items-center justify-center space-x-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 hover:shadow-xl hover:scale-105 text-base"
            >
              <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span>Book Me Now</span>
            </Link>

            {/* Secondary Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center space-x-2 px-6 py-3 border-2 border-emerald-600/50 text-emerald-400 font-medium rounded-lg hover:border-emerald-600 hover:bg-emerald-600/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 hover:shadow-lg"
              >
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span>Schedule a call</span>
              </Link>

              <Link
                href="/cv/hilmar-van-der-veen.pdf"
                download
                className="group inline-flex items-center justify-center space-x-2 px-6 py-3 border-2 border-emerald-600/50 text-emerald-400 font-medium rounded-lg hover:border-emerald-600 hover:bg-emerald-600/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 hover:shadow-lg"
              >
                <Download className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span>Download CV</span>
              </Link>
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
    </section>
  );
};
