import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { GoogleTagManager } from "./GoogleTagManager";

vi.mock("next/script", () => ({
  default: (p: Record<string, unknown>) => <script data-id={String(p.id ?? "")} />,
}));

describe("GoogleTagManager", () => {
  it("renders the GTM script and seeds the dataLayer", () => {
    const { container } = render(<GoogleTagManager gtmId="GTM-XYZ" />);
    expect(container.querySelector("script")).toBeTruthy();
    expect(Array.isArray(window.dataLayer)).toBe(true);
  });
});
