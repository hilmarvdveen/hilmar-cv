import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LegalDocument } from "./LegalDocument";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";
import type { LegalDoc } from "../legalContent";

const doc: LegalDoc = {
  title: "Test Policy",
  lastUpdated: "27 June 2026",
  intro: "Intro paragraph.",
  sections: [
    { heading: "With paragraphs", paragraphs: ["Para one.", "Para two."] },
    { heading: "With bullets", bullets: ["Bullet one.", "Bullet two."] },
    { heading: "Heading only" },
  ],
};

describe("LegalDocument", () => {
  it("renders the title, last-updated, intro and all section variants", () => {
    render(<LegalDocument doc={doc} lastUpdatedLabel="Last updated" />);
    expect(screen.getByRole("heading", { level: 1, name: "Test Policy" })).toBeInTheDocument();
    expect(screen.getByText(/Last updated: 27 June 2026/)).toBeInTheDocument();
    expect(screen.getByText("Intro paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Para one.")).toBeInTheDocument();
    expect(screen.getByText("Bullet two.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Heading only" })).toBeInTheDocument();
  });

  it("renders without an intro", () => {
    const { container } = render(
      <LegalDocument doc={{ ...doc, intro: undefined }} lastUpdatedLabel="Bijgewerkt" />
    );
    expect(container.textContent).not.toContain("Intro paragraph.");
    expect(screen.getByText(/Bijgewerkt:/)).toBeInTheDocument();
  });

  it("renders the contact email as a mailto link wherever it appears in a paragraph", () => {
    const email = BUSINESS_PROFILE.CONTACT.EMAIL;
    const docWithEmail: LegalDoc = {
      ...doc,
      sections: [{ heading: "Contact", paragraphs: [`Email me at ${email} any time.`] }],
    };
    render(<LegalDocument doc={docWithEmail} lastUpdatedLabel="Last updated" />);
    const link = screen.getByRole("link", { name: email });
    expect(link).toHaveAttribute("href", `mailto:${email}`);
    expect(link).not.toHaveAttribute("target");
    expect(screen.getByText(/^Email me at/)).toBeInTheDocument();
  });

  it("renders the contact email as a mailto link wherever it appears in a bullet or the intro", () => {
    const email = BUSINESS_PROFILE.CONTACT.EMAIL;
    const docWithEmailEverywhere: LegalDoc = {
      ...doc,
      intro: `Reach me at ${email} for anything.`,
      sections: [{ heading: "Details", bullets: [`Email: ${email}`] }],
    };
    render(<LegalDocument doc={docWithEmailEverywhere} lastUpdatedLabel="Last updated" />);
    expect(screen.getAllByRole("link", { name: email })).toHaveLength(2);
  });

  it("renders the supervisory authority name as an external link", () => {
    const docWithAuthority: LegalDoc = {
      ...doc,
      sections: [
        {
          heading: "Complaints",
          bullets: ["You may complain to the Autoriteit Persoonsgegevens at any time."],
        },
      ],
    };
    render(<LegalDocument doc={docWithAuthority} lastUpdatedLabel="Last updated" />);
    const link = screen.getByRole("link", { name: "Autoriteit Persoonsgegevens" });
    expect(link).toHaveAttribute("href", "https://www.autoriteitpersoonsgegevens.nl/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
