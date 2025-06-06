"use client";

import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useMemo } from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

export const Breadcrumb = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("breadcrumb");

  const breadcrumbItems = useMemo(() => {
    // Remove locale from pathname for processing
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

    // Split path into segments
    const segments = pathWithoutLocale.split("/").filter(Boolean);

    // If no segments or only one segment, don't show breadcrumb
    if (segments.length <= 1) {
      return [];
    }

    const items: BreadcrumbItem[] = [];

    // Add home
    items.push({
      label: t("home"),
      href: `/${locale}`,
      isLast: false,
    });

    // Build breadcrumb items from segments
    let currentPath = `/${locale}`;

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      // Get label based on segment
      let label = segment;

      // Map common segments to translated labels
      switch (segment) {
        case "services":
          label = t("services");
          break;
        case "frontend":
          label = t("frontend");
          break;
        case "backend":
          label = t("backend");
          break;
        case "fullstack":
          label = t("fullstack");
          break;
        case "design-systems":
          label = t("designSystems");
          break;
        case "consulting":
          label = t("consulting");
          break;
        case "projects":
          label = t("projects");
          break;
        case "about":
          label = t("about");
          break;
        case "contact":
          label = t("contact");
          break;
        case "book":
          label = t("book");
          break;
        case "faq":
          label = t("faq");
          break;
        case "privacy":
          label = t("privacy");
          break;
        case "blog":
          label = t("blog");
          break;
        default:
          // Capitalize first letter and replace hyphens with spaces
          label =
            segment.charAt(0).toUpperCase() +
            segment.slice(1).replace(/-/g, " ");
      }

      items.push({
        label,
        href: currentPath,
        isLast,
      });
    });

    return items;
  }, [pathname, locale, t]);

  // Don't render if no breadcrumb items or only one level deep
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  // Generate JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `https://hilmarvanderveen.com${item.href}`,
    })),
  };

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumb Navigation */}
      <nav
        className="bg-gray-50 py-4 border-b border-gray-200"
        aria-label="Breadcrumb"
      >
        <div className="max-w-7xl mx-auto px-6">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbItems.map((item, index) => (
              <li key={item.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                )}

                {index === 0 && <Home className="w-4 h-4 text-gray-500 mr-1" />}

                {item.isLast ? (
                  <span
                    className="text-gray-900 font-medium"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
};
