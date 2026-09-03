import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FAQClientContent } from "./FAQClientContent";

vi.mock("next-intl", async () => {
  const base = (await import("@/test/intl")).intlMock();
  const t = ((key: string) => key) as ((key: string) => string) & {
    raw: (key: string) => unknown;
  };
  t.raw = (key: string) =>
    key.endsWith("questions") ? [{ question: "What?", answer: "Because." }] : [];
  return { ...base, useTranslations: () => t };
});

describe("FAQClientContent", () => {
  it("renders questions and toggles them open/closed", async () => {
    const user = userEvent.setup();
    render(<FAQClientContent />);
    const toggles = screen.getAllByRole("button", { name: /What\?/ });
    await user.click(toggles[0]);
    await user.click(toggles[0]);
  });

  it("renders the closing CTA as links to contact, book and a phone call", () => {
    render(<FAQClientContent />);
    expect(screen.getByRole("link", { name: "cta.contact" })).toHaveAttribute(
      "href",
      "/contact"
    );
    expect(screen.getByRole("link", { name: "cta.book" })).toHaveAttribute(
      "href",
      "/book"
    );
    expect(screen.getByRole("link", { name: "cta.call" })).toHaveAttribute(
      "href",
      "tel:+31680149947"
    );
  });
});
