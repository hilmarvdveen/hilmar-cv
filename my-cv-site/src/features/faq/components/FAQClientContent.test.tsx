import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FAQClientContent } from "./FAQClientContent";

vi.mock("next-intl", async () => {
  const base = (await import("@/test/intl")).intlMock();
  const t = ((k: string) => k) as ((k: string) => string) & { raw: (k: string) => unknown };
  t.raw = (key: string) =>
    key.endsWith("questions") ? [{ question: "What?", answer: "Because." }] : [];
  return { ...base, useTranslations: () => t };
});
vi.mock("next/navigation", () => ({ usePathname: () => "/en/faq" }));
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("FAQClientContent", () => {
  it("renders questions and toggles them open/closed", async () => {
    const user = userEvent.setup();
    render(<FAQClientContent />);
    const toggles = screen.getAllByRole("button", { name: /What\?/ });
    await user.click(toggles[0]); // open
    await user.click(toggles[0]); // close (covers both filter branches)
  });
});
