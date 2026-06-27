import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { AboutPageContent } from "./AboutPageContent";

vi.mock("next-intl", () => {
  const t = ((k: string) => k) as ((k: string) => string) & { raw: (k: string) => unknown };
  t.raw = (key: string) => {
    if (key === "strengths.items") return [{ title: "Strength", description: "Desc" }];
    if (key === "technical.categories")
      return [{ name: "Languages", technologies: ["TypeScript", "Go"] }];
    return ["point one", "point two"]; // string-array keys
  };
  return { useTranslations: () => t };
});
vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("AboutPageContent", () => {
  it("renders all content blocks (features, strengths, clients, technical)", () => {
    const { container } = render(<AboutPageContent />);
    expect(container.textContent).toContain("Strength");
    expect(container.textContent).toContain("Languages");
    expect(container.textContent).toContain("TypeScript");
  });
});
