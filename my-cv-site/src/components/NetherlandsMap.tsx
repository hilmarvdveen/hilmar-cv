"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useTranslations } from "next-intl";
import {
  BriefcaseIcon,
  GlobeAltIcon,
  MapPinIcon,
} from "@heroicons/react/16/solid";
import { workHistory, WorkMode } from "../data/workHistory";
import { ProvinceFeature, ProvinceGeoJSON } from "../models/Geo.model";

// Constants
const HOME_CITY_NAME = "Zandvoort";

const COLORS = {
  highlighted: "#0070f3",
  defaultProvince: "#e5e5e5",
  cityDot: "#dc2626",
  cityDotStroke: "#fff",
  tooltipBg: "white",
  tooltipText: "black",
};

const FONT = {
  family: "system-ui, sans-serif",
  size: 12,
  color: "#111",
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
};

const workCities: CityLocation[] = [
  {
    name: HOME_CITY_NAME,
    coordinates: [4.5386, 52.3749],
    companies: ["Home Location"],
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
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("home");

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    const container = containerRef.current;
    if (!svgRef.current || !tooltipRef.current || !container) return;

    svg.selectAll("*").remove();

    const containerWidth = container.offsetWidth;
    const aspectRatio = 600 / 700;
    const mapWidth = containerWidth;
    const mapHeight = containerWidth / aspectRatio;

    const projection = d3
      .geoMercator()
      .center([5.4, 52.2])
      .scale(mapWidth * 13) // schaal evenredig met breedte
      .translate([mapWidth / 2, mapHeight / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    const getRelativePosition = (event: MouseEvent) => {
      const bounds = container.getBoundingClientRect();
      return {
        left: event.clientX - bounds.left + 10,
        top: event.clientY - bounds.top - 20,
      };
    };

    const showTooltip = (event: MouseEvent, html: string) => {
      const { left, top } = getRelativePosition(event);
      tooltip
        .style("opacity", "1")
        .style("left", `${left}px`)
        .style("top", `${top}px`)
        .html(html);
    };

    const hideTooltip = () => {
      tooltip.style("opacity", "0");
    };

    const createCompanyTooltip = (
      city: string,
      companies: string[],
      homeCity?: string
    ) => `
      <div>
        <div style="font-weight:600; margin-bottom: 0.25rem;">
          ${
            city === homeCity
              ? t("map.legend.home", { defaultValue: "My home location" })
              : t("map.workedIn", { defaultValue: "Worked in" })
          } ${city}
        </div>
        <ul style="margin: 0; padding: 0; list-style: none;">
          ${companies
            .map(
              (c) =>
                `<li style="padding-left: 1em; text-indent: -1em;">• ${c}</li>`
            )
            .join("")}
        </ul>
      </div>
    `;

    const drawMap = async () => {
      const geoData = await d3.json<ProvinceGeoJSON>(
        "/data/geo-provinces.json"
      );
      if (!geoData) return;

      svg
        .selectAll<SVGPathElement, ProvinceFeature>("path")
        .data(geoData.features)
        .join("path")
        .attr("d", (d) => pathGenerator(d) ?? "")
        .attr("fill", (d) =>
          highlightedRegions.includes(d.properties.statnaam)
            ? COLORS.highlighted
            : COLORS.defaultProvince
        )
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5)
        .on("mouseenter", (event, d) => {
          d3.select(event.currentTarget).attr("fill", "#60a5fa");
          showTooltip(event, `<strong>${d.properties.statnaam}</strong>`);
        })
        .on("mousemove", (event, d) =>
          showTooltip(event, `<strong>${d.properties.statnaam}</strong>`)
        )
        .on("mouseleave", (event, d) => {
          d3.select(event.currentTarget).attr(
            "fill",
            highlightedRegions.includes(d.properties.statnaam)
              ? COLORS.highlighted
              : COLORS.defaultProvince
          );
          hideTooltip();
        });

      // 🏠 Home
      const home = workCities.find((c) => c.name === HOME_CITY_NAME)!;
      const [homeX, homeY] = projection(home.coordinates)!;
      svg
        .append("foreignObject")
        .attr("x", homeX - 10)
        .attr("y", homeY - 10)
        .attr("width", 20)
        .attr("height", 20)
        .html(
          `<div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 16px;">🏠</div>`
        )
        .on("mouseenter", (e) =>
          showTooltip(
            e,
            createCompanyTooltip(home.name, home.companies, HOME_CITY_NAME)
          )
        )
        .on("mousemove", (e) =>
          showTooltip(
            e,
            createCompanyTooltip(home.name, home.companies, HOME_CITY_NAME)
          )
        )
        .on("mouseleave", hideTooltip);

      // 📍 Cities
      svg
        .selectAll("circle")
        .data(workCities.filter((c) => c.name !== HOME_CITY_NAME))
        .join("circle")
        .attr("cx", (d) => projection(d.coordinates)?.[0] || 0)
        .attr("cy", (d) => projection(d.coordinates)?.[1] || 0)
        .attr("r", 5)
        .attr("fill", COLORS.cityDot)
        .attr("stroke", COLORS.cityDotStroke)
        .attr("stroke-width", 1.5)
        .on("mouseenter", (e, d) =>
          showTooltip(e, createCompanyTooltip(d.name, d.companies))
        )
        .on("mousemove", (e, d) =>
          showTooltip(e, createCompanyTooltip(d.name, d.companies))
        )
        .on("mouseleave", hideTooltip);

      // 🧭 Legend
      const legendItems = [
        {
          type: "home",
          label: t("map.legend.home", { defaultValue: "My home location" }),
        },
        {
          color: COLORS.cityDot,
          label: t("map.legend.city", { defaultValue: "City where I worked" }),
        },
        {
          color: COLORS.highlighted,
          label: t("map.legend.highlighted", {
            defaultValue: "Province I worked in",
          }),
        },
        {
          color: COLORS.defaultProvince,
          label: t("map.legend.other", { defaultValue: "Other province" }),
        },
      ];

      const legend = svg.append("g").attr("transform", "translate(10, 40)");
      legendItems.forEach((item, i) => {
        const group = legend
          .append("g")
          .attr("transform", `translate(0, ${i * 24})`);
        if (item.type === "home") {
          group
            .append("foreignObject")
            .attr("x", 4)
            .attr("y", 2)
            .attr("width", 16)
            .attr("height", 16)
            .html(
              `<div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 16px;">🏠</div>`
            );
        } else {
          group
            .append("circle")
            .attr("cx", 10)
            .attr("cy", 10)
            .attr("r", 6)
            .attr("fill", item.color!);
        }
        group
          .append("text")
          .attr("x", 28)
          .attr("y", 12)
          .attr("dominant-baseline", "middle")
          .attr("font-size", FONT.size)
          .style("font-family", FONT.family)
          .style("fill", FONT.color)
          .style("shape-rendering", "geometricPrecision")
          .text(item.label);
      });
    };

    drawMap();
  }, [t]);

  return (
    <section className="container mx-auto flex flex-col lg:flex-row gap-6 lg:max-w-7xl">
      <div ref={containerRef} className="relative w-full">
        <svg
          ref={svgRef}
          viewBox="0 0 600 700"
          preserveAspectRatio="xMidYMid meet"
          className="w-full md:aspect-[6/7] rounded shadow"
          aria-label="Map of the Netherlands showing provinces and cities where Hilmar worked"
        />
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none bg-white text-black text-sm px-2 py-1 rounded shadow"
          style={{
            opacity: 0,
            zIndex: 999,
            lineHeight: "1.4",
            maxWidth: "200px",
            transition: "opacity 0.2s ease-in-out",
          }}
        />
      </div>
      <div className="w-full  min-w-[300px] p-6 sm:p-8 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">
          {t("map.companiesWorked")}
        </h2>

        <ul className="grid gap-4">
          {workHistory.map((entry) => (
            <li
              key={`${entry.company}-${entry.from}`}
              className="p-4 flex flex-wrap  gap-x-3  gap-y-1  text-sm shadow-sm bg-gray-50 hover:shadow-md transition-shadow"
            >
              <p className="font-semibold text-gray-900 text-base">
                {entry.company}
              </p>
              <span className="inline-flex items-center text-gray-700">
                <MapPinIcon className="w-4 h-4 mr-1" />
                {entry.location}
              </span>
              <div className="flex gap-x-3 gap-y-1 mt-2 text-xs text-gray-700">
                <span className="inline-flex items-center">
                  <BriefcaseIcon className="w-4 h-4 mr-1" />
                  {formatPeriod(entry.from, entry.to)}
                </span>

                <span className="inline-flex items-center">
                  <GlobeAltIcon className="w-4 h-4 mr-1" />
                  {entry.mode === WorkMode.Remote
                    ? "Remote"
                    : entry.mode === WorkMode.OnSite
                      ? "On-site"
                      : "Hybrid"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

function formatPeriod(from: string, to: string) {
  const [fromYear, fromMonth] = from.split("-");
  const [toYear, toMonth] = to.split("-");
  return `${fromMonth}/${fromYear} – ${toMonth}/${toYear}`;
}
