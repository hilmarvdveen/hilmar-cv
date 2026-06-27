import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { WorkExperienceSection } from "./WorkExperienceSection";

vi.mock("next-intl", () => {
  const t = ((k: string, opts?: { defaultValue?: string }) => opts?.defaultValue ?? k) as (
    k: string,
    opts?: { defaultValue?: string }
  ) => string;
  return {
    useTranslations: () => t,
    // Provide a body array for every work-history entry id.
    useMessages: () => ({
      work: new Proxy({}, { get: () => ({ body: [{ paragraph: "Did impactful work" }] }) }),
    }),
  };
});
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (p: Record<string, unknown>) => <img alt="" src={String(p.src ?? "")} />,
}));

describe("WorkExperienceSection", () => {
  it("renders entries with their body paragraphs", () => {
    const { container } = render(<WorkExperienceSection />);
    expect(container.textContent).toContain("Did impactful work");
  });
});
