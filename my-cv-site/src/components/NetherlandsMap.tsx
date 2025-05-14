"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useTranslation } from "next-i18next";
import { ProvinceFeature, ProvinceGeoJSON } from "@/models/Geo.model";

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
    name: "Zandvoort",
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
  const { t, i18n } = useTranslation("home");

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    const container = containerRef.current;
    const width = 600;
    const height = 700;

    if (!svgRef.current || !tooltipRef.current || !container) return;
    svg.selectAll("*").remove(); // clear svg on rerender

    const projection = d3
      .geoMercator()
      .center([5.4, 52.2])
      .scale(8000)
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    d3.json<ProvinceGeoJSON>("/data/geo-provinces.json").then((geoData) => {
      if (!geoData) return;

      const getFill = (name: string) =>
        highlightedRegions.includes(name) ? "#0070f3" : "#e5e5e5";

      const getRelativePosition = (event: MouseEvent) => {
        const bounds = container.getBoundingClientRect();
        return {
          left: event.clientX - bounds.left + 10,
          top: event.clientY - bounds.top - 20,
        };
      };

      // 🗺 Provinces
      svg
        .selectAll<SVGPathElement, ProvinceFeature>("path")
        .data(geoData.features)
        .join("path")
        .attr("d", (d) => pathGenerator(d) ?? "")
        .attr("fill", (d) => getFill(d.properties.statnaam))
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5)
        .on("mouseenter", (event, d) => {
          d3.select(event.currentTarget).attr("fill", "#60a5fa");
          const { left, top } = getRelativePosition(event);
          tooltip
            .style("opacity", "1")
            .style("left", `${left}px`)
            .style("top", `${top}px`)
            .html(`<strong>${d.properties.statnaam}</strong>`);
        })
        .on("mousemove", (event) => {
          const { left, top } = getRelativePosition(event);
          tooltip.style("left", `${left}px`).style("top", `${top}px`);
        })
        .on("mouseleave", (event, d) => {
          d3.select(event.currentTarget).attr(
            "fill",
            getFill(d.properties.statnaam)
          );
          tooltip.style("opacity", "0");
        });

      // 🏠 Home icon for Zandvoort
      const home = workCities.find((c) => c.name === "Zandvoort")!;
      const [x, y] = projection(home.coordinates)!;
      if (home) {
        svg
          .append("foreignObject")
          .attr("x", x - 10)
          .attr("y", y - 10)
          .attr("width", 20)
          .attr("height", 20)
          .html(`<icon>🏠</icon>`)
          .on("mouseenter", (event) => {
            const { left, top } = getRelativePosition(event);
            tooltip
              .style("opacity", "1")
              .style("left", `${left}px`)
              .style("top", `${top}px`)
              .html(
                `<div>
                  <div style="font-weight:600; margin-bottom: 0.25rem;">
                    ${t("map.workedIn", "Worked in")} ${home.name}
                  </div>
                  <ul style="margin: 0; padding: 0; list-style: none;">
                    ${home.companies
                      .map(
                        (c) =>
                          `<li style="padding-left: 1em; text-indent: -1em;">• ${c}</li>`
                      )
                      .join("")}
                  </ul>
                </div>`
              );
          })
          .on("mousemove", (event) => {
            const { left, top } = getRelativePosition(event);
            tooltip.style("left", `${left}px`).style("top", `${top}px`);
          })
          .on("mouseleave", () => {
            tooltip.style("opacity", "0");
          });
      }

      // 📍 Other cities
      svg
        .selectAll("circle")
        .data(workCities.filter((c) => c.name !== "Zandvoort"))
        .join("circle")
        .attr("cx", (d) => projection(d.coordinates)?.[0] || 0)
        .attr("cy", (d) => projection(d.coordinates)?.[1] || 0)
        .attr("r", 5)
        .attr("fill", "#dc2626")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .on("mouseenter", (event, d) => {
          const { left, top } = getRelativePosition(event);
          tooltip
            .style("opacity", "1")
            .style("left", `${left}px`)
            .style("top", `${top}px`)
            .html(
              `<div>
                <div style="font-weight:600; margin-bottom: 0.25rem;">
                  ${t("map.workedIn", "Worked in")} ${d.name}
                </div>
                <ul style="margin: 0; padding: 0; list-style: none;">
                  ${d.companies
                    .map(
                      (c) =>
                        `<li style="padding-left: 1em; text-indent: -1em;">• ${c}</li>`
                    )
                    .join("")}
                </ul>
              </div>`
            );
        })
        .on("mousemove", (event) => {
          const { left, top } = getRelativePosition(event);
          tooltip.style("left", `${left}px`).style("top", `${top}px`);
        })
        .on("mouseleave", () => {
          tooltip.style("opacity", "0");
        });

      // 🧭 Legend
      const legend = svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(10, 40)`);

      const legendItems = [
        {
          type: "home",
          label: t("map.legend.home", "My home location"),
        },
        {
          color: "#dc2626",
          label: t("map.legend.city", "City where I worked"),
        },
        {
          color: "#0070f3",
          label: t("map.legend.highlighted", "Province I worked in"),
        },
        { color: "#e5e5e5", label: t("map.legend.other", "Other province") },
      ];

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
              `<svg xmlns="http://www.w3.org/2000/svg" fill="#0f172a" viewBox="0 0 24 24">
                 <path fill-rule="evenodd" d="M2.47 12.53a.75.75...Z" clip-rule="evenodd"/>
               </svg>`
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
          .attr("font-size", 12)
          .style("font-family", "system-ui, sans-serif")
          .style("fill", "#111")
          .style("shape-rendering", "geometricPrecision")
          .text(item.label);
      });
    });
  }, [i18n.language, t]);

  return (
    <section className="container mx-auto max-w-7xl">
      <div ref={containerRef} className="relative m-2">
        <svg
          ref={svgRef}
          width={600}
          height={700}
          className="rounded shadow"
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
    </section>
  );
};
