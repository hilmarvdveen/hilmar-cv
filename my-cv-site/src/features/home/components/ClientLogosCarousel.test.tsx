import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
  default: (properties: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={String(properties.alt ?? "")} src={String(properties.src ?? "")} />
  ),
}));

describe("ClientLogosCarousel", () => {
  it("renders every client logo as a link, by role", () => {
    render(<ClientLogosCarousel />);
    expect(screen.getAllByRole("link")).toHaveLength(12);
  });

  it("renders every client logo as an image with an accessible name", () => {
    render(<ClientLogosCarousel />);
    expect(screen.getAllByAltText("images.companyLogoAlt")).toHaveLength(12);
  });

  it("links every client to its engagement on the experience page", () => {
    const { container } = render(<ClientLogosCarousel />);
    const links = container.querySelectorAll('a[href^="/experience/"]');
    expect(links.length).toBe(12);
    expect(
      container.querySelector('a[href="/experience/postcode-loterij"]')
    ).toBeTruthy();
    expect(
      container.querySelector('a[href="/experience/belastingdienst"]')
    ).toBeTruthy();
    expect(container.querySelector('a[href="/experience/bol"]')).toBeTruthy();
    expect(container.querySelector('a[href="/experience/athlon"]')).toBeTruthy();
  });

  it("renders the bol.com logo asset", () => {
    const { container } = render(<ClientLogosCarousel />);
    expect(container.querySelector('img[src="/logos/bol.svg"]')).toBeTruthy();
  });

  it("renders the section heading and the invite line, with the indicator row retired", () => {
    render(<ClientLogosCarousel />);
    expect(screen.getByRole("heading", { level: 2, name: "title" })).toBeInTheDocument();
    expect(screen.getByText("invite")).toBeInTheDocument();
    expect(screen.queryByText("indicator1")).not.toBeInTheDocument();
    expect(screen.queryByText("indicator2")).not.toBeInTheDocument();
    expect(screen.queryByText("indicator3")).not.toBeInTheDocument();
  });

  it("gives every tile a visible resting frame so it reads as a tile", () => {
    const { container } = render(<ClientLogosCarousel />);
    const links = container.querySelectorAll('a[href^="/experience/"]');
    expect(links.length).toBe(12);
    links.forEach((link) => {
      expect(link.className).toContain("ring-gray-300");
      expect(link.className).toContain("shadow-sm");
    });
  });

  it("gives every tile a persistent chevron, hidden from assistive technology", () => {
    const { container } = render(<ClientLogosCarousel />);
    const chevrons = container.querySelectorAll('svg[aria-hidden="true"]');
    expect(chevrons).toHaveLength(12);
  });
});
