"use client";

import { useTranslations } from "next-intl";
import { Code, Zap, Palette, Users, Calendar, Mail } from "lucide-react";
import Link from "next/link";

export const ServicesHero = () => {
  const t = useTranslations("services");

  const services = [
    {
      icon: Code,
      title: "Frontend Development",
      href: "/services/frontend",
    },
    {
      icon: Zap,
      title: "Full-Stack Development",
      href: "/services/fullstack",
    },
    {
      icon: Palette,
      title: "Design Systems",
      href: "/services/design-systems",
    },
    {
      icon: Users,
      title: "Technical Consulting",
      href: "/services/consulting",
    },
  ];

  return (
    <section className="bg-[#12314e] text-gray-800 py-24 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Content */}
        <div>
          <p className="text-md text-gray-100 mb-2 tracking-widest uppercase">
            {t("hero.badge")}
          </p>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-300 mb-4 tracking-tight">
            {t("hero.title")}
          </h1>

          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            {t("hero.description")}
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              {t("cta.book")}
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-600 text-emerald-400 rounded-lg font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-300 group"
            >
              <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              {t("cta.contact")}
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                href={service.href}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-gray-200 font-semibold group-hover:text-white transition-colors duration-300">
                    {service.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
