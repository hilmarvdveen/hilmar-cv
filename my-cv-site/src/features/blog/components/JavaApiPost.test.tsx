import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Body, meta } from "./JavaApiPost";

describe("JavaApiPost", () => {
  it("has bilingual metadata within the title and description limits", () => {
    expect(meta.slug).toBe("building-an-api-in-java");
    expect(meta.category).toBe("api");
    expect(meta.track).toBe("backend");
    expect(meta.publishedDate).toBe("2026-09-07");
    expect(meta.readingTimeMin).toBe(23);
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeLessThan(160);
    expect(meta.description.nl.length).toBeLessThan(160);
    expect(meta.keywords.length).toBeGreaterThan(5);
  });

  it("names the runtime and the framework version in both locales", () => {
    expect(meta.description.en).toContain("Java 25 and Spring Boot 4.1");
    expect(meta.description.nl).toContain("Java 25 en Spring Boot 4.1");
    expect(meta.excerpt.en).not.toContain(meta.description.en);
    expect(meta.excerpt.nl).not.toContain(meta.description.nl);
  });

  it("renders the English body with every section, both diagrams and the contents list", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(12);
    expect(screen.getAllByRole("img")).toHaveLength(2);

    const contents = screen.getByRole("navigation", { name: "In this article" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(12);
    expect(
      within(contents).getByRole("link", { name: "What a Spring Boot API looks like today" })
    ).toBeInTheDocument();
    expect(within(contents).getByRole("link", { name: "What to take away" })).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: "Validation with jakarta constraints" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "@RestControllerAdvice, and one place for failure" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Tests: slice, full context, and Testcontainers" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Moving off a Java 8 codebase, in order" })
    ).toBeInTheDocument();
  });

  it("carries both captions as readable text in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(
        "One advice class turns every failure into the same response shape, so a client only has to learn one."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "A slice test starts the web layer, a context test starts the application, and Testcontainers starts the database beside it."
      )
    ).toBeInTheDocument();
  });

  it("dates the version claim and shows the shared example in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/target Java 25 and Spring Boot 4\.1, checked on 7 September 2026/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/A workshop with no places left refuses a new registration/)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/RegistrationService/).length).toBeGreaterThan(1);
    expect(screen.getAllByText(/11111111-1111-1111-1111-111111111111/).length).toBeGreaterThan(1);
    expect(screen.getAllByText(/RestClient/).length).toBeGreaterThan(1);
    expect(
      screen.getAllByText(/https:\/\/workshops\.example\/problems\/workshop-full/).length
    ).toBeGreaterThan(1);
  });

  it("gives a reader an empty folder everything needed to reach a running API", () => {
    render(<Body locale="en" />);

    expect(screen.getByText(/mkdir -p workshops\/workshops-domain/)).toBeInTheDocument();
    expect(screen.getByText(/<module>workshops-domain<\/module>/)).toBeInTheDocument();
    expect(screen.getByText(/spring-boot-maven-plugin/)).toBeInTheDocument();
    expect(screen.getByText(/mvn -pl workshops-api spring-boot:run/)).toBeInTheDocument();

    const requests = screen.getByText(/curl -i -X POST http:\/\/localhost:8080\/registrations/);
    expect(requests.textContent).toMatch(/HTTP\/1\.1 201/);
    expect(requests.textContent).toMatch(/HTTP\/1\.1 200/);
    expect(requests.textContent).toMatch(/HTTP\/1\.1 204/);
    expect(requests.textContent).toMatch(/curl -i -X DELETE/);
    expect(requests.textContent).toMatch(/workshopId=11111111-1111-1111-1111-111111111111/);

    expect(screen.getByText(/class WorkshopFullException extends RuntimeException/)).toBeInTheDocument();
    expect(screen.getByText(/"must be a well-formed email address"/)).toBeInTheDocument();
    expect(screen.getByText(/Tests run: 5, Failures: 0, Errors: 0, Skipped: 0/)).toBeInTheDocument();
  });

  it("names every file of the example in the project tree", () => {
    render(<Body locale="en" />);

    for (const name of [
      "Workshop.java",
      "Registration.java",
      "RegisterOutcome.java",
      "RegistrationService.java",
      "WorkshopsApplication.java",
      "RegisterRequest.java",
      "RegistrationResponse.java",
      "RegistrationController.java",
      "RegistrationRoutes.java",
      "RegistrationExceptions.java",
      "RegistrationAdvice.java",
      "OpenApiConfiguration.java",
      "WorkshopDirectoryClient.java",
      "application.yaml",
      "RegistrationControllerTest.java",
      "WorkshopsApplicationTest.java",
      "RegistrationDatabaseTest.java",
    ]) {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0);
    }
  });

  it("keeps the wording of the record for every engagement it cites", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/extended the backend endpoints it called/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Their behaviour lived in server-side Java/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/a bare mandate reference became a structured mandate object/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/every backend outcome of the Kobo Plus promotion codes its own message/)
    ).toBeInTheDocument();
  });

  it("keeps Spring out of every engagement it names", () => {
    for (const locale of ["en", "nl"] as const) {
      const { unmount } = render(<Body locale={locale} />);
      const stack = screen.getByText(/Java 8, Maven/);

      expect(stack.textContent).toMatch(/MySQL/);
      expect(stack.textContent).not.toMatch(/Spring/);
      unmount();
    }
  });

  it("renders the Dutch body with every section, both diagrams and the contents list", () => {
    render(<Body locale="nl" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(12);
    expect(screen.getAllByRole("img")).toHaveLength(2);

    const contents = screen.getByRole("navigation", { name: "In dit artikel" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(12);
    expect(
      within(contents).getByRole("link", { name: "Hoe een Spring Boot-API er vandaag uitziet" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: "Fouten als ProblemDetail, volgens RFC 9457" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Virtual threads, en de schakelaar die nog uit staat" })
    ).toBeInTheDocument();
  });

  it("carries both captions and the dated sentence in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByText(
        "Eén advice-klasse maakt van elke fout hetzelfde antwoord, zodat een client er maar één hoeft te leren."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Een slice-test start de weblaag, een contexttest start de applicatie en Testcontainers start de database ernaast."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/voor Java 25 en Spring Boot 4\.1, gecontroleerd op 7 september 2026/)
    ).toBeInTheDocument();
  });

  it("names no measured figure, no deprecated client and no client system", () => {
    for (const locale of ["en", "nl"] as const) {
      const { container, unmount } = render(<Body locale={locale} />);
      const article = container.textContent ?? "";

      expect(article).not.toMatch(/\d\s?%/);
      expect(article).not.toMatch(/RestTemplate\./);
      expect(article).not.toMatch(/Handlebars/);
      expect(article).not.toMatch(/226/);
      unmount();
    }
  });
});
