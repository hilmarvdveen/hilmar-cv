import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { StructuredData, SingleStructuredData, RawStructuredData } from "./StructuredData";

afterEach(() => vi.unstubAllEnvs());

describe("StructuredData", () => {
  it("renders one script per schema", () => {
    const { container } = render(
      <StructuredData schemas={[{ "@type": "WebSite" }, { "@type": "Person" }]} className="ld" />
    );
    expect(container.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(2);
  });

  it("renders nothing for an empty schema list", () => {
    const { container } = render(<StructuredData schemas={[]} />);
    expect(container.querySelector("script")).toBeNull();
  });

  it("logs in development mode", () => {
    vi.stubEnv("NODE_ENV", "development");
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<StructuredData schemas={[{ "@type": "WebSite" }]} />);
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });
});

describe("SingleStructuredData / RawStructuredData", () => {
  it("renders a single schema script", () => {
    const { container } = render(<SingleStructuredData schema={{ "@type": "Person" }} className="x" />);
    expect(container.querySelector('script[type="application/ld+json"]')).toBeTruthy();
  });

  it("renders raw JSON-LD", () => {
    const { container } = render(<RawStructuredData jsonLd='{"@type":"WebSite"}' />);
    expect(container.querySelector("script")?.innerHTML).toContain("WebSite");
  });
});
