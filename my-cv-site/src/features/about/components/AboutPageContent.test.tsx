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
        {
          title: "Block one",
          body: "Body one",
          evidence: "Evidence one",
          article: { href: "/blog/rxjs-versus-signals-in-angular", label: "Article one" },
        },
        { title: "Block two", body: "Body two", evidence: "Evidence two" },
      ];
    }
    if (key === "standards.cards") {
      return [
        { title: "Security", body: "Security body" },
        { title: "Accessibility and privacy", body: "Accessibility body" },
        { title: "Verification and handover", body: "Verification body" },
      ];
    }
    return [];
  };
  return { useTranslations: () => t, useLocale: () => "en" };
});

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
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

  it("orders the hero actions as book, then LinkedIn, then the CV download", () => {
    render(<AboutPageContent />);
    const bookLink = screen.getAllByRole("link", { name: "cta.button" })[0];
    const linkedinLink = screen.getByRole("link", { name: "hero.linkedin" });
    const cvButton = screen.getByRole("button", { name: "hero.cv" });

    expect(bookLink).toHaveAttribute("href", "/book");
    expect(
      bookLink.compareDocumentPosition(linkedinLink) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      linkedinLink.compareDocumentPosition(cvButton) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it("renders the standards prose as three cards", () => {
    render(<AboutPageContent />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Security" })
    ).toBeInTheDocument();
    expect(screen.getByText("Security body")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Accessibility and privacy",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Verification and handover",
      })
    ).toBeInTheDocument();
  });

  it("renders the Netherlands map alongside the booking call to action", () => {
    render(<AboutPageContent />);
    expect(screen.getByText("Netherlands map")).toBeInTheDocument();
    const bookLinks = screen.getAllByRole("link", { name: "cta.button" });
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
  it("links the article a value block names and leaves the other blocks without one", () => {
    render(<AboutPageContent />);
    const articleLink = screen.getByRole("link", { name: "Article one" });
    expect(articleLink).toHaveAttribute("href", "/blog/rxjs-versus-signals-in-angular");
    expect(articleLink).toHaveAttribute("data-placement", "about-mentoring-article");
    expect(screen.queryByRole("link", { name: /Article two/ })).not.toBeInTheDocument();
  });

});
