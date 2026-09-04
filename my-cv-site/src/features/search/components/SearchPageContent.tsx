"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { searchEntries, type SearchLocale } from "../searchIndex";

type SearchPageContentProps = {
  locale: SearchLocale;
  initialQuery?: string;
};

export function SearchPageContent({ locale, initialQuery = "" }: SearchPageContentProps) {
  const t = useTranslations("search");
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => searchEntries(query, locale), [query, locale]);

  return (
    <Section>
      <Container width="prose">
        <div className="relative mb-8">
          <Search
            className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="search"
            autoFocus
            autoComplete="off"
            aria-label={t("inputLabel")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("placeholder")}
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-500 rounded-xl text-gray-900 focus:border-emerald-500 focus:ring-0"
          />
        </div>

        <p className="text-sm text-gray-500 mb-4" aria-live="polite">
          {t("resultsCount", { count: results.length })}
        </p>

        {results.length === 0 ? (
          <p className="text-gray-600">{t("empty")}</p>
        ) : (
          <ul className="space-y-4">
            {results.map((entry) => (
              <li key={entry.href}>
                <Link href={entry.href} className="block">
                  <Card className="transition-colors hover:border-emerald-300 hover:bg-emerald-50">
                    <span className="block font-semibold text-textMain">
                      {entry.title[locale]}
                    </span>
                    <span className="block text-sm text-gray-600">
                      {entry.description[locale]}
                    </span>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
