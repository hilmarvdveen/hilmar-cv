import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { ProjectShowcase } from "./ProjectShowcase";

vi.mock("next-intl", () => {
  const t = ((k: string) => k) as ((k: string) => string) & { raw: () => string[] };
  // results / technologies are string arrays per case
  t.raw = () => ["Result A", "TypeScript"];
  return { useTranslations: () => t };
});
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("ProjectShowcase", () => {
  it("renders cases with results and technologies", () => {
    const { container } = render(<ProjectShowcase />);
    expect(container.firstChild).toBeTruthy();
    expect(container.textContent).toContain("Result A");
  });
});
