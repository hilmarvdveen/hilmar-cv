import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { ComprehensiveSEO } from "./ComprehensiveSEO";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  document
    .querySelectorAll('[data-seo-component="true"]')
    .forEach((el) => el.remove());
});

describe("ComprehensiveSEO", () => {
  it("tracks, injects structured data and hreflang for a valid config (nl)", () => {
    const gtag = vi.fn();
    vi.stubGlobal("gtag", gtag);
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-XYZ");
    const onMount = vi.fn();

    render(
      <ComprehensiveSEO
        structuredData={[{ "@type": "WebSite" }]}
        canonicalUrl="https://hilmarvanderveen.com/nl/about"
        locale="nl"
        pageTitle="About"
        onMount={onMount}
      />
    );

    expect(gtag).toHaveBeenCalled();
    expect(onMount).toHaveBeenCalled();
    expect(
      document.querySelectorAll('script[data-seo-component="true"]').length
    ).toBeGreaterThan(0);
    expect(
      document.querySelectorAll('link[rel="alternate"][data-seo-component="true"]').length
    ).toBeGreaterThan(0);
  });

  it("handles the en locale without a measurement id", () => {
    render(
      <ComprehensiveSEO
        structuredData={[{ "@type": "Person" }]}
        canonicalUrl="https://hilmarvanderveen.com/about"
        locale="en"
      />
    );
    expect(
      document.querySelectorAll('script[data-seo-component="true"]').length
    ).toBeGreaterThan(0);
  });

  it("returns early when there is no structured data and no canonical url", () => {
    const { container } = render(
      <ComprehensiveSEO structuredData={[]} trackPageView={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("falls back when structured data cannot be serialized (circular)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const circular: Record<string, unknown> = { "@type": "Thing" };
    circular.self = circular; // JSON.stringify throws
    render(
      <ComprehensiveSEO
        structuredData={[circular]}
        canonicalUrl="https://hilmarvanderveen.com/nl"
        locale="nl"
      />
    );
    expect(error).toHaveBeenCalled(); // fallback also fails on circular data
    warn.mockRestore();
    error.mockRestore();
  });

  it("warns when the canonical url is malformed (hreflang)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <ComprehensiveSEO
        structuredData={[]}
        canonicalUrl="::: not a url :::"
        locale="en"
      />
    );
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
