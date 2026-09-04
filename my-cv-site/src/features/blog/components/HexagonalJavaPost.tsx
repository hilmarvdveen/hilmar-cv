import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, Lead, UL, OL, LI, Strong, Quote, Divider } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FlowDiagram } from "./FlowDiagram";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "hexagonal-architecture-java",
  category: "architecture",
  publishedDate: "2026-09-03",
  updatedDate: "2026-09-05",
  readingTimeMin: 10,
  title: {
    en: "Hexagonal architecture in Java: ports and adapters",
    nl: "Hexagonale architectuur in Java: ports en adapters",
  },
  description: {
    en: "Ports and adapters in Java 21: a domain without Spring or JPA, a sealed use-case result, JPA and REST adapters, and an ArchUnit rule that fails the build.",
    nl: "Ports en adapters in Java 21: een domein zonder Spring of JPA, een sealed resultaat, JPA- en REST-adapters en een ArchUnit-regel die de build laat falen.",
  },
  excerpt: {
    en: "Hexagonal architecture keeps your business rules out of reach of Spring, Hibernate and the database schema. Here is that shape in Java 21, with records, a sealed result, ArchUnit and a way out of a Java 8 monolith.",
    nl: "Hexagonale architectuur houdt je bedrijfsregels buiten bereik van Spring, Hibernate en het databaseschema. Zo ziet die vorm eruit in Java 21, met records, een sealed resultaat, ArchUnit en een weg uit een Java 8-monoliet.",
  },
  keywords: [
    "hexagonal architecture java",
    "ports and adapters spring boot",
    "sealed interface use case result",
    "archunit dependency rule",
    "jpa adapter domain model",
    "java records domain model",
    "clean architecture java 21",
  ],
};

function buildHexagon(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("rest", copy.nodeRest[locale], { x: 0, y: 0 }, { tone: "blue", sub: "POST /publication", dir: "TB", width: 200 }),
    flowNode("job", copy.nodeJob[locale], { x: 230, y: 0 }, { tone: "blue", sub: copy.nodeJobSub[locale], dir: "TB", width: 200 }),
    flowNode("listener", copy.nodeListener[locale], { x: 460, y: 0 }, { tone: "blue", sub: "VersionApproved", dir: "TB", width: 210 }),
    flowNode("useCase", "PublishFormVersion", { x: 230, y: 140 }, { tone: "violet", sub: copy.nodeUseCaseSub[locale], dir: "TB", width: 230 }),
    flowNode("domain", copy.nodeDomain[locale], { x: 0, y: 290 }, { tone: "emerald", sub: "FormDefinition · FormVersion", dir: "TB", width: 240 }),
    flowNode("drivenPorts", copy.nodeDrivenPorts[locale], { x: 280, y: 290 }, { tone: "slate", sub: "FormDefinitionRepository · Clock", dir: "TB", width: 340 }),
    flowNode("jpa", copy.nodeJpa[locale], { x: 200, y: 440 }, { tone: "amber", sub: "MySQL", dir: "TB", width: 190 }),
    flowNode("jdbc", copy.nodeJdbc[locale], { x: 410, y: 440 }, { tone: "amber", sub: copy.nodeJdbcSub[locale], dir: "TB", width: 190 }),
    flowNode("clock", copy.nodeClock[locale], { x: 620, y: 440 }, { tone: "amber", sub: "java.time", dir: "TB", width: 190 }),
  ];
  const edges = [
    flowEdge("rest", "useCase", { label: "HTTP" }),
    flowEdge("job", "useCase", { label: copy.edgeSchedule[locale] }),
    flowEdge("listener", "useCase", { label: copy.edgeMessage[locale] }),
    flowEdge("useCase", "domain", { label: copy.edgeApplies[locale] }),
    flowEdge("useCase", "drivenPorts", { label: copy.edgeCalls[locale] }),
    flowEdge("drivenPorts", "jpa", { dashed: true }),
    flowEdge("drivenPorts", "jdbc", { dashed: true, label: copy.edgeImplements[locale] }),
    flowEdge("drivenPorts", "clock", { dashed: true }),
  ];
  return { nodes, edges };
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  const hexagon = buildHexagon(locale);
  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <P>{copy.intro1[locale]}</P>
      <P>{copy.intro2[locale]}</P>
      <Quote>{copy.quote[locale]}</Quote>

      <H2>{copy.whyTitle[locale]}</H2>
      <P>{copy.why1[locale]}</P>
      <P>{copy.why2[locale]}</P>

      <H2>{copy.overkillTitle[locale]}</H2>
      <P>{copy.overkill1[locale]}</P>
      <P>{copy.overkill2[locale]}</P>

      <H2>{copy.shapeTitle[locale]}</H2>
      <P>{copy.shape1[locale]}</P>
      <FlowDiagram
        nodes={hexagon.nodes}
        edges={hexagon.edges}
        height={520}
        ariaLabel={copy.hexagonAria[locale]}
        caption={copy.hexagonCaption[locale]}
      />
      <UL>
        <LI><Strong>{copy.drivingLabel[locale]}</Strong> {copy.drivingBody[locale]}</LI>
        <LI><Strong>{copy.drivenLabel[locale]}</Strong> {copy.drivenBody[locale]}</LI>
        <LI><Strong>{copy.portsLabel[locale]}</Strong> {copy.portsBody[locale]}</LI>
      </UL>
      <P>{copy.shape2[locale]}</P>

      <H2>{copy.domainTitle[locale]}</H2>
      <P>{copy.domain1[locale]}</P>
      <CodeBlock lang="xml" filename="forms-domain/pom.xml" code={DOMAIN_POM} />
      <P>{copy.domain2[locale]}</P>
      <CodeBlock lang="java" filename="FormVersion.java" code={FORM_VERSION_CODE} />
      <P>{copy.domain3[locale]}</P>
      <CodeBlock lang="java" filename="FormDefinition.java" code={FORM_DEFINITION_CODE} />
      <P>{copy.domain4[locale]}</P>

      <H2>{copy.portsTitle[locale]}</H2>
      <P>{copy.ports1[locale]}</P>
      <CodeBlock lang="java" filename="FormDefinitionRepository.java" code={REPOSITORY_PORT_CODE} />
      <P>{copy.ports2[locale]}</P>

      <H2>{copy.resultTitle[locale]}</H2>
      <P>{copy.result1[locale]}</P>
      <CodeBlock lang="java" filename="PublishResult.java" code={PUBLISH_RESULT_CODE} />
      <P>{copy.result2[locale]}</P>
      <CodeBlock lang="java" filename="PublishFormVersion.java" code={USE_CASE_CODE} />
      <P>{copy.result3[locale]}</P>

      <H2>{copy.adaptersTitle[locale]}</H2>
      <P>{copy.adapters1[locale]}</P>
      <CodeBlock lang="java" filename="FormDefinitionController.java" code={CONTROLLER_CODE} />
      <P>{copy.adapters2[locale]}</P>
      <CodeBlock lang="java" filename="FormEntities.java" code={ENTITIES_CODE} />
      <P>{copy.adapters3[locale]}</P>
      <CodeBlock lang="java" filename="JpaFormDefinitionRepository.java" code={JPA_ADAPTER_CODE} />
      <P>{copy.adapters4[locale]}</P>
      <P>{copy.adapters5[locale]}</P>
      <CodeBlock lang="java" filename="JdbcPublishedFormQueries.java" code={JDBC_ADAPTER_CODE} />

      <H2>{copy.compositionTitle[locale]}</H2>
      <P>{copy.composition1[locale]}</P>
      <CodeBlock lang="java" filename="UseCaseConfiguration.java" code={COMPOSITION_ROOT_CODE} />
      <P>{copy.composition2[locale]}</P>
      <Callout variant="tip" title={copy.ruleTitle[locale]}>
        {copy.ruleBody[locale]}
      </Callout>

      <Divider />

      <H2>{copy.testTitle[locale]}</H2>
      <P>{copy.test1[locale]}</P>
      <CodeBlock lang="java" filename="PublishFormVersionTest.java" code={USE_CASE_TEST_CODE} />
      <P>{copy.test2[locale]}</P>
      <CodeBlock lang="java" filename="JpaFormDefinitionRepositoryTest.java" code={ADAPTER_TEST_CODE} />
      <P>{copy.test3[locale]}</P>

      <H2>{copy.archTitle[locale]}</H2>
      <P>{copy.arch1[locale]}</P>
      <CodeBlock lang="java" filename="DependencyRuleTest.java" code={ARCHUNIT_CODE} />
      <P>{copy.arch2[locale]}</P>

      <H2>{copy.boundariesTitle[locale]}</H2>
      <P>{copy.boundaries1[locale]}</P>
      <UL>
        <LI><Strong>{copy.entitiesLabel[locale]}</Strong> {copy.entitiesBody[locale]}</LI>
        <LI><Strong>{copy.lazyLabel[locale]}</Strong> {copy.lazyBody[locale]}</LI>
        <LI><Strong>{copy.transactionLabel[locale]}</Strong> {copy.transactionBody[locale]}</LI>
        <LI><Strong>{copy.mappingLabel[locale]}</Strong> {copy.mappingBody[locale]}</LI>
        <LI><Strong>{copy.interfacesLabel[locale]}</Strong> {copy.interfacesBody[locale]}</LI>
      </UL>

      <H2>{copy.migrationTitle[locale]}</H2>
      <P>{copy.migration1[locale]}</P>
      <OL>
        <LI>{copy.step1[locale]}</LI>
        <LI>{copy.step2[locale]}</LI>
        <LI>{copy.step3[locale]}</LI>
        <LI>{copy.step4[locale]}</LI>
        <LI>{copy.step5[locale]}</LI>
      </OL>
      <P>{copy.migration2[locale]}</P>

      <H2>{copy.closingTitle[locale]}</H2>
      <P>{copy.closing1[locale]}</P>
      <P>{copy.closing2[locale]}</P>
    </>
  );
}

const DOMAIN_POM = `<project xmlns="http://maven.apache.org/POM/4.0.0">

  <modelVersion>4.0.0</modelVersion>

  <parent>
    <groupId>nl.example</groupId>
    <artifactId>forms</artifactId>
    <version>1.0.0</version>
  </parent>

  <artifactId>forms-domain</artifactId>

  <properties>
    <maven.compiler.release>21</maven.compiler.release>
  </properties>

</project>`;

const FORM_VERSION_CODE = `package nl.example.forms.domain;

import java.time.Instant;
import java.util.List;

public record FormVersion(int number, List<Field> fields, Instant publishedAt) {

    public record Field(String name, String label, boolean required) {}

    public FormVersion {
        fields = List.copyOf(fields);
    }

    public boolean isPublished() {
        return publishedAt != null;
    }

    public FormVersion publishedOn(Instant moment) {
        return new FormVersion(number, fields, moment);
    }
}`;

const FORM_DEFINITION_CODE = `package nl.example.forms.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public record FormDefinition(String id, String name, List<FormVersion> versions) {

    public FormDefinition {
        versions = List.copyOf(versions);
    }

    public Optional<FormVersion> versionNumbered(int number) {
        return versions.stream().filter(version -> version.number() == number).findFirst();
    }

    public List<String> reasonsNotToPublish(FormVersion version) {
        List<String> reasons = new ArrayList<>();
        if (version.fields().isEmpty()) {
            reasons.add("A version without fields cannot be published.");
        }
        if (uniqueFieldNames(version) != version.fields().size()) {
            reasons.add("Field names have to be unique inside a version.");
        }
        if (version.isPublished()) {
            reasons.add("This version was published already.");
        }
        return List.copyOf(reasons);
    }

    public FormDefinition publish(FormVersion version, Instant moment) {
        List<FormVersion> updated = versions.stream()
                .map(existing -> existing.number() == version.number() ? existing.publishedOn(moment) : existing)
                .toList();
        return new FormDefinition(id, name, updated);
    }

    private static long uniqueFieldNames(FormVersion version) {
        return version.fields().stream().map(FormVersion.Field::name).distinct().count();
    }
}`;

const REPOSITORY_PORT_CODE = `package nl.example.forms.application;

import java.util.Optional;
import nl.example.forms.domain.FormDefinition;

public interface FormDefinitionRepository {

    Optional<FormDefinition> findById(String id);

    void save(FormDefinition definition);
}`;

const PUBLISH_RESULT_CODE = `package nl.example.forms.application;

import java.time.Instant;
import java.util.List;

public sealed interface PublishResult {

    record Published(String formDefinitionId, int versionNumber, Instant publishedAt)
            implements PublishResult {}

    record ValidationFailed(List<String> reasons) implements PublishResult {

        public ValidationFailed {
            reasons = List.copyOf(reasons);
        }
    }

    record NotFound(String formDefinitionId, int versionNumber) implements PublishResult {}
}`;

const USE_CASE_CODE = `package nl.example.forms.application;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import nl.example.forms.domain.FormDefinition;
import nl.example.forms.domain.FormVersion;

public final class PublishFormVersion {

    private final FormDefinitionRepository formDefinitions;
    private final Clock clock;

    public PublishFormVersion(FormDefinitionRepository formDefinitions, Clock clock) {
        this.formDefinitions = formDefinitions;
        this.clock = clock;
    }

    public PublishResult handle(String formDefinitionId, int versionNumber) {
        Optional<FormDefinition> definition = formDefinitions.findById(formDefinitionId);
        if (definition.isEmpty()) {
            return new PublishResult.NotFound(formDefinitionId, versionNumber);
        }

        Optional<FormVersion> version = definition.get().versionNumbered(versionNumber);
        if (version.isEmpty()) {
            return new PublishResult.NotFound(formDefinitionId, versionNumber);
        }

        List<String> reasons = definition.get().reasonsNotToPublish(version.get());
        if (!reasons.isEmpty()) {
            return new PublishResult.ValidationFailed(reasons);
        }

        Instant moment = clock.instant();
        formDefinitions.save(definition.get().publish(version.get(), moment));
        return new PublishResult.Published(formDefinitionId, versionNumber, moment);
    }
}`;

const CONTROLLER_CODE = `package nl.example.forms.web;

import java.util.List;
import nl.example.forms.application.PublishFormVersion;
import nl.example.forms.application.PublishResult;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/form-definitions")
class FormDefinitionController {

    private final PublishFormVersion publishFormVersion;

    FormDefinitionController(PublishFormVersion publishFormVersion) {
        this.publishFormVersion = publishFormVersion;
    }

    record PublicationResponse(String id, int version, String publishedAt) {}

    record ProblemResponse(String detail, List<String> reasons) {}

    @PostMapping("/{id}/versions/{number}/publication")
    ResponseEntity<?> publish(@PathVariable String id, @PathVariable int number) {
        return switch (publishFormVersion.handle(id, number)) {
            case PublishResult.Published published -> ResponseEntity.ok(new PublicationResponse(
                    published.formDefinitionId(),
                    published.versionNumber(),
                    published.publishedAt().toString()));
            case PublishResult.ValidationFailed failed -> ResponseEntity
                    .status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body(new ProblemResponse("This version cannot be published yet.", failed.reasons()));
            case PublishResult.NotFound notFound -> ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ProblemResponse("Unknown version " + notFound.versionNumber() + ".", List.of()));
        };
    }
}`;

const ENTITIES_CODE = `package nl.example.forms.persistence;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "form_definition")
class FormDefinitionEntity {

    @Id
    String id;

    @Column(nullable = false)
    String name;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "form_definition_id")
    List<FormVersionEntity> versions = new ArrayList<>();
}

@Entity
@Table(name = "form_version")
class FormVersionEntity {

    @Id
    String id;

    @Column(name = "version_number", nullable = false)
    int number;

    @Column(name = "published_at")
    Instant publishedAt;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "form_field", joinColumns = @JoinColumn(name = "form_version_id"))
    List<FieldRow> fields = new ArrayList<>();
}

@Embeddable
class FieldRow {

    @Column(name = "field_name", nullable = false)
    String name;

    @Column(name = "label", nullable = false)
    String label;

    @Column(name = "required", nullable = false)
    boolean required;
}`;

const JPA_ADAPTER_CODE = `package nl.example.forms.persistence;

import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import nl.example.forms.application.FormDefinitionRepository;
import nl.example.forms.domain.FormDefinition;
import nl.example.forms.domain.FormVersion;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
class JpaFormDefinitionRepository implements FormDefinitionRepository {

    private final EntityManager entityManager;

    JpaFormDefinitionRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<FormDefinition> findById(String id) {
        return Optional.ofNullable(entityManager.find(FormDefinitionEntity.class, id))
                .map(JpaFormDefinitionRepository::toDomain);
    }

    @Override
    @Transactional
    public void save(FormDefinition definition) {
        entityManager.merge(toEntity(definition));
    }

    private static FormDefinition toDomain(FormDefinitionEntity entity) {
        List<FormVersion> versions = entity.versions.stream()
                .map(version -> new FormVersion(version.number, toFields(version), version.publishedAt))
                .toList();
        return new FormDefinition(entity.id, entity.name, versions);
    }

    private static List<FormVersion.Field> toFields(FormVersionEntity version) {
        return version.fields.stream()
                .map(row -> new FormVersion.Field(row.name, row.label, row.required))
                .toList();
    }

    private static FormDefinitionEntity toEntity(FormDefinition definition) {
        FormDefinitionEntity entity = new FormDefinitionEntity();
        entity.id = definition.id();
        entity.name = definition.name();
        entity.versions = definition.versions().stream()
                .map(version -> toEntity(definition.id(), version))
                .collect(Collectors.toCollection(ArrayList::new));
        return entity;
    }

    private static FormVersionEntity toEntity(String definitionId, FormVersion version) {
        FormVersionEntity entity = new FormVersionEntity();
        entity.id = definitionId + ":" + version.number();
        entity.number = version.number();
        entity.publishedAt = version.publishedAt();
        entity.fields = version.fields().stream()
                .map(JpaFormDefinitionRepository::toRow)
                .collect(Collectors.toCollection(ArrayList::new));
        return entity;
    }

    private static FieldRow toRow(FormVersion.Field field) {
        FieldRow row = new FieldRow();
        row.name = field.name();
        row.label = field.label();
        row.required = field.required();
        return row;
    }
}`;

const JDBC_ADAPTER_CODE = `package nl.example.forms.persistence;

import java.util.List;
import nl.example.forms.application.PublishedForm;
import nl.example.forms.application.PublishedFormQueries;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
class JdbcPublishedFormQueries implements PublishedFormQueries {

    private final JdbcClient jdbcClient;

    JdbcPublishedFormQueries(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @Override
    public List<PublishedForm> all() {
        return jdbcClient.sql("""
                select definition.id, definition.name, max(version.version_number) as version
                from form_definition definition
                join form_version version on version.form_definition_id = definition.id
                where version.published_at is not null
                group by definition.id, definition.name
                """)
                .query(PublishedForm.class)
                .list();
    }
}`;

const COMPOSITION_ROOT_CODE = `package nl.example.forms.boot;

import java.time.Clock;
import nl.example.forms.application.FormDefinitionRepository;
import nl.example.forms.application.PublishFormVersion;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class UseCaseConfiguration {

    @Bean
    Clock systemClock() {
        return Clock.systemUTC();
    }

    @Bean
    PublishFormVersion publishFormVersion(FormDefinitionRepository formDefinitions, Clock clock) {
        return new PublishFormVersion(formDefinitions, clock);
    }
}`;

const USE_CASE_TEST_CODE = `package nl.example.forms.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import nl.example.forms.domain.FormDefinition;
import nl.example.forms.domain.FormVersion;
import org.junit.jupiter.api.Test;

class PublishFormVersionTest {

    private static final Instant MOMENT = Instant.parse("2026-09-03T10:00:00Z");

    private final InMemoryFormDefinitions formDefinitions = new InMemoryFormDefinitions();
    private final PublishFormVersion publishFormVersion =
            new PublishFormVersion(formDefinitions, Clock.fixed(MOMENT, ZoneOffset.UTC));

    @Test
    void stamps_the_publication_moment_on_the_draft() {
        formDefinitions.save(permitWithDraft());

        PublishResult result = publishFormVersion.handle("permit", 2);

        PublishResult.Published published = assertInstanceOf(PublishResult.Published.class, result);
        assertEquals(MOMENT, published.publishedAt());
        assertTrue(formDefinitions.stored.get("permit").versionNumbered(2).orElseThrow().isPublished());
    }

    @Test
    void names_every_reason_a_draft_stays_where_it_is() {
        formDefinitions.save(new FormDefinition("permit", "Permit request",
                List.of(new FormVersion(1, List.of(), null))));

        PublishResult result = publishFormVersion.handle("permit", 1);

        PublishResult.ValidationFailed failed =
                assertInstanceOf(PublishResult.ValidationFailed.class, result);
        assertEquals(List.of("A version without fields cannot be published."), failed.reasons());
    }

    private static FormDefinition permitWithDraft() {
        FormVersion.Field street = new FormVersion.Field("street", "Street", true);
        return new FormDefinition("permit", "Permit request", List.of(
                new FormVersion(1, List.of(street), MOMENT.minusSeconds(3600)),
                new FormVersion(2, List.of(street), null)));
    }

    private static final class InMemoryFormDefinitions implements FormDefinitionRepository {

        private final Map<String, FormDefinition> stored = new HashMap<>();

        @Override
        public Optional<FormDefinition> findById(String id) {
            return Optional.ofNullable(stored.get(id));
        }

        @Override
        public void save(FormDefinition definition) {
            stored.put(definition.id(), definition);
        }
    }
}`;

const ADAPTER_TEST_CODE = `package nl.example.forms.persistence;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import nl.example.forms.domain.FormDefinition;
import nl.example.forms.domain.FormVersion;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

@DataJpaTest
@Import(JpaFormDefinitionRepository.class)
class JpaFormDefinitionRepositoryTest {

    @Autowired
    private JpaFormDefinitionRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void writes_and_reads_back_every_version_with_its_fields() {
        FormVersion.Field street = new FormVersion.Field("street", "Street", true);
        repository.save(new FormDefinition("permit", "Permit request", List.of(
                new FormVersion(1, List.of(street), Instant.parse("2026-09-01T09:00:00Z")))));
        entityManager.flush();
        entityManager.clear();

        Optional<FormDefinition> found = repository.findById("permit");

        assertTrue(found.isPresent());
        assertEquals(1, found.get().versions().size());
        assertEquals(List.of(street), found.get().versions().get(0).fields());
    }
}`;

const ARCHUNIT_CODE = `package nl.example.forms.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

@AnalyzeClasses(packages = "nl.example.forms", importOptions = ImportOption.DoNotIncludeTests.class)
class DependencyRuleTest {

    @ArchTest
    static final ArchRule the_domain_depends_on_nothing_technical = noClasses()
            .that().resideInAPackage("..domain..")
            .should().dependOnClassesThat()
            .resideInAnyPackage("org.springframework..", "jakarta..", "..persistence..", "..web..");

    @ArchTest
    static final ArchRule the_application_layer_knows_no_adapter = noClasses()
            .that().resideInAPackage("..application..")
            .should().dependOnClassesThat()
            .resideInAnyPackage("org.springframework..", "jakarta.persistence..", "..persistence..", "..web..");
}`;

const COPY = {
  lead: {
    en: "Hexagonal architecture has one job in a Java codebase. It keeps the rules that decide what your organisation allows, owes or refuses out of reach of Spring and Hibernate.",
    nl: "Hexagonale architectuur heeft één taak in een Java-codebase. Die houdt de regels die bepalen wat je organisatie toestaat, verschuldigd is of weigert buiten bereik van Spring en Hibernate.",
  },
  intro1: {
    en: "Government software has a long memory. A form that collects a declaration outlives the framework that renders it and usually the team that wrote it. Struts became Spring MVC and Spring MVC became Spring Boot. The rule that a version without fields may not go out never changed.",
    nl: "Overheidssoftware heeft een lang geheugen. Een formulier waarmee iemand aangifte doet, gaat langer mee dan het framework dat het tekent en meestal ook dan het team dat het schreef. Struts werd Spring MVC en Spring MVC werd Spring Boot. De regel dat een versie zonder velden niet naar buiten mag, veranderde nooit.",
  },
  intro2: {
    en: "At the Belastingdienst, the Dutch tax administration, I built a low-code visual forms editor. When it had to ship I extended the Java backend endpoints myself, so the work of the editors was stored and the state of every form could be rebuilt from the backend. The stack was Java 8, Maven and MySQL.",
    nl: "Bij de Belastingdienst bouwde ik een low-code formulierenbouwer met een visuele editor. Toen die live moest, breidde ik zelf de endpoints van de Java-backend uit, zodat het werk van de redacteuren werd opgeslagen en de staat van elk formulier vanuit de backend te herbouwen was. De stack was Java 8, Maven en MySQL.",
  },
  quote: {
    en: "The moment a domain class imports jakarta.persistence, the table layout has taken a decision that belonged to the rules.",
    nl: "Zodra een domeinklasse jakarta.persistence importeert, heeft de tabelindeling een beslissing genomen die bij de regels hoorde.",
  },
  whyTitle: {
    en: "Rules about forms outlive the framework that renders them",
    nl: "Regels over formulieren gaan langer mee dan het framework dat ze toont",
  },
  why1: {
    en: "Java is unusually good at running a system for fifteen years, and just as good at hiding the rules inside a framework. One service class carries a @Transactional annotation, a repository call, a mapper and the line that decides whether a citizen may proceed.",
    nl: "Java is uitzonderlijk goed in systemen die vijftien jaar draaien, en net zo goed in het verstoppen van de regels binnen een framework. Eén serviceklasse draagt een @Transactional-annotatie, een repository-aanroep, een mapper en de regel die bepaalt of een burger verder mag.",
  },
  why2: {
    en: "Ports and adapters gives that line a module of its own, with no Spring and no JPA on the classpath. Everything the rules need from outside is an interface they write themselves. In Maven the boundary is a module, so the compiler reviews it first.",
    nl: "Ports en adapters geeft die regel een eigen module, zonder Spring en zonder JPA op het classpath. Alles wat de regels van buiten nodig hebben, is een interface die ze zelf opschrijven. In Maven is die grens een module, dus de compiler beoordeelt hem als eerste.",
  },
  overkillTitle: {
    en: "Skip the hexagon when the screen is a table with a save button",
    nl: "Sla de hexagon over als het scherm een tabel met een opslaanknop is",
  },
  overkill1: {
    en: "Not every service earns this. When the requirements are list the rows, edit a row and delete a row, the rules are the database schema. A small internal tool is happier with Spring Data in the controller.",
    nl: "Niet elke service verdient dit. Zijn de eisen toon de rijen, wijzig een rij en verwijder een rij, dan zijn de regels het databaseschema. Een klein intern gereedschap is beter af met Spring Data in de controller.",
  },
  overkill2: {
    en: "The hexagon pays for itself when the rules hold real decisions, when a second channel or a second database is plausible, and when the team wants to run those decisions without starting anything. Two of the three is enough to begin.",
    nl: "De hexagon verdient zichzelf terug als de regels echte beslissingen bevatten, als een tweede kanaal of een tweede database aannemelijk is, en als het team die beslissingen wil draaien zonder iets op te starten. Twee van de drie is genoeg om te beginnen.",
  },
  shapeTitle: {
    en: "The domain sits in the middle and every arrow points inward",
    nl: "Het domein staat in het midden en elke pijl wijst naar binnen",
  },
  shape1: {
    en: "The earlier posts in this series drew this picture in C# and in Kotlin, so here is the short version. There is an inside and an outside, no layer above another, and the inside knows nothing about the outside.",
    nl: "De eerdere delen van deze serie tekenden deze plaat in C# en in Kotlin, dus hier de korte versie. Er is een binnenkant en een buitenkant, geen laag boven een andere, en de binnenkant weet niets van de buitenkant.",
  },
  hexagonAria: {
    en: "Diagram: a REST controller, a scheduled job and a message listener call the PublishFormVersion use case, which applies the domain rules and calls ports implemented by JPA, JDBC and the clock",
    nl: "Diagram: een REST-controller, een geplande taak en een message listener roepen de use case PublishFormVersion aan, die de domeinregels toepast en ports aanroept die worden geïmplementeerd door JPA, JDBC en de klok",
  },
  hexagonCaption: {
    en: "The adapters know the use case and the domain. Neither of them knows a single adapter.",
    nl: "De adapters kennen de use case en het domein. Geen van beide kent ook maar één adapter.",
  },
  drivingLabel: { en: "Driving adapters.", nl: "Driving adapters." },
  drivingBody: {
    en: "They start the work. A Spring REST controller, a scheduled job, a message listener. Each turns a request into arguments and calls a use case.",
    nl: "Zij starten het werk. Een Spring REST-controller, een geplande taak, een message listener. Elk maakt van een verzoek argumenten en roept een use case aan.",
  },
  drivenLabel: { en: "Driven adapters.", nl: "Driven adapters." },
  drivenBody: {
    en: "They are called by the work. A JPA repository, a JDBC query for a read model, an HTTP client, the clock. Each implements an interface the inside defined.",
    nl: "Zij worden door het werk aangeroepen. Een JPA-repository, een JDBC-query voor een leesmodel, een HTTP-client, de klok. Elk implementeert een interface die de binnenkant bepaalde.",
  },
  portsLabel: { en: "Ports.", nl: "Ports." },
  portsBody: {
    en: "The interfaces themselves. In Java a port is nothing more exotic than an interface with two or three methods.",
    nl: "De interfaces zelf. In Java is een port niets exotischer dan een interface met twee of drie methodes.",
  },
  shape2: {
    en: "The direction of the dependency is the whole trick. The adapter module depends on the domain module, and the domain module depends on nothing. Maven enforces that between modules, and ArchUnit does the same between packages.",
    nl: "De richting van de afhankelijkheid is de hele truc. De adaptermodule hangt af van de domeinmodule, en de domeinmodule hangt nergens van af. Maven dwingt dat af tussen modules, en ArchUnit doet hetzelfde tussen packages.",
  },
  domainTitle: {
    en: "Records and sealed types give the domain its vocabulary",
    nl: "Records en sealed types geven het domein zijn vocabulaire",
  },
  domain1: {
    en: "Start with the module descriptor, because that is the agreement you defend in every code review. No Spring starter, no Hibernate, no dependencies at all.",
    nl: "Begin bij de moduledescriptor, want dat is de afspraak die je in elke code review verdedigt. Geen Spring-starter, geen Hibernate, helemaal geen dependencies.",
  },
  domain2: {
    en: "A form version is a number, a list of fields and the moment it went out. A record gives you the constructor, accessors, equality and a readable toString for free. Copy the list in the compact constructor, because a record is only as immutable as its values.",
    nl: "Een formulierversie is een nummer, een lijst velden en het moment waarop hij naar buiten ging. Een record geeft je de constructor, accessors, gelijkheid en een leesbare toString cadeau. Kopieer de lijst in de compacte constructor, want een record is niet onveranderlijker dan zijn waarden.",
  },
  domain3: {
    en: "The aggregate above it holds the rules. It answers which reasons block a version from going out, and what the definition looks like once that version is published.",
    nl: "Het aggregate erboven bevat de regels. Het beantwoordt welke redenen een versie tegenhouden, en hoe de definitie eruitziet zodra die versie is gepubliceerd.",
  },
  domain4: {
    en: "Publishing returns a new definition, so nobody applies a rule halfway. The reasons are collected instead of thrown one at a time, because an editor who forgot two things deserves to hear both.",
    nl: "Publiceren geeft een nieuwe definitie terug, dus niemand past een regel half toe. De redenen worden verzameld in plaats van één voor één gegooid, want een redacteur die twee dingen vergat, mag ze allebei horen.",
  },
  portsTitle: {
    en: "A port is an interface the inside writes for itself",
    nl: "Een port is een interface die de binnenkant voor zichzelf schrijft",
  },
  ports1: {
    en: "The application module holds use cases and the ports they need. Names come from the domain, never from the technology. FormDefinitionRepository is a good name. MySqlFormDefinitionDao has leaked the storage into the middle of the application.",
    nl: "De applicatiemodule bevat use cases en de ports die zij nodig hebben. De namen komen uit het domein, nooit uit de techniek. FormDefinitionRepository is een goede naam. MySqlFormDefinitionDao heeft de opslag al midden in de applicatie gelekt.",
  },
  ports2: {
    en: "Give the port the two methods this use case needs, not the fourteen a generic repository offers. The second port needs no code, because java.time.Clock is already an interface with Clock.fixed as its test implementation.",
    nl: "Geef de port de twee methodes die deze use case nodig heeft, niet de veertien die een generieke repository aanbiedt. De tweede port kost geen code, want java.time.Clock is al een interface met Clock.fixed als testimplementatie.",
  },
  resultTitle: {
    en: "A sealed result forces the caller to answer every outcome",
    nl: "Een sealed resultaat dwingt de aanroeper elke uitkomst te beantwoorden",
  },
  result1: {
    en: "A publication ends in three ways the business already knows. It succeeds, it is refused for named reasons, or the version is not there. None of those is exceptional, so none should be an exception. A sealed interface lists its own outcomes.",
    nl: "Een publicatie eindigt op drie manieren die de business al kent. Hij slaagt, hij wordt geweigerd om benoemde redenen, of de versie bestaat niet. Geen daarvan is uitzonderlijk, dus geen daarvan hoort een exceptie te zijn. Een sealed interface somt zijn eigen uitkomsten op.",
  },
  result2: {
    en: "The use case then reads as the story of the transaction. It loads, it lets the domain decide, it takes the moment from the clock and it saves. Beyond the order of the steps it holds no rule of its own.",
    nl: "De use case leest daarna als het verhaal van de transactie. Hij laadt, hij laat het domein beslissen, hij neemt het moment uit de klok en hij slaat op. Behalve de volgorde van de stappen draagt hij geen eigen regel.",
  },
  result3: {
    en: "The pay-off arrives when someone adds a fourth outcome. Add a record to the sealed interface and every exhaustive switch stops compiling until a person decides what the caller should do.",
    nl: "Het rendement komt als iemand een vierde uitkomst toevoegt. Zet een record bij de sealed interface en elke uitputtende switch stopt met compileren tot een mens bepaalt wat de aanroeper moet doen.",
  },
  adaptersTitle: {
    en: "Spring Boot and Hibernate stay on the outside",
    nl: "Spring Boot en Hibernate blijven aan de buitenkant",
  },
  adapters1: {
    en: "The controller is the driving adapter. It reads the path, calls the use case and turns the sealed result into a status code with a pattern matching switch. There is no default branch, and that is the point.",
    nl: "De controller is de driving adapter. Hij leest het pad, roept de use case aan en zet het sealed resultaat om in een statuscode met een switch die aan pattern matching doet. Er is geen default-tak, en dat is de bedoeling.",
  },
  adapters2: {
    en: "On the other side the JPA entities live in the persistence package, and they are not the domain records. An entity answers to Hibernate with a no-arg constructor and mutable fields. One class doing both jobs is how a Java hexagon collapses.",
    nl: "Aan de andere kant wonen de JPA-entiteiten in de persistence-package, en dat zijn niet de domeinrecords. Een entiteit legt verantwoording af aan Hibernate met een constructor zonder argumenten en muteerbare velden. Eén klasse die beide taken doet, is hoe een Java-hexagon instort.",
  },
  adapters3: {
    en: "Two details there are deliberate. The classes are package-private, so nothing outside this package can even name an entity. The version row carries a deterministic identifier, so a merge updates the row instead of inserting a copy of it.",
    nl: "Twee details daarin zijn bewust. De klassen zijn package-private, dus buiten deze package kan niemand een entiteit zelfs maar noemen. De versierij draagt een voorspelbare identifier, zodat een merge de rij bijwerkt en er geen kopie naast zet.",
  },
  adapters4: {
    en: "The adapter translates in both directions, by hand, in one file. It is the only class in the build allowed to know both vocabularies.",
    nl: "De adapter vertaalt in beide richtingen, met de hand, in één bestand. Het is de enige klasse in de build die beide vocabulaires mag kennen.",
  },
  adapters5: {
    en: "Not every question needs the aggregate. An overview screen wants a flat list, and a second port with a JDBC adapter answers that in one query, in the language of the screen.",
    nl: "Niet elke vraag heeft het aggregate nodig. Een overzichtsscherm wil een platte lijst, en een tweede port met een JDBC-adapter beantwoordt dat in één query, in de taal van het scherm.",
  },
  compositionTitle: {
    en: "One configuration class knows every implementation",
    nl: "Eén configuratieklasse kent elke implementatie",
  },
  composition1: {
    en: "Somewhere the interfaces meet their classes. In Spring Boot that is a configuration class in the module that boots the application. It may know MySQL, the clock and the address of every service, because nothing depends on it in return.",
    nl: "Ergens ontmoeten de interfaces hun klassen. In Spring Boot is dat een configuratieklasse in de module die de applicatie opstart. Die mag MySQL kennen, de klok en het adres van elke service, want niets is er op zijn beurt van afhankelijk.",
  },
  composition2: {
    en: "The use case is a plain final class built with new. No @Service annotation, no field injection, no framework import. That is what lets a test run it in a millisecond.",
    nl: "De use case is een gewone final class die met new wordt gemaakt. Geen @Service-annotatie, geen veldinjectie, geen frameworkimport. Daardoor draait een test hem in een milliseconde.",
  },
  ruleTitle: {
    en: "A rule of thumb before you add a port",
    nl: "Een vuistregel voordat je een port toevoegt",
  },
  ruleBody: {
    en: "Add a port when what sits behind it can change without the business changing. A database, a queue, a payment provider and the clock all qualify. A helper that formats a postal code does not.",
    nl: "Voeg een port toe als wat erachter zit kan veranderen zonder dat de business verandert. Een database, een queue, een betaalprovider en de klok voldoen daaraan. Een hulpje dat een postcode opmaakt niet.",
  },
  testTitle: {
    en: "Fakes prove the rules, an embedded database proves the mapping",
    nl: "Fakes bewijzen de regels, een embedded database bewijst de mapping",
  },
  test1: {
    en: "A use case with two ports and no framework is the cheapest thing in the build to test. You need no Mockito and no Spring context. A map behind the repository and Clock.fixed behind the clock give you a predictable system.",
    nl: "Een use case met twee ports en zonder framework is het goedkoopste in de build om te testen. Je hebt geen Mockito nodig en geen Spring-context. Een map achter de repository en Clock.fixed achter de klok geven je een voorspelbaar systeem.",
  },
  test2: {
    en: "These tests prove nothing about the mapping. A missing column or a collection that comes back empty passes every fake and fails in production. So the adapter gets a test of its own against a real engine, an embedded H2 inside a Spring @DataJpaTest.",
    nl: "Deze tests bewijzen niets over de mapping. Een ontbrekende kolom of een collectie die leeg terugkomt, komt langs elke fake en sneuvelt in productie. Daarom krijgt de adapter een eigen test tegen een echte engine, een embedded H2 in een Spring @DataJpaTest.",
  },
  test3: {
    en: "The flush and the clear are the lines people forget. Without them Hibernate answers from its first level cache and the test proves nothing about reading. H2 is not MySQL either, so a query that leans on the dialect belongs in a Testcontainers container.",
    nl: "De flush en de clear zijn de regels die mensen vergeten. Zonder die twee antwoordt Hibernate uit zijn eerstelijnscache en bewijst de test niets over lezen. H2 is bovendien geen MySQL, dus een query die op het dialect leunt hoort in een Testcontainers-container.",
  },
  archTitle: {
    en: "ArchUnit turns the dependency rule into a failing build",
    nl: "ArchUnit maakt van de afhankelijkheidsregel een falende build",
  },
  arch1: {
    en: "An architecture rule nobody enforces is a suggestion with a diagram attached. Someone under deadline pressure adds one import, the review has forty files in it, and a year later the domain needs a Spring context to start.",
    nl: "Een architectuurregel die niemand afdwingt, is een suggestie met een plaatje erbij. Iemand met een deadline zet er één import bij, de review telt veertig bestanden, en een jaar later heeft het domein een Spring-context nodig om te starten.",
  },
  arch2: {
    en: "The rule then arrives as a red build instead of a comment in a review. Separate Maven modules give a stronger version of the same guarantee, because the import will not resolve at all.",
    nl: "De regel komt dan binnen als een rode build in plaats van als een opmerking in een review. Aparte Maven-modules geven een sterkere variant van dezelfde garantie, want dan lost de import helemaal niet op.",
  },
  boundariesTitle: {
    en: "Five boundaries decide whether this holds up",
    nl: "Vijf grenzen bepalen of dit standhoudt",
  },
  boundaries1: {
    en: "The picture is easy to draw and easy to get wrong in five familiar places.",
    nl: "De plaat is makkelijk te tekenen en op vijf bekende plekken makkelijk verkeerd te doen.",
  },
  entitiesLabel: { en: "Entities against domain objects.", nl: "Entiteiten tegenover domeinobjecten." },
  entitiesBody: {
    en: "Keep them apart. An entity answers to a table, a record answers to the business. When a column is renamed for a report, the rules should not notice.",
    nl: "Houd ze gescheiden. Een entiteit legt verantwoording af aan een tabel, een record aan de business. Wordt een kolom hernoemd voor een rapportage, dan horen de regels dat niet te merken.",
  },
  lazyLabel: { en: "Lazy loading.", nl: "Lazy loading." },
  lazyBody: {
    en: "A lazy collection that leaves the adapter is a time bomb. The session closes and the caller meets a LazyInitializationException. Load inside the adapter, map there, and let a plain list cross the boundary.",
    nl: "Een lazy collectie die de adapter verlaat, is een tijdbom. De sessie sluit en de aanroeper krijgt een LazyInitializationException. Laad binnen de adapter, map daar, en laat een gewone lijst de grens over gaan.",
  },
  transactionLabel: { en: "Transactions.", nl: "Transacties." },
  transactionBody: {
    en: "The decision to commit belongs to the use case, so the annotation does not belong in the domain. Put @Transactional on the adapter methods, or give the boot module a small runner port built on a Spring transaction template.",
    nl: "De beslissing om te committen hoort bij de use case, dus de annotatie hoort niet in het domein. Zet @Transactional op de adaptermethodes, of geef de boot-module een kleine runner-port op basis van een Spring-transactietemplate.",
  },
  mappingLabel: { en: "The cost of mapping.", nl: "De prijs van mappen." },
  mappingBody: {
    en: "Yes, you type the fields twice. That is the price of the boundary, and the mapper is the cheapest documentation of a contract you will write. Past a few aggregates, MapStruct generates it while compiling.",
    nl: "Ja, je typt de velden twee keer. Dat is de prijs van de grens, en de mapper is de goedkoopste documentatie van een contract die je schrijft. Voorbij een paar aggregates genereert MapStruct het tijdens het compileren.",
  },
  interfacesLabel: { en: "Interfaces with one implementation.", nl: "Interfaces met één implementatie." },
  interfacesBody: {
    en: "Fine when a test needs a stand-in, or when a system you do not control sits behind it. When neither is true, delete the interface, inject the class and give every stack trace one frame less.",
    nl: "Prima als een test er een vervanger voor nodig heeft, of als erachter een systeem zit dat je niet in de hand hebt. Geldt geen van beide, verwijder de interface, injecteer de klasse en gun elke stack trace een frame minder.",
  },
  migrationTitle: {
    en: "Move a Java 8 monolith one use case at a time",
    nl: "Verhuis een Java 8-monoliet, use case voor use case",
  },
  migration1: {
    en: "Nobody gets a budget for a rewrite, and asking for one is the fastest way to hear no. The strangler pattern works on a Java backend the way a reversible cut-over works on a frontend.",
    nl: "Niemand krijgt budget voor een herbouw, en erom vragen is de snelste manier om nee te horen. Het strangler-patroon werkt op een Java-backend zoals een omkeerbare cut-over op een frontend werkt.",
  },
  step1: {
    en: "Bring the runtime to Java 17 or 21 first. That upgrade is usually smaller than people fear, and until it lands the same shape works with final classes.",
    nl: "Breng eerst de runtime naar Java 17 of 21. Die upgrade is meestal kleiner dan mensen vrezen, en tot het zover is werkt dezelfde vorm met final classes.",
  },
  step2: {
    en: "Add a domain module with no dependencies. Move one aggregate into it and let the compiler tell you what came along with it.",
    nl: "Voeg een domeinmodule zonder dependencies toe. Verplaats één aggregate ernaartoe en laat de compiler vertellen wat er meekwam.",
  },
  step3: {
    en: "Write the port you wish the old code had, then implement it with the old code inside. That first adapter may be ugly, because it is temporary and it is one file.",
    nl: "Schrijf de port die je de oude code had gegund, en implementeer hem met de oude code erin. Die eerste adapter mag lelijk zijn, want hij is tijdelijk en het is één bestand.",
  },
  step4: {
    en: "Move the rules from the old service into the aggregate, with the use case tests as your safety net. This step carries real behaviour risk, so put it behind a toggle.",
    nl: "Haal de regels uit de oude service en zet ze in het aggregate, met de use-casetests als vangnet. Deze stap draagt echt gedragsrisico, dus zet hem achter een schakelaar.",
  },
  step5: {
    en: "Point the controller at the use case, add the ArchUnit rule for the package you cleaned, and delete the old path once the toggle has been fully on.",
    nl: "Wijs de controller naar de use case, voeg de ArchUnit-regel toe voor de package die je opruimde, en verwijder het oude pad zodra de schakelaar volledig aan staat.",
  },
  migration2: {
    en: "Every step compiles, ships and reverts on its own. That is the discipline I use when a legacy page moves to a new frontend stack. Ship behind a gate and keep the old path alive until the new one has proven itself.",
    nl: "Elke stap compileert, gaat live en is los terug te draaien. Dat is de discipline die ik gebruik als een legacy pagina naar een nieuwe frontendstack verhuist. Zet het achter een schakelaar en houd het oude pad in leven tot het nieuwe zich heeft bewezen.",
  },
  closingTitle: {
    en: "The same boundary keeps a React screen simple",
    nl: "Dezelfde grens houdt een React-scherm eenvoudig",
  },
  closing1: {
    en: "C#, Kotlin and Java hand you different tools for this, and the three posts in this series end in the same place. The rules of the business belong in a module no framework can reach, and everything else is a translator at the edge.",
    nl: "C#, Kotlin en Java geven je hier ander gereedschap voor, en de drie delen van deze serie eindigen op dezelfde plek. De regels van de business horen in een module waar geen framework bij kan, en al het andere is een vertaler aan de rand.",
  },
  closing2: {
    en: "I spend most of my week in React and Angular, where one question keeps a screen simple. Which part of this file would still be true if we replaced the framework tomorrow? That answer is the part you protect, on either side of the API.",
    nl: "Ik zit het grootste deel van mijn week in React en Angular, waar dezelfde vraag een scherm eenvoudig houdt. Welk deel van dit bestand zou morgen nog kloppen als we het framework vervingen? Dat antwoord is het deel dat je beschermt, aan beide kanten van de API.",
  },
  nodeRest: { en: "REST controller", nl: "REST-controller" },
  nodeJob: { en: "Scheduled job", nl: "Geplande taak" },
  nodeJobSub: { en: "nightly publication", nl: "nachtelijke publicatie" },
  nodeListener: { en: "Message listener", nl: "Message listener" },
  nodeUseCaseSub: { en: "use case, owns the ports", nl: "use case, bezit de ports" },
  nodeDomain: { en: "Domain", nl: "Domein" },
  nodeDrivenPorts: { en: "Driven ports", nl: "Driven ports" },
  nodeJpa: { en: "JPA repository", nl: "JPA-repository" },
  nodeJdbc: { en: "JDBC read model", nl: "JDBC-leesmodel" },
  nodeJdbcSub: { en: "overview screen", nl: "overzichtsscherm" },
  nodeClock: { en: "System clock", nl: "Systeemklok" },
  edgeSchedule: { en: "schedule", nl: "planning" },
  edgeMessage: { en: "message", nl: "bericht" },
  edgeApplies: { en: "applies rules", nl: "past regels toe" },
  edgeCalls: { en: "calls", nl: "roept aan" },
  edgeImplements: { en: "implemented by", nl: "geïmplementeerd door" },
} as const;
