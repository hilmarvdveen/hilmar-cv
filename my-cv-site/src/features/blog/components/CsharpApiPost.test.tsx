import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Body, meta } from "./CsharpApiPost";

describe("CsharpApiPost", () => {
  it("has bilingual metadata within the title and description limits", () => {
    expect(meta.slug).toBe("building-an-api-in-csharp");
    expect(meta.category).toBe("api");
    expect(meta.track).toBe("backend");
    expect(meta.publishedDate).toBe("2026-09-06");
    expect(meta.readingTimeMin).toBe(18);
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeLessThan(160);
    expect(meta.description.nl.length).toBeLessThan(160);
    expect(meta.keywords.length).toBeGreaterThan(5);
  });

  it("names the runtime and the language version in both locales", () => {
    expect(meta.description.en).toContain(".NET 10 and C# 14");
    expect(meta.description.nl).toContain(".NET 10 en C# 14");
    expect(meta.excerpt.en).toContain(".NET 10 and C# 14");
    expect(meta.excerpt.nl).toContain(".NET 10 en C# 14");
  });

  it("renders the English body with every section, both diagrams and the contents list", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(12);
    expect(screen.getAllByRole("img")).toHaveLength(2);

    const contents = screen.getByRole("navigation", { name: "In this article" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(12);
    expect(
      within(contents).getByRole("link", { name: "The choice, stated plainly" })
    ).toBeInTheDocument();
    expect(within(contents).getByRole("link", { name: "What to take away" })).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Which one to pick, and the three cases that decide it",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Validation, now built in" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Testing an endpoint with WebApplicationFactory" })
    ).toBeInTheDocument();
  });

  it("carries both captions as readable text in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(
        "Each stage can end the request, and the one that ends it decides the status code."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The endpoint knows the domain. The domain never knows it is being served over HTTP."
      )
    ).toBeInTheDocument();
  });

  it("dates the version claim and shows the shared example in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/target \.NET 10 and C# 14, checked on 6 September 2026/)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/net10\.0/).length).toBeGreaterThan(1);
    expect(screen.getAllByText(/RegistrationService/).length).toBeGreaterThan(1);
    expect(
      screen.getByText(/A workshop with no places left refuses a new registration/)
    ).toBeInTheDocument();
  });

  it("keeps the wording of the record for every engagement it cites", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/extended the Java backend endpoints it called/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/a modular authorisation and membership service on Microsoft Identity and JWT/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/settled the REST contracts with the backend teams on OpenAPI 3\.0/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/a generic API layer in \.NET Core over a Delphi backend/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/the interface and the API both validated the entries drivers made/)
    ).toBeInTheDocument();
  });

  it("renders the Dutch body with every section, both diagrams and the contents list", () => {
    render(<Body locale="nl" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(12);
    expect(screen.getAllByRole("img")).toHaveLength(2);

    const contents = screen.getByRole("navigation", { name: "In dit artikel" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(12);
    expect(
      within(contents).getByRole("link", { name: "De keuze, eenvoudig gesteld" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: "Fouten als problem details" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Waar het endpoint ophoudt en het domein begint" })
    ).toBeInTheDocument();
  });

  it("carries both captions and the dated sentence in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByText(
        "Elke fase kan het request beëindigen, en de fase die dat doet, bepaalt de statuscode."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Het endpoint kent het domein. Het domein weet nooit dat het over HTTP wordt bediend."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/voor \.NET 10 en C# 14, gecontroleerd op 6 september 2026/)
    ).toBeInTheDocument();
  });

  it("names no measured figure and no framework version at an engagement", () => {
    for (const locale of ["en", "nl"] as const) {
      const { container, unmount } = render(<Body locale={locale} />);
      const prose = container.textContent ?? "";
      expect(prose).not.toMatch(/\d\s?%/);
      expect(prose).not.toMatch(/\.NET Core \d/);
      expect(prose).not.toMatch(/ASP\.NET Core \d/);
      unmount();
    }
  });
});
