import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExperienceClose } from "./ExperienceClose";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("ExperienceClose", () => {
  it("renders the closing heading, the shared description and the booking action", () => {
    render(<ExperienceClose />);
    expect(screen.getByRole("region", { name: "close.title" })).toBeInTheDocument();
    const heading = screen.getByRole("heading", { level: 2, name: "close.title" });
    expect(heading).toHaveAttribute("id", "experience-close-heading");
    expect(screen.getByText("close.description")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "close.button" });
    expect(link).toHaveAttribute("href", "/book");
  });

  it("renders the engagement line instead of the shared description when one is given", () => {
    const engagementLine =
      "Bij Ortec kwam die stroom op een scherm samen, en ik hoor graag welk scherm bij jullie het meeste zou opleveren.";
    render(<ExperienceClose description={engagementLine} />);
    expect(screen.getByRole("region", { name: "close.title" })).toBeInTheDocument();
    expect(screen.getByText(engagementLine)).toBeInTheDocument();
    expect(screen.queryByText("close.description")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "close.button" })).toHaveAttribute("href", "/book");
  });
});
