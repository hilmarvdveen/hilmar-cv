import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CallToActionSection } from "./CallToActionSection";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("CallToActionSection", () => {
  it("renders the band copy with a single booking action", () => {
    render(<CallToActionSection />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("title");
    expect(screen.getByText("subtitle")).toBeInTheDocument();
    expect(screen.getByText("button").closest("a")).toHaveAttribute("href", "/book");
  });

  it("offers no competing secondary button", () => {
    const { container } = render(<CallToActionSection />);
    expect(container.querySelectorAll("a")).toHaveLength(1);
  });
});
