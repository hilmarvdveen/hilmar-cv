import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { ClientLogosCarousel } from "./ClientLogosCarousel";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: (p: Record<string, unknown>) => <img alt="" src={String(p.src ?? "")} />,
}));

describe("ClientLogosCarousel", () => {
  it("renders client logos", () => {
    const { container } = render(<ClientLogosCarousel />);
    expect(container.firstChild).toBeTruthy();
  });

  it("links every client to its engagement on the experience page", () => {
    const { container } = render(<ClientLogosCarousel />);
    const links = container.querySelectorAll('a[href^="/experience#experience-"]');
    expect(links.length).toBe(12);
    // including the special-cased id mapping and the new flagship entry
    expect(
      container.querySelector('a[href="/experience#experience-postcode-loterij"]')
    ).toBeTruthy();
    expect(
      container.querySelector('a[href="/experience#experience-belastingdienst"]')
    ).toBeTruthy();
    expect(container.querySelector('a[href="/experience#experience-bol"]')).toBeTruthy();
  });

  it("renders bol.com as a text wordmark until a logo asset exists", () => {
    const { getByText } = render(<ClientLogosCarousel />);
    expect(getByText("bol.com")).toBeInTheDocument();
  });
});
