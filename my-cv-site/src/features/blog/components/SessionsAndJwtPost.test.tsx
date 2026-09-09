import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Body, meta } from "./SessionsAndJwtPost";

describe("SessionsAndJwtPost", () => {
  it("has bilingual metadata within the title and description limits", () => {
    expect(meta.slug).toBe("sessions-and-jwt-one-design-built-seven-times");
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeLessThan(160);
    expect(meta.description.nl.length).toBeLessThan(160);
    expect(meta.keywords.length).toBeGreaterThan(5);
  });

  it("is published on the fullstack track with the architecture category", () => {
    expect(meta.track).toBe("fullstack");
    expect(meta.category).toBe("architecture");
    expect(meta.publishedDate).toBe("2026-09-09");
    expect(meta.readingTimeMin).toBe(43);
  });

  it("renders the English body with every section, both diagrams and the contents list", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(14);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 2, name: "The two tokens, and what each one does" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Rotation, and what a replay costs" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "One key set, five subgraphs" })
    ).toBeInTheDocument();

    const contents = screen.getByRole("navigation", { name: "In this article" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(14);
  });

  it("dates the version claims and carries both diagram captions in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/whose rows were verified between 6 and 9 September 2026/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/each read from its registry on 9 September 2026/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Login hands out both. The access token rides the Authorization header on every request. The refresh cookie goes only to the refresh call. Revoking the session row ends both of them in the same moment."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "A refresh token is used once. The first use rotates it and hands out the next pair. A second use of the same value means it leaked, so the session and every token in it are revoked and every device has to log in again."
      )
    ).toBeInTheDocument();
  });

  it("names the file behind each rule in each of the four backends", () => {
    render(<Body locale="en" />);

    const table = screen.getByRole("table", { name: /Every rule of the design/ });
    expect(within(table).getAllByRole("columnheader")).toHaveLength(5);
    expect(within(table).getAllByRole("rowheader")).toHaveLength(7);
    expect(
      within(table).getByRole("rowheader", { name: "Argon2id with the OWASP parameters" })
    ).toBeInTheDocument();
    expect(
      within(table).getByRole("cell", { name: "shared/security/originCheck.ts" })
    ).toBeInTheDocument();
  });

  it("states the cost of the session check instead of hiding it, in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/every bearer request reads the session row/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Five seconds is the number this project chose/)
    ).toBeInTheDocument();
  });

  it("keeps the engagement scope to what the record says, in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/an Angular front end on ASP\.NET Core with authentication and role-based access/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Designing a token model is a different job from that one/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The security code I can point at without asking anybody is this site/)
    ).toBeInTheDocument();
  });

  it("links the two related articles once each, in English", () => {
    render(<Body locale="en" />);

    const links = screen.getAllByRole("link", { name: /article/i });
    expect(links).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: "the article on what a store still does" })
    ).toHaveAttribute(
      "href",
      "/en/blog/state-without-a-store-react-router-angular-graphql"
    );
    expect(
      screen.getByRole("link", { name: "the article on GraphQL as a contract" })
    ).toHaveAttribute(
      "href",
      "/en/blog/graphql-as-a-contract-between-frontend-and-backend"
    );
  });

  it("renders the Dutch body with every section, both diagrams and the contents list", () => {
    render(<Body locale="nl" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(14);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 2, name: "De twee tokens, en wat elk van beide doet" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Argon2id in vier talen" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Waar elke regel woont" })
    ).toBeInTheDocument();

    const contents = screen.getByRole("navigation", { name: "In dit artikel" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(14);
  });

  it("dates the version claims and carries both diagram captions in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByText(/waarvan de regels tussen 6 en 9 september 2026 zijn gecontroleerd/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Bij het inloggen worden beide uitgegeven. Het accesstoken reist bij elk verzoek mee in de Authorization-header. De refreshcookie gaat alleen naar de refresh-aanroep. De sessieregel intrekken beëindigt ze allebei op hetzelfde moment."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Een refreshtoken wordt één keer gebruikt. Het eerste gebruik roteert het en geeft het volgende paar uit. Een tweede gebruik van dezelfde waarde betekent dat het is uitgelekt, dus de sessie en alle tokens erin worden ingetrokken en elk apparaat moet opnieuw inloggen."
      )
    ).toBeInTheDocument();
  });

  it("keeps the engagement scope to what the record says, in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByText(/een Angular-frontend op ASP\.NET Core bouwde met authenticatie en rolgebaseerde toegang/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Een tokenmodel ontwerpen is ander werk dan dat/)
    ).toBeInTheDocument();
  });

  it("links the two related articles once each, in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByRole("link", { name: "het artikel over wat een store nog doet" })
    ).toHaveAttribute(
      "href",
      "/nl/blog/state-without-a-store-react-router-angular-graphql"
    );
    expect(
      screen.getByRole("link", { name: "het artikel over GraphQL als contract" })
    ).toHaveAttribute(
      "href",
      "/nl/blog/graphql-as-a-contract-between-frontend-and-backend"
    );
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
