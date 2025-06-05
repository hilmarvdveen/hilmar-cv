"use client";

import { useTranslations } from "next-intl";
import { Mail, MessageSquare, Phone, MapPin, Clock, Timer } from "lucide-react";
import Link from "next/link";

export const ContactHero = () => {
  const t = useTranslations("contact");

  return (
    <section
      className="bg-[#12314e] text-gray-800 py-24 sm:py-28"
      aria-labelledby="contact-hero-title"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Content */}
        <header>
          <p className="text-md text-gray-100 mb-2 tracking-widest uppercase">
            {t("hero.badge")}
          </p>

          <h1
            id="contact-hero-title"
            className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-300 mb-4 tracking-tight"
          >
            {t("hero.title")}
          </h1>

          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            {t("hero.description")}
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl group focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <MessageSquare
                className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                aria-hidden="true"
              />
              {t("cta.button")}
            </Link>

            <a
              href="mailto:hilmar@hilmarvanderveen.nl"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-600 text-emerald-400 rounded-lg font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Mail
                className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                aria-hidden="true"
              />
              hilmar@hilmarvanderveen.nl
            </a>
          </div>
        </header>

        {/* Contact Info Cards */}
        <aside
          className="space-y-6"
          role="region"
          aria-label="Contact information"
        >
          <article className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center">
              <Mail
                className="w-5 h-5 mr-2 text-emerald-400"
                aria-hidden="true"
              />
              {t("info.title")}
            </h2>

            <dl className="space-y-4 text-gray-300">
              <div className="flex items-center">
                <Mail
                  className="w-4 h-4 mr-3 text-emerald-400"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-sm text-gray-400">{t("info.email")}</dt>
                  <dd className="font-medium">
                    <a
                      href="mailto:hilmar@hilmarvanderveen.nl"
                      className="hover:text-emerald-400 transition-colors"
                    >
                      hilmar@hilmarvanderveen.nl
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-center">
                <Phone
                  className="w-4 h-4 mr-3 text-emerald-400"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-sm text-gray-400">{t("info.phone")}</dt>
                  <dd className="font-medium">
                    <a
                      href="tel:+31612345678"
                      className="hover:text-emerald-400 transition-colors"
                    >
                      +31 6 12345678
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin
                  className="w-4 h-4 mr-3 text-emerald-400"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-sm text-gray-400">
                    {t("info.location")}
                  </dt>
                  <dd className="font-medium">Netherlands</dd>
                </div>
              </div>
            </dl>
          </article>

          <article className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center">
              <Clock
                className="w-5 h-5 mr-2 text-emerald-400"
                aria-hidden="true"
              />
              {t("info.availability")}
            </h2>

            <dl className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <Clock
                  className="w-4 h-4 mr-3 text-emerald-400"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-sm text-gray-400">
                    {t("info.availability")}
                  </dt>
                  <dd className="font-medium">{t("info.availabilityText")}</dd>
                </div>
              </div>

              <div className="flex items-center">
                <Timer
                  className="w-4 h-4 mr-3 text-emerald-400"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-sm text-gray-400">
                    {t("info.response")}
                  </dt>
                  <dd className="font-medium">{t("info.responseText")}</dd>
                </div>
              </div>
            </dl>
          </article>
        </aside>
      </div>
    </section>
  );
};
