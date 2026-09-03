import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
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
      name: "LinkedIn",
      icon: Linkedin,
      href: BUSINESS_PROFILE.SOCIAL.LINKEDIN,
      color: "hover:text-blue-600",
    },
    {
      name: "GitHub",
      icon: Github,
      href: BUSINESS_PROFILE.SOCIAL.GITHUB,
      color: "hover:text-gray-900",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: BUSINESS_PROFILE.CONTACT.WHATSAPP,
      color: "hover:text-emerald-500",
    },
  ];

  return (
    <footer className="bg-brand-navy text-gray-300">
      <Container className="py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
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
            <h2 className="font-semibold text-white mb-6">
              {t("services.title")}
            </h2>
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
                className="inline-flex items-center space-x-2 bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-800 transition-all duration-200 hover:scale-105"
              >
                <Calendar className="w-4 h-4" />
                <span>{t("services.bookConsultation")}</span>
              </Link>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-white mb-6">
              {t("quickLinks.title")}
            </h2>
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

          </div>

          <div>
            <h2 className="font-semibold text-white mb-6">
              {t("contact.title")}
            </h2>

            <div className="space-y-4 mb-8">
              <a
                href={`mailto:${BUSINESS_PROFILE.CONTACT.EMAIL}`}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span>{BUSINESS_PROFILE.CONTACT.EMAIL}</span>
              </a>

              <a
                href={`tel:${BUSINESS_PROFILE.CONTACT.PHONE}`}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Phone className="w-4 h-4" />
                <span>{BUSINESS_PROFILE.CONTACT.PHONE_DISPLAY}</span>
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
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col items-center gap-2 text-sm text-gray-400 md:flex-row md:gap-4">
              <div>
                © {new Date().getFullYear()} {t("about.name")}.{" "}
                {t("bottom.copyright")}
              </div>

              <nav aria-label={t("legal.title")}>
                <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                  {legalLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <span className="text-gray-400">{t("bottom.builtWith")}</span>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400">Next.js</span>
                <span className="text-gray-400">•</span>
                <span className="text-emerald-400">TypeScript</span>
                <span className="text-gray-400">•</span>
                <span className="text-emerald-400">Tailwind CSS</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>{t("bottom.location.netherlands")}</span>
              <span>•</span>
              <span>{t("bottom.location.euBased")}</span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
