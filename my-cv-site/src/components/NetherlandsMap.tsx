"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Briefcase, Globe, MapPin, Home, Calendar, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { workHistory, WorkMode } from "../data/workHistory";
import { ProvinceFeature, ProvinceGeoJSON } from "../models/Geo.model";

// Constants
const HOME_CITY_NAME = "Zandvoort";

const COLORS = {
  primary: "#3b82f6",
  primaryLight: "#dbeafe",
  secondary: "#f3f4f6",
  accent: "#10b981",
  danger: "#ef4444",
  text: "#1f2937",
  textLight: "#6b7280",
};

const highlightedRegions = [
  "Noord-Holland",
  "Utrecht",
  "Zuid-Holland",
  "Gelderland",
  "Flevoland",
  "Noord-Brabant",
  "Fryslân",
];

type CityLocation = {
  name: string;
  coordinates: [number, number];
  companies: string[];
  isHome?: boolean;
};

const workCities: CityLocation[] = [
  {
    name: HOME_CITY_NAME,
    coordinates: [4.5386, 52.3749],
    companies: ["Home Base"],
    isHome: true,
  },
  {
    name: "Amsterdam",
    coordinates: [4.8952, 52.3702],
    companies: ["Conclusion", "Randstad", "Postcode Loterij"],
  },
  {
    name: "Apeldoorn",
    coordinates: [5.9699, 52.2112],
    companies: ["Belastingdienst"],
  },
  {
    name: "Hilversum",
    coordinates: [5.1606, 52.2292],
    companies: ["Transdev"],
  },
  { name: "Hoorn", coordinates: [5.0594, 52.6425], companies: ["Niped"] },
  { name: "Utrecht", coordinates: [5.1214, 52.0907], companies: ["Bluefield"] },
  { name: "Zoetermeer", coordinates: [4.4933, 52.0607], companies: ["Ortec"] },
  { name: "Almere", coordinates: [5.2141, 52.3508], companies: ["Athlon"] },
  {
    name: "Rotterdam",
    coordinates: [4.47917, 51.9225],
    companies: ["Opinity"],
  },
];

export const NetherlandsMap = () => {
  const t = useTranslations("home.map");
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityLocation | null>(null);

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

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    const container = containerRef.current;
    if (!svgRef.current || !tooltipRef.current || !container) return;

    svg.selectAll("*").remove();

    const containerWidth = container.offsetWidth;
    const mapWidth = Math.min(containerWidth - 32, 500); // Account for padding
    const mapHeight = mapWidth * 0.85;

    const projection = d3
      .geoMercator()
      .center([5.4, 52.2])
      .scale(mapWidth * 11)
      .translate([mapWidth / 2, mapHeight / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    const isMobile = window.innerWidth < 768;

    const showTooltip = (event: MouseEvent, content: string) => {
      const bounds = container.getBoundingClientRect();
      const left = event.clientX - bounds.left + 10;
      const top = event.clientY - bounds.top - 10;

      tooltip
        .style("opacity", "1")
        .style("left", `${Math.min(left, containerWidth - 200)}px`)
        .style("top", `${Math.max(top, 10)}px`)
        .html(content);
    };

    const hideTooltip = () => {
      tooltip.style("opacity", "0");
    };

    const drawMap = async () => {
      const geoData = await d3.json<ProvinceGeoJSON>(
        "/data/geo-provinces.json"
      );
      if (!geoData) return;

      // Draw provinces
      svg
        .selectAll<SVGPathElement, ProvinceFeature>("path")
        .data(geoData.features)
        .join("path")
        .attr("d", (d) => pathGenerator(d) ?? "")
        .attr("fill", (d) =>
          highlightedRegions.includes(d.properties.statnaam)
            ? COLORS.primaryLight
            : COLORS.secondary
        )
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .style("transition", "all 0.2s ease")
        .on("mouseenter touchstart", (event, d) => {
          d3.select(event.currentTarget).attr(
            "fill",
            highlightedRegions.includes(d.properties.statnaam)
              ? COLORS.primary
              : "#e5e7eb"
          );
          if (!isMobile) {
            showTooltip(
              event,
              `<div class="font-medium">${d.properties.statnaam}</div>`
            );
          }
        })
        .on("mouseleave touchend", (event, d) => {
          d3.select(event.currentTarget).attr(
            "fill",
            highlightedRegions.includes(d.properties.statnaam)
              ? COLORS.primaryLight
              : COLORS.secondary
          );
          if (!isMobile) {
            hideTooltip();
          }
        });

      // Draw work cities with larger touch targets on mobile
      const cityRadius = isMobile ? 8 : 6;
      const cityHoverRadius = isMobile ? 12 : 8;

      svg
        .selectAll(".work-city")
        .data(workCities.filter((c) => !c.isHome))
        .join("circle")
        .attr("class", "work-city")
        .attr("cx", (d) => projection(d.coordinates)?.[0] || 0)
        .attr("cy", (d) => projection(d.coordinates)?.[1] || 0)
        .attr("r", cityRadius)
        .attr("fill", COLORS.accent)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))")
        .on("mouseenter touchstart", (e, d) => {
          d3.select(e.currentTarget).attr("r", cityHoverRadius);
          if (!isMobile) {
            const companiesText =
              d.companies.length === 1
                ? t("legend.company")
                : t("legend.companies");
            showTooltip(
              e,
              `
              <div class="font-medium">${d.name}</div>
              <div class="text-sm text-white">${d.companies.length} ${companiesText}</div>
            `
            );
          }
        })
        .on("mouseleave touchend", (e, d) => {
          if (!selectedCity || selectedCity.name !== d.name) {
            d3.select(e.currentTarget).attr("r", cityRadius);
          }
          if (!isMobile) {
            hideTooltip();
          }
        })
        .on("click touchend", (e, d) => {
          setSelectedCity(d);
          svg.selectAll(".work-city").attr("r", cityRadius);
          d3.select(e.currentTarget).attr("r", cityHoverRadius);
        });

      // Draw home city
      const homeCity = workCities.find((c) => c.isHome);
      if (homeCity) {
        svg
          .selectAll(".home-city")
          .data([homeCity])
          .join("circle")
          .attr("class", "home-city")
          .attr("cx", (d) => projection(d.coordinates)?.[0] || 0)
          .attr("cy", (d) => projection(d.coordinates)?.[1] || 0)
          .attr("r", cityRadius)
          .attr("fill", COLORS.danger)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 2)
          .style("cursor", "pointer")
          .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))")
          .on("mouseenter touchstart", (e, d) => {
            d3.select(e.currentTarget).attr("r", cityHoverRadius);
            if (!isMobile) {
              showTooltip(
                e,
                `
                <div class="font-medium">${d.name}</div>
                <div class="text-sm text-white">${t("legend.home")}</div>
              `
              );
            }
          })
          .on("mouseleave touchend", (e, d) => {
            if (!selectedCity || selectedCity.name !== d.name) {
              d3.select(e.currentTarget).attr("r", cityRadius);
            }
            if (!isMobile) {
              hideTooltip();
            }
          })
          .on("click touchend", (e, d) => {
            setSelectedCity(d);
            svg.selectAll(".home-city").attr("r", cityHoverRadius);
            svg.selectAll(".work-city").attr("r", cityRadius);
          });
      }
    };

    drawMap();

    const handleResize = () => {
      drawMap();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [t]);

  // Calculate stats
  const totalCompanies = [...new Set(workCities.flatMap((c) => c.companies))]
    .length;
  const totalCities = workCities.length;
  const totalProvinces = highlightedRegions.length;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-6 md:py-8">
      {/* SEO-friendly header */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
          {t("companiesWorked")}
        </h2>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {t("workedIn")} {totalCompanies} {t("stats.companies")}{" "}
          {t("stats.across")} {totalCities} {t("stats.cities")} {t("stats.in")}{" "}
          {totalProvinces} {t("stats.provinces")}.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8 max-w-sm md:max-w-md mx-auto">
        <div className="text-center p-3 md:p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-xl md:text-2xl font-bold text-blue-600">
            {totalCompanies}
          </div>
          <div className="text-xs md:text-sm text-gray-600">
            {t("stats.companiesLabel")}
          </div>
        </div>
        <div className="text-center p-3 md:p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-xl md:text-2xl font-bold text-emerald-600">
            {totalCities}
          </div>
          <div className="text-xs md:text-sm text-gray-600">
            {t("stats.citiesLabel")}
          </div>
        </div>
        <div className="text-center p-3 md:p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-xl md:text-2xl font-bold text-red-600">
            {totalProvinces}
          </div>
          <div className="text-xs md:text-sm text-gray-600">
            {t("stats.provincesLabel")}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
        {/* Map */}
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

            {/* Tooltip */}
            <div
              ref={tooltipRef}
              className="absolute pointer-events-none bg-gray-900 text-white text-xs md:text-sm px-2 md:px-3 py-1 md:py-2 rounded-lg shadow-lg z-10"
              style={{ opacity: 0, transition: "opacity 0.2s ease" }}
            />

            {/* Legend */}
            <div className="mt-3 md:mt-4 flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm">
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full border-2 border-white shadow"></div>
                <span>{t("legend.home")}</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-emerald-500 rounded-full border-2 border-white shadow"></div>
                <span>{t("legend.city")}</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-200 border border-blue-300"></div>
                <span>{t("legend.highlighted")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* City Details Panel */}
        <div className="lg:col-span-1 order-2 lg:order-2">
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 h-fit">
            {selectedCity ? (
              <div>
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  {selectedCity.isHome ? (
                    <Home className="w-4 h-4 md:w-5 md:h-5 text-red-500 flex-shrink-0" />
                  ) : (
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                      {selectedCity.name}
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
                        (w) => w.company === company
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
                                  {workEntry.from.split("-")[1]}/
                                  {workEntry.from.split("-")[0]} -{" "}
                                  {workEntry.to.split("-")[1]}/
                                  {workEntry.to.split("-")[0]}
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

          {/* Quick Facts */}
          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-4 md:p-6 mt-4 md:mt-6">
            <h3 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">
              {t("highlights.title")}
            </h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-700">
              <li>
                • {t("highlights.basedIn")} {HOME_CITY_NAME}, Noord-Holland
              </li>
              <li>
                • {t("highlights.workedAcross")} {totalProvinces}{" "}
                {t("highlights.provinces")}
              </li>
              <li>• {t("highlights.experience")}</li>
              <li>
                • {new Date().getFullYear() - 2016}+ {t("highlights.years")}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SEO-friendly structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Hilmar van der Voort",
            jobTitle: "Software Developer",
            address: {
              "@type": "PostalAddress",
              addressLocality: HOME_CITY_NAME,
              addressCountry: "Netherlands",
            },
            workLocation: workCities
              .filter((c) => !c.isHome)
              .map((city) => ({
                "@type": "Place",
                name: city.name,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: city.name,
                  addressCountry: "Netherlands",
                },
              })),
          }),
        }}
      />
    </section>
  );
};
