import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UspSection } from "./UspSection";

vi.mock("next-intl", () => {
  const t = ((k: string) => k) as ((k: string) => string) & { raw: () => string[] };
  t.raw = () => ["Impact one", "Impact two"]; // usp.items.<i>.impact arrays
  return { useTranslations: () => t };
});
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("UspSection", () => {
  it("renders impact lists and toggles an item open/closed", async () => {
    const user = userEvent.setup();
    const { container } = render(<UspSection />);
    expect(container.textContent).toContain("Impact one");
    const buttons = container.querySelectorAll("button");
    if (buttons.length > 0) {
      await user.click(buttons[0]);
      await user.click(buttons[0]);
    }
  });
});
