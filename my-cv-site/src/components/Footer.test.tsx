import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
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

  it("does not list a booking link among the quick links", () => {
    render(<Footer />);
    expect(
      screen.queryByRole("link", { name: "quickLinks.items.book" })
    ).toBeNull();
  });

  it("does not render a booking link in the services column", () => {
    render(<Footer />);
    expect(
      screen.queryByRole("link", { name: "services.bookConsultation" })
    ).toBeNull();
  });

  it("renders the logo mark with the shared logo alt text", () => {
    render(<Footer />);
    expect(screen.getByAltText("images.logoAlt")).toBeInTheDocument();
  });

  it("does not render the built-with or location blocks", () => {
    render(<Footer />);
    expect(screen.queryByText("bottom.builtWith")).toBeNull();
    expect(screen.queryByText("bottom.location.netherlands")).toBeNull();
    expect(screen.queryByText("bottom.location.euBased")).toBeNull();
  });
});
