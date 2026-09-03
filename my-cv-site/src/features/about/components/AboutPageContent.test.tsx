import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutPageContent } from "./AboutPageContent";

vi.mock("next-intl", () => {
  const t = ((key: string) => key) as ((key: string) => string) & {
    raw: (key: string) => unknown;
  };
  t.raw = (key: string) => {
    if (key === "value.blocks") {
      return [
        { title: "Block one", body: "Body one", evidence: "Evidence one" },
        { title: "Block two", body: "Body two", evidence: "Evidence two" },
      ];
    }
    return [];
  };
  return { useTranslations: () => t, useLocale: () => "en" };
});

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/features/home", () => ({
  CvDownloadTrigger: ({ label }: { label: string }) => (
    <button type="button">{label}</button>
  ),
}));

vi.mock("./NetherlandsMap", () => ({
  NetherlandsMap: () => <div>Netherlands map</div>,
}));

describe("AboutPageContent", () => {
  it("renders the hero title as the page heading", () => {
    render(<AboutPageContent />);
    expect(
      screen.getByRole("heading", { level: 1, name: "hero.title" })
    ).toBeInTheDocument();
  });

  it("renders every value block title, body and evidence line", () => {
    render(<AboutPageContent />);
    expect(screen.getByText("Block one")).toBeInTheDocument();
    expect(screen.getByText("Body one")).toBeInTheDocument();
    expect(screen.getByText("Evidence one")).toBeInTheDocument();
    expect(screen.getByText("Block two")).toBeInTheDocument();
  });

  it("links to LinkedIn from the hero", () => {
    render(<AboutPageContent />);
    const link = screen.getByRole("link", { name: "hero.linkedin" });
    expect(link).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/hilmar-van-der-veen/"
    );
  });

  it("renders the CV download trigger with the hero label", () => {
    render(<AboutPageContent />);
    expect(screen.getByRole("button", { name: "hero.cv" })).toBeInTheDocument();
  });

  it("renders the Netherlands map alongside the booking call to action", () => {
    render(<AboutPageContent />);
    expect(screen.getByText("Netherlands map")).toBeInTheDocument();
    const bookLinks = screen.getAllByRole("link", { name: "book" });
    expect(bookLinks.length).toBeGreaterThan(0);
    for (const link of bookLinks) {
      expect(link).toHaveAttribute("href", "/book");
    }
  });

  it("renders the closing heading and call to action", () => {
    render(<AboutPageContent />);
    expect(
      screen.getByRole("heading", { level: 2, name: "cta.title" })
    ).toBeInTheDocument();
  });
});
