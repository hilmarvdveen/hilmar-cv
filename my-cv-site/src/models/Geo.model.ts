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
  statcode: string;
  jrstatcode: string;
  statnaam: string;
  rubriek: "provincie";
  id: number;
  FID: string;
}
