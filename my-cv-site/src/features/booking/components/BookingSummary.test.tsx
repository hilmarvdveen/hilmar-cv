import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookingSummary } from "./BookingSummary";
import { INITIAL_BOOKING_DETAILS } from "../context/BookingFormContext";

const RAW_ARRAYS: Record<string, string[]> = {
  expectations: ["Thirty minutes, technical and concrete.", "A clear answer either way."],
  practical: ["Available from 1 October 2026", "KVK 97564303"],
};

vi.mock("next-intl", () => {
  const t = ((key: string) => key) as ((key: string) => string) & {
    raw: (key: string) => unknown;
  };
  t.raw = (key: string) => RAW_ARRAYS[key] ?? [];
  return { useTranslations: () => t, useLocale: () => "en" };
});

describe("BookingSummary", () => {
  it("shows placeholders until the visitor has chosen something", () => {
    render(<BookingSummary details={INITIAL_BOOKING_DETAILS} />);
    expect(screen.getByText("whenEmpty")).toBeInTheDocument();
    expect(screen.getByText("whoEmpty")).toBeInTheDocument();
    expect(screen.getByText("topicEmpty")).toBeInTheDocument();
    expect(screen.getByText("Thirty minutes, technical and concrete.")).toBeInTheDocument();
    expect(screen.getByText("KVK 97564303")).toBeInTheDocument();
  });

  it("renders the chosen moment, person and topic", () => {
    render(
      <BookingSummary
        details={{
          ...INITIAL_BOOKING_DETAILS,
          date: "2026-10-07",
          time: "2026-10-07T08:00:00.000Z",
          name: "Jane Doe",
          company: "Acme",
          topic: "Legacy checkout",
        }}
      />
    );
    expect(screen.getByText("Wednesday, 7 October 2026, 10:00")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe, Acme")).toBeInTheDocument();
    expect(screen.getByText("Legacy checkout")).toBeInTheDocument();
  });

  it("omits the company when only a name is known", () => {
    render(<BookingSummary details={{ ...INITIAL_BOOKING_DETAILS, name: "Jane Doe" }} />);
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("drops the selection card in compact mode", () => {
    render(<BookingSummary details={INITIAL_BOOKING_DETAILS} compact />);
    expect(screen.queryByRole("heading", { name: "title" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "expectTitle" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "hilmar@hilmarvanderveen.com" })).toHaveAttribute(
      "href",
      "mailto:hilmar@hilmarvanderveen.com"
    );
  });
});
