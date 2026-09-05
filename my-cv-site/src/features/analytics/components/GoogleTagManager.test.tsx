import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render } from "@testing-library/react";
import { GoogleTagManager } from "./GoogleTagManager";
import { storeConsent } from "../consentStore";

vi.mock("next/script", () => ({
  default: (properties: Record<string, unknown>) => <script data-id={String(properties.id ?? "")} />,
}));

beforeEach(() => localStorage.clear());

describe("GoogleTagManager", () => {
  it("renders nothing until the visitor has consented", () => {
    const { container } = render(<GoogleTagManager gtmId="GTM-XYZ" />);
    expect(container.querySelector("script")).toBeNull();
  });

  it("renders the GTM script when consent was stored earlier", () => {
    localStorage.setItem("analytics-consent", "granted");
    const { container } = render(<GoogleTagManager gtmId="GTM-XYZ" />);
    expect(container.querySelector("script[data-id='gtm-script']")).toBeTruthy();
  });

  it("starts loading the moment consent is granted on the page, and not on a refusal", () => {
    const { container } = render(<GoogleTagManager gtmId="GTM-XYZ" />);
    act(() => storeConsent(false));
    expect(container.querySelector("script")).toBeNull();
    act(() => storeConsent(true));
    expect(container.querySelector("script[data-id='gtm-script']")).toBeTruthy();
  });
});
