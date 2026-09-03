import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Footer", () => {
  it("renders all footer sections", () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toBeTruthy();
    expect(container.querySelectorAll("a").length).toBeGreaterThan(0);
  });

  it("lists the four legal links in the bottom bar", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: "legal.items.privacy" })
    ).toHaveAttribute("href", "/privacy");
    expect(
      screen.getByRole("link", { name: "legal.items.terms" })
    ).toHaveAttribute("href", "/terms");
    expect(
      screen.getByRole("link", { name: "legal.items.cookies" })
    ).toHaveAttribute("href", "/cookies");
    expect(
      screen.getByRole("link", { name: "legal.items.disclaimer" })
    ).toHaveAttribute("href", "/disclaimer");
  });
});
