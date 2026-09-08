import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "./HeroSection";

vi.mock("next-intl", () => {
  const makeT = () => {
    const t = ((key: string) => key) as ((key: string) => string) & {
      raw: (key: string) => unknown;
    };
    t.raw = (key: string) =>
      key === "chips" ? ["10+ years senior since 2016", "bol.com, extended three times"] : [];
    return t;
  };
  return {
    useTranslations: () => makeT(),
    useLocale: () => "en",
    useMessages: () => ({}),
  };
});
vi.mock("next/dynamic", () => ({ default: () => () => null }));
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("next/image", () => ({
  default: (properties: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={String(properties.alt ?? "")}
      className={String(properties.className ?? "")}
      src={String(properties.src ?? "")}
    />
  ),
}));

describe("HeroSection", () => {
  it("renders the availability badge, heading, credentials and fact chips", () => {
    render(<HeroSection />);
    expect(screen.getByText("badge")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("heading");
    expect(screen.getByText("credentials")).toBeInTheDocument();
    expect(screen.getByText("10+ years senior since 2016")).toBeInTheDocument();
    expect(screen.getByText("bol.com, extended three times")).toBeInTheDocument();
  });

  it("points the primary action at the booking page", () => {
    render(<HeroSection />);
    const bookLink = screen.getByText("bookCall").closest("a");
    expect(bookLink).toHaveAttribute("href", "/book");
  });

  it("offers the CV download as a quiet secondary action", () => {
    render(<HeroSection />);
    expect(screen.getByRole("button", { name: "downloadCv" })).toBeInTheDocument();
  });

  it("renders the reader line above the headline", () => {
    render(<HeroSection />);
    expect(screen.getByText("readerLine")).toBeInTheDocument();
  });

  it("renders the CTA note under the button row", () => {
    render(<HeroSection />);
    expect(screen.getByText("ctaNote")).toBeInTheDocument();
  });

  it("hides the reader line on phones and shows it from sm so the button clears the fold", () => {
    render(<HeroSection />);
    expect(screen.getByText("readerLine")).toHaveClass("hidden", "sm:block");
  });

  it("shrinks the byline face to 48px on phones", () => {
    render(<HeroSection />);
    expect(screen.getByAltText("imageAlt")).toHaveClass("h-12", "w-12");
  });

  it("renders the availability line without a button-like pill", () => {
    render(<HeroSection />);
    const badge = screen.getByText("badge");
    expect(badge.className).not.toContain("border");
    expect(badge.className).not.toContain("bg-emerald-500/10");
    expect(badge.className).not.toContain("rounded-full");
    expect(badge.className).toContain("text-emerald-300");
  });

  it("renders the fact chips without a border or fill so they read as a checked list", () => {
    render(<HeroSection />);
    const chip = screen.getByText("10+ years senior since 2016").closest("li");
    expect(chip).not.toBeNull();
    expect(chip?.className).not.toContain("border-white/10");
    expect(chip?.className).not.toContain("bg-white/5");
  });

  it("links the recruiter facts under the chip row to the hiring section", () => {
    render(<HeroSection />);
    const link = screen.getByRole("link", { name: "factsLink" });
    expect(link).toHaveAttribute("href", "#hiring-heading");
    expect(link).toHaveAttribute("data-placement", "hero-facts");
  });
});
