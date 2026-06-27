import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";

export type ProvinceGeoJSON = FeatureCollection & {
  type: "FeatureCollection";
  features: ProvinceFeature[];
}

export type ProvinceFeature = {
  type: "Feature";
  geometry: MultiPolygon | Polygon;
  properties: ProvinceProperties;
  id: string;
}

export type ProvinceProperties = {
  statcode: string;       // e.g. "PV20"
  jrstatcode: string;     // e.g. "2025PV20"
  statnaam: string;       // e.g. "Groningen"
  rubriek: "provincie";
  id: number;
  FID: string;            // e.g. "provincie_gegeneraliseerd.<uuid>"
}
