import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Body, meta } from "./ApolloAcrossStackPost";

describe("ApolloAcrossStackPost", () => {
  it("has bilingual metadata within the title and description limits", () => {
    expect(meta.slug).toBe("graphql-with-apollo-react-nodejs-kotlin");
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeLessThan(160);
    expect(meta.description.nl.length).toBeLessThan(160);
    expect(meta.keywords.length).toBeGreaterThan(5);
  });

  it("is published on the fullstack track with the architecture category", () => {
    expect(meta.track).toBe("fullstack");
    expect(meta.category).toBe("architecture");
    expect(meta.publishedDate).toBe("2026-09-16");
    expect(meta.readingTimeMin).toBe(42);
  });

  it("renders the English body with every section, both diagrams and the contents list", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(12);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 2, name: "One schema, three runtimes" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "One graph in front of two servers" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "What urql and gql.tada do differently" })
    ).toBeInTheDocument();

    const contents = screen.getByRole("navigation", { name: "In this article" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(12);
  });

  it("names both diagrams by what they draw and carries their captions in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByRole("img", {
        name: "One schema file above a React client, a Node server and a Kotlin service, each with the types it derives from that file",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "A request going down from a React component through the Apollo Client cache and the link to the server resolvers, the data loader and the Kotlin service",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "One schema is the contract. The client, the Node server and the Kotlin service each derive their types from it."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The cache answers what it can, the server resolves the rest, and the Kotlin service owns the data."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "One contract folder and three programs beside it. Nothing crosses between the three except the schema file."
      )
    ).toBeInTheDocument();
  });

  it("gives every code block a home in the project it builds", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("figure")).toHaveLength(65);
    expect(screen.getByText("server-node/src/store.ts")).toBeInTheDocument();
    expect(
      screen.getByText("service-kotlin/src/main/kotlin/nl/example/store/CatalogueController.kt")
    ).toBeInTheDocument();
    expect(screen.getByText("client-react/app/CatalogueList.tsx")).toBeInTheDocument();
    expect(screen.getByText("frontends/nextjs/codegen.ts")).toBeInTheDocument();
  });

  it("dates its version claims and names the split between the two graphql lines", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/Every version below was read from its registry on 9 September 2026/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Apollo Server 5\.5\.1 declares the peer range graphql \^16\.11\.0/)
    ).toBeInTheDocument();
  });

  it("points at the folders of the public repository the samples run in", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByRole("link", { name: "zappy-mart/backends/node" })
    ).toHaveAttribute("href", "https://github.com/hilmarvdveen/zappy-mart/tree/main/backends/node");
    expect(screen.getByRole("link", { name: "zappy-mart/backends/kotlin" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "zappy-mart/frontends/nextjs" })).toBeInTheDocument();
  });

  it("keeps the engagement scope to what the record says, in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/names urql and gql\.tada at bol\.com, and no Apollo anywhere/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/every Apollo section above is teaching/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Client code stays with the client\. The reasoning comes with me/)
    ).toBeInTheDocument();
  });

  it("links the two related articles once each, in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByRole("link", { name: "the article on GraphQL as a contract" })
    ).toHaveAttribute("href", "/en/blog/graphql-as-a-contract-between-frontend-and-backend");
    expect(
      screen.getByRole("link", { name: "the article on building a federated graph" })
    ).toHaveAttribute("href", "/en/blog/apollo-federation-explained-by-building-a-supergraph");
  });

  it("renders the Dutch body with every section, both diagrams and the contents list", () => {
    render(<Body locale="nl" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(12);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 2, name: "Eén schema, drie runtimes" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Hetzelfde schema vanuit Kotlin" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Typen uit het schema, aan elke kant" })
    ).toBeInTheDocument();

    const contents = screen.getByRole("navigation", { name: "In dit artikel" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(12);
  });

  it("names both diagrams and carries their captions in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByRole("img", {
        name: "Eén schemabestand boven een React-client, een Node-server en een Kotlin-service, elk met de typen die het uit dat bestand afleidt",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "Een verzoek dat van een React-component omlaag gaat via de Apollo Client-cache en de link naar de serverresolvers, de data loader en de Kotlin-service",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Eén schema is het contract. De client, de Node-server en de Kotlin-service leiden hun typen er allemaal uit af."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "De cache beantwoordt wat hij kan, de server lost de rest op, en de Kotlin-service bezit de data."
      )
    ).toBeInTheDocument();
  });

  it("keeps the engagement scope to what the record says, in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByText(/noemt urql en gql\.tada bij bol\.com, en nergens Apollo/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Clientcode blijft bij de klant\. De redenering gaat met mij mee/)
    ).toBeInTheDocument();
  });

  it("links the two related articles once each, in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByRole("link", { name: "het artikel over GraphQL als contract" })
    ).toHaveAttribute("href", "/nl/blog/graphql-as-a-contract-between-frontend-and-backend");
    expect(
      screen.getByRole("link", { name: "het artikel over het bouwen van een federated graph" })
    ).toHaveAttribute("href", "/nl/blog/apollo-federation-explained-by-building-a-supergraph");
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
