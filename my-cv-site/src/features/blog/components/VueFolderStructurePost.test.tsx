import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Body, meta } from "./VueFolderStructurePost";

const proseOf = (locale: "en" | "nl") => {
  const { container, unmount } = render(<Body locale={locale} />);
  const prose = container.textContent ?? "";
  unmount();
  return prose;
};

describe("VueFolderStructurePost", () => {
  it("has bilingual metadata within the title and description limits", () => {
    expect(meta.slug).toBe("vue-folder-structure-dotnet-backend");
    expect(meta.category).toBe("architecture");
    expect(meta.title.en).toBe("A Vue folder structure with a .NET backend");
    expect(meta.title.nl).toBe("Een Vue-mappenstructuur met een .NET-backend");
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeLessThan(160);
    expect(meta.description.nl.length).toBeLessThan(160);
    expect(meta.keywords.length).toBeGreaterThan(5);
  });

  it("walks through the repository folder by folder in English", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "The whole tree on one screen",
      "The design system holds look and behaviour only",
      "One package per feature, sorted by kind",
      "When code moves into the design system",
      "The .NET side: a gateway and two services",
      "Where the contracts come from",
      "Tests sit next to what they test",
      "A checklist to take away",
    ]);
    expect(screen.getByRole("region", { name: "The repository at the top level: frontends, contracts, services and tests." })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "One feature package, the rate table. The payment calculator has the same shape." })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Code: frontends/rate-table/src/stores/ratesStore.ts" })).toBeInTheDocument();
  });

  it("links the React folder post, the store post and the hexagonal post", () => {
    render(<Body locale="en" />);

    expect(screen.getByRole("link", { name: "the React folder structure post" })).toHaveAttribute("href", "/en/blog/react-folder-structure");
    expect(screen.getByRole("link", { name: "the post on state without a store" })).toHaveAttribute("href", "/en/blog/state-without-a-store-react-router-angular-graphql");
    expect(screen.getByRole("link", { name: "the post on hexagonal architecture in C#" })).toHaveAttribute("href", "/en/blog/hexagonal-architecture-csharp-dotnet");
  });

  it("renders the Dutch body with the same sections and links", () => {
    render(<Body locale="nl" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(8);
    expect(screen.getByRole("heading", { level: 2, name: "Waar de contracten vandaan komen" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "het artikel over React-mappenstructuur" })).toHaveAttribute("href", "/nl/blog/react-folder-structure");
  });

  it("calls it a practice project with shortened names and names no domain, bank or person", () => {
    for (const locale of ["en", "nl"] as const) {
      const prose = proseOf(locale);
      expect(prose).toMatch(/practice project|oefenproject/);
      expect(prose).toMatch(/shortened from the practice project|ingekort ten opzichte van het oefenproject/);
      expect(prose).not.toMatch(/hypotheek|mortgage|annuity|annuiteit|ABN|AMRO|bank|interview|sollicitatie/i);
    }
  });
});
