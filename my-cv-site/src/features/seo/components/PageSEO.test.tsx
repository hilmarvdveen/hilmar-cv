import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { PageSEO, withPageSEO } from "./PageSEO";

afterEach(() => vi.unstubAllGlobals());

describe("PageSEO", () => {
  it("renders schema scripts, tracks page view and calls onMount", () => {
    const gtag = vi.fn();
    vi.stubGlobal("gtag", gtag);
    const onMount = vi.fn();
    const { container } = render(
      <PageSEO structuredData={[{ "@type": "WebSite" }]} onMount={onMount} />
    );
    expect(container.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
    expect(gtag).toHaveBeenCalled();
    expect(onMount).toHaveBeenCalled();
  });

  it("skips tracking when trackPageView is false", () => {
    const gtag = vi.fn();
    vi.stubGlobal("gtag", gtag);
    render(<PageSEO structuredData={[]} trackPageView={false} />);
    expect(gtag).not.toHaveBeenCalled();
  });
});

describe("withPageSEO", () => {
  it("wraps a component and maps its structured data", () => {
    const Wrapped = withPageSEO(
      () => <div>page</div>,
      () => ({ structuredData: [{ type: "WebSite", data: { name: "x" } }] }) as never
    );
    const { container, getByText } = render(<Wrapped />);
    expect(getByText("page")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).toBeTruthy();
  });

  it("falls back to an empty schema list when none is provided", () => {
    const Wrapped = withPageSEO(
      () => <div>page</div>,
      () => ({}) as never
    );
    const { container } = render(<Wrapped />);
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });
});
