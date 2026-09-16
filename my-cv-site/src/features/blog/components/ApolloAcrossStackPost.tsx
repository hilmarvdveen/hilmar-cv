import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, Lead, UL, OL, LI, Strong, Quote, Divider, A } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FlowDiagram } from "./FlowDiagram";
import { FileTree } from "./FileTree";
import type { FileNode } from "./FileTree";
import { Contents } from "./Contents";
import { PostRepository } from "./PostRepository";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "graphql-with-apollo-react-nodejs-kotlin",
  category: "architecture",
  track: "fullstack",
  publishedDate: "2026-09-16",
  readingTimeMin: 42,
  title: {
    en: "One schema with Apollo: React, Node.js and Kotlin",
    nl: "Eén schema met Apollo: React, Node.js en Kotlin",
  },
  description: {
    en: "Apollo Server on Node, Spring for GraphQL on Kotlin and Apollo Client in React, all serving one schema, built from an empty folder with typed documents.",
    nl: "Apollo Server op Node, Spring for GraphQL op Kotlin en Apollo Client in React, allemaal op één schema, vanuit een lege map gebouwd met getypeerde documenten.",
  },
  excerpt: {
    en: "Three runtimes have to agree about one GraphQL schema. This builds all three from an empty folder: an Apollo Server on Node.js with a data loader, the same schema served from Kotlin with Spring for GraphQL, and a React client on Apollo Client whose types come out of the schema file. Every request has its answer, both kinds of failure have their body, and each side has its own test.",
    nl: "Drie runtimes moeten het eens zijn over één GraphQL-schema. Dit bouwt ze alle drie vanuit een lege map: een Apollo Server op Node.js met een data loader, hetzelfde schema geserveerd vanuit Kotlin met Spring for GraphQL, en een React-client op Apollo Client waarvan de typen uit het schemabestand komen. Elk verzoek heeft zijn antwoord, beide soorten fouten hebben hun body, en elke kant heeft zijn eigen test.",
  },
  keywords: [
    "apollo server 5 resolvers context dataloader",
    "apollo client 4 typed document inmemorycache",
    "spring for graphql kotlin controller batchmapping",
    "graphql code generator client preset typescript resolvers",
    "graphql partial data errorpolicy all",
    "mocklink mockedprovider apollo client test",
    "graphqltester graphqltest spring boot 4",
  ],
};

function buildRuntimes(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("schema", "contract/schema.graphql", { x: 320, y: 0 }, { tone: "emerald", subtitle: copy.nodeSchemaSub[locale], direction: "TB", width: 280 }),
    flowNode("client", copy.nodeClient[locale], { x: 0, y: 160 }, { tone: "blue", subtitle: "Apollo Client 4.2.12", direction: "TB", width: 260 }),
    flowNode("server", copy.nodeServer[locale], { x: 310, y: 160 }, { tone: "violet", subtitle: "Apollo Server 5.5.1", direction: "TB", width: 260 }),
    flowNode("service", copy.nodeService[locale], { x: 620, y: 160 }, { tone: "amber", subtitle: "Spring for GraphQL 2.0.5", direction: "TB", width: 260 }),
    flowNode("clientTypes", "graphql/generated", { x: 0, y: 320 }, { tone: "slate", subtitle: copy.nodeClientTypesSub[locale], direction: "TB", width: 260 }),
    flowNode("serverTypes", "src/generated/resolvers.ts", { x: 310, y: 320 }, { tone: "slate", subtitle: copy.nodeServerTypesSub[locale], direction: "TB", width: 260 }),
    flowNode("serviceTypes", "graphql/schema.graphqls", { x: 620, y: 320 }, { tone: "slate", subtitle: copy.nodeServiceTypesSub[locale], direction: "TB", width: 260 }),
  ];
  const edges = [
    flowEdge("schema", "client", { label: copy.edgeGenerate[locale] }),
    flowEdge("schema", "server", { label: copy.edgeGenerate[locale] }),
    flowEdge("schema", "service", { label: copy.edgeCopy[locale] }),
    flowEdge("client", "clientTypes"),
    flowEdge("server", "serverTypes"),
    flowEdge("service", "serviceTypes"),
  ];
  return { nodes, edges };
}

function buildRequestPath(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("component", copy.pathComponent[locale], { x: 0, y: 0 }, { tone: "blue", subtitle: copy.pathComponentSub[locale], direction: "TB", width: 340 }),
    flowNode("cache", copy.pathCache[locale], { x: 0, y: 140 }, { tone: "violet", subtitle: "InMemoryCache", direction: "TB", width: 340 }),
    flowNode("link", "HttpLink", { x: 0, y: 280 }, { tone: "slate", subtitle: copy.pathLinkSub[locale], direction: "TB", width: 340 }),
    flowNode("resolvers", copy.pathResolvers[locale], { x: 0, y: 420 }, { tone: "emerald", subtitle: copy.pathResolversSub[locale], direction: "TB", width: 340 }),
    flowNode("loader", "DataLoader", { x: 0, y: 560 }, { tone: "amber", subtitle: copy.pathLoaderSub[locale], direction: "TB", width: 340 }),
    flowNode("service", copy.pathService[locale], { x: 0, y: 700 }, { tone: "slate", subtitle: copy.pathServiceSub[locale], direction: "TB", width: 340 }),
  ];
  const edges = [
    flowEdge("component", "cache", { label: copy.edgeAsks[locale] }),
    flowEdge("cache", "link", { label: copy.edgeMissing[locale] }),
    flowEdge("link", "resolvers", { label: copy.edgeOnePost[locale] }),
    flowEdge("resolvers", "loader", { label: copy.edgeRepeated[locale] }),
    flowEdge("loader", "service", { label: copy.edgeOneCall[locale] }),
  ];
  return { nodes, edges };
}

function buildProjectTree(locale: Locale): FileNode[] {
  const copy = COPY;
  return [
    {
      name: "apollo-across-the-stack",
      children: [
        {
          name: "contract",
          children: [{ name: "schema.graphql", comment: copy.treeSchema[locale] }],
        },
        {
          name: "server-node",
          comment: copy.treeServerNode[locale],
          children: [
            { name: "package.json" },
            { name: "tsconfig.json" },
            { name: "schema.graphql" },
            {
              name: "src",
              children: [
                { name: "store.ts" },
                { name: "context.ts" },
                { name: "resolvers.ts" },
                { name: "catalogueService.ts" },
                { name: "main.ts" },
              ],
            },
            { name: "tests", children: [{ name: "catalogue.test.ts" }] },
          ],
        },
        {
          name: "service-kotlin",
          comment: copy.treeServiceKotlin[locale],
          children: [
            { name: "settings.gradle.kts" },
            { name: "build.gradle.kts" },
            {
              name: "src/main/resources",
              children: [
                { name: "application.yaml" },
                { name: "graphql/schema.graphqls" },
              ],
            },
            {
              name: "src/main/kotlin/nl/example/store",
              children: [
                { name: "StoreApplication.kt" },
                { name: "Catalogue.kt" },
                { name: "CatalogueController.kt" },
                { name: "CartController.kt" },
              ],
            },
            {
              name: "src/test/kotlin/nl/example/store",
              children: [{ name: "CatalogueControllerTest.kt" }],
            },
          ],
        },
        {
          name: "client-react",
          comment: copy.treeClientReact[locale],
          children: [
            { name: "package.json" },
            { name: "codegen.ts" },
            {
              name: "graphql",
              children: [
                { name: "operations.ts" },
                { name: "generated", comment: copy.treeGenerated[locale] },
              ],
            },
            {
              name: "app",
              children: [
                { name: "page.tsx" },
                { name: "actions.ts" },
                { name: "AddToCartForm.tsx" },
              ],
            },
            { name: "server", children: [{ name: "storeClient.ts" }] },
            { name: "tests", children: [{ name: "addToCartForm.test.tsx" }] },
          ],
        },
      ],
    },
  ];
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  const runtimes = buildRuntimes(locale);
  const requestPath = buildRequestPath(locale);
  const projectTree = buildProjectTree(locale);
  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <P>{copy.intro1[locale]}</P>
      <P>{copy.intro2[locale]}</P>
      <P>{copy.versionNote[locale]}</P>
      <P>{copy.versionSplit[locale]}</P>
      <Quote>{copy.quote[locale]}</Quote>
      <PostRepository locale={locale} folders={["backends/node", "backends/kotlin", "frontends/nextjs"]} />
      <Contents
        label={copy.contentsLabel[locale]}
        items={[
          copy.shapeTitle[locale],
          copy.schemaTitle[locale],
          copy.serverTitle[locale],
          copy.kotlinTitle[locale],
          copy.gatewayTitle[locale],
          copy.clientTitle[locale],
          copy.renderingTitle[locale],
          copy.errorsTitle[locale],
          copy.codegenTitle[locale],
          copy.testingTitle[locale],
          copy.urqlTitle[locale],
          copy.closingTitle[locale],
        ]}
      />

      <H2>{copy.shapeTitle[locale]}</H2>
      <P>{copy.shape1[locale]}</P>
      <FlowDiagram
        nodes={runtimes.nodes}
        edges={runtimes.edges}
        height={430}
        ariaLabel={copy.shapeAria[locale]}
        caption={copy.shapeCaption[locale]}
      />
      <UL>
        <LI><Strong>{copy.ownerSchema[locale]}</Strong> {copy.ownerSchemaBody[locale]}</LI>
        <LI><Strong>{copy.ownerServer[locale]}</Strong> {copy.ownerServerBody[locale]}</LI>
        <LI><Strong>{copy.ownerService[locale]}</Strong> {copy.ownerServiceBody[locale]}</LI>
        <LI><Strong>{copy.ownerClient[locale]}</Strong> {copy.ownerClientBody[locale]}</LI>
      </UL>
      <P>{copy.shape2[locale]}</P>
      <FileTree tree={projectTree} caption={copy.treeCaption[locale]} />
      <P>{copy.shape3[locale]}</P>

      <H2>{copy.schemaTitle[locale]}</H2>
      <P>{copy.schema1[locale]}</P>
      <CodeBlock lang="graphql" filename="contract/schema.graphql" code={SCHEMA_CODE} />
      <P>{copy.schema2[locale]}</P>
      <UL>
        <LI><Strong>{copy.ruleWords[locale]}</Strong> {copy.ruleWordsBody[locale]}</LI>
        <LI><Strong>{copy.ruleMoney[locale]}</Strong> {copy.ruleMoneyBody[locale]}</LI>
        <LI><Strong>{copy.ruleIdentifiers[locale]}</Strong> {copy.ruleIdentifiersBody[locale]}</LI>
        <LI><Strong>{copy.rulePayload[locale]}</Strong> {copy.rulePayloadBody[locale]}</LI>
      </UL>
      <P>
        {copy.schema3Before[locale]}
        <A href={`/${locale}/blog/graphql-as-a-contract-between-frontend-and-backend`}>{copy.contractArticleLink[locale]}</A>
        {copy.schema3After[locale]}
      </P>

      <H2>{copy.serverTitle[locale]}</H2>
      <P>{copy.server1[locale]}</P>
      <CodeBlock lang="bash" code={SERVER_CREATE_CODE} />
      <P>{copy.server2[locale]}</P>
      <CodeBlock lang="json" filename="server-node/package.json" code={SERVER_PACKAGE_CODE} />
      <P>{copy.server3[locale]}</P>
      <CodeBlock lang="json" filename="server-node/tsconfig.json" code={SERVER_TSCONFIG_CODE} />
      <P>{copy.server4[locale]}</P>
      <CodeBlock lang="ts" filename="server-node/src/store.ts" code={SERVER_STORE_CODE} />
      <P>{copy.server5[locale]}</P>
      <CodeBlock lang="ts" filename="server-node/src/context.ts" code={SERVER_CONTEXT_CODE} />
      <P>{copy.server6[locale]}</P>
      <CodeBlock lang="ts" filename="server-node/src/resolvers.ts" code={SERVER_RESOLVERS_CODE} />
      <P>{copy.server7[locale]}</P>
      <CodeBlock lang="ts" filename="server-node/src/main.ts" code={SERVER_MAIN_CODE} />
      <Callout variant="warning" title={copy.standaloneTitle[locale]}>
        {copy.standaloneBody[locale]}
      </Callout>
      <P>{copy.server8[locale]}</P>
      <CodeBlock lang="bash" code={SERVER_RUN_CODE} />
      <P>{copy.server9[locale]}</P>
      <CodeBlock lang="bash" code={SERVER_PRODUCTS_REQUEST_CODE} />
      <CodeBlock lang="json" code={SERVER_PRODUCTS_ANSWER_CODE} />
      <P>{copy.server10[locale]}</P>
      <CodeBlock lang="bash" code={SERVER_PRODUCT_REQUEST_CODE} />
      <CodeBlock lang="json" code={SERVER_PRODUCT_ANSWER_CODE} />
      <P>{copy.server11[locale]}</P>
      <CodeBlock lang="bash" code={SERVER_ADD_REQUEST_CODE} />
      <CodeBlock lang="json" code={SERVER_ADD_ANSWER_CODE} />
      <P>{copy.server12[locale]}</P>
      <CodeBlock lang="ts" filename="backends/node/shared/src/graphql/subgraphServer.ts" code={REPOSITORY_SERVER_CODE} />
      <P>{copy.server13[locale]}</P>

      <H2>{copy.kotlinTitle[locale]}</H2>
      <P>{copy.kotlin1[locale]}</P>
      <CodeBlock lang="kotlin" filename="service-kotlin/settings.gradle.kts" code={KOTLIN_SETTINGS_CODE} />
      <CodeBlock lang="kotlin" filename="service-kotlin/build.gradle.kts" code={KOTLIN_BUILD_CODE} />
      <P>{copy.kotlin2[locale]}</P>
      <CodeBlock lang="yaml" filename="service-kotlin/src/main/resources/application.yaml" code={KOTLIN_APPLICATION_CODE} />
      <P>{copy.kotlin3[locale]}</P>
      <CodeBlock lang="kotlin" filename="service-kotlin/src/main/kotlin/nl/example/store/StoreApplication.kt" code={KOTLIN_APPLICATION_CLASS_CODE} />
      <CodeBlock lang="kotlin" filename="service-kotlin/src/main/kotlin/nl/example/store/Catalogue.kt" code={KOTLIN_CATALOGUE_CODE} />
      <P>{copy.kotlin4[locale]}</P>
      <CodeBlock lang="kotlin" filename="service-kotlin/src/main/kotlin/nl/example/store/CatalogueController.kt" code={KOTLIN_CATALOGUE_CONTROLLER_CODE} />
      <P>{copy.kotlin5[locale]}</P>
      <CodeBlock lang="kotlin" filename="service-kotlin/src/main/kotlin/nl/example/store/CartController.kt" code={KOTLIN_CART_CONTROLLER_CODE} />
      <P>{copy.kotlin6[locale]}</P>
      <CodeBlock lang="bash" code={KOTLIN_RUN_CODE} />
      <P>{copy.kotlin7[locale]}</P>
      <CodeBlock lang="bash" code={KOTLIN_REQUEST_CODE} />
      <CodeBlock lang="json" code={KOTLIN_ANSWER_CODE} />
      <Callout variant="tip" title={copy.inspectionTitle[locale]}>
        {copy.inspectionBody[locale]}
      </Callout>
      <P>{copy.kotlin8[locale]}</P>
      <CodeBlock lang="kotlin" filename="backends/kotlin/zappy-adapters/src/main/kotlin/nl/zappymart/adapters/graphql/CatalogueController.kt" code={REPOSITORY_KOTLIN_CODE} />
      <P>{copy.kotlin9[locale]}</P>
      <P>{copy.kotlin10[locale]}</P>

      <H2>{copy.gatewayTitle[locale]}</H2>
      <P>{copy.gateway1[locale]}</P>
      <FlowDiagram
        nodes={requestPath.nodes}
        edges={requestPath.edges}
        height={520}
        ariaLabel={copy.gatewayAria[locale]}
        caption={copy.gatewayCaption[locale]}
      />
      <P>{copy.gateway2[locale]}</P>
      <CodeBlock lang="ts" filename="server-node/src/catalogueService.ts" code={SERVER_SERVICE_CLIENT_CODE} />
      <P>{copy.gateway3[locale]}</P>
      <CodeBlock lang="ts" filename="server-node/src/context.ts" code={SERVER_CONTEXT_REMOTE_CODE} />
      <P>{copy.gateway4[locale]}</P>
      <CodeBlock lang="graphql" filename="backends/node/subgraphs/catalogue/schema.graphql" code={REPOSITORY_SUBGRAPH_SCHEMA_CODE} />
      <P>{copy.gateway5[locale]}</P>
      <CodeBlock lang="ts" filename="backends/node/subgraphs/cart/src/adapters/catalogue/entityCatalogueReader.ts" code={REPOSITORY_ENTITY_READER_CODE} />
      <P>
        {copy.gateway6Before[locale]}
        <A href={`/${locale}/blog/apollo-federation-explained-by-building-a-supergraph`}>{copy.federationArticleLink[locale]}</A>
        {copy.gateway6After[locale]}
      </P>

      <H2>{copy.clientTitle[locale]}</H2>
      <P>{copy.client1[locale]}</P>
      <CodeBlock lang="bash" code={CLIENT_CREATE_CODE} />
      <P>{copy.client2[locale]}</P>
      <CodeBlock lang="json" filename="client-react/package.json" code={CLIENT_PACKAGE_CODE} />
      <P>{copy.client3[locale]}</P>
      <CodeBlock lang="ts" filename="client-react/codegen.ts" code={CLIENT_CODEGEN_CODE} />
      <P>{copy.client4[locale]}</P>
      <CodeBlock lang="ts" filename="client-react/graphql/operations.ts" code={CLIENT_OPERATIONS_CODE} />
      <P>{copy.client5[locale]}</P>
      <CodeBlock lang="bash" code={CLIENT_GENERATE_CODE} />
      <P>{copy.client6[locale]}</P>
      <CodeBlock lang="ts" filename="client-react/browser/storeClient.ts" code={CLIENT_BROWSER_CODE} />
      <P>{copy.client7[locale]}</P>
      <CodeBlock lang="tsx" filename="client-react/app/CatalogueList.tsx" code={CLIENT_USE_QUERY_CODE} />
      <P>{copy.client8[locale]}</P>

      <H2>{copy.renderingTitle[locale]}</H2>
      <P>{copy.rendering1[locale]}</P>
      <CodeBlock lang="ts" filename="client-react/server/storeClient.ts" code={CLIENT_SERVER_CODE} />
      <P>{copy.rendering2[locale]}</P>
      <CodeBlock lang="tsx" filename="client-react/app/page.tsx" code={CLIENT_PAGE_CODE} />
      <P>{copy.rendering3[locale]}</P>
      <CodeBlock lang="ts" filename="client-react/app/actions.ts" code={CLIENT_ACTION_CODE} />
      <CodeBlock lang="tsx" filename="client-react/app/AddToCartForm.tsx" code={CLIENT_FORM_CODE} />
      <P>{copy.rendering4[locale]}</P>
      <CodeBlock lang="bash" code={CLIENT_RUN_CODE} />
      <P>{copy.rendering5[locale]}</P>
      <CodeBlock lang="ts" filename="frontends/nextjs/server/storefrontClient.ts" code={REPOSITORY_CLIENT_CODE} />
      <P>{copy.rendering6[locale]}</P>

      <H2>{copy.errorsTitle[locale]}</H2>
      <P>{copy.errors1[locale]}</P>
      <P>{copy.errors2[locale]}</P>
      <CodeBlock lang="bash" code={FAILURE_STOCK_REQUEST_CODE} />
      <CodeBlock lang="json" code={FAILURE_STOCK_ANSWER_CODE} />
      <P>{copy.errors3[locale]}</P>
      <CodeBlock lang="bash" code={FAILURE_UNKNOWN_REQUEST_CODE} />
      <CodeBlock lang="json" code={FAILURE_UNKNOWN_ANSWER_CODE} />
      <P>{copy.errors4[locale]}</P>
      <CodeBlock lang="json" code={FAILURE_PARTIAL_ANSWER_CODE} />
      <P>{copy.errors5[locale]}</P>
      <CodeBlock lang="ts" filename="client-react/server/storeClient.ts" code={CLIENT_ERROR_POLICY_CODE} />
      <P>{copy.errors6[locale]}</P>
      <CodeBlock lang="ts" filename="server-node/src/main.ts" code={SERVER_FORMAT_ERROR_CODE} />
      <P>{copy.errors7[locale]}</P>
      <CodeBlock lang="kotlin" filename="service-kotlin/src/main/kotlin/nl/example/store/CartController.kt" code={KOTLIN_EXCEPTION_HANDLER_CODE} />
      <P>{copy.errors8[locale]}</P>

      <H2>{copy.codegenTitle[locale]}</H2>
      <P>{copy.codegen1[locale]}</P>
      <CodeBlock lang="ts" filename="frontends/nextjs/codegen.ts" code={REPOSITORY_CODEGEN_CODE} />
      <P>{copy.codegen2[locale]}</P>
      <CodeBlock lang="js" filename="backends/node/tools/generate-resolver-types.mjs" code={REPOSITORY_RESOLVER_CODEGEN_CODE} />
      <P>{copy.codegen3[locale]}</P>
      <CodeBlock lang="ts" filename="server-node/src/resolvers.ts" code={SERVER_TYPED_RESOLVERS_CODE} />
      <P>{copy.codegen4[locale]}</P>
      <OL>
        <LI>{copy.codegenStep1[locale]}</LI>
        <LI>{copy.codegenStep2[locale]}</LI>
        <LI>{copy.codegenStep3[locale]}</LI>
        <LI>{copy.codegenStep4[locale]}</LI>
      </OL>
      <P>{copy.codegen5[locale]}</P>

      <H2>{copy.testingTitle[locale]}</H2>
      <P>{copy.testing1[locale]}</P>
      <CodeBlock lang="ts" filename="server-node/tests/catalogue.test.ts" code={SERVER_TEST_CODE} />
      <CodeBlock lang="bash" code={SERVER_TEST_RUN_CODE} />
      <P>{copy.testing2[locale]}</P>
      <CodeBlock lang="kotlin" filename="service-kotlin/src/test/kotlin/nl/example/store/CatalogueControllerTest.kt" code={KOTLIN_TEST_CODE} />
      <CodeBlock lang="bash" code={KOTLIN_TEST_RUN_CODE} />
      <P>{copy.testing3[locale]}</P>
      <CodeBlock lang="tsx" filename="client-react/tests/addToCartForm.test.tsx" code={CLIENT_TEST_CODE} />
      <CodeBlock lang="bash" code={CLIENT_TEST_RUN_CODE} />
      <Callout variant="info" title={copy.mockTrapTitle[locale]}>
        {copy.mockTrapBody[locale]}
      </Callout>
      <P>{copy.testing4[locale]}</P>

      <H2>{copy.urqlTitle[locale]}</H2>
      <P>{copy.urql1[locale]}</P>
      <CodeBlock lang="ts" filename="frontends/react-router/app/graphql/client.server.ts" code={REPOSITORY_URQL_CODE} />
      <P>{copy.urql2[locale]}</P>
      <UL>
        <LI><Strong>{copy.diffTypes[locale]}</Strong> {copy.diffTypesBody[locale]}</LI>
        <LI><Strong>{copy.diffCache[locale]}</Strong> {copy.diffCacheBody[locale]}</LI>
        <LI><Strong>{copy.diffPipeline[locale]}</Strong> {copy.diffPipelineBody[locale]}</LI>
        <LI><Strong>{copy.diffMasking[locale]}</Strong> {copy.diffMaskingBody[locale]}</LI>
      </UL>
      <P>{copy.urql3[locale]}</P>
      <P>{copy.urql4[locale]}</P>

      <Divider />

      <H2>{copy.closingTitle[locale]}</H2>
      <P>{copy.closing1[locale]}</P>
      <OL>
        <LI>{copy.closingStep1[locale]}</LI>
        <LI>{copy.closingStep2[locale]}</LI>
        <LI>{copy.closingStep3[locale]}</LI>
        <LI>{copy.closingStep4[locale]}</LI>
        <LI>{copy.closingStep5[locale]}</LI>
      </OL>
      <P>{copy.closing2[locale]}</P>
      <P>{copy.closing3[locale]}</P>
    </>
  );
}

const SCHEMA_CODE = `type Money {
  amount: Int!
  currency: String!
}

type Category {
  id: ID!
  name: String!
  slug: String!
}

type Product {
  id: ID!
  name: String!
  slug: String!
  price: Money!
  stock: Int!
  category: Category!
}

input ProductFilter {
  categorySlug: String
  inStockOnly: Boolean
}

enum UserErrorCode {
  PRODUCT_NOT_FOUND
  QUANTITY_INVALID
  OUT_OF_STOCK
}

type UserError {
  code: UserErrorCode!
  message: String!
  field: String
}

type CartLine {
  id: ID!
  quantity: Int!
  product: Product!
  lineTotal: Money!
}

type Cart {
  id: ID!
  lines: [CartLine!]!
  subtotal: Money!
}

type CartPayload {
  cart: Cart
  availableStock: Int
  errors: [UserError!]!
}

type Query {
  products(filter: ProductFilter): [Product!]!
  product(slug: String!): Product
  cart: Cart!
}

type Mutation {
  addToCart(productId: ID!, quantity: Int): CartPayload!
}`;

const SERVER_CREATE_CODE = `mkdir -p apollo-across-the-stack/server-node/src apollo-across-the-stack/server-node/tests
cd apollo-across-the-stack/server-node
npm init --yes
npm install @apollo/server@5.5.1 graphql@16.14.2 dataloader@2.2.3
npm install --save-dev typescript@6.0.3 @types/node@24.13.3
cp ../contract/schema.graphql schema.graphql`;

const SERVER_PACKAGE_CODE = `{
  "name": "store-server-node",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=24"
  },
  "scripts": {
    "build": "tsc --build",
    "start": "node distribution/src/main.js",
    "test": "node --test \\"distribution/tests/**/*.test.js\\""
  },
  "dependencies": {
    "@apollo/server": "5.5.1",
    "dataloader": "2.2.3",
    "graphql": "16.14.2"
  },
  "devDependencies": {
    "@types/node": "24.13.3",
    "typescript": "6.0.3"
  }
}`;

const SERVER_TSCONFIG_CODE = `{
  "compilerOptions": {
    "target": "es2024",
    "lib": ["es2024"],
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "types": ["node"],
    "rootDir": ".",
    "outDir": "distribution",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true
  },
  "include": ["src", "tests"]
}`;

const SERVER_STORE_CODE = `export type Money = { amount: number; currency: string };

export type Category = { id: string; name: string; slug: string };

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: Money;
  stock: number;
  categorySlug: string;
};

export type CartLine = { id: string; product: Product; quantity: number };

export type ProductFilter = { categorySlug?: string | null; inStockOnly?: boolean | null };

const categories: Category[] = [
  { id: "category-mens-clothing", name: "Men's clothing", slug: "mens-clothing" },
  { id: "category-electronics", name: "Electronics", slug: "electronics" }
];

const products: Product[] = [
  {
    id: "product-01",
    name: "Fjallraven Foldsack No. 1 Backpack",
    slug: "fjallraven-foldsack-no-1-backpack",
    price: { amount: 10995, currency: "EUR" },
    stock: 12,
    categorySlug: "mens-clothing"
  },
  {
    id: "product-09",
    name: "WD 2TB Elements Portable External Hard Drive",
    slug: "wd-2tb-elements-portable-external-hard-drive",
    price: { amount: 6400, currency: "EUR" },
    stock: 15,
    categorySlug: "electronics"
  },
  {
    id: "product-12",
    name: "WD 4TB Gaming Drive",
    slug: "wd-4tb-gaming-drive-playstation-4",
    price: { amount: 11400, currency: "EUR" },
    stock: 1,
    categorySlug: "electronics"
  }
];

const cartLines: CartLine[] = [];

export function listProducts(filter: ProductFilter | null): Product[] {
  return products.filter((product) => {
    const categoryMatches = !filter?.categorySlug || product.categorySlug === filter.categorySlug;
    const stockMatches = filter?.inStockOnly !== true || product.stock > 0;
    return categoryMatches && stockMatches;
  });
}

export function findProductBySlug(slug: string): Product | null {
  return products.find((product) => product.slug === slug) ?? null;
}

export function findProductById(productId: string): Product | null {
  return products.find((product) => product.id === productId) ?? null;
}

export async function readCategories(slugs: readonly string[]): Promise<(Category | null)[]> {
  console.log(\`the store reads these categories in one call: \${slugs.join(", ")}\`);
  const bySlug = new Map(categories.map((category) => [category.slug, category]));
  return slugs.map((slug) => bySlug.get(slug) ?? null);
}

export function readCart(): { id: string; lines: CartLine[] } {
  return { id: "cart-1", lines: [...cartLines] };
}

export function addLine(product: Product, quantity: number): void {
  const existing = cartLines.find((line) => line.product.id === product.id);
  if (existing === undefined) {
    cartLines.push({ id: \`line-\${cartLines.length + 1}\`, product, quantity });
    return;
  }
  existing.quantity += quantity;
}`;

const SERVER_CONTEXT_CODE = `import DataLoader from "dataloader";
import { readCategories } from "./store.js";
import type { Category } from "./store.js";

export type StoreContext = {
  categoryLoader: DataLoader<string, Category | null>;
};

export function buildContext(): StoreContext {
  return {
    categoryLoader: new DataLoader<string, Category | null>((slugs) => readCategories(slugs))
  };
}`;

const SERVER_RESOLVERS_CODE = `import { GraphQLError } from "graphql";
import type { StoreContext } from "./context.js";
import { addLine, findProductById, findProductBySlug, listProducts, readCart } from "./store.js";
import type { CartLine, Category, Money, Product, ProductFilter } from "./store.js";

const euro = (amount: number): Money => ({ amount, currency: "EUR" });

const totalOfLine = (line: CartLine): Money => euro(line.product.price.amount * line.quantity);

export const resolvers = {
  Query: {
    products(_parent: unknown, args: { filter?: ProductFilter | null }): Product[] {
      return listProducts(args.filter ?? null);
    },

    product(_parent: unknown, args: { slug: string }): Product | null {
      return findProductBySlug(args.slug);
    },

    cart() {
      return readCart();
    }
  },

  Mutation: {
    addToCart(_parent: unknown, args: { productId: string; quantity?: number | null }) {
      const asked = args.quantity ?? 1;
      const product = findProductById(args.productId);
      if (product === null) {
        return {
          cart: readCart(),
          availableStock: null,
          errors: [
            {
              code: "PRODUCT_NOT_FOUND",
              message: \`No product with id \${args.productId}.\`,
              field: "productId"
            }
          ]
        };
      }
      if (!Number.isInteger(asked) || asked < 1) {
        return {
          cart: readCart(),
          availableStock: product.stock,
          errors: [
            {
              code: "QUANTITY_INVALID",
              message: "A quantity is a whole number of one or more.",
              field: "quantity"
            }
          ]
        };
      }
      if (asked > product.stock) {
        return {
          cart: readCart(),
          availableStock: product.stock,
          errors: [
            {
              code: "OUT_OF_STOCK",
              message: \`\${product.name} has \${product.stock} in stock.\`,
              field: "quantity"
            }
          ]
        };
      }
      addLine(product, asked);
      return { cart: readCart(), availableStock: product.stock, errors: [] };
    }
  },

  Cart: {
    subtotal(cart: { lines: CartLine[] }): Money {
      return euro(cart.lines.reduce((total, line) => total + totalOfLine(line).amount, 0));
    }
  },

  CartLine: {
    lineTotal(line: CartLine): Money {
      return totalOfLine(line);
    }
  },

  Product: {
    async category(product: Product, _args: unknown, context: StoreContext): Promise<Category> {
      const category = await context.categoryLoader.load(product.categorySlug);
      if (category === null) {
        throw new GraphQLError(
          \`Product \${product.id} points at the unknown category \${product.categorySlug}\`
        );
      }
      return category;
    }
  }
};`;

const SERVER_MAIN_CODE = `import { readFileSync } from "node:fs";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildContext } from "./context.js";
import type { StoreContext } from "./context.js";
import { resolvers } from "./resolvers.js";

const typeDefs = readFileSync(new URL("../../schema.graphql", import.meta.url), "utf8");

const server = new ApolloServer<StoreContext>({
  typeDefs,
  resolvers,
  includeStacktraceInErrorResponses: false
});

const { url } = await startStandaloneServer(server, {
  context: async () => buildContext(),
  listen: { port: 4000 }
});

console.log(\`the store is serving \${url}\`);`;

const SERVER_RUN_CODE = `$ npm run build
$ npm start

the store is serving http://localhost:4000/`;

const SERVER_PRODUCTS_REQUEST_CODE = `curl -s http://localhost:4000/ \\
  -H 'content-type: application/json' \\
  -d '{"query":"{ products(filter: {categorySlug: \\"electronics\\"}) { id name slug price { amount currency } stock category { id name slug } } }"}'`;

const SERVER_PRODUCTS_ANSWER_CODE = `{
  "data": {
    "products": [
      {
        "id": "product-09",
        "name": "WD 2TB Elements Portable External Hard Drive",
        "slug": "wd-2tb-elements-portable-external-hard-drive",
        "price": { "amount": 6400, "currency": "EUR" },
        "stock": 15,
        "category": { "id": "category-electronics", "name": "Electronics", "slug": "electronics" }
      },
      {
        "id": "product-12",
        "name": "WD 4TB Gaming Drive",
        "slug": "wd-4tb-gaming-drive-playstation-4",
        "price": { "amount": 11400, "currency": "EUR" },
        "stock": 1,
        "category": { "id": "category-electronics", "name": "Electronics", "slug": "electronics" }
      }
    ]
  }
}`;

const SERVER_PRODUCT_REQUEST_CODE = `curl -s http://localhost:4000/ \\
  -H 'content-type: application/json' \\
  -d '{"query":"{ product(slug: \\"fjallraven-foldsack-no-1-backpack\\") { id name price { amount currency } stock category { name } } }"}'`;

const SERVER_PRODUCT_ANSWER_CODE = `{
  "data": {
    "product": {
      "id": "product-01",
      "name": "Fjallraven Foldsack No. 1 Backpack",
      "price": { "amount": 10995, "currency": "EUR" },
      "stock": 12,
      "category": { "name": "Men's clothing" }
    }
  }
}`;

const SERVER_ADD_REQUEST_CODE = `curl -s http://localhost:4000/ \\
  -H 'content-type: application/json' \\
  -d '{"query":"mutation AddToCart($productId: ID!, $quantity: Int) { addToCart(productId: $productId, quantity: $quantity) { availableStock cart { id subtotal { amount currency } lines { id quantity lineTotal { amount } product { id name } } } errors { code message field } } }","variables":{"productId":"product-09","quantity":2}}'`;

const SERVER_ADD_ANSWER_CODE = `{
  "data": {
    "addToCart": {
      "availableStock": 15,
      "cart": {
        "id": "cart-1",
        "subtotal": { "amount": 12800, "currency": "EUR" },
        "lines": [
          {
            "id": "line-1",
            "quantity": 2,
            "lineTotal": { "amount": 12800 },
            "product": { "id": "product-09", "name": "WD 2TB Elements Portable External Hard Drive" }
          }
        ]
      },
      "errors": []
    }
  }
}`;

const REPOSITORY_SERVER_CODE = `const application = express();
const httpServer: Server = createServer(application);

const server = new ApolloServer<Context>({
  schema,
  introspection: true,
  includeStacktraceInErrorResponses: false,
  plugins: [
    originCheckPlugin<Context>((context) => context.origin),
    ApolloServerPluginDrainHttpServer({ httpServer })
  ]
});
await server.start();

application.use(
  "/graphql",
  express.json({ limit: "512kb" }),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      const cookieHeader = req.headers.cookie ?? null;
      const authorization = req.headers.authorization ?? null;
      const base: SubgraphRequestContext = {
        visitor: await verifier.verify(authorization),
        cartCookie: readCookie(cookieHeader, cartCookieName),
        refreshCookie: readCookie(cookieHeader, refreshCookieName),
        origin: (req.headers.origin as string | undefined) ?? null,
        userAgent: (req.headers["user-agent"] as string | undefined) ?? null,
        callerAddress: req.ip ?? "unknown",
        forwarded: { authorization, cookie: cookieHeader },
        setCookie(value: string): void {
          res.append("set-cookie", value);
        }
      };
      return definition.buildContext(base);
    }
  })
);`;

const KOTLIN_SETTINGS_CODE = `rootProject.name = "store-service-kotlin"`;

const KOTLIN_BUILD_CODE = `plugins {
    kotlin("jvm") version "2.4.10"
    kotlin("plugin.spring") version "2.4.10"
    id("org.springframework.boot") version "4.1.1"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "nl.example"
version = "1.0.0"

repositories {
    mavenCentral()
}

kotlin {
    jvmToolchain(25)
    compilerOptions {
        freeCompilerArgs.add("-Xjsr305=strict")
    }
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-graphql")
    implementation("tools.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-graphql-test")
    testImplementation("org.springframework.graphql:spring-graphql-test")
}

tasks.withType<Test>().configureEach {
    useJUnitPlatform()
    testLogging {
        events("passed")
    }
}`;

const KOTLIN_APPLICATION_CODE = `spring:
  application:
    name: store-service-kotlin
  graphql:
    path: /graphql
    graphiql:
      enabled: true
    schema:
      inspection:
        enabled: true

server:
  port: 8080`;

const KOTLIN_APPLICATION_CLASS_CODE = `package nl.example.store

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class StoreApplication

fun main(arguments: Array<String>) {
    runApplication<StoreApplication>(*arguments)
}`;

const KOTLIN_CATALOGUE_CODE = `package nl.example.store

import org.springframework.stereotype.Component

data class Money(val amount: Int, val currency: String = "EUR")

data class Category(val id: String, val name: String, val slug: String)

data class Product(
    val id: String,
    val name: String,
    val slug: String,
    val price: Money,
    val stock: Int,
    val categorySlug: String,
)

data class CartLine(val id: String, val product: Product, val quantity: Int) {
    val lineTotal: Money get() = Money(product.price.amount * quantity)
}

data class Cart(val id: String, val lines: List<CartLine>) {
    val subtotal: Money get() = Money(lines.sumOf { line -> line.lineTotal.amount })
}

data class ProductFilterInput(val categorySlug: String? = null, val inStockOnly: Boolean? = null)

enum class UserErrorCode { PRODUCT_NOT_FOUND, QUANTITY_INVALID, OUT_OF_STOCK }

data class UserError(val code: UserErrorCode, val message: String, val field: String? = null)

data class CartPayload(val cart: Cart?, val availableStock: Int?, val errors: List<UserError>)

@Component
class Catalogue {

    private val categories = listOf(
        Category("category-mens-clothing", "Men's clothing", "mens-clothing"),
        Category("category-electronics", "Electronics", "electronics"),
    )

    private val everything = listOf(
        Product(
            "product-01",
            "Fjallraven Foldsack No. 1 Backpack",
            "fjallraven-foldsack-no-1-backpack",
            Money(10995),
            12,
            "mens-clothing",
        ),
        Product(
            "product-09",
            "WD 2TB Elements Portable External Hard Drive",
            "wd-2tb-elements-portable-external-hard-drive",
            Money(6400),
            15,
            "electronics",
        ),
        Product(
            "product-12",
            "WD 4TB Gaming Drive",
            "wd-4tb-gaming-drive-playstation-4",
            Money(11400),
            1,
            "electronics",
        ),
    )

    fun list(filter: ProductFilterInput?): List<Product> = everything.filter { product ->
        (filter?.categorySlug == null || product.categorySlug == filter.categorySlug) &&
            (filter?.inStockOnly != true || product.stock > 0)
    }

    fun productBySlug(slug: String): Product? = everything.firstOrNull { product -> product.slug == slug }

    fun productById(productId: String): Product? = everything.firstOrNull { product -> product.id == productId }

    fun categoriesBySlugs(slugs: Collection<String>): Map<String, Category> =
        categories.filter { category -> category.slug in slugs }.associateBy { category -> category.slug }
}

@Component
class CartStore {

    private val lines = mutableListOf<CartLine>()

    fun read(): Cart = Cart("cart-1", lines.toList())

    fun add(product: Product, quantity: Int) {
        val existing = lines.firstOrNull { line -> line.product.id == product.id }
        if (existing == null) {
            lines.add(CartLine("line-\${lines.size + 1}", product, quantity))
            return
        }
        lines[lines.indexOf(existing)] = existing.copy(quantity = existing.quantity + quantity)
    }
}`;

const KOTLIN_CATALOGUE_CONTROLLER_CODE = `package nl.example.store

import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.BatchMapping
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller

@Controller
class CatalogueController(private val catalogue: Catalogue) {

    @QueryMapping
    fun products(@Argument filter: ProductFilterInput?): List<Product> = catalogue.list(filter)

    @QueryMapping
    fun product(@Argument slug: String): Product? = catalogue.productBySlug(slug)

    @BatchMapping(typeName = "Product", field = "category")
    fun categoryOfEach(products: List<Product>): Map<Product, Category> {
        val bySlug = catalogue.categoriesBySlugs(products.map { product -> product.categorySlug })
        return products.associateWith { product -> bySlug.getValue(product.categorySlug) }
    }
}`;

const KOTLIN_CART_CONTROLLER_CODE = `package nl.example.store

import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller

@Controller
class CartController(
    private val catalogue: Catalogue,
    private val cartStore: CartStore,
) {

    @QueryMapping
    fun cart(): Cart = cartStore.read()

    @MutationMapping
    fun addToCart(@Argument productId: String, @Argument quantity: Int?): CartPayload {
        val asked = quantity ?: 1
        val product = catalogue.productById(productId)
            ?: return refused(UserErrorCode.PRODUCT_NOT_FOUND, "No product with id $productId.", "productId", null)
        if (asked < 1) {
            return refused(
                UserErrorCode.QUANTITY_INVALID,
                "A quantity is a whole number of one or more.",
                "quantity",
                product.stock,
            )
        }
        if (asked > product.stock) {
            return refused(
                UserErrorCode.OUT_OF_STOCK,
                "\${product.name} has \${product.stock} in stock.",
                "quantity",
                product.stock,
            )
        }
        cartStore.add(product, asked)
        return CartPayload(cartStore.read(), product.stock, emptyList())
    }

    private fun refused(code: UserErrorCode, message: String, field: String, availableStock: Int?) =
        CartPayload(cartStore.read(), availableStock, listOf(UserError(code, message, field)))
}`;

const KOTLIN_RUN_CODE = `$ ./gradlew bootRun

 :: Spring Boot ::                (v4.1.1)

INFO  n.example.store.StoreApplicationKt : Starting StoreApplicationKt using Java 25
INFO  o.s.b.web.embedded.tomcat.TomcatWebServer : Tomcat started on port 8080 (http)
INFO  n.example.store.StoreApplicationKt : Started StoreApplicationKt`;

const KOTLIN_REQUEST_CODE = `curl -s http://localhost:8080/graphql \\
  -H 'content-type: application/json' \\
  -d '{"query":"{ products(filter: {categorySlug: \\"electronics\\"}) { id name slug price { amount currency } stock category { id name slug } } }"}'`;

const KOTLIN_ANSWER_CODE = `{
  "data": {
    "products": [
      {
        "id": "product-09",
        "name": "WD 2TB Elements Portable External Hard Drive",
        "slug": "wd-2tb-elements-portable-external-hard-drive",
        "price": { "amount": 6400, "currency": "EUR" },
        "stock": 15,
        "category": { "id": "category-electronics", "name": "Electronics", "slug": "electronics" }
      },
      {
        "id": "product-12",
        "name": "WD 4TB Gaming Drive",
        "slug": "wd-4tb-gaming-drive-playstation-4",
        "price": { "amount": 11400, "currency": "EUR" },
        "stock": 1,
        "category": { "id": "category-electronics", "name": "Electronics", "slug": "electronics" }
      }
    ]
  }
}`;

const REPOSITORY_KOTLIN_CODE = `@Controller
class CatalogueController(
    private val listProducts: ListProducts,
    private val findProduct: FindProduct,
    private val listCategories: ListCategories,
) {

    @QueryMapping
    suspend fun products(
        @Argument filter: ProductFilterInput?,
        @Argument first: Int?,
        @Argument after: String?,
    ): ProductConnection {
        val specification = ProductSpecification.of(filter?.categorySlug, filter?.nameContains, filter?.inStockOnly)
        return ProductConnection.of(
            listProducts.execute(specification, first ?: DEFAULT_PRODUCT_PAGE_SIZE, Cursors.idOf(after)),
        )
    }

    @QueryMapping
    fun product(@Argument slug: String): Product? = findProduct.execute(slug)

    @QueryMapping
    fun categories(): List<Category> = listCategories.execute()

    private companion object {
        const val DEFAULT_PRODUCT_PAGE_SIZE = 24
    }
}`;

const SERVER_SERVICE_CLIENT_CODE = `import type { Category } from "./store.js";

const serviceUrl = process.env["STORE_SERVICE_URL"] ?? "http://localhost:8080/graphql";

const categoriesDocument = \`
  query CategoriesBySlugs($slugs: [String!]!) {
    categoriesBySlugs(slugs: $slugs) {
      id
      name
      slug
    }
  }
\`;

type CategoriesAnswer = {
  data?: { categoriesBySlugs: Category[] } | null;
  errors?: ReadonlyArray<{ message: string }>;
};

export async function readCategoriesFromService(
  slugs: readonly string[]
): Promise<(Category | null)[]> {
  const response = await fetch(serviceUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: categoriesDocument, variables: { slugs } })
  });
  const answer = (await response.json()) as CategoriesAnswer;
  if (answer.errors !== undefined && answer.errors.length > 0) {
    throw new Error(answer.errors.map((failure) => failure.message).join(" "));
  }
  const bySlug = new Map((answer.data?.categoriesBySlugs ?? []).map((category) => [category.slug, category]));
  return slugs.map((slug) => bySlug.get(slug) ?? null);
}`;

const SERVER_CONTEXT_REMOTE_CODE = `import DataLoader from "dataloader";
import { readCategoriesFromService } from "./catalogueService.js";
import type { Category } from "./store.js";

export type StoreContext = {
  categoryLoader: DataLoader<string, Category | null>;
};

export function buildContext(): StoreContext {
  return {
    categoryLoader: new DataLoader<string, Category | null>((slugs) =>
      readCategoriesFromService(slugs)
    )
  };
}`;

const REPOSITORY_SUBGRAPH_SCHEMA_CODE = `extend schema
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
}`;

const REPOSITORY_ENTITY_READER_CODE = `const productsByReferenceDocument = \`
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
  });`;

const CLIENT_CREATE_CODE = `npx create-next-app@16.3.4 client-react --typescript --tailwind --eslint --app \\
  --import-alias "@/*" --use-npm --skip-install --disable-git --empty --yes
cd client-react`;

const CLIENT_PACKAGE_CODE = `{
  "name": "store-client-react",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "generate": "graphql-codegen --config codegen.ts",
    "test": "vitest run"
  },
  "dependencies": {
    "@apollo/client": "4.2.12",
    "graphql": "17.0.2",
    "next": "16.3.4",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "rxjs": "7.8.2",
    "server-only": "0.0.1"
  },
  "devDependencies": {
    "@graphql-codegen/cli": "7.4.0",
    "@graphql-codegen/client-preset": "6.1.3",
    "@testing-library/react": "16.3.3",
    "@types/react": "19.2.18",
    "@types/react-dom": "19.2.7",
    "@vitejs/plugin-react": "6.1.1",
    "jsdom": "30.0.1",
    "typescript": "6.0.3",
    "vitest": "5.0.0"
  }
}`;

const CLIENT_CODEGEN_CODE = `import type { CodegenConfig } from "@graphql-codegen/cli";

const codegenConfiguration: CodegenConfig = {
  schema: "../contract/schema.graphql",
  documents: ["graphql/operations.ts"],
  ignoreNoDocuments: false,
  generates: {
    "graphql/generated/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        useTypeImports: true,
        enumsAsConst: true,
        scalars: {
          ID: "string",
        },
      },
    },
  },
};

export default codegenConfiguration;`;

const CLIENT_OPERATIONS_CODE = `import { graphql } from "@/graphql/generated";

export const productSummaryFragment = graphql(\`
  fragment ProductSummary on Product {
    id
    name
    slug
    stock
    price {
      amount
      currency
    }
    category {
      id
      name
      slug
    }
  }
\`);

export const userErrorFragment = graphql(\`
  fragment UserErrorDetail on UserError {
    code
    message
    field
  }
\`);

export const catalogueQuery = graphql(\`
  query Catalogue($filter: ProductFilter) {
    products(filter: $filter) {
      ...ProductSummary
    }
  }
\`);

export const addToCartMutation = graphql(\`
  mutation AddToCart($productId: ID!, $quantity: Int) {
    addToCart(productId: $productId, quantity: $quantity) {
      availableStock
      cart {
        id
        subtotal {
          amount
          currency
        }
      }
      errors {
        ...UserErrorDetail
      }
    }
  }
\`);`;

const CLIENT_GENERATE_CODE = `$ npm install
$ npm run generate
$ ls graphql/generated

gql.ts  graphql.ts  index.ts`;

const CLIENT_BROWSER_CODE = `"use client";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import type { ReactNode } from "react";

const storeClient = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/", credentials: "include" }),
  cache: new InMemoryCache({
    typePolicies: {
      Product: { keyFields: ["id"] },
      Cart: { keyFields: ["id"] },
      Money: { keyFields: false }
    }
  })
});

export function StoreProvider({ children }: { children: ReactNode }) {
  return <ApolloProvider client={storeClient}>{children}</ApolloProvider>;
}`;

const CLIENT_USE_QUERY_CODE = `"use client";

import { useQuery } from "@apollo/client/react";
import { catalogueQuery } from "@/graphql/operations";

const euro = (cents: number) => (cents / 100).toFixed(2);

export function CatalogueList() {
  const { data, loading, error } = useQuery(catalogueQuery, {
    variables: { filter: { inStockOnly: true } }
  });

  if (loading) {
    return <p>Reading the catalogue.</p>;
  }
  if (error) {
    return <p role="alert">The store is not answering right now.</p>;
  }

  return (
    <ul>
      {data?.products.map((product) => (
        <li key={product.id}>
          {product.name}, {euro(product.price.amount)} {product.price.currency}
        </li>
      ))}
    </ul>
  );
}`;

const CLIENT_SERVER_CODE = `import "server-only";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import type { OperationVariables, TypedDocumentNode } from "@apollo/client";

const storeUrl = process.env["STORE_GRAPHQL_URL"] ?? "http://localhost:4000/";

function createStoreClient(): ApolloClient {
  const fetchWithoutCaching: typeof fetch = (target, options) =>
    fetch(target, { ...options, cache: "no-store" });

  return new ApolloClient({
    link: new HttpLink({ uri: storeUrl, fetch: fetchWithoutCaching }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { fetchPolicy: "no-cache" },
      mutate: { fetchPolicy: "no-cache" }
    }
  });
}

export async function readFromStore<Data, Variables extends OperationVariables>(
  document: TypedDocumentNode<Data, Variables>,
  variables: Variables
): Promise<Data | null> {
  const result = await createStoreClient().query({ query: document, variables });
  return result.data ?? null;
}

export async function writeToStore<Data, Variables extends OperationVariables>(
  document: TypedDocumentNode<Data, Variables>,
  variables: Variables
): Promise<Data | null> {
  const result = await createStoreClient().mutate({ mutation: document, variables });
  return result.data ?? null;
}`;

const CLIENT_PAGE_CODE = `import { catalogueQuery } from "@/graphql/operations";
import { readFromStore } from "@/server/storeClient";
import { AddToCartForm } from "./AddToCartForm";

const euro = (cents: number) => (cents / 100).toFixed(2);

export default async function CataloguePage() {
  const data = await readFromStore(catalogueQuery, { filter: { inStockOnly: true } });

  if (data === null) {
    return <p role="alert">The store is not answering right now.</p>;
  }

  return (
    <main>
      <h1>Catalogue</h1>
      <ul>
        {data.products.map((product) => (
          <li key={product.id}>
            <h2>{product.name}</h2>
            <p>
              {euro(product.price.amount)} {product.price.currency}
            </p>
            <AddToCartForm productId={product.id} />
          </li>
        ))}
      </ul>
    </main>
  );
}`;

const CLIENT_ACTION_CODE = `"use server";

import { revalidatePath } from "next/cache";
import { addToCartMutation } from "@/graphql/operations";
import { writeToStore } from "@/server/storeClient";

export type AddToCartState = { message: string | null };

export const noMessage: AddToCartState = { message: null };

export async function addProductToCart(
  previousState: AddToCartState,
  form: FormData
): Promise<AddToCartState> {
  const productId = String(form.get("productId") ?? "");
  const data = await writeToStore(addToCartMutation, { productId, quantity: 1 });

  if (data === null) {
    return { message: "The store is not answering right now." };
  }

  const [firstFailure] = data.addToCart.errors;
  if (firstFailure !== undefined) {
    return { message: firstFailure.message };
  }

  revalidatePath("/");
  return noMessage;
}`;

const CLIENT_FORM_CODE = `"use client";

import { useActionState } from "react";
import { addProductToCart, noMessage } from "./actions";

export function AddToCartForm({ productId }: { productId: string }) {
  const [state, submit, pending] = useActionState(addProductToCart, noMessage);

  return (
    <form action={submit}>
      <input type="hidden" name="productId" value={productId} />
      <button type="submit" disabled={pending}>
        Add to cart
      </button>
      {state.message !== null && <p role="alert">{state.message}</p>}
    </form>
  );
}`;

const CLIENT_RUN_CODE = `$ npm run dev

▲ Next.js 16.3.4 (Turbopack)
- Local:   http://localhost:3000`;

const REPOSITORY_CLIENT_CODE = `export async function createStorefrontClient(): Promise<StorefrontClient> {
  const session = await readSession();
  const apiCookies = await readApiCookies();
  const receivedApiCookies: ApiCookieUpdate = {};

  const fetchThroughSession: typeof fetch = async (target, options) => {
    const headers = new Headers(options?.headers);
    headers.set("origin", storefrontOrigin);
    if (session.accessToken !== null) {
      headers.set("authorization", \`Bearer \${session.accessToken}\`);
    }
    const cookieHeader = buildApiCookieHeader(apiCookies);
    if (cookieHeader !== null) {
      headers.set("cookie", cookieHeader);
    }
    const response = await fetch(target, {
      ...options,
      headers,
      cache: "no-store",
    });
    Object.assign(
      receivedApiCookies,
      readApiCookieUpdate(response.headers.getSetCookie()),
    );
    return response;
  };

  const apollo = new ApolloClient({
    link: new HttpLink({
      uri: graphqlEndpoint,
      fetch: fetchThroughSession,
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { fetchPolicy: "no-cache" },
      mutate: { fetchPolicy: "no-cache" },
    },
  });

  return { apollo, receivedApiCookies, session };
}`;

const FAILURE_STOCK_REQUEST_CODE = `curl -s http://localhost:4000/ \\
  -H 'content-type: application/json' \\
  -d '{"query":"mutation { addToCart(productId: \\"product-12\\", quantity: 2) { availableStock cart { id subtotal { amount } } errors { code message field } } }"}'`;

const FAILURE_STOCK_ANSWER_CODE = `{
  "data": {
    "addToCart": {
      "availableStock": 1,
      "cart": { "id": "cart-1", "subtotal": { "amount": 12800 } },
      "errors": [
        {
          "code": "OUT_OF_STOCK",
          "message": "WD 4TB Gaming Drive has 1 in stock.",
          "field": "quantity"
        }
      ]
    }
  }
}`;

const FAILURE_UNKNOWN_REQUEST_CODE = `curl -s -w 'HTTP %{http_code}' http://localhost:4000/ \\
  -H 'content-type: application/json' \\
  -d '{"query":"{ products { id weight } }"}'`;

const FAILURE_UNKNOWN_ANSWER_CODE = `{
  "errors": [
    {
      "message": "Cannot query field \\"weight\\" on type \\"Product\\".",
      "locations": [{ "line": 1, "column": 17 }],
      "extensions": { "code": "GRAPHQL_VALIDATION_FAILED" }
    }
  ]
}
HTTP 400`;

const FAILURE_PARTIAL_ANSWER_CODE = `{
  "errors": [
    {
      "message": "Product product-99 points at the unknown category nowhere",
      "locations": [{ "line": 1, "column": 22 }],
      "path": ["products", 3, "category"],
      "extensions": { "code": "INTERNAL_SERVER_ERROR" }
    }
  ],
  "data": {
    "products": [
      { "id": "product-01", "name": "Fjallraven Foldsack No. 1 Backpack", "category": { "slug": "mens-clothing" } },
      { "id": "product-09", "name": "WD 2TB Elements Portable External Hard Drive", "category": { "slug": "electronics" } },
      { "id": "product-12", "name": "WD 4TB Gaming Drive", "category": { "slug": "electronics" } },
      { "id": "product-99", "name": "A product whose category is missing", "category": null }
    ]
  }
}`;

const CLIENT_ERROR_POLICY_CODE = `import { CombinedGraphQLErrors } from "@apollo/client/errors";

export type StoreAnswer<Data> = { data: Data | null; failures: readonly string[] };

export async function readFromStore<Data, Variables extends OperationVariables>(
  document: TypedDocumentNode<Data, Variables>,
  variables: Variables
): Promise<StoreAnswer<Data>> {
  const result = await createStoreClient().query({
    query: document,
    variables,
    errorPolicy: "all"
  });

  const failures = CombinedGraphQLErrors.is(result.error)
    ? result.error.errors.map((failure) => failure.message)
    : [];

  return { data: result.data ?? null, failures };
}`;

const SERVER_FORMAT_ERROR_CODE = `const server = new ApolloServer<StoreContext>({
  typeDefs,
  resolvers,
  includeStacktraceInErrorResponses: false,
  formatError(formatted, failure) {
    console.error(failure);
    if (formatted.extensions?.["code"] === "INTERNAL_SERVER_ERROR") {
      return {
        message: "The store could not answer that field.",
        path: formatted.path,
        extensions: { code: "INTERNAL_SERVER_ERROR" }
      };
    }
    return formatted;
  }
});`;

const KOTLIN_EXCEPTION_HANDLER_CODE = `import graphql.GraphQLError
import graphql.GraphqlErrorBuilder
import org.springframework.graphql.data.method.annotation.GraphQlExceptionHandler
import org.springframework.graphql.execution.ErrorType

@GraphQlExceptionHandler
fun onUnreadableCart(failure: IllegalStateException): GraphQLError =
    GraphqlErrorBuilder.newError()
        .errorType(ErrorType.INTERNAL_ERROR)
        .message("The cart could not be read.")
        .build()`;

const REPOSITORY_CODEGEN_CODE = `import type { CodegenConfig } from "@graphql-codegen/cli";

const codegenConfiguration: CodegenConfig = {
  schema: "../../contract/schema.graphql",
  documents: ["graphql/operations.ts"],
  ignoreNoDocuments: false,
  generates: {
    "graphql/generated/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        useTypeImports: true,
        enumsAsConst: true,
        scalars: {
          DateTime: "string",
          ID: "string",
        },
      },
    },
  },
};

export default codegenConfiguration;`;

const REPOSITORY_RESOLVER_CODEGEN_CODE = `const generates = {};
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
}`;

const SERVER_TYPED_RESOLVERS_CODE = `import type { Resolvers } from "./generated/resolvers.js";

export const resolvers: Resolvers = {
  Query: {
    products(_parent, args, context) {
      return context.catalogue.list(args.filter ?? null);
    }
  }
};`;

const SERVER_TEST_CODE = `import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ApolloServer } from "@apollo/server";
import { buildContext } from "../src/context.js";
import type { StoreContext } from "../src/context.js";
import { resolvers } from "../src/resolvers.js";

const typeDefs = readFileSync(new URL("../../schema.graphql", import.meta.url), "utf8");

async function ask(query: string) {
  const server = new ApolloServer<StoreContext>({ typeDefs, resolvers });
  const response = await server.executeOperation({ query }, { contextValue: buildContext() });
  await server.stop();
  if (response.body.kind !== "single") {
    throw new Error("the store answered with an incremental response");
  }
  return response.body.singleResult;
}

describe("the catalogue", () => {
  it("answers the products of one category with the category behind each of them", async () => {
    const answer = await ask(
      '{ products(filter: { categorySlug: "electronics" }) { id category { slug } } }'
    );
    const products = (answer.data?.products ?? []) as ReadonlyArray<{
      id: string;
      category: { slug: string };
    }>;

    assert.equal(answer.errors, undefined);
    assert.deepEqual(
      products.map((product) => product.id),
      ["product-09", "product-12"]
    );
    assert.deepEqual(
      products.map((product) => product.category.slug),
      ["electronics", "electronics"]
    );
  });

  it("answers a quantity above the stock as data the client renders", async () => {
    const answer = await ask(
      'mutation { addToCart(productId: "product-12", quantity: 2) { availableStock errors { code field } } }'
    );
    const payload = answer.data?.addToCart as {
      availableStock: number;
      errors: ReadonlyArray<{ code: string; field: string }>;
    };

    assert.equal(answer.errors, undefined);
    assert.equal(payload.availableStock, 1);
    assert.deepEqual(
      payload.errors.map((failure) => failure.code),
      ["OUT_OF_STOCK"]
    );
    assert.equal(payload.errors[0]?.field, "quantity");
  });

  it("refuses a field the schema does not have", async () => {
    const answer = await ask("{ products { weight } }");

    assert.equal(answer.data, undefined);
    assert.equal(answer.errors?.length, 1);
    assert.equal(answer.errors?.[0]?.extensions?.["code"], "GRAPHQL_VALIDATION_FAILED");
  });
});`;

const SERVER_TEST_RUN_CODE = `$ npm run build
$ npm test

the store reads these categories in one call: electronics
▶ the catalogue
  ✔ answers the products of one category with the category behind each of them
  ✔ answers a quantity above the stock as data the client renders
  ✔ refuses a field the schema does not have
✔ the catalogue
ℹ tests 3
ℹ suites 1
ℹ pass 3
ℹ fail 0`;

const KOTLIN_TEST_CODE = `package nl.example.store

import org.junit.jupiter.api.Test
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.graphql.test.autoconfigure.GraphQlTest
import org.springframework.graphql.test.tester.GraphQlTester
import org.springframework.test.context.bean.override.mockito.MockitoBean

@GraphQlTest(CatalogueController::class)
class CatalogueControllerTest {

    @Autowired
    private lateinit var graphQlTester: GraphQlTester

    @MockitoBean
    private lateinit var catalogue: Catalogue

    @Test
    fun \`the catalogue answers a product with the category behind it\`() {
        val drive = Product(
            "product-09",
            "WD 2TB Elements Portable External Hard Drive",
            "wd-2tb-elements-portable-external-hard-drive",
            Money(6400),
            15,
            "electronics",
        )
        val electronics = Category("category-electronics", "Electronics", "electronics")
        whenever(catalogue.list(null)).thenReturn(listOf(drive))
        whenever(catalogue.categoriesBySlugs(listOf("electronics"))).thenReturn(mapOf("electronics" to electronics))

        graphQlTester.document("{ products { id price { amount } category { slug } } }")
            .execute()
            .path("products[0].id").entity(String::class.java).isEqualTo("product-09")
            .path("products[0].price.amount").entity(Int::class.java).isEqualTo(6400)
            .path("products[0].category.slug").entity(String::class.java).isEqualTo("electronics")
    }
}`;

const KOTLIN_TEST_RUN_CODE = `$ ./gradlew test

CatalogueControllerTest > the catalogue answers a product with the category behind it PASSED

BUILD SUCCESSFUL`;

const CLIENT_TEST_CODE = `import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MockLink } from "@apollo/client/testing";
import { MockedProvider } from "@apollo/client/testing/react";
import { catalogueQuery } from "@/graphql/operations";
import { CatalogueList } from "@/app/CatalogueList";

const oneDrive: MockLink.MockedResponse = {
  request: { query: catalogueQuery, variables: { filter: { inStockOnly: true } } },
  result: {
    data: {
      products: [
        {
          __typename: "Product",
          id: "product-09",
          name: "WD 2TB Elements Portable External Hard Drive",
          slug: "wd-2tb-elements-portable-external-hard-drive",
          stock: 15,
          price: { __typename: "Money", amount: 6400, currency: "EUR" },
          category: {
            __typename: "Category",
            id: "category-electronics",
            name: "Electronics",
            slug: "electronics"
          }
        }
      ]
    }
  }
};

describe("the catalogue list", () => {
  it("renders the products the store answered with", async () => {
    render(
      <MockedProvider mocks={[oneDrive]}>
        <CatalogueList />
      </MockedProvider>
    );

    expect(
      await screen.findByText(/WD 2TB Elements Portable External Hard Drive, 64.00 EUR/)
    ).toBeInTheDocument();
  });

  it("says so when the store refuses the query", async () => {
    const refusal: MockLink.MockedResponse = {
      request: { query: catalogueQuery, variables: { filter: { inStockOnly: true } } },
      error: new Error("the store is down")
    };

    render(
      <MockedProvider mocks={[refusal]}>
        <CatalogueList />
      </MockedProvider>
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The store is not answering right now."
    );
  });
});`;

const CLIENT_TEST_RUN_CODE = `$ npm test

 ✓ tests/catalogueList.test.tsx (2 tests)

 Test Files  1 passed (1)
      Tests  2 passed (2)`;

const REPOSITORY_URQL_CODE = `export async function callStore<Data, Variables extends AnyVariables>(
  document: TypedDocumentNode<Data, Variables>,
  variables: Variables,
  credentials: StoreCredentials,
): Promise<StoreAnswer<Data>> {
  const setCookieHeaders: string[] = [];
  const client = new Client({
    url: graphqlUrl(),
    exchanges: [fetchExchange],
    requestPolicy: "network-only",
    fetchOptions: () => ({ headers: buildHeaders(credentials) }),
    fetch: async (input, options) => {
      const response = await fetch(input, options);
      setCookieHeaders.push(...response.headers.getSetCookie());
      return response;`;

const COPY = {
  contentsLabel: { en: "In this article", nl: "In dit artikel" },

  lead: {
    en: "One GraphQL schema, three runtimes that have to agree about it. This builds all three from an empty folder: an Apollo Server on Node.js, the same schema served from Kotlin with Spring for GraphQL, and a React client on Apollo Client whose types come out of the schema file.",
    nl: "Eén GraphQL-schema, drie runtimes die het erover eens moeten zijn. Dit bouwt ze alle drie vanuit een lege map: een Apollo Server op Node.js, hetzelfde schema geserveerd vanuit Kotlin met Spring for GraphQL, en een React-client op Apollo Client waarvan de typen uit het schemabestand komen.",
  },
  intro1: {
    en: "Every request in this article was sent to a running server and every answer was copied out of the response. The example is a small shop: three products, two categories and a cart. It is small enough to type in an afternoon and large enough to meet the four things that actually go wrong between a client and a graph, which are batching, nullability, partial answers and the moment two sides stop agreeing about a field.",
    nl: "Elk verzoek in dit artikel is naar een draaiende server gestuurd en elk antwoord komt uit het antwoord van die server. Het voorbeeld is een kleine winkel: drie producten, twee categorieën en een winkelmandje. Klein genoeg om in een middag over te typen en groot genoeg om de vier dingen tegen te komen die tussen een client en een graph echt misgaan: batching, nullability, gedeeltelijke antwoorden en het moment waarop twee kanten het niet meer eens zijn over een veld.",
  },
  intro2: {
    en: "The article covers the plumbing. Why a schema is worth treating as a contract and how to negotiate a change in it is a separate subject, and so is what happens once several teams each own a piece of one graph. Both have their own article, linked where they belong.",
    nl: "Dit artikel gaat over het leidingwerk. Waarom een schema een contract verdient te zijn en hoe je een wijziging erin bespreekt, is een apart onderwerp, en dat geldt ook voor wat er gebeurt als meerdere teams elk een stuk van één graph bezitten. Voor allebei is er een eigen artikel, gelinkt waar het hoort.",
  },
  versionNote: {
    en: "Every version below was read from its registry on 9 September 2026. Apollo Client 4.2.12, Apollo Server 5.5.1, DataLoader 2.2.3, GraphQL Code Generator 7.4.0 with the client preset 6.1.3 and the resolver types plugin 6.1.0, Node.js 24, TypeScript 6.0.3, Next.js 16.3.4 with React 19.2.8, and on the JVM side JDK 25 with Kotlin 2.4.10, Spring Boot 4.1.1, Spring for GraphQL 2.0.5 and Gradle 9.5.",
    nl: "Elke versie hieronder is op 9 september 2026 uit het register gelezen. Apollo Client 4.2.12, Apollo Server 5.5.1, DataLoader 2.2.3, GraphQL Code Generator 7.4.0 met de client preset 6.1.3 en de resolver types plugin 6.1.0, Node.js 24, TypeScript 6.0.3, Next.js 16.3.4 met React 19.2.8, en aan de JVM-kant JDK 25 met Kotlin 2.4.10, Spring Boot 4.1.1, Spring for GraphQL 2.0.5 en Gradle 9.5.",
  },
  versionSplit: {
    en: "One version detail decides the whole install and surprises most people once. Apollo Server 5.5.1 declares the peer range graphql ^16.11.0, so the Node side runs the 16 line at 16.14.2. Apollo Client 4.2.12 declares graphql ^16.0.0 || ^17.0.0, so the React side is free to run 17.0.2. Two major versions of the same library in one repository is fine here, because the server folder and the client folder never share a module.",
    nl: "Eén versiedetail bepaalt de hele installatie en verrast bijna iedereen één keer. Apollo Server 5.5.1 vraagt als peer om graphql ^16.11.0, dus de Node-kant draait de 16-lijn op 16.14.2. Apollo Client 4.2.12 vraagt om graphql ^16.0.0 || ^17.0.0, dus de React-kant mag 17.0.2 draaien. Twee hoofdversies van dezelfde bibliotheek in één repository is hier prima, want de servermap en de clientmap delen nooit een module.",
  },
  quote: {
    en: "Client code stays with the client. The reasoning comes with me, and this article is that reasoning with its own running code underneath it.",
    nl: "Clientcode blijft bij de klant. De redenering gaat met mij mee, en dit artikel is die redenering met eigen draaiende code eronder.",
  },

  nodeSchemaSub: { en: "the one contract", nl: "het ene contract" },
  nodeClient: { en: "React client", nl: "React-client" },
  nodeServer: { en: "Node server", nl: "Node-server" },
  nodeService: { en: "Kotlin service", nl: "Kotlin-service" },
  nodeClientTypesSub: { en: "generated documents", nl: "gegenereerde documenten" },
  nodeServerTypesSub: { en: "generated resolvers", nl: "gegenereerde resolvers" },
  nodeServiceTypesSub: { en: "the schema on the classpath", nl: "het schema op het classpath" },
  edgeGenerate: { en: "generate", nl: "genereren" },
  edgeCopy: { en: "copy", nl: "kopiëren" },

  pathComponent: { en: "React component", nl: "React-component" },
  pathComponentSub: { en: "asks for the fields it renders", nl: "vraagt de velden die het toont" },
  pathCache: { en: "Apollo Client cache", nl: "Apollo Client-cache" },
  pathLinkSub: { en: "one POST to the graph", nl: "één POST naar de graph" },
  pathResolvers: { en: "Apollo Server resolvers", nl: "Apollo Server-resolvers" },
  pathResolversSub: { en: "one function per field", nl: "één functie per veld" },
  pathLoaderSub: { en: "collects the repeated keys", nl: "verzamelt de herhaalde sleutels" },
  pathService: { en: "Kotlin service", nl: "Kotlin-service" },
  pathServiceSub: { en: "owns the data", nl: "bezit de data" },
  edgeAsks: { en: "one document", nl: "één document" },
  edgeMissing: { en: "what it does not hold", nl: "wat er niet in zit" },
  edgeOnePost: { en: "one request", nl: "één verzoek" },
  edgeRepeated: { en: "the same key twice", nl: "dezelfde sleutel twee keer" },
  edgeOneCall: { en: "one call", nl: "één aanroep" },

  treeSchema: { en: "the one contract", nl: "het ene contract" },
  treeServerNode: { en: "Apollo Server on Node.js", nl: "Apollo Server op Node.js" },
  treeServiceKotlin: { en: "Spring for GraphQL on the JVM", nl: "Spring for GraphQL op de JVM" },
  treeClientReact: { en: "Apollo Client in React", nl: "Apollo Client in React" },
  treeGenerated: { en: "written by the generator, committed, never edited", nl: "door de generator geschreven, ingecheckt, nooit met de hand aangepast" },

  shapeTitle: { en: "One schema, three runtimes", nl: "Eén schema, drie runtimes" },
  shape1: {
    en: "A GraphQL schema is a file. Three programs read that file for three different reasons, and each of them turns it into something its own language understands. That is the whole idea, and every other decision in this article follows from it.",
    nl: "Een GraphQL-schema is een bestand. Drie programma's lezen dat bestand om drie verschillende redenen, en elk ervan vertaalt het naar iets wat zijn eigen taal begrijpt. Dat is het hele idee, en elke andere beslissing in dit artikel volgt daaruit.",
  },
  shapeAria: {
    en: "One schema file above a React client, a Node server and a Kotlin service, each with the types it derives from that file",
    nl: "Eén schemabestand boven een React-client, een Node-server en een Kotlin-service, elk met de typen die het uit dat bestand afleidt",
  },
  shapeCaption: {
    en: "One schema is the contract. The client, the Node server and the Kotlin service each derive their types from it.",
    nl: "Eén schema is het contract. De client, de Node-server en de Kotlin-service leiden hun typen er allemaal uit af.",
  },
  ownerSchema: { en: "The schema owns the shape.", nl: "Het schema bezit de vorm." },
  ownerSchemaBody: {
    en: "Which types exist, which fields they have, which of those may be null and what every argument is called. It is the only file all three sides read.",
    nl: "Welke typen er zijn, welke velden ze hebben, welke daarvan null mogen zijn en hoe elk argument heet. Het is het enige bestand dat alle drie de kanten lezen.",
  },
  ownerServer: { en: "The Node server owns resolution.", nl: "De Node-server bezit het oplossen." },
  ownerServerBody: {
    en: "One function per field, a context that lives exactly one request long, and the batching that keeps a nested field from asking the same question twenty times.",
    nl: "Eén functie per veld, een context die precies één verzoek lang leeft, en de batching die voorkomt dat een genest veld twintig keer dezelfde vraag stelt.",
  },
  ownerService: { en: "The Kotlin service owns the data.", nl: "De Kotlin-service bezit de data." },
  ownerServiceBody: {
    en: "The rules, the database and the decision about what a valid answer is. It serves the same schema, so a client cannot tell from the answer which of the two servers produced it.",
    nl: "De regels, de database en de beslissing over wat een geldig antwoord is. Hij serveert hetzelfde schema, dus een client kan aan het antwoord niet zien welke van de twee servers het maakte.",
  },
  ownerClient: { en: "The React client owns the ask.", nl: "De React-client bezit de vraag." },
  ownerClientBody: {
    en: "A screen names the fields it renders and gets exactly those. A field nobody asks for costs nothing, and a field the screen forgot to ask for is missing at compile time.",
    nl: "Een scherm noemt de velden die het toont en krijgt precies die. Een veld dat niemand vraagt kost niets, en een veld dat het scherm vergeet te vragen ontbreekt al bij het compileren.",
  },
  shape2: {
    en: "The folders below are the whole project. Three programs sit beside one contract folder, and none of them imports anything from the other two.",
    nl: "De mappen hieronder zijn het hele project. Drie programma's staan naast één contractmap, en geen van drieën importeert iets uit de andere twee.",
  },
  treeCaption: {
    en: "One contract folder and three programs beside it. Nothing crosses between the three except the schema file.",
    nl: "Eén contractmap met drie programma's ernaast. Er gaat niets tussen de drie heen en weer behalve het schemabestand.",
  },
  shape3: {
    en: "The Node server listens on port 4000, the Kotlin service on port 8080, and the React client on port 3000. Two servers on two ports serving one schema is not a mistake to fix. It is the point of the exercise, because it is what a migration looks like while it is happening.",
    nl: "De Node-server luistert op poort 4000, de Kotlin-service op poort 8080 en de React-client op poort 3000. Twee servers op twee poorten die één schema serveren is geen fout die je moet oplossen. Dat is juist de bedoeling, want zo ziet een migratie eruit terwijl hij loopt.",
  },

  schemaTitle: { en: "The schema, written once", nl: "Het schema, één keer geschreven" },
  schema1: {
    en: "Start with the contract, because everything else is derived from it. Save this as contract/schema.graphql.",
    nl: "Begin met het contract, want al het andere wordt eruit afgeleid. Bewaar dit als contract/schema.graphql.",
  },
  schema2: {
    en: "Four conventions in that file do more work than they look like they do.",
    nl: "Vier afspraken in dat bestand doen meer werk dan je zou denken.",
  },
  ruleWords: { en: "Full words.", nl: "Hele woorden." },
  ruleWordsBody: {
    en: "quantity, never qty. A schema is read far more often than it is written, and a shortened field name costs every reader a moment of doubt.",
    nl: "quantity, nooit qty. Een schema wordt veel vaker gelezen dan geschreven, en een afgekorte veldnaam kost elke lezer een moment twijfel.",
  },
  ruleMoney: { en: "Money is an integer.", nl: "Geld is een geheel getal." },
  ruleMoneyBody: {
    en: "An amount in the smallest unit of one currency, so 10995 with EUR beside it. No floating point comes near a price, in any of the three runtimes.",
    nl: "Een bedrag in de kleinste eenheid van één valuta, dus 10995 met EUR ernaast. Geen enkel drijvendekommagetal komt in de buurt van een prijs, in geen van de drie runtimes.",
  },
  ruleIdentifiers: { en: "Every id is opaque.", nl: "Elke id is ondoorzichtig." },
  ruleIdentifiersBody: {
    en: "A client stores it and sends it back. It never takes it apart. The day the server changes how an id is built, no client breaks.",
    nl: "Een client bewaart hem en stuurt hem terug. Hij pluist hem nooit uit. Op de dag dat de server de opbouw van een id verandert, gaat er geen client stuk.",
  },
  rulePayload: { en: "A mutation answers with a payload.", nl: "Een mutation antwoordt met een payload." },
  rulePayloadBody: {
    en: "Out of stock is not a crash. It is a UserError inside the answer, with a code the client switches on and a message a developer reads in a log. Only an unexpected failure becomes a GraphQL error.",
    nl: "Niet op voorraad is geen crash. Het is een UserError in het antwoord, met een code waar de client op schakelt en een bericht dat een ontwikkelaar in een log leest. Alleen een onverwachte fout wordt een GraphQL-error.",
  },
  schema3Before: { en: "Why those conventions are worth defending, and how to ask a backend team for a change to a field, is the subject of ", nl: "Waarom die afspraken het verdedigen waard zijn, en hoe je een backendteam om een wijziging van een veld vraagt, is het onderwerp van " },
  contractArticleLink: { en: "the article on GraphQL as a contract", nl: "het artikel over GraphQL als contract" },
  schema3After: { en: ". From here on the schema is a given, and the question is what each runtime does with it.", nl: ". Vanaf hier is het schema een gegeven, en gaat het over wat elke runtime ermee doet." },

  serverTitle: { en: "Apollo Server on Node.js", nl: "Apollo Server op Node.js" },
  server1: {
    en: "Five commands make the server project. The copy of the schema at the end is deliberate, because the server reads the file at start and a symbolic link across three programs is one more thing that can be missing on a colleague's machine.",
    nl: "Vijf commando's maken het serverproject. De kopie van het schema aan het eind is bewust, want de server leest het bestand bij het starten en een symbolische link tussen drie programma's is nog iets wat op de machine van een collega kan ontbreken.",
  },
  server2: {
    en: "The package file pins every version. No caret, because a version is decided in one place and a build that resolves a different tree next month is a debugging session nobody planned.",
    nl: "Het package-bestand zet elke versie vast. Geen caret, want een versie wordt op één plek besloten en een build die volgende maand een andere boom oplevert is een debugsessie die niemand had ingepland.",
  },
  server3: {
    en: "The TypeScript configuration puts the sources in src and the tests in tests, and compiles both into distribution. Node runs the compiled output, so the paths in the article all point at distribution.",
    nl: "De TypeScript-configuratie zet de bronnen in src en de tests in tests, en compileert allebei naar distribution. Node draait de gecompileerde uitvoer, dus de paden in dit artikel wijzen allemaal naar distribution.",
  },
  server4: {
    en: "The data is three products in a list. In a real server this is a database, and the shape of the resolvers does not change when it becomes one, because a resolver never knows where its data came from.",
    nl: "De data is een lijst van drie producten. In een echte server is dit een database, en de vorm van de resolvers verandert niet als dat gebeurt, want een resolver weet nooit waar zijn data vandaan komt.",
  },
  server5: {
    en: "The context is built once per request and thrown away with the response. That is the rule that makes a data loader safe: it collects the keys asked for during one request and answers them in one call, and it must never live longer than that request, because a loader is a cache and a cache that outlives a request starts answering one visitor with another visitor's data.",
    nl: "De context wordt per verzoek één keer gebouwd en met het antwoord weggegooid. Dat is de regel die een data loader veilig maakt: hij verzamelt de sleutels die binnen één verzoek worden gevraagd en beantwoordt ze in één aanroep, en hij mag nooit langer leven dan dat verzoek, want een loader is een cache en een cache die een verzoek overleeft gaat de ene bezoeker met de data van de andere bezoeker antwoorden.",
  },
  server6: {
    en: "The resolvers are one function per field that needs one. Product.category is the interesting one: it runs once for every product in the answer, and every one of those calls goes through the loader, so a page of twenty products in two categories reads two categories.",
    nl: "De resolvers zijn één functie per veld dat er een nodig heeft. Product.category is de interessante: hij draait voor elk product in het antwoord, en al die aanroepen gaan door de loader, dus een pagina met twintig producten in twee categorieën leest twee categorieën.",
  },
  server7: {
    en: "The entry point reads the schema file, hands it to Apollo Server with the resolvers, and starts listening. Note where the context function sits, because it runs per request and the loader is created inside it.",
    nl: "Het startpunt leest het schemabestand, geeft het met de resolvers aan Apollo Server en gaat luisteren. Let op waar de contextfunctie staat, want die draait per verzoek en de loader wordt daarbinnen gemaakt.",
  },
  standaloneTitle: { en: "What the standalone server gives up", nl: "Wat de standalone server opgeeft" },
  standaloneBody: {
    en: "startStandaloneServer is the shortest way to a running graph and it fixes its CORS policy to every origin without credentials. A browser that has to send a cookie to the graph cannot cross that. The moment cookies or an origin check enter the picture, the server moves to Express with the express integration package, which is what the repository behind this article does.",
    nl: "startStandaloneServer is de kortste weg naar een draaiende graph, en hij zet zijn CORS-beleid vast op elke origin zonder credentials. Een browser die een cookie naar de graph moet sturen komt daar niet doorheen. Zodra cookies of een origin-controle in beeld komen, verhuist de server naar Express met het express-integratiepakket, en dat is wat de repository achter dit artikel doet.",
  },
  server8: {
    en: "Build it and start it. The url that is printed is the graph endpoint, and the standalone server serves it at the root of the port.",
    nl: "Bouw en start hem. De url die wordt afgedrukt is het graph-endpoint, en de standalone server serveert dat op de wortel van de poort.",
  },
  server9: {
    en: "The first request asks for the electronics products with their category. The content-type header is not optional: Apollo Server refuses a request without one, because a request a browser form could have sent is treated as a possible cross-site forgery.",
    nl: "Het eerste verzoek vraagt de elektronicaproducten met hun categorie. De content-type-header is niet optioneel: Apollo Server weigert een verzoek zonder die header, want een verzoek dat een browserformulier had kunnen sturen wordt behandeld als mogelijke cross-site forgery.",
  },
  server10: {
    en: "One product by its slug, which is the product page query. The client asks only for the fields it shows, and the server never sends more.",
    nl: "Eén product op zijn slug, de query van de productpagina. De client vraagt alleen de velden die hij toont, en de server stuurt nooit meer.",
  },
  server11: {
    en: "The mutation takes variables. The answer carries the whole cart back, so the screen that submitted the form has everything it needs to render the new state without a second query.",
    nl: "De mutation neemt variabelen. Het antwoord geeft het hele winkelmandje terug, dus het scherm dat het formulier verstuurde heeft alles om de nieuwe stand te tonen zonder tweede query.",
  },
  server12: {
    en: "That server is about eighty lines. A server that carries cookies, an origin check, a health endpoint and a clean shutdown is about a hundred and twenty. This is the one in the repository, and the shape is the same.",
    nl: "Die server is ongeveer tachtig regels. Een server met cookies, een origin-controle, een health-endpoint en een net afsluiten is ongeveer honderdtwintig. Dit is die uit de repository, en de vorm is dezelfde.",
  },
  server13: {
    en: "Two things in it are worth copying whatever you build. The context function reads the incoming headers and hands the resolvers a visitor, so no resolver ever touches a raw header. And the drain plugin waits for open requests before the process exits, which is what turns a deploy into something a visitor does not notice.",
    nl: "Twee dingen daaruit zijn het kopiëren waard, wat je ook bouwt. De contextfunctie leest de binnenkomende headers en geeft de resolvers een bezoeker, dus geen enkele resolver raakt ooit een ruwe header aan. En de drain-plugin wacht op openstaande verzoeken voordat het proces stopt, en dat maakt van een deploy iets wat een bezoeker niet merkt.",
  },

  kotlinTitle: { en: "The same schema from Kotlin", nl: "Hetzelfde schema vanuit Kotlin" },
  kotlin1: {
    en: "The JVM side is schema first as well, and Spring for GraphQL asks for nothing more than the schema on the classpath and a controller with the right annotations. Two Gradle files start it.",
    nl: "De JVM-kant is ook schema first, en Spring for GraphQL vraagt niets meer dan het schema op het classpath en een controller met de juiste annotaties. Twee Gradle-bestanden starten het geheel.",
  },
  kotlin2: {
    en: "The configuration file names the path, turns on the browser interface for development, and turns on schema inspection, which is the setting that pays for itself on the first day.",
    nl: "Het configuratiebestand noemt het pad, zet de browserinterface aan voor ontwikkeling en zet schema-inspectie aan, de instelling die zich op de eerste dag terugbetaalt.",
  },
  kotlin3: {
    en: "Copy the contract to src/main/resources/graphql/schema.graphqls, because that is where Spring for GraphQL looks by default. Then the application class and the data.",
    nl: "Kopieer het contract naar src/main/resources/graphql/schema.graphqls, want daar kijkt Spring for GraphQL standaard. Daarna de applicatieklasse en de data.",
  },
  kotlin4: {
    en: "The catalogue controller is the counterpart of the Node resolvers. QueryMapping binds a method to a field of Query by its name. BatchMapping is the JVM answer to a data loader: Spring hands the method every product in the answer at once and expects a map back, so the category of twenty products is read in one call and not twenty.",
    nl: "De cataloguscontroller is de tegenhanger van de Node-resolvers. QueryMapping bindt een methode op naam aan een veld van Query. BatchMapping is het JVM-antwoord op een data loader: Spring geeft de methode alle producten in het antwoord tegelijk en verwacht een map terug, dus de categorie van twintig producten wordt in één aanroep gelezen en niet in twintig.",
  },
  kotlin5: {
    en: "The cart controller carries the mutation. The three refusals are data, exactly as they were on the Node side, because both servers answer the same schema and the schema says a mutation answers with a payload.",
    nl: "De winkelmandjescontroller draagt de mutation. De drie weigeringen zijn data, precies zoals aan de Node-kant, want beide servers beantwoorden hetzelfde schema en het schema zegt dat een mutation met een payload antwoordt.",
  },
  kotlin6: {
    en: "Start it with the Gradle wrapper. The first run downloads Gradle and the dependencies, and after that it starts in seconds.",
    nl: "Start hem met de Gradle-wrapper. De eerste keer worden Gradle en de afhankelijkheden gedownload, daarna start hij binnen enkele seconden.",
  },
  kotlin7: {
    en: "The same question, sent to the other port. The path is /graphql here, because Spring for GraphQL mounts on a path and the standalone Apollo server mounts on the root. That difference is worth writing down somewhere a colleague will find it.",
    nl: "Dezelfde vraag, naar de andere poort gestuurd. Het pad is hier /graphql, want Spring for GraphQL hangt op een pad en de standalone Apollo-server hangt op de wortel. Dat verschil is het waard om ergens op te schrijven waar een collega het vindt.",
  },
  inspectionTitle: { en: "Schema inspection catches the gap", nl: "Schema-inspectie vindt het gat" },
  inspectionBody: {
    en: "With inspection on, Spring compares the schema with the controllers at start and reports every schema field that has no method behind it, and every controller mapping that points at a field the schema does not have. A field added to the contract and forgotten in the service shows up in the log the first time you start, and not in an answer a client could not explain.",
    nl: "Met inspectie aan vergelijkt Spring bij het starten het schema met de controllers, en meldt elk schemaveld zonder methode erachter en elke controllermapping die naar een veld wijst dat het schema niet heeft. Een veld dat aan het contract is toegevoegd en in de service is vergeten, staat de eerste keer dat je start in het log, en niet in een antwoord dat een client niet kan verklaren.",
  },
  kotlin8: {
    en: "The controller in the repository behind this article is the same idea at full size, with the use cases injected and the paging arguments the real schema carries.",
    nl: "De controller in de repository achter dit artikel is hetzelfde idee op ware grootte, met de use cases geïnjecteerd en de pagineringsargumenten die het echte schema draagt.",
  },
  kotlin9: {
    en: "The record behind this site names Kotlin on Spring Boot with Spring for GraphQL at bol.com. Where the backend team was short on capacity I wrote that Kotlin myself: new schema fields with their controller and their schema mapping, and where a schema serves both signed-in and anonymous customers, each of the two got its own controller and its own test. The services belong to the backend teams. The front end was my job, and this is the part of theirs I contributed to.",
    nl: "Het dossier achter deze site noemt Kotlin op Spring Boot met Spring for GraphQL bij bol.com. Waar het backendteam krap in de capaciteit zat, schreef ik die Kotlin zelf: nieuwe schemavelden met hun controller en hun schema mapping, en waar een schema zowel ingelogde als anonieme klanten bedient, kregen die twee elk hun eigen controller en hun eigen test. De services zijn van de backendteams. De frontend was mijn werk, en dit is het deel van dat van hen waaraan ik bijdroeg.",
  },
  kotlin10: {
    en: "A field that production already used never changed in place. We marked it deprecated, put a second field beside it with a V2 suffix, moved every consumer across, and then took the original name back in the front end and the backend at the same moment. Every controller carried its own tests with GraphQlTester, JUnit, mockito-kotlin and AssertJ, and the resolvers carried a timeout in the configuration, so a slow dependency fails one field and leaves the rest of the answer standing.",
    nl: "Een veld dat in productie al werd gebruikt, veranderde nooit ter plekke. We markeerden het als deprecated, zetten er een tweede veld met een V2-achtervoegsel naast, migreerden elke afnemer en namen daarna de oorspronkelijke naam terug, in frontend en backend op hetzelfde moment. Elke controller had zijn eigen tests met GraphQlTester, JUnit, mockito-kotlin en AssertJ, en de resolvers hadden een timeout in de configuratie, zodat een trage afhankelijkheid één veld laat falen en de rest van het antwoord laat staan.",
  },

  gatewayTitle: { en: "One graph in front of two servers", nl: "Eén graph voor twee servers" },
  gateway1: {
    en: "So far the two servers are alternatives. The interesting arrangement is the other one, where the Node graph answers the client and asks the Kotlin service for the part of the data the service owns. That is what a migration off a JVM estate looks like while it runs, and it is the shape the picture below describes.",
    nl: "Tot nu toe zijn de twee servers alternatieven. De interessante opstelling is de andere, waarbij de Node-graph de client antwoordt en de Kotlin-service vraagt om het deel van de data dat de service bezit. Zo ziet een migratie weg van een JVM-landschap eruit terwijl hij loopt, en dat is de vorm die de tekening hieronder beschrijft.",
  },
  gatewayAria: {
    en: "A request going down from a React component through the Apollo Client cache and the link to the server resolvers, the data loader and the Kotlin service",
    nl: "Een verzoek dat van een React-component omlaag gaat via de Apollo Client-cache en de link naar de serverresolvers, de data loader en de Kotlin-service",
  },
  gatewayCaption: {
    en: "The cache answers what it can, the server resolves the rest, and the Kotlin service owns the data.",
    nl: "De cache beantwoordt wat hij kan, de server lost de rest op, en de Kotlin-service bezit de data.",
  },
  gateway2: {
    en: "The Node server becomes a client of the Kotlin service for one field. It is a plain fetch with a document and variables, which is all a GraphQL request has ever been.",
    nl: "De Node-server wordt voor één veld een client van de Kotlin-service. Het is een gewone fetch met een document en variabelen, en meer is een GraphQL-verzoek nooit geweest.",
  },
  gateway3: {
    en: "The context swaps the local read for the remote one and nothing else changes. The loader still batches, the resolver still calls load, and the twenty products on a page still cost the service one call.",
    nl: "De context wisselt het lokale lezen om voor het lezen op afstand en verder verandert er niets. De loader batcht nog steeds, de resolver roept nog steeds load aan, en de twintig producten op een pagina kosten de service nog steeds één aanroep.",
  },
  gateway4: {
    en: "That hand-written arrangement stops scaling at about three services, because every server that wants a field of Product now has to know where Product lives. Federation is the answer to that, and it starts with one directive in a subgraph schema.",
    nl: "Die met de hand gebouwde opstelling houdt op te werken bij ongeveer drie services, want elke server die een veld van Product wil, moet dan weten waar Product woont. Federation is daar het antwoord op, en het begint met één directive in een subgraph-schema.",
  },
  gateway5: {
    en: "A subgraph that only refers to Product asks the owner for it through the _entities field, with a data loader in front so a cart of twenty lines costs the catalogue one call. This is the same batching idea as Product.category above, one process further out.",
    nl: "Een subgraph die alleen naar Product verwijst, vraagt de eigenaar erom via het _entities-veld, met een data loader ervoor zodat een winkelmandje met twintig regels de catalogus één aanroep kost. Dit is hetzelfde batchingidee als Product.category hierboven, één proces verder naar buiten.",
  },
  gateway6Before: { en: "The composition step, the entity keys, the query plan and what breaks when five teams each own a subgraph are a subject of their own, worked out in ", nl: "De compositiestap, de entity-keys, het queryplan en wat er misgaat als vijf teams elk een subgraph bezitten, zijn een onderwerp op zich, uitgewerkt in " },
  federationArticleLink: { en: "the article on building a federated graph", nl: "het artikel over het bouwen van een federated graph" },
  gateway6After: { en: ". For this article the point is smaller: a client that talks to one endpoint does not have to know how many servers are behind it, and that is exactly what makes moving one of them safe.", nl: ". Voor dit artikel is het punt kleiner: een client die met één endpoint praat, hoeft niet te weten hoeveel servers erachter staan, en juist dat maakt het veilig om er een te verplaatsen." },

  clientTitle: { en: "Apollo Client in React", nl: "Apollo Client in React" },
  client1: {
    en: "The client starts as a plain Next.js application. The flags matter less than the two that follow: no src directory, so the folders sit beside app, and an import alias so every import in the article reads the same.",
    nl: "De client begint als een gewone Next.js-applicatie. De vlaggen doen er minder toe dan deze twee: geen src-map, zodat de mappen naast app staan, en een importalias zodat elke import in dit artikel hetzelfde leest.",
  },
  client2: {
    en: "The package file pins the client side. One line in it surprises people: rxjs is a peer dependency of Apollo Client 4 and has to be installed, because the link chain in this major version is built on observables from that library.",
    nl: "Het package-bestand zet de clientkant vast. Eén regel verrast mensen: rxjs is een peer dependency van Apollo Client 4 en moet geïnstalleerd worden, want de linkketen in deze hoofdversie is gebouwd op observables uit die bibliotheek.",
  },
  client3: {
    en: "The generator configuration points at the contract and at the file that holds the documents. The client preset writes a graphql function that knows every operation in the schema, and turning fragment masking off means a component can read a fragment field straight off the parent object.",
    nl: "De generatorconfiguratie wijst naar het contract en naar het bestand met de documenten. De client preset schrijft een graphql-functie die elke operatie in het schema kent, en fragment masking uitzetten betekent dat een component een fragmentveld direct van het bovenliggende object kan lezen.",
  },
  client4: {
    en: "The documents live in one file. A fragment names the fields a card renders, a query composes the fragments it needs, and the generated types follow both without a single hand-written interface.",
    nl: "De documenten staan in één bestand. Een fragment noemt de velden die een kaart toont, een query stelt de fragmenten samen die hij nodig heeft, en de gegenereerde typen volgen allebei zonder ook maar één met de hand geschreven interface.",
  },
  client5: {
    en: "Generate them. The generated folder is committed, so a fresh checkout builds without running the generator first, and it is never edited by hand.",
    nl: "Genereer ze. De gegenereerde map wordt ingecheckt, zodat een verse checkout bouwt zonder eerst de generator te draaien, en er wordt nooit met de hand in gewerkt.",
  },
  client6: {
    en: "The browser client is where the cache earns its keep. InMemoryCache normalises: it splits every answer into objects keyed by type name and id, so the product on the catalogue page and the product in the cart are one entry, and a mutation that returns the new product updates both screens at once.",
    nl: "De browserclient is waar de cache zijn nut bewijst. InMemoryCache normaliseert: hij splitst elk antwoord op in objecten met typenaam en id als sleutel, dus het product op de cataloguspagina en het product in het winkelmandje zijn één vermelding, en een mutation die het nieuwe product teruggeeft werkt beide schermen tegelijk bij.",
  },
  client7: {
    en: "A component asks with useQuery and gets a typed answer. Note the import path: in Apollo Client 4 the React hooks live in @apollo/client/react, and the core lives in @apollo/client. Code written for the previous major imports both from the same place and does not compile here.",
    nl: "Een component vraagt met useQuery en krijgt een getypeerd antwoord. Let op het importpad: in Apollo Client 4 wonen de React-hooks in @apollo/client/react, en de kern in @apollo/client. Code die voor de vorige hoofdversie is geschreven importeert allebei van dezelfde plek en compileert hier niet.",
  },
  client8: {
    en: "Money keyFields false in the cache configuration says that a Money value has no identity of its own and belongs to whatever holds it. Without that line the cache would treat two prices of the same amount as one object, and a price change in one place would appear in another.",
    nl: "Money met keyFields false in de cacheconfiguratie zegt dat een Money-waarde geen eigen identiteit heeft en hoort bij wat hem bevat. Zonder die regel zou de cache twee prijzen met hetzelfde bedrag als één object zien, en zou een prijswijziging op de ene plek op de andere opduiken.",
  },

  renderingTitle: { en: "The query that runs before the page ships", nl: "De query die draait voordat de pagina vertrekt" },
  rendering1: {
    en: "On the server the cache is a liability. A client that lives at module scope is shared by every visitor of that process, so one visitor's cart can end up in another visitor's answer. The rule is one client per request, and no cache reuse across requests.",
    nl: "Op de server is de cache een risico. Een client op modulescope wordt gedeeld door elke bezoeker van dat proces, dus het winkelmandje van de ene bezoeker kan in het antwoord van de andere belanden. De regel is één client per verzoek, en geen hergebruik van de cache tussen verzoeken.",
  },
  rendering2: {
    en: "The page is a server component. It awaits the query, renders the products into HTML, and ships that HTML. The visitor sees the catalogue in the first response, and no request leaves the browser to fill it in.",
    nl: "De pagina is een servercomponent. Hij wacht de query af, rendert de producten naar HTML en verstuurt die HTML. De bezoeker ziet de catalogus in het eerste antwoord, en er vertrekt geen enkel verzoek uit de browser om hem te vullen.",
  },
  rendering3: {
    en: "The write path is a server action. The form posts to it, the action runs the mutation with the same typed document, and a refused mutation comes back as a message the form shows. Only when the mutation succeeds does the page revalidate, so a refusal does not throw away what the visitor was looking at.",
    nl: "Het schrijfpad is een server action. Het formulier post ernaartoe, de action draait de mutation met hetzelfde getypeerde document, en een geweigerde mutation komt terug als een bericht dat het formulier toont. Alleen als de mutation slaagt, wordt de pagina opnieuw opgehaald, zodat een weigering niet weggooit waar de bezoeker naar keek.",
  },
  rendering4: {
    en: "Start the client with the Node server running on port 4000, or with the Kotlin service on 8080 and the environment variable pointed at it. The page looks the same either way, which is the whole promise of one schema.",
    nl: "Start de client terwijl de Node-server op poort 4000 draait, of met de Kotlin-service op 8080 en de omgevingsvariabele daarnaartoe gericht. De pagina ziet er in beide gevallen hetzelfde uit, en dat is de hele belofte van één schema.",
  },
  rendering5: {
    en: "The store front in the repository does the same thing with the headers a real store needs, and it is worth reading for one detail: the fetch it hands the link is a function that reads the response headers on the way back, so a cookie the graph sets reaches the browser through the framework.",
    nl: "De winkelfront in de repository doet hetzelfde met de headers die een echte winkel nodig heeft, en is het lezen waard om één detail: de fetch die hij aan de link geeft is een functie die op de terugweg de antwoordheaders leest, zodat een cookie die de graph zet via het framework de browser bereikt.",
  },
  rendering6: {
    en: "Two fetch policies do the deciding here. On the server no-cache means every render asks the graph, because the framework already decides what is cached and a second cache underneath it makes a stale page nobody can explain. In the browser the default cache-first policy is what makes a second visit to the same screen instant.",
    nl: "Twee fetch policies bepalen dit. Op de server betekent no-cache dat elke render de graph vraagt, want het framework beslist al wat er gecached wordt en een tweede cache eronder maakt een verouderde pagina die niemand kan verklaren. In de browser is het standaardbeleid cache-first wat een tweede bezoek aan hetzelfde scherm direct maakt.",
  },

  errorsTitle: { en: "Errors and partial data", nl: "Fouten en gedeeltelijke data" },
  errors1: {
    en: "GraphQL has two ways to say no, and the difference is worth getting right once. A rule said no is data. Something broke is an error. A client renders the first and reports the second, and the two need different code.",
    nl: "GraphQL heeft twee manieren om nee te zeggen, en het verschil is het waard om één keer goed te zetten. Een regel zei nee is data. Er ging iets stuk is een fout. Een client toont het eerste en meldt het tweede, en die twee vragen om verschillende code.",
  },
  errors2: {
    en: "Asking for two of a product with one in stock is the first kind. The status is 200, the data is there, the cart comes back untouched, and the payload says what the client should tell the visitor.",
    nl: "Twee stuks vragen van een product waarvan er één op voorraad is, is het eerste soort. De status is 200, de data is er, het winkelmandje komt onaangeroerd terug, en de payload zegt wat de client de bezoeker moet vertellen.",
  },
  errors3: {
    en: "Asking for a field the schema does not have is the second kind, and it never reaches a resolver. Validation happens before execution, the status is 400, and there is no data key at all.",
    nl: "Een veld vragen dat het schema niet heeft is het tweede soort, en dat bereikt nooit een resolver. Validatie gebeurt voor de uitvoering, de status is 400, en er is helemaal geen data-sleutel.",
  },
  errors4: {
    en: "The third case is the one most clients get wrong. Add a product whose category slug is not in the list, ask for the whole catalogue, and one field fails while the rest of the answer is fine. What comes back depends entirely on the schema: with category Category the field is null, the error sits beside the data with the path that failed, and three products still render. Write it as category Category! and the failure has nowhere to stop, so it takes the product with it, then the list, then the whole data key.",
    nl: "Het derde geval is het geval dat de meeste clients verkeerd doen. Voeg een product toe waarvan de categorieslug niet in de lijst staat, vraag de hele catalogus op, en één veld faalt terwijl de rest van het antwoord in orde is. Wat er terugkomt hangt volledig van het schema af: met category Category is het veld null, staat de fout naast de data met het pad dat faalde, en tonen drie producten gewoon. Schrijf je category Category!, dan kan de fout nergens stoppen, dus neemt hij het product mee, daarna de lijst en daarna de hele data-sleutel.",
  },
  errors5: {
    en: "So nullability is an error-handling decision, made in the schema, months before the failure happens. A field that may reasonably be unavailable is nullable, and the screen is written to survive a null there.",
    nl: "Nullability is dus een beslissing over foutafhandeling, genomen in het schema, maanden voordat de fout optreedt. Een veld dat redelijkerwijs niet beschikbaar kan zijn is nullable, en het scherm wordt geschreven om een null daar te overleven.",
  },
  errors6: {
    en: "On the client the error policy decides whether partial data reaches the screen at all. With errorPolicy all the result carries both, and the types follow: the default policy types data as present, and all types it as possibly undefined with an error beside it. CombinedGraphQLErrors is the class that carries the list the server sent.",
    nl: "Aan de clientkant bepaalt het errorbeleid of gedeeltelijke data het scherm überhaupt bereikt. Met errorPolicy all draagt het resultaat allebei, en de typen volgen: het standaardbeleid typeert data als aanwezig, en all typeert het als mogelijk undefined met een error ernaast. CombinedGraphQLErrors is de klasse die de lijst draagt die de server stuurde.",
  },
  errors7: {
    en: "On the Node server formatError is the last place a message passes before it leaves the process. Log the original, answer with something a stranger may read, and keep the path, because the client needs to know which field went missing.",
    nl: "Op de Node-server is formatError de laatste plek waar een bericht langskomt voordat het het proces verlaat. Log het origineel, antwoord met iets wat een vreemde mag lezen, en houd het pad, want de client moet weten welk veld ontbrak.",
  },
  errors8: {
    en: "On the JVM the same job belongs to an exception handler on the controller, or to a resolver registered once for the whole application when the rule is the same everywhere.",
    nl: "Op de JVM hoort hetzelfde werk bij een exception handler op de controller, of bij een resolver die één keer voor de hele applicatie wordt geregistreerd als de regel overal gelijk is.",
  },

  codegenTitle: { en: "Types from the schema, on every side", nl: "Typen uit het schema, aan elke kant" },
  codegen1: {
    en: "The client generates a graphql function and the result types of every document. The configuration in the repository behind this article is four settings long, and each one is a decision.",
    nl: "De client genereert een graphql-functie en de resultaattypen van elk document. De configuratie in de repository achter dit artikel is vier instellingen lang, en elke instelling is een beslissing.",
  },
  codegen2: {
    en: "The server generates the other direction: a Resolvers type that a resolver map has to satisfy. Mappers say which internal type stands behind which schema type, and the context type is named once so every resolver signature knows it.",
    nl: "De server genereert de andere kant op: een Resolvers-type waaraan een resolvermap moet voldoen. Mappers zeggen welk intern type achter welk schematype staat, en het contexttype wordt één keer benoemd zodat elke resolversignatuur het kent.",
  },
  codegen3: {
    en: "With that type in place the resolver file loses every hand-written argument type, and a resolver that returns the wrong shape stops the build.",
    nl: "Met dat type op zijn plek verliest het resolverbestand elk met de hand geschreven argumenttype, en een resolver die de verkeerde vorm teruggeeft laat de build falen.",
  },
  codegen4: {
    en: "On the JVM there is nothing to generate, because the schema file is already the source and Spring binds to it by name. What the JVM needs is the check, and schema inspection is it. So a change to the contract is four steps, in this order.",
    nl: "Op de JVM valt er niets te genereren, want het schemabestand is al de bron en Spring bindt eraan op naam. Wat de JVM nodig heeft is de controle, en schema-inspectie is die controle. Een wijziging in het contract is dus vier stappen, in deze volgorde.",
  },
  codegenStep1: {
    en: "Change contract/schema.graphql, and copy it to the two places that keep their own copy.",
    nl: "Wijzig contract/schema.graphql en kopieer het naar de twee plekken die een eigen kopie houden.",
  },
  codegenStep2: {
    en: "Run the generator on the Node server. A resolver that no longer matches the schema fails to compile, and that is the list of work.",
    nl: "Draai de generator op de Node-server. Een resolver die niet meer bij het schema past compileert niet, en dat is meteen de lijst met werk.",
  },
  codegenStep3: {
    en: "Start the Kotlin service. Schema inspection names every field without a method and every method without a field.",
    nl: "Start de Kotlin-service. Schema-inspectie noemt elk veld zonder methode en elke methode zonder veld.",
  },
  codegenStep4: {
    en: "Run the generator on the client. A component that reads a field the schema dropped fails to compile, before anybody opens a browser.",
    nl: "Draai de generator op de client. Een component dat een veld leest dat uit het schema is gehaald compileert niet, voordat iemand een browser opent.",
  },
  codegen5: {
    en: "Four commands, three of which fail loudly when the change was not thought through. That is the whole reason for generating anything: the schema stops being a document people remember to read.",
    nl: "Vier commando's, waarvan er drie luid falen als de wijziging niet is doordacht. Dat is de hele reden om iets te genereren: het schema is niet langer een document waaraan mensen moeten denken om het te lezen.",
  },

  testingTitle: { en: "Testing each side against the schema", nl: "Elke kant tegen het schema testen" },
  testing1: {
    en: "The Node server is tested through the schema, not around it. executeOperation runs a document against the real executable schema with a real context, so validation, coercion and the loader are all in the test. The first test also proves the batching, because the loader logs one line and the answer holds two products.",
    nl: "De Node-server wordt via het schema getest, niet eromheen. executeOperation draait een document tegen het echte uitvoerbare schema met een echte context, dus validatie, coercion en de loader zitten allemaal in de test. De eerste test bewijst ook de batching, want de loader logt één regel en het antwoord bevat twee producten.",
  },
  testing2: {
    en: "The JVM side has a test slice for exactly this. GraphQlTest starts the web layer and the named controllers and nothing else, MockitoBean replaces the collaborators, and GraphQlTester walks the answer by path. Two details are new in Spring Boot 4: the annotation moved to its own package and its own artifact, and MockitoBean is the replacement for the old mock bean annotation.",
    nl: "De JVM-kant heeft hier precies een testschijf voor. GraphQlTest start de weblaag en de genoemde controllers en verder niets, MockitoBean vervangt de samenwerkende objecten, en GraphQlTester loopt het antwoord langs op pad. Twee dingen zijn nieuw in Spring Boot 4: de annotatie verhuisde naar een eigen package en een eigen artefact, en MockitoBean is de vervanger van de oude mock bean-annotatie.",
  },
  testing3: {
    en: "The React side tests the component against a mocked link. MockedProvider takes a list of documents with the answers they should get, and the component runs the same code it runs in a browser.",
    nl: "De React-kant test het component tegen een gemockte link. MockedProvider krijgt een lijst documenten met de antwoorden die ze moeten opleveren, en het component draait dezelfde code als in een browser.",
  },
  mockTrapTitle: { en: "What a mocked link does not prove", nl: "Wat een gemockte link niet bewijst" },
  mockTrapBody: {
    en: "A mocked answer is written by the person writing the test, so it proves the component and says nothing about whether the server would answer that way. The check that closes the gap is a suite of documents run against every server and compared with one set of expected answers. The repository behind this article has one, and it is what lets four backends claim to serve the same contract.",
    nl: "Een gemockt antwoord wordt geschreven door degene die de test schrijft, dus het bewijst het component en zegt niets over of de server zo zou antwoorden. De controle die dat gat dicht is een reeks documenten die tegen elke server draait en met één set verwachte antwoorden wordt vergeleken. De repository achter dit artikel heeft die reeks, en die maakt dat vier backends kunnen claimen hetzelfde contract te serveren.",
  },
  testing4: {
    en: "Three test suites, three runtimes, one schema behind all of them. None of the three knows the other two exist, and that is what makes it possible to replace any one of them on a Tuesday.",
    nl: "Drie testsuites, drie runtimes, één schema erachter. Geen van de drie weet dat de andere twee bestaan, en juist daardoor kun je er op een dinsdag een vervangen.",
  },

  urqlTitle: { en: "What urql and gql.tada do differently", nl: "Wat urql en gql.tada anders doen" },
  urql1: {
    en: "Apollo is one answer. The store front in the repository that runs on React Router uses another one, urql with gql.tada, and the shape of the call is close enough that the two are worth comparing directly.",
    nl: "Apollo is één antwoord. De winkelfront in de repository die op React Router draait gebruikt een ander, urql met gql.tada, en de vorm van de aanroep lijkt genoeg op elkaar om ze naast elkaar te leggen.",
  },
  urql2: {
    en: "Four differences matter in practice.",
    nl: "Vier verschillen doen er in de praktijk toe.",
  },
  diffTypes: { en: "Where the types come from.", nl: "Waar de typen vandaan komen." },
  diffTypesBody: {
    en: "The code generator writes a folder of TypeScript that you commit. gql.tada reads the schema at type-check time and infers the result of a document from the document itself, so there is no generated folder and no generate step in the build.",
    nl: "De codegenerator schrijft een map met TypeScript die je incheckt. gql.tada leest het schema tijdens het typecheckwerk en leidt het resultaat van een document uit het document zelf af, dus er is geen gegenereerde map en geen generatiestap in de build.",
  },
  diffCache: { en: "What the cache stores.", nl: "Wat de cache opslaat." },
  diffCacheBody: {
    en: "Apollo normalises by default, so objects are stored once and shared between screens. urql caches whole documents by default, and normalisation is a separate exchange you add when you want it. On a server-rendered front where every request builds a new client, the difference costs nothing.",
    nl: "Apollo normaliseert standaard, dus objecten worden één keer opgeslagen en tussen schermen gedeeld. urql cachet standaard hele documenten, en normalisatie is een aparte exchange die je toevoegt als je hem wilt. Op een servergerenderde front waar elk verzoek een nieuwe client bouwt, kost dat verschil niets.",
  },
  diffPipeline: { en: "What the pipeline is called.", nl: "Hoe de pijplijn heet." },
  diffPipelineBody: {
    en: "Apollo composes links, urql composes exchanges. Both are a chain of middleware around the request, and both are where an auth header, a retry and a logger belong.",
    nl: "Apollo stelt links samen, urql stelt exchanges samen. Allebei zijn het een keten van middleware rond het verzoek, en allebei zijn ze de plek voor een auth-header, een retry en een logger.",
  },
  diffMasking: { en: "What a component may see.", nl: "Wat een component mag zien." },
  diffMaskingBody: {
    en: "Both can mask a fragment, which means a component reads only the fields its own fragment declared. It is a strong discipline in a large front end and an obstacle in a small one, so both projects in the repository turn it off and say so in the configuration.",
    nl: "Allebei kunnen ze een fragment maskeren, wat betekent dat een component alleen de velden leest die zijn eigen fragment noemde. Dat is een sterke discipline in een grote frontend en een sta-in-de-weg in een kleine, dus beide projecten in de repository zetten het uit en zeggen dat in de configuratie.",
  },
  urql3: {
    en: "The record behind this site names urql and gql.tada at bol.com, and no Apollo anywhere. So every Apollo section above is teaching, written against the current release and checked on the date in the introduction.",
    nl: "Het dossier achter deze site noemt urql en gql.tada bij bol.com, en nergens Apollo. Elke Apollo-sectie hierboven is dus lesstof, geschreven tegen de huidige release en gecontroleerd op de datum in de inleiding.",
  },
  urql4: {
    en: "What did carry over is the part that has nothing to do with the library. Typed documents end to end, so a schema change surfaces in the editor. Two queries fired in parallel on the server for one page. A flat reference field reshaped into a structured object, which was a request to the backend team and a change they made. And an error path that renders the data that did arrive while the failures reach the error tracker. Every one of those decisions survives a change of client library, and that is a good test of whether a decision was about the library at all.",
    nl: "Wat wel meeging is het deel dat niets met de bibliotheek te maken heeft. Getypeerde documenten van begin tot eind, zodat een schemawijziging in de editor opduikt. Twee queries die op de server parallel voor één pagina lopen. Een plat verwijzingsveld dat een gestructureerd object werd, wat een verzoek aan het backendteam was en een wijziging die zij doorvoerden. En een foutpad dat de data toont die wel binnenkwam terwijl de fouten bij de foutmonitoring komen. Al die beslissingen overleven een wissel van clientbibliotheek, en dat is een goede test of een beslissing wel over de bibliotheek ging.",
  },

  closingTitle: { en: "What to take away", nl: "Wat je meeneemt" },
  closing1: {
    en: "If you are putting a graph in front of an estate that already exists, this is the order I would do it in.",
    nl: "Zet je een graph voor een landschap dat er al staat, dan is dit de volgorde waarin ik het zou doen.",
  },
  closingStep1: {
    en: "The schema file first, in its own folder, with the four conventions agreed before the first field is added. It is an hour of work and it settles a dozen arguments that would otherwise happen one at a time.",
    nl: "Eerst het schemabestand, in een eigen map, met de vier afspraken vastgelegd voordat het eerste veld erbij komt. Het is een uur werk en het beslecht een stuk of tien discussies die anders stuk voor stuk zouden komen.",
  },
  closingStep2: {
    en: "Nullability decided per field, with the question asked out loud: what should the screen show when this one is not available. That answer is your error handling, and it is far cheaper now than after a client depends on it.",
    nl: "Nullability per veld beslist, met de vraag hardop gesteld: wat moet het scherm tonen als dit veld er niet is. Dat antwoord is je foutafhandeling, en nu is het veel goedkoper dan wanneer een client er al van afhangt.",
  },
  closingStep3: {
    en: "A generation step on both typed sides, wired into the build. A schema change that does not compile is worth more than any review comment about the same change.",
    nl: "Een generatiestap aan beide getypeerde kanten, opgenomen in de build. Een schemawijziging die niet compileert is meer waard dan welke reviewopmerking over diezelfde wijziging ook.",
  },
  closingStep4: {
    en: "A loader in front of every nested field that reads by key, from the first day. Adding it later means finding every call site, and by then some of them are in code nobody wants to touch.",
    nl: "Een loader voor elk genest veld dat op sleutel leest, vanaf de eerste dag. Hem later toevoegen betekent elke aanroepplek zoeken, en dan zitten sommige daarvan in code waar niemand aan wil komen.",
  },
  closingStep5: {
    en: "One suite of documents with their expected answers, run against every server that claims to serve the schema. It is the only check that is not written from inside one of them.",
    nl: "Eén reeks documenten met hun verwachte antwoorden, gedraaid tegen elke server die claimt het schema te serveren. Het is de enige controle die niet vanuit een van die servers zelf is geschreven.",
  },
  closing2: {
    en: "The thing worth carrying out of it is smaller than the three projects. A schema is a promise about a shape, and each runtime is one way of keeping that promise. Once the promise is written down and checked by a build step, replacing the runtime behind it is a scheduling question and no longer an architectural one.",
    nl: "Wat je hieruit meeneemt is kleiner dan de drie projecten. Een schema is een belofte over een vorm, en elke runtime is één manier om die belofte na te komen. Zodra de belofte is opgeschreven en door een bouwstap wordt gecontroleerd, is de runtime erachter vervangen een planningsvraag en geen architectuurvraag meer.",
  },
  closing3: {
    en: "Everything above starts from an empty folder, and the running code behind it is in the repository named at the top of this article.",
    nl: "Alles hierboven begint vanuit een lege map, en de draaiende code erachter staat in de repository die bovenaan dit artikel wordt genoemd.",
  },
};
