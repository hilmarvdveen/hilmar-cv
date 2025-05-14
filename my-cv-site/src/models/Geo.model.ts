import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";

export interface ProvinceGeoJSON extends FeatureCollection {
  type: "FeatureCollection";
  features: ProvinceFeature[];
}

export interface ProvinceFeature {
  type: "Feature";
  geometry: MultiPolygon | Polygon;
  properties: ProvinceProperties;
  id: string;
}

export interface ProvinceProperties {
  statcode: string;       // e.g. "PV20"
  jrstatcode: string;     // e.g. "2025PV20"
  statnaam: string;       // e.g. "Groningen"
  rubriek: "provincie";
  id: number;
  FID: string;            // e.g. "provincie_gegeneraliseerd.<uuid>"
}
