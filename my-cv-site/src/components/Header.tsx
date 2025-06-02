"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");
    router.replace(newPath, { scroll: false });
    setIsLanguageOpen(false);
    setIsMobileMenuOpen(false);
  };

  const currentLocaleData = locales.find(
    (locale) => locale.code === currentLocale
  );

  return (
    <header className="sticky top-0 z-5000 w-full bg-white border-b border-gray-200">
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
                <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
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
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-1">
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
                    locale={currentLocale}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Mobile Language Switcher */}
              <div className="pt-3 mt-3 border-t border-gray-200">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Language
                </div>
                {locales.map((locale) => (
                  <button
                    key={locale.code}
                    onClick={() => changeLanguage(locale.code)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 text-sm text-left rounded-md transition-colors duration-200 ${
                      currentLocale === locale.code
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-base">{locale.flag}</span>
                    <span>{locale.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop */}
      {(isLanguageOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 bg-black/10 z-40"
          onClick={() => {
            setIsLanguageOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};
