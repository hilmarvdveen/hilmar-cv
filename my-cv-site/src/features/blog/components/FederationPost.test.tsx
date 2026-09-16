import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Body, meta } from "./FederationPost";

describe("FederationPost", () => {
  it("has bilingual metadata within the title and description limits", () => {
    expect(meta.slug).toBe("apollo-federation-explained-by-building-a-supergraph");
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeLessThan(160);
    expect(meta.description.nl.length).toBeLessThan(160);
    expect(meta.keywords.length).toBeGreaterThan(5);
  });

  it("is published on the backend track with the architecture category", () => {
    expect(meta.track).toBe("backend");
    expect(meta.category).toBe("architecture");
    expect(meta.publishedDate).toBe("2026-09-09");
    expect(meta.readingTimeMin).toBe(67);
  });

  it("renders the English body with every section, both diagrams and the contents list", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(18);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 2, name: "One schema, many owners" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Subgraphs, entities and keys" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Delivery guarantees: the outbox" })
    ).toBeInTheDocument();

    const contents = screen.getByRole("navigation", { name: "In this article" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(18);
  });

  it("dates the version claims and carries both diagram captions in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/The versions were read from the project's own table on 9 September 2026/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Apollo Router 2\.16\.3 as the version router\.yaml is written for/)).toBeInTheDocument();
    expect(
      screen.getByText(
        "The client sees one graph. Each subgraph owns its entities and resolves the references the others hold."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The order and its outbox row commit together, the publisher retries until the consumers acknowledge, and the consumers ignore what they have seen."
      )
    ).toBeInTheDocument();
  });

  it("names what each subgraph owns and what each guarantee is proved by", () => {
    render(<Body locale="en" />);

    const subgraphs = screen.getByRole("table", { name: /The five subgraphs of the store/ });
    expect(within(subgraphs).getAllByRole("columnheader")).toHaveLength(5);
    expect(within(subgraphs).getAllByRole("rowheader")).toHaveLength(5);
    expect(within(subgraphs).getByRole("rowheader", { name: "promotions" })).toBeInTheDocument();
    expect(
      within(subgraphs).getByRole("cell", { name: "Order, OrderLine, placeOrder, the outbox" })
    ).toBeInTheDocument();

    const guarantees = screen.getByRole("table", { name: /Every guarantee of the graph/ });
    expect(within(guarantees).getAllByRole("columnheader")).toHaveLength(3);
    expect(within(guarantees).getAllByRole("rowheader")).toHaveLength(9);
    expect(
      within(guarantees).getByRole("rowheader", { name: "The outbox with at least once delivery" })
    ).toBeInTheDocument();
    expect(
      within(guarantees).getByRole("cell", { name: "shared/src/http/retryPolicy.ts" })
    ).toBeInTheDocument();
  });

  it("says the router configuration is unrun and the PostgreSQL adapter unverified, in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/router\.yaml is written for Apollo Router 2\.16\.3 and it is unrun here/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/That adapter is written and unverified here, because there is no Docker on this machine/)
    ).toBeInTheDocument();
    expect(screen.getByText(/The reference implementation is at 17\.0\.2/)).toBeInTheDocument();
  });

  it("keeps the engagement scope to what the record says, in English", () => {
    render(<Body locale="en" />);

    expect(screen.getByText(/Federation in production is not on my record/)).toBeInTheDocument();
    expect(
      screen.getByText(/my work ran with two teams continuously and up to six at once in one shared monorepo/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/reshape a flat reference field into a structured object/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/This section is teaching. I did not run this migration in this project/)
    ).toBeInTheDocument();
  });

  it("links the two related articles once each, in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByRole("link", { name: "the article on sessions and JWT" })
    ).toHaveAttribute("href", "/en/blog/sessions-and-jwt-one-design-built-seven-times");
    expect(
      screen.getByRole("link", { name: "its own article on GraphQL as a contract" })
    ).toHaveAttribute("href", "/en/blog/graphql-as-a-contract-between-frontend-and-backend");
  });

  it("points at the folder of the public repository the graph runs in", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByRole("link", { name: "zappy-mart/backends/node" })
    ).toHaveAttribute("href", "https://github.com/hilmarvdveen/zappy-mart/tree/main/backends/node");
  });

  it("renders the Dutch body with every section, both diagrams and the contents list", () => {
    render(<Body locale="nl" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(18);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 2, name: "Eén schema, veel eigenaren" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Authenticatie zonder poortwachter" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Eén trace per verzoek" })
    ).toBeInTheDocument();

    const contents = screen.getByRole("navigation", { name: "In dit artikel" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(18);
  });

  it("dates the version claims and carries both diagram captions in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByText(/De versies zijn op 9 september 2026 uit de eigen versietabel van het project gelezen/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "De client ziet één graph. Elke subgraph bezit zijn eigen entities en lost de verwijzingen op die de andere vasthouden."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "De bestelling en de outboxregel worden samen gecommit, de publisher blijft het proberen tot de consumers antwoorden, en de consumers negeren wat ze al gezien hebben."
      )
    ).toBeInTheDocument();
  });

  it("keeps the engagement scope to what the record says, in Dutch", () => {
    render(<Body locale="nl" />);

    expect(screen.getByText(/Federation in productie staat niet op mijn cv/)).toBeInTheDocument();
    expect(
      screen.getByText(/mijn werk liep doorlopend met twee teams en tot zes tegelijk in één gedeelde monorepo/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Deze sectie is uitleg\. Ik heb deze migratie in dit project niet gedraaid/)
    ).toBeInTheDocument();
  });

  it("links the two related articles once each, in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByRole("link", { name: "het artikel over sessies en JWT" })
    ).toHaveAttribute("href", "/nl/blog/sessions-and-jwt-one-design-built-seven-times");
    expect(
      screen.getByRole("link", { name: "een eigen artikel over GraphQL als contract" })
    ).toHaveAttribute("href", "/nl/blog/graphql-as-a-contract-between-frontend-and-backend");
  });

  it("makes no comparison in its prose and repeats no revenue figure", () => {
    const outsideTheSamples = { ignore: "script, style, pre, pre *" };
    for (const locale of ["en", "nl"] as const) {
      const { unmount } = render(<Body locale={locale} />);
      expect(screen.queryAllByText(/instead of/i, outsideTheSamples)).toHaveLength(0);
      expect(screen.queryAllByText(/rather than/i, outsideTheSamples)).toHaveLength(0);
      expect(screen.queryAllByText(/in plaats van/i, outsideTheSamples)).toHaveLength(0);
      expect(screen.queryAllByText(/24%/, outsideTheSamples)).toHaveLength(0);
      unmount();
    }
  });
});
