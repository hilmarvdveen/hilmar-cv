import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CompactEngagementCard } from "./CompactEngagementCard";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const renderCard = (anchorId?: string) =>
  render(
    <CompactEngagementCard
      id="belastingdienst"
      logo="belastingdienst.svg"
      logoAlt="Logo of Belastingdienst"
      company="Belastingdienst"
      metaLine="Apeldoorn"
      summary="A new tax form went from months to days."
      readMoreLabel="Read the whole engagement at Belastingdienst"
      anchorId={anchorId}
    />
  );

describe("CompactEngagementCard", () => {
  it("names the company as a heading, shows the context line and the outcome, and links to the engagement page", () => {
    renderCard();

    expect(screen.getByRole("heading", { level: 3, name: "Belastingdienst" })).toBeInTheDocument();
    expect(screen.getByText("Apeldoorn")).toBeInTheDocument();
    expect(screen.getByText("A new tax form went from months to days.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read the whole engagement at Belastingdienst" })).toHaveAttribute(
      "href",
      "/experience/belastingdienst"
    );
    expect(screen.getByRole("img", { name: "Logo of Belastingdienst" })).toHaveAttribute(
      "src",
      "/logos/belastingdienst.svg"
    );
  });

  it("carries the anchor id on its article when one is given, and none otherwise", () => {
    const { unmount } = renderCard("experience-belastingdienst");
    expect(screen.getByRole("article")).toHaveAttribute("id", "experience-belastingdienst");
    unmount();

    renderCard();
    expect(screen.getByRole("article")).not.toHaveAttribute("id");
  });
});
