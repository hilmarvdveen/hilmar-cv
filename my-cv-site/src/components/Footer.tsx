"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Code,
  Palette,
  Zap,
  Users,
  Github,
  Linkedin,
  Twitter,
  ArrowUpRight,
} from "lucide-react";

export const Footer = () => {
  const t = useTranslations("footer");

  const services = [
    {
      name: t("services.items.frontend"),
      icon: Code,
      href: "/services/frontend",
    },
    {
      name: t("services.items.fullstack"),
      icon: Zap,
      href: "/services/fullstack",
    },
    {
      name: t("services.items.designSystems"),
      icon: Palette,
      href: "/services/design-systems",
    },
    {
      name: t("services.items.consulting"),
      icon: Users,
      href: "/services/consulting",
    },
  ];

  const quickLinks = [
    { name: t("quickLinks.items.about"), href: "/about" },
    { name: t("quickLinks.items.projects"), href: "/projects" },
    { name: t("quickLinks.items.blog"), href: "/blog" },
    { name: t("quickLinks.items.faq"), href: "/faq" },
    { name: t("quickLinks.items.book"), href: "/book" },
    { name: t("quickLinks.items.contact"), href: "/contact" },
  ];

  const legalLinks = [
    { name: t("legal.items.privacy"), href: "/privacy" },
    { name: t("legal.items.terms"), href: "/terms" },
    { name: t("legal.items.cookies"), href: "/cookies" },
    { name: t("legal.items.disclaimer"), href: "/disclaimer" },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/hilmarvanderveen",
      color: "hover:text-gray-900",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://linkedin.com/in/hilmarvanderveen",
      color: "hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/hilmarvdv",
      color: "hover:text-blue-400",
    },
  ];

  return (
    <footer className="bg-[#12314e] text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">
                  {t("about.name")}
                </h3>
                <p className="text-emerald-400 text-sm">{t("about.title")}</p>
              </div>
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              {t("about.description")}
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{t("about.location")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{t("about.availability")}</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-6">
              {t("services.title")}
            </h4>
            <ul className="space-y-4">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <li key={service.name}>
                    <Link
                      href={service.href}
                      className="group flex items-center space-x-3 text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                    >
                      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span>{service.name}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8">
              <Link
                href="/book"
                className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-500 transition-all duration-200 hover:scale-105"
              >
                <Calendar className="w-4 h-4" />
                <span>{t("services.bookConsultation")}</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-6">
              {t("quickLinks.title")}
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h5 className="font-medium text-white mb-4">
                {t("legal.title")}
              </h5>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-500 hover:text-gray-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-6">
              {t("contact.title")}
            </h4>

            <div className="space-y-4 mb-8">
              <a
                href="mailto:hilmar@hilmarvanderveen.com"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span>hilmar@hilmarvanderveen.com</span>
              </a>

              <a
                href="tel:+31680149947"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Phone className="w-4 h-4" />
                <span>+31 6 8014 9947</span>
              </a>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-emerald-900/20 rounded-lg p-6 mb-8">
              <h5 className="font-medium text-white mb-2">
                {t("contact.newsletter.title")}
              </h5>
              <p className="text-gray-400 text-sm mb-4">
                {t("contact.newsletter.description")}
              </p>
              <form className="flex" suppressHydrationWarning={true}>
                <input
                  type="email"
                  name="newsletter-email"
                  placeholder={t("contact.newsletter.placeholder")}
                  className="flex-1 px-4 py-2 bg-white/10 border border-emerald-600/30 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                />
                <button
                  type="submit"
                  aria-label={t("contact.newsletter.subscribe")}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-r-lg hover:bg-emerald-500 transition-colors duration-200 flex items-center"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Social Links */}
            <div>
              <h5 className="font-medium text-white mb-4">
                {t("contact.social.title")}
              </h5>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 transition-all duration-200 hover:scale-110 ${social.color}`}
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {t("about.name")}.{" "}
              {t("bottom.copyright")}
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <span className="text-gray-500">{t("bottom.builtWith")}</span>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400">Next.js</span>
                <span className="text-gray-500">•</span>
                <span className="text-emerald-400">TypeScript</span>
                <span className="text-gray-500">•</span>
                <span className="text-emerald-400">Tailwind CSS</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>🇳🇱 {t("bottom.location.netherlands")}</span>
              <span>•</span>
              <span>🇪🇺 {t("bottom.location.euBased")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
