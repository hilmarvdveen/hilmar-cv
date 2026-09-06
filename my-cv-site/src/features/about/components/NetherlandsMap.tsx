"use client";

import { useMemo, useRef, useState } from "react";
import { Briefcase, Globe, MapPin, Home, Calendar, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { workHistory, WorkMode } from "@/data/workHistory";
import { formatMonthYear } from "@/lib/workPeriod";
import {
  HOME_CITY_NAME,
  highlightedRegionCount,
  workCityCount,
  workCompanyCount,
  type CityLocation,
} from "../netherlandsMapData";
import { useNetherlandsMapDrawing } from "../hooks/useNetherlandsMapDrawing";
import { regionForCity, regionPath } from "@/data/regions";
import { Link } from "@/i18n/navigation";

const FIRST_YEAR = 2016;

export const NetherlandsMap = () => {
  const t = useTranslations("home.map");
  const locale = useLocale();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityLocation | null>(null);
  const labels = useMemo(
    () => ({
      company: t("legend.company"),
      companies: t("legend.companies"),
      home: t("legend.home"),
    }),
    [t]
  );

  useNetherlandsMapDrawing({
    svgRef,
    tooltipRef,
    containerRef,
    selectedCity,
    onSelectCity: setSelectedCity,
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

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-6 md:py-8">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-section-title text-textMain mb-3 md:mb-4">
          {t("companiesWorked")}
        </h2>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {t("workedIn")} {workCompanyCount} {t("stats.companies")}{" "}
          {t("stats.across")} {workCityCount} {t("stats.cities")} {t("stats.in")}{" "}
          {highlightedRegionCount} {t("stats.provinces")}.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8 max-w-sm md:max-w-md mx-auto">
        <div className="text-center p-3 md:p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-xl md:text-2xl font-bold text-brand-navy">
            {workCompanyCount}
          </div>
          <div className="text-xs md:text-sm text-gray-600">
            {t("stats.companiesLabel")}
          </div>
        </div>
        <div className="text-center p-3 md:p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-xl md:text-2xl font-bold text-brand-navy">
            {workCityCount}
          </div>
          <div className="text-xs md:text-sm text-gray-600">
            {t("stats.citiesLabel")}
          </div>
        </div>
        <div className="text-center p-3 md:p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-xl md:text-2xl font-bold text-brand-navy">
            {highlightedRegionCount}
          </div>
          <div className="text-xs md:text-sm text-gray-600">
            {t("stats.provincesLabel")}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
        <div className="lg:col-span-2 order-1 lg:order-1">
          <div
            ref={containerRef}
            className="relative bg-white rounded-xl shadow-sm border p-4 md:p-6"
          >
            <svg
              ref={svgRef}
              viewBox="0 0 500 425"
              className="w-full h-auto"
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

        <div className="lg:col-span-1 order-2 lg:order-2">
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 h-fit">
            {selectedCity ? (
              <div>
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  {selectedCity.isHome ? (
                    <Home className="w-4 h-4 md:w-5 md:h-5 text-emerald-700 flex-shrink-0" />
                  ) : (
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                      {regionForCity(selectedCity.name) ? (
                        <Link
                          href={regionPath(regionForCity(selectedCity.name))}
                          className="rounded-sm underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                          data-placement="map-city"
                        >
                          {selectedCity.name}
                        </Link>
                      ) : (
                        selectedCity.name
                      )}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600">
                      {selectedCity.isHome
                        ? t("legend.home")
                        : `${selectedCity.companies.length} ${selectedCity.companies.length === 1 ? t("legend.company") : t("legend.companies")}`}
                    </p>
                  </div>
                </div>

                {!selectedCity.isHome && (
                  <div className="space-y-2 md:space-y-3">
                    {selectedCity.companies.map((company) => {
                      const workEntry = workHistory.find(
                        (entry) => entry.company === company
                      );
                      return (
                        <div
                          key={company}
                          className="p-2 md:p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="font-medium text-gray-900 text-sm md:text-base">
                            {company}
                          </div>
                          {workEntry && (
                            <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span className="text-xs">
                                  {t("period", {
                                    from: formatMonthYear(workEntry.from, locale),
                                    to: formatMonthYear(workEntry.to, locale),
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {getWorkModeIcon(workEntry.mode)}
                                <span className="text-xs">
                                  {getWorkModeText(workEntry.mode)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4 md:py-6">
                <MapPin className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 md:mb-3 opacity-50" />
                <p className="text-xs md:text-sm">{t("tapLocation")}</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-brand-navy/5 to-emerald-50 rounded-xl p-4 md:p-6 mt-4 md:mt-6">
            <h3 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">
              {t("highlights.title")}
            </h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-700">
              <li>
                • {t("highlights.basedIn")} {HOME_CITY_NAME}, Noord-Holland
              </li>
              <li>
                • {t("highlights.workedAcross")} {highlightedRegionCount}{" "}
                {t("highlights.provinces")}
              </li>
              <li>• {t("highlights.experience")}</li>
              <li>
                • {new Date().getFullYear() - FIRST_YEAR}+ {t("highlights.years")}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
