import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export const Header = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { locale, locales, pathname, asPath, query } = router;

  const switchLocale = (lng: string) => {
    router.push({ pathname, query }, asPath, { locale: lng });
  };

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-neutral-200 shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-blue-700">
          {t("home.name")}
        </Link>

        <ul className="flex gap-2 sm:gap-4 items-center text-sm font-medium text-gray-700">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
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
              value={locale}
              onChange={(e) => switchLocale(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
            >
              {locales?.map((lng) => (
                <option key={lng} value={lng}>
                  {lng.toUpperCase()}
                </option>
              ))}
            </select>
          </li>
        </ul>
      </nav>
    </header>
  );
};
