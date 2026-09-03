import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactHero } from "./ContactHero";

const facts = [
  { label: "Availability", value: "From 1 October 2026" },
  { label: "Response time", value: "Within one business day" },
];

vi.mock("next-intl", () => {
  const t = ((key: string) => key) as ((key: string) => string) & {
    raw: (key: string) => unknown;
  };
  t.raw = (key: string) => (key === "facts.items" ? facts : []);
  return { useTranslations: () => t, useLocale: () => "en" };
});

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

describe("ContactHero", () => {
  it("renders the hero title as the page heading", () => {
    render(<ContactHero />);
    expect(
      screen.getByRole("heading", { level: 1, name: "hero.title" })
    ).toBeInTheDocument();
  });

  it("links the primary and secondary actions", () => {
    render(<ContactHero />);
    expect(screen.getByRole("link", { name: "book" })).toHaveAttribute(
      "href",
      "/book"
    );
    expect(screen.getByRole("link", { name: "cta.write" })).toHaveAttribute(
      "href",
      "#contact-form"
    );
  });

  it("renders every fact label and value in the aside", () => {
    render(<ContactHero />);
    for (const fact of facts) {
      expect(screen.getByText(fact.label)).toBeInTheDocument();
      expect(screen.getByText(fact.value)).toBeInTheDocument();
    }
  });

  it("renders the email, phone, WhatsApp and location lines from the business profile", () => {
    render(<ContactHero />);
    expect(
      screen.getByRole("link", { name: "hilmar@hilmarvanderveen.com" })
    ).toHaveAttribute("href", "mailto:hilmar@hilmarvanderveen.com");

    const phoneLinks = screen.getAllByRole("link", { name: "+31 6 8014 9947" });
    expect(phoneLinks).toHaveLength(2);
    expect(phoneLinks[0]).toHaveAttribute("href", "tel:+31680149947");
    expect(phoneLinks[1]).toHaveAttribute("href", "https://wa.me/31680149947");

    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("info.locationValue")).toBeInTheDocument();
  });
});
