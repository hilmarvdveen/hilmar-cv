"use client";

import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useMemo } from "react";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";

type BreadcrumbItem = {
  label: string;
  href: string;
  isLast: boolean;
};

const SEGMENT_LABEL_KEYS: Record<string, string> = {
  services: "services",
  frontend: "frontend",
  fullstack: "fullstack",
  "design-systems": "designSystems",
  consulting: "consulting",
  projects: "projects",
  about: "about",
  contact: "contact",
  book: "book",
  faq: "faq",
  privacy: "privacy",
  blog: "blog",
  experience: "experience",
  search: "search",
  terms: "terms",
  cookies: "cookies",
  disclaimer: "disclaimer",
  "freelance-frontend-developer": "regions",
};

const dehyphenate = (segment: string) =>
  segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

type BreadcrumbProps = {
  currentLabel?: string;
};

export const Breadcrumb = ({ currentLabel }: BreadcrumbProps = {}) => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("breadcrumb");

  const breadcrumbItems = useMemo(() => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    const segments = pathWithoutLocale.split("/").filter(Boolean);

    if (segments.length <= 1) {
      return [];
    }

    const items: BreadcrumbItem[] = [];

    items.push({
      label: t("home"),
      href: `/${locale}`,
      isLast: false,
    });

    let currentPath = `/${locale}`;

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      const labelKey = SEGMENT_LABEL_KEYS[segment];
      const resolvedLabel = labelKey ? t(labelKey) : dehyphenate(segment);
      const label = isLast && currentLabel ? currentLabel : resolvedLabel;

      items.push({
        label,
        href: currentPath,
        isLast,
      });
    });

    return items;
  }, [pathname, locale, t, currentLabel]);

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${BUSINESS_PROFILE.CONTACT.WEBSITE}${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav aria-label={t("label")} className="mb-8">
        <ol className="flex items-center gap-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
              )}

              {index === 0 && (
                <Home className="h-4 w-4 text-slate-400" aria-hidden="true" />
              )}

              {item.isLast ? (
                <span className="font-medium text-white" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="inline-flex min-h-6 items-center rounded-sm text-slate-300 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};
