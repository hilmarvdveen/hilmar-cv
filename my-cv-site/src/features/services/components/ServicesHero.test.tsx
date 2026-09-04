import { describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { ServicesHero } from "./ServicesHero";

const state = vi.hoisted(() => ({ path: "/en/services" }));

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("next/navigation", () => ({ usePathname: () => state.path }));
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, className }: { children: ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("ServicesHero", () => {
  it("renders the page heading as an h1", () => {
    render(<ServicesHero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it.each([
    ["frontend", "/services/frontend"],
    ["fullstack", "/services/fullstack"],
    ["designSystems", "/services/design-systems"],
    ["consulting", "/services/consulting"],
  ])("links the %s card to %s and names its outcome", (id, href) => {
    render(<ServicesHero />);
    const links = screen.getAllByRole("link");
    const link = links.find(
      (candidate) => candidate.getAttribute("href") === href
    );
    expect(link).toBeDefined();
    expect(link).toHaveTextContent(`main.services.${id}.title`);
    expect(link).toHaveTextContent(`main.services.${id}.outcome`);
  });

  it("renders the two hero actions", () => {
    render(<ServicesHero />);
    expect(screen.getByRole("link", { name: "cta.book" })).toHaveAttribute(
      "href",
      "/book"
    );
    expect(screen.getByRole("link", { name: "cta.contact" })).toHaveAttribute(
      "href",
      "/contact"
    );
  });
});
