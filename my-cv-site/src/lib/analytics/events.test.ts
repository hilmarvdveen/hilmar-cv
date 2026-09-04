import { describe, it, expect, afterEach } from "vitest";
import { pushDataLayerEvent, pushSiteEvent } from "./events";

type DataLayerWindow = { dataLayer?: unknown[] };

afterEach(() => {
  delete (window as unknown as DataLayerWindow).dataLayer;
});

describe("pushDataLayerEvent", () => {
  it("pushes the event with the given category onto the dataLayer", () => {
    pushDataLayerEvent("custom_event", "custom", { value: 1 });
    expect((window as unknown as DataLayerWindow).dataLayer).toEqual([
      { event: "custom_event", event_category: "custom", value: 1 },
    ]);
  });

  it("creates the dataLayer when Tag Manager has not loaded yet and appends when it has", () => {
    (window as unknown as DataLayerWindow).dataLayer = [{ event: "gtm.js" }];
    pushDataLayerEvent("custom_event", "custom");
    expect((window as unknown as DataLayerWindow).dataLayer).toHaveLength(2);
  });

  it("swallows a dataLayer that refuses the push", () => {
    (window as unknown as DataLayerWindow).dataLayer = Object.freeze([]) as unknown as unknown[];
    expect(() => pushDataLayerEvent("custom_event", "custom")).not.toThrow();
  });
});

describe("pushSiteEvent", () => {
  it("pushes the event with the site category onto the dataLayer", () => {
    pushSiteEvent("cta_click", { placement: "hero", path: "/en" });
    expect((window as unknown as DataLayerWindow).dataLayer).toEqual([
      { event: "cta_click", event_category: "site", placement: "hero", path: "/en" },
    ]);
  });

  it("defaults to no extra parameters", () => {
    pushSiteEvent("section_view");
    expect((window as unknown as DataLayerWindow).dataLayer).toEqual([
      { event: "section_view", event_category: "site" },
    ]);
  });
});
