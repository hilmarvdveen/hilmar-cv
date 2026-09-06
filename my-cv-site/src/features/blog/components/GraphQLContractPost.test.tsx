import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Body, meta } from "./GraphQLContractPost";

describe("GraphQLContractPost", () => {
  it("has bilingual metadata within the title and description limits", () => {
    expect(meta.slug).toBe("graphql-as-a-contract-between-frontend-and-backend");
    expect(meta.category).toBe("architecture");
    expect(meta.track).toBe("fullstack");
    expect(meta.publishedDate).toBe("2026-09-06");
    expect(meta.readingTimeMin).toBe(13);
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeLessThan(160);
    expect(meta.description.nl.length).toBeLessThan(160);
    expect(meta.keywords.length).toBeGreaterThan(5);
  });

  it("renders the English body with eleven sections, both diagrams and the dated check", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(11);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 2, name: "The difference between a contract and a tap" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "The same discipline in REST with OpenAPI" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/gql\.tada and urql on React 19, checked on 6 September 2026/)
    ).toBeInTheDocument();
  });

  it("shows the English contents list and both diagram captions", () => {
    render(<Body locale="en" />);

    expect(screen.getByRole("navigation", { name: "In this article" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Partial responses, the case most clients get wrong" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Each component asks for the fields it uses, and the page sends one query built from all of them.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("A partial response still has data. Rendering it and reporting the errors are two different jobs.")
    ).toBeInTheDocument();
  });

  it("renders the Dutch body with eleven sections and both captions", () => {
    render(<Body locale="nl" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(11);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getByRole("navigation", { name: "In dit artikel" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Het verschil tussen een contract en een kraan" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/gql\.tada en urql op React 19, gecontroleerd op 6 september 2026/)
    ).toBeInTheDocument();
    expect(
      screen.getByText("Elk component vraagt om de velden die het gebruikt, en de pagina stuurt één query die uit al die fragmenten is opgebouwd.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Een gedeeltelijke response bevat nog steeds data. Die tonen en de fouten melden zijn twee verschillende taken.")
    ).toBeInTheDocument();
  });
});
