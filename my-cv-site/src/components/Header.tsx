"use client";

import { useTranslations, useLocale } from "next-intl";
import { useMemo, useState, useEffect, useRef } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  Home,
  FolderOpen,
  Mail,
  ChevronDown,
  Menu,
  X,
  Calendar,
  Briefcase,
  BookOpen,
} from "lucide-react";
import Image from "next/image";
import { Flag } from "@/components/Flag";
import { Button } from "@/components/Button";

export const Header = () => {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const applyMeasuredHeight = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${header.getBoundingClientRect().height}px`
      );
    };
    applyMeasuredHeight();
    const observer = new ResizeObserver(applyMeasuredHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }

    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isMobileMenuOpen]);

  const locales = [
    { code: "en", label: "English" },
    { code: "nl", label: "Nederlands" },
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
        href: "/experience",
        label: t("nav.experience"),
        icon: FolderOpen,
        description: "Full work history",
      },
      {
        href: "/projects",
        label: t("nav.projects"),
        icon: FolderOpen,
        description: "My work portfolio",
      },
      {
        href: "/blog",
        label: t("nav.blog"),
        icon: BookOpen,
        description: "Articles & insights",
      },
      {
        href: "/book",
        label: t("nav.book"),
        icon: Calendar,
        description: "Book an intro call",
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

  const desktopNavItems = navItems.filter(
    (item) => item.href !== "/" && item.href !== "/book"
  );

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <Image
                className="h-10 w-10 lg:h-12 lg:w-12"
                src="/images/logo_v1.svg"
                alt={t("images.logoAlt")}
                width={56}
                height={56}
              />
              <span className="hidden text-lg font-semibold text-gray-900 whitespace-nowrap sm:inline">
                {t("home.name")}
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1 xl:gap-3 ml-8">
              {desktopNavItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative rounded-md px-3 py-2 text-[15px] font-medium whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                      isActive
                        ? "text-textMain"
                        : "text-gray-600 hover:text-textMain"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary" />
                    )}
                  </Link>
                );
              })}

              <Button href="/book" variant="primary" size="sm" className="ml-4">
                <Calendar className="w-4 h-4" />
                <span>{t("nav.book")}</span>
              </Button>

              <div className="relative ml-4">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex items-center space-x-2 lg:px-2.5 xl:px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                  aria-label={currentLocaleData?.label}
                >
                  <Flag code={currentLocale} className="w-5 h-3.5 rounded-sm flex-shrink-0" />
                  <span className="hidden xl:inline">{currentLocaleData?.label}</span>
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
                            ? "text-primary bg-emerald-50"
                            : "text-gray-700"
                        }`}
                      >
                        <Flag code={locale.code} className="w-5 h-3.5 rounded-sm" />
                        <span>{locale.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 lg:hidden">
              <Button href="/book" variant="primary" size="sm" className="px-3 whitespace-nowrap">
                <Calendar className="hidden h-4 w-4 min-[400px]:block" />
                <span>{t("nav.book")}</span>
              </Button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-md p-3 text-gray-600 hover:text-gray-900 transition-colors duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                aria-label={isMobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <>
        <div
          className={`fixed inset-0 bg-black/50 z-[60] lg:hidden transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
          onTouchEnd={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={`
          fixed top-0 right-0 h-dvh w-80 max-w-[85vw] overflow-y-auto overscroll-contain bg-white z-[70] lg:hidden
          transform transition-transform duration-300 ease-in-out shadow-2xl
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
        >
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
              className="rounded-md p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              aria-label={t("nav.closeMenu")}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-4 text-base font-medium rounded-lg transition-colors duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-inset ${
                    isActive
                      ? "text-primary bg-emerald-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 mt-4">
            <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("nav.language")}
            </div>
            <div className="space-y-1">
              {locales.map((locale) => (
                <button
                  key={locale.code}
                  onClick={() => changeLanguage(locale.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-4 text-base text-left rounded-lg transition-colors duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-inset ${
                    currentLocale === locale.code
                      ? "text-primary bg-emerald-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100"
                  }`}
                >
                  <Flag code={locale.code} className="w-6 h-4 rounded-sm" />
                  <span>{locale.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </>

      {isLanguageOpen && (
        <div
          className="fixed inset-0 z-[45] hidden lg:block"
          onClick={() => setIsLanguageOpen(false)}
        />
      )}
    </>
  );
};
