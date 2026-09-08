import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutPageContent } from "./AboutPageContent";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";

const standardsCards = [
  { title: "Certified Secure", body: "Security body" },
  { title: "WCAG per engagement", body: "Accessibility body" },
  { title: "Privacy and AI", body: "Privacy body" },
];

const routes: Record<string, string> = { "value.link.href": "/experience" };

vi.mock("next-intl", () => {
  const t = ((key: string, values?: Record<string, number | string>) =>
    routes[key] ?? (values ? `${key}:${Object.values(values).join(",")}` : key)) as ((
    key: string
  ) => string) & { raw: (key: string) => unknown };
  t.raw = (key: string) => (key === "standards.cards" ? standardsCards : []);
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

vi.mock("@/components/Breadcrumb", () => ({
  Breadcrumb: () => <nav aria-label="breadcrumb" />,
}));

vi.mock("@/features/home", () => ({
  CvDownloadTrigger: ({ label }: { label: string }) => (
    <button type="button">{label}</button>
  ),
}));

vi.mock("./AboutValueList", () => ({
  AboutValueList: () => <p>value list</p>,
}));

vi.mock("./AboutHiringFacts", () => ({
  AboutHiringFacts: () => <p>hiring facts</p>,
}));

vi.mock("./NetherlandsMap", () => ({
  NetherlandsMap: () => <p>Netherlands map</p>,
}));

const follows = (first: Element, second: Element) =>
  Boolean(
    first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING
  );

describe("AboutPageContent", () => {
  it("renders the hero title as the page heading, with the breadcrumb and the badge", () => {
    render(<AboutPageContent />);
    expect(
      screen.getByRole("heading", { level: 1, name: "hero.title" })
    ).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "breadcrumb" })).toBeInTheDocument();
    expect(screen.getByText("hero.badge")).toBeInTheDocument();
    expect(screen.getByText("hero.lead")).toBeInTheDocument();
  });

  it("names the portrait lockup in text and leaves the image without a duplicate name", () => {
    render(<AboutPageContent />);
    expect(screen.getByText(BUSINESS_PROFILE.NAME)).toBeInTheDocument();
    expect(screen.getByText("hero.role")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: BUSINESS_PROFILE.NAME })).toBeNull();
  });

  it("books the call once from the hero and once from the close", () => {
    render(<AboutPageContent />);
    const bookingLinks = screen.getAllByRole("link", { name: "cta.button" });
    expect(bookingLinks).toHaveLength(2);
    for (const link of bookingLinks) {
      expect(link).toHaveAttribute("href", "/book");
    }
    const heroHeading = screen.getByRole("heading", { level: 1 });
    const hiringHeading = screen.getByRole("heading", { name: "hiring.title" });
    expect(follows(heroHeading, bookingLinks[0])).toBe(true);
    expect(follows(bookingLinks[0], hiringHeading)).toBe(true);
    expect(follows(hiringHeading, bookingLinks[1])).toBe(true);
    expect(bookingLinks[0]).toHaveAttribute("data-placement", "about-hero");
    expect(bookingLinks[1]).toHaveAttribute("data-placement", "about-close");
  });

  it("jumps from the hero to the practical section", () => {
    render(<AboutPageContent />);
    const factsLink = screen.getByRole("link", { name: "hero.factsLink" });
    expect(factsLink).toHaveAttribute("href", "#about-hiring");
    expect(factsLink).toHaveAttribute("data-placement", "about-hero-facts");
  });

  it("offers the CV in the hero and again under the practical facts", () => {
    render(<AboutPageContent />);
    expect(screen.getByRole("button", { name: "hero.cv" })).toBeInTheDocument();
    const hiringHeading = screen.getByRole("heading", { name: "hiring.title" });
    const hiringCv = screen.getByRole("button", { name: "hiring.cv" });
    expect(follows(hiringHeading, hiringCv)).toBe(true);
  });

  it("keeps the LinkedIn profile in the practical link row", () => {
    render(<AboutPageContent />);
    const linkedin = screen.getByRole("link", { name: "hiring.linkedin" });
    expect(linkedin).toHaveAttribute("href", BUSINESS_PROFILE.SOCIAL.LINKEDIN);
    expect(linkedin).toHaveAttribute("data-placement", "about-hiring-linkedin");
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
    const hiringCv = screen.getByRole("button", { name: "hiring.cv" });
    expect(follows(hiringCv, linkedin)).toBe(true);
  });

  it("sends the rate question to the FAQ", () => {
    render(<AboutPageContent />);
    const rateLink = screen.getByRole("link", { name: "hiring.rateLink" });
    expect(rateLink).toHaveAttribute("href", "/faq");
    expect(rateLink).toHaveAttribute("data-placement", "about-hiring-rate");
  });

  it("links the whole work history under the five changes", () => {
    render(<AboutPageContent />);
    expect(screen.getByText("value list")).toBeInTheDocument();
    const experienceLink = screen.getByRole("link", { name: "value.link.label" });
    expect(experienceLink).toHaveAttribute("href", "/experience");
    expect(experienceLink).toHaveAttribute("data-placement", "about-experience");
  });

  it("renders the record as three cards with their own headings", () => {
    render(<AboutPageContent />);
    for (const card of standardsCards) {
      expect(
        screen.getByRole("heading", { level: 3, name: card.title })
      ).toBeInTheDocument();
      expect(screen.getByText(card.body)).toBeInTheDocument();
    }
  });

  it("puts the map between the record and the practical section, with counted subtitle", () => {
    render(<AboutPageContent />);
    const standardsHeading = screen.getByRole("heading", { name: "standards.title" });
    const mapHeading = screen.getByRole("heading", { name: "map.title" });
    const hiringHeading = screen.getByRole("heading", { name: "hiring.title" });
    expect(follows(standardsHeading, mapHeading)).toBe(true);
    expect(follows(mapHeading, hiringHeading)).toBe(true);
    expect(follows(mapHeading, screen.getByText("Netherlands map"))).toBe(true);
    expect(screen.getByText(/^map\.subtitle:\d+,\d+,\d+$/)).toBeInTheDocument();
  });

  it("shows the practical facts under the intro", () => {
    render(<AboutPageContent />);
    const intro = screen.getByText("hiring.intro");
    expect(follows(intro, screen.getByText("hiring facts"))).toBe(true);
  });

  it("offers the contact form as the alternative in the close", () => {
    render(<AboutPageContent />);
    expect(
      screen.getByRole("heading", { level: 2, name: "cta.title" })
    ).toBeInTheDocument();
    expect(screen.getByText("cta.alternativeLead")).toBeInTheDocument();
    const contactLink = screen.getByRole("link", { name: "cta.alternativeLink" });
    expect(contactLink).toHaveAttribute("href", "/contact");
    expect(contactLink).toHaveAttribute("data-placement", "about-close-contact");
  });

  it("leaves no retired hero row on the page", () => {
    render(<AboutPageContent />);
    expect(screen.queryByText("hero.description")).toBeNull();
    expect(screen.queryByText("hero.location")).toBeNull();
    expect(screen.queryByText("hero.education")).toBeNull();
    expect(screen.queryByText("hero.linkedin")).toBeNull();
    expect(screen.queryByText("map.contactLine")).toBeNull();
  });
});
