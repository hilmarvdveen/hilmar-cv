import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FitBooking } from "./FitBooking";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    "data-placement"?: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("FitBooking", () => {
  it("closes the page with one booking button carrying the report placement", () => {
    render(<FitBooking />);
    expect(
      screen.getByRole("heading", { level: 2, name: "report.bookTitle" })
    ).toBeInTheDocument();
    expect(screen.getByText("report.bookText")).toBeInTheDocument();
    const booking = screen.getByRole("link", { name: "report.bookButton" });
    expect(booking).toHaveAttribute("href", "/book");
    expect(booking).toHaveAttribute("data-placement", "fit-report");
  });

  it("takes the card fill from the band it closes", () => {
    render(<FitBooking cardVariant="default" />);
    expect(
      screen.getByRole("heading", { level: 2, name: "report.bookTitle" }).parentElement
    ).toHaveClass("bg-white");
  });
});
