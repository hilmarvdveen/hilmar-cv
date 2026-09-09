import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Body, meta } from "./StateWithoutStorePost";

describe("StateWithoutStorePost", () => {
  it("has bilingual metadata within the title and description limits", () => {
    expect(meta.slug).toBe("state-without-a-store-react-router-angular-graphql");
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeLessThan(160);
    expect(meta.description.nl.length).toBeLessThan(160);
    expect(meta.keywords.length).toBeGreaterThan(5);
  });

  it("is published on the frontend track with the architecture category", () => {
    expect(meta.track).toBe("frontend");
    expect(meta.category).toBe("architecture");
    expect(meta.publishedDate).toBe("2026-09-09");
    expect(meta.readingTimeMin).toBe(32);
  });

  it("renders the English body with every section, both diagrams and the contents list", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(14);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 2, name: "Three kinds of state on one screen" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "What is left on the client" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "When a store earns its place" })
    ).toBeInTheDocument();

    const contents = screen.getByRole("navigation", { name: "In this article" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(14);
  });

  it("carries the date of the version check and both diagram captions in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/read from the npm registry on 9 September 2026/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Server data lives in the loader and the cache, URL state in the address bar, and only what is left needs a store."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The action writes, the loader reads again, and the component never holds a copy of the server's data."
      )
    ).toBeInTheDocument();
  });

  it("names the anonymous wishlist as server data on the cart cookie, in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/The wishlist of a visitor who has not signed in is server data/)
    ).toBeInTheDocument();
    expect(screen.getByText(/against the same zappy_cart cookie/)).toBeInTheDocument();
  });

  it("says the Angular server rendering section has no running sample, in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/this section has no running Zappy Mart sample behind it/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Apollo appears in no engagement of mine/)).toBeInTheDocument();
  });

  it("keeps the bol.com scope to what the record says, in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/I have not taken a store out of anybody's codebase there/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/At Athlon I designed the frontend architecture around RxJS and reactive data streams/)
    ).toBeInTheDocument();
  });

  it("links the two related articles once each, in English", () => {
    render(<Body locale="en" />);

    const links = screen.getAllByRole("link", { name: /article/i });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute(
      "href",
      "/en/blog/graphql-as-a-contract-between-frontend-and-backend"
    );
    expect(
      screen.getByRole("link", { name: "on signals and RxJS in Angular" })
    ).toHaveAttribute("href", "/en/blog/rxjs-versus-signals-in-angular");
  });

  it("renders the Dutch body with every section, both diagrams and the contents list", () => {
    render(<Body locale="nl" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(14);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 2, name: "Drie soorten state op één scherm" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Wat er op de client overblijft" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Wanneer een store zijn plek verdient" })
    ).toBeInTheDocument();

    const contents = screen.getByRole("navigation", { name: "In dit artikel" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(14);
  });

  it("carries the date of the version check and both diagram captions in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByText(/op 9 september 2026 uit het npm-register gelezen/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Serverdata woont in de loader en de cache, state in het adres woont in de adresbalk, en alleen wat overblijft heeft een store nodig."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "De action schrijft, de loader leest opnieuw, en het component houdt nooit een kopie van de data van de server."
      )
    ).toBeInTheDocument();
  });

  it("keeps the bol.com scope to what the record says, in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByText(/ik heb daar bij niemand een store uit de code gehaald/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Bij Athlon ontwierp ik de frontendarchitectuur rond RxJS en reactieve datastromen/)
    ).toBeInTheDocument();
  });

  it("links the two related articles once each, in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByRole("link", { name: "het artikel over GraphQL als contract" })
    ).toHaveAttribute("href", "/nl/blog/graphql-as-a-contract-between-frontend-and-backend");
    expect(
      screen.getByRole("link", { name: "over signals en RxJS in Angular" })
    ).toHaveAttribute("href", "/nl/blog/rxjs-versus-signals-in-angular");
  });

  it("makes no comparison against a store and repeats no revenue figure", () => {
    for (const locale of ["en", "nl"] as const) {
      const { unmount } = render(<Body locale={locale} />);
      expect(screen.queryByText(/instead of a store/i)).toBeNull();
      expect(screen.queryByText(/rather than a store/i)).toBeNull();
      expect(screen.queryByText(/in plaats van een store/i)).toBeNull();
      expect(screen.queryByText(/24%/)).toBeNull();
      unmount();
    }
  });
});
