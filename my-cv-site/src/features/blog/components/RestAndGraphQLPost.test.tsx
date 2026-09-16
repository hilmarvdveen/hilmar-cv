import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Body, meta } from "./RestAndGraphQLPost";

describe("RestAndGraphQLPost", () => {
  it("has bilingual metadata within the title and description limits", () => {
    expect(meta.slug).toBe("rest-and-graphql-idempotency-status-codes-when-to-use-which");
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeLessThan(160);
    expect(meta.description.nl.length).toBeLessThan(160);
    expect(meta.keywords.length).toBeGreaterThan(5);
  });

  it("is published on the fullstack track with the fundamentals category", () => {
    expect(meta.track).toBe("fullstack");
    expect(meta.category).toBe("fundamentals");
    expect(meta.publishedDate).toBe("2026-09-16");
    expect(meta.readingTimeMin).toBe(44);
  });

  it("renders the English body with every section, both diagrams and the contents list", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(15);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 2, name: "Methods, and what idempotent means" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "GraphQL over HTTP, and the status code question" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "The React Router front against both" })
    ).toBeInTheDocument();

    const contents = screen.getByRole("navigation", { name: "In this article" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(15);
  });

  it("names both diagrams by what they draw, in both languages", () => {
    const { unmount } = render(<Body locale="en" />);
    expect(
      screen.getByRole("img", {
        name: "Diagram: one client can place an order over a REST address that answers 201 with a Location header, or over one GraphQL address that answers 200 with an envelope, and both reach the same PlaceOrder use case",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "Diagram: a request passes routing, content negotiation, authentication, binding, validation and the domain rules before the handler answers, and each stage owns its own status codes",
      })
    ).toBeInTheDocument();
    unmount();

    render(<Body locale="nl" />);
    expect(
      screen.getByRole("img", {
        name: "Diagram: één client kan een bestelling plaatsen via een REST-adres dat 201 met een Location-header antwoordt, of via één GraphQL-adres dat 200 met een envelop antwoordt, en allebei komen ze uit bij dezelfde use case PlaceOrder",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "Diagram: een verzoek passeert routering, contentonderhandeling, authenticatie, binding, validatie en de domeinregels voordat de handler antwoordt, en elke stap bezit zijn eigen statuscodes",
      })
    ).toBeInTheDocument();
  });

  it("gives every code block a home in the project it builds", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("figure")).toHaveLength(32);
    expect(screen.getByText("src/Zappy.Adapters.Rest/Representations.cs")).toBeInTheDocument();
    expect(
      screen.getByText("zappy-adapters/src/main/kotlin/nl/zappymart/adapters/rest/CartRestController.kt")
    ).toBeInTheDocument();
    expect(
      screen.getByText("subgraphs/ordering/src/adapters/rest/orderRoutes.ts")
    ).toBeInTheDocument();
    expect(
      screen.getByText("frontends/react-router/app/routes/checkout.tsx")
    ).toBeInTheDocument();
  });

  it("names the repository folders the article runs on", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByRole("link", { name: "zappy-mart/backends/dotnet" })
    ).toHaveAttribute("href", "https://github.com/hilmarvdveen/zappy-mart/tree/main/backends/dotnet");
    expect(screen.getByRole("link", { name: "zappy-mart/backends/kotlin" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "zappy-mart/backends/node" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "zappy-mart/frontends/react-router" })).toBeInTheDocument();
  });

  it("says plainly that the REST adapter is written for the article, in both languages", () => {
    const { unmount } = render(<Body locale="en" />);
    expect(
      screen.getByText(/The repository serves GraphQL today and contains no REST adapter/)
    ).toBeInTheDocument();
    unmount();

    render(<Body locale="nl" />);
    expect(
      screen.getByText(/De repository serveert vandaag GraphQL en bevat geen REST-adapter/)
    ).toBeInTheDocument();
  });

  it("dates its version claims and cites the two normative documents", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/read from the project files or from the npm registry on 9 September 2026/)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "RFC 9110" })).toHaveAttribute(
      "href",
      "https://www.rfc-editor.org/rfc/rfc9110"
    );
    expect(screen.getByRole("link", { name: "RFC 9457" })).toHaveAttribute(
      "href",
      "https://www.rfc-editor.org/rfc/rfc9457"
    );
    expect(
      screen.getByText(/read on 7 September 2026 as a stage 2 document/)
    ).toBeInTheDocument();
  });

  it("carries both diagram captions as text in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(
        "The same outcome travels in two shapes. REST puts the outcome in the status line and names the new order in a Location header. GraphQL answers 200 and puts the order or the refusal inside the envelope. The client has to know which shape it is reading, and the use case underneath does not."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Each stage can end the request, and the stage that ends it chooses the status code. Routing owns 405, content negotiation owns 415, authentication owns 401 and 403, binding owns 400, validation owns 422, and only the domain rules may answer 404, 409 or 410. The handler that reaches the end answers 200, 201 or 204."
      )
    ).toBeInTheDocument();
  });

  it("puts every method and status code in a table a reader can scan", () => {
    render(<Body locale="en" />);

    const methods = screen.getByRole("table", { name: /Every method the store uses/ });
    expect(within(methods).getAllByRole("columnheader")).toHaveLength(4);
    expect(within(methods).getAllByRole("rowheader")).toHaveLength(6);
    expect(within(methods).getByRole("rowheader", { name: "DELETE" })).toBeInTheDocument();
    expect(within(methods).getByRole("rowheader", { name: "PATCH" })).toBeInTheDocument();

    const statuses = screen.getByRole("table", { name: /The status codes worth knowing/ });
    expect(within(statuses).getAllByRole("rowheader")).toHaveLength(18);
    expect(within(statuses).getByRole("rowheader", { name: "409 Conflict" })).toBeInTheDocument();
    expect(
      within(statuses).getByRole("rowheader", { name: "422 Unprocessable Content" })
    ).toBeInTheDocument();

    const decisions = screen.getByRole("table", { name: /Eight questions about the work/ });
    expect(within(decisions).getAllByRole("rowheader")).toHaveLength(8);
    expect(within(decisions).getByRole("columnheader", { name: "GraphQL" })).toBeInTheDocument();
  });

  it("keeps the engagement scope to what the record says, in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/At Ortec I settled the REST contracts with the backend teams on OpenAPI 3\.0/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Client code stays with the client\. The reasoning comes with me/)
    ).toBeInTheDocument();
  });

  it("links the three related articles once each, in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByRole("link", { name: "the article on GraphQL as a contract" })
    ).toHaveAttribute("href", "/en/blog/graphql-as-a-contract-between-frontend-and-backend");
    expect(
      screen.getByRole("link", { name: "the article on routes, loaders and actions" })
    ).toHaveAttribute("href", "/en/blog/react-router-remix-routes-loaders-actions-folder-structure");
    expect(
      screen.getByRole("link", { name: "the article on building an API in ASP.NET Core" })
    ).toHaveAttribute("href", "/en/blog/building-an-api-in-csharp");
  });

  it("renders the Dutch body with every section, both diagrams and the contents list", () => {
    render(<Body locale="nl" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(15);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 2, name: "Methodes, en wat idempotent betekent" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Eén vorm voor elke storing" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Een keuzetabel die je aan een team kunt geven" })
    ).toBeInTheDocument();

    const contents = screen.getByRole("navigation", { name: "In dit artikel" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(15);
  });

  it("carries both diagram captions as text in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByText(
        "Dezelfde uitkomst reist in twee vormen. REST zet de uitkomst in de statusregel en noemt de nieuwe bestelling in een Location-header. GraphQL antwoordt 200 en zet de bestelling of de weigering in de envelop. De client moet weten welke vorm hij leest, en de use case eronder niet."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Elke stap kan het verzoek beëindigen, en de stap die het beëindigt kiest de statuscode. Routering bezit 405, contentonderhandeling 415, authenticatie 401 en 403, binding 400, validatie 422, en alleen de domeinregels mogen 404, 409 of 410 antwoorden. De handler die het eind haalt, antwoordt 200, 201 of 204.",
      )
    ).toBeInTheDocument();
  });

  it("links the three related articles once each, in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByRole("link", { name: "het artikel over GraphQL als contract" })
    ).toHaveAttribute("href", "/nl/blog/graphql-as-a-contract-between-frontend-and-backend");
    expect(
      screen.getByRole("link", { name: "het artikel over routes, loaders en actions" })
    ).toHaveAttribute("href", "/nl/blog/react-router-remix-routes-loaders-actions-folder-structure");
    expect(
      screen.getByRole("link", { name: "het artikel over een API bouwen in ASP.NET Core" })
    ).toHaveAttribute("href", "/nl/blog/building-an-api-in-csharp");
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
