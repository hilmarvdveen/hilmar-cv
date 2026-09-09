import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, Lead, UL, OL, LI, Strong, Quote, Divider, A } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FlowDiagram } from "./FlowDiagram";
import { Contents } from "./Contents";
import { PostRepository } from "./PostRepository";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "apollo-federation-in-production-by-building-one",
  category: "architecture",
  track: "backend",
  publishedDate: "2026-09-09",
  readingTimeMin: 67,
  title: {
    en: "Apollo Federation, explained by building a supergraph",
    nl: "Apollo Federation, uitgelegd door een supergraph te bouwen",
  },
  description: {
    en: "Five subgraphs, one composed supergraph, and the guarantees under it: entity keys, a saga, an outbox, idempotency, retries, a circuit breaker and one trace.",
    nl: "Vijf subgraphs, één samengestelde supergraph en de garanties eronder: entity-keys, een saga, een outbox, idempotentie, een circuit breaker en één trace.",
  },
  excerpt: {
    en: "One GraphQL schema in front of five services that different teams own. This walks through a federated graph I built end to end: the entity keys, the composition step, the contract check that blocks a merge, and the nine guarantees underneath, each with the file it lives in and the test that proves it.",
    nl: "Eén GraphQL-schema voor vijf services die verschillende teams bezitten. Dit loopt door een federated graph die ik van begin tot eind bouwde: de entity-keys, de compositiestap, de contractcheck die een merge tegenhoudt, en de negen garanties eronder, elk met het bestand waar hij woont en de test die hem bewijst.",
  },
  keywords: [
    "apollo federation subgraph supergraph composition",
    "entity key reference resolver dataloader batching",
    "transactional outbox at least once delivery dead letter",
    "idempotency key place order double click",
    "circuit breaker degraded cart chaos test",
    "retry backoff jitter retry budget storm",
    "graphql query plan depth and cost limits",
    "opentelemetry one trace across gateway and subgraphs",
  ],
};

function buildGraphShape(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("client", copy.nodeClient[locale], { x: 470, y: 0 }, { tone: "blue", subtitle: copy.nodeClientSub[locale], direction: "TB", width: 260 }),
    flowNode("gateway", copy.nodeGateway[locale], { x: 470, y: 130 }, { tone: "emerald", subtitle: copy.nodeGatewaySub[locale], direction: "TB", width: 260 }),
    flowNode("catalogue", "catalogue", { x: 0, y: 290 }, { tone: "slate", subtitle: copy.nodeCatalogueSub[locale], direction: "TB", width: 190 }),
    flowNode("cart", "cart", { x: 220, y: 290 }, { tone: "slate", subtitle: copy.nodeCartSub[locale], direction: "TB", width: 190 }),
    flowNode("promotions", "promotions", { x: 440, y: 290 }, { tone: "slate", subtitle: copy.nodePromotionsSub[locale], direction: "TB", width: 190 }),
    flowNode("ordering", "ordering", { x: 660, y: 290 }, { tone: "slate", subtitle: copy.nodeOrderingSub[locale], direction: "TB", width: 190 }),
    flowNode("accounts", "accounts", { x: 880, y: 290 }, { tone: "slate", subtitle: copy.nodeAccountsSub[locale], direction: "TB", width: 190 }),
    flowNode("productEntity", "Product", { x: 110, y: 470 }, { tone: "violet", subtitle: copy.nodeProductSub[locale], direction: "TB", width: 320 }),
    flowNode("cartEntity", "Cart", { x: 660, y: 470 }, { tone: "amber", subtitle: copy.nodeCartEntitySub[locale], direction: "TB", width: 320 }),
  ];
  const edges = [
    flowEdge("client", "gateway", { label: copy.edgeOneQuery[locale] }),
    flowEdge("gateway", "catalogue"),
    flowEdge("gateway", "cart"),
    flowEdge("gateway", "promotions"),
    flowEdge("gateway", "ordering"),
    flowEdge("gateway", "accounts"),
    flowEdge("catalogue", "productEntity", { dashed: true, label: copy.edgeOwns[locale] }),
    flowEdge("cart", "productEntity", { dashed: true, label: copy.edgeRefers[locale] }),
    flowEdge("ordering", "productEntity", { dashed: true, label: copy.edgeRefers[locale] }),
    flowEdge("accounts", "productEntity", { dashed: true, label: copy.edgeWishlist[locale] }),
    flowEdge("cart", "cartEntity", { dashed: true, label: copy.edgeOwns[locale] }),
    flowEdge("promotions", "cartEntity", { dashed: true, label: "@requires" }),
    flowEdge("ordering", "cartEntity", { dashed: true, label: copy.edgeRefers[locale] }),
  ];
  return { nodes, edges };
}

function buildPlaceOrder(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("key", copy.nodeKey[locale], { x: 260, y: 0 }, { tone: "blue", subtitle: copy.nodeKeySub[locale], direction: "TB", width: 360 }),
    flowNode("read", copy.nodeRead[locale], { x: 260, y: 140 }, { tone: "slate", subtitle: copy.nodeReadSub[locale], direction: "TB", width: 360 }),
    flowNode("reserve", copy.nodeReserve[locale], { x: 260, y: 280 }, { tone: "violet", subtitle: copy.nodeReserveSub[locale], direction: "TB", width: 360 }),
    flowNode("commit", copy.nodeCommit[locale], { x: 260, y: 420 }, { tone: "emerald", subtitle: copy.nodeCommitSub[locale], direction: "TB", width: 360 }),
    flowNode("release", copy.nodeRelease[locale], { x: 700, y: 420 }, { tone: "rose", subtitle: copy.nodeReleaseSub[locale], direction: "TB", width: 320 }),
    flowNode("nudge", copy.nodeNudge[locale], { x: 260, y: 560 }, { tone: "slate", subtitle: copy.nodeNudgeSub[locale], direction: "TB", width: 360 }),
    flowNode("consumers", copy.nodeConsumers[locale], { x: 260, y: 700 }, { tone: "slate", subtitle: copy.nodeConsumersSub[locale], direction: "TB", width: 360 }),
    flowNode("guard", copy.nodeGuard[locale], { x: 700, y: 700 }, { tone: "amber", subtitle: copy.nodeGuardSub[locale], direction: "TB", width: 320 }),
  ];
  const edges = [
    flowEdge("key", "read", { label: copy.edgeNoStoredOrder[locale] }),
    flowEdge("read", "reserve"),
    flowEdge("reserve", "commit", { label: copy.edgeReserved[locale] }),
    flowEdge("commit", "release", { dashed: true, label: copy.edgeOnFailure[locale] }),
    flowEdge("commit", "nudge", { label: copy.edgeCommitted[locale] }),
    flowEdge("nudge", "consumers"),
    flowEdge("consumers", "guard", { dashed: true, label: copy.edgeAtLeastOnce[locale] }),
  ];
  return { nodes, edges };
}

type SubgraphRow = {
  name: string;
  owns: Record<Locale, string>;
  references: Record<Locale, string>;
  publishes: string;
  consumes: string;
};

const SUBGRAPH_ROWS: SubgraphRow[] = [
  {
    name: "catalogue",
    owns: { en: "Product, Category, stock", nl: "Product, Category, voorraad" },
    references: { en: "none", nl: "geen" },
    publishes: "ProductChanged, StockReserved, StockReleased",
    consumes: "OrderPlaced",
  },
  {
    name: "cart",
    owns: { en: "Cart, CartLine, the anonymous cart", nl: "Cart, CartLine, het anonieme mandje" },
    references: { en: "Product by key", nl: "Product via key" },
    publishes: "none",
    consumes: "ProductChanged",
  },
  {
    name: "promotions",
    owns: { en: "PromotionCode, the rules, Cart.promotion", nl: "PromotionCode, de regels, Cart.promotion" },
    references: { en: "Cart by key", nl: "Cart via key" },
    publishes: "none",
    consumes: "OrderPlaced",
  },
  {
    name: "ordering",
    owns: { en: "Order, OrderLine, placeOrder, the outbox", nl: "Order, OrderLine, placeOrder, de outbox" },
    references: { en: "Cart, Product, Customer by key", nl: "Cart, Product, Customer via key" },
    publishes: "OrderPlaced",
    consumes: "StockReserved, StockReleased",
  },
  {
    name: "accounts",
    owns: { en: "Customer, Session, the wishlist, the tokens", nl: "Customer, Session, de wenslijst, de tokens" },
    references: { en: "Product by key", nl: "Product via key" },
    publishes: "CustomerRegistered",
    consumes: "none",
  },
];

function SubgraphTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: { name: string; owns: string; references: string; publishes: string; consumes: string }[];
}) {
  return (
    <div className="my-8 overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[860px] border-collapse text-left text-sm">
        <caption className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm text-gray-600">
          {caption}
        </caption>
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {headers.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 font-semibold text-textMain">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-gray-200 last:border-b-0">
              <th scope="row" className="px-4 py-3 align-top font-mono font-semibold text-gray-800">
                {row.name}
              </th>
              <td className="px-4 py-3 align-top text-gray-700">{row.owns}</td>
              <td className="px-4 py-3 align-top text-gray-700">{row.references}</td>
              <td className="px-4 py-3 align-top font-mono text-gray-700">{row.publishes}</td>
              <td className="px-4 py-3 align-top font-mono text-gray-700">{row.consumes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type GuaranteeRow = {
  topic: Record<Locale, string>;
  place: string;
  proof: string;
};

const GUARANTEE_ROWS: GuaranteeRow[] = [
  {
    topic: { en: "Cache invalidation", nl: "Cache-invalidatie" },
    place: "catalogue/.../cachedProductRepository.ts",
    proof: "catalogue/tests/cachedProductRepository.test.ts",
  },
  {
    topic: { en: "The stock reservation saga", nl: "De saga rond de voorraadreservering" },
    place: "ordering/.../stockReservationSaga.ts",
    proof: "ordering/tests/stockReservationSaga.test.ts",
  },
  {
    topic: { en: "Request driven against event driven", nl: "Request-driven tegenover event-driven" },
    place: "promotions/.../promotionInteractions.ts",
    proof: "promotions/tests/promotionInteractions.test.ts",
  },
  {
    topic: { en: "Idempotency keys", nl: "Idempotentiesleutels" },
    place: "ordering/.../idempotentPlaceOrder.ts",
    proof: "ordering/tests/idempotentPlaceOrder.test.ts",
  },
  {
    topic: { en: "Retries with backoff, jitter and a budget", nl: "Retries met backoff, jitter en een budget" },
    place: "shared/src/http/retryPolicy.ts",
    proof: "shared/tests/retryPolicy.test.ts",
  },
  {
    topic: { en: "The outbox with at least once delivery", nl: "De outbox met at-least-once-bezorging" },
    place: "ordering/.../outboxPublisher.ts",
    proof: "ordering/tests/outboxPublisher.test.ts",
  },
  {
    topic: { en: "The circuit breaker and the degraded cart", nl: "De circuit breaker en het uitgeklede mandje" },
    place: "cart/.../degradedCatalogueReader.ts",
    proof: "router/tests/graph.test.ts",
  },
  {
    topic: { en: "DataLoader and query plans", nl: "DataLoader en queryplannen" },
    place: "router/src/queryPlanPlugin.ts",
    proof: "router/tests/graph.test.ts",
  },
  {
    topic: { en: "One trace per request", nl: "Eén trace per verzoek" },
    place: "shared/src/telemetry/requestTracing.ts",
    proof: "router/tests/graph.test.ts",
  },
];

function GuaranteeTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: { topic: string; place: string; proof: string }[];
}) {
  return (
    <div className="my-8 overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <caption className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm text-gray-600">
          {caption}
        </caption>
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {headers.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 font-semibold text-textMain">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.topic} className="border-b border-gray-200 last:border-b-0">
              <th scope="row" className="px-4 py-3 align-top font-semibold text-gray-800">
                {row.topic}
              </th>
              <td className="px-4 py-3 align-top font-mono text-gray-700">{row.place}</td>
              <td className="px-4 py-3 align-top font-mono text-gray-700">{row.proof}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  const graphShape = buildGraphShape(locale);
  const placeOrder = buildPlaceOrder(locale);
  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <P>{copy.intro1[locale]}</P>
      <P>{copy.intro2[locale]}</P>
      <P>{copy.intro3[locale]}</P>
      <P>{copy.versionNote[locale]}</P>
      <P>{copy.graphqlVersionNote[locale]}</P>
      <Quote>{copy.quote[locale]}</Quote>
      <PostRepository locale={locale} folders={["backends/node"]} />
      <Contents
        label={copy.contentsLabel[locale]}
        items={[
          copy.ownersTitle[locale],
          copy.entitiesTitle[locale],
          copy.compositionTitle[locale],
          copy.migrationTitle[locale],
          copy.typesTitle[locale],
          copy.authenticationTitle[locale],
          copy.cachingTitle[locale],
          copy.sagaTitle[locale],
          copy.interactionsTitle[locale],
          copy.idempotencyTitle[locale],
          copy.retriesTitle[locale],
          copy.outboxTitle[locale],
          copy.resilienceTitle[locale],
          copy.performanceTitle[locale],
          copy.tracingTitle[locale],
          copy.continuousTitle[locale],
          copy.costTitle[locale],
          copy.closingTitle[locale],
        ]}
      />

      <H2>{copy.ownersTitle[locale]}</H2>
      <P>{copy.owners1[locale]}</P>
      <P>{copy.owners2[locale]}</P>
      <UL>
        <LI><Strong>{copy.shapeOneLabel[locale]}</Strong> {copy.shapeOneBody[locale]}</LI>
        <LI><Strong>{copy.shapeTwoLabel[locale]}</Strong> {copy.shapeTwoBody[locale]}</LI>
        <LI><Strong>{copy.shapeThreeLabel[locale]}</Strong> {copy.shapeThreeBody[locale]}</LI>
      </UL>
      <P>{copy.owners3[locale]}</P>
      <SubgraphTable
        caption={copy.subgraphTableCaption[locale]}
        headers={[
          copy.headerSubgraph[locale],
          copy.headerOwns[locale],
          copy.headerReferences[locale],
          copy.headerPublishes[locale],
          copy.headerConsumes[locale],
        ]}
        rows={SUBGRAPH_ROWS.map((row) => ({
          name: row.name,
          owns: row.owns[locale],
          references: row.references[locale],
          publishes: row.publishes,
          consumes: row.consumes,
        }))}
      />
      <P>{copy.owners4[locale]}</P>
      <FlowDiagram
        nodes={graphShape.nodes}
        edges={graphShape.edges}
        height={620}
        ariaLabel={copy.graphAria[locale]}
        caption={copy.graphCaption[locale]}
      />

      <H2>{copy.entitiesTitle[locale]}</H2>
      <P>{copy.entities1[locale]}</P>
      <CodeBlock lang="graphql" filename="subgraphs/catalogue/schema.graphql" code={CATALOGUE_SCHEMA_CODE} />
      <P>{copy.entities2[locale]}</P>
      <CodeBlock lang="graphql" filename="subgraphs/cart/schema.graphql" code={CART_SCHEMA_CODE} />
      <P>{copy.entities3[locale]}</P>
      <P>{copy.entities4[locale]}</P>
      <CodeBlock lang="graphql" filename="subgraphs/promotions/schema.graphql" code={PROMOTIONS_SCHEMA_CODE} />
      <P>{copy.entities4b[locale]}</P>
      <CodeBlock lang="graphql" filename="subgraphs/promotions/schema.graphql" code={PROMOTIONS_MUTATION_CODE} />
      <Callout variant="info" title={copy.requiresCalloutTitle[locale]}>
        {copy.requiresCalloutBody[locale]}
      </Callout>
      <P>{copy.entities5[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/catalogue/src/adapters/graphql/loaders.ts" code={CATALOGUE_LOADERS_CODE} />
      <CodeBlock lang="ts" filename="subgraphs/catalogue/src/adapters/graphql/resolvers.ts" code={CATALOGUE_REFERENCE_CODE} />
      <P>{copy.entities6[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/cart/src/adapters/catalogue/entityCatalogueReader.ts" code={ENTITY_CATALOGUE_READER_CODE} />
      <P>{copy.entities7[locale]}</P>
      <CodeBlock lang="json" filename="POST http://localhost:4100/graphql" code={ADD_TO_CART_ANSWER_CODE} />
      <P>{copy.entities8[locale]}</P>

      <Divider />

      <H2>{copy.compositionTitle[locale]}</H2>
      <P>{copy.composition1[locale]}</P>
      <CodeBlock lang="js" filename="tools/compose.mjs" code={COMPOSE_CODE} />
      <P>{copy.composition2[locale]}</P>
      <CodeBlock lang="graphql" filename="router/supergraph.graphql" code={SUPERGRAPH_CART_CODE} />
      <P>{copy.composition3[locale]}</P>
      <CodeBlock lang="js" filename="tools/contract-diff.mjs" code={CONTRACT_DIFF_CODE} />
      <P>{copy.composition3b[locale]}</P>
      <CodeBlock lang="js" filename="tools/contract-diff.mjs" code={CONTRACT_DIFF_TAIL_CODE} />
      <CodeBlock lang="text" filename="npm run contract-diff" code={CONTRACT_DIFF_OUTPUT_CODE} />
      <P>{copy.composition4[locale]}</P>
      <CodeBlock lang="ts" filename="router/src/host/main.ts" code={GATEWAY_MAIN_CODE} />
      <P>{copy.composition5[locale]}</P>
      <CodeBlock lang="ts" filename="router/src/subgraphDataSource.ts" code={SUBGRAPH_DATA_SOURCE_CODE} />
      <P>{copy.composition6[locale]}</P>
      <CodeBlock lang="yaml" filename="router/router.yaml" code={ROUTER_YAML_CODE} />
      <P>{copy.composition7[locale]}</P>
      <Callout variant="warning" title={copy.routerCalloutTitle[locale]}>
        {copy.routerCalloutBody[locale]}
      </Callout>
      <P>{copy.composition8[locale]}</P>

      <H2>{copy.migrationTitle[locale]}</H2>
      <P>{copy.migration1[locale]}</P>
      <OL>
        <LI>{copy.migrationStep1[locale]}</LI>
        <LI>{copy.migrationStep2[locale]}</LI>
        <LI>{copy.migrationStep3[locale]}</LI>
        <LI>{copy.migrationStep4[locale]}</LI>
        <LI>{copy.migrationStep5[locale]}</LI>
      </OL>
      <P>{copy.migration2[locale]}</P>
      <P>{copy.migration3[locale]}</P>
      <CodeBlock lang="http" filename="the three edges outside the graph" code={HTTP_EDGES_CODE} />
      <P>{copy.migration4[locale]}</P>

      <Divider />

      <H2>{copy.typesTitle[locale]}</H2>
      <P>{copy.types1[locale]}</P>
      <CodeBlock lang="js" filename="tools/generate-resolver-types.mjs" code={CODEGEN_CODE} />
      <P>{copy.types1b[locale]}</P>
      <CodeBlock lang="js" filename="tools/generate-resolver-types.mjs" code={CODEGEN_TAIL_CODE} />
      <P>{copy.types2[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/catalogue/src/adapters/graphql/resolvers.ts" code={TYPED_RESOLVERS_CODE} />
      <P>{copy.types3[locale]}</P>
      <P>{copy.types4[locale]}</P>

      <H2>{copy.authenticationTitle[locale]}</H2>
      <P>{copy.authentication1[locale]}</P>
      <CodeBlock lang="ts" filename="shared/src/security/accessToken.ts" code={ACCESS_TOKEN_CODE} />
      <P>{copy.authentication2[locale]}</P>
      <CodeBlock lang="ts" filename="shared/src/security/sessionChecker.ts" code={SESSION_CHECKER_CODE} />
      <P>{copy.authentication3[locale]}</P>
      <CodeBlock lang="ts" filename="shared/src/security/originCheck.ts" code={ORIGIN_CHECK_CODE} />
      <CodeBlock lang="ts" filename="shared/src/graphql/originCheckPlugin.ts" code={ORIGIN_PLUGIN_CODE} />
      <CodeBlock lang="json" filename="a mutation with no Origin header" code={ORIGIN_REFUSAL_CODE} />
      <P>
        {copy.authentication4Before[locale]}
        <A href={`/${locale}/blog/sessions-and-jwt-one-design-built-seven-times`}>
          {copy.sessionsArticleLink[locale]}
        </A>
        {copy.authentication4After[locale]}
      </P>

      <Divider />

      <H2>{copy.cachingTitle[locale]}</H2>
      <P>{copy.caching1[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/catalogue/src/adapters/persistence/cachedProductRepository.ts" code={CACHED_REPOSITORY_CODE} />
      <P>{copy.caching2[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/catalogue/src/host/main.ts" code={CATALOGUE_WIRING_CODE} />
      <P>{copy.caching3[locale]}</P>
      <P>{copy.caching4[locale]}</P>

      <H2>{copy.sagaTitle[locale]}</H2>
      <P>{copy.saga1[locale]}</P>
      <OL>
        <LI>{copy.sagaStep1[locale]}</LI>
        <LI>{copy.sagaStep2[locale]}</LI>
        <LI>{copy.sagaStep3[locale]}</LI>
        <LI>{copy.sagaStep4[locale]}</LI>
        <LI>{copy.sagaStep5[locale]}</LI>
        <LI>{copy.sagaStep6[locale]}</LI>
        <LI>{copy.sagaStep7[locale]}</LI>
        <LI>{copy.sagaStep8[locale]}</LI>
      </OL>
      <P>{copy.saga2[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/ordering/src/application/stockReservationSaga.ts" code={SAGA_CODE} />
      <P>{copy.saga3[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/ordering/src/application/placeOrder.ts" code={PLACE_ORDER_CODE} />
      <P>{copy.saga4[locale]}</P>
      <FlowDiagram
        nodes={placeOrder.nodes}
        edges={placeOrder.edges}
        height={800}
        ariaLabel={copy.placeOrderAria[locale]}
        caption={copy.placeOrderCaption[locale]}
      />
      <P>{copy.saga5[locale]}</P>

      <H2>{copy.interactionsTitle[locale]}</H2>
      <P>{copy.interactions1[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/promotions/src/application/promotionInteractions.ts" code={PROMOTION_INTERACTIONS_CODE} />
      <P>{copy.interactions2[locale]}</P>
      <P>{copy.interactions3[locale]}</P>

      <H2>{copy.idempotencyTitle[locale]}</H2>
      <P>{copy.idempotency1[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/ordering/src/application/idempotentPlaceOrder.ts" code={IDEMPOTENT_PLACE_ORDER_CODE} />
      <P>{copy.idempotency2[locale]}</P>
      <CodeBlock lang="sql" filename="subgraphs/ordering/src/adapters/persistence/orderingTables.ts" code={ORDER_TABLE_CODE} />
      <P>{copy.idempotency3[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/ordering/tests/idempotentPlaceOrder.test.ts" code={DOUBLE_CLICK_TEST_CODE} />
      <P>{copy.idempotency4[locale]}</P>

      <Divider />

      <H2>{copy.retriesTitle[locale]}</H2>
      <P>{copy.retries1[locale]}</P>
      <CodeBlock lang="ts" filename="shared/src/http/retryPolicy.ts" code={RETRY_POLICY_CODE} />
      <P>{copy.retries2[locale]}</P>
      <CodeBlock lang="ts" filename="shared/src/http/subgraphClient.ts" code={ASK_SUBGRAPH_CODE} />
      <P>{copy.retries3[locale]}</P>
      <CodeBlock lang="ts" filename="shared/tests/retryPolicy.test.ts" code={RETRY_STORM_TEST_CODE} />
      <P>{copy.retries4[locale]}</P>

      <H2>{copy.outboxTitle[locale]}</H2>
      <P>{copy.outbox1[locale]}</P>
      <CodeBlock lang="sql" filename="subgraphs/ordering/src/adapters/persistence/orderingTables.ts" code={OUTBOX_TABLE_CODE} />
      <P>{copy.outbox2[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/ordering/src/application/outboxPublisher.ts" code={OUTBOX_PUBLISHER_CODE} />
      <P>{copy.outbox3[locale]}</P>
      <CodeBlock lang="ts" filename="shared/src/messaging/handledEventStore.ts" code={HANDLED_EVENT_STORE_CODE} />
      <P>{copy.outbox4[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/ordering/tests/outboxPublisher.test.ts" code={OUTBOX_TESTS_CODE} />
      <P>{copy.outbox5[locale]}</P>
      <Callout variant="tip" title={copy.outboxCalloutTitle[locale]}>
        {copy.outboxCalloutBody[locale]}
      </Callout>

      <H2>{copy.resilienceTitle[locale]}</H2>
      <P>{copy.resilience1[locale]}</P>
      <CodeBlock lang="ts" filename="shared/src/http/circuitBreaker.ts" code={CIRCUIT_BREAKER_CODE} />
      <P>{copy.resilience2[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/cart/src/adapters/catalogue/degradedCatalogueReader.ts" code={DEGRADED_READER_CODE} />
      <P>{copy.resilience3[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/cart/src/host/main.ts" code={CART_WIRING_CODE} />
      <P>{copy.resilience4[locale]}</P>
      <CodeBlock lang="ts" filename="router/tests/graph.test.ts" code={CHAOS_TEST_CODE} />
      <P>{copy.resilience5[locale]}</P>
      <P>{copy.resilience6[locale]}</P>

      <Divider />

      <H2>{copy.performanceTitle[locale]}</H2>
      <P>{copy.performance1[locale]}</P>
      <CodeBlock lang="ts" filename="router/src/queryPlanPlugin.ts" code={QUERY_PLAN_PLUGIN_CODE} />
      <P>{copy.performance2[locale]}</P>
      <CodeBlock lang="ts" filename="router/tests/graph.test.ts" code={QUERY_PLAN_TEST_CODE} />
      <P>{copy.performance3[locale]}</P>
      <CodeBlock lang="yaml" filename="router/router.yaml" code={ROUTER_LIMITS_CODE} />
      <P>{copy.performance4[locale]}</P>

      <H2>{copy.tracingTitle[locale]}</H2>
      <P>{copy.tracing1[locale]}</P>
      <CodeBlock lang="ts" filename="shared/src/telemetry/requestTracing.ts" code={REQUEST_TRACING_CODE} />
      <P>{copy.tracing2[locale]}</P>
      <CodeBlock lang="ts" filename="router/tests/graph.test.ts" code={TRACE_TEST_CODE} />
      <P>{copy.tracing3[locale]}</P>

      <H2>{copy.continuousTitle[locale]}</H2>
      <P>{copy.continuous1[locale]}</P>
      <CodeBlock lang="yaml" filename=".github/workflows/node.yml" code={WORKFLOW_CODE} />
      <P>{copy.continuous2[locale]}</P>
      <P>{copy.continuous3[locale]}</P>

      <Divider />

      <H2>{copy.costTitle[locale]}</H2>
      <P>{copy.cost1[locale]}</P>
      <CodeBlock lang="bash" filename="backends/node" code={WALKTHROUGH_CODE} />
      <P>{copy.cost1b[locale]}</P>
      <CodeBlock lang="text" filename="npm test" code={TEST_OUTPUT_CODE} />
      <P>{copy.cost2[locale]}</P>
      <GuaranteeTable
        caption={copy.guaranteeTableCaption[locale]}
        headers={[copy.headerGuarantee[locale], copy.headerPlace[locale], copy.headerProof[locale]]}
        rows={GUARANTEE_ROWS.map((row) => ({
          topic: row.topic[locale],
          place: row.place,
          proof: row.proof,
        }))}
      />
      <P>{copy.cost3[locale]}</P>
      <P>{copy.cost4[locale]}</P>
      <P>
        {copy.cost5Before[locale]}
        <A href={`/${locale}/blog/graphql-as-a-contract-between-frontend-and-backend`}>
          {copy.contractArticleLink[locale]}
        </A>
        {copy.cost5After[locale]}
      </P>
      <P>{copy.cost6[locale]}</P>

      <H2>{copy.closingTitle[locale]}</H2>
      <P>{copy.closing1[locale]}</P>
      <OL>
        <LI>{copy.closingStep1[locale]}</LI>
        <LI>{copy.closingStep2[locale]}</LI>
        <LI>{copy.closingStep3[locale]}</LI>
        <LI>{copy.closingStep4[locale]}</LI>
        <LI>{copy.closingStep5[locale]}</LI>
        <LI>{copy.closingStep6[locale]}</LI>
      </OL>
      <P>{copy.closing2[locale]}</P>
    </>
  );
}
const CATALOGUE_SCHEMA_CODE = `extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.9", import: ["@key", "@shareable", "@inaccessible"])

type Money @shareable {
  amount: Int!
  currency: String!
}

type Category {
  id: ID!
  name: String!
  slug: String!
}

type Product @key(fields: "id") {
  id: ID!
  name: String!
  slug: String!
  description: String!
  price: Money!
  category: Category!
  stock: Int!
  imageUrl: String
}

type ProductEdge {
  cursor: String!
  node: Product!
}

type PageInfo @shareable {
  hasNextPage: Boolean!
  endCursor: String
}

type ProductConnection {
  edges: [ProductEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

input ProductFilter {
  categorySlug: String
  nameContains: String
  inStockOnly: Boolean
}

input StockLine @inaccessible {
  productId: ID!
  quantity: Int!
}

type StockReservation @inaccessible {
  reserved: Boolean!
  unavailableProductId: ID
  availableStock: Int
}

type Query {
  products(filter: ProductFilter, first: Int = 24, after: String): ProductConnection!
  product(slug: String!): Product
  categories: [Category!]!
}

type Mutation {
  reserveStock(idempotencyKey: String!, lines: [StockLine!]!): StockReservation! @inaccessible
  releaseStock(idempotencyKey: String!): Boolean! @inaccessible
}`;

const CART_SCHEMA_CODE = `extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.9", import: ["@key", "@shareable", "@inaccessible"])

scalar DateTime

type Money @shareable {
  amount: Int!
  currency: String!
}

type Product @key(fields: "id", resolvable: false) {
  id: ID!
}

type CartLine {
  id: ID!
  product: Product!
  quantity: Int!
  lineTotal: Money!
}

type Cart @key(fields: "id") {
  id: ID!
  lines: [CartLine!]!
  subtotal: Money!
  updatedAt: DateTime!
}

enum UserErrorCode {
  PRODUCT_NOT_FOUND
  OUT_OF_STOCK
  QUANTITY_INVALID
  CART_LINE_NOT_FOUND
  CART_EMPTY
  CODE_UNKNOWN
  CODE_EXPIRED
  CODE_EXHAUSTED
  CODE_MINIMUM_NOT_MET
  EMAIL_TAKEN
  EMAIL_INVALID
  PASSWORD_TOO_SHORT
  PASSWORD_TOO_LONG
  CREDENTIALS_INVALID
  RATE_LIMITED
  SESSION_INVALID
  SESSION_NOT_FOUND
  NOT_AUTHENTICATED
  ORDER_NOT_FOUND
}

type UserError @shareable {
  code: UserErrorCode!
  message: String!
  field: String
}

type CartPayload @shareable {
  cart: Cart
  availableStock: Int
  errors: [UserError!]!
}

type Query {
  cart: Cart!
}

type Mutation {
  addToCart(productId: ID!, quantity: Int = 1): CartPayload!
  changeCartLineQuantity(lineId: ID!, quantity: Int!): CartPayload!
  removeCartLine(lineId: ID!): CartPayload!
  emptyCart(cartId: ID!): Boolean! @inaccessible
  mergeAnonymousCart(visitorKey: String!, customerId: ID!): Boolean! @inaccessible
}`;

const PROMOTIONS_SCHEMA_CODE = `extend schema
  @link(
    url: "https://specs.apollo.dev/federation/v2.9"
    import: ["@key", "@shareable", "@inaccessible", "@external", "@requires"]
  )

type Money @shareable {
  amount: Int!
  currency: String!
}

enum PromotionKind {
  PERCENTAGE
  FIXED_AMOUNT
  FREE_SHIPPING
}

type AppliedPromotion {
  code: String!
  kind: PromotionKind!
  discount: Money!
}

type Cart @key(fields: "id") {
  id: ID!
  subtotal: Money! @external
  promotion: AppliedPromotion @requires(fields: "subtotal { amount currency }")
  shipping: Money! @requires(fields: "subtotal { amount currency }")
  total: Money! @requires(fields: "subtotal { amount currency }")
}`;

const PROMOTIONS_MUTATION_CODE = `type Mutation {
  applyPromotionCode(code: String!): CartPayload!
  removePromotionCode: CartPayload!
  clearCartPromotion(cartId: ID!): Boolean! @inaccessible
  countPromotionUse(code: String!, orderId: ID!, eventId: ID!): Boolean! @inaccessible
}`;

const CATALOGUE_LOADERS_CODE = `import DataLoader from "dataloader";
import type { Category, Product } from "../../domain/product.js";
import type { CategoryRepository, ProductRepository } from "../../application/ports.js";

export function productLoader(products: ProductRepository): DataLoader<string, Product | null> {
  return new DataLoader<string, Product | null>(async (identifiers) => {
    const found = await products.readManyByIdentifier([...identifiers]);
    const byIdentifier = new Map(found.map((product) => [product.id, product]));
    return identifiers.map((identifier) => byIdentifier.get(identifier) ?? null);
  });
}

export function categoryLoader(categories: CategoryRepository): DataLoader<string, Category | null> {
  return new DataLoader<string, Category | null>(async (slugs) => {
    const all = await categories.readAllInSeedOrder();
    const bySlug = new Map(all.map((category) => [category.slug, category]));
    return slugs.map((slug) => bySlug.get(slug) ?? null);
  });
}`;

const CATALOGUE_REFERENCE_CODE = `  Product: {
    async __resolveReference(reference, context) {
      return context.productByIdentifier.load(reference.id);
    },

    async category(parent, _args, context) {
      const category = await context.categoryBySlug.load(parent.categorySlug);
      if (category === null) {
        throw new GraphQLError(\`Product \${parent.id} points at the unknown category \${parent.categorySlug}\`);
      }
      return category;
    }
  }`;

const ENTITY_CATALOGUE_READER_CODE = `import DataLoader from "dataloader";
import type { ForwardedHeaders } from "@zappy/shared";
import { askSubgraph, money } from "@zappy/shared";
import type { CataloguedProduct, CatalogueReader } from "../../application/ports.js";

const productsByReferenceDocument = \`
  query ProductsByReference($representations: [_Any!]!) {
    _entities(representations: $representations) {
      ... on Product {
        id
        name
        price { amount currency }
        stock
      }
    }
  }
\`;

type ProductEntity = {
  readonly id: string;
  readonly name: string;
  readonly price: { readonly amount: number };
  readonly stock: number;
};

type EntityAnswer = {
  readonly _entities: readonly (ProductEntity | null)[];
};

export type AskCatalogueForProducts = (
  representations: readonly Readonly<Record<string, unknown>>[]
) => Promise<EntityAnswer>;

export function overTheGraph(forwarded: ForwardedHeaders): AskCatalogueForProducts {
  return (representations) =>
    askSubgraph<EntityAnswer>(
      "catalogue",
      productsByReferenceDocument,
      { representations },
      forwarded,
      { idempotent: true }
    );
}

export function entityCatalogueReader(
  forwarded: ForwardedHeaders,
  askCatalogue: AskCatalogueForProducts = overTheGraph(forwarded)
): CatalogueReader {
  const loader = new DataLoader<string, CataloguedProduct | null>(async (productIdentifiers) => {
    const representations = productIdentifiers.map((id) => ({ __typename: "Product", id }));
    const answer = await askCatalogue(representations);
    const found = new Map<string, CataloguedProduct>();
    for (const entity of answer._entities) {
      if (entity !== null) {
        found.set(entity.id, {
          id: entity.id,
          name: entity.name,
          price: money(entity.price.amount),
          stock: entity.stock
        });
      }
    }
    return productIdentifiers.map((identifier) => found.get(identifier) ?? null);
  });

  return {
    async readProduct(productId: string): Promise<CataloguedProduct | null> {
      return loader.load(productId);
    },

    async readProducts(productIdentifiers: readonly string[]): Promise<readonly CataloguedProduct[]> {
      const loaded = await Promise.all(productIdentifiers.map((identifier) => loader.load(identifier)));
      return loaded.filter((product): product is CataloguedProduct => product !== null);
    }
  };
}`;

const COMPOSE_CODE = `import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "graphql";
import { composeServices } from "@apollo/composition";

const backendFolder = dirname(dirname(fileURLToPath(import.meta.url)));

export const subgraphNames = ["catalogue", "cart", "promotions", "ordering", "accounts"];

export const subgraphPorts = {
  catalogue: 4101,
  cart: 4102,
  promotions: 4103,
  ordering: 4104,
  accounts: 4105
};

export function readSubgraphSchema(name, profile) {
  const folder = join(backendFolder, "subgraphs", name);
  const base = readFileSync(join(folder, "schema.graphql"), "utf8");
  if (profile === "production") {
    return base;
  }
  const development = readFileSync(join(folder, "schema.development.graphql"), "utf8");
  return \`\${base.trimEnd()}\\n\\n\${development.trimStart()}\`;
}

export function composeSupergraph(profile) {
  const services = subgraphNames.map((name) => ({
    name,
    url: \`http://localhost:\${subgraphPorts[name]}/graphql\`,
    typeDefs: parse(readSubgraphSchema(name, profile))
  }));

  const result = composeServices(services);
  if (result.errors !== undefined && result.errors.length > 0) {
    const listed = result.errors.map((error) => \`  \${error.message}\`).join("\\n");
    throw new Error(\`Composition failed for the \${profile} profile:\\n\${listed}\`);
  }
  return result.supergraphSdl;
}

export function supergraphFileFor(profile) {
  return profile === "production"
    ? join(backendFolder, "router", "supergraph.graphql")
    : join(backendFolder, "router", "supergraph.development.graphql");
}

function writeSupergraph(profile) {
  const supergraphSdl = composeSupergraph(profile);
  const file = supergraphFileFor(profile);
  writeFileSync(file, supergraphSdl, "utf8");
  return { file, lineCount: supergraphSdl.split("\\n").length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const profile of ["production", "development"]) {
    const written = writeSupergraph(profile);
    console.log(\`composed the \${profile} supergraph into \${written.file} (\${written.lineCount} lines)\`);
  }
}`;

const SUPERGRAPH_CART_CODE = `type Cart
  @join__type(graph: CART, key: "id")
  @join__type(graph: PROMOTIONS, key: "id")
{
  id: ID!
  lines: [CartLine!]! @join__field(graph: CART)
  subtotal: Money! @join__field(graph: CART) @join__field(graph: PROMOTIONS, external: true)
  updatedAt: DateTime! @join__field(graph: CART)
  promotion: AppliedPromotion @join__field(graph: PROMOTIONS, requires: "subtotal { amount currency }")
  shipping: Money! @join__field(graph: PROMOTIONS, requires: "subtotal { amount currency }")
  total: Money! @join__field(graph: PROMOTIONS, requires: "subtotal { amount currency }")
}


enum join__Graph {
  ACCOUNTS @join__graph(name: "accounts", url: "http://localhost:4105/graphql")
  CART @join__graph(name: "cart", url: "http://localhost:4102/graphql")
  CATALOGUE @join__graph(name: "catalogue", url: "http://localhost:4101/graphql")
  ORDERING @join__graph(name: "ordering", url: "http://localhost:4104/graphql")
  PROMOTIONS @join__graph(name: "promotions", url: "http://localhost:4103/graphql")
}`;

const CONTRACT_DIFF_CODE = `import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildSchema,
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isObjectType,
  isUnionType,
  printType
} from "graphql";
import { Supergraph } from "@apollo/federation-internals";
import { composeSupergraph } from "./compose.mjs";

function findRepositoryRoot() {
  let directory = dirname(fileURLToPath(import.meta.url));
  while (!existsSync(join(directory, "contract", "schema.graphql"))) {
    const parent = resolve(directory, "..");
    if (parent === directory) {
      throw new Error("No folder above this file holds contract/schema.graphql");
    }
    directory = parent;
  }
  return directory;
}

const repositoryRoot = findRepositoryRoot();

function readContractSchema(profile) {
  const store = readFileSync(join(repositoryRoot, "contract", "schema.graphql"), "utf8");
  if (profile === "production") {
    return store;
  }
  const development = readFileSync(join(repositoryRoot, "contract", "schema.development.graphql"), "utf8");
  return store + "\\n\\n" + development;
}

function apiSchemaOf(supergraphSdl) {
  return Supergraph.build(supergraphSdl).apiSchema().toGraphQLJSSchema();
}

function kindNameOf(type) {
  if (isInputObjectType(type)) {
    return "input";`;

const CONTRACT_DIFF_TAIL_CODE = `export function differencesWithContract(profile) {
  const contractSchema = buildSchema(readContractSchema(profile), { assumeValidSDL: true });
  const composedSchema = apiSchemaOf(composeSupergraph(profile));
  return compareShapes(shapeOf(contractSchema), shapeOf(composedSchema));
}

export function printedApiSchema(profile) {
  const schema = apiSchemaOf(composeSupergraph(profile));
  return Object.values(schema.getTypeMap())
    .filter((type) => !type.name.startsWith("__"))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((type) => printType(type))
    .join("\\n\\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let failed = false;
  for (const profile of ["production", "development"]) {
    const differences = differencesWithContract(profile);
    if (differences.length === 0) {
      console.log("the " + profile + " graph matches the contract");
      continue;
    }
    failed = true;
    console.error("the " + profile + " graph differs from the contract in " + differences.length + " places:");
    for (const difference of differences) {
      console.error("  " + difference);
    }
  }
  process.exitCode = failed ? 1 : 0;
}`;

const GATEWAY_MAIN_CODE = `import { createServer, type Server } from "node:http";
import express, { type Request, type Response } from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloGateway } from "@apollo/gateway";
import {
  allowedOrigins,
  currentProfile,
  gatewayPort,
  subgraphNames,
  subgraphUrl,
  type SubgraphName
} from "@zappy/shared";
import {
  closeHttpServer,
  originCheckPlugin,
  requestTracingMiddleware,
  startRequestTracing
} from "@zappy/shared";
import { readSupergraph } from "../supergraphFile.js";
import { subgraphDataSource } from "../subgraphDataSource.js";
import { queryPlanPlugin, summariseQueryPlan, type QueryPlanSummary } from "../queryPlanPlugin.js";
import type { GatewayContext } from "../gatewayContext.js";

export const maximumQueryDepth = 12;

export const maximumQueryCost = 2000;

export const gatewayServiceName = "gateway";

export async function startGateway(): Promise<{ url: string; stop(): Promise<void> }> {
  startRequestTracing(gatewayServiceName);

  const gateway = new ApolloGateway({
    supergraphSdl: readSupergraph(currentProfile()),
    buildService({ name, url }) {
      return subgraphDataSource(name as SubgraphName, url ?? subgraphUrl(name as SubgraphName));
    },
    experimental_didResolveQueryPlan({ queryPlan, requestContext }) {
      (requestContext.context as GatewayContext).rememberQueryPlan(summariseQueryPlan(queryPlan));
    }
  });

  const application = express();
  application.use(requestTracingMiddleware(gatewayServiceName));
  const httpServer: Server = createServer(application);

  const server = new ApolloServer<GatewayContext>({
    gateway,
    introspection: true,
    includeStacktraceInErrorResponses: false,
    plugins: [
      originCheckPlugin<GatewayContext>((context) => context.incomingHeaders.origin ?? null),
      queryPlanPlugin(),
      ApolloServerPluginDrainHttpServer({ httpServer })
    ]
  });
  await server.start();

  application.get("/health", (_request: Request, response: Response) => {
    response.json({ gateway: "zappy-mart", status: "alive" });
  });

  application.get("/ready", (_request: Request, response: Response) => {
    readinessOfSubgraphs()
      .then((readiness) => {
        const ready = readiness.every((entry) => entry.ready);
        response.status(ready ? 200 : 503).json({ gateway: "zappy-mart", subgraphs: readiness });
      })
      .catch(() => {
        response.status(503).json({ gateway: "zappy-mart", status: "starting" });
      });
  });

  application.use(
    "/graphql",
    cors({ origin: [...allowedOrigins()], credentials: true }),
    express.json({ limit: "512kb" }),
    expressMiddleware(server, {
      context: async ({ req, res }): Promise<GatewayContext> => {
        let queryPlan: QueryPlanSummary | null = null;
        return {
          incomingHeaders: {
            ...(req.headers.authorization === undefined ? {} : { authorization: req.headers.authorization }),
            ...(req.headers.cookie === undefined ? {} : { cookie: req.headers.cookie }),
            ...(req.headers.origin === undefined ? {} : { origin: req.headers.origin as string })
          },
          collectCookie(value: string): void {
            res.append("set-cookie", value);
          },
          rememberQueryPlan(summary: QueryPlanSummary): void {
            queryPlan = summary;
          },
          rememberedQueryPlan(): QueryPlanSummary | null {
            return queryPlan;
          }
        };
      }
    })
  );

  await new Promise<void>((resolve) => httpServer.listen(gatewayPort, resolve));

  return {
    url: \`http://localhost:\${gatewayPort}/graphql\`,
    async stop(): Promise<void> {
      await server.stop();
      await closeHttpServer(httpServer);
    }
  };
}`;

const SUBGRAPH_DATA_SOURCE_CODE = `import { RemoteGraphQLDataSource } from "@apollo/gateway";
import {
  subgraphRequestTimeoutInMilliseconds,
  traceHeadersOfActiveContext,
  type SubgraphName
} from "@zappy/shared";
import type { GatewayContext } from "./gatewayContext.js";

const forwardedRequestHeaders = ["authorization", "cookie"] as const;

export function subgraphDataSource(name: SubgraphName, url: string): RemoteGraphQLDataSource<GatewayContext> {
  return new RemoteGraphQLDataSource<GatewayContext>({
    url,

    fetcher: (input, init) =>
      fetch(input, { ...init, signal: AbortSignal.timeout(subgraphRequestTimeoutInMilliseconds()) }),

    willSendRequest({ request, context }) {
      for (const header of forwardedRequestHeaders) {
        const value = context.incomingHeaders[header];
        if (value !== undefined) {
          request.http?.headers.set(header, value);
        }
      }
      const origin = context.incomingHeaders["origin"];
      if (origin !== undefined) {
        request.http?.headers.set("origin", origin);
      }
      for (const [header, value] of Object.entries(traceHeadersOfActiveContext())) {
        request.http?.headers.set(header, value);
      }
      request.http?.headers.set("x-zappy-subgraph", name);
    },

    didReceiveResponse({ response, context }) {
      for (const [header, value] of response.http?.headers ?? []) {
        if (header.toLowerCase() === "set-cookie") {
          context.collectCookie(value);
        }
      }
      return response;
    }
  });
}`;

const ROUTER_YAML_CODE = `supergraph:
  listen: 127.0.0.1:4100
  path: /graphql
  introspection: true

health_check:
  enabled: true
  listen: 127.0.0.1:4100
  path: /health

cors:
  allow_credentials: true
  origins:
    - http://localhost:5173
    - http://localhost:3001
    - http://localhost:4200
  allow_headers:
    - content-type
    - authorization
  expose_headers:
    - set-cookie

headers:
  all:
    request:
      - propagate:
          named: authorization
      - propagate:
          named: cookie
      - propagate:
          named: origin

traffic_shaping:
  all:
    timeout: 5s
  subgraphs:
    catalogue:
      timeout: 5s
    cart:
      timeout: 5s
    promotions:
      timeout: 5s
    ordering:
      timeout: 10s
    accounts:
      timeout: 5s`;

const ROUTER_LIMITS_CODE = `limits:
  max_depth: 12
  max_height: 200
  max_aliases: 30
  max_root_fields: 20
  parser_max_tokens: 15000
  parser_max_recursion: 500
  http_max_request_bytes: 524288

include_subgraph_errors:
  all: true

telemetry:
  instrumentation:
    spans:
      mode: spec_compliant`;

const CODEGEN_CODE = `import { writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generate } from "@graphql-codegen/cli";

const backendFolder = dirname(dirname(fileURLToPath(import.meta.url)));

const mappersPerSubgraph = {
  catalogue: {
    Product: "../adapters/graphql/models.js#ProductModel",
    Category: "../adapters/graphql/models.js#CategoryModel"
  },
  cart: {
    Cart: "../adapters/graphql/models.js#CartModel",
    CartLine: "../adapters/graphql/models.js#CartLineModel",
    Product: "../adapters/graphql/models.js#ProductReferenceModel"
  },
  promotions: {
    Cart: "../adapters/graphql/models.js#CartReferenceModel"
  },
  ordering: {
    Order: "../adapters/graphql/models.js#OrderModel"
  },
  accounts: {
    Customer: "../adapters/graphql/models.js#CustomerModel",
    Session: "../adapters/graphql/models.js#SessionModel",
    Product: "../adapters/graphql/models.js#ProductReferenceModel"
  }
};

const contextTypePerSubgraph = {
  catalogue: "../adapters/graphql/context.js#CatalogueContext",
  cart: "../adapters/graphql/context.js#CartContext",
  promotions: "../adapters/graphql/context.js#PromotionsContext",
  ordering: "../adapters/graphql/context.js#OrderingContext",
  accounts: "../adapters/graphql/context.js#AccountsContext"
};

const federationScalars = {
  DateTime: "string",
  _Any: "Record<string, unknown>",
  _FieldSet: "string",
  federation__FieldSet: "string",
  link__Import: "string",
  link__Purpose: "string"`;

const CODEGEN_TAIL_CODE = `};

const generates = {};
for (const [name, mappers] of Object.entries(mappersPerSubgraph)) {
  generates[\`\${backendFolder}/subgraphs/\${name}/src/generated/resolvers.ts\`] = {
    schema: [
      \`\${backendFolder}/subgraphs/\${name}/schema.graphql\`,
      \`\${backendFolder}/subgraphs/\${name}/schema.development.graphql\`
    ],
    plugins: ["typescript", "typescript-resolvers"],
    config: {
      federation: true,
      contextType: contextTypePerSubgraph[name],
      mappers,
      scalars: federationScalars,
      strictScalars: true,
      enumsAsTypes: true,
      useTypeImports: true,
      immutableTypes: false,
      skipTypename: true,
      namingConvention: "keep"
    }
  };
}

const wholeLineComment = /^\\s*\\/\\*\\*.*\\*\\/\\s*$/;

function withoutComments(source) {
  return source
    .split("\\n")
    .filter((line) => !wholeLineComment.test(line))
    .join("\\n");
}

const written = await generate({ overwrite: true, generates, errorsOnly: true }, false);
for (const file of written) {
  writeFileSync(file.filename, withoutComments(file.content), "utf8");
  console.log(\`generated \${file.filename}\`);
}`;

const TYPED_RESOLVERS_CODE = `import { GraphQLError } from "graphql";
import { currentProfile } from "@zappy/shared";
import type { Resolvers } from "../../generated/resolvers.js";

export const catalogueResolvers: Resolvers = {
  Query: {
    async products(_parent, args, context) {
      const page = await context.catalogue.page(args.filter ?? null, args.first ?? null, args.after ?? null);
      return {
        edges: page.edges.map((edge) => ({ cursor: edge.cursor, node: edge.node })),
        pageInfo: page.pageInfo,
        totalCount: page.totalCount
      };
    },

    async product(_parent, args, context) {
      return context.catalogue.bySlug(args.slug);
    },

    async categories(_parent, _args, context) {
      return [...(await context.catalogue.categories())];
    }
  },

  Mutation: {
    async reserveStock(_parent, args, context) {
      const answer = await context.stock.reserve(
        args.idempotencyKey,
        args.lines.map((line) => ({ productId: line.productId, quantity: line.quantity }))
      );
      return answer;
    },

    async releaseStock(_parent, args, context) {
      return context.stock.release(args.idempotencyKey);
    },

    async resetSeed(_parent, _args, context) {
      requireDevelopmentProfile();
      const answer = await context.seed.resetWholeGraph();
      return { ...answer, errors: [] };
    },

    async resetSubgraphSeed(_parent, _args, context) {
      requireDevelopmentProfile();
      const answer = await context.seed.resetOwnData();
      return { ...answer, errors: [] };
    }
  },
};`;

const ACCESS_TOKEN_CODE = `import { createRemoteJWKSet, jwtVerify } from "jose";
import { jsonWebKeySetUrl, tokenAudience, tokenIssuer } from "../configuration.js";
import { accountsSessionChecker, type SessionChecker } from "./sessionChecker.js";

export type SignedInVisitor = {
  readonly customerId: string;
  readonly sessionId: string;
};

export type AccessTokenVerifier = {
  verify(bearerHeader: string | null): Promise<SignedInVisitor | null>;
};

export function bearerTokenOf(bearerHeader: string | null): string | null {
  if (bearerHeader === null) {
    return null;
  }
  const [scheme, token] = bearerHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || token === undefined || token.length === 0) {
    return null;
  }
  return token;
}

export function remoteAccessTokenVerifier(
  sessionChecker: SessionChecker = accountsSessionChecker()
): AccessTokenVerifier {
  const keySet = createRemoteJWKSet(new URL(jsonWebKeySetUrl()), {
    cacheMaxAge: 300_000,
    cooldownDuration: 5_000
  });

  return {
    async verify(bearerHeader: string | null): Promise<SignedInVisitor | null> {
      const token = bearerTokenOf(bearerHeader);
      if (token === null) {
        return null;
      }
      let customerId: unknown;
      let sessionId: unknown;
      try {
        const { payload } = await jwtVerify(token, keySet, {
          issuer: tokenIssuer,
          audience: tokenAudience,
          algorithms: ["RS256"]
        });
        customerId = payload.sub;
        sessionId = payload["sessionId"];
      } catch {
        return null;
      }
      if (typeof customerId !== "string" || typeof sessionId !== "string") {
        return null;
      }
      if (!(await sessionChecker.isLive(sessionId))) {
        return null;
      }
      return { customerId, sessionId };
    }
  };
}`;

const SESSION_CHECKER_CODE = `import { askSubgraph } from "../http/subgraphClient.js";

export type SessionChecker = {
  isLive(sessionId: string): Promise<boolean>;
};

export const sessionCacheLifetimeInMilliseconds = 5000;

const isSessionLiveDocument = \`
  query IsSessionLive($sessionId: ID!) {
    isSessionLive(sessionId: $sessionId)
  }
\`;

export function accountsSessionChecker(
  now: () => number = () => Date.now()
): SessionChecker {
  const remembered = new Map<string, { readonly live: boolean; readonly until: number }>();

  return {
    async isLive(sessionId: string): Promise<boolean> {
      const cached = remembered.get(sessionId);
      const moment = now();
      if (cached !== undefined && cached.until > moment) {
        return cached.live;
      }
      try {
        const answer = await askSubgraph<{ isSessionLive: boolean }>(
          "accounts",
          isSessionLiveDocument,
          { sessionId },
          { authorization: null, cookie: null }
        );
        remembered.set(sessionId, {
          live: answer.isSessionLive,
          until: moment + sessionCacheLifetimeInMilliseconds
        });
        return answer.isSessionLive;
      } catch {
        return false;
      }
    }
  };
}`;

const ORIGIN_CHECK_CODE = `import { allowedOrigins } from "../configuration.js";

export const internalOrigin = "internal";

export type OriginVerdict = "allowed" | "refused";

export function judgeOrigin(origin: string | null | undefined): OriginVerdict {
  if (origin === internalOrigin) {
    return "allowed";
  }
  if (origin === null || origin === undefined || origin.length === 0) {
    return "refused";
  }
  return allowedOrigins().includes(origin) ? "allowed" : "refused";
}`;

const ORIGIN_PLUGIN_CODE = `import { GraphQLError } from "graphql";
import type { ApolloServerPlugin, BaseContext } from "@apollo/server";
import { judgeOrigin } from "../security/originCheck.js";

export function originCheckPlugin<Context extends BaseContext>(
  originOf: (context: Context) => string | null
): ApolloServerPlugin<Context> {
  return {
    async requestDidStart() {
      return {
        async didResolveOperation(requestContext) {
          if (requestContext.operation?.operation !== "mutation") {
            return;
          }
          if (judgeOrigin(originOf(requestContext.contextValue)) === "allowed") {
            return;
          }
          throw new GraphQLError("A mutation needs an Origin header this store allows.", {
            extensions: { code: "ORIGIN_NOT_ALLOWED", http: { status: 403 } }
          });
        }
      };
    }
  };
}`;

const CACHED_REPOSITORY_CODE = `import type { Category, Product } from "../../domain/product.js";
import {
  productChanged,
  wholeCatalogueChanged,
  type ProductChanged
} from "../../domain/productChanged.js";
import type { ProductChangeListener, ProductRepository } from "../../application/ports.js";

export type CatalogueCacheCounters = {
  readonly databaseReads: number;
  readonly cacheHits: number;
  readonly invalidations: number;
};

export type CachedCatalogue = {
  readonly repository: ProductRepository;
  readonly listener: ProductChangeListener;
  counters(): CatalogueCacheCounters;
};

export function cachedProductRepository(
  stored: ProductRepository,
  now: () => Date,
  otherListeners: readonly ProductChangeListener[] = []
): CachedCatalogue {
  let cachedCatalogue: readonly Product[] | null = null;
  let databaseReads = 0;
  let cacheHits = 0;
  let invalidations = 0;

  const listener: ProductChangeListener = {
    productChanged(event: ProductChanged): void {
      cachedCatalogue = null;
      invalidations = invalidations + 1;
      for (const other of otherListeners) {
        other.productChanged(event);
      }
    }
  };

  async function catalogueInOrder(): Promise<readonly Product[]> {
    if (cachedCatalogue !== null) {
      cacheHits = cacheHits + 1;
      return cachedCatalogue;
    }
    databaseReads = databaseReads + 1;
    cachedCatalogue = await stored.readAllInCatalogueOrder();
    return cachedCatalogue;
  }

  const repository: ProductRepository = {
    async readAllInCatalogueOrder(): Promise<readonly Product[]> {
      return catalogueInOrder();
    },

    async readBySlug(slug: string): Promise<Product | null> {
      return (await catalogueInOrder()).find((product) => product.slug === slug) ?? null;
    },

    async readManyByIdentifier(identifiers: readonly string[]): Promise<readonly Product[]> {
      const wanted = new Set(identifiers);
      return (await catalogueInOrder()).filter((product) => wanted.has(product.id));
    },

    async writeStock(productId: string, stock: number): Promise<void> {
      await stored.writeStock(productId, stock);
      listener.productChanged(productChanged(productId, now().toISOString()));
    },

    async replaceCatalogue(products: readonly Product[], categories: readonly Category[]): Promise<void> {
      await stored.replaceCatalogue(products, categories);
      listener.productChanged(wholeCatalogueChanged(now().toISOString()));
    }
  };

  return {
    repository,
    listener,
    counters(): CatalogueCacheCounters {
      return { databaseReads, cacheHits, invalidations };
    }
  };
}`;

const CATALOGUE_WIRING_CODE = `  const storedProducts = sqlProductRepository(database);
  const cachedProducts = cachedProductRepository(storedProducts, () => systemClock.now());
  const categories = sqlCategoryRepository(database);
  const reservations = sqlStockReservationStore(database);

  const catalogue = readCatalogue(cachedProducts.repository, categories);
  const stock = reserveStock(
    database,
    storedProducts,
    reservations,
    () => systemClock.now(),
    cachedProducts.listener
  );
  const seed = resetSeed(database, cachedProducts.repository);`;

const SAGA_CODE = `import type { StockReserver } from "./ports.js";

export type ReservedLine = {
  readonly productId: string;
  readonly quantity: number;
};

export type SagaOutcome<Value> =
  | { readonly kind: "completed"; readonly value: Value }
  | {
      readonly kind: "unavailable";
      readonly productId: string | null;
      readonly availableStock: number | null;
    };

export type StockReservationSaga = {
  withReservedStock<Value>(
    idempotencyKey: string,
    lines: readonly ReservedLine[],
    work: () => Promise<Value>
  ): Promise<SagaOutcome<Value>>;
};

export function stockReservationSaga(stock: StockReserver): StockReservationSaga {
  async function compensate(idempotencyKey: string): Promise<void> {
    try {
      await stock.release(idempotencyKey);
    } catch {
      return;
    }
  }

  return {
    async withReservedStock<Value>(
      idempotencyKey: string,
      lines: readonly ReservedLine[],
      work: () => Promise<Value>
    ): Promise<SagaOutcome<Value>> {
      const reservation = await stock.reserve(idempotencyKey, lines);
      if (!reservation.reserved) {
        return {
          kind: "unavailable",
          productId: reservation.unavailableProductId,
          availableStock: reservation.availableStock
        };
      }
      try {
        return { kind: "completed", value: await work() };
      } catch (failure) {
        await compensate(idempotencyKey);
        throw failure;
      }
    }
  };
}`;

const PLACE_ORDER_CODE = `import type { UserError } from "@zappy/shared";
import type { Database } from "@zappy/shared";
import { newIdentifier, notAuthenticated, toContractDateTime, userError } from "@zappy/shared";
import type { Order } from "../domain/order.js";
import { placeOrderFrom } from "../domain/order.js";
import { orderPlaced } from "../domain/orderPlaced.js";
import type { OutboxNudge } from "./outboxPublisher.js";
import type { StockReservationSaga } from "./stockReservationSaga.js";
import type { CartToOrderReader, OrderRepository, OutboxStore } from "./ports.js";

export type PlaceOrderOutcome =
  | { readonly kind: "placed"; readonly order: Order }
  | { readonly kind: "refused"; readonly errors: readonly UserError[] };

export type PlaceOrder = {
  place(customerId: string | null, idempotencyKey: string | null): Promise<PlaceOrderOutcome>;
};

export function placeOrder(
  database: Database,
  orders: OrderRepository,
  outbox: OutboxStore,
  carts: CartToOrderReader,
  saga: StockReservationSaga,
  publisher: OutboxNudge,
  now: () => Date
): PlaceOrder {
  return {
    async place(customerId, idempotencyKey): Promise<PlaceOrderOutcome> {
      if (customerId === null) {
        return { kind: "refused", errors: [notAuthenticated] };
      }
      const checkoutKey = idempotencyKey ?? newIdentifier("checkout");

      const cart = await carts.readOrderableCart();
      if (cart === null || cart.lines.length === 0) {
        return {
          kind: "refused",
          errors: [userError("CART_EMPTY", "The cart has no lines, so there is nothing to order.")]
        };
      }

      const outcome = await saga.withReservedStock(
        checkoutKey,
        cart.lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
        async () =>
          database.transaction(async () => {
            const order = placeOrderFrom(
              newIdentifier("order"),
              await orders.nextSequenceNumber(),
              customerId,
              cart,
              toContractDateTime(now())
            );
            await orders.write(order, checkoutKey);
            await outbox.write(orderPlaced(order, cart.cartId), now().toISOString());
            return order;
          })
      );

      if (outcome.kind === "unavailable") {
        const refusedLine = cart.lines.find((line) => line.productId === outcome.productId);
        return {
          kind: "refused",
          errors: [
            userError(
              "OUT_OF_STOCK",
              \`\${refusedLine?.productName ?? outcome.productId} has \${outcome.availableStock ?? 0} in stock.\`
            )
          ]
        };
      }

      await nudgeThePublisher(publisher);
      return { kind: "placed", order: outcome.value };
    }
  };
}

async function nudgeThePublisher(publisher: OutboxNudge): Promise<void> {
  try {
    await publisher.publishDue();
  } catch {
    return;
  }
}`;

const PROMOTION_INTERACTIONS_CODE = `import type { HandledEventStore, Money } from "@zappy/shared";
import type { ManagePromotions, PromotionOutcome } from "./applyPromotionCode.js";

export const promotionUseConsumerName = "promotions.countPromotionUse";

export type PromotionInteractions = {
  validateOnRequest(cartId: string, subtotal: Money, typedCode: string): Promise<PromotionOutcome>;
  countUseOnEvent(eventId: string, typedCode: string): Promise<boolean>;
};

export function promotionInteractions(
  promotions: ManagePromotions,
  handledEvents: HandledEventStore
): PromotionInteractions {
  return {
    async validateOnRequest(cartId, subtotal, typedCode): Promise<PromotionOutcome> {
      return promotions.apply(cartId, subtotal, typedCode);
    },

    async countUseOnEvent(eventId, typedCode): Promise<boolean> {
      let outcome = true;
      await handledEvents.onlyOnce(eventId, promotionUseConsumerName, async () => {
        outcome = await promotions.countUse(typedCode);
      });
      return outcome;
    }
  };
}`;

const IDEMPOTENT_PLACE_ORDER_CODE = `import type { PlaceOrder, PlaceOrderOutcome } from "./placeOrder.js";
import type { OrderRepository } from "./ports.js";

export type InFlightCheckouts = Map<string, Promise<PlaceOrderOutcome>>;

export function inFlightCheckouts(): InFlightCheckouts {
  return new Map<string, Promise<PlaceOrderOutcome>>();
}

export function idempotentPlaceOrder(
  inner: PlaceOrder,
  orders: OrderRepository,
  inFlight: InFlightCheckouts
): PlaceOrder {
  return {
    async place(customerId, idempotencyKey): Promise<PlaceOrderOutcome> {
      if (customerId === null || idempotencyKey === null) {
        return inner.place(customerId, idempotencyKey);
      }

      const alreadyPlaced = await orders.readByIdempotencyKey(idempotencyKey, customerId);
      if (alreadyPlaced !== null) {
        return { kind: "placed", order: alreadyPlaced };
      }

      const checkout = \`\${customerId}:\${idempotencyKey}\`;
      const running = inFlight.get(checkout);
      if (running !== undefined) {
        return running;
      }

      const started = inner.place(customerId, idempotencyKey).finally(() => {
        inFlight.delete(checkout);
      });
      inFlight.set(checkout, started);
      return started;
    }
  };
}`;

const ORDER_TABLE_CODE = `  await database.execute(\`
    create table if not exists customer_order (
      id text primary key,
      sequence_number integer not null,
      order_number text not null unique,
      customer_id text not null,
      status text not null,
      promotion_code text,
      subtotal integer not null,
      discount integer not null,
      shipping integer not null,
      total integer not null,
      placed_at text not null,
      idempotency_key text not null,
      unique (customer_id, idempotency_key)
    )
  \`);`;

const OUTBOX_TABLE_CODE = `  await database.execute(\`
    create table if not exists outbox_message (
      id text primary key,
      event_name text not null,
      payload text not null,
      recorded_at text not null,
      published_at text,
      attempts integer not null,
      next_attempt_at text not null,
      last_failure text,
      dead_lettered_at text
    )
  \`);`;

const DOUBLE_CLICK_TEST_CODE = `  it("places one order for a double click and answers the same order twice", async () => {
    const checkout = countingCheckout();
    const [first, second] = await Promise.all([
      checkout.place("customer-01", "checkout-double-click"),
      checkout.place("customer-01", "checkout-double-click")
    ]);
    assert.equal(first?.kind, "placed");
    assert.equal(second?.kind, "placed");
    assert.equal(
      first?.kind === "placed" ? first.order.id : "no order",
      second?.kind === "placed" ? second.order.id : "another order"
    );
    assert.equal(checkoutsStarted, 1);
    assert.equal((await orderStore.readAllForCustomerNewestFirst("customer-01")).length, 1);
  });

  it("replays the stored order when the same key comes back much later", async () => {
    const checkout = countingCheckout();
    const first = await checkout.place("customer-01", "checkout-replay");
    const later = await checkout.place("customer-01", "checkout-replay");
    assert.equal(
      first.kind === "placed" ? first.order.number : "no number",
      later.kind === "placed" ? later.order.number : "another number"
    );
    assert.equal(checkoutsStarted, 1);
  });`;

const RETRY_POLICY_CODE = `export type BackoffSettings = {
  readonly firstDelayInMilliseconds: number;
  readonly growthFactor: number;
  readonly maximumDelayInMilliseconds: number;
  readonly jitterFraction: number;
};

export const defaultBackoffSettings: BackoffSettings = {
  firstDelayInMilliseconds: 50,
  growthFactor: 2,
  maximumDelayInMilliseconds: 2000,
  jitterFraction: 0.5
};

export function backoffCeilingInMilliseconds(attemptNumber: number, settings: BackoffSettings): number {
  const grown =
    settings.firstDelayInMilliseconds * Math.pow(settings.growthFactor, Math.max(attemptNumber - 1, 0));
  return Math.min(grown, settings.maximumDelayInMilliseconds);
}

export function backoffDelayInMilliseconds(
  attemptNumber: number,
  settings: BackoffSettings,
  randomFraction: number
): number {
  const ceiling = backoffCeilingInMilliseconds(attemptNumber, settings);
  return Math.round(ceiling * (1 - settings.jitterFraction * randomFraction));
}

export type RetryBudgetSettings = {
  readonly retryRatio: number;
  readonly minimumRetriesPerWindow: number;
  readonly windowInMilliseconds: number;
};

export const defaultRetryBudgetSettings: RetryBudgetSettings = {
  retryRatio: 0.2,
  minimumRetriesPerWindow: 5,
  windowInMilliseconds: 10_000
};

export type RetryBudget = {
  recordCall(): void;
  tryToSpendRetry(): boolean;
  callsInWindow(): number;
  retriesInWindow(): number;
};

export function retryBudget(
  settings: RetryBudgetSettings = defaultRetryBudgetSettings,
  now: () => number = Date.now
): RetryBudget {
  const callMoments: number[] = [];
  const retryMoments: number[] = [];

  function forgetOlderThanWindow(moments: number[], edge: number): void {
    while (moments.length > 0 && (moments[0] as number) <= edge) {
      moments.shift();
    }
  }

  function refresh(): void {
    const edge = now() - settings.windowInMilliseconds;
    forgetOlderThanWindow(callMoments, edge);
    forgetOlderThanWindow(retryMoments, edge);
  }

  return {
    recordCall(): void {
      refresh();
      callMoments.push(now());
    },

    tryToSpendRetry(): boolean {
      refresh();
      const allowance = settings.minimumRetriesPerWindow + settings.retryRatio * callMoments.length;
      if (retryMoments.length >= allowance) {
        return false;
      }
      retryMoments.push(now());
      return true;
    },

    callsInWindow(): number {
      refresh();
      return callMoments.length;
    },

    retriesInWindow(): number {
      refresh();
      return retryMoments.length;
    }
  };
}

export type RetryPlan = {
  readonly maximumAttempts: number;
  readonly backoff: BackoffSettings;
  readonly budget: RetryBudget;
  readonly sleep: (milliseconds: number) => Promise<void>;
  readonly randomFraction: () => number;
};

export function sleepFor(milliseconds: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}

export function retryPlan(budget: RetryBudget, maximumAttempts = 3): RetryPlan {
  return {
    maximumAttempts,
    backoff: defaultBackoffSettings,
    budget,
    sleep: sleepFor,
    randomFraction: Math.random
  };
}

export async function withRetries<Value>(
  plan: RetryPlan,
  isRetryable: (failure: unknown) => boolean,
  attempt: (attemptNumber: number) => Promise<Value>
): Promise<Value> {
  plan.budget.recordCall();
  let attemptNumber = 1;
  for (;;) {
    try {
      return await attempt(attemptNumber);
    } catch (failure) {
      const anotherAttemptIsAllowed =
        attemptNumber < plan.maximumAttempts && isRetryable(failure) && plan.budget.tryToSpendRetry();
      if (!anotherAttemptIsAllowed) {
        throw failure;
      }
      await plan.sleep(backoffDelayInMilliseconds(attemptNumber, plan.backoff, plan.randomFraction()));
      attemptNumber = attemptNumber + 1;
    }
  }
}`;

const ASK_SUBGRAPH_CODE = `import { subgraphRequestTimeoutInMilliseconds, type SubgraphName, subgraphUrl } from "../configuration.js";
import { internalOrigin } from "../security/originCheck.js";
import { traceHeadersOfActiveContext } from "../telemetry/requestTracing.js";
import {
  defaultRetryBudgetSettings,
  retryBudget,
  retryPlan,
  withRetries,
  type RetryBudget,
  type RetryPlan
} from "./retryPolicy.js";

export type ForwardedHeaders = {
  readonly authorization: string | null;
  readonly cookie: string | null;
};

export type SubgraphCallFailure = {
  readonly subgraph: SubgraphName;
  readonly reason: string;
  readonly retryable: boolean;
};

export class SubgraphUnavailableError extends Error {
  readonly subgraph: SubgraphName;
  readonly retryable: boolean;

  constructor(failure: SubgraphCallFailure) {
    super(\`The \${failure.subgraph} subgraph did not answer: \${failure.reason}\`);
    this.name = "SubgraphUnavailableError";
    this.subgraph = failure.subgraph;
    this.retryable = failure.retryable;
  }
}

export function isRetryableFailure(failure: unknown): boolean {
  return failure instanceof SubgraphUnavailableError && failure.retryable;
}

export type SubgraphCallOptions = {
  readonly idempotent?: boolean;
  readonly plan?: RetryPlan;
};

const budgetPerSubgraph = new Map<SubgraphName, RetryBudget>();

export function retryBudgetFor(subgraph: SubgraphName): RetryBudget {
  const existing = budgetPerSubgraph.get(subgraph);
  if (existing !== undefined) {
    return existing;
  }
  const created = retryBudget(defaultRetryBudgetSettings);
  budgetPerSubgraph.set(subgraph, created);
  return created;
}

export async function askSubgraph<Data>(
  subgraph: SubgraphName,
  document: string,
  variables: Readonly<Record<string, unknown>>,
  forwarded: ForwardedHeaders,
  options: SubgraphCallOptions = {}
): Promise<Data> {
  if (options.idempotent !== true) {
    return askOnce<Data>(subgraph, document, variables, forwarded);
  }
  const plan = options.plan ?? retryPlan(retryBudgetFor(subgraph));
  return withRetries(plan, isRetryableFailure, () =>
    askOnce<Data>(subgraph, document, variables, forwarded)
  );
}

async function askOnce<Data>(
  subgraph: SubgraphName,
  document: string,
  variables: Readonly<Record<string, unknown>>,
  forwarded: ForwardedHeaders
): Promise<Data> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    origin: internalOrigin,
    ...traceHeadersOfActiveContext()
  };
  if (forwarded.authorization !== null) {
    headers["authorization"] = forwarded.authorization;
  }
  if (forwarded.cookie !== null) {
    headers["cookie"] = forwarded.cookie;
  }

  let response: Response;
  try {
    response = await fetch(subgraphUrl(subgraph), {
      method: "POST",
      headers,
      body: JSON.stringify({ query: document, variables }),
      signal: AbortSignal.timeout(subgraphRequestTimeoutInMilliseconds())
    });
  } catch (failure) {
    throw new SubgraphUnavailableError({
      subgraph,
      reason: failure instanceof Error ? failure.message : String(failure),
      retryable: true
    });
  }

  if (!response.ok) {
    throw new SubgraphUnavailableError({
      subgraph,
      reason: \`status \${response.status}\`,
      retryable: response.status >= 500
    });
  }

  const body = (await response.json()) as { data?: Data; errors?: readonly { message: string }[] };
  if (body.errors !== undefined && body.errors.length > 0) {
    throw new SubgraphUnavailableError({
      subgraph,
      reason: body.errors.map((error) => error.message).join(", "),
      retryable: false
    });
  }
  if (body.data === undefined) {
    throw new SubgraphUnavailableError({ subgraph, reason: "an answer with no data", retryable: false });
  }
  return body.data;
}`;

const RETRY_STORM_TEST_CODE = `  it("stops a retry storm, because a hundred failing calls do not make three hundred retries", async () => {
    const budget = retryBudget({ retryRatio: 0.2, minimumRetriesPerWindow: 5, windowInMilliseconds: 60_000 });
    const plan = planWithoutWaiting(budget, 4);
    let attempts = 0;
    for (let call = 0; call < 100; call = call + 1) {
      await assert.rejects(
        withRetries(plan, () => true, async () => {
          attempts = attempts + 1;
          throw new Error("the downstream is on the floor");
        })
      );
    }
    assert.equal(budget.callsInWindow(), 100);
    assert.ok(budget.retriesInWindow() <= 25);
    assert.ok(attempts <= 125);
    assert.ok(attempts >= 100);
  });`;

const OUTBOX_PUBLISHER_CODE = `import { backoffDelayInMilliseconds, defaultBackoffSettings, type BackoffSettings } from "@zappy/shared";
import type { OrderPlaced } from "../domain/orderPlaced.js";
import type { OrderPlacedConsumers, OutboxRow, OutboxStore } from "./ports.js";

export type OutboxPass = {
  readonly published: number;
  readonly retried: number;
  readonly deadLettered: number;
};

export type OutboxNudge = {
  publishDue(): Promise<OutboxPass>;
};

export type OutboxPublisher = OutboxNudge & {
  startPolling(): void;
  stopPolling(): void;
};

export type OutboxPublisherSettings = {
  readonly attemptBudget: number;
  readonly pollingIntervalInMilliseconds: number;
  readonly backoff: BackoffSettings;
};

export const defaultOutboxPublisherSettings: OutboxPublisherSettings = {
  attemptBudget: 5,
  pollingIntervalInMilliseconds: 2000,
  backoff: defaultBackoffSettings
};

export function outboxPublisher(
  outbox: OutboxStore,
  consumers: OrderPlacedConsumers,
  now: () => Date,
  settings: OutboxPublisherSettings = defaultOutboxPublisherSettings,
  randomFraction: () => number = Math.random
): OutboxPublisher {
  let polling: ReturnType<typeof setInterval> | null = null;

  async function deliver(event: OrderPlaced, eventId: string): Promise<void> {
    await consumers.emptyCart(event.cartId);
    await consumers.clearCartPromotion(event.cartId);
    if (event.promotionCode !== null) {
      await consumers.countPromotionUse(event.promotionCode, event.orderId, eventId);
    }
    await consumers.sendConfirmation(event);
  }

  async function giveUpOrWaitLonger(row: OutboxRow, failure: unknown): Promise<"deadLettered" | "retried"> {
    const attempts = row.attempts + 1;
    const reason = failure instanceof Error ? failure.message : String(failure);
    if (attempts >= settings.attemptBudget) {
      await outbox.markDeadLettered(row.id, attempts, now().toISOString(), reason);
      return "deadLettered";
    }
    const waitInMilliseconds = backoffDelayInMilliseconds(attempts, settings.backoff, randomFraction());
    await outbox.recordFailure(
      row.id,
      attempts,
      new Date(now().getTime() + waitInMilliseconds).toISOString(),
      reason
    );
    return "retried";
  }

  async function publishDue(): Promise<OutboxPass> {
    let published = 0;
    let retried = 0;
    let deadLettered = 0;
    for (const row of await outbox.readDue(now().toISOString())) {
      try {
        await deliver(row.event, row.id);
        await outbox.markPublished(row.id, now().toISOString());
        published = published + 1;
      } catch (failure) {
        const verdict = await giveUpOrWaitLonger(row, failure);
        if (verdict === "deadLettered") {
          deadLettered = deadLettered + 1;
        } else {
          retried = retried + 1;
        }
      }
    }
    return { published, retried, deadLettered };
  }

  return {
    publishDue,

    startPolling(): void {
      if (polling !== null) {
        return;
      }
      polling = setInterval(() => {
        void publishDue().catch(() => undefined);
      }, settings.pollingIntervalInMilliseconds);
      polling.unref();
    },

    stopPolling(): void {
      if (polling === null) {
        return;
      }
      clearInterval(polling);
      polling = null;
    }
  };
}`;

const HANDLED_EVENT_STORE_CODE = `import type { Database } from "../persistence/database.js";

export type HandledEventStore = {
  onlyOnce(eventId: string, consumer: string, work: () => Promise<void>): Promise<boolean>;
  hasHandled(eventId: string, consumer: string): Promise<boolean>;
  forgetEverything(): Promise<void>;
};

export async function createHandledEventTable(database: Database): Promise<void> {
  await database.execute(\`
    create table if not exists handled_event (
      event_id text not null,
      consumer text not null,
      handled_at text not null,
      primary key (event_id, consumer)
    )
  \`);
}

export function sqlHandledEventStore(database: Database, now: () => Date): HandledEventStore {
  async function hasHandled(eventId: string, consumer: string): Promise<boolean> {
    const row = await database.queryOne<{ event_id: string }>(
      "select event_id from handled_event where event_id = ? and consumer = ?",
      [eventId, consumer]
    );
    return row !== null;
  }

  return {
    hasHandled,

    async onlyOnce(eventId: string, consumer: string, work: () => Promise<void>): Promise<boolean> {
      if (await hasHandled(eventId, consumer)) {
        return false;
      }
      await work();
      await database.execute(
        "insert into handled_event (event_id, consumer, handled_at) values (?, ?, ?)",
        [eventId, consumer, now().toISOString()]
      );
      return true;
    },

    async forgetEverything(): Promise<void> {
      await database.execute("delete from handled_event", []);
    }
  };
}`;

const OUTBOX_TESTS_CODE = `  it("picks up the row that survived the crash between the commit and the publish", async () => {
    await placeOneOrder("checkout-crash");
    assert.deepEqual(delivered, []);
    assert.equal((await outbox.readUnpublished()).length, 1);

    const pass = await publisher().publishDue();

    assert.deepEqual(pass, { published: 1, retried: 0, deadLettered: 0 });
    assert.deepEqual(delivered.slice(0, 2), ["emptyCart:cart-01", "clearCartPromotion:cart-01"]);
    assert.equal(delivered.at(-1), "sendConfirmation");
    assert.equal((await outbox.readUnpublished()).length, 0);
  });

  it("carries the outbox row id as the event id, so a consumer can recognise a repeat", async () => {
    await placeOneOrder("checkout-event-id");
    const waiting = await outbox.readUnpublished();
    const rowId = waiting[0]?.id ?? "no row";
    await publisher().publishDue();
    assert.ok(delivered.includes(\`countPromotionUse:WELCOME10:\${rowId}\`));
  });

  it("delivers at least once, so an idempotent consumer counts one use for two deliveries", async () => {
    const handledEvents = sqlHandledEventStore(database, () => clock);
    await handledEvents.forgetEverything();
    let counted = 0;
    const countingConsumers: OrderPlacedConsumers = {
      ...consumers,
      async countPromotionUse(_code: string, _orderId: string, eventId: string): Promise<void> {
        await handledEvents.onlyOnce(eventId, "promotions.countPromotionUse", async () => {
          counted = counted + 1;
        });
      },
      async sendConfirmation(): Promise<void> {
        if (failuresLeft > 0) {
          failuresLeft = failuresLeft - 1;
          throw new Error("the mail service is unreachable");
        }
      }
    };
    const publishing = outboxPublisher(outbox, countingConsumers, () => clock, settings, () => 0);

    await placeOneOrder("checkout-at-least-once");
    failuresLeft = 1;

    await publishing.publishDue();
    await publishing.publishDue();

    assert.equal(counted, 1);
    assert.equal((await outbox.readUnpublished()).length, 0);
  });`;

const CIRCUIT_BREAKER_CODE = `export type CircuitState = "closed" | "open" | "halfOpen";

export type CircuitBreakerSettings = {
  readonly failuresBeforeOpening: number;
  readonly openDurationInMilliseconds: number;
  readonly successesBeforeClosing: number;
};

export const defaultCircuitBreakerSettings: CircuitBreakerSettings = {
  failuresBeforeOpening: 3,
  openDurationInMilliseconds: 5000,
  successesBeforeClosing: 1
};

export class CircuitOpenError extends Error {
  readonly downstream: string;

  constructor(downstream: string) {
    super(\`The circuit to \${downstream} is open, so the call was not attempted.\`);
    this.name = "CircuitOpenError";
    this.downstream = downstream;
  }
}

export type CircuitBreaker = {
  readonly downstream: string;
  state(): CircuitState;
  allowsCall(): boolean;
  recordSuccess(): void;
  recordFailure(): void;
};

export function circuitBreaker(
  downstream: string,
  settings: CircuitBreakerSettings = defaultCircuitBreakerSettings,
  now: () => number = Date.now
): CircuitBreaker {
  let state: CircuitState = "closed";
  let failuresInARow = 0;
  let successesInARow = 0;
  let openedAt = 0;

  function openTheCircuit(): void {
    state = "open";
    openedAt = now();
    failuresInARow = 0;
    successesInARow = 0;
  }

  return {
    downstream,

    state(): CircuitState {
      if (state === "open" && now() - openedAt >= settings.openDurationInMilliseconds) {
        state = "halfOpen";
      }
      return state;
    },

    allowsCall(): boolean {
      return this.state() !== "open";
    },

    recordSuccess(): void {
      failuresInARow = 0;
      if (state !== "halfOpen") {
        state = "closed";
        return;
      }
      successesInARow = successesInARow + 1;
      if (successesInARow >= settings.successesBeforeClosing) {
        state = "closed";
        successesInARow = 0;
      }
    },

    recordFailure(): void {
      if (state === "halfOpen") {
        openTheCircuit();
        return;
      }
      failuresInARow = failuresInARow + 1;
      if (failuresInARow >= settings.failuresBeforeOpening) {
        openTheCircuit();
      }
    }
  };
}

export async function throughCircuitBreaker<Value>(
  breaker: CircuitBreaker,
  work: () => Promise<Value>
): Promise<Value> {
  if (!breaker.allowsCall()) {
    throw new CircuitOpenError(breaker.downstream);
  }
  try {
    const value = await work();
    breaker.recordSuccess();
    return value;
  } catch (failure) {
    breaker.recordFailure();
    throw failure;
  }
}`;

const DEGRADED_READER_CODE = `import { throughCircuitBreaker, type CircuitBreaker } from "@zappy/shared";
import type { CataloguedProduct, CatalogueReader } from "../../application/ports.js";

export type LastKnownProducts = Map<string, CataloguedProduct>;

export function lastKnownProducts(): LastKnownProducts {
  return new Map<string, CataloguedProduct>();
}

export type DegradationCounters = {
  readonly answeredLive: number;
  readonly answeredFromLastKnown: number;
};

export type DegradedCatalogue = {
  readonly reader: CatalogueReader;
  counters(): DegradationCounters;
};

export function degradedCatalogueReader(
  live: CatalogueReader,
  breaker: CircuitBreaker,
  remembered: LastKnownProducts
): DegradedCatalogue {
  let answeredLive = 0;
  let answeredFromLastKnown = 0;

  function remember(products: readonly CataloguedProduct[]): void {
    for (const product of products) {
      remembered.set(product.id, product);
    }
  }

  return {
    reader: {
      async readProduct(productId: string): Promise<CataloguedProduct | null> {
        try {
          const product = await throughCircuitBreaker(breaker, () => live.readProduct(productId));
          answeredLive = answeredLive + 1;
          if (product !== null) {
            remember([product]);
          }
          return product;
        } catch {
          answeredFromLastKnown = answeredFromLastKnown + 1;
          return remembered.get(productId) ?? null;
        }
      },

      async readProducts(productIdentifiers: readonly string[]): Promise<readonly CataloguedProduct[]> {
        try {
          const products = await throughCircuitBreaker(breaker, () =>
            live.readProducts(productIdentifiers)
          );
          answeredLive = answeredLive + 1;
          remember(products);
          return products;
        } catch {
          answeredFromLastKnown = answeredFromLastKnown + 1;
          return productIdentifiers
            .map((identifier) => remembered.get(identifier))
            .filter((product): product is CataloguedProduct => product !== undefined);
        }
      }
    },

    counters(): DegradationCounters {
      return { answeredLive, answeredFromLastKnown };
    }
  };
}`;

const CART_WIRING_CODE = `      const liveCatalogue = entityCatalogueReader(base.forwarded);
      const catalogue = degradedCatalogueReader(liveCatalogue, catalogueBreaker, remembered).reader;
      const cart = changeCart(carts, liveCatalogue, () => systemClock.now());`;

const CHAOS_TEST_CODE = `describe("the graph when the catalogue subgraph is stopped", () => {
  const cartWithItsSubtotal = "{ cart { id lines { id quantity } subtotal { amount currency } } }";

  it("prices the cart from the live catalogue while it is up", async () => {
    await resetSeed();
    client.forgetCookies();
    client.useAccessToken(null);
    const added = await client.ask(
      'mutation { addToCart(productId: "product-18", quantity: 2) { errors { code } } }'
    );
    assert.deepEqual((added.data?.["addToCart"] as { errors: readonly unknown[] }).errors, []);

    const priced = await client.ask(cartWithItsSubtotal);
    assert.deepEqual(priced.errors, []);
    assert.equal((priced.data?.["cart"] as { subtotal: { amount: number } }).subtotal.amount, 1970);
  });

  it("still answers the cart with its subtotal after the catalogue is stopped", async () => {
    const stoppedCatalogue = catalogue;
    assert.ok(stoppedCatalogue !== null);
    running.splice(running.indexOf(stoppedCatalogue), 1);
    await stoppedCatalogue.stop();
    catalogue = null;

    const answer = await client.ask(cartWithItsSubtotal);

    assert.deepEqual(answer.errors, []);
    const degraded = answer.data?.["cart"] as {
      lines: readonly { quantity: number }[];
      subtotal: { amount: number; currency: string };
    };
    assert.equal(degraded.lines.length, 1);
    assert.equal(degraded.lines[0]?.quantity, 2);
    assert.deepEqual(degraded.subtotal, { amount: 1970, currency: "EUR" });
  });

  it("keeps answering while the catalogue stays down, because the circuit is open", async () => {
    for (let repeat = 0; repeat < 5; repeat = repeat + 1) {
      const answer = await client.ask(cartWithItsSubtotal);
      assert.deepEqual(answer.errors, []);
      assert.equal((answer.data?.["cart"] as { subtotal: { amount: number } }).subtotal.amount, 1970);
    }
  });

  it("refuses to add a product while the catalogue is down, because adding needs the stock of the moment", async () => {
    const added = await client.ask(
      'mutation { addToCart(productId: "product-03", quantity: 1) { errors { code } } }'
    );
    assert.equal(added.errors.length, 1);
    assert.match(added.errors[0]?.message ?? "", /catalogue/);
  });
});`;

const QUERY_PLAN_PLUGIN_CODE = `import type { ApolloServerPlugin } from "@apollo/server";
import {
  serializeQueryPlan,
  type PlanNode,
  type QueryPlan,
  type SubscriptionNode
} from "@apollo/query-planner";
import { currentProfile } from "@zappy/shared";
import type { GatewayContext } from "./gatewayContext.js";

export const queryPlanHeaderName = "x-zappy-query-plan";

export const queryPlanExtensionName = "zappyQueryPlan";

export type QueryPlanSummary = {
  readonly plan: string;
  readonly fetchesPerSubgraph: Readonly<Record<string, number>>;
};

export function summariseQueryPlan(queryPlan: QueryPlan): QueryPlanSummary {
  const fetchesPerSubgraph: Record<string, number> = {};
  countFetches(queryPlan.node, fetchesPerSubgraph);
  return { plan: serializeQueryPlan(queryPlan), fetchesPerSubgraph };
}

function countFetches(
  node: PlanNode | SubscriptionNode | undefined,
  tally: Record<string, number>
): void {
  if (node === undefined) {
    return;
  }
  if (node.kind === "Fetch") {
    tally[node.serviceName] = (tally[node.serviceName] ?? 0) + 1;
    return;
  }
  if (node.kind === "Flatten") {
    countFetches(node.node, tally);
    return;
  }
  if (node.kind === "Sequence" || node.kind === "Parallel") {
    for (const child of node.nodes) {
      countFetches(child, tally);
    }
    return;
  }
  if (node.kind === "Condition") {
    countFetches(node.ifClause, tally);
    countFetches(node.elseClause, tally);
    return;
  }
  if (node.kind === "Subscription") {
    countFetches(node.primary, tally);
    countFetches(node.rest, tally);
    return;
  }
  countFetches(node.primary.node, tally);
  for (const deferred of node.deferred) {
    countFetches(deferred.node, tally);
  }
}

export function queryPlanIsAskedFor(headerValue: string | null | undefined): boolean {
  return currentProfile() === "development" && headerValue !== null && headerValue !== undefined;
}

export function queryPlanPlugin(): ApolloServerPlugin<GatewayContext> {
  return {
    async requestDidStart() {
      return {
        async willSendResponse(requestContext) {
          const summary = requestContext.contextValue.rememberedQueryPlan();
          if (summary === null) {
            return;
          }
          if (!queryPlanIsAskedFor(requestContext.request.http?.headers.get(queryPlanHeaderName))) {
            return;
          }
          if (requestContext.response.body.kind !== "single") {
            return;
          }
          requestContext.response.body.singleResult.extensions = {
            ...requestContext.response.body.singleResult.extensions,
            [queryPlanExtensionName]: summary
          };
        }
      };
    }
  };
}`;

const QUERY_PLAN_TEST_CODE = `  it("reads the query plan and shows one batched catalogue fetch for three cart lines", async () => {
    await resetSeed();
    client.forgetCookies();
    client.useAccessToken(null);
    for (const productId of ["product-18", "product-03", "product-05"]) {
      await client.ask(
        "mutation Add($productId: ID!) { addToCart(productId: $productId, quantity: 1) { errors { code } } }",
        { productId }
      );
    }

    const answer = await client.askWithExtraHeaders(
      "{ cart { id lines { quantity product { id name price { amount } } } } }",
      {},
      { [queryPlanHeaderName]: "1" }
    );

    assert.deepEqual(answer.errors, []);
    const summary = answer.extensions[queryPlanExtensionName] as {
      plan: string;
      fetchesPerSubgraph: Record<string, number>;
    };
    assert.deepEqual(summary.fetchesPerSubgraph, { cart: 1, catalogue: 1 });
    assert.match(summary.plan, /Fetch\\(service: "cart"\\)/);
    assert.match(summary.plan, /Fetch\\(service: "catalogue"\\)/);
    assert.equal((summary.plan.match(/Fetch\\(service: "catalogue"\\)/g) ?? []).length, 1);

    const lines = (answer.data?.["cart"] as { lines: readonly { product: { name: string } }[] }).lines;
    assert.equal(lines.length, 3);
    assert.ok(lines.every((line) => line.product.name.length > 0));
  });

  it("hides the query plan from a request that did not ask for it", async () => {
    const answer = await client.ask("{ cart { id } }");
    assert.equal(answer.extensions[queryPlanExtensionName], undefined);
  });`;

const REQUEST_TRACING_CODE = `import type { IncomingHttpHeaders } from "node:http";
import { context, propagation, SpanStatusCode, trace, type Span, type Tracer } from "@opentelemetry/api";
import { ExportResultCode, W3CTraceContextPropagator, type ExportResult } from "@opentelemetry/core";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { SimpleSpanProcessor, type ReadableSpan, type SpanExporter } from "@opentelemetry/sdk-trace-base";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

export const tracerName = "zappy-mart";

export const serviceAttributeName = "zappy.service";

export const rememberedSpanCount = 200;

export type RecordedSpan = {
  readonly name: string;
  readonly service: string;
  readonly traceId: string;
  readonly spanId: string;
  readonly parentSpanId: string | null;
};

export type RememberingSpanExporter = SpanExporter & {
  recorded(): readonly RecordedSpan[];
  forgetEverything(): void;
};

export function rememberingSpanExporter(howMany: number = rememberedSpanCount): RememberingSpanExporter {
  const remembered: RecordedSpan[] = [];

  return {
    export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void {
      for (const span of spans) {
        remembered.push({
          name: span.name,
          service: String(
            span.attributes[serviceAttributeName] ?? span.resource.attributes[ATTR_SERVICE_NAME] ?? tracerName
          ),
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: span.parentSpanContext?.spanId ?? null
        });
      }
      while (remembered.length > howMany) {
        remembered.shift();
      }
      resultCallback({ code: ExportResultCode.SUCCESS });
    },

    async shutdown(): Promise<void> {
      remembered.length = 0;
    },

    async forceFlush(): Promise<void> {
      return undefined;
    },

    recorded(): readonly RecordedSpan[] {
      return [...remembered];
    },

    forgetEverything(): void {
      remembered.length = 0;
    }
  };
}

let installedExporter: RememberingSpanExporter | null = null;

export function startRequestTracing(serviceName: string): RememberingSpanExporter {
  if (installedExporter !== null) {
    return installedExporter;
  }
  const exporter = rememberingSpanExporter();
  const provider = new NodeTracerProvider({
    resource: resourceFromAttributes({ [ATTR_SERVICE_NAME]: serviceName }),
    spanProcessors: [new SimpleSpanProcessor(exporter)]
  });
  provider.register({ propagator: new W3CTraceContextPropagator() });
  installedExporter = exporter;
  return exporter;
}

export function recordedSpans(): readonly RecordedSpan[] {
  return installedExporter === null ? [] : installedExporter.recorded();
}

export function forgetRecordedSpans(): void {
  installedExporter?.forgetEverything();
}

export function tracer(): Tracer {
  return trace.getTracer(tracerName);
}

export function traceHeadersOfActiveContext(): Record<string, string> {
  const carrier: Record<string, string> = {};
  propagation.inject(context.active(), carrier);
  return carrier;
}

export function currentTraceId(): string | null {
  const span = trace.getActiveSpan();
  if (span === undefined) {
    return null;
  }
  const traceId = span.spanContext().traceId;
  return traceId === "00000000000000000000000000000000" ? null : traceId;
}

export function withRequestSpan<Value>(
  serviceName: string,
  spanName: string,
  incomingHeaders: IncomingHttpHeaders,
  work: (span: Span) => Value
): Value {
  const carrier: Record<string, string> = {};
  for (const [name, value] of Object.entries(incomingHeaders)) {
    if (typeof value === "string") {
      carrier[name] = value;
    }
  }
  const parent = propagation.extract(context.active(), carrier);
  const span = tracer().startSpan(spanName, { attributes: { [serviceAttributeName]: serviceName } }, parent);
  return context.with(trace.setSpan(parent, span), () => work(span));
}

export function endSpanWithOutcome(span: Span, failure: unknown): void {
  if (failure !== null) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: failure instanceof Error ? failure.message : String(failure)
    });
  }
  span.end();
}

export type TracedRequest = {
  readonly method: string;
  readonly headers: IncomingHttpHeaders;
};

export type TracedResponse = {
  on(event: "finish", listener: () => void): unknown;
};

export function requestTracingMiddleware(
  serviceName: string
): (request: TracedRequest, response: TracedResponse, next: () => void) => void {
  return (request, response, next) => {
    withRequestSpan(serviceName, \`\${serviceName} \${request.method}\`, request.headers, (span) => {
      response.on("finish", () => {
        span.end();
      });
      next();
    });
  };
}`;

const TRACE_TEST_CODE = `  it("puts the gateway and every subgraph it called on one trace", async () => {
    await resetSeed();
    client.forgetCookies();
    client.useAccessToken(null);
    await client.ask(
      'mutation { addToCart(productId: "product-18", quantity: 1) { errors { code } } }'
    );

    forgetRecordedSpans();
    const answer = await client.ask("{ cart { id lines { quantity product { id name } } } }");
    assert.deepEqual(answer.errors, []);

    const spans = recordedSpans();
    const gatewaySpan = spans.find((span) => span.service === "gateway");
    assert.ok(gatewaySpan !== undefined);
    const onTheSameTrace = spans.filter((span) => span.traceId === gatewaySpan.traceId);
    const services = new Set(onTheSameTrace.map((span) => span.service));
    assert.ok(services.has("gateway"));
    assert.ok(services.has("cart"));
    assert.ok(services.has("catalogue"));
    assert.equal(new Set(onTheSameTrace.map((span) => span.traceId)).size, 1);
  });`;

const WORKFLOW_CODE = `name: Node federated graph

on:
  push:
    branches: [main]
    paths:
      - "backends/node/**"
      - "contract/**"
      - ".github/workflows/node.yml"
      - "tools/conformance/**"
  pull_request:
    paths:
      - "backends/node/**"
      - "contract/**"
      - ".github/workflows/node.yml"
      - "tools/conformance/**"

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backends/node
    env:
      ZAPPY_SUBGRAPH_TIMEOUT_MILLISECONDS: 15000
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
          cache-dependency-path: backends/node/package-lock.json
      - run: npm ci
      - run: npm run build
      - run: npm run compose
      - run: npm run contract-diff
      - run: npm test
      - run: npm ci
        working-directory: tools/conformance
      - run: node tools/run-conformance.mjs
      - run: node tools/run-conformance.mjs`;

const ADD_TO_CART_ANSWER_CODE = `{
  "data": {
    "addToCart": {
      "cart": {
        "id": "cart-8000c773",
        "lines": [
          {
            "id": "line-4deafe31",
            "quantity": 2,
            "product": {
              "id": "product-18",
              "name": "MBJ Women's Solid Short Sleeve Boat Neck V",
              "price": { "amount": 985 }
            },
            "lineTotal": { "amount": 1970, "currency": "EUR" }
          }
        ],
        "promotion": null,
        "subtotal": { "amount": 1970 },
        "shipping": { "amount": 495 },
        "total": { "amount": 2465 },
        "updatedAt": "2026-09-09T00:39:06Z"
      },
      "availableStock": null,
      "errors": []
    }
  }
}`;

const CONTRACT_DIFF_OUTPUT_CODE = `$ npm run contract-diff

the production graph matches the contract
the development graph matches the contract`;

const ORIGIN_REFUSAL_CODE = `403

{
  "errors": [
    {
      "message": "A mutation needs an Origin header this store allows.",
      "extensions": { "code": "ORIGIN_NOT_ALLOWED" }
    }
  ]
}`;

const HTTP_EDGES_CODE = `GET http://localhost:4100/ready
200 {"gateway":"zappy-mart","subgraphs":[{"name":"catalogue","ready":true},{"name":"cart","ready":true},{"name":"promotions","ready":true},{"name":"ordering","ready":true},{"name":"accounts","ready":true}]}

GET http://localhost:4101/health
200 {"subgraph":"catalogue","status":"alive"}

GET http://localhost:4105/.well-known/jwks.json
200
{
  "keys": [
    {
      "kty": "RSA",
      "n": "s1wYM_6kEOtBF6zcgiCfrUhY...",
      "e": "AQAB",
      "kid": "rhR_UogcDUbyQtN8",
      "alg": "RS256",
      "use": "sig"
    }
  ]
}

POST http://localhost:4104/webhooks/payment
{"orderNumber":"ZM-000001","status":"settled","reference":"simulated-payment-01"}

202 {"received":true}`;

const WALKTHROUGH_CODE = `cd backends/node

npm install
npm run generate
npm run compose
npm run contract-diff
npm run build
npm test
npm start

node tools/run-conformance.mjs`;

const TEST_OUTPUT_CODE = `$ npm test

tests 231
suites 45
pass 231
fail 0

$ node tools/run-conformance.mjs

34 documents match contract/schema.graphql and contract/schema.development.graphql
seed loaded, 20 products
   1/33  catalogue-list                  matches
   2/33  catalogue-filter-by-category    matches
   ...
  33/33  mutation-without-origin         matches
33 of 33 scenarios matched contract/expected`;
const COPY = {
  contentsLabel: { en: "In this article", nl: "In dit artikel" },
  lead: {
    en: "A federated graph is one schema in front of many owners. The client sends one query, a planner splits it across the services that hold the fields, and the answer comes back as though a single server had written it. This walks through one I built end to end, with the file behind every decision.",
    nl: "Een federated graph is één schema voor veel eigenaren. De client stuurt één query, een planner verdeelt hem over de services die de velden hebben, en het antwoord komt terug alsof één server het had geschreven. Dit loopt door een graph die ik van begin tot eind bouwde, met het bestand achter elke beslissing.",
  },
  intro1: {
    en: "Every article I write stands on code that runs. Zappy Mart is one small web store built seven times over on one GraphQL contract: three hexagonal monoliths in C#, Java and Kotlin, three store fronts on React Router, Next.js and Angular, and the same store once more as five services behind one graph. That last one is this article. A client cannot tell the two shapes apart, because the same thirty three conformance scenarios run against both and the composed schema has to equal the contract file exactly.",
    nl: "Elk artikel dat ik schrijf staat op code die draait. Zappy Mart is één kleine webwinkel die zeven keer is gebouwd op één GraphQL-contract: drie hexagonale monolieten in C#, Java en Kotlin, drie winkels op React Router, Next.js en Angular, en dezelfde winkel nog eens als vijf services achter één graph. Die laatste is dit artikel. Een client ziet het verschil tussen de twee vormen niet, want dezelfde drieëndertig conformance-scenario's draaien tegen allebei en het samengestelde schema moet exact gelijk zijn aan het contractbestand.",
  },
  intro2: {
    en: "The graph is the interesting half. Five subgraphs, five databases, one composed supergraph, and underneath it the nine things a store this shape has to guarantee: a cache that is invalidated, a saga across two services, an idempotency key on the checkout, retries with a budget, an outbox with at least once delivery, a circuit breaker, batched entity reads, query plans you can read, and one trace per request. Each one has a file whose name says what it is, a test that proves it, and a trade-off written next to it. That is the shape of this article too.",
    nl: "De graph is de interessante helft. Vijf subgraphs, vijf databases, één samengestelde supergraph, en eronder de negen dingen die een winkel in deze vorm moet garanderen: een cache die geïnvalideerd wordt, een saga over twee services, een idempotentiesleutel op de afrekening, retries met een budget, een outbox met at-least-once-bezorging, een circuit breaker, gebundelde entity-reads, queryplannen die je kunt lezen, en één trace per verzoek. Elk daarvan heeft een bestand waarvan de naam zegt wat het is, een test die het bewijst, en een afweging die ernaast staat. Zo is dit artikel ook opgebouwd.",
  },
  intro3: {
    en: "One thing to say at the top, because it changes how you should read the rest. Federation in production is not on my record. At bol.com the GraphQL schema was the contract between the frontend and the backend teams, which is the problem federation is built for, and that engagement gets its own paragraph near the end. The graph here is mine, built in the open so that every decision in it can be read, argued with and run on your own machine.",
    nl: "Eén ding vooraf, want het bepaalt hoe je de rest moet lezen. Federation in productie staat niet op mijn cv. Bij bol.com was het GraphQL-schema het contract tussen de frontend en de backendteams, en dat is precies het probleem waarvoor federation gemaakt is. Die opdracht krijgt verderop een eigen alinea. De graph hier is van mij, in het openbaar gebouwd, zodat elke beslissing erin te lezen, te bekritiseren en op je eigen machine te draaien is.",
  },
  versionNote: {
    en: "The versions were read from the project's own table on 9 September 2026: Node.js 24.20.0, Apollo Server 5.5.1 with @apollo/subgraph 2.15.0, @apollo/gateway 2.14.4 with @apollo/composition and @apollo/federation-internals at that same 2.14.4, Express 5.2.1, dataloader 2.2.3, jose 6.2.12, TypeScript 6.0.3, @opentelemetry/api 1.9.1 with the Node tracing SDK at 2.11.0, and Apollo Router 2.16.3 as the version router.yaml is written for. The store keeps its rows in SQLite through node:sqlite, which Node 24 ships, and a PostgreSQL 18 adapter sits behind the same port. That adapter is written and unverified, because there is no Docker on the machine I built this on, and the section that names PostgreSQL says so again.",
    nl: "De versies zijn op 9 september 2026 uit de eigen versietabel van het project gelezen: Node.js 24.20.0, Apollo Server 5.5.1 met @apollo/subgraph 2.15.0, @apollo/gateway 2.14.4 met @apollo/composition en @apollo/federation-internals op diezelfde 2.14.4, Express 5.2.1, dataloader 2.2.3, jose 6.2.12, TypeScript 6.0.3, @opentelemetry/api 1.9.1 met de Node-tracing-SDK op 2.11.0, en Apollo Router 2.16.3 als de versie waarvoor router.yaml geschreven is. De winkel bewaart zijn rijen in SQLite via node:sqlite, dat in Node 24 zit, en achter dezelfde poort staat een PostgreSQL 18-adapter. Die adapter is geschreven en niet geverifieerd, want er staat geen Docker op de machine waarop ik dit bouwde, en de sectie die PostgreSQL noemt zegt dat nog een keer.",
  },
  graphqlVersionNote: {
    en: "One version number needs its own sentence. The graphql package here is 16.14.2, the newest of the 16 line, because Apollo Server, @apollo/subgraph, @apollo/gateway and @apollo/composition all declare that line as their peer. The reference implementation is at 17.0.2, and the one part of this project that runs it is the conformance runner, which is a separate package with its own dependencies. A federated backend on Node.js today lives on graphql 16.",
    nl: "Eén versienummer verdient een eigen zin. Het pakket graphql is hier 16.14.2, de nieuwste van de 16-lijn, omdat Apollo Server, @apollo/subgraph, @apollo/gateway en @apollo/composition die lijn allemaal als peer opgeven. De referentie-implementatie staat op 17.0.2, en het enige onderdeel van dit project dat daarop draait is de conformance-runner, een apart pakket met eigen dependencies. Een federated backend op Node.js leeft vandaag op graphql 16.",
  },
  quote: {
    en: "One schema is a promise to every team behind it. Composition is what turns that promise into a build step, and a build step is the only kind of promise that survives a busy quarter.",
    nl: "Eén schema is een belofte aan elk team dat erachter staat. Compositie maakt van die belofte een bouwstap, en een bouwstap is de enige soort belofte die een druk kwartaal overleeft.",
  },

  nodeClient: { en: "The client", nl: "De client" },
  nodeClientSub: { en: "one schema, one query", nl: "één schema, één query" },
  nodeGateway: { en: "Gateway", nl: "Gateway" },
  nodeGatewaySub: { en: "supergraph and query plan", nl: "supergraph en queryplan" },
  nodeCatalogueSub: { en: "products, categories, stock", nl: "producten, categorieën, voorraad" },
  nodeCartSub: { en: "lines and quantities", nl: "regels en aantallen" },
  nodePromotionsSub: { en: "codes, shipping, total", nl: "codes, verzending, totaal" },
  nodeOrderingSub: { en: "orders and the outbox", nl: "bestellingen en de outbox" },
  nodeAccountsSub: { en: "customers, sessions, tokens", nl: "klanten, sessies, tokens" },
  nodeProductSub: { en: "@key(fields: \"id\"), owned by catalogue", nl: "@key(fields: \"id\"), van catalogue" },
  nodeCartEntitySub: { en: "@key(fields: \"id\"), owned by cart", nl: "@key(fields: \"id\"), van cart" },
  edgeOneQuery: { en: "one query", nl: "één query" },
  edgeOwns: { en: "owns", nl: "bezit" },
  edgeRefers: { en: "refers", nl: "verwijst" },
  edgeWishlist: { en: "wishlist", nl: "wenslijst" },
  graphAria: {
    en: "Diagram: a client sends one query to the gateway, the gateway calls five subgraphs, and dotted lines show which subgraph owns the Product and Cart entities and which ones only hold a reference",
    nl: "Diagram: een client stuurt één query naar de gateway, de gateway roept vijf subgraphs aan, en stippellijnen laten zien welke subgraph de entities Product en Cart bezit en welke er alleen naar verwijzen",
  },
  graphCaption: {
    en: "The client sees one graph. Each subgraph owns its entities and resolves the references the others hold.",
    nl: "De client ziet één graph. Elke subgraph bezit zijn eigen entities en lost de verwijzingen op die de andere vasthouden.",
  },

  nodeKey: { en: "placeOrder(idempotencyKey)", nl: "placeOrder(idempotencyKey)" },
  nodeKeySub: { en: "the same key answers the same order", nl: "dezelfde sleutel, dezelfde bestelling" },
  nodeRead: { en: "ordering reads the cart", nl: "ordering leest het mandje" },
  nodeReadSub: { en: "from cart, catalogue and promotions", nl: "bij cart, catalogue en promotions" },
  nodeReserve: { en: "catalogue reserves the stock", nl: "catalogue reserveert de voorraad" },
  nodeReserveSub: { en: "every line or none, under that key", nl: "elke regel of geen, onder die sleutel" },
  nodeCommit: { en: "One transaction", nl: "Eén transactie" },
  nodeCommitSub: { en: "the order, its lines and one outbox row", nl: "de bestelling, de regels, één outboxregel" },
  nodeRelease: { en: "The reservation goes back", nl: "De reservering gaat terug" },
  nodeReleaseSub: { en: "no stock is held without an order", nl: "geen voorraad zonder bestelling" },
  nodeNudge: { en: "The publisher is nudged", nl: "De publisher krijgt een zetje" },
  nodeNudgeSub: { en: "and polls every two seconds", nl: "en polt elke twee seconden" },
  nodeConsumers: { en: "The consumers run", nl: "De consumers draaien" },
  nodeConsumersSub: { en: "cart emptied, code cleared, mail addressed", nl: "mandje leeg, code weg, mail geadresseerd" },
  nodeGuard: { en: "Counting a use is keyed by the event id", nl: "Een gebruik tellen gaat op de event-id" },
  nodeGuardSub: { en: "so a repeat changes nothing", nl: "een herhaling verandert niets" },
  edgeNoStoredOrder: { en: "no stored order", nl: "niets opgeslagen" },
  edgeReserved: { en: "reserved", nl: "gereserveerd" },
  edgeOnFailure: { en: "on failure", nl: "bij een fout" },
  edgeCommitted: { en: "committed", nl: "gecommit" },
  edgeAtLeastOnce: { en: "at least once", nl: "at least once" },
  placeOrderAria: {
    en: "Diagram: placing an order runs from the idempotency key through the reads, the stock reservation and one transaction, and on failure the reservation is released, while the outbox publisher delivers the event to consumers at least once",
    nl: "Diagram: een bestelling plaatsen loopt van de idempotentiesleutel via de reads, de voorraadreservering en één transactie, en bij een fout gaat de reservering terug, terwijl de outbox-publisher het event minstens één keer bij de consumers bezorgt",
  },
  placeOrderCaption: {
    en: "The order and its outbox row commit together, the publisher retries until the consumers acknowledge, and the consumers ignore what they have seen.",
    nl: "De bestelling en de outboxregel worden samen gecommit, de publisher blijft het proberen tot de consumers antwoorden, en de consumers negeren wat ze al gezien hebben.",
  },

  ownersTitle: { en: "One schema, many owners", nl: "Eén schema, veel eigenaren" },
  owners1: {
    en: "A store is five different jobs. A catalogue changes slowly and is read on every page. A cart changes on every click and is read by one visitor. Promotions are rules that marketing wants to change without a release. Orders are money and have to be exactly right. Accounts are the part with the strictest rules around it. In a company of any size those five jobs belong to different teams, with different release rhythms and different people on call.",
    nl: "Een winkel bestaat uit vijf verschillende taken. Een catalogus verandert traag en wordt op elke pagina gelezen. Een winkelmandje verandert bij elke klik en wordt door één bezoeker gelezen. Promoties zijn regels die marketing wil aanpassen zonder release. Bestellingen gaan over geld en moeten precies kloppen. Accounts zijn het deel met de strengste regels eromheen. In een bedrijf van enige omvang horen die vijf taken bij verschillende teams, met verschillende releaseritmes en verschillende mensen die piket draaien.",
  },
  owners2: {
    en: "Five teams is the easy part. One API for the customer is the hard part, and there are three shapes a company reaches for.",
    nl: "Vijf teams is het makkelijke deel. Eén API voor de klant is het moeilijke deel, en daar zijn drie vormen voor die bedrijven kiezen.",
  },
  shapeOneLabel: { en: "One schema in one service.", nl: "Eén schema in één service." },
  shapeOneBody: {
    en: "Every team commits into the same repository and the same process. It is the simplest thing to explain, and the merge queue and the deploy calendar become the thing everybody waits for.",
    nl: "Elk team commit in dezelfde repository en hetzelfde proces. Het is het makkelijkst uit te leggen, en de merge queue en de deploykalender worden waar iedereen op wacht.",
  },
  shapeTwoLabel: { en: "A gateway that stitches by hand.", nl: "Een gateway die met de hand aan elkaar knoopt." },
  shapeTwoBody: {
    en: "One service calls the others and writes the joining code itself. Every new field touches it. The stitching layer grows into a service with no clear owner, and it is the one every team has to ask for a change.",
    nl: "Eén service roept de andere aan en schrijft de koppelcode zelf. Elk nieuw veld raakt hem. De koppellaag groeit uit tot een service zonder duidelijke eigenaar, en het is degene aan wie elk team een wijziging moet vragen.",
  },
  shapeThreeLabel: { en: "Federation.", nl: "Federation." },
  shapeThreeBody: {
    en: "Each team writes the part of the schema it owns, as a normal GraphQL schema with a few directives. A build step composes those parts into one supergraph. A router reads the supergraph, plans each query, and calls only the services that hold the fields the query asked for. Nobody writes joining code, because the keys in the schema say how the parts fit.",
    nl: "Elk team schrijft het deel van het schema dat het bezit, als een gewoon GraphQL-schema met een paar directives. Een bouwstap stelt die delen samen tot één supergraph. Een router leest de supergraph, plant elke query, en roept alleen de services aan die de gevraagde velden hebben. Niemand schrijft koppelcode, want de keys in het schema zeggen hoe de delen op elkaar passen.",
  },
  owners3: {
    en: "This store is federation. Five subgraphs, each a small hexagon in TypeScript with its own schema, its own database, its own tests and its own container. The module names are the ones the monolith versions of this store use, so a reader can watch module boundaries become service boundaries without anything else changing.",
    nl: "Deze winkel is federation. Vijf subgraphs, elk een kleine hexagon in TypeScript met een eigen schema, een eigen database, eigen tests en een eigen container. De modulenamen zijn dezelfde als in de monolietversies van deze winkel, zodat een lezer modulegrenzen servicegrenzen ziet worden zonder dat er verder iets verandert.",
  },
  subgraphTableCaption: {
    en: "The five subgraphs of the store, what each one owns, and the events it publishes and consumes.",
    nl: "De vijf subgraphs van de winkel, wat elk ervan bezit, en welke events het publiceert en verwerkt.",
  },
  headerSubgraph: { en: "Subgraph", nl: "Subgraph" },
  headerOwns: { en: "Owns", nl: "Bezit" },
  headerReferences: { en: "References", nl: "Verwijst naar" },
  headerPublishes: { en: "Publishes", nl: "Publiceert" },
  headerConsumes: { en: "Consumes", nl: "Verwerkt" },
  owners4: {
    en: "The gateway listens on 4100 and the five subgraphs on 4101 to 4105. Drawn out, the shape is a client that knows one address, a gateway that knows the supergraph, and five services that know only their own tables and the keys of the entities they refer to.",
    nl: "De gateway luistert op 4100 en de vijf subgraphs op 4101 tot en met 4105. Uitgetekend is de vorm een client die één adres kent, een gateway die de supergraph kent, en vijf services die alleen hun eigen tabellen kennen en de keys van de entities waarnaar ze verwijzen.",
  },

  entitiesTitle: { en: "Subgraphs, entities and keys", nl: "Subgraphs, entities en keys" },
  entities1: {
    en: "An entity is a type that more than one subgraph can talk about, identified by a key. The catalogue owns Product, so its schema is where the key is declared and where every field of a product lives. Two other directives appear here as well. @shareable marks a type that several subgraphs may serve, which is why Money is declared in four of the five schemas. @inaccessible marks a field that is composed into the supergraph and then removed from the API schema, which is how an internal capability lives inside a federated graph without leaking into the public contract.",
    nl: "Een entity is een type waar meer dan één subgraph over kan praten, herkenbaar aan een key. De catalogue bezit Product, dus in dat schema staat de key en staan alle velden van een product. Er komen hier nog twee directives voorbij. @shareable markeert een type dat meerdere subgraphs mogen serveren, en daarom staat Money in vier van de vijf schema's. @inaccessible markeert een veld dat wel in de supergraph wordt samengesteld en er daarna uit het API-schema wordt gehaald, en zo leeft een interne mogelijkheid binnen een federated graph zonder in het publieke contract te lekken.",
  },
  entities2: {
    en: "Look at the last two mutations. reserveStock and releaseStock are how ordering takes stock out of the catalogue during a checkout. They are part of the graph, they are typed, they are tested, and a client that reads the public schema never sees them. Only a caller that talks to port 4101 directly can reach them.",
    nl: "Kijk naar de laatste twee mutations. reserveStock en releaseStock zijn hoe ordering tijdens een afrekening voorraad uit de catalogus haalt. Ze horen bij de graph, ze zijn getypeerd, ze zijn getest, en een client die het publieke schema leest ziet ze nooit. Alleen een aanroeper die rechtstreeks met poort 4101 praat, komt erbij.",
  },
  entities3: {
    en: "The cart owns a cart and nothing else. It keeps a product id and a quantity, and it never stores a price, because the price of the moment belongs to the catalogue. So the cart declares Product with resolvable: false, which is federation's way of saying that this subgraph names the type without being able to answer anything about it. The gateway takes the id, goes to the catalogue, and fills the rest in.",
    nl: "Het mandje bezit een mandje en verder niets. Het bewaart een product-id en een aantal, en nooit een prijs, want de prijs van dat moment is van de catalogus. Daarom declareert cart het type Product met resolvable: false, wat in federation betekent dat deze subgraph het type wel noemt maar er niets over kan beantwoorden. De gateway pakt de id, gaat naar de catalogus, en vult de rest in.",
  },
  entities4: {
    en: "Then the sharpest part of federation, and the part worth reading slowly. The promotions subgraph owns three fields of an entity somebody else owns. A cart's discount, its shipping and its total are promotion rules, so they belong to promotions. Working them out needs the subtotal, and the subtotal belongs to cart. @external says the field is somebody else's and @requires says which of those foreign fields this resolver needs. The gateway then reads the subtotal from cart, hands it to promotions inside the entity representation, and promotions answers the three amounts.",
    nl: "Dan het scherpste deel van federation, en het deel dat je rustig moet lezen. De subgraph promotions bezit drie velden van een entity die van iemand anders is. De korting van een mandje, de verzendkosten en het totaal zijn promotieregels, dus die horen bij promotions. Om ze uit te rekenen is het subtotaal nodig, en het subtotaal is van cart. @external zegt dat het veld van een ander is en @requires zegt welke van die vreemde velden deze resolver nodig heeft. De gateway leest het subtotaal dan bij cart, geeft het aan promotions mee in de entity-representatie, en promotions antwoordt met de drie bedragen.",
  },
  entities4b: {
    en: "Between those two blocks the promotions schema repeats Money, UserError, UserErrorCode and CartPayload with @shareable. Every subgraph that serves a shared type declares it, and composition checks that the declarations agree. The mutations at the bottom carry the same @inaccessible pattern as the catalogue: applying and removing a code is public, clearing a cart's promotion and counting a use are internal.",
    nl: "Tussen die twee blokken herhaalt het promotions-schema Money, UserError, UserErrorCode en CartPayload met @shareable. Elke subgraph die een gedeeld type serveert declareert het, en de compositie controleert of die declaraties overeenkomen. De mutations onderaan dragen hetzelfde @inaccessible-patroon als de catalogus: een code toepassen en verwijderen is publiek, de promotie van een mandje wissen en een gebruik tellen zijn intern.",
  },
  requiresCalloutTitle: { en: "Where a business rule lives", nl: "Waar een bedrijfsregel woont" },
  requiresCalloutBody: {
    en: "@requires is what lets the totals rule live in exactly one file, subgraphs/promotions/src/domain/totals.ts. Shipping is 495 cents, and it is zero when the cart is empty, when the subtotal reaches 5000, or when a free shipping code applies. Because promotions answers the total, ordering copies the amounts onto the order and never works them out again. Two services that both compute a total are two services that will one day disagree.",
    nl: "Dankzij @requires woont de totalenregel in precies één bestand, subgraphs/promotions/src/domain/totals.ts. Verzending kost 495 cent, en is nul als het mandje leeg is, als het subtotaal 5000 haalt, of als er een code voor gratis verzending geldt. Omdat promotions het totaal antwoordt, kopieert ordering de bedragen naar de bestelling en rekent ze nooit opnieuw uit. Twee services die allebei een totaal berekenen, zijn twee services die het op een dag oneens zijn.",
  },
  entities5: {
    en: "A key is only half a promise. The other half is the reference resolver: the function the owning subgraph runs when the gateway hands it a bare id. A cart with twenty lines makes the gateway ask for twenty products at once, so that function reads through a DataLoader built fresh for every request. Twenty ids become one database read.",
    nl: "Een key is maar de helft van een belofte. De andere helft is de reference resolver: de functie die de bezittende subgraph draait als de gateway hem een kale id aanreikt. Bij een mandje met twintig regels vraagt de gateway twintig producten tegelijk op, dus die functie leest via een DataLoader die per verzoek opnieuw wordt gemaakt. Twintig ids worden één databaseread.",
  },
  entities6: {
    en: "The same batching happens in the other direction. When the cart needs a price to work out a line total, it asks the catalogue through the _entities field of the federation specification, with one representation per product. The loader here lives one request long as well, so twenty lineTotal resolvers and one subtotal cost the catalogue one call.",
    nl: "Dezelfde bundeling gebeurt in de andere richting. Als het mandje een prijs nodig heeft om een regeltotaal uit te rekenen, vraagt het de catalogus via het _entities-veld uit de federation-specificatie, met één representatie per product. Ook deze loader leeft één verzoek lang, dus twintig lineTotal-resolvers en één subtotaal kosten de catalogus één aanroep.",
  },
  entities7: {
    en: "One thing in that file was a bug for an afternoon and is worth naming. DataLoader has a loadMany that takes a list of keys, and it turns a batch failure into values in the returned array and never rejects. A cart whose catalogue was down therefore looked like a cart of empty products, and no error reached anybody. The file now maps load over the identifiers and awaits them together, so a failure is a failure. The chaos test in the resilience section is what caught it.",
    nl: "Eén ding in dat bestand was een middag lang een bug en verdient een naam. DataLoader heeft een loadMany die een lijst keys aanneemt, en die zet een mislukte batch om in waarden in de teruggegeven array en faalt nooit. Een mandje waarvan de catalogus plat lag zag er daardoor uit als een mandje met lege producten, en er bereikte niemand een fout. Het bestand mapt nu load over de identifiers en wacht ze samen af, zodat een fout ook een fout is. De chaostest in de sectie over veerkracht heeft dat gevonden.",
  },
  entities8: {
    en: "Put those pieces together and one mutation from a browser touches four services. This is the answer to addToCart, captured from the running graph on 9 September 2026.",
    nl: "Zet die stukken bij elkaar en één mutation uit een browser raakt vier services. Dit is het antwoord op addToCart, op 9 september 2026 opgevangen uit de draaiende graph.",
  },

  compositionTitle: { en: "Composing the supergraph, and the contract it must match", nl: "De supergraph samenstellen, en het contract waaraan hij moet voldoen" },
  composition1: {
    en: "Composition is a build step, and in this project it is fifty lines of script. composeServices from @apollo/composition takes the five schemas with the url each one listens on and answers either a supergraph document or a list of errors that name the field that broke. There are two profiles, because the development graph carries one extra mutation that reloads the seed data and production carries none.",
    nl: "Compositie is een bouwstap, en in dit project is dat vijftig regels script. composeServices uit @apollo/composition neemt de vijf schema's met de url waarop elk luistert, en antwoordt met een supergraph-document of met een lijst fouten die het veld noemen dat het brak. Er zijn twee profielen, want de ontwikkelgraph draagt één extra mutation die de seeddata opnieuw laadt en productie draagt die niet.",
  },
  composition2: {
    en: "The composed file is not a schema a person writes. It is a plan. Every field carries a join__field directive that says which subgraph answers it, every entity carries a join__type that says which subgraphs hold a key for it, and an enum at the bottom maps each subgraph name to its address. Here is the Cart from the last section as the composer wrote it, with the graph enum underneath.",
    nl: "Het samengestelde bestand is geen schema dat een mens schrijft. Het is een plan. Elk veld draagt een join__field-directive die zegt welke subgraph het beantwoordt, elke entity draagt een join__type die zegt welke subgraphs er een key voor hebben, en een enum onderaan koppelt elke subgraphnaam aan zijn adres. Hier is de Cart uit de vorige sectie zoals de composer hem schreef, met de graph-enum eronder.",
  },
  composition3: {
    en: "Composition proves that the five parts fit each other. It does not prove that the result is the API the store promised. That is a second script. It builds the supergraph, extracts the API schema from it with @apollo/federation-internals, and compares every type, field, argument, default value and enum value with the contract file that all seven implementations of this store share.",
    nl: "Compositie bewijst dat de vijf delen op elkaar passen. Het bewijst niet dat het resultaat de API is die de winkel beloofd heeft. Daar is een tweede script voor. Dat bouwt de supergraph, haalt er met @apollo/federation-internals het API-schema uit, en vergelijkt elk type, veld, argument, standaardwaarde en enumwaarde met het contractbestand dat alle zeven implementaties van deze winkel delen.",
  },
  composition3b: {
    en: "The middle of that file is ordinary code that walks two type maps and collects differences. The two ends are the parts worth having. Descriptions and ordering are ignored, because the contract carries the prose and the subgraph schemas carry the shape. Everything else is compared exactly, in both directions, so a field the graph adds fails just as loudly as a field it drops.",
    nl: "Het middendeel van dat bestand is gewone code die twee typemaps doorloopt en verschillen verzamelt. De twee uiteinden zijn het deel dat ertoe doet. Beschrijvingen en volgorde worden genegeerd, want het contract draagt de tekst en de subgraphschema's dragen de vorm. Al het andere wordt exact vergeleken, in beide richtingen, dus een veld dat de graph toevoegt faalt net zo hard als een veld dat hij weglaat.",
  },
  composition4: {
    en: "Then the process that serves it. ApolloGateway reads the composed file from disk, so no subgraph is asked anything at start-up and the graph a deploy serves is the graph that was checked. Around it sit the ordinary Apollo Server pieces: CORS for the three frontend origins with credentials allowed, a body limit, an origin check plugin, a plugin that carries the query plan, and health and readiness routes.",
    nl: "Dan het proces dat hem serveert. ApolloGateway leest het samengestelde bestand van schijf, dus bij het opstarten wordt aan geen enkele subgraph iets gevraagd en is de graph die een deploy serveert de graph die gecontroleerd is. Eromheen staan de gewone Apollo Server-onderdelen: CORS voor de drie frontendorigins met credentials toegestaan, een bodylimiet, een plugin voor de origincheck, een plugin die het queryplan meedraagt, en routes voor health en readiness.",
  },
  composition5: {
    en: "Header propagation is the piece that makes a distributed security model possible, and it is twenty lines. The gateway copies the authorization, cookie and origin headers of the incoming request onto every subgraph request, writes the current trace context into a traceparent header, tags the request with the subgraph name, and hands any set-cookie header from a subgraph back to the browser.",
    nl: "Header-propagatie is het onderdeel dat een gedistribueerd beveiligingsmodel mogelijk maakt, en het zijn twintig regels. De gateway kopieert de headers authorization, cookie en origin van het inkomende verzoek naar elk subgraphverzoek, schrijft de huidige tracecontext in een traceparent-header, labelt het verzoek met de subgraphnaam, en geeft een set-cookie-header van een subgraph terug aan de browser.",
  },
  composition6: {
    en: "In production the process above is a Rust binary. Apollo Router takes the same supergraph file unchanged and reads a configuration file where this gateway has code. Everything the gateway does here appears there as yaml: the listen address and the graph path, the health endpoint, CORS with set-cookie exposed, propagation of the three headers, and a timeout per subgraph.",
    nl: "In productie is het proces hierboven een Rust-binary. Apollo Router neemt hetzelfde supergraph-bestand ongewijzigd en leest een configuratiebestand waar deze gateway code heeft. Alles wat de gateway hier doet, staat daar als yaml: het luisteradres en het graphpad, het health-endpoint, CORS met set-cookie zichtbaar, propagatie van de drie headers, en een timeout per subgraph.",
  },
  composition7: {
    en: "Two commands swap the engine. The router is started with the supergraph and the configuration file, and nothing else in the project changes.",
    nl: "Twee commando's wisselen de motor om. De router wordt gestart met de supergraph en het configuratiebestand, en verder verandert er niets in het project.",
  },
  routerCalloutTitle: { en: "Written for the router, run on the gateway", nl: "Geschreven voor de router, gedraaid op de gateway" },
  routerCalloutBody: {
    en: "router.yaml is written for Apollo Router 2.16.3 and it is unrun here. The antivirus on the machine I built this on blocks unsigned downloaded executables, which stops both the router binary and the Rover binary that fetches the composition plugin. So this project composes with a script and checks the contract with a script, and both are in this article. A reader whose machine runs the binaries swaps in the two commands above and changes nothing else. What the router adds is worth naming: a compiled query planner and execution engine, and automatic persisted queries, response caching, rate limits, coprocessors and OpenTelemetry export as configuration.",
    nl: "router.yaml is geschreven voor Apollo Router 2.16.3 en is hier niet gedraaid. De antivirus op de machine waarop ik dit bouwde blokkeert ongesigneerde gedownloade executables, en dat stopt zowel de routerbinary als de Rover-binary die de compositieplugin ophaalt. Daarom stelt dit project samen met een script en controleert het het contract met een script, en allebei staan ze in dit artikel. Wie de binaries wel kan draaien, zet de twee commando's hierboven ervoor in de plaats en verandert verder niets. Wat de router toevoegt is het noemen waard: een gecompileerde queryplanner en uitvoeringsmotor, en automatic persisted queries, response caching, rate limits, coprocessors en OpenTelemetry-export als configuratie.",
  },
  composition8: {
    en: "The important sentence in that box is the first one. The supergraph file is the interface between composition and execution. Everything in this article about keys, plans and limits holds under either engine, because both read the same document.",
    nl: "De belangrijke zin in dat kader is de eerste. Het supergraph-bestand is het raakvlak tussen compositie en uitvoering. Alles in dit artikel over keys, plannen en limieten geldt onder beide motoren, want ze lezen allebei hetzelfde document.",
  },

  migrationTitle: { en: "Away from REST, one capability at a time", nl: "Weg van REST, één onderdeel tegelijk" },
  migration1: {
    en: "This backend has no REST on the client side at all, which is a decision and not an accident. A federated graph is the shape a REST estate moves into, and the move has an order that keeps every step reversible. This section is teaching. I did not run this migration in this project, because this project started as a graph.",
    nl: "Deze backend heeft aan de clientkant helemaal geen REST, en dat is een beslissing en geen toeval. Een federated graph is de vorm waar een REST-landschap naartoe beweegt, en die verhuizing heeft een volgorde die elke stap omkeerbaar houdt. Deze sectie is uitleg. Ik heb deze migratie in dit project niet gedraaid, want dit project begon als graph.",
  },
  migrationStep1: {
    en: "Put the router in front, with one subgraph in it. That subgraph can start as a thin wrapper over an existing REST service, so day one costs one deployment and moves no data.",
    nl: "Zet de router ervoor, met één subgraph erin. Die subgraph mag beginnen als een dunne schil om een bestaande REST-service, dus dag één kost één deployment en verplaatst geen data.",
  },
  migrationStep2: {
    en: "Write the contract file before the second subgraph. One schema that the composed API must equal, checked on every push, is what stops five teams from drifting apart while they work.",
    nl: "Schrijf het contractbestand voor de tweede subgraph. Eén schema waaraan de samengestelde API gelijk moet zijn, bij elke push gecontroleerd, is wat vijf teams tijdens het werk bij elkaar houdt.",
  },
  migrationStep3: {
    en: "Move one capability at a time, and agree its entity keys in a room before any code. The key is the only thing the other teams have to live with, and changing it later is the expensive change.",
    nl: "Verhuis één onderdeel tegelijk, en spreek de entity-keys ervan in een kamer af voordat er code komt. De key is het enige waar de andere teams mee moeten leven, en hem later veranderen is de dure wijziging.",
  },
  migrationStep4: {
    en: "Retire the REST endpoint when nothing calls it. Until then both answer, which is what makes each step reversible in one deployment.",
    nl: "Zet het REST-endpoint uit als niets het meer aanroept. Tot die tijd antwoorden ze allebei, en dat maakt elke stap omkeerbaar in één deployment.",
  },
  migrationStep5: {
    en: "Keep the machine to machine edges on HTTP. Not every caller is a customer, and a probe or a webhook has no business being a query.",
    nl: "Houd de machine-naar-machineranden op HTTP. Niet elke aanroeper is een klant, en een probe of een webhook hoort geen query te zijn.",
  },
  migration2: {
    en: "That last step is the one people skip. Three edges of this backend are plain HTTP on purpose. Every subgraph and the gateway answer GET /health, which says the process is up, and GET /ready, which says it can do its work. The gateway's readiness asks all five. The accounts subgraph publishes its public signing key at a well known path. And a payment provider calls back over HTTP, so ordering keeps one route for it.",
    nl: "Die laatste stap is degene die mensen overslaan. Drie randen van deze backend zijn bewust gewoon HTTP. Elke subgraph en de gateway antwoorden op GET /health, dat zegt dat het proces draait, en op GET /ready, dat zegt dat het zijn werk kan doen. De readiness van de gateway vraagt het aan alle vijf. De subgraph accounts publiceert zijn publieke ondertekensleutel op een bekend pad. En een betaalprovider belt terug over HTTP, dus ordering houdt daar één route voor.",
  },
  migration3: {
    en: "A platform team probing a pod, a library fetching a key set, and a provider posting a callback are all machine to machine, and HTTP already has the status codes and the caching rules for them. Here they are as a running graph answers them.",
    nl: "Een platformteam dat een pod aftast, een bibliotheek die een sleutelset ophaalt en een provider die een callback post zijn allemaal machine naar machine, en HTTP heeft daar de statuscodes en de cacheregels al voor. Zo beantwoordt een draaiende graph ze.",
  },
  migration4: {
    en: "The safety net under the whole move is the contract check. A team that changes a field another team depends on gets a red build with the field named, before a reviewer has to notice it.",
    nl: "Het vangnet onder de hele verhuizing is de contractcheck. Een team dat een veld verandert waar een ander team van afhangt, krijgt een rode build met dat veld erbij, voordat een reviewer het moet opmerken.",
  },

  typesTitle: { en: "Type safety across five services", nl: "Typeveiligheid over vijf services" },
  types1: {
    en: "Five services with five schemas is five chances to return a shape the schema does not describe. GraphQL Code Generator closes that. It reads each subgraph's schema and writes a resolver type per subgraph, with federation on, the subgraph's own context type wired in, and a mapper per entity that says which internal model backs each GraphQL type. strictScalars means an undeclared scalar is a build error and not an any.",
    nl: "Vijf services met vijf schema's zijn vijf kansen om een vorm terug te geven die het schema niet beschrijft. GraphQL Code Generator sluit dat af. Het leest het schema van elke subgraph en schrijft er een resolvertype bij, met federation aan, het eigen contexttype van de subgraph erin, en per entity een mapper die zegt welk intern model bij welk GraphQL-type hoort. Met strictScalars is een niet-gedeclareerde scalar een buildfout en geen any.",
  },
  types1b: {
    en: "The tail of the script is the generation itself, and one detail that saves a reader an hour. The generator emits a block comment above every type, and the house rule in this repository is that code carries no comments, so the script strips whole line comments before it writes. The generated files are committed, so a fresh checkout builds without running this step at all.",
    nl: "De staart van het script is de generatie zelf, plus één detail dat een lezer een uur scheelt. De generator zet boven elk type een blokcommentaar, en de huisregel in deze repository is dat code geen commentaar draagt, dus het script haalt hele commentaarregels weg voordat het schrijft. De gegenereerde bestanden staan in git, dus een verse checkout bouwt zonder deze stap.",
  },
  types2: {
    en: "What that buys is visible in every resolver map. The map is declared as the generated Resolvers type, so an argument that does not exist, a return shape with a missing field, or a context property nobody put there is a compile error. Here is the catalogue's Query and Mutation half, with the Product block from the previous section sitting in the same object.",
    nl: "Wat dat oplevert zie je in elke resolvermap. De map wordt gedeclareerd als het gegenereerde Resolvers-type, dus een argument dat niet bestaat, een returnvorm met een ontbrekend veld of een contexteigenschap die niemand erin heeft gezet is een compileerfout. Hier is de Query- en Mutation-helft van de catalogus, met het Product-blok uit de vorige sectie in hetzelfde object.",
  },
  types3: {
    en: "One type assertion survived, and here is where it lives. GraphQL Code Generator types a reference resolver with two arguments and @apollo/subgraph types every resolver with four. The two do not line up, so the generated map is asserted once, at the boundary in shared/src/graphql/subgraphServer.ts where the server is built. The safety that matters is kept, because each resolver map is still declared as its generated type where it is written.",
    nl: "Eén type-assertie is blijven staan, en hier woont hij. GraphQL Code Generator typeert een reference resolver met twee argumenten en @apollo/subgraph typeert elke resolver met vier. Die twee sluiten niet op elkaar aan, dus de gegenereerde map wordt één keer geasserteerd, op de grens in shared/src/graphql/subgraphServer.ts waar de server wordt gebouwd. De veiligheid die telt blijft behouden, want elke resolvermap wordt nog steeds als zijn gegenereerde type gedeclareerd waar hij geschreven wordt.",
  },
  types4: {
    en: "The real question a team asks is what a schema change costs. In this project it is one command and a red build until everything agrees: the subgraph schema, the generated resolvers, composition, the contract diff, the seed data, the expected answers of thirty three scenarios, and the typed documents in three store fronts. That sounds heavy and it is the point. A change that is cheap to make and expensive to notice is the change that breaks a client six weeks later.",
    nl: "De echte vraag van een team is wat een schemawijziging kost. In dit project is dat één commando en een rode build tot alles klopt: het subgraphschema, de gegenereerde resolvers, de compositie, de contractdiff, de seeddata, de verwachte antwoorden van drieëndertig scenario's, en de getypeerde documenten in drie winkels. Dat klinkt zwaar en dat is de bedoeling. Een wijziging die goedkoop te maken en duur op te merken is, is de wijziging die zes weken later een client sloopt.",
  },

  authenticationTitle: { en: "Authentication without a gate", nl: "Authenticatie zonder poortwachter" },
  authentication1: {
    en: "In a company with many teams, no single service is allowed to be the gate. If the gateway decides who you are, every team depends on the gateway team for a security fix, and a caller who reaches a subgraph another way meets no check at all. So verification is distributed. The accounts subgraph issues an RS256 access token and publishes the public half of its key pair at a JSON web key set endpoint. Every other subgraph verifies for itself.",
    nl: "In een bedrijf met veel teams mag geen enkele service de poortwachter zijn. Beslist de gateway wie je bent, dan hangt elk team voor een beveiligingsfix van het gatewayteam af, en wie een subgraph langs een andere weg bereikt, komt helemaal geen controle tegen. Daarom is de verificatie verdeeld. De subgraph accounts geeft een RS256-accesstoken uit en publiceert de publieke helft van zijn sleutelpaar op een JSON-web-key-set-endpoint. Elke andere subgraph controleert zelf.",
  },
  authentication2: {
    en: "A signature is not the whole answer. A signed token says who somebody was when it was issued, and a customer who signs out on a laptop they are handing back needs that login gone now. So the verifier asks accounts whether the session id inside the token is still live, and remembers the answer for five seconds. Five seconds is the number this project chose, and it is the whole trade-off in one constant: how stale a revocation may be, against how many reads the accounts subgraph carries.",
    nl: "Een handtekening is niet het hele antwoord. Een ondertekend token zegt wie iemand was toen het werd uitgegeven, en een klant die uitlogt op een laptop die ze inlevert, wil dat die inlog nu weg is. Daarom vraagt de verifier aan accounts of de sessie-id in het token nog leeft, en onthoudt het antwoord vijf seconden. Vijf seconden is het getal dat dit project koos, en daarin zit de hele afweging: hoe oud een intrekking mag zijn, tegen hoeveel reads de subgraph accounts draagt.",
  },
  authentication3: {
    en: "Cross site request forgery gets the same treatment. Every mutation is refused when the Origin header is missing or is not one this store allows, and the check runs twice: once in the gateway and once in every subgraph, so a caller that reaches port 4102 directly meets the same rule. It runs in didResolveOperation, which is after parsing and before any resolver, so a refused mutation writes nothing and answers with no data at all.",
    nl: "Cross-site request forgery krijgt dezelfde behandeling. Elke mutation wordt geweigerd als de Origin-header ontbreekt of er een is die deze winkel niet toestaat, en de controle draait twee keer: één keer in de gateway en één keer in elke subgraph, zodat wie poort 4102 rechtstreeks bereikt dezelfde regel tegenkomt. Hij draait in didResolveOperation, dus na het parsen en voor elke resolver, waardoor een geweigerde mutation niets schrijft en helemaal geen data teruggeeft.",
  },
  authentication4Before: { en: "The token design itself, the two lifetimes, the rotating refresh cookie and what a replay costs, is the subject of ", nl: "Het tokenontwerp zelf, de twee levensduren, de roterende refreshcookie en wat een replay kost, is het onderwerp van " },
  sessionsArticleLink: { en: "the article on sessions and JWT", nl: "het artikel over sessies en JWT" },
  authentication4After: {
    en: ", which walks the same model through all seven implementations of this store. What matters here is the federated half: accounts signs, everybody verifies, the gateway only forwards, and no service is a gate.",
    nl: ", dat hetzelfde model door alle zeven implementaties van deze winkel loopt. Wat hier telt is de federated helft: accounts tekent, iedereen controleert, de gateway geeft alleen door, en geen enkele service is een poortwachter.",
  },

  cachingTitle: { en: "Caching, and the harder half", nl: "Cachen, en de moeilijkere helft" },
  caching1: {
    en: "The catalogue is twenty rows that almost never change and that every page reads, so it is cached in memory and the database sees one read. The cache is a decorator around the repository port, so the application layer above it cannot tell the difference. Invalidation is the harder half, and the choice made here is to drop what the cache holds and never update it. A cache that is quietly wrong is worse than a read that is slow.",
    nl: "De catalogus is twintig rijen die bijna nooit veranderen en die elke pagina leest, dus hij wordt in het geheugen gecachet en de database ziet één read. De cache is een decorator om de repositorypoort, waardoor de applicatielaag erboven het verschil niet merkt. Invalidatie is de moeilijkere helft, en de keuze hier is om weg te gooien wat de cache vasthoudt en hem niet bij te werken. Een cache die stilletjes fout is, is erger dan een read die traag is.",
  },
  caching2: {
    en: "The host wires the two paths apart, and that split is the whole design. Reads run on the cache. The stock reservation runs on the stored repository with the cache as its listener, so the stock a reservation decides on is the stock the database holds, and the announcement that follows the write empties the cache for everybody else.",
    nl: "De host bedraadt de twee paden apart, en die splitsing is het hele ontwerp. Reads lopen over de cache. De voorraadreservering loopt over de opgeslagen repository met de cache als luisteraar, dus de voorraad waarop een reservering besluit is de voorraad die de database heeft, en de aankondiging na de schrijfactie maakt de cache voor iedereen leeg.",
  },
  caching3: {
    en: "The test proves both halves. Three different reads cost one database read and two cache hits. A stock write reaches the cache: the listener hears ProductChanged for one product, the next read answers three where it answered eight, and the database read count went from one to two. A reservation through the other path does the same, and its release puts the stock back.",
    nl: "De test bewijst beide helften. Drie verschillende reads kosten één databaseread en twee cachehits. Een voorraadschrijfactie bereikt de cache: de luisteraar hoort ProductChanged voor één product, de volgende read antwoordt drie waar hij acht antwoordde, en het aantal databasereads ging van één naar twee. Een reservering via het andere pad doet hetzelfde, en het vrijgeven zet de voorraad terug.",
  },
  caching4: {
    en: "The trade-off is how long a stale price may live against how much invalidation logic a team can carry. One process is easy. Five catalogue instances behind a load balancer each hold their own copy, so the announcement has to leave the process, which is what a message bus or a shared cache is for. This backend stops at the process boundary, and this paragraph is where it says so.",
    nl: "De afweging is hoe lang een verouderde prijs mag leven tegenover hoeveel invalidatielogica een team kan dragen. Eén proces is makkelijk. Vijf catalogusinstanties achter een load balancer houden elk hun eigen kopie, dus de aankondiging moet het proces uit, en daar is een message bus of een gedeelde cache voor. Deze backend stopt bij de procesgrens, en deze alinea is waar dat gezegd wordt.",
  },

  sagaTitle: { en: "Two writes in two services", nl: "Twee schrijfacties in twee services" },
  saga1: {
    en: "Placing an order is the one place where the distributed story is fully visible, so here it is step by step, as the code runs it.",
    nl: "Een bestelling plaatsen is de enige plek waar het gedistribueerde verhaal volledig zichtbaar is, dus hier staat het stap voor stap, zoals de code het draait.",
  },
  sagaStep1: { en: "No customer in the access token, so the answer is NOT_AUTHENTICATED and nothing else happens.", nl: "Geen klant in het accesstoken, dus het antwoord is NOT_AUTHENTICATED en er gebeurt verder niets." },
  sagaStep2: { en: "The idempotency key already has an order, so that order is answered again. A second call that arrives while the first is still running waits for the same answer.", nl: "De idempotentiesleutel heeft al een bestelling, dus die bestelling wordt opnieuw geantwoord. Een tweede aanroep die binnenkomt terwijl de eerste nog loopt, wacht op hetzelfde antwoord." },
  sagaStep3: { en: "ordering reads the visitor's cart from cart: the id, the lines and the subtotal.", nl: "ordering leest het mandje van de bezoeker bij cart: de id, de regels en het subtotaal." },
  sagaStep4: { en: "ordering reads the product names and the prices of the moment from catalogue through _entities, one call for every line together.", nl: "ordering leest de productnamen en de prijzen van dat moment bij catalogue via _entities, in één aanroep voor alle regels samen." },
  sagaStep5: { en: "ordering reads the promotion, the shipping and the total from promotions through _entities, with the subtotal inside the representation, which is exactly what the @requires from section two asks for.", nl: "ordering leest de promotie, de verzendkosten en het totaal bij promotions via _entities, met het subtotaal in de representatie, precies wat de @requires uit sectie twee vraagt." },
  sagaStep6: { en: "ordering reserves the stock in catalogue with the same key. Either every line is reserved or none is, and a refusal names the product. That reservation is the first step of the saga.", nl: "ordering reserveert de voorraad bij catalogue met dezelfde sleutel. Of elke regel wordt gereserveerd of geen enkele, en een weigering noemt het product. Die reservering is de eerste stap van de saga." },
  sagaStep7: { en: "In one database transaction the order, its lines and one outbox row are written together. If that transaction fails, the saga releases the reservation, so no stock is ever held without its order.", nl: "In één databasetransactie worden de bestelling, de regels en één outboxregel samen weggeschreven. Faalt die transactie, dan geeft de saga de reservering vrij, zodat er nooit voorraad vastzit zonder bestelling." },
  sagaStep8: { en: "After the commit the outbox publisher is nudged. It reads the row that was just written and runs the consumers: the cart is emptied, its promotion is cleared, the use of the code is counted, and the confirmation mail is addressed by reading the customer from accounts through its entity reference.", nl: "Na de commit krijgt de outbox-publisher een zetje. Die leest de zojuist geschreven regel en draait de consumers: het mandje wordt geleegd, de promotie wordt gewist, het gebruik van de code wordt geteld, en de bevestigingsmail wordt geadresseerd door de klant bij accounts op te halen via zijn entity-verwijzing." },
  saga2: {
    en: "There is no transaction across two services, so the shape is a saga: reserve, do the work, and put the reservation back when the work fails. That lives in one file whose only job is that sentence, which is why placeOrder reads as the eight steps above and not as a nest of try blocks.",
    nl: "Er is geen transactie over twee services heen, dus de vorm is een saga: reserveren, het werk doen, en de reservering terugzetten als het werk faalt. Dat staat in één bestand met precies die ene taak, en daarom leest placeOrder als de acht stappen hierboven en niet als een nest van try-blokken.",
  },
  saga3: {
    en: "And here is placeOrder itself, with the saga wrapping the transaction and nothing else in the way.",
    nl: "En hier is placeOrder zelf, met de saga om de transactie heen en verder niets ertussen.",
  },
  saga4: {
    en: "Two details in that file are worth pointing at. The compensation swallows its own failure, because a release that fails must not hide the failure that caused it. And the nudge to the publisher is wrapped in the same way, because a visitor whose order was written should never see an error from the delivery of a notification.",
    nl: "Twee details in dat bestand verdienen aandacht. De compensatie slikt zijn eigen fout in, want een vrijgave die faalt mag de fout die haar veroorzaakte niet verbergen. En het zetje aan de publisher is op dezelfde manier ingepakt, want een bezoeker wiens bestelling is weggeschreven, hoort nooit een fout uit de bezorging van een melding te zien.",
  },
  saga5: {
    en: "The trade-off is a saga of two steps against a distributed transaction. The compensation is only as good as the process that runs it. If ordering dies between the reservation and the release, the stock stays held until somebody puts it back. A production system writes the release to its own outbox. This one leaves the reservation in place, and because the release is keyed by the same idempotency key, a later attempt is safe to make.",
    nl: "De afweging is een saga van twee stappen tegenover een gedistribueerde transactie. De compensatie is niet beter dan het proces dat haar draait. Gaat ordering onderuit tussen de reservering en de vrijgave, dan blijft de voorraad vastzitten tot iemand hem terugzet. Een productiesysteem schrijft de vrijgave naar zijn eigen outbox. Deze laat de reservering staan, en omdat de vrijgave op dezelfde idempotentiesleutel loopt, is een latere poging veilig.",
  },

  interactionsTitle: { en: "Request driven and event driven, side by side", nl: "Request-driven en event-driven, naast elkaar" },
  interactions1: {
    en: "Promotions does one capability both ways, in one file, so the choice is visible and not scattered. Validating a code is a request: a visitor is waiting, the answer is the verdict, and nothing is written that a second call could double. Counting a use is an event: nobody is waiting, and the outbox may deliver the same event twice.",
    nl: "Promotions doet één onderdeel op beide manieren, in één bestand, zodat de keuze zichtbaar is en niet verspreid. Een code valideren is een request: er wacht een bezoeker, het antwoord is het oordeel, en er wordt niets weggeschreven dat een tweede aanroep zou kunnen verdubbelen. Een gebruik tellen is een event: er wacht niemand, en de outbox mag hetzelfde event twee keer bezorgen.",
  },
  interactions2: {
    en: "One consumer of the four carries a guard, and that is deliberate. Emptying a cart is idempotent by its nature, and so is clearing its promotion: doing it twice leaves the world where doing it once left it. Counting a use is not, so that one consumer runs through a shared handled event store keyed by the event id and the consumer name. Guards on the other three would be code that is never wrong and never right either.",
    nl: "Eén consumer van de vier draagt een bewaker, en dat is met opzet. Een mandje legen is van nature idempotent, en de promotie wissen ook: het twee keer doen laat de wereld achter zoals het één keer doen hem achterliet. Een gebruik tellen is dat niet, dus die ene consumer loopt door een gedeelde handled-event-store op de event-id en de naam van de consumer. Bewakers op de andere drie zouden code zijn die nooit fout is en ook nooit goed.",
  },
  interactions3: {
    en: "The test proves the pair: the request answers applied or the refusal code in the same call and counts no use, the same event id three times raises the counter once, two event ids raise it twice, and a repeat answers true because the outcome the publisher wanted is the outcome it has. The trade-off is latency and coupling against eventual consistency, decided per interaction and not per service. The visitor may not wait for the counter, and the counter may not be wrong. Those two wishes point at different styles, and one subgraph can hold both.",
    nl: "De test bewijst het paar: het request antwoordt met toegepast of met de weigeringscode in dezelfde aanroep en telt geen gebruik, dezelfde event-id verhoogt de teller drie keer achter elkaar maar één keer, twee event-ids verhogen hem twee keer, en een herhaling antwoordt true omdat de uitkomst die de publisher wilde de uitkomst is die er is. De afweging is latency en koppeling tegenover eventuele consistentie, per interactie beslist en niet per service. De bezoeker hoeft niet op de teller te wachten, en de teller mag niet fout zijn. Die twee wensen wijzen naar verschillende stijlen, en één subgraph kan ze allebei dragen.",
  },

  idempotencyTitle: { en: "The double click that places one order", nl: "De dubbele klik die één bestelling plaatst" },
  idempotency1: {
    en: "placeOrder takes an idempotency key, and it is in the contract, so a client that retries a checkout after a timeout is answered and not charged twice. Two things can happen. The two calls overlap, which is the double click, or the second arrives long after the first finished. A decorator answers both: an in flight map keyed by the customer and the key hands the second caller the same promise, and the stored order answers the later call.",
    nl: "placeOrder neemt een idempotentiesleutel aan, en die staat in het contract, zodat een client die een afrekening na een timeout opnieuw probeert antwoord krijgt en niet twee keer betaalt. Er kunnen twee dingen gebeuren. De twee aanroepen overlappen, dat is de dubbele klik, of de tweede komt lang na de eerste binnen. Een decorator beantwoordt allebei: een map met lopende afrekeningen op de klant en de sleutel geeft de tweede aanroeper dezelfde promise, en de opgeslagen bestelling beantwoordt de latere aanroep.",
  },
  idempotency2: {
    en: "The line behind both answers is one unique index. Two customers may use the same words for their own keys, and one customer may not use the same key twice.",
    nl: "De regel achter beide antwoorden is één unieke index. Twee klanten mogen dezelfde woorden voor hun eigen sleutels gebruiken, en één klant mag dezelfde sleutel niet twee keer gebruiken.",
  },
  idempotency3: {
    en: "The test starts both calls in the same tick and counts how often the checkout underneath actually ran.",
    nl: "De test start beide aanroepen in dezelfde tick en telt hoe vaak de afrekening eronder echt gedraaid heeft.",
  },
  idempotency4: {
    en: "The trade-off is where the keys live and how long they are kept. Here the key lives on the order row for as long as the order does, which is the simplest correct answer for a store this size. A busy checkout keeps them in a table of their own with a lifetime, because an index that has to stay unique grows for ever otherwise. And a call with no key is handed straight through, because a client that does not ask for the guarantee should not pay for it.",
    nl: "De afweging is waar de sleutels wonen en hoe lang ze bewaard blijven. Hier woont de sleutel op de bestelregel zolang de bestelling bestaat, en dat is het eenvoudigste juiste antwoord voor een winkel van deze omvang. Een drukke afrekening bewaart ze in een eigen tabel met een levensduur, want een index die uniek moet blijven groeit anders eeuwig door. En een aanroep zonder sleutel gaat er zo doorheen, want een client die de garantie niet vraagt hoort er niet voor te betalen.",
  },

  retriesTitle: { en: "Retries, and the budget that stops a storm", nl: "Retries, en het budget dat een storm stopt" },
  retries1: {
    en: "A retry is for a call that can be repeated safely and for a failure a retry can fix. Both halves are decisions somebody has to write down. The delay doubles and carries jitter, so a thousand clients that failed at the same moment do not come back at the same moment. And the budget is the part that is usually left out: a sliding window that allows the minimum plus a fraction of the calls it has seen, so when everything fails the retries stop.",
    nl: "Een retry is voor een aanroep die veilig herhaald kan worden en voor een fout die een retry kan verhelpen. Beide helften zijn beslissingen die iemand moet opschrijven. De vertraging verdubbelt en draagt jitter, zodat duizend clients die op hetzelfde moment faalden niet op hetzelfde moment terugkomen. En het budget is het deel dat meestal ontbreekt: een schuivend venster dat het minimum plus een deel van de geziene aanroepen toestaat, zodat de retries stoppen als alles faalt.",
  },
  retries2: {
    en: "The client that every subgraph uses to call another one decides both halves at the call site. It retries only when the caller passes idempotent: true, and every read the subgraphs make of each other is marked that way, and so are the outbox consumers, because they are idempotent by their event id. A connection failure or a 5xx is retryable. A GraphQL error answer is final, because the other service understood the question and said no.",
    nl: "De client waarmee elke subgraph een andere aanroept, beslist beide helften op de plek van de aanroep. Hij probeert alleen opnieuw als de aanroeper idempotent: true meegeeft, en elke read die de subgraphs bij elkaar doen is zo gemarkeerd, en de outbox-consumers ook, want die zijn idempotent op hun event-id. Een verbindingsfout of een 5xx is te herproberen. Een GraphQL-foutantwoord is definitief, want de andere service begreep de vraag en zei nee.",
  },
  retries3: {
    en: "The test that carries this topic is the storm. A hundred calls that fail four times each would be four hundred attempts. With a budget of five plus a fifth of the calls in the window, the test asserts at most a hundred and twenty five.",
    nl: "De test die dit onderwerp draagt is de storm. Honderd aanroepen die elk vier keer falen zouden vierhonderd pogingen zijn. Met een budget van vijf plus een vijfde van de aanroepen in het venster, asserteert de test hoogstens honderdvijfentwintig.",
  },
  retries4: {
    en: "The trade-off is when a retry makes an outage worse. A downstream that is slow because it is overloaded gets three times the traffic from a client that retries without a budget, which is how one struggling service becomes an outage across a graph. The budget is what turns a retry from a hope into a bounded one.",
    nl: "De afweging is wanneer een retry een storing erger maakt. Een downstream die traag is omdat hij overbelast is, krijgt drie keer zoveel verkeer van een client die zonder budget herprobeert, en zo wordt één worstelende service een storing over de hele graph. Het budget maakt van een retry een begrensde poging.",
  },

  outboxTitle: { en: "Delivery guarantees: the outbox", nl: "Bezorggaranties: de outbox" },
  outbox1: {
    en: "An event that is published after a commit can be lost between the two. A process that dies in that window leaves an order nobody was told about, and no amount of retrying fixes it, because the intention to publish was never written down. The outbox writes it down. The order and its event go into the same transaction, so the event exists exactly when the order exists.",
    nl: "Een event dat na een commit wordt gepubliceerd, kan tussen die twee in verloren gaan. Een proces dat in dat venster omvalt, laat een bestelling achter waarover niemand is ingelicht, en herproberen helpt niet, want de intentie om te publiceren is nooit vastgelegd. De outbox legt haar vast. De bestelling en het event gaan in dezelfde transactie, dus het event bestaat precies wanneer de bestelling bestaat.",
  },
  outbox2: {
    en: "A publisher reads the rows that are due, runs the consumers in order, and marks the row published when they have all answered. A consumer that fails raises the attempt count and sets the moment of the next attempt from the same backoff the retry policy uses, and the row is dead lettered once the attempt budget is spent, so a poison message stops and does not run for ever.",
    nl: "Een publisher leest de regels die aan de beurt zijn, draait de consumers op volgorde, en markeert de regel als gepubliceerd zodra ze allemaal geantwoord hebben. Een consumer die faalt verhoogt de pogingteller en zet het moment van de volgende poging met dezelfde backoff die het retrybeleid gebruikt, en de regel gaat naar de dead letter zodra het pogingbudget op is, zodat een gifboodschap stopt en niet eeuwig doordraait.",
  },
  outbox3: {
    en: "Two lines in that file carry a decision. The publisher polls every two seconds, and placeOrder nudges it once straight after the commit. A purely asynchronous publisher would be the cleaner shape, and it would break a conformance scenario: the run places an order and then asks for the cart in the next request, and that cart has to be empty. The nudge is what makes the visitor's own request see the effect, and the poller is what turns it from a hope into a guarantee. Both, not either.",
    nl: "Twee regels in dat bestand dragen een beslissing. De publisher polt elke twee seconden, en placeOrder geeft hem meteen na de commit één zetje. Een puur asynchrone publisher zou de nettere vorm zijn, en zou een conformance-scenario breken: de run plaatst een bestelling en vraagt in het volgende verzoek het mandje op, en dat mandje moet leeg zijn. Het zetje zorgt dat het eigen verzoek van de bezoeker het effect ziet, en de poller maakt er een garantie van, geen hoop. Allebei, niet één van de twee.",
  },
  outbox4: {
    en: "The store that makes at least once delivery survivable is thirty lines and one primary key on the pair of an event id and a consumer name.",
    nl: "De store die at-least-once-bezorging draaglijk maakt is dertig regels en één primaire sleutel op het paar van een event-id en een consumernaam.",
  },
  outbox5: {
    en: "The tests start with the crash. An order is placed with a publisher that does nothing, so the row is left unpublished the way a process that died would leave it, and the real publisher picks it up and delivers it. Then at least once with an idempotent consumer: the mail fails once, the row comes round again, both deliveries reach the counter, and the counter reads one.",
    nl: "De tests beginnen met de crash. Er wordt een bestelling geplaatst met een publisher die niets doet, dus de regel blijft ongepubliceerd achter zoals een omgevallen proces hem zou achterlaten, en de echte publisher pakt hem op en bezorgt hem. Daarna at-least-once met een idempotente consumer: de mail faalt één keer, de regel komt opnieuw langs, beide bezorgingen bereiken de teller, en de teller staat op één.",
  },
  outboxCalloutTitle: { en: "Exactly once is a property of the consumer", nl: "Exactly-once is een eigenschap van de consumer" },
  outboxCalloutBody: {
    en: "Two nudges at the same moment can read the same row and deliver it twice. That is not a bug to be fixed in the transport, it is the reason the counter is keyed by the event id. At most once loses messages when a consumer fails. At least once repeats them when a publisher retries. Nothing in between exists at the transport layer, so the guarantee a business needs has to be built where the message lands. A row that is dead lettered needs a person, and this backend gives that person readDeadLettered and the failure text.",
    nl: "Twee zetjes op hetzelfde moment kunnen dezelfde regel lezen en hem twee keer bezorgen. Dat is geen bug die je in het transport oplost, het is de reden dat de teller op de event-id loopt. At-most-once verliest berichten als een consumer faalt. At-least-once herhaalt ze als een publisher het opnieuw probeert. Daartussen bestaat op transportniveau niets, dus de garantie die een bedrijf nodig heeft, moet gebouwd worden waar het bericht landt. Een regel in de dead letter heeft een mens nodig, en deze backend geeft die mens readDeadLettered en de fouttekst.",
  },

  resilienceTitle: { en: "The cart that still renders when the catalogue is down", nl: "Het mandje dat blijft werken als de catalogus plat ligt" },
  resilience1: {
    en: "When the catalogue stops answering, the cart page has a choice: fail, or show the lines with the prices it last saw. It shows them. A circuit breaker counts the failures, opens after three, and stops the calls entirely for five seconds, so a service that is down is not hammered by every visitor. This one is thirty lines written out, and it is deliberately not a dependency, for two reasons. A reader of a tutorial should see the state machine. And a dependency would have to be explained anyway, which is more words than the state machine takes.",
    nl: "Als de catalogus stopt met antwoorden, heeft de mandjespagina een keuze: falen, of de regels tonen met de prijzen die hij het laatst zag. Hij toont ze. Een circuit breaker telt de fouten, gaat na drie open, en stopt de aanroepen vijf seconden helemaal, zodat een service die plat ligt niet door elke bezoeker wordt geramd. Deze is dertig regels uitgeschreven en geen dependency, om twee redenen. Wie een tutorial leest, hoort de toestandsmachine te zien. En een dependency zou toch uitgelegd moeten worden, en dat kost meer woorden dan de toestandsmachine zelf.",
  },
  resilience2: {
    en: "The reader in cart remembers every product it was told about and answers from that memory when the live call fails or the circuit is open. A product it has never seen is answered as nothing, because a wrong price is worse than a missing line.",
    nl: "De reader in cart onthoudt elk product waarover hij is verteld en antwoordt uit dat geheugen als de live aanroep faalt of de circuit open staat. Een product dat hij nooit gezien heeft, wordt als niets beantwoord, want een verkeerde prijs is erger dan een ontbrekende regel.",
  },
  resilience3: {
    en: "Three lines in the cart host decide what degrades. The read path gets the degraded reader. The write path keeps the live catalogue, because adding a product needs the stock of the moment and a cart line that cannot be honoured is worse than a refusal a visitor can act on.",
    nl: "Drie regels in de cart-host bepalen wat er uitgekleed wordt. Het leespad krijgt de uitgeklede reader. Het schrijfpad houdt de live catalogus, want een product toevoegen heeft de voorraad van dat moment nodig, en een mandjesregel die niet waargemaakt kan worden is erger dan een weigering waar een bezoeker iets mee kan.",
  },
  resilience4: {
    en: "And then the chaos test, which is the only test in this project that proves a claim about the whole graph at once. It fills a cart through the gateway, stops the catalogue subgraph, and asks the graph for the cart again.",
    nl: "En dan de chaostest, de enige test in dit project die een uitspraak over de hele graph in één keer bewijst. Hij vult een mandje via de gateway, stopt de subgraph catalogue, en vraagt de graph opnieuw om het mandje.",
  },
  resilience5: {
    en: "That test lives inside the graph test file, and that placement is a deliberate decision. As a second file that started its own servers it starved the first file's event loop and both runs went flaky, so the whole graph starts once, in one process, and the chaos block runs last. A passing test run has therefore been through the chaos case as well, which is the property that matters.",
    nl: "Die test staat in het bestand van de graphtest, en die plek is een beslissing en geen gewoonte. Als tweede bestand met eigen servers liet hij de event loop van het eerste bestand verhongeren en werden beide runs wisselvallig, dus de hele graph start één keer, in één proces, en het chaosblok draait als laatste. Een geslaagde testrun is daardoor ook door het chaosgeval heen gegaan, en dat is de eigenschap die telt.",
  },
  resilience6: {
    en: "The trade-off is what to degrade and what to fail. A price that is a minute old is better than an empty page, and a visitor can still see what is in the cart. Adding a product does not degrade. Getting that line right is more valuable than any amount of breaker configuration, because a breaker only decides how quickly you stop calling, and the degrade decides what the customer sees.",
    nl: "De afweging is wat je uitkleedt en wat je laat falen. Een prijs van een minuut oud is beter dan een lege pagina, en een bezoeker ziet nog steeds wat er in het mandje zit. Een product toevoegen wordt niet uitgekleed. Die grens goed trekken is waardevoller dan welke breakerconfiguratie ook, want een breaker bepaalt alleen hoe snel je stopt met bellen, en het uitkleden bepaalt wat de klant ziet.",
  },

  performanceTitle: { en: "DataLoader and the query plan", nl: "DataLoader en het queryplan" },
  performance1: {
    en: "A federated graph turns a cart with twenty lines into twenty entity lookups unless somebody batches them, and section two showed the two loaders that do it. The query plan is where a reader can see whether the batching worked. The gateway hands its plan to a plugin, which counts the fetches per subgraph and puts the plan on the response when the request asks for it with a header, in the development profile only.",
    nl: "Een federated graph maakt van een mandje met twintig regels twintig entity-lookups tenzij iemand ze bundelt, en sectie twee liet de twee loaders zien die dat doen. Het queryplan is waar een lezer kan zien of de bundeling werkte. De gateway geeft zijn plan aan een plugin, die de fetches per subgraph telt en het plan op het antwoord zet als het verzoek erom vraagt met een header, en alleen in het ontwikkelprofiel.",
  },
  performance2: {
    en: "The test asks for a cart with three different products and their names, which is exactly the shape that costs a naive graph four calls.",
    nl: "De test vraagt om een mandje met drie verschillende producten en hun namen, precies de vorm die een naïeve graph vier aanroepen kost.",
  },
  performance3: {
    en: "One fetch to cart and one to catalogue, for three lines. The test after it proves the plan stays out of a response that did not ask for it. The header makes it opt in and the profile makes it unavailable where it should be, which is the same pair the seed reset mutation uses.",
    nl: "Eén fetch naar cart en één naar catalogue, voor drie regels. De test erna bewijst dat het plan buiten een antwoord blijft dat er niet om vroeg. De header maakt het opt-in en het profiel maakt het onbeschikbaar waar dat hoort, hetzelfde paar dat de seed-resetmutation gebruikt.",
  },
  performance4: {
    en: "The other half of performance under traffic is the limits, and in production they are configuration. A depth limit stops a query that walks a cycle forever, a height limit stops one that asks for everything, an alias limit stops the trick of asking for the same expensive field a hundred times under a hundred names, and the parser limits stop a document that is expensive before it is even validated. The trade-off is limits that protect the graph against limits that block a legitimate screen, and the only way to set them is to look at the largest screen a real client draws and leave room above it.",
    nl: "De andere helft van prestaties onder verkeer zijn de limieten, en in productie zijn dat instellingen. Een dieptelimiet stopt een query die eeuwig in een cyclus loopt, een hoogtelimiet stopt er een die alles opvraagt, een aliaslimiet stopt de truc om hetzelfde dure veld honderd keer onder honderd namen te vragen, en de parserlimieten stoppen een document dat duur is voordat het gevalideerd wordt. De afweging is limieten die de graph beschermen tegenover limieten die een legitiem scherm blokkeren, en de enige manier om ze te zetten is kijken naar het grootste scherm dat een echte client tekent en daarboven ruimte laten.",
  },

  tracingTitle: { en: "One trace per request", nl: "Eén trace per verzoek" },
  tracing1: {
    en: "A request that touches the gateway and three subgraphs is four processes, and a slow request has to be one thing to look at. The tracing module registers the OpenTelemetry Node SDK once per process with the W3C trace context propagator. An Express middleware opens a span for every incoming request, continuing the trace the traceparent header carries, and that span is the active context for the whole request, so everything the request starts is a child of it. Both the subgraph client and the gateway's data source write the active context back into a traceparent header, which is what carries the trace across the hop.",
    nl: "Een verzoek dat de gateway en drie subgraphs raakt, zijn vier processen, en een traag verzoek moet één ding zijn om naar te kijken. De tracingmodule registreert de OpenTelemetry Node-SDK één keer per proces met de W3C-tracecontext-propagator. Een Express-middleware opent een span voor elk binnenkomend verzoek en zet de trace voort die de traceparent-header meedraagt, en die span is de actieve context voor het hele verzoek, dus alles wat het verzoek start is er een kind van. Zowel de subgraphclient als de datasource van de gateway schrijft de actieve context terug in een traceparent-header, en dat draagt de trace over de sprong heen.",
  },
  tracing2: {
    en: "The exporter keeps the last two hundred spans in memory, because there is no collector on this machine. It is bounded on purpose: a process that records everything keeps nothing useful for long. A production graph swaps it for an exporter to a collector and adds a sampler, which is one line in this file, and the assertion the test makes stays the same, because the trace id is what joins the services either way.",
    nl: "De exporter houdt de laatste tweehonderd spans in het geheugen, want er staat geen collector op deze machine. Hij is met opzet begrensd: een proces dat alles opslaat, houdt niets nuttigs lang vast. Een productiegraph zet er een exporter naar een collector voor in de plaats en voegt een sampler toe, en dat is één regel in dit bestand. De assertie van de test blijft hetzelfde, want in beide gevallen is de trace-id wat de services verbindt.",
  },
  tracing3: {
    en: "One query for a cart with its products goes through the gateway, and the recorded spans hold a gateway span, a cart span and a catalogue span that all carry one trace id.",
    nl: "Eén query om een mandje met zijn producten gaat door de gateway, en de opgenomen spans bevatten een gatewayspan, een cartspan en een cataloguespan die allemaal één trace-id dragen.",
  },

  continuousTitle: { en: "Composition and the contract check on every push", nl: "Compositie en de contractcheck bij elke push" },
  continuous1: {
    en: "Everything above is worth nothing if it only holds on one laptop. The workflow is short, and every line in it is one of the promises this article made.",
    nl: "Alles hierboven is niets waard als het alleen op één laptop klopt. De workflow is kort, en elke regel erin is een van de beloften die dit artikel gedaan heeft.",
  },
  continuous2: {
    en: "Build proves the types. Compose proves the five schemas fit each other. The contract check proves the composed API is the one every store front expects, in both profiles. The tests prove the domain rules and the nine guarantees. Then the conformance suite starts the whole graph and drives thirty three scenarios through the gateway, and it runs twice in a row, so the seed reset has to leave the graph in the state the next run expects. A schema change that breaks any of that cannot merge.",
    nl: "De build bewijst de typen. Compose bewijst dat de vijf schema's op elkaar passen. De contractcheck bewijst dat de samengestelde API dezelfde is die elke winkel verwacht, in beide profielen. De tests bewijzen de domeinregels en de negen garanties. Daarna start de conformance-suite de hele graph en jaagt er drieëndertig scenario's doorheen via de gateway, twee keer achter elkaar, zodat de seedreset de graph moet achterlaten in de staat die de volgende run verwacht. Een schemawijziging die daar iets van breekt, kan niet gemerged worden.",
  },
  continuous3: {
    en: "Two things a production graph adds are not here, and both are worth naming. One Compose file that brings the whole graph up with PostgreSQL and the poller, and an OpenTelemetry collector for the spans, are the next increment in this project's backlog. The workflow above runs the graph as five Node processes on the runner.",
    nl: "Twee dingen die een productiegraph toevoegt staan hier niet, en allebei zijn ze het noemen waard. Eén Compose-bestand dat de hele graph met PostgreSQL en de poller opstart, en een OpenTelemetry-collector voor de spans, zijn de volgende stap op de backlog van dit project. De workflow hierboven draait de graph als vijf Node-processen op de runner.",
  },

  costTitle: { en: "What this cost, and what I would do first", nl: "Wat dit kostte, en wat ik als eerste zou doen" },
  cost1: {
    en: "From an empty folder, the whole thing needs Node.js 24 and nothing else. No Docker, no database server, no Rust binary. Each subgraph keeps its own SQLite file through node:sqlite, which Node ships. The PostgreSQL 18 path is one environment variable per subgraph behind the same database port, and the statements are written with question mark placeholders that the PostgreSQL adapter turns into numbered ones, which is the only dialect difference in the code. That adapter is written and unverified here, because there is no Docker on this machine.",
    nl: "Vanuit een lege map heeft het geheel Node.js 24 nodig en verder niets. Geen Docker, geen databaseserver, geen Rust-binary. Elke subgraph houdt zijn eigen SQLite-bestand via node:sqlite, dat Node meelevert. Het PostgreSQL 18-pad is één omgevingsvariabele per subgraph achter dezelfde databasepoort, en de statements zijn geschreven met vraagtekens als placeholders die de PostgreSQL-adapter omzet naar genummerde, en dat is het enige dialectverschil in de code. Die adapter is hier geschreven en niet geverifieerd, want er staat geen Docker op deze machine.",
  },
  cost1b: {
    en: "The numbers at the end of that sequence are the measure of what the guarantees cost to hold.",
    nl: "De getallen aan het eind van die reeks zijn de maat voor wat het kost om de garanties overeind te houden.",
  },
  cost2: {
    en: "Nine guarantees, nine files, nine tests. Here they are in one place, so this article can be used as an index into the repository.",
    nl: "Negen garanties, negen bestanden, negen tests. Hier staan ze bij elkaar, zodat dit artikel als index op de repository te gebruiken is.",
  },
  guaranteeTableCaption: {
    en: "Every guarantee of the graph, the file whose name says what it is, and the test that proves it. Paths are relative to backends/node.",
    nl: "Elke garantie van de graph, het bestand waarvan de naam zegt wat het is, en de test die het bewijst. De paden zijn relatief aan backends/node.",
  },
  headerGuarantee: { en: "Guarantee", nl: "Garantie" },
  headerPlace: { en: "The place", nl: "De plek" },
  headerProof: { en: "The proving test", nl: "De bewijzende test" },
  cost3: {
    en: "What a real graph adds beyond this one is worth listing, so nobody reads this as a finished platform. A schema registry that checks a proposed change against the fields live traffic actually uses. A message bus, so a ProductChanged leaves the process and reaches five catalogue instances. A shared cache with the same invalidation. A collector for the traces and a sampler in front of it. And an on-call rotation, which is the part no architecture diagram contains and the part that decides whether any of the above survives.",
    nl: "Wat een echte graph hierbovenop heeft, is het opsommen waard, zodat niemand dit als een af platform leest. Een schemaregister dat een voorgestelde wijziging toetst aan de velden die echt verkeer gebruikt. Een message bus, zodat een ProductChanged het proces verlaat en vijf catalogusinstanties bereikt. Een gedeelde cache met dezelfde invalidatie. Een collector voor de traces en een sampler ervoor. En een piketrooster, het deel dat op geen enkel architectuurplaatje staat en dat bepaalt of iets van het bovenstaande standhoudt.",
  },
  cost4: {
    en: "Now the engagement this article grew out of. At bol.com the GraphQL schema was the contract between the frontend and the backend teams, and my work ran with two teams continuously and up to six at once in one shared monorepo. When the data did not fit a page that stays driven by its data, I went back to the backend engineers to reshape a flat reference field into a structured object, and they took that change into the contract. And a page that used to throw away a whole result whenever any error came back now renders the data that is present while the errors still reach the error tracker.",
    nl: "Dan de opdracht waar dit artikel uit voortkomt. Bij bol.com was het GraphQL-schema het contract tussen de frontend en de backendteams, en mijn werk liep doorlopend met twee teams en tot zes tegelijk in één gedeelde monorepo. Paste de data niet bij een pagina die door zijn data gestuurd blijft, dan ging ik terug naar de backendengineers om een plat verwijzingsveld tot een gestructureerd object te laten hervormen, en zij namen die wijziging op in het contract. En een pagina die vroeger een heel resultaat weggooide zodra er ook maar één fout terugkwam, toont nu de data die er wel is terwijl de fouten nog steeds bij de foutmonitor aankomen.",
  },
  cost5Before: { en: "Several teams behind one schema is the problem a federated graph is built to solve, and that part of the work has ", nl: "Meerdere teams achter één schema is het probleem waarvoor een federated graph gemaakt is, en dat deel van het werk heeft " },
  contractArticleLink: { en: "its own article on GraphQL as a contract", nl: "een eigen artikel over GraphQL als contract" },
  cost5After: {
    en: ". The federation half is the part I built here to answer it in code, and the paragraph above is the whole of what my record says on the subject.",
    nl: ". De federation-helft is wat ik hier gebouwd heb om die vraag met code te beantwoorden, en de alinea hierboven is alles wat mijn cv erover zegt.",
  },
  cost6: {
    en: "That is the shape of the answer I would give in an interview too. The decisions in this article are the ones I can defend line by line, because each one has a file, a test and a reason that survives a follow-up question.",
    nl: "Zo zou ik het in een gesprek ook beantwoorden. De beslissingen in dit artikel zijn de beslissingen die ik regel voor regel kan verdedigen, want elke beslissing heeft een bestand, een test en een reden die tegen een vervolgvraag bestand is.",
  },

  closingTitle: { en: "What to take away", nl: "Wat je meeneemt" },
  closing1: {
    en: "If you are standing in front of a REST estate with five teams behind it and somebody has said the word federation, this is the order I would put the work in.",
    nl: "Sta je voor een REST-landschap met vijf teams erachter en heeft iemand het woord federation laten vallen, dan is dit de volgorde waarin ik het werk zou zetten.",
  },
  closingStep1: {
    en: "The contract file and its check before the first subgraph. It is a day of work and it is the only thing that keeps five teams pointing the same way while they are busy.",
    nl: "Het contractbestand en de check erop voor de eerste subgraph. Het is een dag werk en het enige dat vijf teams tijdens het drukke werk dezelfde kant op laat wijzen.",
  },
  closingStep2: {
    en: "One subgraph per team, and the entity keys agreed in a room. A key is the only part of your schema the other teams have to live with.",
    nl: "Eén subgraph per team, en de entity-keys in een kamer afgesproken. Een key is het enige deel van je schema waar de andere teams mee moeten leven.",
  },
  closingStep3: {
    en: "An idempotency key on the mutation that spends money, on day one. Adding it later means backfilling a unique index on a table that is already busy.",
    nl: "Een idempotentiesleutel op de mutation die geld uitgeeft, op dag één. Hem later toevoegen betekent een unieke index bijwerken op een tabel die al druk is.",
  },
  closingStep4: {
    en: "The outbox before the first cross-service event, because retrofitting it means finding every place that publishes and wrapping it in a transaction that was not designed for one.",
    nl: "De outbox voor het eerste event tussen services, want hem achteraf inbouwen betekent elke plek vinden die publiceert en die in een transactie wikkelen die daar niet voor ontworpen was.",
  },
  closingStep5: {
    en: "A timeout and a retry budget before the first retry. A retry without a budget is a load generator with good intentions.",
    nl: "Een timeout en een retrybudget voor de eerste retry. Een retry zonder budget is een belastinggenerator met goede bedoelingen.",
  },
  closingStep6: {
    en: "One trace id from the edge inwards before the first slow request arrives. It costs a middleware and a propagated header, and without it a slow query in a graph of five services is a guessing game.",
    nl: "Eén trace-id van de rand naar binnen voordat het eerste trage verzoek binnenkomt. Het kost een middleware en een doorgegeven header, en zonder dat is een trage query in een graph van vijf services een gokspel.",
  },
  closing2: {
    en: "The thing worth carrying out of all of it is smaller than the machinery. Federation moves the question from who writes the joining code to who owns which field, and every guarantee in this article exists because that answer is now written in a schema that a build step checks. The code is in the repository, the tests are the argument, and the whole graph starts from an empty folder with one command.",
    nl: "Wat je hieruit meeneemt is kleiner dan de machinerie. Federation verlegt de vraag van wie de koppelcode schrijft naar wie welk veld bezit, en elke garantie in dit artikel bestaat omdat dat antwoord nu in een schema staat dat een bouwstap controleert. De code staat in de repository, de tests zijn het argument, en de hele graph start vanuit een lege map met één commando.",
  },
};
