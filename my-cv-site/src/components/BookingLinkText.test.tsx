import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookingLinkText } from "./BookingLinkText";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("BookingLinkText", () => {
  it("renders the booking tag as a link to the booking page inside the text", () => {
    render(
      <p>
        <BookingLinkText text="Available immediately. <book>Book a call</book>." />
      </p>
    );
    const link = screen.getByRole("link", { name: "Book a call" });
    expect(link).toHaveAttribute("href", "/book");
    expect(link).toHaveClass("underline");
    expect(link.parentElement).toHaveTextContent("Available immediately. Book a call.");
  });

  it("renders text without the tag unchanged and without a link", () => {
    render(
      <p>
        <BookingLinkText text="I am Hilmar van der Veen." />
      </p>
    );
    expect(screen.getByText("I am Hilmar van der Veen.")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
