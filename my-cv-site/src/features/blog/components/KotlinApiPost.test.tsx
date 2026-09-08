import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Body, meta } from "./KotlinApiPost";

describe("KotlinApiPost", () => {
  it("has bilingual metadata within the title and description limits", () => {
    expect(meta.slug).toBe("building-an-api-in-kotlin");
    expect(meta.category).toBe("api");
    expect(meta.track).toBe("backend");
    expect(meta.publishedDate).toBe("2026-09-07");
    expect(meta.readingTimeMin).toBe(25);
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeLessThan(160);
    expect(meta.description.nl.length).toBeLessThan(160);
    expect(meta.keywords.length).toBeGreaterThan(5);
  });

  it("names the language and both frameworks in the description of each locale", () => {
    expect(meta.description.en).toContain("Kotlin 2.4");
    expect(meta.description.en).toContain("Spring Boot 4.1");
    expect(meta.description.en).toContain("Ktor 3.5");
    expect(meta.description.nl).toContain("Kotlin 2.4");
    expect(meta.description.nl).toContain("Spring Boot 4.1");
    expect(meta.description.nl).toContain("Ktor 3.5");
    expect(meta.excerpt.en).not.toBe(meta.description.en);
    expect(meta.excerpt.nl).not.toBe(meta.description.nl);
  });

  it("renders the English body with every section, both diagrams and the contents list", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(14);
    expect(screen.getAllByRole("img")).toHaveLength(2);

    const contents = screen.getByRole("navigation", { name: "In this article" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(14);
    expect(
      within(contents).getByRole("link", { name: "Why the Kotlin version of this API is shorter" })
    ).toBeInTheDocument();
    expect(within(contents).getByRole("link", { name: "What to take away" })).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: "The project, from an empty folder" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Sealed results for expected failures" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "The Spring route: kotlin(\"plugin.spring\") and why it exists",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "The Ktor route: routing, ContentNegotiation, StatusPages",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Every route, and the two failures" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Contributing Kotlin to a team that owns it" })
    ).toBeInTheDocument();
  });

  it("carries both captions as readable text in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(
        "The handler returns one sealed type, so the compiler checks that every outcome has a response."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Both frameworks serve the same domain, and only the outer ring changes.")
    ).toBeInTheDocument();
  });

  it("dates the version claim and shows the shared example in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(
        /target Kotlin 2\.4 with Spring Boot 4\.1 and Ktor 3\.5, checked on 7 September 2026/
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText(/RegistrationService/).length).toBeGreaterThan(1);
    expect(screen.getAllByText(/RegisterOutcome\.WorkshopFull/).length).toBeGreaterThan(1);
    expect(
      screen.getAllByText(/22222222-2222-2222-2222-222222222222/).length
    ).toBeGreaterThan(1);
    expect(
      screen.getAllByText(/https:\/\/workshops\.example\/problems\/workshop-full/).length
    ).toBeGreaterThan(1);
    expect(
      screen.getByText(/once the places are gone the next attempt is refused/)
    ).toBeInTheDocument();
  });

  it("gives a reader every piece needed to build and run the example", () => {
    render(<Body locale="en" />);

    expect(screen.getByText(/gradle init --type basic --dsl kotlin/)).toBeInTheDocument();
    expect(screen.getByText(/include\("workshops-ktor"\)/)).toBeInTheDocument();
    expect(screen.getAllByText(/jvmToolchain\(25\)/).length).toBe(3);
    expect(screen.getByText(/runApplication<WorkshopsApplication>/)).toBeInTheDocument();
    expect(screen.getByText(/\.\/gradlew :workshops-spring:bootRun/)).toBeInTheDocument();
    expect(screen.getByText(/\.\/gradlew :workshops-ktor:run/)).toBeInTheDocument();
    expect(screen.getByText(/\.\/gradlew test/)).toBeInTheDocument();
    expect(screen.getByText(/BUILD SUCCESSFUL/)).toBeInTheDocument();
  });

  it("shows every route and both failure responses as a client sees them", () => {
    render(<Body locale="en" />);

    const transcripts = screen.getAllByText(/HTTP\/1\.1 201/);
    expect(transcripts.length).toBeGreaterThan(0);
    expect(screen.getByText(/HTTP\/1\.1 204/)).toBeInTheDocument();
    expect(screen.getAllByText(/HTTP\/1\.1 400/).length).toBe(2);
    expect(screen.getAllByText(/HTTP\/1\.1 409/).length).toBe(2);
    expect(screen.getByText(/"detail":"Invalid request content\."/)).toBeInTheDocument();
    expect(
      screen.getByText(/"detail":"attendeeName must not be blank\. attendeeEmail must be an email address\."/)
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/"detail":"Every place in this workshop is taken\."/).length
    ).toBe(2);
  });

  it("keeps the wording of the record for the engagement it cites", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(
        /the frontend specialist in teams made up mostly of backend developers, and I wrote backend logic in Kotlin when capacity was tight/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/I wrote backend logic in Kotlin when capacity was tight, in a codebase that team owns/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/GraphQL was the contract between frontend and backend on that platform/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/coordinated continuously with two teams and with up to six at once/)
    ).toBeInTheDocument();
  });

  it("renders the Dutch body with every section, both diagrams and the contents list", () => {
    render(<Body locale="nl" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(14);
    expect(screen.getAllByRole("img")).toHaveLength(2);

    const contents = screen.getByRole("navigation", { name: "In dit artikel" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(14);
    expect(
      within(contents).getByRole("link", { name: "Waarom de Kotlin-versie van deze API korter is" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: "Het project, vanaf een lege map" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Null safety op de grens van de API" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Elke route, en de twee fouten" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Kotlin bijdragen aan een team dat het bezit" })
    ).toBeInTheDocument();
  });

  it("carries both captions and the dated sentence in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByText(
        "De handler geeft één sealed type terug, dus de compiler controleert of elke uitkomst een antwoord heeft."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Beide frameworks bedienen hetzelfde domein, en alleen de buitenste ring verandert."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /voor Kotlin 2\.4 met Spring Boot 4\.1 en Ktor 3\.5, gecontroleerd op 7 september 2026/
      )
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/schreef ik backendlogica in Kotlin als de capaciteit krap was/).length
    ).toBeGreaterThan(1);
  });

  it("names no measured figure and no version beside the engagement", () => {
    for (const locale of ["en", "nl"] as const) {
      const { container, unmount } = render(<Body locale={locale} />);
      const prose = container.textContent ?? "";

      expect(prose).not.toMatch(/\d\s?%/);
      expect(prose).not.toMatch(/GMV/);
      expect(prose).not.toMatch(/rather than|instead of|in plaats van/);

      const sentences = prose.split(/(?<=\.)\s+|(?<=\.)(?=[A-Z])/);
      const engagementSentences = sentences.filter((sentence) => sentence.includes("bol.com"));
      expect(engagementSentences.length).toBeGreaterThan(0);
      for (const sentence of engagementSentences) {
        expect(sentence).not.toMatch(/\d/);
      }

      unmount();
    }
  });
});
