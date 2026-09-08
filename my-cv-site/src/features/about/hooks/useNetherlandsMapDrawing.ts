import { useEffect, type RefObject } from "react";
import * as d3 from "d3";
import { ProvinceFeature, ProvinceGeoJSON } from "@/models/Geo.model";
import {
  MAP_COLORS,
  MAP_VIEWBOX,
  highlightedRegions,
  workCities,
  type CityLocation,
} from "../netherlandsMapData";

export type MapDrawingLabels = {
  company: string;
  companies: string;
  home: string;
};

type MapDrawingOptions = {
  svgRef: RefObject<SVGSVGElement | null>;
  tooltipRef: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  selectedCity: CityLocation | null;
  onSelectCity: (city: CityLocation) => void;
  labels: MapDrawingLabels;
};

const PROVINCES_URL = "/data/geo-provinces.json";
const MAP_PADDING = 12;
const HIT_TARGET_RADIUS = 12;
const MOBILE_BREAKPOINT = 768;

const regionFill = (feature: ProvinceFeature, hovered: boolean) => {
  const highlighted = highlightedRegions.includes(feature.properties.statnaam);
  if (hovered) return highlighted ? MAP_COLORS.primary : "#e5e7eb";
  return highlighted ? MAP_COLORS.primaryLight : MAP_COLORS.secondary;
};

export function useNetherlandsMapDrawing({
  svgRef,
  tooltipRef,
  containerRef,
  selectedCity,
  onSelectCity,
  labels,
}: MapDrawingOptions) {
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    const container = containerRef.current;
    if (!svgRef.current || !tooltipRef.current || !container) return;

    svg.selectAll("*").remove();

    const containerWidth = container.offsetWidth;
    const projection = d3.geoMercator();
    const pathGenerator = d3.geoPath().projection(projection);

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

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

    const cityTooltip = (city: CityLocation) => {
      const detail = city.isHome
        ? labels.home
        : `${city.companies.length} ${city.companies.length === 1 ? labels.company : labels.companies}`;
      return `
        <div class="font-medium">${city.name}</div>
        <div class="text-sm text-white">${detail}</div>
      `;
    };

    const drawMap = async () => {
      const geoData = await d3.json<ProvinceGeoJSON>(PROVINCES_URL);
      if (!geoData) return;
      if (geoData.features.length > 0) {
        projection.fitExtent(
          [
            [MAP_PADDING, MAP_PADDING],
            [MAP_VIEWBOX.width - MAP_PADDING, MAP_VIEWBOX.height - MAP_PADDING],
          ],
          geoData
        );
      }
      const renderedWidth = svgRef.current?.getBoundingClientRect().width || MAP_VIEWBOX.width;
      const unitsPerPixel = MAP_VIEWBOX.width / renderedWidth;

      svg
        .selectAll<SVGPathElement, ProvinceFeature>("path")
        .data(geoData.features)
        .join("path")
        .attr("d", (feature) => pathGenerator(feature) ?? "")
        .attr("fill", (feature) => regionFill(feature, false))
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .style("transition", "all 0.2s ease")
        .on("mouseenter touchstart", (event, feature) => {
          d3.select(event.currentTarget).attr("fill", regionFill(feature, true));
          if (!isMobile) {
            showTooltip(event, `<div class="font-medium">${feature.properties.statnaam}</div>`);
          }
        })
        .on("mouseleave touchend", (event, feature) => {
          d3.select(event.currentTarget).attr("fill", regionFill(feature, false));
          if (!isMobile) {
            hideTooltip();
          }
        });

      const cityRadius = isMobile ? 8 : 6;
      const cityHoverRadius = isMobile ? 12 : 8;
      const cityHitTargetRadius = Math.max(HIT_TARGET_RADIUS, HIT_TARGET_RADIUS * unitsPerPixel);

      const drawCities = (
        selector: string,
        className: string,
        cities: CityLocation[],
        fill: string,
        onClick: (event: MouseEvent) => void
      ) => {
        svg
          .selectAll(`${selector}-hit-target`)
          .data(cities)
          .join("circle")
          .attr("class", `${className}-hit-target`)
          .attr("cx", (city) => projection(city.coordinates)?.[0] || 0)
          .attr("cy", (city) => projection(city.coordinates)?.[1] || 0)
          .attr("r", cityHitTargetRadius)
          .attr("fill", "transparent")
          .attr("role", "button")
          .attr("tabindex", 0)
          .attr("aria-label", (city) => city.name)
          .style("cursor", "pointer")
          .on("mouseenter touchstart", (event, city) => {
            if (!isMobile) {
              showTooltip(event, cityTooltip(city));
            }
          })
          .on("mouseleave touchend", () => {
            if (!isMobile) {
              hideTooltip();
            }
          })
          .on("click touchend", (event, city) => {
            onSelectCity(city);
          })
          .on("keydown", (event, city) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelectCity(city);
            }
          });

        svg
          .selectAll(selector)
          .data(cities)
          .join("circle")
          .attr("class", className)
          .attr("cx", (city) => projection(city.coordinates)?.[0] || 0)
          .attr("cy", (city) => projection(city.coordinates)?.[1] || 0)
          .attr("r", cityRadius)
          .attr("fill", fill)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 2)
          .style("cursor", "pointer")
          .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))")
          .on("mouseenter touchstart", (event, city) => {
            d3.select(event.currentTarget).attr("r", cityHoverRadius);
            if (!isMobile) {
              showTooltip(event, cityTooltip(city));
            }
          })
          .on("mouseleave touchend", (event, city) => {
            if (!selectedCity || selectedCity.name !== city.name) {
              d3.select(event.currentTarget).attr("r", cityRadius);
            }
            if (!isMobile) {
              hideTooltip();
            }
          })
          .on("click touchend", (event, city) => {
            onSelectCity(city);
            onClick(event);
          });
      };

      drawCities(
        ".work-city",
        "work-city",
        workCities.filter((city) => !city.isHome),
        MAP_COLORS.accent,
        (event) => {
          svg.selectAll(".work-city").attr("r", cityRadius);
          d3.select(event.currentTarget as SVGCircleElement).attr("r", cityHoverRadius);
        }
      );

      const homeCity = workCities.find((city) => city.isHome);
      if (homeCity) {
        drawCities(".home-city", "home-city", [homeCity], MAP_COLORS.home, () => {
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
  }, [svgRef, tooltipRef, containerRef, labels, selectedCity, onSelectCity]);
}
