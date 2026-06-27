"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { searchEntries, type SearchLocale } from "../searchIndex";

type SearchPageContentProps = {
  locale: SearchLocale;
  initialQuery?: string;
};

export function SearchPageContent({ locale, initialQuery = "" }: SearchPageContentProps) {
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => searchEntries(query, locale), [query, locale]);
  const labels =
    locale === "nl"
      ? {
          heading: "Zoeken",
          placeholder: "Zoek op de site…",
          count: (n: number) => `${n} resultaten`,
          empty: "Geen resultaten gevonden.",
        }
      : {
          heading: "Search",
          placeholder: "Search the site…",
          count: (n: number) => `${n} results`,
          empty: "No results found.",
        };

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{labels.heading}</h1>

      <div className="relative mb-8">
        <Search
          className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
          aria-hidden="true"
        />
        <input
          type="search"
          autoFocus
          aria-label={labels.heading}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.placeholder}
          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-emerald-500 focus:ring-0"
        />
      </div>

      <p className="text-sm text-gray-500 mb-4" aria-live="polite">
        {labels.count(results.length)}
      </p>

      {results.length === 0 ? (
        <p className="text-gray-600">{labels.empty}</p>
      ) : (
        <ul className="space-y-4">
          {results.map((entry) => (
            <li key={entry.href}>
              <Link
                href={entry.href}
                className="block p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                <span className="block font-semibold text-gray-900">
                  {entry.title[locale]}
                </span>
                <span className="block text-sm text-gray-600">
                  {entry.description[locale]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
