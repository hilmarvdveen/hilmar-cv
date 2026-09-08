export type SiteEventName =
  | "cta_click"
  | "contact_click"
  | "link_click"
  | "section_view"
  | "consent_choice"
  | "cv_download"
  | "contact_submit";

export type SiteEventParameters = Record<string, string | number | boolean>;

type DataLayerGlobal = {
  dataLayer?: unknown[];
};

export function pushDataLayerEvent(
  name: string,
  category: string,
  parameters: SiteEventParameters = {}
): void {
  try {
    const globalScope = globalThis as unknown as DataLayerGlobal;
    globalScope.dataLayer = globalScope.dataLayer ?? [];
    globalScope.dataLayer.push({ event: name, event_category: category, ...parameters });
  } catch {
    return;
  }
}

export function pushSiteEvent(
  name: SiteEventName,
  parameters: SiteEventParameters = {}
): void {
  pushDataLayerEvent(name, "site", parameters);
}
