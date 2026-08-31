import { describe, it, expect, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { WorkExperienceSection } from "./WorkExperienceSection";
import { workHistory } from "@/data/workHistory";

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
  // eslint-disable-next-line @next/next/no-img-element
  default: (p: Record<string, unknown>) => <img alt="" src={String(p.src ?? "")} />,
}));

describe("WorkExperienceSection", () => {
  it("renders entries with their body paragraphs", () => {
    const { container } = render(<WorkExperienceSection />);
    expect(container.textContent).toContain("Did impactful work");
  });

  it("gives each entry an #experience-<id> anchor for in-page logo links", () => {
    const { container } = render(<WorkExperienceSection />);
    expect(container.querySelector("#experience-belastingdienst")).toBeTruthy();
    expect(container.querySelector("#experience-postcode-loterij")).toBeTruthy();
  });

  it("renders the sticky quick-nav with a chip per engagement", () => {
    const { container } = render(<WorkExperienceSection />);
    const chips = container.querySelectorAll('nav a[href^="#experience-"]');
    expect(chips.length).toBe(workHistory.length);
  });

  it("highlights the clicked chip and leaves the rest gray", () => {
    const { container } = render(<WorkExperienceSection />);
    const chip = container.querySelector('nav a[href="#experience-athlon"]') as HTMLElement;
    fireEvent.click(chip);
    expect(chip.className).toContain("border-emerald-600");
    expect(chip.querySelector("span")?.className).not.toContain("grayscale");
    const other = container.querySelector('nav a[href="#experience-bol"]');
    expect(other?.querySelector("span")?.className).toContain("grayscale");
  });
});
