import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { WorkExperienceSection, FULL_CARD_COUNT } from "./WorkExperienceSection";
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
  t.raw = (key: string) => {
    if (key.endsWith(".body")) return [{ paragraph: "Did impactful work" }];
    if (key.endsWith(".delivered")) return [`${key} first`, `${key} second`];
    return [];
  };
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

  it("renders the summary lead for every entry", () => {
    render(<WorkExperienceSection />);
    expect(screen.getByText("bol.summary")).toBeInTheDocument();
    expect(screen.getAllByText(/\.summary$/)).toHaveLength(workHistory.length);
  });

  it("renders the technologies as a named list on every full card", () => {
    render(<WorkExperienceSection />);
    expect(
      screen.getAllByRole("list", { name: "technologies" })
    ).toHaveLength(FULL_CARD_COUNT);
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

describe("WorkExperienceSection: scannable cards", () => {
  it("lists what was delivered, keeps the story behind a closed disclosure and links to the own page", () => {
    render(<WorkExperienceSection />);
    const lists = screen.getAllByRole("list", { name: "deliveredTitle" });
    expect(lists.length).toBeGreaterThan(1);
    expect(within(lists[0]).getAllByRole("listitem")).toHaveLength(2);
    const links = screen.getAllByRole("link", { name: "readMore" });
    expect(links).toHaveLength(workHistory.length);
    expect(links[0]).toHaveAttribute("href", `/experience/${workHistory[0].id}`);
  });
});
