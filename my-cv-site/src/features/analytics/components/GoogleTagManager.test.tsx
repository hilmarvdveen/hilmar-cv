import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render } from "@testing-library/react";
import { GoogleTagManager } from "./GoogleTagManager";
import { ANALYTICS_CONSENT_EVENT } from "./GoogleAnalytics";

vi.mock("next/script", () => ({
  default: (p: Record<string, unknown>) => <script data-id={String(p.id ?? "")} />,
}));

beforeEach(() => localStorage.clear());

describe("GoogleTagManager", () => {
  it("renders nothing until the visitor has consented", () => {
    const { container } = render(<GoogleTagManager gtmId="GTM-XYZ" />);
    expect(container.querySelector("script")).toBeNull();
  });

  it("renders the GTM script when consent was stored earlier", () => {
    localStorage.setItem("ga-consent", "granted");
    const { container } = render(<GoogleTagManager gtmId="GTM-XYZ" />);
    expect(container.querySelector("script[data-id='gtm-script']")).toBeTruthy();
  });

  it("starts loading the moment consent is granted on the page", () => {
    const { container } = render(<GoogleTagManager gtmId="GTM-XYZ" />);
    act(() => {
      window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: false }));
    });
    expect(container.querySelector("script")).toBeNull();
    act(() => {
      window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: true }));
    });
    expect(container.querySelector("script[data-id='gtm-script']")).toBeTruthy();
  });
});
