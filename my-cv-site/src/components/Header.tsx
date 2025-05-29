"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

export const Header = () => {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const locales = ["en", "nl"];

  const navItems = useMemo(
    () => [
      { href: "/", label: t("nav.home") },
      { href: "/projects", label: t("nav.projects") },
      { href: "/contact", label: t("nav.contact") },
    ],
    [t]
  );

  const changeLanguage = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");
    router.replace(newPath);
  };
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-neutral-200 shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-blue-700">
          {t("home.name")}
        </Link>

        <ul className="flex gap-2 sm:gap-4 items-center text-sm font-medium text-gray-700">
          {navItems.map((item) => {
            const isActive = pathname === `/${currentLocale}${item.href}`;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  locale={currentLocale}
                  className={`px-3 py-2 rounded transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}

          <li>
            <select
              value={currentLocale}
              onChange={(e) => changeLanguage(e.target.value)}
              className="ml-4 cursor-pointer"
            >
              {locales.map((locale) => (
                <option key={locale} value={locale}>
                  {locale.toUpperCase()}
                </option>
              ))}
            </select>
          </li>
        </ul>
      </nav>
    </header>
  );
};
