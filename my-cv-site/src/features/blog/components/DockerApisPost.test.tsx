import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Body, meta } from "./DockerApisPost";

const ENGAGEMENTS = [
  "bol\\.com",
  "Omniplan",
  "Ortec",
  "Athlon",
  "Belastingdienst",
  "Nationale Postcode Loterij",
];

const TREE_ENTRIES = [
  "apis/",
  "compose.yaml",
  "deployment.yaml",
  "workshops-dotnet/",
  "Workshops.sln",
  "Workshops.Domain/",
  "Workshops.Api/",
  "Workshops.Api.Tests/",
  ".dockerignore",
  "Dockerfile",
  "workshops-java/",
  "pom.xml",
  "mvnw",
  ".mvn/",
  "workshops-domain/",
  "workshops-api/",
  "workshops-kotlin/",
  "settings.gradle.kts",
  "gradlew",
  "gradle/",
  "workshops-spring/",
  "workshops-ktor/",
];

const sentencesOf = (text: string) =>
  text
    .split(/(?<=\.)\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

describe("DockerApisPost", () => {
  it("has bilingual metadata within the title and description limits", () => {
    expect(meta.slug).toBe("dockerising-dotnet-java-kotlin-apis");
    expect(meta.category).toBe("architecture");
    expect(meta.track).toBe("fullstack");
    expect(meta.publishedDate).toBe("2026-09-08");
    expect(meta.readingTimeMin).toBe(25);
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeGreaterThanOrEqual(120);
    expect(meta.description.nl.length).toBeGreaterThanOrEqual(120);
    expect(meta.description.en.length).toBeLessThanOrEqual(160);
    expect(meta.description.nl.length).toBeLessThanOrEqual(160);
    expect(meta.keywords).toHaveLength(8);
  });

  it("keeps the excerpt free of every sentence in the description", () => {
    for (const locale of ["en", "nl"] as const) {
      const described = sentencesOf(meta.description[locale]);
      const excerpted = sentencesOf(meta.excerpt[locale]);

      expect(excerpted.length).toBeGreaterThan(1);
      for (const sentence of described) {
        expect(excerpted).not.toContain(sentence);
      }
    }
  });

  it("renders the English body with fifteen sections, both diagrams and the contents list", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(15);
    expect(screen.getAllByRole("img")).toHaveLength(2);

    const contents = screen.getByRole("navigation", { name: "In this article" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(15);

    for (const heading of [
      "What a good image is measured by",
      "The multi stage build, in one pattern",
      "A .NET image: SDK stage, publish, chiseled runtime",
      "Non root, the app user and port 8080",
      "Globalisation, ICU and the -extra variant",
      "A Java image: build stage, layered extraction, JRE runtime",
      "The Spring Boot layering change, and the flag that broke",
      "A Kotlin image, and why it is the Java one",
      "Configuration through the environment, not the image",
      "Health endpoints, and HEALTHCHECK in Compose",
      "Compose with a database, and waiting for it properly",
      "What changes in Kubernetes: probes, requests and limits",
      "Memory: the JVM at 25 percent, .NET at 75",
      "Scanning, signing and pinning",
      "What to take away",
    ]) {
      expect(screen.getByRole("heading", { level: 2, name: heading })).toBeInTheDocument();
      expect(within(contents).getByRole("link", { name: heading })).toBeInTheDocument();
    }
  });

  it("renders the Dutch body with fifteen sections, both diagrams and the contents list", () => {
    render(<Body locale="nl" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(15);
    expect(screen.getAllByRole("img")).toHaveLength(2);

    const contents = screen.getByRole("navigation", { name: "In dit artikel" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(15);

    for (const heading of [
      "Waar je een goed image aan afmeet",
      "De multi-stage build, in één patroon",
      "Een .NET-image: SDK-stage, publish, chiseled runtime",
      "Niet als root, de gebruiker app en poort 8080",
      "Globalisatie, ICU en de -extra variant",
      "Een Java-image: buildstage, lagen uitpakken, JRE-runtime",
      "De laagwijziging in Spring Boot, en de vlag die brak",
      "Een Kotlin-image, en waarom het het Java-image is",
      "Configuratie via de omgeving, niet via het image",
      "Health-endpoints, en HEALTHCHECK in Compose",
      "Compose met een database, en goed op hem wachten",
      "Wat verandert in Kubernetes: probes, requests en limits",
      "Geheugen: de JVM op 25 procent, .NET op 75",
      "Scannen, ondertekenen en vastzetten",
      "Wat je meeneemt",
    ]) {
      expect(screen.getByRole("heading", { level: 2, name: heading })).toBeInTheDocument();
      expect(within(contents).getByRole("link", { name: heading })).toBeInTheDocument();
    }
  });

  it("carries both diagram captions as readable text in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(
        "The compiler, the source and the package cache stay in the first stage and never reach the image you ship."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The startup probe holds the other two back until the application is up, readiness decides who gets traffic, and liveness decides who gets restarted."
      )
    ).toBeInTheDocument();
  });

  it("carries both diagram captions and the dated version claim in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByText(
        "De compiler, de broncode en de packagecache blijven in de eerste stage en komen nooit in het image dat je uitrolt."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "De startup-probe houdt de andere twee tegen tot de applicatie draait, readiness bepaalt wie verkeer krijgt en liveness bepaalt wie opnieuw wordt gestart."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Kubernetes 1\.37, gecontroleerd op 8 september 2026/)
    ).toBeInTheDocument();
  });

  it("names every file of the example in the project tree", () => {
    render(<Body locale="en" />);

    for (const entry of TREE_ENTRIES) {
      expect(screen.getAllByText(entry).length).toBeGreaterThan(0);
    }
  });

  it("gives a reader with three projects everything needed to build, run and deploy", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByText(/# syntax=docker\/dockerfile:1/)).toHaveLength(3);
    const dotnetDockerfile = screen.getByText(
      /FROM mcr\.microsoft\.com\/dotnet\/aspnet:10\.0-noble-chiseled AS runtime/
    );
    expect(dotnetDockerfile.textContent).toMatch(/USER \$APP_UID/);
    expect(dotnetDockerfile.textContent).toMatch(/EXPOSE 8080/);
    expect(dotnetDockerfile.textContent).toMatch(/ENTRYPOINT \["dotnet", "Workshops\.Api\.dll"\]/);
    expect(screen.getAllByText(/FROM eclipse-temurin:25-jre AS runtime/)).toHaveLength(2);
    expect(screen.getAllByText(/--mount=type=cache/).length).toBeGreaterThan(2);

    expect(screen.getByText(/docker build --tag workshops-dotnet:1\.0\.0 \./)).toBeInTheDocument();
    expect(screen.getByText(/docker run --rm --publish 8082:8080 workshops-java:1\.0\.0/)).toBeInTheDocument();
    expect(screen.getByText(/sh \.\/gradlew --no-daemon :workshops-ktor:installDist/)).toBeInTheDocument();
    expect(screen.getByText(/mvn wrapper:wrapper/)).toBeInTheDocument();

    const started = screen.getByText(/docker run --rm --publish 8081:8080 workshops-dotnet:1\.0\.0/);
    expect(started.textContent).toMatch(/Now listening on: http:\/\/\[::\]:8080/);
    expect(started.textContent).toMatch(/Application started/);

    const compose = screen.getByText(/POSTGRES_DB: workshops/);
    expect(compose.textContent).toMatch(/condition: service_healthy/);
    expect(compose.textContent).toMatch(/pg_isready --username workshops --dbname workshops/);
    expect(compose.textContent).toMatch(/start_period: 20s/);

    const composeStatus = screen.getByText(/workshops-database-1/);
    expect(composeStatus.textContent).toMatch(/Up 2 minutes \(healthy\)/);
    expect(composeStatus.textContent).toMatch(/0\.0\.0\.0:8083->8080\/tcp/);

    const deployment = screen.getByText(/kind: Deployment/);
    expect(deployment.textContent).toMatch(/startupProbe:/);
    expect(deployment.textContent).toMatch(/readinessProbe:/);
    expect(deployment.textContent).toMatch(/livenessProbe:/);
    expect(deployment.textContent).toMatch(/requests:/);
    expect(deployment.textContent).toMatch(/limits:/);
    expect(deployment.textContent).toMatch(/runAsNonRoot: true/);

    const applied = screen.getByText(/kubectl apply -f deployment\.yaml/);
    expect(applied.textContent).toMatch(/deployment\.apps\/workshops-api created/);
    expect(applied.textContent).toMatch(/1\/1\s+Running/);
  });

  it("adds the smallest health endpoint to each of the three applications", () => {
    render(<Body locale="en" />);

    expect(screen.getByText(/app\.MapHealthChecks\("\/health"\)/)).toBeInTheDocument();
    expect(screen.getByText(/<artifactId>spring-boot-starter-actuator<\/artifactId>/)).toBeInTheDocument();
    expect(
      screen.getByText(/implementation\("org\.springframework\.boot:spring-boot-starter-actuator"\)/)
    ).toBeInTheDocument();
    expect(screen.getByText(/get\("\/health"\) \{ call\.respondText\("ok"\) \}/)).toBeInTheDocument();

    const actuator = screen.getByText(/management:/);
    expect(actuator.textContent).toMatch(/probes:/);
    expect(actuator.textContent).toMatch(/enabled: true/);
  });

  it("states the two Kubernetes facts and cites the probes documentation", () => {
    for (const locale of ["en", "nl"] as const) {
      const { container, unmount } = render(<Body locale={locale} />);
      const article = container.textContent ?? "";

      expect(article).toMatch(/HEALTHCHECK/);
      expect(article).toMatch(/-Djarmode=layertools/);
      expect(article).toMatch(/-Djarmode=tools/);
      expect(article).toMatch(/extract --layers/);
      expect(article).toMatch(/Spring Boot 4\.1/);
      expect(
        screen.getByRole("link", {
          name: "https://kubernetes.io/docs/concepts/workloads/pods/probes/",
        })
      ).toBeInTheDocument();
      unmount();
    }

    render(<Body locale="en" />);
    expect(
      screen.getByText(/it ignores a Dockerfile HEALTHCHECK completely and uses its own probes/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/that mode is gone in Spring Boot 4\.1/)
    ).toBeInTheDocument();
  });

  it("publishes no percentage and no measured figure", () => {
    for (const locale of ["en", "nl"] as const) {
      const { container, unmount } = render(<Body locale={locale} />);
      const article = container.textContent ?? "";

      expect(article).not.toMatch(/\d\s?%/);
      expect(article).not.toContain("%");
      expect(article).not.toMatch(/\d+\s?(MB|megabytes|megabyte)/);
      unmount();
    }
  });

  it("names no version in any paragraph that names an engagement", () => {
    for (const locale of ["en", "nl"] as const) {
      const { unmount } = render(<Body locale={locale} />);

      for (const engagement of ENGAGEMENTS) {
        const paragraph = screen.getByText(new RegExp(engagement));
        expect(paragraph.textContent).not.toMatch(/\d/);
      }
      unmount();
    }
  });

  it("keeps the wording of the record for every engagement it cites", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/the app for software and games from an empty folder to production/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/At Omniplan the services ran on Azure App Services with Docker and Kubernetes/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/At Ortec deployment ran through Docker to Azure inside a CI\/CD pipeline/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/At Athlon delivery ran on Azure DevOps with Docker and Kubernetes/)
    ).toBeInTheDocument();
  });

  it("links the three articles the images are built from", () => {
    const linkNames = {
      en: ["the ASP.NET Core article", "the Spring Boot article", "the Kotlin article"],
      nl: ["het ASP.NET Core-artikel", "het Spring Boot-artikel", "het Kotlin-artikel"],
    } as const;
    const slugs = [
      "building-an-api-in-csharp",
      "building-an-api-in-java",
      "building-an-api-in-kotlin",
    ];

    for (const locale of ["en", "nl"] as const) {
      const { unmount } = render(<Body locale={locale} />);

      linkNames[locale].forEach((name, position) => {
        expect(screen.getByRole("link", { name })).toHaveAttribute(
          "href",
          `/${locale}/blog/${slugs[position]}`
        );
      });
      unmount();
    }
  });
});
