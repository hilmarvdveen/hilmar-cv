import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, Lead, UL, OL, LI, Strong, Quote, Divider } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FileTree, type FileNode } from "./FileTree";
import { FlowDiagram } from "./FlowDiagram";
import { Contents } from "./Contents";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "building-an-api-in-java",
  category: "api",
  track: "backend",
  publishedDate: "2026-09-07",
  readingTimeMin: 23,
  title: {
    en: "An API in Spring Boot: records, validation, problem details",
    nl: "Een API in Spring Boot: records, validatie, problem details",
  },
  description: {
    en: "Records, jakarta constraints, ProblemDetail, springdoc, RestClient and Testcontainers on Java 25 and Spring Boot 4.1, in one workshop registration API.",
    nl: "Records, jakarta-constraints, ProblemDetail, springdoc, RestClient en Testcontainers op Java 25 en Spring Boot 4.1, in één API voor workshopinschrijvingen.",
  },
  excerpt: {
    en: "The same four routes as the ASP.NET Core article in this series, now on the JVM. A record carries the request, jakarta constraints check it, one advice class gives every failure the same shape, and three test scopes prove it from the outside in.",
    nl: "Dezelfde vier routes als het ASP.NET Core-artikel in deze reeks, nu op de JVM. Een record draagt het request, jakarta-constraints controleren het, één advice-klasse geeft elke fout dezelfde vorm, en drie testniveaus bewijzen het van buiten naar binnen.",
  },
  keywords: [
    "spring boot rest api",
    "java record request validation",
    "jakarta validation constraints",
    "problemdetail rfc 9457",
    "restcontrolleradvice problem details",
    "springdoc openapi spring boot 4",
    "testcontainers serviceconnection",
    "spring boot virtual threads",
  ],
};

function buildRequestDiagram(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("request", copy.nodeRequest[locale], { x: 0, y: 110 }, { tone: "slate", subtitle: "POST /registrations", width: 150 }),
    flowNode("controller", copy.nodeController[locale], { x: 180, y: 110 }, { tone: "blue", subtitle: "@PostMapping", width: 150 }),
    flowNode("validation", copy.nodeValidation[locale], { x: 360, y: 110 }, { tone: "violet", subtitle: "@Valid", width: 150 }),
    flowNode("service", "RegistrationService", { x: 540, y: 110 }, { tone: "emerald", subtitle: copy.nodeServiceSub[locale], width: 180 }),
    flowNode("response", copy.nodeResponse[locale], { x: 750, y: 110 }, { tone: "emerald", subtitle: copy.nodeResponseSub[locale], width: 140 }),
    flowNode("advice", "@RestControllerAdvice", { x: 560, y: 260 }, { tone: "rose", subtitle: "ProblemDetail · 400 · 404 · 409", direction: "TB", width: 240 }),
  ];
  const edges = [
    flowEdge("request", "controller"),
    flowEdge("controller", "validation"),
    flowEdge("validation", "service"),
    flowEdge("service", "response"),
    flowEdge("controller", "advice", { dashed: true, label: copy.edgeUnreadable[locale] }),
    flowEdge("validation", "advice", { dashed: true, label: copy.edgeRejected[locale] }),
    flowEdge("service", "advice", { dashed: true, label: copy.edgeUnknownOrFull[locale] }),
  ];
  return { nodes, edges };
}

function buildTestScopeDiagram(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("endpoint", "POST /registrations", { x: 0, y: 115 }, { tone: "slate", subtitle: copy.nodeEndpointSub[locale], width: 210 }),
    flowNode("slice", "@WebMvcTest", { x: 350, y: 0 }, { tone: "blue", subtitle: copy.nodeSliceSub[locale], width: 420 }),
    flowNode("context", "@SpringBootTest", { x: 350, y: 110 }, { tone: "violet", subtitle: copy.nodeContextSub[locale], width: 490 }),
    flowNode("containers", "@ServiceConnection", { x: 350, y: 220 }, { tone: "emerald", subtitle: copy.nodeContainersSub[locale], width: 540 }),
  ];
  const edges = [
    flowEdge("endpoint", "slice"),
    flowEdge("endpoint", "context"),
    flowEdge("endpoint", "containers"),
  ];
  return { nodes, edges };
}

function buildProjectTree(locale: Locale): FileNode[] {
  const copy = COPY;
  return [
    {
      name: "workshops/",
      children: [
        { name: "pom.xml", comment: copy.treeAggregator[locale] },
        {
          name: "workshops-domain/",
          children: [
            { name: "pom.xml", comment: copy.treeDomainPom[locale] },
            {
              name: "src/main/java/example/workshops/domain/",
              children: [
                { name: "Workshop.java" },
                { name: "Registration.java" },
                { name: "RegisterOutcome.java" },
                { name: "RegistrationService.java" },
              ],
            },
          ],
        },
        {
          name: "workshops-api/",
          children: [
            { name: "pom.xml", comment: copy.treeApiPom[locale] },
            {
              name: "src/main/java/example/workshops/api/",
              children: [
                { name: "WorkshopsApplication.java" },
                { name: "RegisterRequest.java" },
                { name: "RegistrationResponse.java" },
                { name: "RegistrationController.java" },
                { name: "RegistrationRoutes.java" },
                { name: "RegistrationExceptions.java" },
                { name: "RegistrationAdvice.java" },
                { name: "OpenApiConfiguration.java" },
                { name: "WorkshopDirectoryClient.java" },
              ],
            },
            {
              name: "src/main/resources/",
              children: [{ name: "application.yaml" }],
            },
            {
              name: "src/test/java/example/workshops/api/",
              children: [
                { name: "RegistrationControllerTest.java" },
                { name: "WorkshopsApplicationTest.java" },
                { name: "RegistrationDatabaseTest.java" },
              ],
            },
          ],
        },
      ],
    },
  ];
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  const requestFlow = buildRequestDiagram(locale);
  const testScopeFlow = buildTestScopeDiagram(locale);
  const projectTree = buildProjectTree(locale);
  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <P>{copy.intro1[locale]}</P>
      <P>{copy.versions[locale]}</P>
      <P>{copy.intro2[locale]}</P>
      <Quote>{copy.quote[locale]}</Quote>
      <Contents
        label={copy.contentsLabel[locale]}
        items={[
          copy.shapeTitle[locale],
          copy.recordsTitle[locale],
          copy.validationTitle[locale],
          copy.controllerTitle[locale],
          copy.problemTitle[locale],
          copy.adviceTitle[locale],
          copy.openApiTitle[locale],
          copy.clientTitle[locale],
          copy.testingTitle[locale],
          copy.threadsTitle[locale],
          copy.migrationTitle[locale],
          copy.closeTitle[locale],
        ]}
      />

      <H2>{copy.shapeTitle[locale]}</H2>
      <P>{copy.shape1[locale]}</P>
      <P>{copy.shape2[locale]}</P>
      <CodeBlock lang="bash" filename="terminal" code={CREATE_CODE} />
      <FileTree tree={projectTree} caption={copy.treeCaption[locale]} />
      <P>{copy.shape3[locale]}</P>
      <CodeBlock lang="xml" filename="pom.xml" code={ROOT_POM_CODE} />
      <CodeBlock lang="xml" filename="workshops-domain/pom.xml" code={DOMAIN_POM_CODE} />
      <CodeBlock lang="xml" filename="workshops-api/pom.xml" code={API_POM_CODE} />
      <P>{copy.shape4[locale]}</P>
      <CodeBlock lang="java" filename="workshops-api/src/main/java/example/workshops/api/WorkshopsApplication.java" code={APPLICATION_CODE} />
      <P>{copy.shape5[locale]}</P>
      <CodeBlock lang="bash" filename="terminal" code={RUN_CODE} />
      <P>{copy.shape6[locale]}</P>

      <H2>{copy.recordsTitle[locale]}</H2>
      <P>{copy.records1[locale]}</P>
      <CodeBlock lang="java" filename="workshops-domain/src/main/java/example/workshops/domain/Workshop.java" code={WORKSHOP_CODE} />
      <CodeBlock lang="java" filename="workshops-domain/src/main/java/example/workshops/domain/Registration.java" code={REGISTRATION_CODE} />
      <P>{copy.records2[locale]}</P>
      <CodeBlock lang="java" filename="workshops-domain/src/main/java/example/workshops/domain/RegisterOutcome.java" code={OUTCOME_CODE} />
      <P>{copy.records3[locale]}</P>
      <P>{copy.records4[locale]}</P>
      <CodeBlock lang="java" filename="workshops-domain/src/main/java/example/workshops/domain/RegistrationService.java" code={SERVICE_CODE} />
      <P>{copy.records5[locale]}</P>

      <H2>{copy.validationTitle[locale]}</H2>
      <P>{copy.validation1[locale]}</P>
      <CodeBlock lang="java" filename="workshops-api/src/main/java/example/workshops/api/RegisterRequest.java" code={REQUEST_CODE} />
      <P>{copy.validation2[locale]}</P>
      <P>{copy.validation3[locale]}</P>
      <Callout variant="warning" title={copy.validationWarningTitle[locale]}>
        {copy.validationWarningBody[locale]}
      </Callout>

      <Divider />

      <H2>{copy.controllerTitle[locale]}</H2>
      <P>{copy.controller1[locale]}</P>
      <CodeBlock lang="java" filename="workshops-api/src/main/java/example/workshops/api/RegistrationResponse.java" code={RESPONSE_CODE} />
      <P>{copy.controller2[locale]}</P>
      <CodeBlock lang="java" filename="workshops-api/src/main/java/example/workshops/api/RegistrationController.java" code={CONTROLLER_CODE} />
      <P>{copy.controller3[locale]}</P>
      <CodeBlock lang="java" filename="workshops-api/src/main/java/example/workshops/api/RegistrationExceptions.java" code={EXCEPTIONS_CODE} />
      <P>{copy.controller4[locale]}</P>
      <CodeBlock lang="bash" filename="terminal" code={REQUESTS_CODE} />
      <P>{copy.controller5[locale]}</P>
      <CodeBlock lang="java" filename="workshops-api/src/main/java/example/workshops/api/RegistrationRoutes.java" code={ROUTES_CODE} />
      <P>{copy.controller6[locale]}</P>
      <P>{copy.controller7[locale]}</P>

      <H2>{copy.problemTitle[locale]}</H2>
      <P>{copy.problem1[locale]}</P>
      <P>{copy.problem2[locale]}</P>
      <CodeBlock lang="json" filename="409 Conflict · application/problem+json" code={PROBLEM_JSON_CODE} />
      <P>{copy.problem3[locale]}</P>
      <P>{copy.problem4[locale]}</P>

      <H2>{copy.adviceTitle[locale]}</H2>
      <P>{copy.advice1[locale]}</P>
      <FlowDiagram
        nodes={requestFlow.nodes}
        edges={requestFlow.edges}
        height={320}
        ariaLabel={copy.requestAria[locale]}
        caption={copy.requestCaption[locale]}
      />
      <CodeBlock lang="java" filename="workshops-api/src/main/java/example/workshops/api/RegistrationAdvice.java" code={ADVICE_CODE} />
      <P>{copy.advice2[locale]}</P>
      <P>{copy.advice3[locale]}</P>
      <CodeBlock lang="json" filename="400 Bad Request · application/problem+json" code={VALIDATION_JSON_CODE} />
      <P>{copy.advice4[locale]}</P>

      <H2>{copy.openApiTitle[locale]}</H2>
      <P>{copy.openApi1[locale]}</P>
      <P>{copy.openApi2[locale]}</P>
      <CodeBlock lang="java" filename="workshops-api/src/main/java/example/workshops/api/OpenApiConfiguration.java" code={OPEN_API_CODE} />
      <P>{copy.openApi3[locale]}</P>

      <H2>{copy.clientTitle[locale]}</H2>
      <P>{copy.client1[locale]}</P>
      <CodeBlock lang="java" filename="workshops-api/src/main/java/example/workshops/api/WorkshopDirectoryClient.java" code={CLIENT_CODE} />
      <P>{copy.client2[locale]}</P>
      <P>{copy.client3[locale]}</P>

      <H2>{copy.testingTitle[locale]}</H2>
      <P>{copy.testing1[locale]}</P>
      <FlowDiagram
        nodes={testScopeFlow.nodes}
        edges={testScopeFlow.edges}
        height={300}
        ariaLabel={copy.testScopeAria[locale]}
        caption={copy.testScopeCaption[locale]}
      />
      <P>{copy.testing2[locale]}</P>
      <CodeBlock lang="java" filename="workshops-api/src/test/java/example/workshops/api/RegistrationControllerTest.java" code={SLICE_TEST_CODE} />
      <P>{copy.testing3[locale]}</P>
      <P>{copy.testing4[locale]}</P>
      <CodeBlock lang="java" filename="workshops-api/src/test/java/example/workshops/api/WorkshopsApplicationTest.java" code={CONTEXT_TEST_CODE} />
      <P>{copy.testing5[locale]}</P>
      <CodeBlock lang="java" filename="workshops-api/src/test/java/example/workshops/api/RegistrationDatabaseTest.java" code={CONTAINER_TEST_CODE} />
      <P>{copy.testing6[locale]}</P>
      <CodeBlock lang="bash" filename="terminal" code={TEST_RUN_CODE} />
      <P>{copy.testing7[locale]}</P>

      <H2>{copy.threadsTitle[locale]}</H2>
      <P>{copy.threads1[locale]}</P>
      <CodeBlock lang="yaml" filename="workshops-api/src/main/resources/application.yaml" code={APPLICATION_YAML_CODE} />
      <P>{copy.threads2[locale]}</P>
      <P>{copy.threads3[locale]}</P>

      <H2>{copy.migrationTitle[locale]}</H2>
      <P>{copy.migration1[locale]}</P>
      <OL>
        <LI><Strong>{copy.stepBuildLabel[locale]}</Strong> {copy.stepBuild[locale]}</LI>
        <LI><Strong>{copy.stepNamespaceLabel[locale]}</Strong> {copy.stepNamespace[locale]}</LI>
        <LI><Strong>{copy.stepProcessorsLabel[locale]}</Strong> {copy.stepProcessors[locale]}</LI>
        <LI><Strong>{copy.stepLanguageLabel[locale]}</Strong> {copy.stepLanguage[locale]}</LI>
        <LI><Strong>{copy.stepFrameworkLabel[locale]}</Strong> {copy.stepFramework[locale]}</LI>
      </OL>
      <P>{copy.migration2[locale]}</P>
      <P>{copy.migration3[locale]}</P>

      <H2>{copy.closeTitle[locale]}</H2>
      <P>{copy.close1[locale]}</P>
      <UL>
        <LI>{copy.takeaway1[locale]}</LI>
        <LI>{copy.takeaway2[locale]}</LI>
        <LI>{copy.takeaway3[locale]}</LI>
        <LI>{copy.takeaway4[locale]}</LI>
      </UL>
      <P>{copy.close2[locale]}</P>
      <P>{copy.close3[locale]}</P>
    </>
  );
}

const CREATE_CODE = `mkdir -p workshops/workshops-domain/src/main/java/example/workshops/domain
mkdir -p workshops/workshops-api/src/main/java/example/workshops/api
mkdir -p workshops/workshops-api/src/main/resources
mkdir -p workshops/workshops-api/src/test/java/example/workshops/api
cd workshops`;

const ROOT_POM_CODE = `<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>

    <groupId>example.workshops</groupId>
    <artifactId>workshops</artifactId>
    <version>1.0.0</version>
    <packaging>pom</packaging>

    <modules>
        <module>workshops-domain</module>
        <module>workshops-api</module>
    </modules>

</project>`;

const RUN_CODE = `mvn install -DskipTests
mvn -pl workshops-api spring-boot:run`;

const DOMAIN_POM_CODE = `<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>

    <groupId>example.workshops</groupId>
    <artifactId>workshops-domain</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.release>25</maven.compiler.release>
    </properties>

</project>`;

const API_POM_CODE = `<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>4.1.1</version>
    </parent>

    <groupId>example.workshops</groupId>
    <artifactId>workshops-api</artifactId>
    <version>1.0.0</version>

    <properties>
        <java.version>25</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>example.workshops</groupId>
            <artifactId>workshops-domain</artifactId>
            <version>1.0.0</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>3.1.0</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-testcontainers</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>testcontainers-postgresql</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>`;

const APPLICATION_CODE = `package example.workshops.api;

import example.workshops.domain.RegistrationService;
import example.workshops.domain.Workshop;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class WorkshopsApplication {

    public static void main(String[] arguments) {
        SpringApplication.run(WorkshopsApplication.class, arguments);
    }

    @Bean
    Clock clock() {
        return Clock.systemUTC();
    }

    @Bean
    RegistrationService registrationService(Clock clock) {
        return new RegistrationService(
                List.of(
                        new Workshop(
                                UUID.fromString("11111111-1111-1111-1111-111111111111"),
                                "Reading legacy code",
                                12),
                        new Workshop(
                                UUID.fromString("22222222-2222-2222-2222-222222222222"),
                                "Accessible components",
                                2)),
                clock);
    }
}`;

const WORKSHOP_CODE = `package example.workshops.domain;

import java.util.UUID;

public record Workshop(UUID id, String title, int capacity) {
}`;

const REGISTRATION_CODE = `package example.workshops.domain;

import java.time.Instant;
import java.util.UUID;

public record Registration(
        UUID id,
        UUID workshopId,
        String attendeeName,
        String attendeeEmail,
        Instant registeredAt) {
}`;

const OUTCOME_CODE = `package example.workshops.domain;

import java.util.UUID;

public sealed interface RegisterOutcome {

    record Accepted(Registration registration) implements RegisterOutcome {
    }

    record WorkshopNotFound(UUID workshopId) implements RegisterOutcome {
    }

    record WorkshopFull(UUID workshopId, int capacity) implements RegisterOutcome {
    }
}`;

const SERVICE_CODE = `package example.workshops.domain;

import java.time.Clock;
import java.time.Instant;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public final class RegistrationService {

    private final Map<UUID, Workshop> workshopsById = new LinkedHashMap<>();

    private final Map<UUID, Registration> registrationsById = new LinkedHashMap<>();

    private final Clock clock;

    public RegistrationService(List<Workshop> workshops, Clock clock) {
        workshops.forEach(workshop -> workshopsById.put(workshop.id(), workshop));
        this.clock = clock;
    }

    public synchronized RegisterOutcome register(
            UUID workshopId,
            String attendeeName,
            String attendeeEmail) {
        Workshop workshop = workshopsById.get(workshopId);
        if (workshop == null) {
            return new RegisterOutcome.WorkshopNotFound(workshopId);
        }
        if (listForWorkshop(workshopId).size() >= workshop.capacity()) {
            return new RegisterOutcome.WorkshopFull(workshopId, workshop.capacity());
        }
        Registration registration = new Registration(
                UUID.randomUUID(),
                workshopId,
                attendeeName,
                attendeeEmail,
                Instant.now(clock));
        registrationsById.put(registration.id(), registration);
        return new RegisterOutcome.Accepted(registration);
    }

    public synchronized Optional<Registration> find(UUID registrationId) {
        return Optional.ofNullable(registrationsById.get(registrationId));
    }

    public synchronized List<Registration> listForWorkshop(UUID workshopId) {
        return registrationsById.values().stream()
                .filter(registration -> registration.workshopId().equals(workshopId))
                .sorted(Comparator.comparing(Registration::registeredAt))
                .toList();
    }

    public synchronized boolean cancel(UUID registrationId) {
        return registrationsById.remove(registrationId) != null;
    }
}`;

const REQUEST_CODE = `package example.workshops.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record RegisterRequest(
        @NotNull UUID workshopId,
        @NotBlank @Size(min = 2, max = 80) String attendeeName,
        @NotBlank @Email String attendeeEmail) {
}`;

const RESPONSE_CODE = `package example.workshops.api;

import example.workshops.domain.Registration;
import java.time.Instant;
import java.util.UUID;

public record RegistrationResponse(
        UUID id,
        UUID workshopId,
        String attendeeName,
        String attendeeEmail,
        Instant registeredAt) {

    public static RegistrationResponse from(Registration registration) {
        return new RegistrationResponse(
                registration.id(),
                registration.workshopId(),
                registration.attendeeName(),
                registration.attendeeEmail(),
                registration.registeredAt());
    }
}`;

const CONTROLLER_CODE = `package example.workshops.api;

import example.workshops.domain.RegisterOutcome;
import example.workshops.domain.Registration;
import example.workshops.domain.RegistrationService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

@RestController
@RequestMapping("/registrations")
class RegistrationController {

    private final RegistrationService registrations;

    RegistrationController(RegistrationService registrations) {
        this.registrations = registrations;
    }

    @PostMapping
    ResponseEntity<RegistrationResponse> register(@Valid @RequestBody RegisterRequest request) {
        RegisterOutcome outcome = registrations.register(
                request.workshopId(),
                request.attendeeName(),
                request.attendeeEmail());

        return switch (outcome) {
            case RegisterOutcome.Accepted(Registration registration) ->
                    ResponseEntity.created(addressOf(registration))
                            .body(RegistrationResponse.from(registration));
            case RegisterOutcome.WorkshopNotFound(UUID workshopId) ->
                    throw new WorkshopNotFoundException(workshopId);
            case RegisterOutcome.WorkshopFull(UUID workshopId, int capacity) ->
                    throw new WorkshopFullException(workshopId, capacity);
        };
    }

    @GetMapping("/{registrationId}")
    RegistrationResponse find(@PathVariable UUID registrationId) {
        return registrations.find(registrationId)
                .map(RegistrationResponse::from)
                .orElseThrow(() -> new RegistrationNotFoundException(registrationId));
    }

    @GetMapping
    List<RegistrationResponse> listForWorkshop(@RequestParam UUID workshopId) {
        return registrations.listForWorkshop(workshopId).stream()
                .map(RegistrationResponse::from)
                .toList();
    }

    @DeleteMapping("/{registrationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void cancel(@PathVariable UUID registrationId) {
        if (!registrations.cancel(registrationId)) {
            throw new RegistrationNotFoundException(registrationId);
        }
    }

    private static URI addressOf(Registration registration) {
        return MvcUriComponentsBuilder
                .fromMethodName(RegistrationController.class, "find", registration.id())
                .build()
                .toUri();
    }
}`;

const EXCEPTIONS_CODE = `package example.workshops.api;

import java.util.UUID;

class WorkshopFullException extends RuntimeException {

    private final UUID workshopId;

    WorkshopFullException(UUID workshopId, int capacity) {
        super("Workshop " + workshopId + " holds " + capacity + " places and all of them are taken.");
        this.workshopId = workshopId;
    }

    UUID workshopId() {
        return workshopId;
    }
}

class WorkshopNotFoundException extends RuntimeException {

    private final UUID workshopId;

    WorkshopNotFoundException(UUID workshopId) {
        super("Workshop " + workshopId + " does not exist.");
        this.workshopId = workshopId;
    }

    UUID workshopId() {
        return workshopId;
    }
}

class RegistrationNotFoundException extends RuntimeException {

    RegistrationNotFoundException(UUID registrationId) {
        super("Registration " + registrationId + " does not exist.");
    }
}

class WorkshopDirectoryUnavailableException extends RuntimeException {

    WorkshopDirectoryUnavailableException(UUID workshopId, Throwable cause) {
        super("The workshop directory did not answer for workshop " + workshopId + ".", cause);
    }
}`;

const REQUESTS_CODE = `curl -i -X POST http://localhost:8080/registrations \\
  -H "Content-Type: application/json" \\
  -d '{"workshopId":"11111111-1111-1111-1111-111111111111","attendeeName":"Sanne de Wit","attendeeEmail":"sanne@example.com"}'

HTTP/1.1 201
Location: http://localhost:8080/registrations/8f14e45f-ceea-467a-9f8d-3a1b7c26d0a1
Content-Type: application/json
{"id":"8f14e45f-ceea-467a-9f8d-3a1b7c26d0a1","workshopId":"11111111-1111-1111-1111-111111111111","attendeeName":"Sanne de Wit","attendeeEmail":"sanne@example.com","registeredAt":"2026-09-07T09:12:44.318Z"}

curl -i http://localhost:8080/registrations/8f14e45f-ceea-467a-9f8d-3a1b7c26d0a1

HTTP/1.1 200
{"id":"8f14e45f-ceea-467a-9f8d-3a1b7c26d0a1","workshopId":"11111111-1111-1111-1111-111111111111","attendeeName":"Sanne de Wit","attendeeEmail":"sanne@example.com","registeredAt":"2026-09-07T09:12:44.318Z"}

curl -i "http://localhost:8080/registrations?workshopId=11111111-1111-1111-1111-111111111111"

HTTP/1.1 200
[{"id":"8f14e45f-ceea-467a-9f8d-3a1b7c26d0a1","workshopId":"11111111-1111-1111-1111-111111111111","attendeeName":"Sanne de Wit","attendeeEmail":"sanne@example.com","registeredAt":"2026-09-07T09:12:44.318Z"}]

curl -i -X DELETE http://localhost:8080/registrations/8f14e45f-ceea-467a-9f8d-3a1b7c26d0a1

HTTP/1.1 204`;

const ROUTES_CODE = `package example.workshops.api;

import static org.springframework.web.servlet.function.RequestPredicates.accept;
import static org.springframework.web.servlet.function.RouterFunctions.route;

import example.workshops.domain.RegisterOutcome;
import example.workshops.domain.Registration;
import example.workshops.domain.RegistrationService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import java.net.URI;
import java.util.Set;
import java.util.UUID;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
@Profile("functional")
class RegistrationRoutes {

    private final RegistrationService registrations;

    private final Validator validator;

    RegistrationRoutes(RegistrationService registrations, Validator validator) {
        this.registrations = registrations;
        this.validator = validator;
    }

    @Bean
    RouterFunction<ServerResponse> registrationRoutes() {
        return route()
                .POST("/registrations", accept(MediaType.APPLICATION_JSON), this::register)
                .GET("/registrations/{registrationId}", this::find)
                .build();
    }

    private ServerResponse register(ServerRequest request) throws Exception {
        RegisterRequest body = request.body(RegisterRequest.class);
        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(body);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        RegisterOutcome outcome = registrations.register(
                body.workshopId(),
                body.attendeeName(),
                body.attendeeEmail());

        return switch (outcome) {
            case RegisterOutcome.Accepted(Registration registration) ->
                    ServerResponse.created(URI.create("/registrations/" + registration.id()))
                            .body(RegistrationResponse.from(registration));
            case RegisterOutcome.WorkshopNotFound(UUID workshopId) ->
                    throw new WorkshopNotFoundException(workshopId);
            case RegisterOutcome.WorkshopFull(UUID workshopId, int capacity) ->
                    throw new WorkshopFullException(workshopId, capacity);
        };
    }

    private ServerResponse find(ServerRequest request) {
        UUID registrationId = UUID.fromString(request.pathVariable("registrationId"));
        return registrations.find(registrationId)
                .map(RegistrationResponse::from)
                .map(response -> ServerResponse.ok().body(response))
                .orElseThrow(() -> new RegistrationNotFoundException(registrationId));
    }
}`;

const PROBLEM_JSON_CODE = `{
  "type": "https://workshops.example/problems/workshop-full",
  "title": "The workshop is full.",
  "status": 409,
  "detail": "Every place in this workshop is taken.",
  "workshopId": "22222222-2222-2222-2222-222222222222"
}`;

const ADVICE_CODE = `package example.workshops.api;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
class RegistrationAdvice extends ResponseEntityExceptionHandler {

    @ExceptionHandler(WorkshopFullException.class)
    ProblemDetail workshopFull(WorkshopFullException failure) {
        ProblemDetail problem = problemDetail(
                HttpStatus.CONFLICT,
                "workshop-full",
                "The workshop is full.",
                "Every place in this workshop is taken.");
        problem.setProperty("workshopId", failure.workshopId());
        return problem;
    }

    @ExceptionHandler(WorkshopNotFoundException.class)
    ProblemDetail workshopNotFound(WorkshopNotFoundException failure) {
        ProblemDetail problem = problemDetail(
                HttpStatus.NOT_FOUND,
                "workshop-not-found",
                "The workshop does not exist.",
                "No workshop is held under that identifier.");
        problem.setProperty("workshopId", failure.workshopId());
        return problem;
    }

    @ExceptionHandler(RegistrationNotFoundException.class)
    ProblemDetail registrationNotFound() {
        return problemDetail(
                HttpStatus.NOT_FOUND,
                "registration-not-found",
                "The registration does not exist.",
                "No registration is held under that identifier.");
    }

    @ExceptionHandler(WorkshopDirectoryUnavailableException.class)
    ProblemDetail directoryUnavailable() {
        return problemDetail(
                HttpStatus.BAD_GATEWAY,
                "directory-unavailable",
                "The workshop directory is unreachable.",
                "The workshop directory did not answer.");
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException failure,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
        ProblemDetail problem = problemDetail(
                HttpStatus.BAD_REQUEST,
                "invalid-registration",
                "The registration could not be read.",
                "One or more fields were rejected.");
        problem.setProperty("fields", fieldMessages(failure));
        return ResponseEntity.badRequest().body(problem);
    }

    private static ProblemDetail problemDetail(
            HttpStatus status,
            String name,
            String title,
            String detail) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, detail);
        problem.setType(URI.create("https://workshops.example/problems/" + name));
        problem.setTitle(title);
        return problem;
    }

    private static Map<String, String> fieldMessages(MethodArgumentNotValidException failure) {
        Map<String, String> messages = new LinkedHashMap<>();
        for (FieldError fieldError : failure.getBindingResult().getFieldErrors()) {
            messages.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return messages;
    }
}`;

const OPEN_API_CODE = `package example.workshops.api;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class OpenApiConfiguration {

    @Bean
    OpenAPI workshopsOpenApi() {
        return new OpenAPI().info(new Info()
                .title("Workshop registrations")
                .version("1.0.0"));
    }
}`;

const CLIENT_CODE = `package example.workshops.api;

import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
class WorkshopDirectoryClient {

    private final RestClient restClient;

    WorkshopDirectoryClient(RestClient.Builder builder) {
        this.restClient = builder.baseUrl("https://directory.example").build();
    }

    Optional<WorkshopSummary> findWorkshop(UUID workshopId) {
        try {
            return Optional.ofNullable(restClient.get()
                    .uri("/workshops/{workshopId}", workshopId)
                    .retrieve()
                    .body(WorkshopSummary.class));
        } catch (HttpClientErrorException.NotFound absent) {
            return Optional.empty();
        } catch (RestClientException failure) {
            throw new WorkshopDirectoryUnavailableException(workshopId, failure);
        }
    }

    record WorkshopSummary(UUID id, String title, int capacity) {
    }
}`;

const VALIDATION_JSON_CODE = `{
  "type": "https://workshops.example/problems/invalid-registration",
  "title": "The registration could not be read.",
  "status": 400,
  "detail": "One or more fields were rejected.",
  "fields": {
    "attendeeName": "must not be blank",
    "attendeeEmail": "must be a well-formed email address"
  }
}`;

const SLICE_TEST_CODE = `package example.workshops.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import example.workshops.domain.RegisterOutcome;
import example.workshops.domain.RegistrationService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(RegistrationController.class)
class RegistrationControllerTest {

    private static final UUID SMALL_WORKSHOP_ID =
            UUID.fromString("22222222-2222-2222-2222-222222222222");

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RegistrationService registrations;

    @Test
    void answers_a_full_workshop_with_a_conflict_that_names_the_workshop() throws Exception {
        given(registrations.register(any(), any(), any()))
                .willReturn(new RegisterOutcome.WorkshopFull(SMALL_WORKSHOP_ID, 2));

        mockMvc.perform(post("/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "workshopId": "22222222-2222-2222-2222-222222222222",
                                  "attendeeName": "Sanne de Wit",
                                  "attendeeEmail": "sanne@example.com"
                                }
                                """))
                .andExpect(status().isConflict())
                .andExpect(content().contentTypeCompatibleWith("application/problem+json"))
                .andExpect(jsonPath("$.type")
                        .value("https://workshops.example/problems/workshop-full"))
                .andExpect(jsonPath("$.workshopId").value(SMALL_WORKSHOP_ID.toString()));
    }

    @Test
    void answers_a_missing_name_and_a_broken_address_with_one_problem_document() throws Exception {
        mockMvc.perform(post("/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "workshopId": "22222222-2222-2222-2222-222222222222",
                                  "attendeeName": "",
                                  "attendeeEmail": "sanne"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields.attendeeName").exists())
                .andExpect(jsonPath("$.fields.attendeeEmail").exists());
    }
}`;

const CONTEXT_TEST_CODE = `package example.workshops.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class WorkshopsApplicationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void serves_the_registrations_of_a_seeded_workshop() throws Exception {
        mockMvc.perform(get("/registrations")
                        .param("workshopId", "11111111-1111-1111-1111-111111111111"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void answers_an_unknown_registration_with_a_problem_document() throws Exception {
        mockMvc.perform(get("/registrations/44444444-4444-4444-4444-444444444444"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.type")
                        .value("https://workshops.example/problems/registration-not-found"));
    }
}`;

const CONTAINER_TEST_CODE = `package example.workshops.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.postgresql.PostgreSQLContainer;

@SpringBootTest
@AutoConfigureMockMvc
@Import(RegistrationDatabaseTest.Containers.class)
class RegistrationDatabaseTest {

    @TestConfiguration(proxyBeanMethods = false)
    static class Containers {

        @Bean
        @ServiceConnection
        PostgreSQLContainer postgresContainer() {
            return new PostgreSQLContainer("postgres:18-alpine");
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Test
    void reads_a_registration_back_from_the_address_it_answered_with() throws Exception {
        String address = mockMvc.perform(post("/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "workshopId": "11111111-1111-1111-1111-111111111111",
                                  "attendeeName": "Sanne de Wit",
                                  "attendeeEmail": "sanne@example.com"
                                }
                                """))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getHeader("Location");

        mockMvc.perform(get(address))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attendeeName").value("Sanne de Wit"));
    }
}`;

const TEST_RUN_CODE = `mvn test

[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0 - RegistrationControllerTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0 - WorkshopsApplicationTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0 - RegistrationDatabaseTest
[INFO]
[INFO] Results:
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO]
[INFO] BUILD SUCCESS`;

const APPLICATION_YAML_CODE = `spring:
  application:
    name: workshops-api
  threads:
    virtual:
      enabled: true`;

const COPY = {
  contentsLabel: { en: "In this article", nl: "In dit artikel" },
  lead: {
    en: "Spring Boot answers most of the questions an API raises before you write a line. What is left is the part a client feels: the shape of a request, the shape of a failure, and the document that describes both.",
    nl: "Spring Boot beantwoordt de meeste vragen die een API oproept voordat je een regel schrijft. Wat overblijft, is het deel dat een client merkt: de vorm van een request, de vorm van een fout en het document dat allebei beschrijft.",
  },
  intro1: {
    en: "I am a frontend engineer who writes the backend when the build needs it. At the Belastingdienst I built a visual forms editor and extended the backend endpoints it called, so the work of the editors was stored and the state of every form could be rebuilt from the backend. At bol.com the pages I had to move had no written specification. Their behaviour lived in server-side Java, so I read that code, wrote down what each page actually does, and checked my reading with the backend engineers who own the services.",
    nl: "Ik ben een frontend engineer die de backend schrijft als de bouw daarom vraagt. Bij de Belastingdienst bouwde ik een visuele formulierenbouwer en breidde ik de endpoints uit die hij aanriep, zodat het werk van de redacteuren werd opgeslagen en de staat van elk formulier vanuit de backend te herbouwen was. Bij bol.com hadden de pagina's die ik moest verplaatsen geen geschreven specificatie. Hun gedrag zat in server-side Java, dus las ik die code, schreef ik op wat elke pagina werkelijk doet, en toetste ik mijn lezing bij de backend engineers die de services beheren.",
  },
  versions: {
    en: "The samples in this article target Java 25 and Spring Boot 4.1, checked on 7 September 2026. JDK 25 is the long-term-support release, generally available since 16 September 2025. Spring Boot 4.1.1 sits on Spring Framework 7.0.9, asks for Java 17 as a minimum and supports up to Java 26.",
    nl: "De voorbeelden in dit artikel zijn geschreven voor Java 25 en Spring Boot 4.1, gecontroleerd op 7 september 2026. JDK 25 is de langetermijnrelease, algemeen beschikbaar sinds 16 september 2025. Spring Boot 4.1.1 staat op Spring Framework 7.0.9, vraagt minimaal Java 17 en ondersteunt tot en met Java 26.",
  },
  intro2: {
    en: "The example is one small API for workshop registrations, the same one the ASP.NET Core article in this series builds. A workshop has a title and a number of places. A registration puts one attendee in one workshop. A workshop with no places left refuses a new registration. The names, the paths and the status codes match across the two articles.",
    nl: "Het voorbeeld is één kleine API voor workshopinschrijvingen, dezelfde die het ASP.NET Core-artikel in deze reeks bouwt. Een workshop heeft een titel en een aantal plaatsen. Een inschrijving zet één deelnemer in één workshop. Een workshop zonder vrije plaatsen weigert een nieuwe inschrijving. De namen, de paden en de statuscodes zijn in beide artikelen gelijk.",
  },
  quote: {
    en: "A framework decides how a request reaches your code. You decide what a client sees when it goes wrong.",
    nl: "Een framework bepaalt hoe een request bij je code komt. Jij bepaalt wat een client ziet als het misgaat.",
  },
  shapeTitle: {
    en: "What a Spring Boot API looks like today",
    nl: "Hoe een Spring Boot-API er vandaag uitziet",
  },
  shape1: {
    en: "Three starters carry this API. The web starter brings an embedded server, Spring MVC and Jackson. The validation starter brings Hibernate Validator. The test starter brings JUnit 5, Mockito and the Spring test support. The rest arrives by auto-configuration, which reads the classpath.",
    nl: "Drie starters dragen deze API. De web-starter brengt een ingebouwde server, Spring MVC en Jackson mee. De validatie-starter brengt Hibernate Validator. De test-starter brengt JUnit 5, Mockito en de testondersteuning van Spring. De rest komt via auto-configuratie, die het classpath leest.",
  },
  shape2: {
    en: "Two Maven modules keep the rules apart from the protocol. The domain module holds the workshop, the registration and the rule about places. The api module depends on it and adds the web layer. Four commands make the folders, and the tree below is every file this article writes.",
    nl: "Twee Maven-modules houden de regels los van het protocol. De domeinmodule bevat de workshop, de inschrijving en de regel over de plaatsen. De api-module hangt daarvan af en voegt de weblaag toe. Vier commando's maken de mappen, en de boom hieronder is elk bestand dat dit artikel schrijft.",
  },
  treeAggregator: { en: "the two modules", nl: "de twee modules" },
  treeDomainPom: { en: "no framework dependency", nl: "geen frameworkafhankelijkheid" },
  treeApiPom: { en: "web, validation, springdoc, tests", nl: "web, validatie, springdoc, tests" },
  treeCaption: {
    en: "Every file this article writes, and where it goes.",
    nl: "Elk bestand dat dit artikel schrijft, en waar het hoort.",
  },
  shape3: {
    en: "Three build files. The aggregator lists the two modules, so one command builds both. The domain pom has no dependencies element at all, and that is the arrow pointing one way, enforced by Maven. The api pom names Java 25, the three starters, springdoc, the two test-scoped Testcontainers artifacts and the plugin that runs the application.",
    nl: "Drie buildbestanden. De aggregator noemt de twee modules, zodat één commando allebei bouwt. In de domein-pom staat helemaal geen dependencies-element, en dat is de pijl die één kant op wijst, afgedwongen door Maven. De api-pom noemt Java 25, de drie starters, springdoc, de twee Testcontainers-artefacten in testscope en de plugin die de applicatie start.",
  },
  shape4: {
    en: "The application class starts the server and wires the domain into it. It seeds the two workshops and supplies the clock, because a service that reads the current time from a field is a service you can test.",
    nl: "De applicatieklasse start de server en hangt het domein eraan. Ze zet de twee workshops klaar en levert de klok, want een service die de huidige tijd uit een veld leest, is een service die je kunt testen.",
  },
  shape5: {
    en: "Two commands build both modules and start the API on port 8080. The first installs the domain module so the second can resolve it.",
    nl: "Twee commando's bouwen allebei de modules en starten de API op poort 8080. Het eerste installeert de domeinmodule, zodat het tweede hem kan vinden.",
  },
  shape6: {
    en: "Notice what the domain service is not. It carries no annotation, so Spring knows it only through this bean method. Moving the store to a database later, or calling the same service from a scheduled job, changes this file and leaves the domain untouched.",
    nl: "Let op wat de domeinservice niet is. Er staat geen annotatie op, dus Spring kent hem alleen via deze bean-methode. De opslag later naar een database verplaatsen, of dezelfde service vanuit een geplande taak aanroepen, verandert dit bestand en laat het domein ongemoeid.",
  },
  recordsTitle: {
    en: "Records as request and response types",
    nl: "Records als request- en responstypes",
  },
  records1: {
    en: "A record declares its components once and the compiler supplies the constructor, the accessors, equals, hashCode and toString. Two of them carry the data here, each in a file of its own.",
    nl: "Een record noemt zijn componenten één keer en de compiler levert de constructor, de accessors, equals, hashCode en toString. Twee ervan dragen hier de gegevens, elk in een eigen bestand.",
  },
  records2: {
    en: "The outcome of an attempt to register is a closed set of three cases. A sealed interface with the three records nested inside needs no permits clause, because the compiler sees them all in one file. Sealed types are final since Java 17, record patterns since Java 21, and the controller leans on both.",
    nl: "De uitkomst van een poging tot inschrijven is een gesloten verzameling van drie gevallen. Een sealed interface met de drie records erin genest heeft geen permits-clausule nodig, want de compiler ziet ze allemaal in één bestand. Sealed types zijn definitief sinds Java 17, record patterns sinds Java 21, en de controller leunt op allebei.",
  },
  records3: {
    en: "Because the set is closed, a switch over it needs no default arm. Add a fourth case tomorrow and every switch that reads this type stops compiling until someone decides what the API answers.",
    nl: "Omdat de verzameling gesloten is, heeft een switch erover geen default-tak nodig. Voeg morgen een vierde geval toe en elke switch die dit type leest, compileert niet meer tot iemand beslist wat de API antwoordt.",
  },
  records4: {
    en: "Here is what produces those outcomes. The store is a map, so the example stays about the API. Counting the places and adding the registration have to be one step, because two requests reach this bean at the same time.",
    nl: "Dit is wat die uitkomsten oplevert. De opslag is een map, zodat het voorbeeld over de API blijft gaan. Het tellen van de plaatsen en het toevoegen van de inschrijving moeten één stap zijn, want twee requests komen tegelijk bij deze bean.",
  },
  records5: {
    en: "There is no HttpServletRequest in that file, no status code and no annotation. The rule about a full workshop is a sentence in a method, and swapping the map for a table changes nothing above it.",
    nl: "In dat bestand staat geen HttpServletRequest, geen statuscode en geen annotatie. De regel over een volle workshop is een zin in een methode, en de map vervangen door een tabel verandert niets erboven.",
  },
  validationTitle: {
    en: "Validation with jakarta constraints",
    nl: "Validatie met jakarta-constraints",
  },
  validation1: {
    en: "The validation starter brings Hibernate Validator 9.1.3, which implements jakarta.validation 3.1.1. The constraints live in jakarta.validation.constraints and go straight onto the record components, where they land on the field and the accessor both.",
    nl: "De validatie-starter brengt Hibernate Validator 9.1.3 mee, die jakarta.validation 3.1.1 implementeert. De constraints staan in jakarta.validation.constraints en gaan rechtstreeks op de recordcomponenten, waar ze zowel op het veld als op de accessor belanden.",
  },
  validation2: {
    en: "One annotation on the parameter runs them. With @Valid in front of @RequestBody, a request with an empty name and an address without an at sign comes back as a 400 and the method body never runs. The failure arrives as a MethodArgumentNotValidException.",
    nl: "Eén annotatie op de parameter laat ze draaien. Met @Valid voor @RequestBody komt een request met een lege naam en een adres zonder apenstaartje terug als een 400, en de body van de methode draait nooit. De fout komt binnen als een MethodArgumentNotValidException.",
  },
  validation3: {
    en: "A body Jackson cannot read at all stops one step earlier, at HttpMessageNotReadableException, which is also a 400. A value that is well formed but meaningless belongs in the domain, where an unknown workshop is already a case of its own. For a rule that no constraint expresses, the compact constructor of the record is the place, as long as you remember that an exception thrown there leaves the web layer through the same advice class.",
    nl: "Een body die Jackson helemaal niet kan lezen, strandt een stap eerder, bij HttpMessageNotReadableException, en dat is ook een 400. Een waarde die goed gevormd maar zinloos is, hoort in het domein, waar een onbekende workshop al een eigen geval is. Voor een regel die geen enkele constraint uitdrukt, is de compacte constructor van het record de plek, zolang je onthoudt dat een exceptie die daar valt, de weblaag via dezelfde advice-klasse verlaat.",
  },
  validationWarningTitle: {
    en: "Two places where a constraint quietly does nothing",
    nl: "Twee plekken waar een constraint stilletjes niets doet",
  },
  validationWarningBody: {
    en: "A constrained record is checked only when the parameter carries @Valid, so a handler that leaves the annotation off accepts anything Jackson could parse. And a constraint on a field that holds another object stops at the outer level, so a nested record needs @Valid on the field as well. Both look like working code, because nothing throws.",
    nl: "Een record met constraints wordt alleen gecontroleerd als de parameter @Valid draagt, dus een handler die de annotatie weglaat, accepteert alles wat Jackson kan lezen. En een constraint op een veld dat een ander object bevat, stopt op het buitenste niveau, dus een genest record heeft ook @Valid op het veld nodig. Allebei zien ze eruit als werkende code, want er gaat niets stuk.",
  },
  controllerTitle: {
    en: "The controller, and the functional alternative",
    nl: "De controller, en het functionele alternatief",
  },
  controller1: {
    en: "The api module keeps its own record for the wire. It looks like the domain record today, and it stops the day the domain gains a field a client has no business seeing.",
    nl: "De api-module houdt een eigen record voor de buitenkant. Dat lijkt vandaag op het domeinrecord, en daar houdt het op zodra het domein een veld krijgt waar een client niets mee te maken heeft.",
  },
  controller2: {
    en: "Now the controller. Four methods, constructor injection, and a switch that maps the sealed outcome onto an answer. The record patterns pull the values straight out of each case, so there is no cast.",
    nl: "Dan de controller. Vier methodes, constructorinjectie, en een switch die de sealed uitkomst op een antwoord afbeeldt. De record patterns halen de waarden rechtstreeks uit elk geval, dus er is geen cast nodig.",
  },
  controller3: {
    en: "MvcUriComponentsBuilder is the piece worth taking away. It builds the Location header from the route table by naming the method, so the address is generated and never a string that goes stale when a path moves. A 201 with an address nobody can follow is a 201 that lied. The four exceptions this article throws sit in one file, which Java allows because none of them is public.",
    nl: "MvcUriComponentsBuilder is het stuk dat je wilt overnemen. Het bouwt de Location-header op uit de routeringstabel door de methode te noemen, dus het adres wordt gegenereerd en is nooit een string die verjaart zodra een pad verschuift. Een 201 met een adres dat niemand kan volgen, is een 201 die loog. De vier excepties die dit artikel gooit, staan in één bestand, wat Java toestaat omdat geen van hen publiek is.",
  },
  controller4: {
    en: "With the API running, the four routes answer like this. Each call is followed by the status line and the body that comes back.",
    nl: "Met de API aan de praat antwoorden de vier routes zo. Elke aanroep wordt gevolgd door de statusregel en de body die terugkomt.",
  },
  controller5: {
    en: "Spring MVC serves the same routes without any of those annotations. A RouterFunction is a routing table you read from top to bottom, built in a bean method and handed to the dispatcher. The profile on it keeps it out of the way until you ask for it, because two mappings cannot hold the same path at once.",
    nl: "Spring MVC bedient dezelfde routes ook zonder een van die annotaties. Een RouterFunction is een routeringstabel die je van boven naar beneden leest, gebouwd in een bean-methode en doorgegeven aan de dispatcher. Het profiel erop houdt hem uit de weg tot je erom vraagt, want twee mappings kunnen niet tegelijk hetzelfde pad bezetten.",
  },
  controller6: {
    en: "The trade shows in that handler. The functional model hands you the request and lets you decide, so reading the body and running the validator are lines you write yourself, and the router builder carries an onError of its own for what a violation becomes. In exchange the routing table sits in one place, and a handler is a method with no framework annotation on it. Add -Dspring-boot.run.profiles=functional to the run command and this file serves the two routes it declares.",
    nl: "De ruil zie je in die handler. Het functionele model geeft je het request en laat je beslissen, dus de body lezen en de validator draaien zijn regels die je zelf schrijft, en de routerbouwer heeft een eigen onError voor wat een schending wordt. Daarvoor terug staat de routeringstabel op één plek, en is een handler een methode zonder framework-annotatie erop. Zet -Dspring-boot.run.profiles=functional achter het startcommando en dit bestand bedient de twee routes die erin staan.",
  },
  controller7: {
    en: "Pick the annotated model when the team already reads Spring that way, which is most teams. Pick the functional model for a small set of routes where you want the whole table on one screen. The two models mix inside one application, as long as no two of them claim the same path.",
    nl: "Kies het geannoteerde model als het team Spring toch al zo leest, en dat geldt voor de meeste teams. Kies het functionele model voor een kleine set routes waarvan je de hele tabel op één scherm wilt zien. De twee modellen gaan samen binnen één applicatie, zolang er geen twee hetzelfde pad opeisen.",
  },
  problemTitle: {
    en: "Errors as ProblemDetail, following RFC 9457",
    nl: "Fouten als ProblemDetail, volgens RFC 9457",
  },
  problem1: {
    en: "RFC 9457 describes one shape for an error body. A type that identifies the problem, a title, the status, a detail about this occurrence, an instance that names the request, and any extension member you add. Spring models it as ProblemDetail and serves it as application/problem+json.",
    nl: "RFC 9457 beschrijft één vorm voor een foutbody. Een type dat het probleem aanduidt, een titel, de status, een detail over dit voorval, een instance die het request benoemt, en elk extra veld dat je toevoegt. Spring modelleert dat als ProblemDetail en serveert het als application/problem+json.",
  },
  problem2: {
    en: "This is what a client gets when the last place in a workshop is gone.",
    nl: "Dit krijgt een client als de laatste plaats in een workshop weg is.",
  },
  problem3: {
    en: "The workshopId is why this body is worth building by hand. A client can act on a field. It cannot act on a sentence that changes when someone rewrites the copy. The title and the detail are for the person reading a log. The type and the extension members are for the code.",
    nl: "De workshopId is waarom deze body het waard is om met de hand op te bouwen. Een client kan iets met een veld. Met een zin die verandert zodra iemand de tekst herschrijft, kan hij niets. De titel en het detail zijn voor de mens die een log leest. Het type en de extra velden zijn voor de code.",
  },
  problem4: {
    en: "At bol.com I gave every backend outcome of the Kobo Plus promotion codes its own message, so a customer never lands on a generic error. That work starts in the API, because an interface can only say what went wrong when the answer it receives carries the difference.",
    nl: "Bij bol.com gaf ik elke backenduitkomst van de Kobo Plus-actiecodes een eigen melding, zodat een klant nooit op een algemene fout uitkomt. Dat werk begint in de API, want een interface kan alleen zeggen wat er misging als het antwoord dat hij krijgt het verschil draagt.",
  },
  adviceTitle: {
    en: "@RestControllerAdvice, and one place for failure",
    nl: "@RestControllerAdvice, en één plek voor fouten",
  },
  advice1: {
    en: "A request can end at three different points, and each one produces a status code. The advice class is what keeps those three answers looking the same.",
    nl: "Een request kan op drie verschillende punten eindigen, en elk daarvan levert een statuscode op. De advice-klasse zorgt dat die drie antwoorden er hetzelfde uitzien.",
  },
  advice2: {
    en: "Two things keep this class small. A method that returns ProblemDetail sets the response status from the document itself, so there is no ResponseEntity to build. And extending ResponseEntityExceptionHandler means every exception Spring MVC raises on its own already arrives here, so one override adds the field names to a validation failure.",
    nl: "Twee dingen houden deze klasse klein. Een methode die ProblemDetail teruggeeft, zet de responsstatus vanuit het document zelf, dus er valt geen ResponseEntity te bouwen. En door ResponseEntityExceptionHandler uit te breiden komt elke exceptie die Spring MVC zelf opwerpt hier al binnen, dus één override voegt de veldnamen aan een validatiefout toe.",
  },
  advice3: {
    en: "The fields member is the contract a form in the browser depends on. It is keyed by the record component name, so the interface puts each message under the input it belongs to. This is what a client receives for a registration with no name and a broken address.",
    nl: "Het veld fields is het contract waar een formulier in de browser op leunt. Het is gesleuteld op de naam van de recordcomponent, zodat de interface elke melding onder het juiste invoerveld zet. Dit is wat een client krijgt bij een inschrijving zonder naam en met een kapot adres.",
  },
  advice4: {
    en: "One choice in here is worth saying out loud. A full workshop is an expected outcome, so the domain returns it as a value. The controller turns that value into an exception inside the web module, one line from the edge. The domain keeps its sealed type and the client keeps one answer shape.",
    nl: "Eén keuze hierin verdient het om hardop gezegd te worden. Een volle workshop is een verwachte uitkomst, dus het domein geeft die terug als waarde. De controller maakt van die waarde een exceptie binnen de webmodule, één regel van de rand. Het domein houdt zijn sealed type en de client houdt één antwoordvorm.",
  },
  openApiTitle: {
    en: "OpenAPI with springdoc",
    nl: "OpenAPI met springdoc",
  },
  openApi1: {
    en: "Spring Boot ships no OpenAPI document of its own, so this is a dependency you add. springdoc-openapi 3.1.0 is the line for Spring Boot 4.x, with 2.9.0 for the 3.x line. The webmvc-ui starter serves the document and a Swagger UI page.",
    nl: "Spring Boot levert zelf geen OpenAPI-document, dus dit is een afhankelijkheid die je toevoegt. springdoc-openapi 3.1.0 is de lijn voor Spring Boot 4.x, met 2.9.0 voor de 3.x-lijn. De webmvc-ui-starter serveert het document en een Swagger UI-pagina.",
  },
  openApi2: {
    en: "It reads the controllers, and the records do most of the work. Every component becomes a schema property and the jakarta constraints become schema keywords, so a minimum length reaches the document without anyone writing it twice. The failures live in the advice class, so declare those with @ApiResponse.",
    nl: "Het leest de controllers, en de records doen het meeste werk. Elke component wordt een schema-eigenschap en de jakarta-constraints worden schemasleutelwoorden, dus een minimumlengte bereikt het document zonder dat iemand hem twee keer opschrijft. De fouten wonen in de advice-klasse, dus verklaar die met @ApiResponse.",
  },
  openApi3: {
    en: "One bean sets the title and the version, and a generated document is worth more than a written one for one reason. It cannot drift away from the code that produced it. At bol.com, where the schema did not fit a data-driven frontend, I took the change into the GraphQL contract with the backend team, and a bare mandate reference became a structured mandate object. That conversation is the same conversation an OpenAPI document starts, in a different notation.",
    nl: "Eén bean zet de titel en de versie, en een gegenereerd document is om één reden meer waard dan een geschreven document. Het kan niet weglopen van de code die het heeft opgeleverd. Bij bol.com, waar het schema niet paste bij een datagedreven frontend, bracht ik de wijziging in het GraphQL-contract met het backendteam, en werd een kale mandaatverwijzing een gestructureerd mandaatobject. Dat gesprek is hetzelfde gesprek dat een OpenAPI-document begint, in een andere notatie.",
  },
  clientTitle: {
    en: "Calling another service with RestClient",
    nl: "Een andere service aanroepen met RestClient",
  },
  client1: {
    en: "RestTemplate is deprecated in Spring Framework 7, so a new synchronous call goes through RestClient. Spring Boot auto-configures a RestClient.Builder, so a component asks for the builder, sets a base URL and keeps the client in a field. None of the four routes calls it yet, and this is the shape the call takes when one of them has to.",
    nl: "RestTemplate is afgeschaft in Spring Framework 7, dus een nieuwe synchrone aanroep gaat via RestClient. Spring Boot configureert zelf een RestClient.Builder, dus een component vraagt om de builder, zet een basis-URL en houdt de client in een veld. Geen van de vier routes roept hem aan, en dit is de vorm die de aanroep krijgt zodra een van hen dat moet.",
  },
  client2: {
    en: "retrieve throws on a 4xx and a 5xx by default, and that is the right starting point. What matters is the difference between the two. A 404 from the other service is an answer, so it becomes an empty Optional. Anything else is a failure this API cannot fix, so it becomes an exception the advice class turns into a 502, and the caller learns that the problem is upstream.",
    nl: "retrieve gooit standaard bij een 4xx en een 5xx, en dat is het juiste uitgangspunt. Waar het om gaat, is het verschil tussen die twee. Een 404 van de andere service is een antwoord, dus die wordt een lege Optional. Al het andere is een fout die deze API niet kan oplossen, dus die wordt een exceptie die de advice-klasse in een 502 vertaalt, en de aanroeper leert dat het probleem verderop zit.",
  },
  client3: {
    en: "The onStatus method changes that rule per call when you want a status handled without an exception. Two things belong on the builder: a read timeout on the request factory, and the headers every call to that service needs. A call with no timeout waits as long as the other side feels like waiting.",
    nl: "De methode onStatus verandert die regel per aanroep als je een status zonder exceptie wilt afhandelen. Twee dingen horen op de builder: een leestime-out op de request factory, en de headers die elke aanroep naar die service nodig heeft. Een aanroep zonder time-out wacht net zo lang als de andere kant zin heeft om te wachten.",
  },
  testingTitle: {
    en: "Tests: slice, full context, and Testcontainers",
    nl: "Tests: slice, volledige context en Testcontainers",
  },
  testing1: {
    en: "Three scopes cover this API, and they cost very different amounts of time to run.",
    nl: "Drie niveaus dekken deze API af, en ze kosten heel verschillende hoeveelheden tijd om te draaien.",
  },
  testing2: {
    en: "A slice test starts the web layer for one controller and nothing else. Routing, Jackson, @Valid and the advice class all run, which is the part a unit test on the handler skips. @MockitoBean replaces the domain service, so the test says what the domain answers and checks what the client receives.",
    nl: "Een slice-test start de weblaag voor één controller en verder niets. Routering, Jackson, @Valid en de advice-klasse draaien allemaal, en dat is het deel dat een unittest op de handler overslaat. @MockitoBean vervangt de domeinservice, dus de test zegt wat het domein antwoordt en controleert wat de client krijgt.",
  },
  testing3: {
    en: "Both tests read the wire and not the Java. The first checks the content type, the problem type and the workshopId, because those are what a client is written against. The second checks that the two rejected fields appear under their own name.",
    nl: "Allebei de tests lezen de buitenkant en niet het Java. De eerste controleert het contenttype, het probleemtype en de workshopId, want dat is waar een client tegenaan geschreven wordt. De tweede controleert dat de twee afgekeurde velden onder hun eigen naam verschijnen.",
  },
  testing4: {
    en: "The second scope starts the application itself. No stand-in takes part, so the real service, the real advice class and the real bean definitions all run, and a wiring mistake fails here and nowhere else.",
    nl: "Het tweede niveau start de applicatie zelf. Er doet geen vervanger mee, dus de echte service, de echte advice-klasse en de echte beandefinities draaien allemaal, en een bedradingsfout valt hier om en nergens anders.",
  },
  testing5: {
    en: "The moment the store stops being a map and becomes a table, the test that matters runs against a real database. Three dependencies join the api module: a data starter, spring-boot-testcontainers and org.testcontainers:testcontainers-postgresql, the last two in test scope. Testcontainers 2.0.5 puts the container class in org.testcontainers.postgresql and drops the type argument its constructor used to need. @ServiceConnection is what saves the properties file, because Spring Boot reads the running container and points the datasource at it.",
    nl: "Zodra de opslag geen map meer is maar een tabel, draait de test die ertoe doet tegen een echte database. Drie afhankelijkheden komen bij de api-module: een data-starter, spring-boot-testcontainers en org.testcontainers:testcontainers-postgresql, de laatste twee in testscope. Testcontainers 2.0.5 zet de containerklasse in org.testcontainers.postgresql en laat het typeargument vallen dat de constructor vroeger nodig had. @ServiceConnection is wat het propertiesbestand uitspaart, want Spring Boot leest de draaiende container en wijst de datasource ernaartoe.",
  },
  testing6: {
    en: "That test walks the path a client walks. It posts a registration, follows the Location header it got back, and reads the attendee out of the second response. Nothing in it knows which database engine is underneath, which is the point of running the real one. It needs a Docker daemon, and it starts proving persistence the moment a repository sits behind the service. One command runs all three scopes from the root of the project.",
    nl: "Die test loopt het pad dat een client loopt. Hij post een inschrijving, volgt de Location-header die hij terugkreeg, en leest de deelnemer uit het tweede antwoord. Niets erin weet welke database-engine eronder zit, en dat is precies waarom je de echte draait. Hij heeft een Docker-daemon nodig, en hij bewijst persistentie zodra er een repository achter de service zit. Eén commando draait alle drie de niveaus vanuit de hoofdmap van het project.",
  },
  testing7: {
    en: "Three scopes, five tests, and only the last one needs anything outside the JVM. That ratio is what keeps a suite fast enough to run before every push.",
    nl: "Drie niveaus, vijf tests, en alleen de laatste heeft iets nodig buiten de JVM. Die verhouding houdt een suite snel genoeg om voor elke push te draaien.",
  },
  threadsTitle: {
    en: "Virtual threads, and the switch that is still off",
    nl: "Virtual threads, en de schakelaar die nog uit staat",
  },
  threads1: {
    en: "Virtual threads are final since Java 21, and Spring Boot has a single property for them. In Spring Boot 4.1 that property still defaults to false, so turning it on is a line somebody writes on purpose.",
    nl: "Virtual threads zijn definitief sinds Java 21, en Spring Boot heeft er één property voor. In Spring Boot 4.1 staat die property standaard nog op false, dus aanzetten is een regel die iemand met opzet schrijft.",
  },
  threads2: {
    en: "With it on, the servlet container serves each request on a virtual thread, and so do task execution and scheduling. A thread that blocks on a database call or on the RestClient above releases its carrier while it waits. Not one line of the code in this article changes.",
    nl: "Met die property aan bedient de servletcontainer elk request op een virtual thread, en doen taakuitvoering en planning dat ook. Een thread die blokkeert op een databaseaanroep of op de RestClient hierboven, geeft zijn carrier vrij terwijl hij wacht. Geen regel van de code in dit artikel verandert.",
  },
  threads3: {
    en: "Three things are worth a look before the switch goes on. A connection pool sized for a small platform pool becomes the new ceiling. A ThreadLocal used as a per-request cache now lives on a thread that appears and disappears per request. Anything that reads a thread name reads something else. Read the code first.",
    nl: "Drie dingen zijn een blik waard voordat de schakelaar omgaat. Een connectiepool die op een kleine platformpool is afgestemd, wordt het nieuwe plafond. Een ThreadLocal die als cache per request wordt gebruikt, leeft nu op een thread die per request ontstaat en verdwijnt. Alles wat een threadnaam leest, leest voortaan iets anders. Lees eerst de code.",
  },
  migrationTitle: {
    en: "Moving off a Java 8 codebase, in order",
    nl: "Weg van een Java 8-codebase, op volgorde",
  },
  migration1: {
    en: "Everything above assumes a modern JDK. Plenty of running systems are still on Java 8, and the way off it is one step at a time, with a release after each step.",
    nl: "Alles hierboven gaat uit van een moderne JDK. Genoeg draaiende systemen staan nog op Java 8, en je verlaat dat het beste stap voor stap, met na elke stap een release.",
  },
  stepBuildLabel: { en: "The build first.", nl: "Eerst de build." },
  stepBuild: {
    en: "Compile the existing source on the new JDK without touching a line of it. That means a Maven toolchain, current plugin versions and a compiler release setting. Most of the work in this step is plugins that predate the module system.",
    nl: "Compileer de bestaande broncode op de nieuwe JDK zonder er een regel aan te veranderen. Dat vraagt om een Maven-toolchain, actuele pluginversies en een compiler release-instelling. Het meeste werk in deze stap zit in plugins van voor het modulesysteem.",
  },
  stepNamespaceLabel: { en: "Then the namespace.", nl: "Dan de namespace." },
  stepNamespace: {
    en: "Jakarta EE 11 uses the jakarta prefix throughout and asks for Java SE 17 as a minimum. Every javax import changes, along with the libraries that carry them. This one is mechanical and large, which makes it a release of its own.",
    nl: "Jakarta EE 11 gebruikt overal het voorvoegsel jakarta en vraagt minimaal Java SE 17. Elke javax-import verandert, samen met de bibliotheken die ze meebrengen. Deze stap is mechanisch en omvangrijk, en daarmee een eigen release.",
  },
  stepProcessorsLabel: { en: "Then annotation processing.", nl: "Dan annotatieverwerking." },
  stepProcessors: {
    en: "Since JDK 23 the compiler defaults to -proc:none. A build that relied on finding a processor on the classpath now generates nothing, and the failure shows up as a missing class. Name the processor path and the surprise is gone.",
    nl: "Sinds JDK 23 staat de compiler standaard op -proc:none. Een build die erop leunde dat een processor op het classpath werd gevonden, genereert nu niets, en de fout duikt op als een ontbrekende klasse. Benoem het processorpad en de verrassing is weg.",
  },
  stepLanguageLabel: { en: "Then the language.", nl: "Dan de taal." },
  stepLanguage: {
    en: "Now the value classes become records, the closed result sets become sealed interfaces, and the chains of instanceof become switch patterns. This step deletes more than it adds.",
    nl: "Nu worden de waardeklassen records, de gesloten resultaatverzamelingen sealed interfaces, en de ketens van instanceof switch patterns. Deze stap schrapt meer dan hij toevoegt.",
  },
  stepFrameworkLabel: { en: "The framework last.", nl: "Het framework als laatste." },
  stepFramework: {
    en: "A framework upgrade on a codebase that already compiles, already uses the right namespace and already reads well is a small change with a short list of release notes. The same upgrade on all three at once is a week nobody can estimate.",
    nl: "Een frameworkupgrade op een codebase die al compileert, al de juiste namespace gebruikt en al goed leest, is een kleine wijziging met een korte lijst release notes. Dezelfde upgrade op alle drie tegelijk is een week die niemand kan inschatten.",
  },
  migration2: {
    en: "At the Belastingdienst the stack was Java 8, Maven and MySQL. That is the kind of codebase these five steps are written for. Reading it before changing it is most of the work, and the reading is what makes each step safe to take on its own.",
    nl: "Bij de Belastingdienst was de stack Java 8, Maven en MySQL. Dat is het soort codebase waarvoor deze vijf stappen geschreven zijn. Hem lezen voordat je hem verandert is het meeste werk, en dat lezen maakt elke stap afzonderlijk veilig.",
  },
  migration3: {
    en: "The order above has one property that makes it worth following. Every step ends with something you can release, and every step can be stopped where it stands.",
    nl: "De volgorde hierboven heeft één eigenschap die haar de moeite waard maakt. Elke stap eindigt met iets dat je kunt uitrollen, en elke stap kan blijven staan waar hij staat.",
  },
  closeTitle: {
    en: "What to take away",
    nl: "Wat je meeneemt",
  },
  close1: {
    en: "Spring Boot decides very little about the four things a client actually feels. Those four are yours.",
    nl: "Spring Boot beslist heel weinig over de vier dingen die een client werkelijk merkt. Die vier zijn van jou.",
  },
  takeaway1: {
    en: "A Location header that is generated from the route table and resolves.",
    nl: "Een Location-header die uit de routeringstabel wordt gegenereerd en ergens uitkomt.",
  },
  takeaway2: {
    en: "A 400 that names the fields, keyed the way a form can read them.",
    nl: "Een 400 die de velden benoemt, gesleuteld zoals een formulier ze kan lezen.",
  },
  takeaway3: {
    en: "A 409 with the workshop in a field, so a client acts on data and not on a sentence.",
    nl: "Een 409 met de workshop in een veld, zodat een client op gegevens reageert en niet op een zin.",
  },
  takeaway4: {
    en: "A document that is generated from the code, so it cannot describe an API that no longer exists.",
    nl: "Een document dat uit de code wordt gegenereerd, zodat het geen API kan beschrijven die niet meer bestaat.",
  },
  close2: {
    en: "Keep the rule about places in a module that has never heard of HTTP, and each of those four stays a decision at the edge, where it is cheap to change. That is what the two Maven files at the top of this article buy you.",
    nl: "Houd de regel over de plaatsen in een module die nooit van HTTP heeft gehoord, en elk van die vier blijft een beslissing aan de rand, waar hij goedkoop te veranderen is. Dat is wat de twee Maven-bestanden aan het begin van dit artikel je opleveren.",
  },
  close3: {
    en: "I build frontends most weeks and I write the endpoints behind them when a build needs it. The next article in this series serves these same four routes in Kotlin, where the language takes over part of what the annotations do here.",
    nl: "Ik bouw de meeste weken frontends en ik schrijf de endpoints erachter als de bouw daarom vraagt. Het volgende artikel in deze reeks bedient diezelfde vier routes in Kotlin, waar de taal een deel overneemt van wat de annotaties hier doen.",
  },
  nodeRequest: { en: "HTTP request", nl: "HTTP-request" },
  nodeController: { en: "Controller", nl: "Controller" },
  nodeValidation: { en: "Validation", nl: "Validatie" },
  nodeServiceSub: { en: "the rule about places", nl: "de regel over plaatsen" },
  nodeResponse: { en: "Response", nl: "Antwoord" },
  nodeResponseSub: { en: "201 and a Location", nl: "201 en een Location" },
  edgeUnreadable: { en: "unreadable body", nl: "onleesbare body" },
  edgeRejected: { en: "rejected field", nl: "afgekeurd veld" },
  edgeUnknownOrFull: { en: "unknown or full", nl: "onbekend of vol" },
  requestAria: {
    en: "Diagram: an HTTP request travels through the controller, the validation and the registration service to a response, and each of those three can end the request at the advice class that writes a problem document",
    nl: "Diagram: een HTTP-request gaat via de controller, de validatie en de registratieservice naar een antwoord, en die drie kunnen het request elk beëindigen bij de advice-klasse die een probleemdocument schrijft",
  },
  requestCaption: {
    en: "One advice class turns every failure into the same response shape, so a client only has to learn one.",
    nl: "Eén advice-klasse maakt van elke fout hetzelfde antwoord, zodat een client er maar één hoeft te leren.",
  },
  nodeEndpointSub: { en: "the endpoint under test", nl: "het endpoint dat je test" },
  nodeSliceSub: {
    en: "the web layer: routing, @Valid, the advice class",
    nl: "de weblaag: routering, @Valid, de advice-klasse",
  },
  nodeContextSub: {
    en: "the whole application, every bean it holds",
    nl: "de hele applicatie, elke bean die erin zit",
  },
  nodeContainersSub: {
    en: "the application and a PostgreSQL database beside it",
    nl: "de applicatie en een PostgreSQL-database ernaast",
  },
  testScopeAria: {
    en: "Diagram: one endpoint tested at three widening scopes, a slice test around the web layer, a context test around the whole application, and a Testcontainers test around the application and a PostgreSQL database",
    nl: "Diagram: één endpoint getest op drie steeds bredere niveaus, een slice-test rond de weblaag, een contexttest rond de hele applicatie en een Testcontainers-test rond de applicatie en een PostgreSQL-database",
  },
  testScopeCaption: {
    en: "A slice test starts the web layer, a context test starts the application, and Testcontainers starts the database beside it.",
    nl: "Een slice-test start de weblaag, een contexttest start de applicatie en Testcontainers start de database ernaast.",
  },
} as const;
