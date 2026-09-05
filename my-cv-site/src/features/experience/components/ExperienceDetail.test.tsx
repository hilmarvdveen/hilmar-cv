import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ExperienceDetail } from "./ExperienceDetail";
import { workHistory } from "@/data/workHistory";

type TranslateFunction = ((key: string, values?: Record<string, string>) => string) & {
  raw: (key: string) => unknown;
};

vi.mock("next-intl", () => {
  const t = ((key: string, values?: Record<string, string>) =>
    key === "period" && values ? `${values.from} to ${values.to}` : key) as TranslateFunction;
  t.raw = (key: string) => {
    if (key.endsWith(".body")) {
      return [{ paragraph: "First paragraph" }, { heading: "Second heading", paragraph: "Second paragraph" }];
    }
    if (key.endsWith(".delivered") && !key.startsWith("empty.")) {
      return ["Delivered one", "Delivered two", "Delivered three"];
    }
    return [];
  };
  return { useTranslations: () => t, useLocale: () => "en" };
});

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const [first, second, third] = workHistory;

describe("ExperienceDetail", () => {
  it("renders the summary, the delivered list, the facts, the story with its headings and the pills", () => {
    render(<ExperienceDetail entry={second} previous={first} next={third} />);
    expect(screen.getByText(`${second.id}.summary`)).toBeInTheDocument();
    const delivered = screen.getByRole("list", { name: "deliveredTitle" });
    expect(within(delivered).getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("detail.factsTitle")).toBeInTheDocument();
    expect(screen.getByText("detail.periodLabel")).toBeInTheDocument();
    expect(screen.getByText(`${second.id}.role`)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "detail.storyTitle" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Second heading" })).toBeInTheDocument();
    expect(screen.getByText("First paragraph")).toBeInTheDocument();
    const technology = screen.getByRole("list", { name: "detail.technologyTitle" });
    expect(within(technology).getAllByRole("listitem")).toHaveLength(second.tech.length);
  });

  it("links to the previous and next engagement and back to the full list", () => {
    render(<ExperienceDetail entry={second} previous={first} next={third} />);
    expect(screen.getByRole("link", { name: `detail.previous: ${first.id}.company` })).toHaveAttribute(
      "href",
      `/experience/${first.id}`
    );
    expect(screen.getByRole("link", { name: `detail.next: ${third.id}.company` })).toHaveAttribute(
      "href",
      `/experience/${third.id}`
    );
    expect(screen.getByRole("link", { name: "detail.back" })).toHaveAttribute("href", "/experience");
  });

  it("omits the neighbours at the ends and the lists when an entry has none", () => {
    const bare = { ...first, id: "empty", tech: [] };
    render(<ExperienceDetail entry={bare} />);
    expect(screen.queryByRole("list", { name: "deliveredTitle" })).toBeNull();
    expect(screen.queryByRole("list", { name: "detail.technologyTitle" })).toBeNull();
    expect(screen.queryByText(/detail.previous/)).toBeNull();
    expect(screen.queryByText(/detail.next/)).toBeNull();
  });
});
