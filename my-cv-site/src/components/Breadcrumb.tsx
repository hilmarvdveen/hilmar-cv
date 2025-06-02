"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useTranslations } from "next-intl";

interface BreadcrumbItem {
  label: string;
  href?: string;
  translationKey?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const t = useTranslations("common");

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
      <Link
        href="/"
        className="flex items-center hover:text-emerald-600 transition-colors duration-200"
        title={t("nav.home")}
      >
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-emerald-600 transition-colors duration-200"
            >
              {item.translationKey ? t(item.translationKey) : item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium">
              {item.translationKey ? t(item.translationKey) : item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};
