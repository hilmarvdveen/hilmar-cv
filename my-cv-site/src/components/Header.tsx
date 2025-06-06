"use client";

import { useTranslations, useLocale } from "next-intl";
import { useMemo, useState, useEffect } from "react";
import { Link, usePathname, useRouter } from "../../i18n/navigation";
import {
  Home,
  FolderOpen,
  Mail,
  ChevronDown,
  Menu,
  X,
  Calendar,
  Briefcase,
} from "lucide-react";
import Image from "next/image";

export const Header = () => {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isMobileMenuOpen]);

  const locales = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  ];

  const navItems = useMemo(
    () => [
      {
        href: "/",
        label: t("nav.home"),
        icon: Home,
        description: "Back to homepage",
      },
      {
        href: "/services",
        label: t("nav.services"),
        icon: Briefcase,
        description: "Services overview",
      },
      {
        href: "/projects",
        label: t("nav.projects"),
        icon: FolderOpen,
        description: "My work portfolio",
      },
      {
        href: "/book",
        label: "Book Me",
        icon: Calendar,
        description: "Start a project",
      },
      {
        href: "/contact",
        label: t("nav.contact"),
        icon: Mail,
        description: "Get in touch",
      },
    ],
    [t]
  );

  const changeLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsLanguageOpen(false);
    setIsMobileMenuOpen(false);
  };

  const currentLocaleData = locales.find(
    (locale) => locale.code === currentLocale
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <span className="w-14 h-14  rounded-lg flex items-center justify-center text-white">
                <Image
                  className="w-14 h-14"
                  src="/images/logo_v1.svg"
                  alt={t("images.logoAlt")}
                  width={56}
                  height={56}
                />
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {t("home.name")}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </Link>
                );
              })}

              {/* Desktop Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md transition-colors duration-200"
                >
                  <span className="text-base">{currentLocaleData?.flag}</span>
                  <span>{currentLocaleData?.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isLanguageOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isLanguageOpen && (
                  <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-[60]">
                    {locales.map((locale) => (
                      <button
                        key={locale.code}
                        onClick={() => changeLanguage(locale.code)}
                        className={`w-full flex items-center space-x-2 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors duration-150 ${
                          currentLocale === locale.code
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="text-base">{locale.flag}</span>
                        <span>{locale.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 text-gray-600 hover:text-gray-900 transition-colors duration-200 touch-manipulation"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/50 z-[60] lg:hidden transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
          onTouchEnd={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Drawer */}
        <div
          className={`
          fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-[70] lg:hidden
          transform transition-transform duration-300 ease-in-out shadow-2xl
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Image
                className="w-10 h-10"
                src="/images/logo_v1.svg"
                alt={t("images.logoAlt")}
                width={40}
                height={40}
              />
              <span className="text-lg font-semibold text-gray-900">
                {t("home.name")}
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 touch-manipulation"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-6 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === `/${currentLocale}` ||
                    pathname === `/${currentLocale}/`
                  : pathname === `/${currentLocale}${item.href}`;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-4 text-base font-medium rounded-lg transition-colors duration-200 touch-manipulation ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Language Switcher */}
          <div className="px-6 py-4 border-t border-gray-200 mt-4">
            <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Language
            </div>
            <div className="space-y-1">
              {locales.map((locale) => (
                <button
                  key={locale.code}
                  onClick={() => changeLanguage(locale.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-4 text-base text-left rounded-lg transition-colors duration-200 touch-manipulation ${
                    currentLocale === locale.code
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">{locale.flag}</span>
                  <span>{locale.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </>

      {/* Desktop Language Dropdown Backdrop */}
      {isLanguageOpen && (
        <div
          className="fixed inset-0 z-[45] hidden lg:block"
          onClick={() => setIsLanguageOpen(false)}
        />
      )}
    </>
  );
};
