import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { AboutSection } from "./AboutSection";

vi.mock("next-intl", () => {
  const t = ((k: string) => k) as ((k: string) => string) & { raw: () => string[] };
  t.raw = () => ["item one", "item two"];
  return { useTranslations: () => t };
});
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("AboutSection", () => {
  it("renders tiles with their items", () => {
    const { container } = render(<AboutSection />);
    expect(container.firstChild).toBeTruthy();
    expect(container.textContent).toContain("item one");
  });
});
