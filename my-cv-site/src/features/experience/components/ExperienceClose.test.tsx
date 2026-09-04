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
  it("renders the closing heading, description and the booking action", () => {
    render(<ExperienceClose />);
    const heading = screen.getByRole("heading", { level: 2, name: "close.title" });
    expect(heading).toHaveAttribute("id", "experience-close-heading");
    expect(screen.getByText("close.description")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "close.button" });
    expect(link).toHaveAttribute("href", "/book");
  });
});
