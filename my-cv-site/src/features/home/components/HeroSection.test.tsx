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
  // eslint-disable-next-line @next/next/no-img-element
  default: (p: Record<string, unknown>) => <img alt="" src={String(p.src ?? "")} />,
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
});
