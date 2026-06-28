import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { ClientLogosCarousel } from "./ClientLogosCarousel";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: (p: Record<string, unknown>) => <img alt="" src={String(p.src ?? "")} />,
}));

describe("ClientLogosCarousel", () => {
  it("renders client logos", () => {
    const { container } = render(<ClientLogosCarousel />);
    expect(container.firstChild).toBeTruthy();
  });

  it("links every logo to its experience anchor on the same page", () => {
    const { container } = render(<ClientLogosCarousel />);
    const links = container.querySelectorAll('a[href^="#experience-"]');
    expect(links.length).toBe(11);
    // including the special-cased id mapping
    expect(container.querySelector('a[href="#experience-postcode-loterij"]')).toBeTruthy();
    expect(container.querySelector('a[href="#experience-belastingdienst"]')).toBeTruthy();
  });
});
