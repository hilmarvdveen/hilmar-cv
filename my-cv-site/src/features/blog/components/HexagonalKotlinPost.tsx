import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, Lead, UL, OL, LI, Strong, Quote, Divider } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FlowDiagram } from "./FlowDiagram";
import { Contents } from "./Contents";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "hexagonal-architecture-kotlin",
  category: "architecture",
  publishedDate: "2026-09-02",
  updatedDate: "2026-09-05",
  readingTimeMin: 19,
  title: {
    en: "Hexagonal architecture in Kotlin: ports and adapters",
    nl: "Hexagonale architectuur in Kotlin: ports en adapters",
  },
  description: {
    en: "Ports and adapters in Kotlin and Spring Boot 3: a domain with no framework imports, sealed results, JPA and GraphQL adapters, fakes and Testcontainers.",
    nl: "Ports en adapters in Kotlin en Spring Boot 3: een domein zonder frameworkimports, sealed results, JPA- en GraphQL-adapters, fakes en Testcontainers.",
  },
  excerpt: {
    en: "A back end that serves a fast-moving frontend gets asked for a new shape every sprint. Hexagonal architecture keeps the rules underneath still while the surface keeps moving.",
    nl: "Een backend die een snelle frontend bedient, krijgt elke sprint om een nieuwe vorm gevraagd. Hexagonale architectuur houdt de regels eronder stil terwijl de buitenkant beweegt.",
  },
  keywords: [
    "hexagonal architecture kotlin",
    "ports and adapters spring boot",
    "kotlin sealed class domain model",
    "spring graphql resolver adapter",
    "jpa repository port kotlin",
    "testcontainers kotlin spring boot",
    "kotlin value class identifier",
  ],
};

function buildHexagon(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("resolver", copy.nodeResolver[locale], { x: 0, y: 0 }, { tone: "blue", subtitle: "pauseSubscription", direction: "TB", width: 200 }),
    flowNode("controller", copy.nodeController[locale], { x: 230, y: 0 }, { tone: "blue", subtitle: "PUT /subscriptions", direction: "TB", width: 200 }),
    flowNode("consumer", copy.nodeConsumer[locale], { x: 460, y: 0 }, { tone: "blue", subtitle: "PauseRequested", direction: "TB", width: 210 }),
    flowNode("useCase", "PauseSubscription", { x: 230, y: 140 }, { tone: "violet", subtitle: copy.nodeUseCaseSub[locale], direction: "TB", width: 210 }),
    flowNode("domain", copy.nodeDomain[locale], { x: 0, y: 290 }, { tone: "emerald", subtitle: "Subscription · SubscriptionState", direction: "TB", width: 240 }),
    flowNode("drivenPorts", copy.nodeDrivenPorts[locale], { x: 280, y: 290 }, { tone: "slate", subtitle: "SubscriptionRepository · PaymentProvider", direction: "TB", width: 340 }),
    flowNode("repository", copy.nodeRepository[locale], { x: 200, y: 440 }, { tone: "amber", subtitle: "PostgreSQL", direction: "TB", width: 190 }),
    flowNode("payment", copy.nodePayment[locale], { x: 410, y: 440 }, { tone: "amber", subtitle: copy.nodePaymentSub[locale], direction: "TB", width: 190 }),
    flowNode("outbox", copy.nodeOutbox[locale], { x: 620, y: 440 }, { tone: "amber", subtitle: copy.nodeOutboxSub[locale], direction: "TB", width: 190 }),
  ];
  const edges = [
    flowEdge("resolver", "useCase", { label: "GraphQL" }),
    flowEdge("controller", "useCase", { label: "HTTP" }),
    flowEdge("consumer", "useCase", { label: copy.edgeMessage[locale] }),
    flowEdge("useCase", "domain", { label: copy.edgeApplies[locale] }),
    flowEdge("useCase", "drivenPorts", { label: copy.edgeCalls[locale] }),
    flowEdge("drivenPorts", "repository", { dashed: true }),
    flowEdge("drivenPorts", "payment", { dashed: true, label: copy.edgeImplements[locale] }),
    flowEdge("drivenPorts", "outbox", { dashed: true }),
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
      <Contents
        label={copy.contentsLabel[locale]}
        items={[
          copy.whyTitle[locale],
          copy.overkillTitle[locale],
          copy.shapeTitle[locale],
          copy.domainTitle[locale],
          copy.portsTitle[locale],
          copy.adaptersTitle[locale],
          copy.wiringTitle[locale],
          copy.fakesTitle[locale],
          copy.containerTitle[locale],
          copy.boundariesTitle[locale],
          copy.schemaTitle[locale],
          copy.migrationTitle[locale],
          copy.closingTitle[locale],
        ]}
      />

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
      <P>{copy.shape2[locale]}</P>
      <UL>
        <LI><Strong>{copy.drivingLabel[locale]}</Strong> {copy.drivingBody[locale]}</LI>
        <LI><Strong>{copy.drivenLabel[locale]}</Strong> {copy.drivenBody[locale]}</LI>
        <LI><Strong>{copy.portsLabel[locale]}</Strong> {copy.portsBody[locale]}</LI>
      </UL>
      <P>{copy.shape3[locale]}</P>

      <H2>{copy.domainTitle[locale]}</H2>
      <P>{copy.domain1[locale]}</P>
      <CodeBlock lang="kotlin" filename="domain/build.gradle.kts" code={DOMAIN_BUILD} />
      <P>{copy.domain2[locale]}</P>
      <CodeBlock lang="kotlin" filename="domain/Subscription.kt" code={DOMAIN_CODE} />
      <P>{copy.domain3[locale]}</P>
      <UL>
        <LI><Strong>{copy.valueClassLabel[locale]}</Strong> {copy.valueClassBody[locale]}</LI>
        <LI><Strong>{copy.sealedLabel[locale]}</Strong> {copy.sealedBody[locale]}</LI>
        <LI><Strong>{copy.dataClassLabel[locale]}</Strong> {copy.dataClassBody[locale]}</LI>
        <LI><Strong>{copy.suspendLabel[locale]}</Strong> {copy.suspendBody[locale]}</LI>
      </UL>

      <H2>{copy.portsTitle[locale]}</H2>
      <P>{copy.ports1[locale]}</P>
      <CodeBlock lang="kotlin" filename="application/Ports.kt" code={PORTS_CODE} />
      <P>{copy.ports2[locale]}</P>
      <CodeBlock lang="kotlin" filename="application/PauseSubscription.kt" code={USE_CASE_CODE} />
      <P>{copy.ports3[locale]}</P>

      <H2>{copy.adaptersTitle[locale]}</H2>
      <P>{copy.adapters1[locale]}</P>
      <CodeBlock lang="kotlin" filename="infrastructure/JpaSubscriptionRepository.kt" code={JPA_ADAPTER_CODE} />
      <P>{copy.adapters2[locale]}</P>
      <CodeBlock lang="kotlin" filename="api/SubscriptionMutation.kt" code={GRAPHQL_ADAPTER_CODE} />
      <P>{copy.adapters3[locale]}</P>

      <H2>{copy.wiringTitle[locale]}</H2>
      <P>{copy.wiring1[locale]}</P>
      <CodeBlock lang="kotlin" filename="api/SubscriptionConfiguration.kt" code={WIRING_CODE} />
      <P>{copy.wiring2[locale]}</P>
      <Callout variant="tip" title={copy.ruleTitle[locale]}>
        {copy.ruleBody[locale]}
      </Callout>

      <Divider />

      <H2>{copy.fakesTitle[locale]}</H2>
      <P>{copy.fakes1[locale]}</P>
      <CodeBlock lang="kotlin" filename="application/Fakes.kt" code={FAKES_CODE} />
      <P>{copy.fakes2[locale]}</P>
      <CodeBlock lang="kotlin" filename="application/PauseSubscriptionTest.kt" code={USE_CASE_TEST_CODE} />
      <P>{copy.fakes3[locale]}</P>

      <H2>{copy.containerTitle[locale]}</H2>
      <P>{copy.container1[locale]}</P>
      <P>{copy.container2[locale]}</P>
      <CodeBlock lang="kotlin" filename="infrastructure/JpaSubscriptionRepositoryTest.kt" code={REPOSITORY_TEST_CODE} />
      <P>{copy.container3[locale]}</P>

      <H2>{copy.boundariesTitle[locale]}</H2>
      <P>{copy.boundaries1[locale]}</P>
      <UL>
        <LI><Strong>{copy.entityLabel[locale]}</Strong> {copy.entityBody[locale]}</LI>
        <LI><Strong>{copy.transferLabel[locale]}</Strong> {copy.transferBody[locale]}</LI>
        <LI><Strong>{copy.mappingLabel[locale]}</Strong> {copy.mappingBody[locale]}</LI>
        <LI><Strong>{copy.transactionLabel[locale]}</Strong> {copy.transactionBody[locale]}</LI>
      </UL>
      <P>{copy.boundaries2[locale]}</P>
      <P>{copy.moneyPath[locale]}</P>

      <H2>{copy.schemaTitle[locale]}</H2>
      <P>{copy.schema1[locale]}</P>
      <P>{copy.schema2[locale]}</P>

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

const DOMAIN_BUILD = `plugins {
    kotlin("jvm") version "2.0.20"
}

dependencies {
    implementation(kotlin("stdlib"))
    testImplementation(kotlin("test"))
}

kotlin {
    jvmToolchain(21)
}`;

const DOMAIN_CODE = `package subscriptions.domain

import java.time.LocalDate

@JvmInline
value class SubscriptionId(val value: String)

@JvmInline
value class CustomerId(val value: String)

sealed interface SubscriptionState {
    data class Active(val renewsOn: LocalDate) : SubscriptionState

    data class Paused(val resumesOn: LocalDate, val renewsOn: LocalDate) : SubscriptionState

    data object Cancelled : SubscriptionState
}

sealed interface PauseOutcome {
    data class Paused(val subscription: Subscription) : PauseOutcome

    sealed interface Rejected : PauseOutcome {
        data class AlreadyPaused(val resumesOn: LocalDate) : Rejected

        data class ResumeDateNotInFuture(val resumesOn: LocalDate) : Rejected

        data class PauseTooLong(val maximumDays: Long) : Rejected

        data object SubscriptionCancelled : Rejected
    }
}

data class Subscription(
    val id: SubscriptionId,
    val customerId: CustomerId,
    val state: SubscriptionState,
) {
    fun pause(resumesOn: LocalDate, today: LocalDate): PauseOutcome = when (val current = state) {
        is SubscriptionState.Active -> pauseFrom(current, resumesOn, today)
        is SubscriptionState.Paused -> PauseOutcome.Rejected.AlreadyPaused(current.resumesOn)
        SubscriptionState.Cancelled -> PauseOutcome.Rejected.SubscriptionCancelled
    }

    private fun pauseFrom(
        active: SubscriptionState.Active,
        resumesOn: LocalDate,
        today: LocalDate,
    ): PauseOutcome = when {
        !resumesOn.isAfter(today) -> PauseOutcome.Rejected.ResumeDateNotInFuture(resumesOn)
        resumesOn.isAfter(today.plusDays(MAXIMUM_PAUSE_DAYS)) ->
            PauseOutcome.Rejected.PauseTooLong(MAXIMUM_PAUSE_DAYS)
        else -> PauseOutcome.Paused(
            copy(state = SubscriptionState.Paused(resumesOn, active.renewsOn)),
        )
    }

    companion object {
        const val MAXIMUM_PAUSE_DAYS: Long = 90
    }
}`;

const PORTS_CODE = `package subscriptions.application

import subscriptions.domain.Subscription
import subscriptions.domain.SubscriptionId
import java.time.LocalDate

interface SubscriptionRepository {
    suspend fun findById(id: SubscriptionId): Subscription?

    suspend fun save(subscription: Subscription)
}

interface PaymentProvider {
    suspend fun suspendCollection(id: SubscriptionId, until: LocalDate): CollectionChange
}

sealed interface CollectionChange {
    data object Suspended : CollectionChange

    data class Refused(val reason: String) : CollectionChange
}

interface TransactionRunner {
    suspend fun <ResultType : Any> inTransaction(block: suspend () -> ResultType): ResultType
}

fun interface Clock {
    fun today(): LocalDate
}`;

const USE_CASE_CODE = `package subscriptions.application

import subscriptions.domain.PauseOutcome
import subscriptions.domain.Subscription
import subscriptions.domain.SubscriptionId
import java.time.LocalDate

sealed interface PauseSubscriptionResult {
    data class Paused(val subscription: Subscription) : PauseSubscriptionResult

    data object NotFound : PauseSubscriptionResult

    data class Rejected(val outcome: PauseOutcome.Rejected) : PauseSubscriptionResult

    data class CollectionRefused(val reason: String) : PauseSubscriptionResult
}

class PauseSubscription(
    private val subscriptions: SubscriptionRepository,
    private val payments: PaymentProvider,
    private val transactions: TransactionRunner,
    private val clock: Clock,
) {
    suspend fun handle(id: SubscriptionId, resumesOn: LocalDate): PauseSubscriptionResult =
        transactions.inTransaction {
            val subscription = subscriptions.findById(id)
                ?: return@inTransaction PauseSubscriptionResult.NotFound

            when (val outcome = subscription.pause(resumesOn, clock.today())) {
                is PauseOutcome.Paused -> stopCollection(outcome.subscription, resumesOn)
                is PauseOutcome.Rejected -> PauseSubscriptionResult.Rejected(outcome)
            }
        }

    private suspend fun stopCollection(
        paused: Subscription,
        resumesOn: LocalDate,
    ): PauseSubscriptionResult =
        when (val change = payments.suspendCollection(paused.id, resumesOn)) {
            is CollectionChange.Refused -> PauseSubscriptionResult.CollectionRefused(change.reason)
            CollectionChange.Suspended -> {
                subscriptions.save(paused)
                PauseSubscriptionResult.Paused(paused)
            }
        }
}`;

const JPA_ADAPTER_CODE = `package subscriptions.infrastructure

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import subscriptions.application.SubscriptionRepository
import subscriptions.domain.CustomerId
import subscriptions.domain.Subscription
import subscriptions.domain.SubscriptionId
import subscriptions.domain.SubscriptionState
import java.time.LocalDate

@Entity
@Table(name = "subscriptions")
class SubscriptionRow(
    @Id
    @Column(name = "id")
    var id: String = "",
    @Column(name = "customer_id")
    var customerId: String = "",
    @Column(name = "status")
    var status: String = "",
    @Column(name = "renews_on")
    var renewsOn: LocalDate? = null,
    @Column(name = "resumes_on")
    var resumesOn: LocalDate? = null,
)

interface SubscriptionRows : JpaRepository<SubscriptionRow, String>

fun SubscriptionRow.toSubscription(): Subscription = Subscription(
    id = SubscriptionId(id),
    customerId = CustomerId(customerId),
    state = when (status) {
        "active" -> SubscriptionState.Active(checkNotNull(renewsOn))
        "paused" -> SubscriptionState.Paused(checkNotNull(resumesOn), checkNotNull(renewsOn))
        else -> SubscriptionState.Cancelled
    },
)

fun Subscription.toRow(): SubscriptionRow = when (val current = state) {
    is SubscriptionState.Active ->
        SubscriptionRow(id.value, customerId.value, "active", current.renewsOn, null)
    is SubscriptionState.Paused ->
        SubscriptionRow(id.value, customerId.value, "paused", current.renewsOn, current.resumesOn)
    SubscriptionState.Cancelled ->
        SubscriptionRow(id.value, customerId.value, "cancelled", null, null)
}

@Repository
class JpaSubscriptionRepository(private val rows: SubscriptionRows) : SubscriptionRepository {

    override suspend fun findById(id: SubscriptionId): Subscription? =
        rows.findById(id.value).orElse(null)?.toSubscription()

    override suspend fun save(subscription: Subscription) {
        rows.save(subscription.toRow())
    }
}`;

const GRAPHQL_ADAPTER_CODE = `package subscriptions.api

import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.stereotype.Controller
import subscriptions.application.PauseSubscription
import subscriptions.application.PauseSubscriptionResult
import subscriptions.domain.PauseOutcome
import subscriptions.domain.Subscription
import subscriptions.domain.SubscriptionId
import subscriptions.domain.SubscriptionState
import java.time.LocalDate

data class SubscriptionView(val id: String, val status: String, val resumesOn: String?)

data class PauseSubscriptionPayload(val subscription: SubscriptionView?, val problem: String?)

@Controller
class SubscriptionMutation(private val pauseSubscription: PauseSubscription) {

    @MutationMapping(name = "pauseSubscription")
    suspend fun pause(
        @Argument id: String,
        @Argument resumesOn: LocalDate,
    ): PauseSubscriptionPayload =
        when (val result = pauseSubscription.handle(SubscriptionId(id), resumesOn)) {
            is PauseSubscriptionResult.Paused ->
                PauseSubscriptionPayload(result.subscription.toView(), null)
            PauseSubscriptionResult.NotFound ->
                PauseSubscriptionPayload(null, "SUBSCRIPTION_NOT_FOUND")
            is PauseSubscriptionResult.Rejected ->
                PauseSubscriptionPayload(null, result.outcome.toProblemCode())
            is PauseSubscriptionResult.CollectionRefused ->
                PauseSubscriptionPayload(null, "COLLECTION_REFUSED")
        }
}

private fun Subscription.toView(): SubscriptionView = when (val current = state) {
    is SubscriptionState.Active -> SubscriptionView(id.value, "ACTIVE", null)
    is SubscriptionState.Paused -> SubscriptionView(id.value, "PAUSED", current.resumesOn.toString())
    SubscriptionState.Cancelled -> SubscriptionView(id.value, "CANCELLED", null)
}

private fun PauseOutcome.Rejected.toProblemCode(): String = when (this) {
    is PauseOutcome.Rejected.AlreadyPaused -> "ALREADY_PAUSED"
    is PauseOutcome.Rejected.ResumeDateNotInFuture -> "RESUME_DATE_NOT_IN_FUTURE"
    is PauseOutcome.Rejected.PauseTooLong -> "PAUSE_TOO_LONG"
    PauseOutcome.Rejected.SubscriptionCancelled -> "SUBSCRIPTION_CANCELLED"
}`;

const WIRING_CODE = `package subscriptions.api

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.transaction.support.TransactionTemplate
import subscriptions.application.Clock
import subscriptions.application.PauseSubscription
import subscriptions.application.PaymentProvider
import subscriptions.application.SubscriptionRepository
import subscriptions.application.TransactionRunner
import java.time.LocalDate
import java.time.ZoneId

class SpringTransactionRunner(private val template: TransactionTemplate) : TransactionRunner {

    override suspend fun <ResultType : Any> inTransaction(
        block: suspend () -> ResultType,
    ): ResultType = withContext(Dispatchers.IO) {
        checkNotNull(template.execute { runBlocking { block() } })
    }
}

@Configuration
class SubscriptionConfiguration {

    @Bean
    fun clock(): Clock = Clock { LocalDate.now(ZoneId.of("Europe/Amsterdam")) }

    @Bean
    fun transactionRunner(template: TransactionTemplate): TransactionRunner =
        SpringTransactionRunner(template)

    @Bean
    fun pauseSubscription(
        subscriptions: SubscriptionRepository,
        payments: PaymentProvider,
        transactions: TransactionRunner,
        clock: Clock,
    ): PauseSubscription = PauseSubscription(subscriptions, payments, transactions, clock)
}`;

const FAKES_CODE = `package subscriptions.application

import subscriptions.domain.Subscription
import subscriptions.domain.SubscriptionId
import java.time.LocalDate

class InMemorySubscriptionRepository(stored: List<Subscription>) : SubscriptionRepository {
    private val byId = stored.associateBy { it.id }.toMutableMap()

    val saved = mutableListOf<Subscription>()

    override suspend fun findById(id: SubscriptionId): Subscription? = byId[id]

    override suspend fun save(subscription: Subscription) {
        byId[subscription.id] = subscription
        saved += subscription
    }
}

class RecordingPaymentProvider(private val answer: CollectionChange) : PaymentProvider {
    val calls = mutableListOf<SubscriptionId>()

    override suspend fun suspendCollection(id: SubscriptionId, until: LocalDate): CollectionChange {
        calls += id
        return answer
    }
}

object DirectTransactionRunner : TransactionRunner {
    override suspend fun <ResultType : Any> inTransaction(
        block: suspend () -> ResultType,
    ): ResultType = block()
}`;

const USE_CASE_TEST_CODE = `package subscriptions.application

import kotlinx.coroutines.test.runTest
import subscriptions.domain.CustomerId
import subscriptions.domain.Subscription
import subscriptions.domain.SubscriptionId
import subscriptions.domain.SubscriptionState
import java.time.LocalDate
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertIs

class PauseSubscriptionTest {
    private val today = LocalDate.of(2026, 9, 1)
    private val resumesOn = LocalDate.of(2026, 10, 1)
    private val renewsOn = LocalDate.of(2026, 12, 1)

    private val active = Subscription(
        id = SubscriptionId("subscription-1"),
        customerId = CustomerId("customer-1"),
        state = SubscriptionState.Active(renewsOn),
    )

    @Test
    fun \`pauses an active subscription and stops the collection\`() = runTest {
        val subscriptions = InMemorySubscriptionRepository(listOf(active))
        val payments = RecordingPaymentProvider(CollectionChange.Suspended)
        val useCase = PauseSubscription(subscriptions, payments, DirectTransactionRunner) { today }

        val result = useCase.handle(active.id, resumesOn)

        val paused = assertIs<PauseSubscriptionResult.Paused>(result)
        assertEquals(SubscriptionState.Paused(resumesOn, renewsOn), paused.subscription.state)
        assertEquals(listOf(active.id), payments.calls)
    }

    @Test
    fun \`saves nothing when the payment provider refuses\`() = runTest {
        val subscriptions = InMemorySubscriptionRepository(listOf(active))
        val payments = RecordingPaymentProvider(CollectionChange.Refused("mandate_revoked"))
        val useCase = PauseSubscription(subscriptions, payments, DirectTransactionRunner) { today }

        val result = useCase.handle(active.id, resumesOn)

        assertIs<PauseSubscriptionResult.CollectionRefused>(result)
        assertEquals(emptyList<Subscription>(), subscriptions.saved)
    }
}`;

const REPOSITORY_TEST_CODE = `package subscriptions.infrastructure

import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import org.testcontainers.utility.DockerImageName
import subscriptions.domain.CustomerId
import subscriptions.domain.Subscription
import subscriptions.domain.SubscriptionId
import subscriptions.domain.SubscriptionState
import java.time.LocalDate
import kotlin.test.assertEquals

@SpringBootTest
@Testcontainers
class JpaSubscriptionRepositoryTest(
    @Autowired private val repository: JpaSubscriptionRepository,
) {
    @Test
    fun \`stores a paused subscription and reads it back\`() = runBlocking {
        val subscription = Subscription(
            id = SubscriptionId("subscription-2"),
            customerId = CustomerId("customer-2"),
            state = SubscriptionState.Paused(
                resumesOn = LocalDate.of(2026, 10, 1),
                renewsOn = LocalDate.of(2026, 12, 1),
            ),
        )

        repository.save(subscription)

        assertEquals(subscription, repository.findById(subscription.id))
    }

    companion object {
        @Container
        @JvmStatic
        val database = PostgreSQLContainer<Nothing>(DockerImageName.parse("postgres:16-alpine"))

        @DynamicPropertySource
        @JvmStatic
        fun datasource(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", database::getJdbcUrl)
            registry.add("spring.datasource.username", database::getUsername)
            registry.add("spring.datasource.password", database::getPassword)
        }
    }
}`;

const COPY = {
  contentsLabel: { en: "In this article", nl: "In dit artikel" },
  lead: {
    en: "A back end that serves a fast-moving frontend gets asked for a new shape every sprint. Hexagonal architecture keeps the rules underneath still while the surface keeps moving.",
    nl: "Een backend die een snel bewegende frontend bedient, krijgt elke sprint om een nieuwe vorm gevraagd. Hexagonale architectuur houdt de regels eronder stil terwijl de buitenkant blijft bewegen.",
  },
  intro1: {
    en: "The pressure comes from the top. A page wants one field fewer, a new screen wants two entities in a single call, an experiment wants a second variant of the same list. Each request is small. Each one lands on a resolver, and a resolver that also holds the rules turns every layout question into a business risk.",
    nl: "De druk komt van boven. Een pagina wil één veld minder, een nieuw scherm wil twee entiteiten in één aanroep, een experiment wil een tweede variant van dezelfde lijst. Elk verzoek is klein. Elk verzoek komt binnen bij een resolver, en een resolver die ook de regels bevat, maakt van elke opmaakvraag een zakelijk risico.",
  },
  intro2: {
    en: "At bol.com I am the frontend specialist in teams that are mostly backend developers, and I treat the GraphQL schema as the contract between us. When a field arrives in an awkward shape I go back to the backend engineers so we can reshape it there, and when capacity is tight I write the Kotlin myself.",
    nl: "Bij bol.com ben ik de frontendspecialist in teams die vooral uit backenddevelopers bestaan, en ik behandel het GraphQL-schema als het contract tussen ons. Komt een veld in een onhandige vorm binnen, dan ga ik terug naar de backend engineers zodat we het daar kunnen aanpassen, en als de capaciteit krap is schrijf ik de Kotlin zelf.",
  },
  quote: {
    en: "A resolver should answer the question the frontend asked. It should not be the only place where the answer gets decided.",
    nl: "Een resolver hoort de vraag te beantwoorden die de frontend stelde. Hij hoort niet de enige plek te zijn waar dat antwoord wordt bepaald.",
  },
  whyTitle: {
    en: "A frontend that changes weekly needs a domain that does not",
    nl: "Een frontend die wekelijks verandert, vraagt om een domein dat dat niet doet",
  },
  why1: {
    en: "Frontend work moves at the speed of the market. A pause button appears next to a subscription because a support team counted the phone calls. That screen ships in a sprint. The rule underneath, which subscriptions may pause and what a pause does to the renewal date, will still be the same rule in four years.",
    nl: "Frontendwerk beweegt met de snelheid van de markt. Naast een abonnement verschijnt een pauzeknop omdat een supportteam de telefoontjes heeft geteld. Dat scherm gaat in één sprint live. De regel eronder, welke abonnementen mogen pauzeren en wat een pauze met de verlengdatum doet, is over vier jaar nog dezelfde regel.",
  },
  why2: {
    en: "Hexagonal architecture, also called ports and adapters, gives that rule a home the frontend cannot reach. The rules live in a module with no Spring, no JPA and no GraphQL on its classpath. Everything they need from outside is an interface they wrote themselves. The pay-off arrives when a second channel appears, and a second channel always appears.",
    nl: "Hexagonale architectuur, ook wel ports en adapters, geeft die regel een plek waar de frontend niet bij kan. De regels wonen in een module zonder Spring, zonder JPA en zonder GraphQL op het classpath. Alles wat ze van buiten nodig hebben, is een interface die ze zelf hebben geschreven. Het rendement komt als er een tweede kanaal bij komt, en dat komt er altijd.",
  },
  overkillTitle: {
    en: "Skip the hexagon when the resolver has nothing to decide",
    nl: "Sla de hexagon over als de resolver niets te beslissen heeft",
  },
  overkill1: {
    en: "Plenty of services do not earn this. A read model that joins three tables and returns them as a page of results has no rules to protect. A port in front of that query buys you two files and one extra hop, and it makes the query harder to tune. Spring Data straight into a resolver is the right answer there.",
    nl: "Genoeg services verdienen dit niet. Een leesmodel dat drie tabellen samenvoegt en er een pagina resultaten van maakt, heeft geen regels om te beschermen. Een port voor die query levert je twee bestanden en één extra tussenstap op, en hij maakt de query lastiger te tunen. Spring Data rechtstreeks in een resolver is daar het juiste antwoord.",
  },
  overkill2: {
    en: "Two questions settle it. Can you name a state this thing can be in that no database column describes? And would a wrong answer here cost money or trust? Two yeses mean the rules deserve their own module. Two noes mean you are wrapping a query in ceremony, and the next developer will route around it.",
    nl: "Twee vragen beslissen het. Kun je een toestand noemen waarin dit ding kan verkeren die geen enkele databasekolom beschrijft? En zou een verkeerd antwoord hier geld of vertrouwen kosten? Twee keer ja betekent dat de regels een eigen module verdienen. Twee keer nee betekent dat je een query in ceremonie verpakt, en de volgende developer loopt eromheen.",
  },
  shapeTitle: {
    en: "The domain owns the ports and every arrow points inward",
    nl: "Het domein bezit de ports en elke pijl wijst naar binnen",
  },
  shape1: {
    en: "The picture below has three ways in and three ways out, and the middle knows about none of them. A GraphQL resolver, a controller and a Kafka consumer all call the same use case. That use case calls interfaces, and a repository, a payment client and an outbox writer implement them.",
    nl: "De tekening hieronder heeft drie wegen naar binnen en drie naar buiten, en het midden kent er geen van. Een GraphQL-resolver, een controller en een Kafka-consumer roepen dezelfde use case aan. Die use case roept interfaces aan, en een repository, een betaalclient en een outbox-schrijver implementeren ze.",
  },
  hexagonAria: {
    en: "Diagram: a GraphQL resolver, a Spring MVC controller and a Kafka consumer call the PauseSubscription use case, which applies the domain rules and calls driven ports implemented by a JPA repository, a payment client and an outbox writer",
    nl: "Diagram: een GraphQL-resolver, een Spring MVC-controller en een Kafka-consumer roepen de use case PauseSubscription aan, die de domeinregels toepast en driven ports aanroept die worden geïmplementeerd door een JPA-repository, een betaalclient en een outbox-schrijver",
  },
  hexagonCaption: {
    en: "Three ways in, three ways out, one place where the rules live.",
    nl: "Drie wegen naar binnen, drie naar buiten, één plek waar de regels wonen.",
  },
  shape2: {
    en: "The two words matter, because the two sides behave differently.",
    nl: "De twee woorden doen ertoe, want de twee kanten gedragen zich anders.",
  },
  drivingLabel: { en: "Driving adapters.", nl: "Driving adapters." },
  drivingBody: {
    en: "They start the work. A resolver, a controller, a Kafka consumer, a scheduled job. Each one turns a request into arguments the use case understands.",
    nl: "Zij starten het werk. Een resolver, een controller, een Kafka-consumer, een geplande taak. Elk daarvan maakt van een verzoek argumenten die de use case begrijpt.",
  },
  drivenLabel: { en: "Driven adapters.", nl: "Driven adapters." },
  drivenBody: {
    en: "They get called by the work. A JPA repository, an HTTP client to a payment provider, an outbox writer, a clock. Each one implements an interface the inside declared.",
    nl: "Zij worden door het werk aangeroepen. Een JPA-repository, een HTTP-client naar een betaalprovider, een outbox-schrijver, een klok. Elk daarvan implementeert een interface die de binnenkant heeft opgesteld.",
  },
  portsLabel: { en: "Ports.", nl: "Ports." },
  portsBody: {
    en: "The interfaces themselves, written in the vocabulary of the business. SubscriptionRepository is a port. PostgresSubscriptionDao is an adapter that leaked its name into one.",
    nl: "De interfaces zelf, geschreven in het vocabulaire van de business. SubscriptionRepository is een port. PostgresSubscriptionDao is een adapter die zijn naam in een port heeft laten lekken.",
  },
  shape3: {
    en: "Gradle enforces the direction for you. The application module depends on the domain module, the infrastructure module depends on both, and the domain module depends on nothing. A wrong import then breaks the build instead of surviving a code review.",
    nl: "Gradle dwingt de richting voor je af. De applicatiemodule hangt af van de domeinmodule, de infrastructuurmodule van allebei, en de domeinmodule van niets. Een verkeerde import laat dan de build sneuvelen in plaats van een code review te overleven.",
  },
  domainTitle: {
    en: "The domain module compiles without Spring on the classpath",
    nl: "De domeinmodule compileert zonder Spring op het classpath",
  },
  domain1: {
    en: "Start with the build file, because that is the agreement you defend in every review. The domain module gets the Kotlin plugin and the standard library. No Spring, no Jackson, no persistence annotations.",
    nl: "Begin bij het buildbestand, want dat is de afspraak die je in elke review verdedigt. De domeinmodule krijgt de Kotlin-plugin en de standaardbibliotheek. Geen Spring, geen Jackson, geen persistentie-annotaties.",
  },
  domain2: {
    en: "Now the rules. A subscription is active, paused or cancelled, and each state carries different data. Kotlin writes that down as a sealed hierarchy, so a paused subscription without a resume date cannot be constructed at all.",
    nl: "Dan de regels. Een abonnement is actief, gepauzeerd of opgezegd, en elke toestand draagt andere gegevens. Kotlin schrijft dat op als een sealed hiërarchie, zodat een gepauzeerd abonnement zonder hervatdatum niet eens te maken is.",
  },
  domain3: {
    en: "The pause rule returns an outcome instead of throwing. Four rejections are named types, so the compiler lists them for whoever has to answer them later. A refused pause is not an exception, it is a normal Tuesday, and the type system says so.",
    nl: "De pauzeregel geeft een uitkomst terug in plaats van een exceptie te gooien. Vier afwijzingen zijn benoemde types, dus de compiler somt ze op voor wie ze later moet beantwoorden. Een geweigerde pauze is geen uitzondering, het is een gewone dinsdag, en het typesysteem zegt dat ook.",
  },
  valueClassLabel: { en: "A value class per identifier.", nl: "Een value class per identifier." },
  valueClassBody: {
    en: "SubscriptionId and CustomerId are two types while compiling and two strings while running, so no function takes them in the wrong order.",
    nl: "SubscriptionId en CustomerId zijn tijdens het compileren twee types en tijdens het draaien twee strings, dus geen functie krijgt ze in de verkeerde volgorde.",
  },
  sealedLabel: { en: "Sealed hierarchies for states and outcomes.", nl: "Sealed hiërarchieën voor toestanden en uitkomsten." },
  sealedBody: {
    en: "Add a fifth state and every when in the codebase stops compiling until somebody handles it. That is a review you get for free.",
    nl: "Voeg een vijfde toestand toe en elke when in de codebase compileert niet meer tot iemand hem afhandelt. Dat is een review die je cadeau krijgt.",
  },
  dataClassLabel: { en: "Data classes for equality and copy.", nl: "Data classes voor gelijkheid en copy." },
  dataClassBody: {
    en: "An aggregate that changes through copy stays immutable, and a test compares two subscriptions in one assertion.",
    nl: "Een aggregate dat via copy verandert blijft onveranderlijk, en een test vergelijkt twee abonnementen in één assertion.",
  },
  suspendLabel: { en: "Suspending functions on the ports.", nl: "Suspend-functies op de ports." },
  suspendBody: {
    en: "The domain says the call may take time. It says nothing about whether the adapter uses a thread pool or a reactive client.",
    nl: "Het domein zegt dat de aanroep tijd mag kosten. Het zegt niets over de vraag of de adapter een threadpool of een reactieve client gebruikt.",
  },
  portsTitle: {
    en: "Ports are interfaces the domain writes for itself",
    nl: "Ports zijn interfaces die het domein voor zichzelf schrijft",
  },
  ports1: {
    en: "The application module holds the use cases and the ports they need. The names come from the business, never from the technology behind them. The transaction is a port as well, because when work becomes permanent is a decision of the use case and how that happens is a detail of the adapter.",
    nl: "De applicatiemodule bevat de use cases en de ports die ze nodig hebben. De namen komen uit de business, nooit uit de techniek erachter. De transactie is ook een port, want wanneer werk definitief wordt is een beslissing van de use case en hoe dat gebeurt is een detail van de adapter.",
  },
  ports2: {
    en: "The use case conducts. It loads, it lets the subscription decide, it asks the payment provider to stop the collection, and only then it saves. Every branch ends in a named result, so nothing reaches the resolver as a bare null.",
    nl: "De use case dirigeert. Hij laadt, hij laat het abonnement beslissen, hij vraagt de betaalprovider de incasso te stoppen, en pas daarna slaat hij op. Elke tak eindigt in een benoemd resultaat, dus er bereikt niets de resolver als kale null.",
  },
  ports3: {
    en: "Read that function and you can tell a product owner what happens, in order, without opening a second file. The order is the only rule the use case owns. Everything else belongs to the subscription itself.",
    nl: "Lees die functie en je vertelt een product owner in volgorde wat er gebeurt, zonder een tweede bestand te openen. De volgorde is de enige regel die de use case bezit. Al het andere hoort bij het abonnement zelf.",
  },
  adaptersTitle: {
    en: "Adapters translate at the edge and nowhere else",
    nl: "Adapters vertalen aan de rand en nergens anders",
  },
  adapters1: {
    en: "The persistence adapter holds the JPA entity, and that entity is not the subscription. It is a row with nullable columns and mutable properties, shaped by what Hibernate needs. Every column has a default value, which is how Kotlin hands Hibernate the no-argument constructor it wants.",
    nl: "De persistentie-adapter bevat de JPA-entiteit, en die entiteit is niet het abonnement. Het is een rij met nullable kolommen en muteerbare properties, gevormd naar wat Hibernate nodig heeft. Elke kolom heeft een standaardwaarde, en zo geeft Kotlin aan Hibernate de constructor zonder argumenten die het wil.",
  },
  adapters2: {
    en: "Two extension functions carry the data across the border, and they are the only place that knows both shapes. The port suspends while JPA blocks, and the adapter deliberately stays on the thread it is called on. Spring binds the transaction and the EntityManager to that thread, so a hop to another dispatcher inside the adapter would leave the transaction behind. The transaction runner below owns the choice of dispatcher for the whole use case.",
    nl: "Twee extensiefuncties dragen de gegevens over de grens, en zij zijn de enige plek die beide vormen kent. De port is suspend terwijl JPA blokkeert, en de adapter blijft bewust op de thread waarop hij wordt aangeroepen. Spring bindt de transactie en de EntityManager aan die thread, dus een sprong naar een andere dispatcher binnen de adapter zou de transactie achterlaten. De transactierunner hieronder bepaalt de dispatcher voor de hele use case.",
  },
  adapters3: {
    en: "The resolver does the same work in the other direction. It owns the payload type the schema promises, it maps every rejection to a code the client can switch on, and it lets no domain type reach the wire. Both when expressions are exhaustive, so a fifth rejection breaks the build right here.",
    nl: "De resolver doet hetzelfde werk in de andere richting. Hij bezit het payloadtype dat het schema belooft, hij mapt elke afwijzing naar een code waarop de client kan schakelen, en hij laat geen domeintype op de lijn komen. Beide when-expressies zijn uitputtend, dus een vijfde afwijzing breekt precies hier de build.",
  },
  wiringTitle: {
    en: "One configuration class knows every implementation",
    nl: "Eén configuratieklasse kent elke implementatie",
  },
  wiring1: {
    en: "Somewhere a class has to be bound to an interface. In Spring that place is a configuration class, and it is allowed to know about PostgreSQL, about the payment address and about the clock, because nothing depends on it in return.",
    nl: "Ergens moet een klasse aan een interface worden gekoppeld. In Spring is dat een configuratieklasse, en die mag PostgreSQL kennen, het adres van de betaaldienst en de klok, want niets is op zijn beurt van haar afhankelijk.",
  },
  wiring2: {
    en: "Notice that the use case carries no annotation. It is a plain class with four constructor parameters, and that is why a test builds one in a single line. Spring assembles it here and stays outside the module that matters.",
    nl: "Let op dat de use case geen enkele annotatie draagt. Het is een gewone klasse met vier constructorparameters, en daarom bouwt een test er in één regel een. Spring zet hem hier in elkaar en blijft buiten de module die ertoe doet.",
  },
  ruleTitle: {
    en: "A rule of thumb for writing a port",
    nl: "Een vuistregel voor het schrijven van een port",
  },
  ruleBody: {
    en: "Write the port from the caller's side, not from the database's side. Give it the one function the use case needs, in the words the use case already uses. A repository with fourteen finder methods is a data access object that borrowed the name.",
    nl: "Schrijf de port vanuit de aanroeper, niet vanuit de database. Geef hem de ene functie die de use case nodig heeft, in de woorden die de use case al gebruikt. Een repository met veertien findmethodes is een data access object dat de naam heeft geleend.",
  },
  fakesTitle: {
    en: "Fakes keep the use case tests in milliseconds",
    nl: "Fakes houden de use-casetests in milliseconden",
  },
  fakes1: {
    en: "A use case with four ports and no framework is the cheapest thing in the codebase to test. You need no mocking library. Three small classes give you a map, a recorder and a transaction that runs the block directly, and a lambda gives you the clock.",
    nl: "Een use case met vier ports en zonder framework is het goedkoopste in de codebase om te testen. Je hebt geen mocking-library nodig. Drie kleine klassen geven je een map, een recorder en een transactie die het blok direct uitvoert, en een lambda geeft je de klok.",
  },
  fakes2: {
    en: "Because Clock is a fun interface, the last constructor argument is a lambda returning a fixed date. The runTest builder from kotlinx-coroutines-test drives the suspending calls without a real dispatcher, so both tests finish before a container would have started.",
    nl: "Omdat Clock een fun interface is, is het laatste constructorargument een lambda die een vaste datum teruggeeft. De runTest-builder uit kotlinx-coroutines-test draait de suspend-aanroepen zonder echte dispatcher, dus beide tests zijn klaar voordat een container zou zijn opgestart.",
  },
  fakes3: {
    en: "The second test is the valuable one. It proves that a refusal from the payment provider leaves nothing saved, which is the kind of bug that hides for months behind a green screen.",
    nl: "De tweede test is de waardevolle. Hij bewijst dat een weigering van de betaalprovider niets opgeslagen achterlaat, en dat soort fout blijft maanden verborgen achter een groen scherm.",
  },
  containerTitle: {
    en: "Testcontainers proves the mapping, not the rules",
    nl: "Testcontainers bewijst de mapping, niet de regels",
  },
  container1: {
    en: "The use case tests say nothing about persistence. A wrong column type, a missing status value or a null that the mapping quietly turns into a cancelled subscription passes every fake and fails in production. So the adapter gets a test against the engine it will really run on.",
    nl: "De use-casetests zeggen niets over persistentie. Een verkeerd kolomtype, een ontbrekende statuswaarde of een null die de mapping stilletjes tot een opgezegd abonnement maakt, komt langs elke fake en sneuvelt in productie. Daarom krijgt de adapter een test tegen de engine waarop hij echt gaat draaien.",
  },
  container2: {
    en: "Testcontainers starts the PostgreSQL version the platform runs and hands Spring the connection details at startup. The container class is written with a self-referential generic, so in Kotlin you instantiate it with Nothing as the type argument.",
    nl: "Testcontainers start de PostgreSQL-versie die het platform draait en geeft Spring bij het opstarten de connectiegegevens door. De containerklasse is met een zelfverwijzend generiek type geschreven, dus in Kotlin instantieer je hem met Nothing als typeargument.",
  },
  container3: {
    en: "Some tests only cost time. A data class needs no test for copy. A bean definition needs none either, because the application refuses to start when a bean is missing. And the resolver needs no test that repeats a mapping table you can read in ten seconds.",
    nl: "Sommige tests kosten alleen tijd. Een data class heeft geen test voor copy nodig. Een beandefinitie ook niet, want de applicatie start niet als een bean ontbreekt. En de resolver heeft geen test nodig die een mappingtabel herhaalt die je in tien seconden leest.",
  },
  boundariesTitle: {
    en: "The four places where a hexagon usually leaks",
    nl: "De vier plekken waar een hexagon meestal lekt",
  },
  boundaries1: {
    en: "The drawing is easy. The discipline lives in four familiar places, and every one of them fails quietly.",
    nl: "De tekening is makkelijk. De discipline zit op vier bekende plekken, en elk daarvan gaat stilletjes mis.",
  },
  moneyPath: {
    en: "One sequence deserves its own paragraph, because it costs money. The use case asks the payment provider to suspend collection and then saves the paused subscription, both inside the transaction. The test covers the safe direction, a refused provider that saves nothing. The other direction is the provider that accepts while the commit fails afterwards, and now collection has stopped for a subscription the database still calls active. That is what the outbox adapter in the diagram is for. The use case records the intent to suspend in the same transaction as the state change, and a relay calls the provider after the commit and retries until it succeeds. The provider call moves out of the transaction, the intent never gets lost, and the port on the use case side stays exactly as it is.",
    nl: "Eén volgorde verdient een eigen alinea, omdat ze geld kost. De use case vraagt de betaalprovider om de incasso te pauzeren en slaat daarna het gepauzeerde abonnement op, allebei binnen de transactie. De test dekt de veilige richting, een provider die weigert waarbij niets wordt opgeslagen. De andere richting is de provider die akkoord gaat terwijl de commit daarna mislukt, en dan is de incasso gestopt voor een abonnement dat de database nog actief noemt. Daar is de outbox-adapter in de tekening voor. De use case legt de intentie om te pauzeren vast in dezelfde transactie als de statuswijziging, en een relay roept de provider na de commit aan en probeert het opnieuw tot het lukt. De provideraanroep verhuist uit de transactie, de intentie raakt nooit kwijt, en de port aan de kant van de use case blijft precies zoals hij is.",
  },
  entityLabel: { en: "JPA entities.", nl: "JPA-entiteiten." },
  entityBody: {
    en: "The strongest temptation is to annotate the aggregate and skip the mapping. Then Hibernate asks for a no-argument constructor and mutable properties, and your sealed states become nullable columns on a class you no longer control.",
    nl: "De sterkste verleiding is het aggregate annoteren en de mapping overslaan. Dan vraagt Hibernate om een constructor zonder argumenten en om muteerbare properties, en worden je sealed toestanden nullable kolommen op een klasse die je niet meer bepaalt.",
  },
  transferLabel: { en: "Transfer objects.", nl: "Transfer objects." },
  transferBody: {
    en: "A payload belongs to the adapter that speaks that protocol and it never travels inward. The moment a GraphQL input type appears in a use case signature, the schema owns your rules.",
    nl: "Een payload hoort bij de adapter die dat protocol spreekt en reist nooit naar binnen. Zodra een GraphQL-inputtype in een use-casesignatuur staat, bezit het schema jouw regels.",
  },
  mappingLabel: { en: "Mapping.", nl: "Mapping." },
  mappingBody: {
    en: "Do it by hand inside the adapter. A when over the sealed state is four lines, and a reviewer sees at once which column each state fills. A mapper based on reflection turns that into a surprise at runtime.",
    nl: "Doe het met de hand in de adapter. Een when over de sealed toestand is vier regels, en een reviewer ziet meteen welke kolom elke toestand vult. Een mapper op basis van reflectie maakt daar een verrassing tijdens het draaien van.",
  },
  transactionLabel: { en: "Transactions.", nl: "Transacties." },
  transactionBody: {
    en: "A transaction spans a use case, not one repository call. Put it behind a port and the use case decides the boundary while the adapter decides whether that means a template, a suspending bridge or an outbox row.",
    nl: "Een transactie omspant een use case, niet één repository-aanroep. Zet hem achter een port, dan bepaalt de use case de grens terwijl de adapter bepaalt of dat een template, een suspend-brug of een outboxrij betekent.",
  },
  boundaries2: {
    en: "The four places above cover a subscription that pauses, where a refused payment safely stops the save from happening. A subscription that renews and charges money runs the opposite risk, the one that costs money when it goes wrong. The payment provider accepts the charge, and the local commit fails afterwards, so nothing in the system knows the customer already paid. The fix is to stop calling the payment provider from inside the use case. The use case writes the charge as an intent, in the same transaction as the domain change, which is the outbox row the transaction boundary above already allows. A relay reads that row once the transaction is durable and performs the charge from there. The outbox writer in the diagram is that relay, and because only the relay ever touches the network, the two writes cannot disagree with each other.",
    nl: "De vier plekken hierboven gaan over een abonnement dat pauzeert, waar een geweigerde betaling het opslaan meteen veilig stopt. Een abonnement dat verlengt en geld incasseert loopt het omgekeerde risico, het risico dat geld kost als het misgaat. De betaalprovider accepteert de incasso, en de lokale commit mislukt daarna, waardoor niets in het systeem weet dat de klant al heeft betaald. De oplossing is te stoppen met de betaalprovider vanuit de use case aan te roepen. De use case legt de incasso vast als intentie, in dezelfde transactie als de domeinwijziging, wat de outboxrij is die de transactiegrens hierboven al toestaat. Een relay leest die rij zodra de transactie duurzaam is en voert de incasso van daaruit uit. De outbox-schrijver in de tekening is die relay, en omdat alleen de relay het netwerk raakt, kunnen de twee schrijfacties nooit met elkaar in tegenspraak zijn.",
  },
  schemaTitle: {
    en: "The schema is the contract, so reshaping a field stays cheap",
    nl: "Het schema is het contract, dus een veld anders vormgeven blijft goedkoop",
  },
  schema1: {
    en: "This is where the frontend and the hexagon meet. In my teams the GraphQL schema is the contract between frontend and backend, and I treat it that way. When a field arrives in a shape the screen has to unpack, I go back to the backend engineers and we change the field, because solving it in the component hides the problem where the next person will not look.",
    nl: "Hier komen de frontend en de hexagon samen. In mijn teams is het GraphQL-schema het contract tussen frontend en backend, en zo behandel ik het ook. Komt een veld binnen in een vorm die het scherm moet uitpakken, dan ga ik terug naar de backend engineers en passen we het veld aan, want het in de component oplossen verstopt het probleem op een plek waar de volgende persoon niet kijkt.",
  },
  schema2: {
    en: "A hexagonal back end makes that conversation cheap. Reshaping a field is a change in the resolver and its payload type. The rules stay where they were, the tests stay green, and the review covers one file. Without that separation the same request touches the class that also decides who may pause, and a layout question becomes a risk nobody wants to take on a Thursday.",
    nl: "Een hexagonale backend maakt dat gesprek goedkoop. Een veld anders vormgeven is een wijziging in de resolver en zijn payloadtype. De regels blijven waar ze waren, de tests blijven groen, en de review beslaat één bestand. Zonder die scheiding raakt hetzelfde verzoek de klasse die ook bepaalt wie mag pauzeren, en wordt een opmaakvraag een risico dat niemand op een donderdag wil nemen.",
  },
  migrationTitle: {
    en: "Add the first port to a service that already ships",
    nl: "Voeg de eerste port toe aan een service die al live staat",
  },
  migration1: {
    en: "You do not need a rewrite and you should not ask for one. Pick the endpoint people are most careful around and take five steps, each of them a commit that can go live on its own.",
    nl: "Je hebt geen herbouw nodig en je moet er ook niet om vragen. Kies het endpoint waar mensen het voorzichtigst mee zijn en zet vijf stappen, elk een commit die op zichzelf live kan.",
  },
  step1: {
    en: "Create a domain module with no Spring dependency. Move one class into it and let the compiler show you everything that came along for the ride.",
    nl: "Maak een domeinmodule zonder Spring-afhankelijkheid. Verplaats er één klasse naartoe en laat de compiler zien wat er allemaal meeliftte.",
  },
  step2: {
    en: "Write the port you wish the old code had, with the one function the use case needs and none of the fourteen the current repository exposes.",
    nl: "Schrijf de port die je de oude code had gegund, met de ene functie die de use case nodig heeft en geen van de veertien die de huidige repository aanbiedt.",
  },
  step3: {
    en: "Implement that port with the existing service inside it. The first adapter is usually a wrapper around what you already have, and that is fine, because a wrapper is one file to delete later.",
    nl: "Implementeer die port met de bestaande service erin. De eerste adapter is meestal een omhulsel om wat je al hebt, en dat is prima, want een omhulsel is later één bestand om te verwijderen.",
  },
  step4: {
    en: "Move the decisions out of the service and into the aggregate, with the use case tests as the safety net. This step carries real behaviour risk, so it goes behind a flag when the endpoint is busy.",
    nl: "Haal de beslissingen uit de service en zet ze in het aggregate, met de use-casetests als vangnet. Deze stap draagt echt gedragsrisico, dus die gaat achter een vlag als het endpoint druk is.",
  },
  step5: {
    en: "Point the resolver at the use case, and delete the old path once the flag has been fully open for a while.",
    nl: "Wijs de resolver naar de use case, en verwijder het oude pad zodra de vlag een tijd helemaal open staat.",
  },
  migration2: {
    en: "Every step compiles and every step can be reverted with one commit. After three or four use cases the shape becomes obvious, and new work lands in the right module without anyone drawing the diagram again.",
    nl: "Elke stap compileert en elke stap is met één commit terug te draaien. Na drie of vier use cases wordt de vorm vanzelfsprekend, en landt nieuw werk in de juiste module zonder dat iemand de tekening opnieuw maakt.",
  },
  closingTitle: {
    en: "A data-driven page and a framework-free domain are one habit",
    nl: "Een datagedreven pagina en een domein zonder framework zijn één gewoonte",
  },
  closing1: {
    en: "I spend most of my week in React and Angular, and the rule I apply there is the rule above. A component receives what it needs and reaches the outside world through a boundary it does not own. A Kotlin domain keeps its rules together the same way, and it lets me change a field for the frontend without touching the reason that field exists.",
    nl: "Ik zit het grootste deel van mijn week in React en Angular, en de regel die ik daar toepas is de regel hierboven. Een component krijgt wat hij nodig heeft en bereikt de buitenwereld via een grens die hij niet bezit. Een Kotlin-domein houdt zijn regels op dezelfde manier bij elkaar, en het laat me een veld voor de frontend veranderen zonder de reden aan te raken waarom dat veld bestaat.",
  },
  closing2: {
    en: "Two sides of the same discipline. Decide once, in one place, and let everything around it translate.",
    nl: "Twee kanten van dezelfde discipline. Beslis één keer, op één plek, en laat alles eromheen vertalen.",
  },
  nodeResolver: { en: "GraphQL resolver", nl: "GraphQL-resolver" },
  nodeController: { en: "Spring MVC controller", nl: "Spring MVC-controller" },
  nodeConsumer: { en: "Kafka consumer", nl: "Kafka-consumer" },
  nodeUseCaseSub: { en: "use case, owns the ports", nl: "use case, bezit de ports" },
  nodeDomain: { en: "Domain", nl: "Domein" },
  nodeDrivenPorts: { en: "Driven ports", nl: "Driven ports" },
  nodeRepository: { en: "JPA repository", nl: "JPA-repository" },
  nodePayment: { en: "Payment client", nl: "Betaalclient" },
  nodePaymentSub: { en: "another service", nl: "andere service" },
  nodeOutbox: { en: "Outbox writer", nl: "Outbox-schrijver" },
  nodeOutboxSub: { en: "events for later", nl: "events voor later" },
  edgeMessage: { en: "message", nl: "bericht" },
  edgeApplies: { en: "applies rules", nl: "past regels toe" },
  edgeCalls: { en: "calls", nl: "roept aan" },
  edgeImplements: { en: "implemented by", nl: "geïmplementeerd door" },
} as const;
