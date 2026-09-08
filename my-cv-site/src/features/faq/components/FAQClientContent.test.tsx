import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FAQClientContent } from "./FAQClientContent";
import { FAQ_CATEGORY_IDS } from "../categories";

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
  it("opens the first question of every category on arrival", () => {
    render(<FAQClientContent />);
    const toggles = screen.getAllByRole("button", { name: /What\?/ });
    expect(toggles).toHaveLength(FAQ_CATEGORY_IDS.length);
    toggles.forEach((toggle) =>
      expect(toggle).toHaveAttribute("aria-expanded", "true")
    );
    expect(screen.getAllByText("Because.")).toHaveLength(
      FAQ_CATEGORY_IDS.length
    );
  });

  it("toggles a question closed and open again", async () => {
    const user = userEvent.setup();
    render(<FAQClientContent />);
    const [firstToggle] = screen.getAllByRole("button", { name: /What\?/ });

    await user.click(firstToggle);
    expect(firstToggle).toHaveAttribute("aria-expanded", "false");

    await user.click(firstToggle);
    expect(firstToggle).toHaveAttribute("aria-expanded", "true");
  });

  it("renders each category tile as a jump link to its section", () => {
    render(<FAQClientContent />);
    for (const id of FAQ_CATEGORY_IDS) {
      const link = screen.getByRole("link", { name: `categories.${id}.title` });
      expect(link).toHaveAttribute("href", `#${id}`);
    }
  });

  it("renders the closing call-to-action as one primary booking button and a plain contact link", () => {
    render(<FAQClientContent />);
    const bookLink = screen.getByRole("link", { name: "cta.book" });
    expect(bookLink).toHaveAttribute("href", "/book");

    const contactLink = screen.getByRole("link", { name: "cta.contact" });
    expect(contactLink).toHaveAttribute("href", "/contact");

    expect(
      screen.queryByRole("link", { name: "cta.call" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "cta.call" })
    ).not.toBeInTheDocument();
  });

  it("keeps every answer in the document and only hides a closed one", () => {
    render(<FAQClientContent />);
    const [question] = screen.getAllByRole("button", { name: "What?" });
    const [answer] = screen.getAllByText("Because.");
    expect(answer).toBeVisible();
    fireEvent.click(question);
    expect(question).toHaveAttribute("aria-expanded", "false");
    expect(answer).toBeInTheDocument();
    expect(answer).not.toBeVisible();
  });
});
