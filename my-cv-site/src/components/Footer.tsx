import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";
import { Container } from "@/components/Container";
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
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";

export const Footer = () => {
  const t = useTranslations("footer");
  const commonTranslations = useTranslations("common");

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
    { name: t("quickLinks.items.experience"), href: "/experience" },
    { name: t("quickLinks.items.regions"), href: "/freelance-frontend-developer" },
    { name: t("quickLinks.items.projects"), href: "/projects" },
    { name: t("quickLinks.items.blog"), href: "/blog" },
    { name: t("quickLinks.items.faq"), href: "/faq" },
    { name: t("quickLinks.items.search"), href: "/search" },
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
      name: "LinkedIn",
      icon: Linkedin,
      href: BUSINESS_PROFILE.SOCIAL.LINKEDIN,
      color: "hover:text-emerald-400",
    },
    {
      name: "GitHub",
      icon: Github,
      href: BUSINESS_PROFILE.SOCIAL.GITHUB,
      color: "hover:text-emerald-400",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: BUSINESS_PROFILE.CONTACT.WHATSAPP,
      color: "hover:text-emerald-500",
    },
  ];

  return (
    <footer className="bg-brand-navy pb-[var(--consent-height,0px)] text-gray-300">
      <Container className="py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <Image
                src="/images/logo_v1.svg"
                alt={commonTranslations("images.logoAlt")}
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <div>
                <h2 className="font-bold text-white text-lg">
                  {t("about.name")}
                </h2>
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

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-6">
              {t("services.title")}
            </h2>
            <ul className="space-y-4">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <li key={service.name}>
                    <Link
                      href={service.href}
                      className="group flex min-h-6 items-center space-x-3 text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                    >
                      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span>{service.name}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-6">
              {t("quickLinks.title")}
            </h2>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="inline-block py-1 text-gray-400 hover:text-emerald-400 transition-colors duration-200 hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-6">
              {t("contact.title")}
            </h2>

            <div className="space-y-4 mb-8">
              <a
                href={`mailto:${BUSINESS_PROFILE.CONTACT.EMAIL}`}
                className="flex min-h-6 items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span>{BUSINESS_PROFILE.CONTACT.EMAIL}</span>
              </a>

              <a
                href={`tel:${BUSINESS_PROFILE.CONTACT.PHONE}`}
                className="flex min-h-6 items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Phone className="w-4 h-4" />
                <span>{BUSINESS_PROFILE.CONTACT.PHONE_DISPLAY}</span>
              </a>

              <a
                href={BUSINESS_PROFILE.CONTACT.WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                data-placement="footer-whatsapp"
                className="flex min-h-6 items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{commonTranslations("whatsapp")}</span>
              </a>
            </div>

            <div>
              <h3 className="font-medium text-white mb-4">
                {t("contact.social.title")}
              </h3>
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
      </Container>

      <div className="border-t border-gray-700">
        <Container className="py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} {t("about.name")}.{" "}
              {t("bottom.copyright")}
            </p>

            <nav aria-label={t("legal.title")}>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="inline-block rounded-sm py-1 text-gray-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Container>
      </div>
    </footer>
  );
};
