import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkExperienceSection } from "./WorkExperienceSection";
import { workHistory } from "@/data/workHistory";

type TranslateFunction = ((
  key: string,
  values?: Record<string, string>
) => string) & { raw: (key: string) => unknown };

vi.mock("next-intl", () => {
  const t = ((key: string, values?: Record<string, string>) => {
    if (key === "period" && values) return `${values.from} to ${values.to}`;
    if (key === "bol.company") return "bol.com";
    return key;
  }) as TranslateFunction;
  t.raw = (key: string) =>
    key.endsWith(".body") ? [{ paragraph: "Did impactful work" }] : [];
  return {
    useTranslations: () => t,
    useLocale: () => "en",
  };
});

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt="" src={String(props.src ?? "")} />
  ),
}));

describe("WorkExperienceSection", () => {
  it("renders one article per work-history entry with the experience anchor id", () => {
    render(<WorkExperienceSection />);
    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(workHistory.length);
    expect(articles.map((article) => article.id)).toEqual(
      workHistory.map((entry) => `experience-${entry.id}`)
    );
  });

  it("renders one heading per entry, including the bol.com company name", () => {
    render(<WorkExperienceSection />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(
      workHistory.length
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "bol.com" })
    ).toBeInTheDocument();
  });

  it("formats the period from the raw year-month values through the locale formatter", () => {
    render(<WorkExperienceSection />);
    expect(screen.getByText("July 2025 to October 2026")).toBeInTheDocument();
  });

  it("renders the summary lead and the body paragraphs for every entry", () => {
    render(<WorkExperienceSection />);
    expect(screen.getByText("bol.summary")).toBeInTheDocument();
    expect(screen.getAllByText("Did impactful work")).toHaveLength(
      workHistory.length
    );
  });

  it("renders the technologies as a named list on every entry", () => {
    render(<WorkExperienceSection />);
    expect(
      screen.getAllByRole("list", { name: "technologies" })
    ).toHaveLength(workHistory.length);
  });

  it("renders a compact navy call-to-action band after the second card, without changing the article count", () => {
    render(<WorkExperienceSection />);
    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(workHistory.length);

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "cta.title",
    });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText("cta.description")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "cta.button" });
    expect(link).toHaveAttribute("href", "/book");
  });
});
