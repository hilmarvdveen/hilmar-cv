import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectsHero } from "./ProjectsHero";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("next/navigation", () => ({ usePathname: () => "/en" }));

describe("ProjectsHero", () => {
  it("renders the hero title as the page heading", () => {
    render(<ProjectsHero />);
    expect(
      screen.getByRole("heading", { level: 1, name: "hero.title" })
    ).toBeInTheDocument();
  });

  it("links the primary action to the booking page", () => {
    render(<ProjectsHero />);
    const link = screen.getByRole("link", { name: "book" });
    expect(link).toHaveAttribute("href", "/book");
  });
});
