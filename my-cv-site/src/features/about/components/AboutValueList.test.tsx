import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutValueList } from "./AboutValueList";

const blocks = [
  { title: "Block one", body: "Body one", evidence: "Evidence one" },
  {
    title: "Block two",
    body: "Body two",
    evidence: "Evidence two",
    article: {
      href: "/blog/rxjs-versus-signals-in-angular",
      label: "Article two",
    },
  },
  { title: "Block three", body: "Body three", evidence: "Evidence three" },
  { title: "Block four", body: "Body four", evidence: "Evidence four" },
  { title: "Block five", body: "Body five", evidence: "Evidence five" },
];

vi.mock("next-intl", () => {
  const t = ((key: string) => key) as ((key: string) => string) & {
    raw: (key: string) => unknown;
  };
  t.raw = (key: string) => (key === "value.blocks" ? blocks : []);
  return { useTranslations: () => t };
});

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/CaseSchematic", () => ({
  CaseSchematic: ({ schematic }: { schematic: string }) => (
    <svg role="img" aria-label={schematic} />
  ),
}));

describe("AboutValueList", () => {
  it("renders one list with an item per value block", () => {
    render(<AboutValueList />);
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(blocks.length);
  });

  it("names every third level heading by its block title alone", () => {
    render(<AboutValueList />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.map((heading) => heading.textContent)).toEqual(
      blocks.map((block) => block.title)
    );
    for (const block of blocks) {
      expect(
        screen.getByRole("heading", { level: 3, name: block.title })
      ).toBeInTheDocument();
      expect(screen.getByText(block.body)).toBeInTheDocument();
      expect(screen.getByText(block.evidence)).toBeInTheDocument();
    }
  });

  it("links the article only from the block that names one", () => {
    render(<AboutValueList />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName("Article two");
    expect(links[0]).toHaveAttribute(
      "href",
      "/blog/rxjs-versus-signals-in-angular"
    );
    expect(links[0]).toHaveAttribute("data-placement", "about-mentoring-article");
  });

  it("draws the ramp once, with its caption as text", () => {
    render(<AboutValueList />);
    expect(screen.getAllByRole("img", { name: "ramp" })).toHaveLength(1);
    expect(screen.getByText("value.device")).toBeInTheDocument();
  });

  it("separates every row but the first", () => {
    render(<AboutValueList />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).not.toHaveClass("border-t");
    for (const item of items.slice(1)) {
      expect(item).toHaveClass("border-t");
    }
  });
});
