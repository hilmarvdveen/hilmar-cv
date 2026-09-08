import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, Lead, UL, OL, LI, Strong, Quote, Divider } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FlowDiagram } from "./FlowDiagram";
import { Contents } from "./Contents";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "building-an-api-in-kotlin",
  category: "api",
  track: "backend",
  publishedDate: "2026-09-07",
  readingTimeMin: 25,
  title: {
    en: "The same API in Kotlin: what the language changes",
    nl: "Dezelfde API in Kotlin: wat de taal verandert",
  },
  description: {
    en: "Build one workshop registration API in Kotlin 2.4 twice, on Spring Boot 4.1 and on Ktor 3.5, from an empty folder to running routes, failures and tests.",
    nl: "Bouw één inschrijf-API in Kotlin 2.4 twee keer, op Spring Boot 4.1 en op Ktor 3.5, van een lege map tot werkende routes, foutantwoorden en tests.",
  },
  excerpt: {
    en: "Three Gradle modules, two applications and one domain underneath. Every file, every build file and every request is here, so you can follow it from an empty folder to a running API.",
    nl: "Drie Gradle-modules, twee applicaties en één domein eronder. Elk bestand, elk buildbestand en elk request staat erin, zodat je van een lege map tot een draaiende API komt.",
  },
  keywords: [
    "kotlin rest api",
    "spring boot 4 kotlin",
    "ktor routing statuspages",
    "kotlin sealed interface result",
    "suspend handler coroutines",
    "kotlin data class request validation",
    "testcontainers serviceconnection kotlin",
    "gradle kotlin multi module build",
  ],
};

function buildFrameworkDiagram(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("request", "POST /registrations", { x: 250, y: 0 }, { tone: "slate", direction: "TB", width: 300 }),
    flowNode("spring", "Spring Boot 4.1", { x: 20, y: 140 }, { tone: "blue", subtitle: copy.nodeSpringSub[locale], direction: "TB", width: 320 }),
    flowNode("ktor", "Ktor 3.5", { x: 460, y: 140 }, { tone: "violet", subtitle: copy.nodeKtorSub[locale], direction: "TB", width: 320 }),
    flowNode("domain", "workshops-domain", { x: 170, y: 290 }, { tone: "emerald", subtitle: "RegistrationService · RegisterOutcome", direction: "TB", width: 460 }),
  ];
  const edges = [
    flowEdge("request", "spring"),
    flowEdge("request", "ktor"),
    flowEdge("spring", "domain", { label: copy.edgeSameCall[locale] }),
    flowEdge("ktor", "domain", { label: copy.edgeSameCall[locale] }),
  ];
  return { nodes, edges };
}

function buildOutcomeDiagram(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("outcome", "RegisterOutcome", { x: 0, y: 150 }, { tone: "emerald", subtitle: "sealed interface", width: 230 }),
    flowNode("branch", "when (outcome)", { x: 310, y: 150 }, { tone: "violet", subtitle: copy.nodeBranchSub[locale], width: 200 }),
    flowNode("created", "201 Created", { x: 600, y: 20 }, { tone: "blue", subtitle: copy.nodeCreatedSub[locale], width: 250 }),
    flowNode("missing", "404 Not Found", { x: 600, y: 150 }, { tone: "blue", subtitle: copy.nodeMissingSub[locale], width: 250 }),
    flowNode("conflict", "409 Conflict", { x: 600, y: 280 }, { tone: "rose", subtitle: "problem details, workshopId", width: 250 }),
  ];
  const edges = [
    flowEdge("outcome", "branch"),
    flowEdge("branch", "created", { label: "Accepted" }),
    flowEdge("branch", "missing", { label: "WorkshopNotFound" }),
    flowEdge("branch", "conflict", { label: "WorkshopFull" }),
  ];
  return { nodes, edges };
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  const frameworkFlow = buildFrameworkDiagram(locale);
  const outcomeFlow = buildOutcomeDiagram(locale);
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
          copy.shorterTitle[locale],
          copy.projectTitle[locale],
          copy.dataTitle[locale],
          copy.nullTitle[locale],
          copy.sealedTitle[locale],
          copy.springTitle[locale],
          copy.suspendTitle[locale],
          copy.ktorTitle[locale],
          copy.chooseTitle[locale],
          copy.callingTitle[locale],
          copy.serializationTitle[locale],
          copy.testsTitle[locale],
          copy.contributingTitle[locale],
          copy.closeTitle[locale],
        ]}
      />

      <H2>{copy.shorterTitle[locale]}</H2>
      <P>{copy.shorter1[locale]}</P>
      <P>{copy.shorter2[locale]}</P>
      <P>{copy.shorter3[locale]}</P>
      <P>{copy.shorter4[locale]}</P>

      <H2>{copy.projectTitle[locale]}</H2>
      <P>{copy.project1[locale]}</P>
      <CodeBlock lang="bash" code={INIT_CODE} />
      <P>{copy.project2[locale]}</P>
      <CodeBlock lang="kotlin" filename="settings.gradle.kts" code={SETTINGS_CODE} />
      <P>{copy.project3[locale]}</P>
      <CodeBlock lang="kotlin" filename="workshops-domain/build.gradle.kts" code={DOMAIN_BUILD_CODE} />
      <P>{copy.project4[locale]}</P>

      <H2>{copy.dataTitle[locale]}</H2>
      <P>{copy.data1[locale]}</P>
      <CodeBlock lang="kotlin" filename="workshops-domain/src/main/kotlin/workshops/domain/Workshops.kt" code={DOMAIN_TYPES_CODE} />
      <P>{copy.data2[locale]}</P>
      <CodeBlock lang="kotlin" filename="workshops-spring/src/main/kotlin/workshops/spring/RegistrationTypes.kt" code={WIRE_TYPES_CODE} />
      <P>{copy.data3[locale]}</P>
      <Callout variant="warning" title={copy.targetWarningTitle[locale]}>
        {copy.targetWarningBody[locale]}
      </Callout>

      <H2>{copy.nullTitle[locale]}</H2>
      <P>{copy.null1[locale]}</P>
      <P>{copy.null2[locale]}</P>
      <P>{copy.null3[locale]}</P>
      <P>{copy.null4[locale]}</P>

      <Divider />

      <H2>{copy.sealedTitle[locale]}</H2>
      <P>{copy.sealed1[locale]}</P>
      <P>{copy.sealed2[locale]}</P>
      <CodeBlock lang="kotlin" filename="workshops-domain/src/main/kotlin/workshops/domain/RegisterOutcome.kt" code={OUTCOME_CODE} />
      <P>{copy.sealed3[locale]}</P>
      <CodeBlock lang="kotlin" filename="workshops-domain/src/main/kotlin/workshops/domain/RegistrationService.kt" code={SERVICE_CODE} />
      <P>{copy.sealed4[locale]}</P>
      <P>{copy.sealed5[locale]}</P>
      <CodeBlock lang="kotlin" filename="workshops-spring/src/main/kotlin/workshops/spring/RegisterOutcomeResponses.kt" code={OUTCOME_RESPONSE_CODE} />
      <FlowDiagram
        nodes={outcomeFlow.nodes}
        edges={outcomeFlow.edges}
        height={340}
        ariaLabel={copy.outcomeAria[locale]}
        caption={copy.outcomeCaption[locale]}
      />

      <H2>{copy.springTitle[locale]}</H2>
      <P>{copy.spring1[locale]}</P>
      <P>{copy.spring2[locale]}</P>
      <CodeBlock lang="kotlin" filename="workshops-spring/build.gradle.kts" code={SPRING_BUILD_CODE} />
      <P>{copy.spring3[locale]}</P>
      <CodeBlock lang="kotlin" filename="workshops-spring/src/main/kotlin/workshops/spring/RegistrationsController.kt" code={CONTROLLER_CODE} />
      <P>{copy.spring5[locale]}</P>
      <P>{copy.spring6[locale]}</P>
      <CodeBlock lang="kotlin" filename="workshops-spring/src/main/kotlin/workshops/spring/WorkshopsApplication.kt" code={APPLICATION_CODE} />
      <P>{copy.spring7[locale]}</P>
      <CodeBlock lang="bash" code={RUN_SPRING_CODE} />

      <H2>{copy.suspendTitle[locale]}</H2>
      <P>{copy.suspend1[locale]}</P>
      <P>{copy.suspend2[locale]}</P>
      <P>{copy.suspend3[locale]}</P>
      <CodeBlock lang="kotlin" filename="workshops-spring/src/main/kotlin/workshops/spring/AttendanceSheetReader.kt" code={BLOCKING_CALL_CODE} />
      <P>{copy.suspend4[locale]}</P>

      <H2>{copy.ktorTitle[locale]}</H2>
      <P>{copy.ktor1[locale]}</P>
      <P>{copy.ktor2[locale]}</P>
      <CodeBlock lang="kotlin" filename="workshops-ktor/build.gradle.kts" code={KTOR_BUILD_CODE} />
      <P>{copy.ktor3[locale]}</P>
      <CodeBlock lang="kotlin" filename="workshops-ktor/src/main/kotlin/workshops/ktor/Application.kt" code={KTOR_CODE} />
      <P>{copy.ktor4[locale]}</P>
      <P>{copy.ktor5[locale]}</P>
      <P>{copy.ktor6[locale]}</P>
      <CodeBlock lang="bash" code={RUN_KTOR_CODE} />

      <H2>{copy.chooseTitle[locale]}</H2>
      <P>{copy.choose1[locale]}</P>
      <FlowDiagram
        nodes={frameworkFlow.nodes}
        edges={frameworkFlow.edges}
        height={360}
        ariaLabel={copy.frameworkAria[locale]}
        caption={copy.frameworkCaption[locale]}
      />
      <P>{copy.choose2[locale]}</P>
      <OL>
        <LI><Strong>{copy.chooseCase1Label[locale]}</Strong> {copy.chooseCase1[locale]}</LI>
        <LI><Strong>{copy.chooseCase2Label[locale]}</Strong> {copy.chooseCase2[locale]}</LI>
        <LI><Strong>{copy.chooseCase3Label[locale]}</Strong> {copy.chooseCase3[locale]}</LI>
      </OL>
      <P>{copy.choose3[locale]}</P>

      <H2>{copy.callingTitle[locale]}</H2>
      <P>{copy.calling1[locale]}</P>
      <CodeBlock lang="bash" code={REQUESTS_CODE} />
      <P>{copy.calling2[locale]}</P>
      <CodeBlock lang="bash" code={SPRING_FAILURES_CODE} />
      <P>{copy.calling3[locale]}</P>
      <CodeBlock lang="bash" code={KTOR_FAILURES_CODE} />
      <P>{copy.calling4[locale]}</P>

      <H2>{copy.serializationTitle[locale]}</H2>
      <P>{copy.serialization1[locale]}</P>
      <P>{copy.serialization2[locale]}</P>
      <P>{copy.serialization3[locale]}</P>
      <P>{copy.serialization4[locale]}</P>

      <H2>{copy.testsTitle[locale]}</H2>
      <P>{copy.tests1[locale]}</P>
      <P>{copy.tests2[locale]}</P>
      <CodeBlock lang="kotlin" filename="workshops-spring/src/test/kotlin/workshops/spring/RegistrationEndpointTest.kt" code={SPRING_TEST_CODE} />
      <P>{copy.tests3[locale]}</P>
      <P>{copy.tests4[locale]}</P>
      <CodeBlock lang="kotlin" filename="workshops-ktor/src/test/kotlin/workshops/ktor/RegistrationRoutesTest.kt" code={KTOR_TEST_CODE} />
      <P>{copy.tests5[locale]}</P>
      <P>{copy.tests6[locale]}</P>
      <CodeBlock lang="bash" code={TEST_RUN_CODE} />

      <H2>{copy.contributingTitle[locale]}</H2>
      <P>{copy.contributing1[locale]}</P>
      <P>{copy.contributing2[locale]}</P>
      <UL>
        <LI><Strong>{copy.habitReadLabel[locale]}</Strong> {copy.habitRead[locale]}</LI>
        <LI><Strong>{copy.habitContractLabel[locale]}</Strong> {copy.habitContract[locale]}</LI>
        <LI><Strong>{copy.habitAskLabel[locale]}</Strong> {copy.habitAsk[locale]}</LI>
        <LI><Strong>{copy.habitReviewLabel[locale]}</Strong> {copy.habitReview[locale]}</LI>
      </UL>
      <P>{copy.contributing3[locale]}</P>

      <H2>{copy.closeTitle[locale]}</H2>
      <P>{copy.close1[locale]}</P>
      <P>{copy.close2[locale]}</P>
      <P>{copy.close3[locale]}</P>
    </>
  );
}

const INIT_CODE = `mkdir workshops
cd workshops
gradle init --type basic --dsl kotlin --project-name workshops
rm build.gradle.kts

mkdir -p workshops-domain/src/main/kotlin/workshops/domain
mkdir -p workshops-domain/src/test/kotlin/workshops/domain
mkdir -p workshops-spring/src/main/kotlin/workshops/spring
mkdir -p workshops-spring/src/test/kotlin/workshops/spring
mkdir -p workshops-ktor/src/main/kotlin/workshops/ktor
mkdir -p workshops-ktor/src/test/kotlin/workshops/ktor`;

const SETTINGS_CODE = `rootProject.name = "workshops"

include("workshops-domain")
include("workshops-spring")
include("workshops-ktor")`;

const DOMAIN_BUILD_CODE = `plugins {
    kotlin("jvm") version "2.4.10"
}

group = "workshops"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.11.0")
    testImplementation(kotlin("test"))
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.11.0")
}

kotlin {
    jvmToolchain(25)
}

tasks.test {
    useJUnitPlatform()
    testLogging { events("passed") }
}`;

const DOMAIN_TYPES_CODE = `package workshops.domain

import java.time.Instant
import java.util.UUID

data class Workshop(
    val id: UUID,
    val title: String,
    val capacity: Int,
)

data class Registration(
    val id: UUID,
    val workshopId: UUID,
    val attendeeName: String,
    val attendeeEmail: String,
    val registeredAt: Instant,
)

object WorkshopCatalogue {
    val all: List<Workshop> = listOf(
        Workshop(
            UUID.fromString("11111111-1111-1111-1111-111111111111"),
            "Reading legacy code",
            12,
        ),
        Workshop(
            UUID.fromString("22222222-2222-2222-2222-222222222222"),
            "Accessible components",
            2,
        ),
    )
}`;

const WIRE_TYPES_CODE = `package workshops.spring

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import workshops.domain.Registration
import java.time.Instant
import java.util.UUID

data class RegisterRequest(
    val workshopId: UUID,
    @field:NotBlank
    @field:Size(min = 2, max = 80)
    val attendeeName: String,
    @field:NotBlank
    @field:Email
    val attendeeEmail: String,
)

data class RegistrationResponse(
    val id: UUID,
    val workshopId: UUID,
    val attendeeName: String,
    val attendeeEmail: String,
    val registeredAt: Instant,
) {
    companion object {
        fun from(registration: Registration) = RegistrationResponse(
            registration.id,
            registration.workshopId,
            registration.attendeeName,
            registration.attendeeEmail,
            registration.registeredAt,
        )
    }
}`;

const OUTCOME_CODE = `package workshops.domain

import java.util.UUID

sealed interface RegisterOutcome {
    data class Accepted(val registration: Registration) : RegisterOutcome

    data class WorkshopNotFound(val workshopId: UUID) : RegisterOutcome

    data class WorkshopFull(val workshopId: UUID, val capacity: Int) : RegisterOutcome
}`;

const SERVICE_CODE = `package workshops.domain

import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import java.time.Clock
import java.time.Instant
import java.util.UUID

class RegistrationService(
    workshops: List<Workshop>,
    private val clock: Clock,
) {
    private val workshopsById = workshops.associateBy(Workshop::id)
    private val registrationsById = linkedMapOf<UUID, Registration>()
    private val gate = Mutex()

    suspend fun register(
        workshopId: UUID,
        attendeeName: String,
        attendeeEmail: String,
    ): RegisterOutcome = gate.withLock {
        val workshop = workshopsById[workshopId]
            ?: return@withLock RegisterOutcome.WorkshopNotFound(workshopId)

        val taken = registrationsById.values.count { registration ->
            registration.workshopId == workshopId
        }
        if (taken >= workshop.capacity) {
            return@withLock RegisterOutcome.WorkshopFull(workshopId, workshop.capacity)
        }

        val registration = Registration(
            UUID.randomUUID(),
            workshopId,
            attendeeName,
            attendeeEmail,
            Instant.now(clock),
        )
        registrationsById[registration.id] = registration
        RegisterOutcome.Accepted(registration)
    }

    suspend fun find(registrationId: UUID): Registration? =
        gate.withLock { registrationsById[registrationId] }

    suspend fun listForWorkshop(workshopId: UUID): List<Registration> =
        gate.withLock {
            registrationsById.values.filter { registration ->
                registration.workshopId == workshopId
            }
        }

    suspend fun cancel(registrationId: UUID): Boolean =
        gate.withLock { registrationsById.remove(registrationId) != null }
}`;

const OUTCOME_RESPONSE_CODE = `package workshops.spring

import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.http.ResponseEntity
import workshops.domain.RegisterOutcome
import java.net.URI

fun RegisterOutcome.toResponse(): ResponseEntity<Any> = when (this) {
    is RegisterOutcome.Accepted -> ResponseEntity
        .created(URI.create("/registrations/\${registration.id}"))
        .body(RegistrationResponse.from(registration))

    is RegisterOutcome.WorkshopNotFound -> ResponseEntity.notFound().build()

    is RegisterOutcome.WorkshopFull -> ResponseEntity
        .status(HttpStatus.CONFLICT)
        .body(workshopIsFull(this))
}

private fun workshopIsFull(outcome: RegisterOutcome.WorkshopFull): ProblemDetail =
    ProblemDetail.forStatus(HttpStatus.CONFLICT).apply {
        type = URI.create("https://workshops.example/problems/workshop-full")
        title = "The workshop is full."
        detail = "Every place in this workshop is taken."
        setProperty("workshopId", outcome.workshopId)
    }`;

const SPRING_BUILD_CODE = `plugins {
    kotlin("jvm") version "2.4.10"
    kotlin("plugin.spring") version "2.4.10"
    id("org.springframework.boot") version "4.1.1"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "workshops"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation(project(":workshops-domain"))
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-starter-webflux")
    testImplementation("org.springframework.boot:spring-boot-testcontainers")
    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.testcontainers:testcontainers-postgresql")
}

kotlin {
    jvmToolchain(25)
}

tasks.test {
    useJUnitPlatform()
    testLogging { events("passed") }
}`;

const CONTROLLER_CODE = `package workshops.spring

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import workshops.domain.RegistrationService
import java.util.UUID

@RestController
@RequestMapping("/registrations")
class RegistrationsController(
    private val registrations: RegistrationService,
) {
    @PostMapping
    suspend fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<Any> =
        registrations.register(
            request.workshopId,
            request.attendeeName,
            request.attendeeEmail,
        ).toResponse()

    @GetMapping("/{registrationId}")
    suspend fun find(@PathVariable registrationId: UUID): ResponseEntity<RegistrationResponse> =
        registrations.find(registrationId)
            ?.let { registration -> ResponseEntity.ok(RegistrationResponse.from(registration)) }
            ?: ResponseEntity.notFound().build()

    @GetMapping
    suspend fun listForWorkshop(@RequestParam workshopId: UUID): List<RegistrationResponse> =
        registrations.listForWorkshop(workshopId).map(RegistrationResponse::from)

    @DeleteMapping("/{registrationId}")
    suspend fun cancel(@PathVariable registrationId: UUID): ResponseEntity<Unit> =
        if (registrations.cancel(registrationId)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
}`;

const APPLICATION_CODE = `package workshops.spring

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import workshops.domain.RegistrationService
import workshops.domain.WorkshopCatalogue
import java.time.Clock

@SpringBootApplication
class WorkshopsApplication {
    @Bean
    fun registrationService(): RegistrationService =
        RegistrationService(WorkshopCatalogue.all, Clock.systemUTC())
}

fun main(arguments: Array<String>) {
    runApplication<WorkshopsApplication>(*arguments)
}`;

const RUN_SPRING_CODE = `$ ./gradlew :workshops-spring:bootRun

Tomcat started on port 8080 (http) with context path '/'
Started WorkshopsApplicationKt`;

const BLOCKING_CALL_CODE = `package workshops.spring

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.nio.file.Files
import java.nio.file.Path
import java.util.UUID

class AttendanceSheetReader(private val directory: Path) {
    suspend fun read(workshopId: UUID): String = withContext(Dispatchers.IO) {
        Files.readString(directory.resolve("$workshopId.csv"))
    }
}`;

const KTOR_BUILD_CODE = `plugins {
    kotlin("jvm") version "2.4.10"
    kotlin("plugin.serialization") version "2.4.10"
    id("io.ktor.plugin") version "3.5.2"
}

group = "workshops"
version = "1.0.0"

application {
    mainClass.set("workshops.ktor.ApplicationKt")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(project(":workshops-domain"))
    implementation("io.ktor:ktor-server-core")
    implementation("io.ktor:ktor-server-netty")
    implementation("io.ktor:ktor-server-content-negotiation")
    implementation("io.ktor:ktor-serialization-kotlinx-json")
    implementation("io.ktor:ktor-server-request-validation")
    implementation("io.ktor:ktor-server-status-pages")
    testImplementation("io.ktor:ktor-server-test-host")
    testImplementation("io.ktor:ktor-client-content-negotiation")
    testImplementation(kotlin("test"))
}

kotlin {
    jvmToolchain(25)
}

tasks.test {
    useJUnitPlatform()
    testLogging { events("passed") }
}`;

const KTOR_CODE = `package workshops.ktor

import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.plugins.BadRequestException
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.plugins.requestvalidation.RequestValidation
import io.ktor.server.plugins.requestvalidation.RequestValidationException
import io.ktor.server.plugins.requestvalidation.ValidationResult
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.request.receive
import io.ktor.server.response.header
import io.ktor.server.response.respond
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import io.ktor.server.routing.routing
import io.ktor.server.util.getOrFail
import kotlinx.serialization.Serializable
import workshops.domain.RegisterOutcome
import workshops.domain.Registration
import workshops.domain.RegistrationService
import workshops.domain.WorkshopCatalogue
import java.time.Clock
import java.util.UUID

@Serializable
data class RegisterRequest(
    val workshopId: String,
    val attendeeName: String,
    val attendeeEmail: String,
)

@Serializable
data class RegistrationResponse(
    val id: String,
    val workshopId: String,
    val attendeeName: String,
    val attendeeEmail: String,
    val registeredAt: String,
) {
    companion object {
        fun from(registration: Registration) = RegistrationResponse(
            registration.id.toString(),
            registration.workshopId.toString(),
            registration.attendeeName,
            registration.attendeeEmail,
            registration.registeredAt.toString(),
        )
    }
}

@Serializable
data class Problem(
    val type: String,
    val title: String,
    val status: Int,
    val detail: String,
    val workshopId: String? = null,
)

fun main() {
    embeddedServer(Netty, port = 8080) { module() }.start(wait = true)
}

fun Application.module() {
    val registrations = RegistrationService(WorkshopCatalogue.all, Clock.systemUTC())

    install(ContentNegotiation) { json() }

    install(RequestValidation) {
        validate<RegisterRequest> { request -> validateRegisterRequest(request) }
    }

    install(StatusPages) {
        exception<RequestValidationException> { call, cause ->
            call.respond(
                HttpStatusCode.BadRequest,
                Problem(
                    type = "https://workshops.example/problems/invalid-request",
                    title = "The request is not valid.",
                    status = HttpStatusCode.BadRequest.value,
                    detail = cause.reasons.joinToString(" "),
                ),
            )
        }

        exception<BadRequestException> { call, cause ->
            call.respond(
                HttpStatusCode.BadRequest,
                Problem(
                    type = "https://workshops.example/problems/unreadable-request",
                    title = "The request could not be read.",
                    status = HttpStatusCode.BadRequest.value,
                    detail = cause.message ?: "The body did not match the expected shape.",
                ),
            )
        }
    }

    routing {
        route("/registrations") {
            post {
                val request = call.receive<RegisterRequest>()
                val outcome = registrations.register(
                    UUID.fromString(request.workshopId),
                    request.attendeeName,
                    request.attendeeEmail,
                )
                when (outcome) {
                    is RegisterOutcome.Accepted -> {
                        val registration = outcome.registration
                        call.response.header(
                            HttpHeaders.Location,
                            "/registrations/\${registration.id}",
                        )
                        call.respond(
                            HttpStatusCode.Created,
                            RegistrationResponse.from(registration),
                        )
                    }

                    is RegisterOutcome.WorkshopNotFound -> call.respond(HttpStatusCode.NotFound)

                    is RegisterOutcome.WorkshopFull -> call.respond(
                        HttpStatusCode.Conflict,
                        workshopFullProblem(outcome),
                    )
                }
            }

            get("/{registrationId}") {
                val registrationId = UUID.fromString(call.parameters.getOrFail("registrationId"))
                val registration = registrations.find(registrationId)
                if (registration == null) {
                    call.respond(HttpStatusCode.NotFound)
                } else {
                    call.respond(RegistrationResponse.from(registration))
                }
            }

            get {
                val workshopId = UUID.fromString(call.request.queryParameters.getOrFail("workshopId"))
                call.respond(registrations.listForWorkshop(workshopId).map(RegistrationResponse::from))
            }

            delete("/{registrationId}") {
                val registrationId = UUID.fromString(call.parameters.getOrFail("registrationId"))
                val removed = registrations.cancel(registrationId)
                call.respond(if (removed) HttpStatusCode.NoContent else HttpStatusCode.NotFound)
            }
        }
    }
}

private fun validateRegisterRequest(request: RegisterRequest): ValidationResult {
    val reasons = buildList {
        if (runCatching { UUID.fromString(request.workshopId) }.isFailure) {
            add("workshopId must be a UUID.")
        }
        if (request.attendeeName.isBlank()) {
            add("attendeeName must not be blank.")
        }
        if (!request.attendeeEmail.contains("@")) {
            add("attendeeEmail must be an email address.")
        }
    }
    return if (reasons.isEmpty()) ValidationResult.Valid else ValidationResult.Invalid(reasons)
}

private fun workshopFullProblem(outcome: RegisterOutcome.WorkshopFull) = Problem(
    type = "https://workshops.example/problems/workshop-full",
    title = "The workshop is full.",
    status = HttpStatusCode.Conflict.value,
    detail = "Every place in this workshop is taken.",
    workshopId = outcome.workshopId.toString(),
)`;

const RUN_KTOR_CODE = `$ ./gradlew :workshops-ktor:run

Application started.
Responding at http://0.0.0.0:8080`;

const REQUESTS_CODE = `$ curl -i -X POST http://localhost:8080/registrations \\
    -H "Content-Type: application/json" \\
    -d '{"workshopId":"22222222-2222-2222-2222-222222222222","attendeeName":"Sanne de Wit","attendeeEmail":"sanne@example.com"}'

HTTP/1.1 201
Location: /registrations/0f5f2b6c-6a1d-4d5e-9d3f-6a0f1c2b7e41
Content-Type: application/json

{"id":"0f5f2b6c-6a1d-4d5e-9d3f-6a0f1c2b7e41","workshopId":"22222222-2222-2222-2222-222222222222","attendeeName":"Sanne de Wit","attendeeEmail":"sanne@example.com","registeredAt":"2026-09-07T09:14:22.481Z"}

$ curl -i http://localhost:8080/registrations/0f5f2b6c-6a1d-4d5e-9d3f-6a0f1c2b7e41

HTTP/1.1 200
Content-Type: application/json

{"id":"0f5f2b6c-6a1d-4d5e-9d3f-6a0f1c2b7e41","workshopId":"22222222-2222-2222-2222-222222222222","attendeeName":"Sanne de Wit","attendeeEmail":"sanne@example.com","registeredAt":"2026-09-07T09:14:22.481Z"}

$ curl -i "http://localhost:8080/registrations?workshopId=22222222-2222-2222-2222-222222222222"

HTTP/1.1 200
Content-Type: application/json

[{"id":"0f5f2b6c-6a1d-4d5e-9d3f-6a0f1c2b7e41","workshopId":"22222222-2222-2222-2222-222222222222","attendeeName":"Sanne de Wit","attendeeEmail":"sanne@example.com","registeredAt":"2026-09-07T09:14:22.481Z"}]

$ curl -i -X DELETE http://localhost:8080/registrations/0f5f2b6c-6a1d-4d5e-9d3f-6a0f1c2b7e41

HTTP/1.1 204`;

const SPRING_FAILURES_CODE = `$ curl -i -X POST http://localhost:8080/registrations \\
    -H "Content-Type: application/json" \\
    -d '{"workshopId":"22222222-2222-2222-2222-222222222222","attendeeName":"","attendeeEmail":"sanne"}'

HTTP/1.1 400
Content-Type: application/problem+json

{"type":"about:blank","title":"Bad Request","status":400,"detail":"Invalid request content.","instance":"/registrations"}

$ curl -i -X POST http://localhost:8080/registrations \\
    -H "Content-Type: application/json" \\
    -d '{"workshopId":"22222222-2222-2222-2222-222222222222","attendeeName":"Noor Bakker","attendeeEmail":"noor@example.com"}'

HTTP/1.1 409
Content-Type: application/problem+json

{"type":"https://workshops.example/problems/workshop-full","title":"The workshop is full.","status":409,"detail":"Every place in this workshop is taken.","workshopId":"22222222-2222-2222-2222-222222222222"}`;

const KTOR_FAILURES_CODE = `HTTP/1.1 400
Content-Type: application/json

{"type":"https://workshops.example/problems/invalid-request","title":"The request is not valid.","status":400,"detail":"attendeeName must not be blank. attendeeEmail must be an email address."}

HTTP/1.1 409
Content-Type: application/json

{"type":"https://workshops.example/problems/workshop-full","title":"The workshop is full.","status":409,"detail":"Every place in this workshop is taken.","workshopId":"22222222-2222-2222-2222-222222222222"}`;

const SPRING_TEST_CODE = `package workshops.spring

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.testcontainers.service.connection.ServiceConnection
import org.springframework.http.HttpStatus
import org.springframework.test.web.reactive.server.WebTestClient
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import org.testcontainers.postgresql.PostgreSQLContainer
import java.util.UUID

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class RegistrationEndpointTest(
    @Autowired private val client: WebTestClient,
) {
    @Test
    fun createsARegistrationAndAnswersWithItsAddress() {
        client.post().uri("/registrations")
            .bodyValue(registrationFor("Sanne de Wit"))
            .exchange()
            .expectStatus().isCreated()
            .expectHeader().exists("Location")
    }

    @Test
    fun answersAMissingNameAndABrokenAddressWithOneValidationProblem() {
        client.post().uri("/registrations")
            .bodyValue(
                mapOf(
                    "workshopId" to SMALL_WORKSHOP,
                    "attendeeName" to "",
                    "attendeeEmail" to "sanne",
                ),
            )
            .exchange()
            .expectStatus().isBadRequest()
    }

    @Test
    fun answersAFullWorkshopWithAConflictThatNamesTheWorkshop() {
        register("Sanne de Wit")
        register("Tarik Yildiz")

        client.post().uri("/registrations")
            .bodyValue(registrationFor("Noor Bakker"))
            .exchange()
            .expectStatus().isEqualTo(HttpStatus.CONFLICT)
            .expectBody()
            .jsonPath("$.type").isEqualTo("https://workshops.example/problems/workshop-full")
            .jsonPath("$.workshopId").isEqualTo(SMALL_WORKSHOP.toString())
    }

    private fun register(attendeeName: String) {
        client.post().uri("/registrations")
            .bodyValue(registrationFor(attendeeName))
            .exchange()
            .expectStatus().isCreated()
    }

    private fun registrationFor(attendeeName: String) = RegisterRequest(
        workshopId = SMALL_WORKSHOP,
        attendeeName = attendeeName,
        attendeeEmail = "attendee@example.com",
    )

    companion object {
        private val SMALL_WORKSHOP: UUID =
            UUID.fromString("22222222-2222-2222-2222-222222222222")

        @Container
        @ServiceConnection
        @JvmStatic
        val database = PostgreSQLContainer("postgres:17-alpine")
    }
}`;

const KTOR_TEST_CODE = `package workshops.ktor

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.testing.testApplication
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

private const val SMALL_WORKSHOP = "22222222-2222-2222-2222-222222222222"

class RegistrationRoutesTest {
    @Test
    fun createsARegistrationAndAnswersWithItsAddress() = testApplication {
        application { module() }
        val client = createClient { install(ContentNegotiation) { json() } }

        val response = client.register("Sanne de Wit")

        assertEquals(HttpStatusCode.Created, response.status)
        assertNotNull(response.headers[HttpHeaders.Location])
    }

    @Test
    fun answersAMissingNameAndABrokenAddressWithOneValidationProblem() = testApplication {
        application { module() }
        val client = createClient { install(ContentNegotiation) { json() } }

        val response = client.post("/registrations") {
            contentType(ContentType.Application.Json)
            setBody(RegisterRequest(SMALL_WORKSHOP, "", "sanne"))
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
        assertEquals(
            "https://workshops.example/problems/invalid-request",
            response.body<Problem>().type,
        )
    }

    @Test
    fun answersAFullWorkshopWithAConflictThatNamesTheWorkshop() = testApplication {
        application { module() }
        val client = createClient { install(ContentNegotiation) { json() } }

        client.register("Sanne de Wit")
        client.register("Tarik Yildiz")

        val response = client.register("Noor Bakker")

        assertEquals(HttpStatusCode.Conflict, response.status)
        assertEquals(SMALL_WORKSHOP, response.body<Problem>().workshopId)
    }

    private suspend fun HttpClient.register(attendeeName: String): HttpResponse =
        post("/registrations") {
            contentType(ContentType.Application.Json)
            setBody(
                RegisterRequest(
                    workshopId = SMALL_WORKSHOP,
                    attendeeName = attendeeName,
                    attendeeEmail = "attendee@example.com",
                ),
            )
        }
}`;

const TEST_RUN_CODE = `$ ./gradlew test

> Task :workshops-ktor:test

RegistrationRoutesTest > createsARegistrationAndAnswersWithItsAddress PASSED
RegistrationRoutesTest > answersAMissingNameAndABrokenAddressWithOneValidationProblem PASSED
RegistrationRoutesTest > answersAFullWorkshopWithAConflictThatNamesTheWorkshop PASSED

> Task :workshops-spring:test

RegistrationEndpointTest > createsARegistrationAndAnswersWithItsAddress PASSED
RegistrationEndpointTest > answersAMissingNameAndABrokenAddressWithOneValidationProblem PASSED
RegistrationEndpointTest > answersAFullWorkshopWithAConflictThatNamesTheWorkshop PASSED

BUILD SUCCESSFUL`;

const COPY = {
  contentsLabel: { en: "In this article", nl: "In dit artikel" },
  lead: {
    en: "This article writes the workshop registration API from the C# article again in Kotlin, once on Spring Boot and once on Ktor. The requests, the status codes and the error bodies stay where they were. What the language changes is everything around them.",
    nl: "Dit artikel schrijft de inschrijf-API voor workshops uit het C#-artikel opnieuw in Kotlin, één keer op Spring Boot en één keer op Ktor. De requests, de statuscodes en de foutbodies blijven waar ze waren. Wat de taal verandert, is alles daaromheen.",
  },
  intro1: {
    en: "I am a frontend engineer who writes backend code when the build needs it. At bol.com I am the frontend specialist in teams made up mostly of backend developers, and I wrote backend logic in Kotlin when capacity was tight. That is the situation this article is written for.",
    nl: "Ik ben een frontend engineer die backendcode schrijft als de bouw daarom vraagt. Bij bol.com ben ik de frontendspecialist in teams die vooral uit backenddevelopers bestaan, en schreef ik backendlogica in Kotlin als de capaciteit krap was. Voor die situatie is dit artikel geschreven.",
  },
  versions: {
    en: "The samples target Kotlin 2.4 with Spring Boot 4.1 and Ktor 3.5, checked on 7 September 2026. Kotlin 2.4 ships K2 as the only compiler, so there is no second compiler to keep in mind. Spring Boot 4.1 manages Kotlin 2.3.21 and accepts 2.2 and up, so a build that wants 2.4.10 says so in its own plugin block. The toolchain everywhere is JDK 25, the current release with long-term support.",
    nl: "De voorbeelden zijn geschreven voor Kotlin 2.4 met Spring Boot 4.1 en Ktor 3.5, gecontroleerd op 7 september 2026. Kotlin 2.4 levert K2 als enige compiler, dus er is geen tweede compiler om rekening mee te houden. Spring Boot 4.1 beheert Kotlin 2.3.21 en accepteert 2.2 en hoger, dus een build die 2.4.10 wil, zegt dat in zijn eigen pluginblok. De toolchain is overal JDK 25, de huidige release met langetermijnondersteuning.",
  },
  intro2: {
    en: "The example runs through the series. A workshop has a title and a number of places. One registration puts one attendee in one workshop, and once the places are gone the next attempt is refused. Four routes serve that: create a registration, read one back, list the ones for a workshop, cancel one. The names and the status codes match the C# article exactly. Every file, every build file and every request is in this article, so you can follow it from an empty folder to a running API.",
    nl: "Het voorbeeld loopt door de hele reeks. Een workshop heeft een titel en een aantal plaatsen. Eén inschrijving zet één deelnemer in één workshop, en zodra de plaatsen op zijn, wordt de volgende poging geweigerd. Vier routes bedienen dat: een inschrijving aanmaken, er één teruglezen, de inschrijvingen van een workshop opsommen en er één annuleren. De namen en de statuscodes komen exact overeen met het C#-artikel. Elk bestand, elk buildbestand en elk request staat in dit artikel, zodat je van een lege map tot een draaiende API komt.",
  },
  quote: {
    en: "A client sees four routes, four status codes and one error shape. Everything above that line is the language's business.",
    nl: "Een client ziet vier routes, vier statuscodes en één foutvorm. Alles boven die lijn is de zaak van de taal.",
  },
  shorterTitle: {
    en: "Why the Kotlin version of this API is shorter",
    nl: "Waarom de Kotlin-versie van deze API korter is",
  },
  shorter1: {
    en: "Shorter is not the goal. It happens anyway, because three features of the language take whole categories of code off the page.",
    nl: "Korter is niet het doel. Het gebeurt toch, want drie eigenschappen van de taal halen hele categorieën code van de pagina.",
  },
  shorter2: {
    en: "A data class writes the constructor, the accessors, equals, hashCode, toString and copy from one list of names and types. The request, the response and the two domain types are all data classes, so their files are the list of fields and nothing more.",
    nl: "Een data class schrijft de constructor, de accessors, equals, hashCode, toString en copy vanuit één lijst met namen en types. Het request, de response en de twee domeintypes zijn allemaal data classes, dus hun bestanden zijn de lijst met velden en niets meer.",
  },
  shorter3: {
    en: "A nullable type is a different type from a non-nullable one, so the null check happens once, where the value arrives from outside. Below that point the question never comes up again.",
    nl: "Een nullable type is een ander type dan een niet-nullable type, dus de nullcontrole gebeurt één keer, daar waar de waarde van buiten binnenkomt. Daaronder komt de vraag nooit meer op.",
  },
  shorter4: {
    en: "A sealed interface closes a set of types at compile time, so a when that covers every case needs no final branch for the case that cannot happen. The C# version keeps a switch arm that throws for exactly that reason. Kotlin deletes the arm and the reason for it.",
    nl: "Een sealed interface sluit een verzameling types af tijdens het compileren, dus een when die elk geval afdekt, heeft geen laatste tak nodig voor het geval dat niet kan gebeuren. De C#-versie houdt precies daarom een switch-tak die gooit. Kotlin schrapt de tak en de reden ervoor.",
  },
  projectTitle: {
    en: "The project, from an empty folder",
    nl: "Het project, vanaf een lege map",
  },
  project1: {
    en: "Three Gradle modules. The module workshops-domain holds the rules and depends on no framework. The modules workshops-spring and workshops-ktor are two applications over it, and neither knows the other exists. Start with a folder, a Gradle wrapper and the source directories.",
    nl: "Drie Gradle-modules. De module workshops-domain bevat de regels en hangt van geen enkel framework af. De modules workshops-spring en workshops-ktor zijn twee applicaties daarboven, en geen van beide weet dat de ander bestaat. Begin met een map, een Gradle-wrapper en de bronmappen.",
  },
  project2: {
    en: "The init task leaves a root build file that this project does not need, so the line above removes it. Each module carries its own. The settings file is what turns three folders into one build.",
    nl: "De init-taak laat een hoofdbuildbestand achter dat dit project niet nodig heeft, dus de regel hierboven haalt het weg. Elke module heeft zijn eigen bestand. Het settingsbestand maakt van drie mappen één build.",
  },
  project3: {
    en: "The domain build file is the shortest of the three and the one worth defending in review. One plugin, one dependency and the test libraries. Coroutines is a language library and not a framework, so the rule still holds: nothing in this module knows about HTTP, JSON or an application container.",
    nl: "Het buildbestand van het domein is het kortste van de drie en het bestand dat je in een review verdedigt. Eén plugin, één afhankelijkheid en de testbibliotheken. Coroutines is een taalbibliotheek en geen framework, dus de regel blijft staan: niets in deze module weet iets van HTTP, JSON of een applicatiecontainer.",
  },
  project4: {
    en: "The two application build files come with the sections that use them. Every module compiles through the toolchain, so the JDK that happens to be on the machine does not decide what the build produces. From here the domain module is the first thing to fill.",
    nl: "De twee buildbestanden van de applicaties komen bij de paragrafen die ze gebruiken. Elke module compileert via de toolchain, dus de JDK die toevallig op de machine staat, bepaalt niet wat de build oplevert. Vanaf hier is de domeinmodule het eerste dat gevuld wordt.",
  },
  dataTitle: {
    en: "Data classes as the request and response types",
    nl: "Data classes als request- en responsetype",
  },
  data1: {
    en: "Start with the domain, because both frameworks call the same thing. Two data classes carry it, and one catalogue holds the two workshops the sample serves.",
    nl: "Begin bij het domein, want beide frameworks roepen hetzelfde aan. Twee data classes dragen het, en één catalogus bevat de twee workshops die het voorbeeld bedient.",
  },
  data2: {
    en: "Then the wire types, which stay separate from the domain types on purpose. The domain decides what a registration is. The API decides what it looks like on the wire. Those two answers change for different reasons and at different moments. This file is the Spring version, and the Ktor module writes its own further down, because the annotations on a wire type belong to the framework that reads them.",
    nl: "Dan de types op de lijn, die met opzet losstaan van de domeintypes. Het domein bepaalt wat een inschrijving is. De API bepaalt hoe die er op de lijn uitziet. Die twee antwoorden veranderen om verschillende redenen en op verschillende momenten. Dit bestand is de Spring-versie, en de Ktor-module schrijft verderop zijn eigen versie, want de annotaties op een type op de lijn horen bij het framework dat ze leest.",
  },
  data3: {
    en: "Validation sits on the request type as jakarta.validation annotations, and Spring runs them when the parameter carries Valid. Hibernate Validator reads a constraint from the field, so a constructor property names the field use-site target to put it there. The response gets a companion factory, and that is the one place the mapping lives. A field added to the domain reaches the wire when someone puts it there, which is the moment to decide whether a client should see it at all.",
    nl: "Validatie staat op het requesttype als jakarta.validation-annotaties, en Spring voert ze uit zodra de parameter Valid draagt. Hibernate Validator leest een constraint van het veld, dus een constructorproperty noemt het use-site target field om hem daar te zetten. De response krijgt een companion-factory, en dat is de enige plek waar die vertaling staat. Een veld dat aan het domein wordt toegevoegd, komt op de lijn zodra iemand het daar neerzet, en dat is het moment om te beslissen of een client het überhaupt hoort te zien.",
  },
  targetWarningTitle: {
    en: "The use-site target decides where the annotation lands",
    nl: "Het use-site target bepaalt waar de annotatie terechtkomt",
  },
  targetWarningBody: {
    en: "A constructor property in Kotlin is four things at once: a constructor parameter, a property, a backing field and a getter. An annotation in front of it has to go to one of them, and a validation constraint has to reach the field, because that is where Hibernate Validator looks. Writing the field target is one word, and it settles the question in review as well as at runtime.",
    nl: "Een constructorproperty in Kotlin is vier dingen tegelijk: een constructorparameter, een property, een achterliggend veld en een getter. Een annotatie ervoor moet naar één daarvan, en een validatieregel moet bij het veld uitkomen, want daar kijkt Hibernate Validator. Het target field opschrijven is één woord, en het beslecht de vraag in de review net zo goed als tijdens het draaien.",
  },
  nullTitle: {
    en: "Null safety at the API boundary",
    nl: "Null safety op de grens van de API",
  },
  null1: {
    en: "Inside the module the compiler settles the null question. Outside it, JSON arrives from a client that can leave anything out, so the boundary is where the two worlds have to agree.",
    nl: "Binnen de module beslecht de compiler de nullvraag. Daarbuiten komt JSON binnen van een client die alles kan weglaten, dus de grens is waar de twee werelden het eens moeten worden.",
  },
  null2: {
    en: "The Kotlin module for Jackson makes that meeting safe. With it on the classpath, a missing field for a non-nullable property fails the deserialization and the request comes back as a 400. Without it, Jackson puts null where the type promised there could be none, and the failure surfaces far from the request that caused it. Spring Boot registers the module when it is there, and a Kotlin project generated from start.spring.io has it from the first commit.",
    nl: "De Kotlin-module voor Jackson maakt die ontmoeting veilig. Met die module op het classpath mislukt de deserialisatie zodra een veld voor een niet-nullable property ontbreekt, en komt het request terug als een 400. Zonder die module zet Jackson null neer waar het type beloofde dat er geen kon zijn, en duikt de fout ver van het request op dat hem veroorzaakte. Spring Boot registreert de module zodra hij er is, en een Kotlin-project van start.spring.io heeft hem vanaf de eerste commit.",
  },
  null3: {
    en: "So the request type is a statement about what a client may leave out. A non-nullable property is required, a nullable one is optional, and there is no third state to document elsewhere. That is worth more at the boundary than in any other file, because this is the one place where the data has not been checked yet.",
    nl: "Het requesttype is dus een uitspraak over wat een client mag weglaten. Een niet-nullable property is verplicht, een nullable property is optioneel, en er is geen derde toestand die je ergens anders moet vastleggen. Dat is op de grens meer waard dan in welk ander bestand ook, want dit is de enige plek waar de gegevens nog niet gecontroleerd zijn.",
  },
  null4: {
    en: "Looking up one registration returns a Registration or null, and the handler turns that into a 200 or a 404 on one line with the elvis operator. One case needs care: a value out of a Java library has a platform type, which the compiler accepts on both sides, so give it a Kotlin type the moment it crosses into your own code.",
    nl: "Eén inschrijving opzoeken levert een Registration of null op, en de handler maakt daar op één regel een 200 of een 404 van met de elvisoperator. Eén geval vraagt aandacht: een waarde uit een Java-bibliotheek heeft een platformtype, en dat accepteert de compiler aan beide kanten, dus geef hem een Kotlin-type op het moment dat hij je eigen code binnenkomt.",
  },
  sealedTitle: {
    en: "Sealed results for expected failures",
    nl: "Sealed results voor fouten die je verwacht",
  },
  sealed1: {
    en: "Three things can happen when someone registers. The registration is accepted, the workshop does not exist, or the workshop is full. Two of those are failures and none of them is exceptional, because a full workshop is the system doing its job.",
    nl: "Er kunnen drie dingen gebeuren als iemand zich inschrijft. De inschrijving wordt geaccepteerd, de workshop bestaat niet, of de workshop is vol. Twee daarvan zijn fouten en geen enkele is uitzonderlijk, want een volle workshop is het systeem dat zijn werk doet.",
  },
  sealed2: {
    en: "A sealed interface writes that down as a closed set. Every case is a type, every type carries the data that case needs, and nothing outside the file adds a fourth.",
    nl: "Een sealed interface schrijft dat op als een afgesloten verzameling. Elk geval is een type, elk type draagt de gegevens die dat geval nodig heeft, en niets buiten het bestand zet er een vierde bij.",
  },
  sealed3: {
    en: "The service is the whole domain. It counts the places that are taken, refuses when there are none left, and stores the registration when there are. A mutex guards the count and the write together, because those two steps have to be one step.",
    nl: "De service is het hele domein. Hij telt de bezette plaatsen, weigert als er geen over zijn en bewaart de inschrijving als die er wel zijn. Een mutex bewaakt het tellen en het schrijven samen, want die twee stappen moeten één stap zijn.",
  },
  sealed4: {
    en: "One sentence for the difference with the C# version. There the compiler does not prove the set is covered, so every switch keeps a final arm that throws. Kotlin proves it, so a fourth outcome fails the build at every place that has to answer it.",
    nl: "Eén zin over het verschil met de C#-versie. Daar bewijst de compiler niet dat de verzameling is afgedekt, dus houdt elke switch een laatste tak die gooit. Kotlin bewijst het wel, dus een vierde uitkomst laat de build falen op elke plek die er antwoord op moet geven.",
  },
  sealed5: {
    en: "The mapping from an outcome to a response is an extension function in the API module, so the domain never learns what a status code is and the file that knows both is four lines of when. The conflict carries the workshop identifier as an extra member on the problem detail, so a client can act on it without reading the sentence in the detail field. ProblemDetail follows RFC 9457.",
    nl: "De vertaling van een uitkomst naar een antwoord is een extensiefunctie in de API-module, dus het domein leert nooit wat een statuscode is en het bestand dat allebei kent, is vier regels when. Het conflict draagt de workshopidentificatie als extra veld op de problem detail, zodat een client ermee kan werken zonder de zin in het detailveld te lezen. ProblemDetail volgt RFC 9457.",
  },
  outcomeAria: {
    en: "Diagram: a sealed RegisterOutcome enters one when expression that branches into a 201 Created, a 404 Not Found and a 409 Conflict with problem details",
    nl: "Diagram: een sealed RegisterOutcome gaat één when-expressie in die vertakt naar een 201 Created, een 404 Not Found en een 409 Conflict met problem details",
  },
  outcomeCaption: {
    en: "The handler returns one sealed type, so the compiler checks that every outcome has a response.",
    nl: "De handler geeft één sealed type terug, dus de compiler controleert of elke uitkomst een antwoord heeft.",
  },
  springTitle: {
    en: "The Spring route: kotlin(\"plugin.spring\") and why it exists",
    nl: "De Spring-route: kotlin(\"plugin.spring\") en waarom die bestaat",
  },
  spring1: {
    en: "A Kotlin class is final until you write open in front of it. That is a good default for a domain, and it meets a framework that creates proxies by subclassing your class, which is what Spring does for configuration and for anything it wraps in a transaction or a cache.",
    nl: "Een Kotlin-klasse is final tot je er open voor zet. Dat is een goede standaard voor een domein, en het komt een framework tegen dat proxies maakt door je klasse te erven, en dat doet Spring bij configuratie en bij alles wat het in een transactie of een cache verpakt.",
  },
  spring2: {
    en: "The Spring plugin settles that without asking you to open anything by hand. It is the all-open compiler plugin with the list filled in, and it opens classes carrying Component, Async, Transactional, Cacheable and SpringBootTest, along with everything meta-annotated with those, which is how Configuration, Controller, RestController, Service and Repository come along.",
    nl: "De Spring-plugin lost dat op zonder dat je zelf iets hoeft te openen. Het is de all-open compilerplugin met de lijst al ingevuld, en hij opent klassen met Component, Async, Transactional, Cacheable en SpringBootTest, samen met alles wat daarmee meta-geannoteerd is, en zo komen Configuration, Controller, RestController, Service en Repository mee.",
  },
  spring3: {
    en: "The version is pinned in the plugin block, because Spring Boot 4.1 manages 2.3.21 and a build that wants 2.4.10 states it there. The coroutines dependency in that list is the adapter Spring uses to invoke a suspending handler. The webflux and Testcontainers lines are for the tests near the end. And the controller below is what you would expect.",
    nl: "De versie staat vast in het pluginblok, want Spring Boot 4.1 beheert 2.3.21 en een build die 2.4.10 wil, zet dat daar neer. De coroutines-afhankelijkheid in die lijst is de adapter waarmee Spring een suspend-handler aanroept. De regels voor webflux en Testcontainers zijn voor de tests aan het eind. En de controller hieronder is wat je verwacht.",
  },
  spring5: {
    en: "Constructor injection needs no annotation, because there is one constructor. The elvis operator turns the nullable lookup into a 404. A request that fails validation never reaches the method, and Spring answers it with a problem detail in the same shape as the conflict. And the sibling plugin for JPA is worth knowing about for the day the map becomes a table, because Hibernate wants a no-argument constructor that a data class does not have.",
    nl: "Constructorinjectie heeft geen annotatie nodig, want er is één constructor. De elvisoperator maakt van de nullable lookup een 404. Een request dat de validatie niet haalt, bereikt de methode nooit, en Spring antwoordt met een problem detail in dezelfde vorm als het conflict. En de zusterplugin voor JPA is het kennen waard voor de dag dat de map een tabel wordt, want Hibernate wil een constructor zonder argumenten die een data class niet heeft.",
  },
  spring6: {
    en: "One file is still missing, and without it the controller has nothing to inject. The application class starts Boot and hands the container the one service this API has, built from the catalogue and a clock. A clock as a constructor argument is what lets a test fix the time later.",
    nl: "Er ontbreekt nog één bestand, en zonder dat bestand heeft de controller niets om te injecteren. De applicatieklasse start Boot en geeft de container de ene service die deze API heeft, gebouwd uit de catalogus en een klok. Een klok als constructorargument is wat een test later toelaat de tijd vast te zetten.",
  },
  spring7: {
    en: "That is the Spring version complete. It runs with one Gradle task and answers on port 8080.",
    nl: "Daarmee is de Spring-versie compleet. Hij draait met één Gradle-taak en antwoordt op poort 8080.",
  },
  suspendTitle: {
    en: "suspend handlers and coroutines",
    nl: "suspend-handlers en coroutines",
  },
  suspend1: {
    en: "Every handler in that controller is a suspending function. Spring's handler adapter knows how to invoke one: it starts the coroutine and finishes the request when the coroutine returns.",
    nl: "Elke handler in die controller is een suspend-functie. De handleradapter van Spring weet hoe hij zo'n functie aanroept: hij start de coroutine en rondt het request af zodra de coroutine terugkeert.",
  },
  suspend2: {
    en: "What suspend buys is the shape of the code. A call that waits gives its thread back at the suspension point, so waiting on another service does not hold a thread, and the code still reads as one line after another. There is no callback and no chain of operators.",
    nl: "Wat suspend oplevert, is de vorm van de code. Een aanroep die wacht, geeft zijn thread terug op het suspendpunt, dus wachten op een andere service houdt geen thread bezet, en de code leest nog steeds als de ene regel na de andere. Er is geen callback en geen keten van operators.",
  },
  suspend3: {
    en: "The rule that keeps that true is short. A suspending function must not block. When it has to call something that does block, a file read or a driver without an asynchronous API, it moves that call to the dispatcher built for waiting. This file is not one of the four routes, and it is the shape to reach for when a handler has to touch something blocking.",
    nl: "De regel die dat waar houdt, is kort. Een suspend-functie mag niet blokkeren. Moet hij toch iets aanroepen dat wel blokkeert, een bestand lezen of een driver zonder asynchrone API, dan verplaatst hij die aanroep naar de dispatcher die voor wachten is gemaakt. Dit bestand hoort niet bij de vier routes, en het is de vorm waar je naar grijpt als een handler iets blokkerends moet aanraken.",
  },
  suspend4: {
    en: "Two calls that do not depend on each other run at the same time inside coroutineScope with async, and if one of them fails the scope cancels the other. kotlinx.coroutines 1.11.0 is the library behind all of it, and Spring Boot manages the version for you. Nothing in the domain module knows any of this is happening. RegistrationService suspends, and what runs it is the framework's business.",
    nl: "Twee aanroepen die niet van elkaar afhangen, draaien tegelijk binnen coroutineScope met async, en faalt er één, dan annuleert de scope de andere. kotlinx.coroutines 1.11.0 is de bibliotheek achter dit alles, en Spring Boot beheert de versie voor je. Niets in de domeinmodule weet dat dit gebeurt. RegistrationService suspendt, en wat hem draait is de zaak van het framework.",
  },
  ktorTitle: {
    en: "The Ktor route: routing, ContentNegotiation, StatusPages",
    nl: "De Ktor-route: routing, ContentNegotiation, StatusPages",
  },
  ktor1: {
    en: "Ktor takes the other path. There is no component scan and no annotation on a class. An application is a function that installs what it needs and declares its routes, and reading it top to bottom tells you everything the server does.",
    nl: "Ktor kiest de andere weg. Er is geen componentscan en geen annotatie op een klasse. Een applicatie is een functie die installeert wat ze nodig heeft en haar routes opsomt, en van boven naar beneden lezen vertelt je alles wat de server doet.",
  },
  ktor2: {
    en: "Three plugins carry this API. ContentNegotiation picks the serializer for the content type. RequestValidation checks a decoded body before a handler sees it. StatusPages turns an exception or a bare status code into a response body in one place. A fourth, Resources, adds typed routes for the day the paths grow parameters worth naming. The Ktor Gradle plugin brings the versions with it, so the artifacts below carry none of their own.",
    nl: "Drie plugins dragen deze API. ContentNegotiation kiest de serializer bij het contenttype. RequestValidation controleert een gedecodeerde body voordat een handler hem ziet. StatusPages maakt van een exception of een kale statuscode op één plek een responsbody. Een vierde, Resources, voegt getypeerde routes toe voor de dag dat de paden parameters krijgen die een naam verdienen. De Gradle-plugin van Ktor brengt de versies mee, dus de artefacten hieronder dragen geen eigen versie.",
  },
  ktor3: {
    en: "Everything the Ktor version needs sits in one file: its own wire types, the problem body, the plugins and the four routes. The identifiers on the wire are strings here, because this module serializes with kotlinx and java.util.UUID has no serializer in the box. Converting at the edge is the cheaper of the two answers, and the JSON a client sees is the same either way.",
    nl: "Alles wat de Ktor-versie nodig heeft, staat in één bestand: zijn eigen types op de lijn, de foutbody, de plugins en de vier routes. De identificaties op de lijn zijn hier strings, want deze module serialiseert met kotlinx en java.util.UUID heeft standaard geen serializer. Op de grens converteren is het goedkoopste van de twee antwoorden, en de JSON die een client ziet, is in beide gevallen dezelfde.",
  },
  ktor4: {
    en: "Every Ktor handler is already a suspending lambda, so there is nothing to declare. The call object is the request and the response together, and the Location header is one line above the 201.",
    nl: "Elke Ktor-handler is al een suspend-lambda, dus er valt niets te verklaren. Het call-object is het request en de response tegelijk, en de Location-header staat één regel boven de 201.",
  },
  ktor5: {
    en: "StatusPages is where the error shape lives. A body Ktor cannot read, a missing path parameter and a failed validation all land in a handler there, so every route stays about its own work. The engine is Netty here, with CIO, Jetty and Tomcat one word away. What Ktor leaves to you is the part Spring hands over as configuration, which is a pleasure at four routes and a decision to make at forty.",
    nl: "In StatusPages woont de foutvorm. Een body die Ktor niet kan lezen, een ontbrekende padparameter en een mislukte validatie komen daar allemaal in een handler terecht, dus elke route blijft over zijn eigen werk gaan. De engine is hier Netty, met CIO, Jetty en Tomcat één woord verderop. Wat Ktor aan jou laat, is het deel dat Spring als configuratie meegeeft, en dat is een genot bij vier routes en een beslissing bij veertig.",
  },
  ktor6: {
    en: "The Ktor version runs with its own Gradle task, on the same port. Ktor logs through SLF4J, so without a backend on the classpath it starts and prints a warning about the missing provider. Add logback-classic when you want the log itself.",
    nl: "De Ktor-versie draait met zijn eigen Gradle-taak, op dezelfde poort. Ktor logt via SLF4J, dus zonder backend op het classpath start hij en meldt hij dat er geen provider is. Voeg logback-classic toe zodra je het log zelf wilt.",
  },
  chooseTitle: {
    en: "Choosing between the two",
    nl: "Kiezen tussen de twee",
  },
  choose1: {
    en: "The domain module underneath is the same file in both versions, imports included. What differs is the ring around it.",
    nl: "De domeinmodule eronder is in beide versies hetzelfde bestand, imports en al. Wat verschilt, is de ring eromheen.",
  },
  frameworkAria: {
    en: "Diagram: one POST request served by a Spring Boot application and by a Ktor application, and both call the same workshops-domain module underneath",
    nl: "Diagram: één POST-request dat door een Spring Boot-applicatie en door een Ktor-applicatie wordt bediend, en allebei roepen ze dezelfde module workshops-domain eronder aan",
  },
  frameworkCaption: {
    en: "Both frameworks serve the same domain, and only the outer ring changes.",
    nl: "Beide frameworks bedienen hetzelfde domein, en alleen de buitenste ring verandert.",
  },
  choose2: {
    en: "Three cases settle the choice in practice, and the first one settles most of them.",
    nl: "Drie gevallen beslissen de keuze in de praktijk, en het eerste beslist de meeste.",
  },
  chooseCase1Label: {
    en: "The codebase already runs one of them.",
    nl: "De codebase draait er al een.",
  },
  chooseCase1: {
    en: "A team on Spring gets a Spring API, and its testing, security and configuration come with the decision. One stack per codebase is worth more than the framework you would pick on an empty folder.",
    nl: "Een team op Spring krijgt een Spring-API, en het testen, de beveiliging en de configuratie komen met die keuze mee. Eén stack per codebase is meer waard dan het framework dat je op een lege map zou kiezen.",
  },
  chooseCase2Label: {
    en: "The service is small and owns its dependencies.",
    nl: "De service is klein en heeft zijn afhankelijkheden zelf in de hand.",
  },
  chooseCase2: {
    en: "Four routes over one service is this article, and a Ktor module carries that as one readable function. Nothing runs that you did not write down.",
    nl: "Vier routes over één service is dit artikel, en een Ktor-module draagt dat als één leesbare functie. Er draait niets wat je niet zelf hebt opgeschreven.",
  },
  chooseCase3Label: {
    en: "You want what Spring supplies as configuration.",
    nl: "Je wilt wat Spring als configuratie meelevert.",
  },
  chooseCase3: {
    en: "Spring Security, Spring Data, Actuator, Micrometer and the Testcontainers support below are a dependency and a property away. Ktor has plugins for authentication, metrics and sessions, and the rest is code you own.",
    nl: "Spring Security, Spring Data, Actuator, Micrometer en de Testcontainers-ondersteuning verderop zijn één afhankelijkheid en één property ver. Ktor heeft plugins voor authenticatie, metrics en sessies, en de rest is code die van jou is.",
  },
  choose3: {
    en: "There is a fourth answer that beats all three. When another team owns the service, the choice was made before you arrived, and the useful contribution is the one that fits what is already running.",
    nl: "Er is een vierde antwoord dat de drie andere overtreft. Bezit een ander team de service, dan is de keuze al gemaakt voordat jij er was, en de bijdrage die helpt, past bij wat er al draait.",
  },
  callingTitle: {
    en: "Every route, and the two failures",
    nl: "Elke route, en de twee fouten",
  },
  calling1: {
    en: "With either version running on port 8080, the four routes answer the same way. The workshop in these calls is the one with two places, so the third registration below is the one that runs out of room.",
    nl: "Met een van beide versies op poort 8080 antwoorden de vier routes hetzelfde. De workshop in deze aanroepen is die met twee plaatsen, dus de derde inschrijving hieronder is degene die geen ruimte meer heeft.",
  },
  calling2: {
    en: "Now the two failures. A body with an empty name and an address without an at sign never reaches the handler, and a third registration for a workshop with two places comes back as a conflict. These are the Spring answers.",
    nl: "Dan de twee fouten. Een body met een lege naam en een adres zonder apenstaartje bereikt de handler nooit, en een derde inschrijving voor een workshop met twee plaatsen komt terug als een conflict. Dit zijn de antwoorden van Spring.",
  },
  calling3: {
    en: "Spring writes the 400 from its own handler, so it says the request was bad without naming a field. Naming the fields is an exception handler you add, one that reads the binding result and puts an errors member on the problem detail. Ktor answers the same two calls from the StatusPages block, so the 400 carries the reasons the validator returned.",
    nl: "Spring schrijft de 400 vanuit zijn eigen handler, dus die zegt dat het request niet klopte zonder een veld te noemen. De velden benoemen is een exception handler die je toevoegt, een handler die het bindingresultaat leest en een errors-veld op de problem detail zet. Ktor beantwoordt dezelfde twee aanroepen vanuit het StatusPages-blok, dus de 400 draagt de redenen die de validator teruggaf.",
  },
  calling4: {
    en: "The content type differs too. Spring writes application/problem+json for a ProblemDetail, and the Ktor version writes plain JSON because its problem body is a data class of its own. A client that reads the type member handles both, which is the reason the type member is there.",
    nl: "Ook het contenttype verschilt. Spring schrijft application/problem+json voor een ProblemDetail, en de Ktor-versie schrijft gewone JSON, want zijn foutbody is een eigen data class. Een client die het type-veld leest, kan met allebei overweg, en daarvoor is dat veld er.",
  },
  serializationTitle: {
    en: "Serialization: Jackson or kotlinx",
    nl: "Serialisatie: Jackson of kotlinx",
  },
  serialization1: {
    en: "Two serializers are in common use, and in either framework the switch between them is one line in the install block. This project runs one of each, so both are already on the page.",
    nl: "Twee serializers zijn gangbaar, en in beide frameworks is de wissel ertussen één regel in het installblok. Dit project draait er één van elk, dus allebei staan ze al op de pagina.",
  },
  serialization2: {
    en: "Jackson is what Spring configures for you. The Kotlin module teaches it constructor binding, default values and nullability, and after that a data class travels both ways without an annotation. Everything the Java ecosystem knows about Jackson still applies, which counts in a codebase where half the types come from elsewhere.",
    nl: "Jackson is wat Spring voor je configureert. De Kotlin-module leert hem constructorbinding, standaardwaarden en nullability, en daarna reist een data class beide kanten op zonder annotatie. Alles wat het Java-ecosysteem over Jackson weet, blijft gelden, en dat telt in een codebase waar de helft van de types ergens anders vandaan komt.",
  },
  serialization3: {
    en: "kotlinx.serialization takes the other approach. A compiler plugin reads the Serializable annotation and generates the serializer at build time, so nothing is discovered by reflection at startup. It knows Kotlin's type system exactly, defaults and nullability included, and it is the natural choice when the same data classes are shared with a Kotlin Multiplatform client. One practical note: java.util.UUID has no serializer in the box, so a wire type carries a String or names a serializer of its own.",
    nl: "kotlinx.serialization kiest de andere aanpak. Een compilerplugin leest de annotatie Serializable en genereert de serializer tijdens het bouwen, dus er wordt bij het opstarten niets via reflectie ontdekt. Hij kent het typesysteem van Kotlin precies, standaardwaarden en nullability inbegrepen, en hij is de logische keuze zodra dezelfde data classes met een Kotlin Multiplatform-client worden gedeeld. Eén praktische noot: java.util.UUID heeft standaard geen serializer, dus een type op de lijn draagt een String of noemt een eigen serializer.",
  },
  serialization4: {
    en: "For this API either one is correct. What decides it is the rest of the codebase, and in a Spring team the answer is usually Jackson, because Boot has already configured it. The two build files show the difference in full: the Spring module takes Jackson from the starter and adds the Kotlin module, and the Ktor module adds the serialization compiler plugin and asks for the kotlinx artifact.",
    nl: "Voor deze API is allebei goed. Wat de doorslag geeft, is de rest van de codebase, en in een Spring-team is het antwoord meestal Jackson, want Boot heeft hem al geconfigureerd. De twee buildbestanden laten het verschil volledig zien: de Spring-module haalt Jackson uit de starter en voegt de Kotlin-module toe, en de Ktor-module voegt de serialisatieplugin toe en vraagt om het kotlinx-artefact.",
  },
  testsTitle: {
    en: "Tests in Kotlin",
    nl: "Testen in Kotlin",
  },
  tests1: {
    en: "The API is worth testing through the door a client uses, because routing, deserialization, validation and the error writer all sit between the request and the rule.",
    nl: "Het is de moeite waard de API te testen door de deur die een client gebruikt, want routering, deserialisatie, validatie en de foutschrijver zitten allemaal tussen het request en de regel.",
  },
  tests2: {
    en: "On the Spring side the test starts the application on a random port and talks to it over HTTP. The Testcontainers annotation starts a PostgreSQL container, and ServiceConnection hands Spring its connection details, so no test property names a host or a password. The store here is a map, and the container is there for the day it becomes a table.",
    nl: "Aan de Spring-kant start de test de applicatie op een vrije poort en praat er via HTTP mee. De Testcontainers-annotatie start een PostgreSQL-container, en ServiceConnection geeft Spring de verbindingsgegevens ervan, dus geen enkele testproperty noemt een host of een wachtwoord. De opslag is hier een map, en de container staat er voor de dag dat het een tabel wordt.",
  },
  tests3: {
    en: "Two details follow the current versions. Testcontainers 2 moved the PostgreSQL container to its own artifact and dropped the self type, so the class takes no type argument. And Spring Boot binds a WebTestClient to the running server when the test uses a random port, with spring-webflux on the test classpath.",
    nl: "Twee details volgen de huidige versies. Testcontainers 2 verplaatste de PostgreSQL-container naar een eigen artefact en liet het zelftype vallen, dus de klasse heeft geen typeargument meer. En Spring Boot koppelt een WebTestClient aan de draaiende server zodra de test een vrije poort gebruikt, met spring-webflux op het testclasspath.",
  },
  tests4: {
    en: "The Ktor test needs no container and no server. testApplication starts the module in memory and hands back a client that talks to it, and that client gets its own ContentNegotiation, because the two sides negotiate separately.",
    nl: "De Ktor-test heeft geen container en geen server nodig. testApplication start de module in het geheugen en geeft een client terug die ermee praat, en die client krijgt zijn eigen ContentNegotiation, want de twee kanten onderhandelen apart.",
  },
  tests5: {
    en: "The rule underneath needs neither framework. A test on RegistrationService registers twice and asserts that the third attempt is WorkshopFull, driven by runTest from kotlinx-coroutines-test. assertIs from kotlin.test proves the type and smart-casts the value in one step, so the next line reads the capacity off the case it just proved.",
    nl: "De regel eronder heeft geen van beide frameworks nodig. Een test op RegistrationService schrijft twee keer in en stelt vast dat de derde poging WorkshopFull is, gedreven door runTest uit kotlinx-coroutines-test. assertIs uit kotlin.test bewijst het type en smart-cast de waarde in één stap, zodat de volgende regel de capaciteit afleest van het geval dat hij zojuist bewees.",
  },
  tests6: {
    en: "One task runs every module. The Spring test starts a container, so Docker has to be running for it. The build files ask Gradle to print each test that passes, which is what a green run looks like.",
    nl: "Eén taak draait elke module. De Spring-test start een container, dus daarvoor moet Docker draaien. De buildbestanden vragen Gradle om elke geslaagde test te tonen, en zo ziet een groene run eruit.",
  },
  contributingTitle: {
    en: "Contributing Kotlin to a team that owns it",
    nl: "Kotlin bijdragen aan een team dat het bezit",
  },
  contributing1: {
    en: "Everything above is how I would start a service of my own. The Kotlin I write on an engagement is different work. At bol.com I wrote backend logic in Kotlin when capacity was tight, in a codebase that team owns, next to my own work on the pages in front of it.",
    nl: "Alles hierboven is hoe ik zelf een service zou beginnen. De Kotlin die ik in een opdracht schrijf, is ander werk. Bij bol.com schreef ik backendlogica in Kotlin als de capaciteit krap was, in een codebase die dat team bezit, naast mijn eigen werk aan de pagina's ervoor.",
  },
  contributing2: {
    en: "Work like that runs on four habits, and none of them is about the language.",
    nl: "Zulk werk draait op vier gewoontes, en geen daarvan gaat over de taal.",
  },
  habitReadLabel: { en: "Read the house style first.", nl: "Lees eerst de huisstijl van de code." },
  habitRead: {
    en: "How results are shaped, where validation lives, what a test looks like: the answers are already in the code. A change that arrives in that shape is reviewed quickly and maintained afterwards.",
    nl: "Hoe resultaten zijn gevormd, waar validatie woont, hoe een test eruitziet: de antwoorden staan al in de code. Een wijziging die in die vorm binnenkomt, wordt snel gereviewd en daarna onderhouden.",
  },
  habitContractLabel: { en: "Settle it in the contract.", nl: "Beslecht het in het contract." },
  habitContract: {
    en: "GraphQL was the contract between frontend and backend on that platform. When a field arrived in a shape that made the interface awkward, I took the change into the contract with the backend engineers, so both sides agreed on it in one place before either of us wrote code.",
    nl: "GraphQL was op dat platform het contract tussen frontend en backend. Kwam een veld in een vorm binnen die de interface onhandig maakte, dan bracht ik de wijziging in het contract met de backend-engineers, zodat beide kanten het op één plek eens werden voordat een van ons code schreef.",
  },
  habitAskLabel: { en: "Ask while it is still cheap.", nl: "Vraag het als het nog goedkoop is." },
  habitAsk: {
    en: "Almost every change touched code owned by another team, so I coordinated continuously with two teams and with up to six at once for larger features. In refinement I ask a lot of questions, so edge cases surface early.",
    nl: "Vrijwel elke wijziging raakte code van een ander team, dus stemde ik doorlopend af met twee teams en bij grotere features met zes tegelijk. In refinements stel ik veel vragen, zodat randgevallen vroeg boven tafel komen.",
  },
  habitReviewLabel: { en: "Leave the last word with the owners.", nl: "Laat het laatste woord bij de eigenaren." },
  habitReview: {
    en: "They carry the service at three in the morning, so they decide what goes into it. A contribution that respects that gets merged, and the next one gets asked for.",
    nl: "Zij dragen de service om drie uur 's nachts, dus zij bepalen wat erin komt. Een bijdrage die dat respecteert, wordt gemerged, en om de volgende wordt gevraagd.",
  },
  contributing3: {
    en: "That is why the language matters less in this section than in all the ones before it. Kotlin is a pleasure to write. Fitting what a team already runs is what makes the contribution useful to them, and it is the reason a backend team asks a frontend engineer to pick up backend work a second time.",
    nl: "Daarom doet de taal in deze paragraaf minder toe dan in alle paragrafen ervoor. Kotlin is een genot om te schrijven. Passen bij wat een team al draait, is wat de bijdrage voor hen bruikbaar maakt, en het is de reden dat een backendteam een frontend engineer een tweede keer om backendwerk vraagt.",
  },
  closeTitle: {
    en: "What to take away",
    nl: "Wat je meeneemt",
  },
  close1: {
    en: "The wire is the smallest part to move between languages. Four routes, four status codes and one error shape came across from the C# article without a change.",
    nl: "De lijn is het kleinste deel om tussen talen te verplaatsen. Vier routes, vier statuscodes en één foutvorm kwamen ongewijzigd over uit het C#-artikel.",
  },
  close2: {
    en: "What Kotlin changes is how much is left to write. The data class removes the ceremony around a type. The nullable type moves the null question to the boundary. The sealed interface makes the compiler check that every outcome has an answer, and that is the one that keeps paying as the set of outcomes grows.",
    nl: "Wat Kotlin verandert, is hoeveel er te schrijven overblijft. De data class haalt de omhaal rond een type weg. Het nullable type brengt de nullvraag naar de grens. De sealed interface laat de compiler controleren of elke uitkomst een antwoord heeft, en dat is degene die blijft opleveren naarmate de verzameling uitkomsten groeit.",
  },
  close3: {
    en: "Pick the framework the codebase already runs, and keep the domain module free of both. It is the part that survives a framework choice, a serializer choice and a rewrite of the layer above it. I build frontends most weeks and I write the endpoints behind them when a build needs it, and this is the shape I reach for when that happens.",
    nl: "Kies het framework dat de codebase al draait, en houd de domeinmodule vrij van allebei. Dat is het deel dat een frameworkkeuze, een serializerkeuze en een herschrijving van de laag erboven overleeft. Ik bouw de meeste weken frontends en ik schrijf de endpoints erachter als de bouw daarom vraagt, en dit is de vorm waar ik dan naar grijp.",
  },
  nodeSpringSub: { en: "@RestController, suspend", nl: "@RestController, suspend" },
  nodeKtorSub: { en: "routing, StatusPages", nl: "routing, StatusPages" },
  edgeSameCall: { en: "the same call", nl: "dezelfde aanroep" },
  nodeBranchSub: { en: "exhaustive", nl: "sluitend" },
  nodeCreatedSub: { en: "Location header", nl: "Location-header" },
  nodeMissingSub: { en: "unknown workshop", nl: "onbekende workshop" },
} as const;
