import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CloseSection } from "./CloseSection";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
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

describe("CloseSection", () => {
  it("renders the closing ask with the booking action and contact alternative", () => {
    render(<CloseSection />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("title");
    expect(screen.getByText("body")).toBeInTheDocument();
    expect(screen.getByText("button").closest("a")).toHaveAttribute("href", "/book");
    expect(screen.getByText("alternative").closest("a")).toHaveAttribute(
      "href",
      "/contact"
    );
  });

  it("keeps a visible boundary so the close band does not merge into the footer", () => {
    const { container } = render(<CloseSection />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("border-b", "bg-brand-navy-deep");
  });
});
