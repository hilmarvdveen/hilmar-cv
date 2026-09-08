"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Briefcase, Globe, MapPin, Home, Calendar, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { workHistory, WorkMode } from "@/data/workHistory";
import { formatMonthYear } from "@/lib/workPeriod";
import {
  MAP_VIEWBOX,
  workCities,
  workCitiesInProvince,
  type CityLocation,
} from "../netherlandsMapData";
import { useNetherlandsMapDrawing } from "../hooks/useNetherlandsMapDrawing";
import { regionForCity, regionPath } from "@/data/regions";
import { Link } from "@/i18n/navigation";

type MapSelection =
  | { kind: "city"; city: CityLocation }
  | { kind: "province"; name: string }
  | null;

const cityChipClassName = (selected: boolean) =>
  `inline-flex h-10 items-center whitespace-nowrap rounded-full border px-3.5 text-sm font-semibold transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
    selected
      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
      : "border-gray-300 bg-white text-textMain hover:border-emerald-600"
  }`;

export const NetherlandsMap = () => {
  const t = useTranslations("about.map");
  const locale = useLocale();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selection, setSelection] = useState<MapSelection>(null);
  const selectedCity = selection?.kind === "city" ? selection.city : null;
  const selectedProvince = selection?.kind === "province" ? selection.name : null;

  const selectCity = useCallback((city: CityLocation) => {
    setSelection({ kind: "city", city });
  }, []);

  const selectProvince = useCallback((province: string) => {
    setSelection({ kind: "province", name: province });
  }, []);

  const labels = useMemo(
    () => ({
      company: t("legend.company"),
      companies: t("legend.companies"),
      home: t("legend.home"),
      province: (province: string) => t("provinceAriaLabel", { province }),
    }),
    [t]
  );

  useNetherlandsMapDrawing({
    svgRef,
    tooltipRef,
    containerRef,
    selectedCity,
    selectedProvince,
    onSelectCity: selectCity,
    onSelectProvince: selectProvince,
    labels,
  });

  const getWorkModeIcon = (mode: WorkMode) => {
    switch (mode) {
      case WorkMode.Remote:
        return <Globe className="w-3 h-3" />;
      case WorkMode.OnSite:
        return <Briefcase className="w-3 h-3" />;
      default:
        return <Users className="w-3 h-3" />;
    }
  };

  const getWorkModeText = (mode: WorkMode) => {
    switch (mode) {
      case WorkMode.Remote:
        return t("workMode.remote");
      case WorkMode.OnSite:
        return t("workMode.onSite");
      default:
        return t("workMode.hybrid");
    }
  };

  const companyEntries = (companies: string[]) => (
    <div className="space-y-2 md:space-y-3">
      {companies.map((company) => {
        const workEntry = workHistory.find((entry) => entry.company === company);
        return (
          <div key={company} className="p-2 md:p-3 bg-gray-50 rounded-lg">
            <div className="text-base font-medium text-gray-900">{company}</div>
            {workEntry && (
              <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span>
                    {t("period", {
                      from: formatMonthYear(workEntry.from, locale),
                      to: formatMonthYear(workEntry.to, locale),
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {getWorkModeIcon(workEntry.mode)}
                  <span>{getWorkModeText(workEntry.mode)}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const provinceCities = selectedProvince ? workCitiesInProvince(selectedProvince) : [];
  const provinceCompanyCount = new Set(
    provinceCities.flatMap((city) => city.companies)
  ).size;

  return (
    <div>
      <div className="grid items-start gap-8 md:grid-cols-[minmax(0,448px)_1fr] md:gap-y-0">
        <div className="order-1 mt-3 md:mt-4 flex flex-wrap gap-2 md:col-start-1 md:row-start-2">
          {workCities.map((city) => {
            const selected = selectedCity?.name === city.name;
            return (
              <button
                key={city.name}
                type="button"
                aria-pressed={selected}
                onClick={() => selectCity(city)}
                className={cityChipClassName(selected)}
              >
                {city.name}
              </button>
            );
          })}
        </div>

        <div className="order-2 min-h-64 bg-white rounded-xl shadow-sm border p-4 md:p-6 md:col-start-2 md:row-start-1 md:row-span-2 md:sticky md:top-[calc(var(--header-height)+1rem)]">
          {selectedCity && (
            <div>
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                {selectedCity.isHome ? (
                  <Home className="w-4 h-4 md:w-5 md:h-5 text-emerald-700 flex-shrink-0" />
                ) : (
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-textMain">
                    {regionForCity(selectedCity.name) ? (
                      <Link
                        href={regionPath(regionForCity(selectedCity.name))}
                        className="inline-flex min-h-6 items-center rounded-sm underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                        data-placement="map-city"
                      >
                        {selectedCity.name}
                      </Link>
                    ) : (
                      selectedCity.name
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedCity.isHome
                      ? t("legend.home")
                      : `${selectedCity.companies.length} ${selectedCity.companies.length === 1 ? t("legend.company") : t("legend.companies")}`}
                  </p>
                </div>
              </div>

              {!selectedCity.isHome && companyEntries(selectedCity.companies)}
            </div>
          )}

          {selectedProvince && (
            <div>
              <h3 className="text-lg font-bold text-textMain">{selectedProvince}</h3>
              <p className="text-sm text-gray-600">
                {t("provinceSummary", {
                  companies: provinceCompanyCount,
                  cities: provinceCities.length,
                })}
              </p>

              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">
                {t("provinceCities")}
              </p>
              <div className="mt-3 space-y-4">
                {provinceCities.map((city) => (
                  <div key={city.name}>
                    <button
                      type="button"
                      aria-pressed={false}
                      onClick={() => selectCity(city)}
                      className={cityChipClassName(false)}
                    >
                      {city.name}
                    </button>
                    <div className="mt-2">{companyEntries(city.companies)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!selection && (
            <div className="text-center text-gray-500 py-4 md:py-6">
              <MapPin className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 md:mb-3 opacity-50" />
              <p className="text-sm">{t("tapLocation")}</p>
            </div>
          )}
        </div>

        <div
          ref={containerRef}
          className="order-3 relative bg-white rounded-xl shadow-sm border p-4 md:p-6 md:col-start-1 md:row-start-1"
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
            className="mx-auto h-auto w-full max-w-lg"
            aria-label={t("mapAriaLabel")}
          />

          <div
            ref={tooltipRef}
            className="absolute pointer-events-none bg-gray-900 text-white text-xs md:text-sm px-2 md:px-3 py-1 md:py-2 rounded-lg shadow-lg z-10"
            style={{ opacity: 0, transition: "opacity 0.2s ease" }}
          />

          <div className="mt-3 md:mt-4 flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm">
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-emerald-700 rounded-full border-2 border-white shadow"></div>
              <span>{t("legend.home")}</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-emerald-500 rounded-full border-2 border-white shadow"></div>
              <span>{t("legend.city")}</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-brand-navy/10 border border-brand-navy/30"></div>
              <span>{t("legend.highlighted")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
