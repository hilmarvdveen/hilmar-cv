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
  slug: "state-without-a-store-react-router-angular-graphql",
  category: "architecture",
  track: "frontend",
  publishedDate: "2026-09-09",
  readingTimeMin: 32,
  title: {
    en: "What is left for a store when GraphQL brings the data",
    nl: "Wat een store nog doet als GraphQL de data levert",
  },
  description: {
    en: "Server data lives in the loader and the GraphQL cache, filters live in the address bar. What is left is small, and this shows how small, in running code.",
    nl: "Serverdata zit in de loader en de GraphQL-cache, filters zitten in de adresbalk. Wat overblijft is klein, en dit laat zien hoe klein, in werkende code.",
  },
  excerpt: {
    en: "One word covers three different kinds of state, and only one of them needs a store. This walks through one web store built three times, on React Router framework mode, on Angular with signals and on the Next.js App Router, and shows where every value lives and what is left over at the end.",
    nl: "Eén woord dekt drie soorten state, en maar één ervan heeft een store nodig. Dit loopt door één webwinkel die drie keer is gebouwd, op React Router framework mode, op Angular met signals en op de Next.js App Router, en laat zien waar elke waarde woont en wat er aan het eind overblijft.",
  },
  keywords: [
    "react router loader action state",
    "graphql normalised cache client state",
    "angular signals resource httpresource",
    "url search params as state",
    "ngrx signalstore when to use",
    "zustand redux toolkit tanstack query",
    "next.js server actions revalidate",
  ],
};

function buildThreeKinds(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("screen", copy.nodeScreen[locale], { x: 295, y: 0 }, { tone: "slate", subtitle: copy.nodeScreenSub[locale], direction: "TB", width: 220 }),
    flowNode("serverData", copy.nodeServerData[locale], { x: 0, y: 150 }, { tone: "emerald", subtitle: copy.nodeServerDataSub[locale], direction: "TB", width: 240 }),
    flowNode("urlState", copy.nodeUrlState[locale], { x: 300, y: 150 }, { tone: "blue", subtitle: copy.nodeUrlStateSub[locale], direction: "TB", width: 210 }),
    flowNode("clientState", copy.nodeClientState[locale], { x: 600, y: 150 }, { tone: "violet", subtitle: copy.nodeClientStateSub[locale], direction: "TB", width: 220 }),
    flowNode("homeServer", copy.nodeHomeServer[locale], { x: 0, y: 310 }, { tone: "slate", subtitle: "httpResource · Apollo", direction: "TB", width: 240 }),
    flowNode("homeUrl", copy.nodeHomeUrl[locale], { x: 300, y: 310 }, { tone: "slate", subtitle: copy.nodeHomeUrlSub[locale], direction: "TB", width: 210 }),
    flowNode("homeClient", copy.nodeHomeClient[locale], { x: 600, y: 310 }, { tone: "slate", subtitle: copy.nodeHomeClientSub[locale], direction: "TB", width: 220 }),
  ];
  const edges = [
    flowEdge("screen", "serverData", { label: copy.edgeFromApi[locale] }),
    flowEdge("screen", "urlState", { label: copy.edgeVisitorChooses[locale] }),
    flowEdge("screen", "clientState", { label: copy.edgeThisBrowser[locale] }),
    flowEdge("serverData", "homeServer"),
    flowEdge("urlState", "homeUrl"),
    flowEdge("clientState", "homeClient"),
  ];
  return { nodes, edges };
}

function buildWriteLoop(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("submit", copy.nodeSubmit[locale], { x: 0, y: 0 }, { tone: "blue", subtitle: "Form of fetcher.Form", direction: "TB", width: 340 }),
    flowNode("action", "action", { x: 0, y: 130 }, { tone: "violet", subtitle: copy.nodeActionSub[locale], direction: "TB", width: 340 }),
    flowNode("api", copy.nodeApi[locale], { x: 0, y: 260 }, { tone: "slate", subtitle: copy.nodeApiSub[locale], direction: "TB", width: 340 }),
    flowNode("revalidate", copy.nodeRevalidate[locale], { x: 0, y: 390 }, { tone: "amber", subtitle: copy.nodeRevalidateSub[locale], direction: "TB", width: 340 }),
    flowNode("loader", "loader", { x: 0, y: 520 }, { tone: "violet", subtitle: copy.nodeLoaderSub[locale], direction: "TB", width: 340 }),
    flowNode("screenAgain", copy.nodeScreenAgain[locale], { x: 0, y: 650 }, { tone: "emerald", subtitle: copy.nodeScreenAgainSub[locale], direction: "TB", width: 340 }),
  ];
  const edges = [
    flowEdge("submit", "action", { label: copy.edgeTheWrite[locale] }),
    flowEdge("action", "api", { label: copy.edgeOneRequest[locale] }),
    flowEdge("api", "revalidate", { label: copy.edgeAnswered[locale] }),
    flowEdge("revalidate", "loader", { label: copy.edgeRunsAgain[locale] }),
    flowEdge("loader", "screenAgain", { label: copy.edgeTheData[locale] }),
  ];
  return { nodes, edges };
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  const threeKinds = buildThreeKinds(locale);
  const writeLoop = buildWriteLoop(locale);
  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <P>{copy.intro1[locale]}</P>
      <P>{copy.intro2[locale]}</P>
      <P>{copy.versionNote[locale]}</P>
      <Quote>{copy.quote[locale]}</Quote>
      <PostRepository locale={locale} folders={["frontends/react-router", "frontends/nextjs", "frontends/angular"]} />
      <Contents
        label={copy.contentsLabel[locale]}
        items={[
          copy.threeKindsTitle[locale],
          copy.cacheTitle[locale],
          copy.loaderTitle[locale],
          copy.fetcherTitle[locale],
          copy.urlTitle[locale],
          copy.leftTitle[locale],
          copy.angularTitle[locale],
          copy.hydrationTitle[locale],
          copy.nextTitle[locale],
          copy.earnsTitle[locale],
          copy.unwindTitle[locale],
          copy.testingTitle[locale],
          copy.bolTitle[locale],
          copy.closingTitle[locale],
        ]}
      />

      <H2>{copy.threeKindsTitle[locale]}</H2>
      <P>{copy.threeKinds1[locale]}</P>
      <FlowDiagram
        nodes={threeKinds.nodes}
        edges={threeKinds.edges}
        height={410}
        ariaLabel={copy.threeKindsAria[locale]}
        caption={copy.threeKindsCaption[locale]}
      />
      <UL>
        <LI><Strong>{copy.serverDataLabel[locale]}</Strong> {copy.serverDataBody[locale]}</LI>
        <LI><Strong>{copy.urlStateLabel[locale]}</Strong> {copy.urlStateBody[locale]}</LI>
        <LI><Strong>{copy.clientStateLabel[locale]}</Strong> {copy.clientStateBody[locale]}</LI>
      </UL>
      <P>{copy.threeKinds2[locale]}</P>

      <H2>{copy.cacheTitle[locale]}</H2>
      <P>{copy.cache1[locale]}</P>
      <P>{copy.cache2[locale]}</P>
      <CodeBlock lang="ts" filename="app/graphql/graphql.ts" code={TADA_SETUP_CODE} />
      <P>{copy.cache3[locale]}</P>
      <CodeBlock lang="ts" filename="app/graphql/documents.ts" code={TADA_DOCUMENTS_CODE} />
      <P>{copy.cache4[locale]}</P>
      <CodeBlock lang="ts" filename="app/graphql/client.server.ts" code={URQL_CLIENT_CODE} />
      <Callout variant="info" title={copy.cacheCalloutTitle[locale]}>
        {copy.cacheCalloutBody[locale]}
      </Callout>

      <H2>{copy.loaderTitle[locale]}</H2>
      <P>{copy.loader1[locale]}</P>
      <CodeBlock lang="tsx" filename="app/root.tsx" code={ROOT_MIDDLEWARE_CODE} />
      <P>{copy.loader2[locale]}</P>
      <CodeBlock lang="tsx" filename="app/routes/cart.tsx" code={CART_ROUTE_CODE} />
      <P>{copy.loader3[locale]}</P>
      <FlowDiagram
        nodes={writeLoop.nodes}
        edges={writeLoop.edges}
        height={740}
        ariaLabel={copy.writeLoopAria[locale]}
        caption={copy.writeLoopCaption[locale]}
      />
      <P>{copy.loader4[locale]}</P>

      <H2>{copy.fetcherTitle[locale]}</H2>
      <P>{copy.fetcher1[locale]}</P>
      <CodeBlock lang="tsx" filename="app/routes/cart.tsx" code={FETCHER_ROW_CODE} />
      <P>{copy.fetcher2[locale]}</P>
      <P>{copy.fetcher3[locale]}</P>

      <H2>{copy.urlTitle[locale]}</H2>
      <P>{copy.url1[locale]}</P>
      <CodeBlock lang="ts" filename="app/store/catalogueSearch.ts" code={CATALOGUE_SEARCH_CODE} />
      <P>{copy.url2[locale]}</P>
      <CodeBlock lang="tsx" filename="app/routes/catalogue.tsx" code={CATALOGUE_ROUTE_CODE} />
      <P>{copy.url3[locale]}</P>
      <P>{copy.url4[locale]}</P>

      <Divider />

      <H2>{copy.leftTitle[locale]}</H2>
      <P>{copy.left1[locale]}</P>
      <UL>
        <LI><Strong>{copy.leftDrawerLabel[locale]}</Strong> {copy.leftDrawerBody[locale]}</LI>
        <LI><Strong>{copy.leftPendingLabel[locale]}</Strong> {copy.leftPendingBody[locale]}</LI>
        <LI><Strong>{copy.leftKeyLabel[locale]}</Strong> {copy.leftKeyBody[locale]}</LI>
        <LI><Strong>{copy.leftTokenLabel[locale]}</Strong> {copy.leftTokenBody[locale]}</LI>
        <LI><Strong>{copy.leftCodeLabel[locale]}</Strong> {copy.leftCodeBody[locale]}</LI>
      </UL>
      <P>{copy.left2[locale]}</P>
      <CodeBlock lang="ts" filename="src/app/wishlist-drawer/wishlist-drawer.service.ts" code={DRAWER_SERVICE_CODE} />
      <P>{copy.left3[locale]}</P>
      <CodeBlock lang="ts" filename="src/app/checkout/idempotency-key.ts" code={IDEMPOTENCY_KEY_CODE} />
      <CodeBlock lang="ts" filename="src/app/checkout/checkout-attempt.service.ts" code={CHECKOUT_ATTEMPT_CODE} />
      <P>{copy.left4[locale]}</P>
      <CodeBlock lang="ts" filename="src/app/api/access-token-store.ts" code={ACCESS_TOKEN_STORE_CODE} />
      <P>{copy.left5[locale]}</P>

      <H2>{copy.angularTitle[locale]}</H2>
      <P>{copy.angular1[locale]}</P>
      <CodeBlock lang="ts" filename="src/app/api/graphql-resource.ts" code={GRAPHQL_RESOURCE_CODE} />
      <P>{copy.angular2[locale]}</P>
      <CodeBlock lang="ts" filename="src/app/cart/cart.service.ts" code={CART_SERVICE_CODE} />
      <P>{copy.angular3[locale]}</P>
      <P>{copy.angular4[locale]}</P>
      <CodeBlock lang="ts" filename="src/shared/services/wishlist.service.ts" code={WISHLIST_SERVICE_CODE} />
      <P>{copy.angular5[locale]}</P>
      <CodeBlock lang="ts" filename="src/app/catalogue/catalogue.component.ts" code={ANGULAR_CATALOGUE_CODE} />
      <P>{copy.angular6[locale]}</P>

      <H2>{copy.hydrationTitle[locale]}</H2>
      <P>{copy.hydration1[locale]}</P>
      <P>{copy.hydration2[locale]}</P>
      <CodeBlock lang="ts" filename="src/app/app.config.ts" code={HYDRATION_CONFIG_CODE} />
      <P>{copy.hydration3[locale]}</P>
      <Callout variant="warning" title={copy.hydrationCalloutTitle[locale]}>
        {copy.hydrationCalloutBody[locale]}
      </Callout>
      <P>{copy.hydration4[locale]}</P>

      <H2>{copy.nextTitle[locale]}</H2>
      <P>{copy.next1[locale]}</P>
      <CodeBlock lang="ts" filename="server/cart.ts" code={NEXT_READ_CODE} />
      <P>{copy.next2[locale]}</P>
      <CodeBlock lang="ts" filename="server/actions/cartActions.ts" code={NEXT_ACTION_CODE} />
      <P>{copy.next3[locale]}</P>

      <Divider />

      <H2>{copy.earnsTitle[locale]}</H2>
      <P>{copy.earns1[locale]}</P>
      <UL>
        <LI><Strong>{copy.earnsUndoLabel[locale]}</Strong> {copy.earnsUndoBody[locale]}</LI>
        <LI><Strong>{copy.earnsOfflineLabel[locale]}</Strong> {copy.earnsOfflineBody[locale]}</LI>
        <LI><Strong>{copy.earnsWizardLabel[locale]}</Strong> {copy.earnsWizardBody[locale]}</LI>
        <LI><Strong>{copy.earnsDerivedLabel[locale]}</Strong> {copy.earnsDerivedBody[locale]}</LI>
        <LI><Strong>{copy.earnsLiveLabel[locale]}</Strong> {copy.earnsLiveBody[locale]}</LI>
      </UL>
      <P>{copy.earns2[locale]}</P>
      <UL>
        <LI><Strong>NgRx SignalStore 22.0.0.</Strong> {copy.libSignalStore[locale]}</LI>
        <LI><Strong>Redux Toolkit 2.12.0.</Strong> {copy.libRedux[locale]}</LI>
        <LI><Strong>TanStack Query 5.102.8.</Strong> {copy.libQuery[locale]}</LI>
        <LI><Strong>Zustand 5.0.15.</Strong> {copy.libZustand[locale]}</LI>
      </UL>
      <P>{copy.earns3[locale]}</P>

      <H2>{copy.unwindTitle[locale]}</H2>
      <P>{copy.unwind1[locale]}</P>
      <OL>
        <LI>{copy.unwindStep1[locale]}</LI>
        <LI>{copy.unwindStep2[locale]}</LI>
        <LI>{copy.unwindStep3[locale]}</LI>
        <LI>{copy.unwindStep4[locale]}</LI>
        <LI>{copy.unwindStep5[locale]}</LI>
      </OL>
      <P>{copy.unwind2[locale]}</P>

      <H2>{copy.testingTitle[locale]}</H2>
      <P>{copy.testing1[locale]}</P>
      <CodeBlock lang="ts" filename="app/routes/cart.data.test.ts" code={LOADER_TEST_CODE} />
      <P>{copy.testing2[locale]}</P>
      <P>{copy.testing3[locale]}</P>

      <H2>{copy.bolTitle[locale]}</H2>
      <P>{copy.bol1[locale]}</P>
      <P>{copy.bol2[locale]}</P>
      <P>
        {copy.bol3Before[locale]}
        <A href={`/${locale}/blog/graphql-as-a-contract-between-frontend-and-backend`}>{copy.contractArticleLink[locale]}</A>
        {copy.bol3After[locale]}
      </P>

      <H2>{copy.closingTitle[locale]}</H2>
      <P>{copy.closing1[locale]}</P>
      <P>
        {copy.closing2Before[locale]}
        <A href={`/${locale}/blog/rxjs-versus-signals-in-angular`}>{copy.rxjsArticleLink[locale]}</A>
        {copy.closing2After[locale]}
      </P>
      <P>{copy.closing3[locale]}</P>
    </>
  );
}

const TADA_SETUP_CODE = `import { initGraphQLTada } from "gql.tada";
import type { introspection } from "./graphqlEnvironment";

export const graphql = initGraphQLTada<{
  introspection: introspection;
  disableMasking: true;
  scalars: {
    ID: string;
    DateTime: string;
  };
}>();

export type { ResultOf, VariablesOf } from "gql.tada";`;

const TADA_DOCUMENTS_CODE = `import { graphql, type ResultOf } from "./graphql";

export const moneyFields = graphql(\`
  fragment MoneyFields on Money {
    amount
    currency
  }
\`);

export const cartFields = graphql(
  \`
    fragment CartFields on Cart {
      id
      updatedAt
      lines {
        id
        quantity
        product {
          id
          name
          slug
          price {
            ...MoneyFields
          }
        }
        lineTotal {
          ...MoneyFields
        }
      }
      promotion {
        code
        discount {
          ...MoneyFields
        }
      }
      subtotal {
        ...MoneyFields
      }
      shipping {
        ...MoneyFields
      }
      total {
        ...MoneyFields
      }
    }
  \`,
  [moneyFields],
);

export const cartQuery = graphql(
  \`
    query CartPage {
      cart {
        ...CartFields
      }
    }
  \`,
  [cartFields],
);

export const changeCartLineQuantityMutation = graphql(
  \`
    mutation ChangeCartLineQuantity($lineId: ID!, $quantity: Int!) {
      changeCartLineQuantity(lineId: $lineId, quantity: $quantity) {
        cart {
          ...CartFields
        }
        availableStock
        errors {
          code
          message
          field
        }
      }
    }
  \`,
  [cartFields],
);

export type Cart = ResultOf<typeof cartFields>;`;

const URQL_CLIENT_CODE = `import { Client, fetchExchange, type AnyVariables } from "@urql/core";
import type { TypedDocumentNode } from "@urql/core";
import { graphqlUrl } from "~/environment.server";
import { buildHeaders, type StoreCredentials } from "./headers";

export type StoreAnswer<Data> = {
  data: Data | null;
  failureMessage: string | null;
  setCookieHeaders: string[];
};

export async function callStore<Data, Variables extends AnyVariables>(
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
      return response;
    },
  });

  const definition = document.definitions[0];
  const isMutation =
    definition !== undefined &&
    definition.kind === "OperationDefinition" &&
    definition.operation === "mutation";

  const result = isMutation
    ? await client.mutation(document, variables).toPromise()
    : await client.query(document, variables).toPromise();

  return {
    data: result.data ?? null,
    failureMessage:
      result.error === undefined
        ? null
        : result.error.graphQLErrors.map((problem) => problem.message).join(" "),
    setCookieHeaders,
  };
}`;

const ROOT_MIDDLEWARE_CODE = `import type { Route } from "./+types/root";
import { connectToStore } from "~/session/storeConnection.server";
import { storeConnectionContext } from "~/session/storeContext";
import { loadShell } from "~/store/shell.server";

const openStoreConnection: Route.MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const connection = await connectToStore(request);
  context.set(storeConnectionContext, connection);
  const response = await next();
  for (const cookie of (await connection.headers()).getSetCookie()) {
    response.headers.append("Set-Cookie", cookie);
  }
  return response;
};

export const middleware: Route.MiddlewareFunction[] = [openStoreConnection];

export async function loader({ context }: Route.LoaderArgs) {
  const connection = context.get(storeConnectionContext);
  if (connection === null) {
    throw new Error("The root middleware did not open a store connection.");
  }
  return loadShell(connection);
}`;

const CART_ROUTE_CODE = `import { data } from "react-router";
import type { Route } from "./+types/cart";
import { cartQuery, changeCartLineQuantityMutation } from "~/graphql/documents";
import { storeConnectionFrom } from "~/session/storeContext";
import { describeUserErrors } from "~/store/userErrors";

const changeQuantityIntent = "changeQuantity";

export async function loader({ context }: Route.LoaderArgs) {
  const connection = storeConnectionFrom(context);
  const answer = await connection.run(cartQuery, {});
  return { cart: answer.cart };
}

export async function action({ request, context }: Route.ActionArgs) {
  const connection = storeConnectionFrom(context);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === changeQuantityIntent) {
    const quantity = Number.parseInt(String(formData.get("quantity") ?? "1"), 10);
    const answer = await connection.run(changeCartLineQuantityMutation, {
      lineId: String(formData.get("lineId") ?? ""),
      quantity: Number.isNaN(quantity) ? 1 : quantity,
    });
    return {
      problems: describeUserErrors(answer.changeCartLineQuantity.errors),
      availableStock: answer.changeCartLineQuantity.availableStock,
    };
  }

  throw data(\`The cart does not know the action \${intent}.\`, { status: 400 });
}

export default function CartPage({ loaderData, actionData }: Route.ComponentProps) {
  const { cart } = loaderData;

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Cart</h1>
      <Messages tone="problem" messages={actionData?.problems ?? []} />
      <table className="w-full border-collapse text-left">
        <tbody>
          {cart.lines.map((line) => (
            <CartLineRow key={line.id} line={line} />
          ))}
        </tbody>
      </table>
    </section>
  );
}`;

const FETCHER_ROW_CODE = `import { Link, useFetcher } from "react-router";
import type { Cart } from "~/graphql/documents";
import { formatMoney } from "~/store/money";

type CartLine = Cart["lines"][number];

const changeQuantityIntent = "changeQuantity";
const removeLineIntent = "removeLine";

function CartLineRow({ line }: { line: CartLine }) {
  const fetcher = useFetcher();
  const pendingIntent = fetcher.formData?.get("intent");
  if (pendingIntent === removeLineIntent) {
    return null;
  }

  const pendingQuantity = fetcher.formData?.get("quantity");
  const parsedQuantity =
    typeof pendingQuantity === "string"
      ? Number.parseInt(pendingQuantity, 10)
      : Number.NaN;
  const quantity = Number.isNaN(parsedQuantity) ? line.quantity : parsedQuantity;
  const lineTotal =
    quantity === line.quantity
      ? line.lineTotal
      : {
          amount: line.product.price.amount * quantity,
          currency: line.product.price.currency,
        };

  return (
    <tr className="border-b border-slate-200">
      <th scope="row" className="py-3 pr-4 text-left font-medium">
        <Link to={\`/products/\${line.product.slug}\`} className="text-emerald-700 underline">
          {line.product.name}
        </Link>
      </th>
      <td className="py-3 pr-4">
        <fetcher.Form method="post" className="flex items-center gap-2">
          <input type="hidden" name="lineId" value={line.id} />
          <label htmlFor={\`quantity-\${line.id}\`} className="sr-only">
            Quantity of {line.product.name}
          </label>
          <input
            id={\`quantity-\${line.id}\`}
            type="number"
            name="quantity"
            min={1}
            defaultValue={quantity}
            key={quantity}
            className="w-20 rounded border border-slate-400 px-2 py-1"
          />
          <button type="submit" name="intent" value={changeQuantityIntent}>
            Update
          </button>
        </fetcher.Form>
      </td>
      <td className="py-3 pr-4 font-medium">{formatMoney(lineTotal)}</td>
    </tr>
  );
}`;

const CATALOGUE_SEARCH_CODE = `export const categoryParameter = "category";
export const searchParameter = "search";
export const inStockParameter = "inStock";
export const afterParameter = "after";

export const cataloguePageSize = 12;

export type CatalogueSearch = {
  categorySlug: string | null;
  searchTerm: string | null;
  inStockOnly: boolean;
  after: string | null;
};

export type ProductFilter = {
  categorySlug: string | null;
  nameContains: string | null;
  inStockOnly: boolean | null;
};

function readSingleValue(parameters: URLSearchParams, name: string): string | null {
  const value = parameters.get(name);
  if (value === null) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

export function readCatalogueSearch(address: URL): CatalogueSearch {
  const parameters = address.searchParams;
  return {
    categorySlug: readSingleValue(parameters, categoryParameter),
    searchTerm: readSingleValue(parameters, searchParameter),
    inStockOnly: parameters.get(inStockParameter) === "true",
    after: readSingleValue(parameters, afterParameter),
  };
}

export function buildProductFilter(search: CatalogueSearch): ProductFilter | null {
  if (
    search.categorySlug === null &&
    search.searchTerm === null &&
    !search.inStockOnly
  ) {
    return null;
  }
  return {
    categorySlug: search.categorySlug,
    nameContains: search.searchTerm,
    inStockOnly: search.inStockOnly ? true : null,
  };
}

export function catalogueAddress(
  search: CatalogueSearch,
  changes: Partial<CatalogueSearch>,
): string {
  const next = { ...search, ...changes };
  const parameters = new URLSearchParams();
  if (next.categorySlug !== null) {
    parameters.set(categoryParameter, next.categorySlug);
  }
  if (next.searchTerm !== null) {
    parameters.set(searchParameter, next.searchTerm);
  }
  if (next.inStockOnly) {
    parameters.set(inStockParameter, "true");
  }
  if (next.after !== null) {
    parameters.set(afterParameter, next.after);
  }
  const query = parameters.toString();
  return query.length === 0 ? "/" : \`/?\${query}\`;
}`;

const CATALOGUE_ROUTE_CODE = `import { Form, Link } from "react-router";
import type { Route } from "./+types/catalogue";
import { catalogueQuery } from "~/graphql/documents";
import { storeConnectionFrom } from "~/session/storeContext";
import {
  buildProductFilter,
  catalogueAddress,
  cataloguePageSize,
  categoryParameter,
  readCatalogueSearch,
  searchParameter,
} from "~/store/catalogueSearch";

export async function loader({ url, context }: Route.LoaderArgs) {
  const connection = storeConnectionFrom(context);
  const search = readCatalogueSearch(url);
  const answer = await connection.run(catalogueQuery, {
    filter: buildProductFilter(search),
    first: cataloguePageSize,
    after: search.after,
  });
  return {
    search,
    categories: answer.categories,
    products: answer.products.edges.map((edge) => edge.node),
    nextCursor: answer.products.pageInfo.hasNextPage
      ? answer.products.pageInfo.endCursor
      : null,
  };
}

export default function Catalogue({ loaderData }: Route.ComponentProps) {
  const { search, categories, products, nextCursor } = loaderData;

  return (
    <section className="space-y-6">
      <Form method="get" role="search" className="flex flex-wrap items-end gap-4">
        <label htmlFor="search-term">Search by name</label>
        <input
          id="search-term"
          type="search"
          name={searchParameter}
          defaultValue={search.searchTerm ?? ""}
        />

        <label htmlFor="category">Category</label>
        <select id="category" name={categoryParameter} defaultValue={search.categorySlug ?? ""}>
          <option value="">Every category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>

        <button type="submit">Filter</button>
      </Form>

      <ProductGrid products={products} />

      {nextCursor === null ? null : (
        <Link to={catalogueAddress(search, { after: nextCursor })}>Next page</Link>
      )}
    </section>
  );
}`;

const DRAWER_SERVICE_CODE = `import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WishlistDrawerService {
  private readonly currentlyOpen = signal(false);
  readonly isOpen = this.currentlyOpen.asReadonly();

  open(): void {
    this.currentlyOpen.set(true);
  }

  close(): void {
    this.currentlyOpen.set(false);
  }

  toggle(): void {
    this.currentlyOpen.update((open) => !open);
  }
}`;

const IDEMPOTENCY_KEY_CODE = `export function newIdempotencyKey(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return \`checkout-\${Date.now().toString(36)}-\${Math.random().toString(36).slice(2, 10)}\`;
}`;

const CHECKOUT_ATTEMPT_CODE = `import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { newIdempotencyKey } from './idempotency-key';

const storageKey = 'checkout-idempotency-key';

@Injectable({ providedIn: 'root' })
export class CheckoutAttempt {
  private readonly storage = inject(LocalStorageService);

  idempotencyKey(): string {
    const stored = this.storage.get<string>(storageKey);

    if (stored !== null) {
      return stored;
    }

    const created = newIdempotencyKey();
    this.storage.set(storageKey, created);

    return created;
  }

  finish(): void {
    this.storage.remove(storageKey);
  }
}`;

const ACCESS_TOKEN_STORE_CODE = `import { computed, Injectable, signal } from '@angular/core';

const refreshMarginInMilliseconds = 30_000;

@Injectable({ providedIn: 'root' })
export class AccessTokenStore {
  private readonly currentToken = signal<string | null>(null);
  private readonly currentExpiry = signal<number | null>(null);

  readonly token = this.currentToken.asReadonly();
  readonly signedIn = computed(() => this.currentToken() !== null);

  hold(token: string, expiresAt: string | null): void {
    this.currentToken.set(token);
    this.currentExpiry.set(expiresAt === null ? null : Date.parse(expiresAt));
  }

  release(): void {
    this.currentToken.set(null);
    this.currentExpiry.set(null);
  }

  aboutToExpire(atMoment: number = Date.now()): boolean {
    const expiry = this.currentExpiry();

    if (expiry === null) {
      return false;
    }

    return expiry - refreshMarginInMilliseconds <= atMoment;
  }
}`;

const GRAPHQL_RESOURCE_CODE = `import { httpResource, HttpResourceRef } from '@angular/common/http';
import { inject } from '@angular/core';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql';
import { AccessTokenStore } from './access-token-store';
import { accessTokenHeader } from './access-token-header';
import { readGraphqlData } from './graphql-answer';
import { GRAPHQL_URL } from './graphql-url';

export function graphqlResource<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: () => TVariables | undefined
): HttpResourceRef<TResult | undefined> {
  const graphqlUrl = inject(GRAPHQL_URL);
  const accessTokenStore = inject(AccessTokenStore);
  const query = print(document);

  return httpResource<TResult>(
    () => {
      const currentVariables = variables();

      if (currentVariables === undefined) {
        return undefined;
      }

      return {
        url: graphqlUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...accessTokenHeader(accessTokenStore.token()),
        },
        body: { query, variables: currentVariables },
      };
    },
    { parse: (answer) => readGraphqlData<TResult>(answer) }
  );
}`;

const CART_SERVICE_CODE = `import { computed, inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';
import {
  AddToCartDocument,
  AddToCartMutation,
  AddToCartMutationVariables,
  CartChangeFragment,
  CartDocument,
} from '../api/generated/contract';
import { graphqlResource } from '../api/graphql-resource';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly apollo = inject(Apollo);
  private readonly cartQuery = graphqlResource(CartDocument, () => ({}));

  readonly loading = this.cartQuery.isLoading;
  readonly unreachable = computed(() => this.cartQuery.error() !== undefined);
  readonly cart = computed(() => this.cartQuery.value()?.cart ?? null);
  readonly lines = computed(() => this.cart()?.lines ?? []);
  readonly itemCount = computed(() =>
    this.lines().reduce((count, line) => count + line.quantity, 0)
  );
  readonly total = computed(() => this.cart()?.total ?? null);

  async addProduct(productId: string, quantity: number): Promise<CartChangeFragment> {
    const answer = await firstValueFrom(
      this.apollo.mutate<AddToCartMutation, AddToCartMutationVariables>({
        mutation: AddToCartDocument,
        variables: { productId, quantity },
      })
    );

    return this.accept(answer.data?.addToCart);
  }

  private accept(change: CartChangeFragment | undefined): CartChangeFragment {
    if (change === undefined) {
      throw new Error('The store API answered without a cart payload.');
    }

    if (change.cart !== null) {
      this.cartQuery.set({ cart: change.cart });
    }

    return change;
  }
}`;

const WISHLIST_SERVICE_CODE = `import { computed, inject, Injectable, resource } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';
import { AccessTokenStore } from '../../app/api/access-token-store';
import {
  ProductSummaryFragment,
  WishlistDocument,
  WishlistQuery,
  WishlistQueryVariables,
} from '../../app/api/generated/contract';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly apollo = inject(Apollo);
  private readonly accessTokenStore = inject(AccessTokenStore);

  private readonly wishlist = resource({
    params: () => ({ savedFor: this.accessTokenStore.token() }),
    loader: () => this.readFromApi(),
    defaultValue: [] as ProductSummaryFragment[],
  });

  readonly products = this.wishlist.value.asReadonly();
  readonly count = computed(() => this.products().length);

  private async readFromApi(): Promise<ProductSummaryFragment[]> {
    const answer = await firstValueFrom(
      this.apollo.query<WishlistQuery, WishlistQueryVariables>({
        query: WishlistDocument,
        fetchPolicy: 'network-only',
      })
    );

    return answer.data?.wishlist ?? [];
  }
}`;

const ANGULAR_CATALOGUE_CODE = `import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogueDocument } from '../api/generated/contract';
import { graphqlResource } from '../api/graphql-resource';

const cataloguePageSize = 24;

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss',
})
export class CatalogueComponent {
  private readonly router = inject(Router);

  readonly category = input('');
  readonly search = input('');
  readonly stock = input('');

  protected readonly searchTerm = linkedSignal(() => this.search());
  protected readonly chosenCategory = linkedSignal(() => this.category());
  protected readonly inStockOnly = linkedSignal(() => this.stock() === 'available');

  private readonly catalogue = graphqlResource(CatalogueDocument, () => ({
    filter: {
      categorySlug: this.category() === '' ? null : this.category(),
      nameContains: this.search() === '' ? null : this.search(),
      inStockOnly: this.stock() === 'available',
    },
    first: cataloguePageSize,
  }));

  protected readonly loading = this.catalogue.isLoading;
  protected readonly categories = computed(() => this.catalogue.value()?.categories ?? []);
  protected readonly products = computed(
    () => this.catalogue.value()?.products.edges.map((edge) => edge.node) ?? []
  );

  protected applyFilter(event: Event): void {
    event.preventDefault();
    void this.router.navigate(['/'], {
      queryParams: {
        category: this.chosenCategory() === '' ? null : this.chosenCategory(),
        search: this.searchTerm() === '' ? null : this.searchTerm(),
        stock: this.inStockOnly() ? 'available' : null,
      },
    });
  }
}`;

const HYDRATION_CONFIG_CODE = `import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { authenticationInterceptor } from './api/authentication.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptors([authenticationInterceptor])),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true,
        includeRequestsWithAuthHeaders: true,
      })
    ),
  ],
};`;

const NEXT_READ_CODE = `import { cache } from "react";

import type { CartContentsQuery } from "@/graphql/generated/graphql";
import { cartQuery } from "@/graphql/operations";
import { readFromApi } from "@/server/storefrontClient";

export const readCart = cache(
  async (): Promise<CartContentsQuery | null> => readFromApi(cartQuery, {}),
);

export function countCartItems(cart: CartContentsQuery | null): number {
  if (cart === null) {
    return 0;
  }
  return cart.cart.lines.reduce((total, line) => total + line.quantity, 0);
}`;

const NEXT_ACTION_CODE = `"use server";

import { changeCartLineQuantityMutation } from "@/graphql/operations";
import {
  refusedAction,
  succeededAction,
  unavailableAction,
  type ActionState,
} from "@/server/actionState";
import { revalidateStorefront } from "@/server/revalidation";
import { writeToApi } from "@/server/storefrontClient";

function readText(form: FormData, field: string): string {
  const value = form.get(field);
  return typeof value === "string" ? value : "";
}

function readWholeNumber(form: FormData, field: string, fallback: number) {
  const parsed = Number.parseInt(readText(form, field), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function changeCartLineQuantity(
  previousState: ActionState,
  form: FormData,
): Promise<ActionState> {
  const data = await writeToApi(changeCartLineQuantityMutation, {
    lineId: readText(form, "lineId"),
    quantity: readWholeNumber(form, "quantity", 1),
  });
  if (data === null) {
    return unavailableAction;
  }
  if (data.changeCartLineQuantity.errors.length > 0) {
    return refusedAction(
      data.changeCartLineQuantity.errors,
      data.changeCartLineQuantity.availableStock,
    );
  }
  revalidateStorefront();
  return succeededAction;
}`;

const LOADER_TEST_CODE = `import { beforeEach, expect, test, vi } from "vitest";

vi.mock("~/graphql/client.server", async (importOriginal) => {
  const original = await importOriginal<typeof import("~/graphql/client.server")>();
  return { ...original, callStore: vi.fn() };
});

import { callStore } from "~/graphql/client.server";
import { action, loader } from "./cart";
import { cartWithOneJacket } from "~/testing/fixtures";
import {
  answerWith,
  formRequest,
  openConnectionForTest,
  routeArgumentsFor,
  storeFrontAddress,
} from "~/testing/storeTestSupport";

beforeEach(() => {
  vi.mocked(callStore).mockReset();
});

test("the loader hands the screen the cart the store keeps", async () => {
  vi.mocked(callStore).mockResolvedValue(answerWith({ cart: cartWithOneJacket }));
  const connection = await openConnectionForTest();

  const loaded = await loader(
    routeArgumentsFor(connection, new Request(\`\${storeFrontAddress}/cart\`)),
  );

  expect(loaded.cart.lines).toHaveLength(1);
});

test("the action changes the quantity of one line", async () => {
  vi.mocked(callStore).mockResolvedValue(
    answerWith({
      changeCartLineQuantity: {
        cart: cartWithOneJacket,
        availableStock: null,
        errors: [],
      },
    }),
  );
  const connection = await openConnectionForTest();

  const outcome = await action(
    routeArgumentsFor(
      connection,
      formRequest("/cart", {
        intent: "changeQuantity",
        lineId: "line-01",
        quantity: "3",
      }),
    ),
  );

  expect(vi.mocked(callStore).mock.calls[0]?.[1]).toEqual({
    lineId: "line-01",
    quantity: 3,
  });
  expect(outcome.problems).toEqual([]);
});`;

const COPY = {
  contentsLabel: { en: "In this article", nl: "In dit artikel" },
  lead: {
    en: "A team says store and means three different things at once. The products and the cart the server owns. The category filter that belongs in the address bar. The panel that happens to be open in this browser. Pull those three apart and the third one turns out to be surprisingly small.",
    nl: "Een team zegt store en bedoelt drie dingen tegelijk. De producten en de winkelwagen waar de server de baas over is. Het categoriefilter dat in de adresbalk hoort. Het paneel dat toevallig openstaat in deze browser. Trek die drie uit elkaar en de derde blijkt verrassend klein.",
  },
  intro1: {
    en: "Every article I write stands on code that runs, so I keep one small web store, Zappy Mart, built several times over on one GraphQL contract. Three store fronts read the same schema: one on React Router in framework mode, one on Angular with signals, and one on the Next.js App Router. The screens are the same in all three: a catalogue with a filter, a product page, a cart with promotion codes, a checkout, an order confirmation and an account page with the customer's open sessions.",
    nl: "Elk artikel dat ik schrijf staat op code die draait, dus ik houd één kleine webwinkel bij, Zappy Mart, die meerdere keren is gebouwd op één GraphQL-contract. Drie winkels lezen hetzelfde schema: één op React Router in framework mode, één op Angular met signals en één op de Next.js App Router. De schermen zijn in alle drie dezelfde: een catalogus met een filter, een productpagina, een winkelwagen met kortingscodes, een afrekenscherm, een bestelbevestiging en een accountpagina met de openstaande sessies van de klant.",
  },
  intro2: {
    en: "None of the three keeps server data in a store, and the article walks through what took that place. At bol.com I work in React Router framework mode, where a loader reads and an action writes, with typed GraphQL queries. That is where I learned to ask the question this article answers, and Zappy Mart is where I can show the code that goes with it.",
    nl: "Geen van de drie bewaart serverdata in een store, en dit artikel loopt langs wat die plek heeft ingenomen. Bij bol.com werk ik in React Router framework mode, waar een loader leest en een action schrijft, met getypte GraphQL-queries. Daar leerde ik de vraag stellen die dit artikel beantwoordt, en in Zappy Mart kan ik de code laten zien die erbij hoort.",
  },
  versionNote: {
    en: "The samples run on React Router 8.3.1 with @urql/core 6.0.3 and gql.tada 1.11.3, on Angular 22.1.5 with Apollo Angular 14.2.0 over Apollo Client 4.2.12, and on Next.js 16.3.4. The store libraries further down are NgRx SignalStore 22.0.0, Redux Toolkit 2.12.0, TanStack Query 5.102.8 and Zustand 5.0.15, and Angular's server rendering package is @angular/ssr 22.1.7. Every one of those numbers was read from the npm registry on 9 September 2026.",
    nl: "De voorbeelden draaien op React Router 8.3.1 met @urql/core 6.0.3 en gql.tada 1.11.3, op Angular 22.1.5 met Apollo Angular 14.2.0 boven op Apollo Client 4.2.12, en op Next.js 16.3.4. De storebibliotheken verderop zijn NgRx SignalStore 22.0.0, Redux Toolkit 2.12.0, TanStack Query 5.102.8 en Zustand 5.0.15, en het serverrenderpakket van Angular is @angular/ssr 22.1.7. Al die nummers zijn op 9 september 2026 uit het npm-register gelezen.",
  },
  quote: {
    en: "Server data has a home the moment it arrives. The question worth asking is what is left once everything has gone where it belongs.",
    nl: "Serverdata heeft een plek op het moment dat het binnenkomt. De vraag die telt, is wat er overblijft als alles op zijn eigen plek staat.",
  },

  threeKindsTitle: {
    en: "Three kinds of state on one screen",
    nl: "Drie soorten state op één scherm",
  },
  threeKinds1: {
    en: "I ask one question of every value a screen shows. Who owns the truth about it. There are three answers, and each answer comes with a home that was already there.",
    nl: "Ik stel bij elke waarde op een scherm één vraag. Wie is de baas over de waarheid ervan. Er zijn drie antwoorden, en elk antwoord heeft een plek die er al was.",
  },
  threeKindsAria: {
    en: "Diagram: one screen splits into server data, URL state and client state, and each one points at where it lives",
    nl: "Diagram: één scherm splitst in serverdata, state in het adres en clientstate, en elk wijst naar de plek waar het woont",
  },
  threeKindsCaption: {
    en: "Server data lives in the loader and the cache, URL state in the address bar, and only what is left needs a store.",
    nl: "Serverdata woont in de loader en de cache, state in het adres woont in de adresbalk, en alleen wat overblijft heeft een store nodig.",
  },
  serverDataLabel: { en: "Server data.", nl: "Serverdata." },
  serverDataBody: {
    en: "The catalogue, the cart, the wishlist, the order. A database somewhere holds the truth, the screen holds a copy for as long as it takes to render, and the moment those two disagree the database is right.",
    nl: "De catalogus, de winkelwagen, de verlanglijst, de bestelling. Ergens houdt een database de waarheid bij, het scherm houdt een kopie zolang het rendert, en zodra die twee van elkaar verschillen heeft de database gelijk.",
  },
  urlStateLabel: { en: "State in the address.", nl: "State in het adres." },
  urlStateBody: {
    en: "The category, the search term, the page, the sort order. The visitor chose it, and a choice like that belongs in a link, because a link is how somebody hands the same screen to a colleague.",
    nl: "De categorie, de zoekterm, de pagina, de sorteervolgorde. De bezoeker heeft het gekozen, en zo'n keuze hoort in een link, want via een link geeft iemand hetzelfde scherm door aan een collega.",
  },
  clientStateLabel: { en: "Client state.", nl: "Clientstate." },
  clientStateBody: {
    en: "The open panel, the row that already shows the new quantity, the key that makes a second click on Place order harmless. Nobody outside this browser tab has any use for it.",
    nl: "Het geopende paneel, de regel die het nieuwe aantal al toont, de sleutel die een tweede klik op Bestellen onschadelijk maakt. Buiten dit browsertabblad heeft niemand er iets aan.",
  },
  threeKinds2: {
    en: "The cost of one word for all three is the bookkeeping in between. Server data that lands in a store needs a rule for when it goes stale. A filter that lands in a store needs writing into the address and reading back out of it on the way in. Client state lands there and fits on the first try, and that is the part this article works towards.",
    nl: "De prijs van één woord voor alle drie is de administratie ertussen. Serverdata die in een store belandt, heeft een regel nodig voor wanneer die verouderd is. Een filter dat in een store belandt, moet in het adres worden geschreven en er bij binnenkomst weer uit worden gelezen. Clientstate belandt daar en past meteen, en daar werkt dit artikel naartoe.",
  },

  cacheTitle: {
    en: "What a GraphQL client cache already is",
    nl: "Wat een GraphQL-cache aan de clientkant al is",
  },
  cache1: {
    en: "A normalised cache is a small database in the browser. Apollo Client gives every object it sees a key from its type name and its id, keeps one entry per key, and rewrites any query result that points at that entry. So the product on the catalogue page and the product on the product page are one entry, and a mutation that answers with the changed object updates every screen reading it. That is the same job a store does for server data, written once by people who only had to solve it for GraphQL.",
    nl: "Een genormaliseerde cache is een kleine database in de browser. Apollo Client geeft elk object dat het ziet een sleutel op basis van de typenaam en de id, houdt één ingang per sleutel bij, en herschrijft elk queryresultaat dat naar die ingang wijst. Het product op de cataloguspagina en het product op de productpagina zijn dus één ingang, en een mutation die het gewijzigde object teruggeeft, werkt elk scherm bij dat het leest. Dat is hetzelfde werk dat een store voor serverdata doet, één keer geschreven door mensen die het alleen voor GraphQL hoefden op te lossen.",
  },
  cache2: {
    en: "Apollo appears in no engagement of mine. It runs in two of the three store fronts here, so the samples are code I wrote and ran, and the experience behind them is this project. The React Router store front takes a different road, and the difference is worth seeing side by side. Its types come from gql.tada, which reads the schema file at build time and infers the result type of every document.",
    nl: "Apollo komt in geen enkele opdracht van mij voor. Het draait wel in twee van de drie winkels hier, dus de voorbeelden zijn code die ik heb geschreven en gedraaid, en de ervaring erachter is dit project. De React Router-winkel gaat een andere weg, en dat verschil is het waard om naast elkaar te zien. De types komen daar uit gql.tada, dat het schemabestand bij het bouwen leest en van elk document het resultaattype afleidt.",
  },
  cache3: {
    en: "One call sets it up, and from there a document is both the query text and its type. Nothing is written by hand, so a field that leaves the schema becomes a type error in the component that read it.",
    nl: "Eén aanroep zet het op, en vanaf dat moment is een document zowel de querytekst als het type ervan. Er wordt niets met de hand geschreven, dus een veld dat uit het schema verdwijnt, wordt een typefout in het component dat het las.",
  },
  cache4: {
    en: "The client itself is created per request on the server, with the fetch exchange and nothing else, and it asks the network every time. The visitor's browser never talks to the API, so the access token and the API's own cookies stay on the store front's server, inside one encrypted cookie.",
    nl: "De client zelf wordt per verzoek op de server gemaakt, met alleen de fetch exchange, en vraagt elke keer het netwerk. De browser van de bezoeker praat nooit met de API, dus het accesstoken en de cookies van de API blijven op de server van de winkel, in één versleutelde cookie.",
  },
  cacheCalloutTitle: {
    en: "A client that lives for one request",
    nl: "Een client die één verzoek lang leeft",
  },
  cacheCalloutBody: {
    en: "The request policy is network-only and the client is thrown away when the response is written, so there is nothing to reuse and nothing to invalidate. That is a deliberate choice for a server rendered front: the loader is the read, and running the loaders again is the sync. A cache earns its place the moment two readers on the same page ask for the same entity, which is exactly what the Angular and Next.js versions do.",
    nl: "De request policy is network-only en de client wordt weggegooid zodra de response is geschreven, dus er valt niets te hergebruiken en niets ongeldig te maken. Dat is een bewuste keuze voor een servergerenderde voorkant: de loader is het lezen, en de loaders opnieuw draaien is het synchroniseren. Een cache verdient zijn plek zodra twee lezers op dezelfde pagina om dezelfde entiteit vragen, en precies dat doen de Angular- en Next.js-versies.",
  },

  loaderTitle: {
    en: "The loader reads, the action writes",
    nl: "De loader leest, de action schrijft",
  },
  loader1: {
    en: "In React Router framework mode a route has three parts that matter here. A loader runs on the server before the screen renders and returns the data. An action runs on the server when a form is submitted. The component gets both as props and holds no copy of its own. One thing has to be set up before that works, because the store needs a connection with credentials, and one request should open exactly one.",
    nl: "In React Router framework mode heeft een route drie onderdelen die hier tellen. Een loader draait op de server voordat het scherm rendert en geeft de data terug. Een action draait op de server zodra een formulier wordt verzonden. Het component krijgt allebei als props en houdt zelf geen kopie. Eén ding moet daarvoor klaarstaan, want de winkel heeft een verbinding met inloggegevens nodig, en één verzoek hoort er precies één te openen.",
  },
  loader2: {
    en: "A root middleware opens that connection, every loader and action on the request shares it through the router context, and the same middleware writes the session cookie back on the way out. It matters because the refresh token may be used once, and a request that renewed it twice would sign the visitor out. With that in place a route is short. Here is the cart, with its read and two of its writes.",
    nl: "Een root-middleware opent die verbinding, elke loader en action op dat verzoek deelt hem via de routercontext, en dezelfde middleware schrijft de sessiecookie op de terugweg weg. Dat is belangrijk, want het refreshtoken mag één keer worden gebruikt, en een verzoek dat het twee keer vernieuwt, zou de bezoeker uitloggen. Daarmee op zijn plek is een route kort. Dit is de winkelwagen, met zijn lezen en twee van zijn schrijfacties.",
  },
  loader3: {
    en: "When the action returns, React Router runs the loaders of the matched routes again and re-renders from what they answer. That is the whole synchronisation mechanism. The action does not have to know which screens showed a cart, and the header that shows the number of items is up to date because its own loader ran again as well.",
    nl: "Zodra de action terugkomt, draait React Router de loaders van de gematchte routes opnieuw en rendert het scherm opnieuw met hun antwoord. Dat is het hele synchronisatiemechanisme. De action hoeft niet te weten welke schermen een winkelwagen toonden, en de header met het aantal artikelen klopt omdat zijn eigen loader ook opnieuw is gedraaid.",
  },
  writeLoopAria: {
    en: "Diagram: a form submit goes to the action, the action calls the API, revalidation runs the loader again, and the loader hands the screen the data",
    nl: "Diagram: een formulierverzending gaat naar de action, de action roept de API aan, daarna draaien de loaders opnieuw en geeft de loader het scherm de data",
  },
  writeLoopCaption: {
    en: "The action writes, the loader reads again, and the component never holds a copy of the server's data.",
    nl: "De action schrijft, de loader leest opnieuw, en het component houdt nooit een kopie van de data van de server.",
  },
  loader4: {
    en: "Read the component in that sample again and notice what is not there. No effect that fetches, no dependency array, no loading flag, no reducer and no place where a cart could be half updated. The screen renders what the loader handed it.",
    nl: "Lees het component in dat voorbeeld nog eens en let op wat er niet staat. Geen effect dat ophaalt, geen dependency array, geen laadvlag, geen reducer en geen plek waar een winkelwagen half bijgewerkt kan zijn. Het scherm rendert wat de loader heeft aangereikt.",
  },

  fetcherTitle: {
    en: "useFetcher and the value that is true for one request",
    nl: "useFetcher en de waarde die één verzoek lang waar is",
  },
  fetcher1: {
    en: "There is one moment where the screen is ahead of the server. The visitor types a new quantity and presses Update, and for as long as the request is in flight the row should already show the new number and the new line total. This is genuine client state, and it lives for the length of one submission.",
    nl: "Er is één moment waarop het scherm voorloopt op de server. De bezoeker typt een nieuw aantal en drukt op Bijwerken, en zolang het verzoek onderweg is, hoort de regel het nieuwe aantal en het nieuwe regeltotaal al te tonen. Dit is echte clientstate, en hij leeft precies zolang als één verzending.",
  },
  fetcher2: {
    en: "The pending value is read straight out of the submission. The fetcher exposes the form data it is sending, so the row takes the quantity from there while a request is under way and from the loader data when there is none. A removal is the same trick with a shorter answer: the row that is being removed renders nothing at all.",
    nl: "De waarde die onderweg is, wordt rechtstreeks uit de verzending gelezen. De fetcher stelt de formuliergegevens beschikbaar die hij verstuurt, dus de regel neemt het aantal daaruit zolang er een verzoek loopt en uit de loaderdata zodra dat niet zo is. Een verwijdering is dezelfde truc met een korter antwoord: de regel die wordt verwijderd, rendert helemaal niets.",
  },
  fetcher3: {
    en: "Two details make it behave. Each row has its own fetcher, so two rows can be in flight at the same time without sharing a status. And the key on the number input is the quantity, so when the loader answers with the number the server settled on, React remounts the field and the visitor sees the truth. When the request finishes, the optimistic value disappears because the thing holding it is gone. There is nothing to clean up.",
    nl: "Twee details maken het gedrag kloppend. Elke regel heeft een eigen fetcher, dus twee regels kunnen tegelijk onderweg zijn zonder één status te delen. En de key op het nummerveld is het aantal, dus zodra de loader antwoordt met het getal waar de server op uitkomt, hangt React het veld opnieuw op en ziet de bezoeker de waarheid. Als het verzoek klaar is, verdwijnt de vooruitlopende waarde omdat het ding dat hem vasthield weg is. Er valt niets op te ruimen.",
  },

  urlTitle: {
    en: "The address bar as the filter",
    nl: "De adresbalk als filter",
  },
  url1: {
    en: "The catalogue has a category, a search term, a stock switch and a cursor for the next page. Four values, and all four are in the address. The reading and the writing of them is one small module of pure functions, which means it is also the easiest part of the screen to test.",
    nl: "De catalogus heeft een categorie, een zoekterm, een voorraadschakelaar en een cursor voor de volgende pagina. Vier waarden, en alle vier staan ze in het adres. Het lezen en schrijven ervan is één klein bestand met pure functies, en daarmee ook het makkelijkst te testen deel van het scherm.",
  },
  url2: {
    en: "The loader reads the address it was given and turns it into the filter the schema asks for. Note that the route has no state at all, because the form is a plain GET form. Submitting it navigates, navigating runs the loader, and the loader queries the API.",
    nl: "De loader leest het adres dat hij meekrijgt en maakt daar het filter van dat het schema vraagt. Let erop dat de route helemaal geen state heeft, want het formulier is een gewoon GET-formulier. Verzenden is navigeren, navigeren draait de loader, en de loader bevraagt de API.",
  },
  url3: {
    en: "Four things come for free with that. The filtered catalogue is a link a visitor can send to somebody. The back button goes back to the previous filter, because the browser has been keeping that history all along. A first visit to a filtered address renders the right page on the server, so a search engine and a visitor see the same thing. And the pagination cursor is in the address too, so a shared link opens on the page that was shared.",
    nl: "Vier dingen krijg je daar gratis bij. De gefilterde catalogus is een link die een bezoeker kan doorsturen. De terugknop gaat terug naar het vorige filter, want de browser houdt die geschiedenis toch al bij. Een eerste bezoek aan een gefilterd adres rendert de juiste pagina op de server, dus een zoekmachine en een bezoeker zien hetzelfde. En de paginacursor staat ook in het adres, dus een gedeelde link opent op de pagina die is gedeeld.",
  },
  url4: {
    en: "The rule I use is short. If a colleague could reasonably want to send this screen to somebody, the value that makes it this screen goes in the address. A search term qualifies. A half typed search term does not, and that is why the input keeps its own default value and only the submitted term travels.",
    nl: "De regel die ik gebruik is kort. Als een collega dit scherm redelijkerwijs naar iemand zou willen sturen, dan hoort de waarde die het dit scherm maakt in het adres. Een zoekterm valt daaronder. Een half getypte zoekterm niet, en daarom houdt het invoerveld zijn eigen beginwaarde en reist alleen de verzonden term mee.",
  },

  leftTitle: {
    en: "What is left on the client",
    nl: "Wat er op de client overblijft",
  },
  left1: {
    en: "Server data is in the loader and the cache. The filter is in the address. Across the six screens of this store, in three frameworks, this is the complete list of what is left over.",
    nl: "Serverdata zit in de loader en de cache. Het filter zit in het adres. Over de zes schermen van deze winkel, in drie frameworks, is dit de volledige lijst van wat er overblijft.",
  },
  leftDrawerLabel: { en: "The open panel.", nl: "Het geopende paneel." },
  leftDrawerBody: {
    en: "The Angular store front shows the wishlist in a panel that slides in from the side. Whether it is open is a boolean that the header writes and the panel reads. That is genuinely shared between two components and the server has no interest in it.",
    nl: "De Angular-winkel toont de verlanglijst in een paneel dat vanaf de zijkant naar binnen schuift. Of het openstaat is een boolean die de header schrijft en het paneel leest. Die wordt echt gedeeld tussen twee componenten en de server heeft er geen belang bij.",
  },
  leftPendingLabel: { en: "The value that is ahead of the server.", nl: "De waarde die op de server vooruitloopt." },
  leftPendingBody: {
    en: "The cart quantity in flight, from the section above. It lives inside a fetcher for the length of one request and it is read, not stored.",
    nl: "Het aantal in de winkelwagen dat onderweg is, uit de vorige paragraaf. Het leeft in een fetcher zolang één verzoek duurt en wordt gelezen, niet opgeslagen.",
  },
  leftKeyLabel: { en: "The key that makes the second click harmless.", nl: "De sleutel die de tweede klik onschadelijk maakt." },
  leftKeyBody: {
    en: "One checkout attempt gets one identifier, which the API uses to recognise a repeat of the same order. It has to survive a reload, because a reload is exactly when a nervous visitor presses the button again, so it goes in local storage and is removed when the order is placed.",
    nl: "Eén afrekenpoging krijgt één identificatie, waarmee de API een herhaling van dezelfde bestelling herkent. Die moet een herlaadactie overleven, want juist dan drukt een zenuwachtige bezoeker nog eens op de knop, dus hij gaat in local storage en wordt weggehaald zodra de bestelling is geplaatst.",
  },
  leftTokenLabel: { en: "The access token.", nl: "Het accesstoken." },
  leftTokenBody: {
    en: "The Angular front is a single page application, so it holds the token in memory in a signal and never writes it down. The React Router front has a server, so it keeps the token there inside an encrypted cookie and the browser holds nothing.",
    nl: "De Angular-voorkant is een singlepageapplicatie, dus die houdt het token in het geheugen in een signal en schrijft het nergens op. De React Router-voorkant heeft een server, dus die bewaart het token daar in een versleutelde cookie en de browser houdt niets vast.",
  },
  leftCodeLabel: { en: "A promotion code that has not been submitted.", nl: "Een kortingscode die nog niet verzonden is." },
  leftCodeBody: {
    en: "The characters in the field before the visitor presses Apply. That is the input's own value and it never needs to be anywhere else.",
    nl: "De tekens in het veld voordat de bezoeker op Toepassen drukt. Dat is de waarde van het invoerveld zelf en die hoeft nergens anders te staan.",
  },
  left2: {
    en: "One item that people expect on this list is not on it. The wishlist of a visitor who has not signed in is server data. The contract keeps it against the same zappy_cart cookie as the anonymous cart, and on registration or login it is merged into the customer's wishlist by adding, so a product that is already there stays there once. That rule is written down in the contract and every backend has to answer to it, which is why no store front has to invent a merge of its own. The panel is the client state here, and the list inside it is not.",
    nl: "Eén onderdeel dat mensen op deze lijst verwachten, staat er niet op. De verlanglijst van een bezoeker die niet is ingelogd, is serverdata. Het contract bewaart die tegen dezelfde zappy_cart-cookie als de anonieme winkelwagen, en bij registreren of inloggen wordt hij bij de verlanglijst van de klant opgeteld, zodat een product dat er al staat er één keer blijft staan. Die regel staat in het contract en elke backend moet eraan voldoen, en daarom hoeft geen enkele winkel zelf een samenvoeging te verzinnen. Het paneel is hier de clientstate, de lijst erin niet.",
  },
  left3: {
    en: "So this is the whole store for the panel, in an application with six screens.",
    nl: "Dit is dus de hele store voor het paneel, in een applicatie met zes schermen.",
  },
  left4: {
    en: "The checkout key is two small files. One makes an identifier, the other remembers it until the order is placed.",
    nl: "De afrekensleutel is twee kleine bestanden. Het ene maakt een identificatie, het andere onthoudt hem tot de bestelling is geplaatst.",
  },
  left5: {
    en: "And the token holder is a signal with an expiry beside it, so a computed can say whether somebody is signed in and an interceptor can ask whether the token is about to run out. Five pieces, four of which are a single signal or a single variable. That is the size of the thing a store would have been built to hold.",
    nl: "En de tokenhouder is een signal met een vervalmoment ernaast, zodat een computed kan zeggen of iemand is ingelogd en een interceptor kan vragen of het token bijna verloopt. Vijf onderdelen, waarvan er vier één signal of één variabele zijn. Dat is de omvang van wat een store zou hebben moeten bewaren.",
  },

  angularTitle: {
    en: "Angular with signals: resource, httpResource and computed",
    nl: "Angular met signals: resource, httpResource en computed",
  },
  angular1: {
    en: "Angular 22 has a read that is shaped like a signal. The httpResource function takes a function that builds a request out of signals, requests eagerly, requests again when a dependency changes, cancels the pending request when that happens, and hands back a signal for the value, one for the loading state and one for the error. Its own type file calls what it returns a WritableResource, so the value can also be set from the outside, and the cart uses that in a moment. GraphQL travels over POST, so the whole thing fits in one wrapper of about thirty lines.",
    nl: "Angular 22 heeft een leesbewerking met de vorm van een signal. De functie httpResource neemt een functie die uit signals een verzoek samenstelt, vraagt meteen op, vraagt opnieuw op zodra een afhankelijkheid verandert, breekt het lopende verzoek daarbij af, en geeft een signal terug voor de waarde, een voor de laadstatus en een voor de fout. Het eigen typebestand noemt wat hij teruggeeft een WritableResource, dus de waarde is ook van buitenaf te zetten, en de winkelwagen doet dat zo meteen. GraphQL reist over POST, dus het geheel past in één wikkel van een regel of dertig.",
  },
  angular2: {
    en: "The cart service is that wrapper plus a set of computed values. The resource owns the request that reads the cart. Apollo Angular sends the mutations, which are requests of their own with their own variables. When a mutation answers with the changed cart, the service sets that answer on the resource, so the screen has the new totals without a second round trip.",
    nl: "De winkelwagenservice is die wikkel plus een reeks computed-waarden. De resource bezit het verzoek dat de winkelwagen leest. Apollo Angular verstuurt de mutations, en dat zijn eigen verzoeken met eigen variabelen. Zodra een mutation de gewijzigde winkelwagen teruggeeft, zet de service dat antwoord op de resource, zodat het scherm de nieuwe totalen heeft zonder een tweede rondje.",
  },
  angular3: {
    en: "The item count and the total are computed values over the resource, which is the same idea a selector carries, expressed as a function of the value it derives from. A computed is lazy and caches its answer, so a total nobody reads is never worked out, and a component that reads it is registered as a dependent without writing a line of subscription code.",
    nl: "Het aantal artikelen en het totaal zijn computed-waarden boven op de resource, en dat is hetzelfde idee als een selector, uitgedrukt als een functie van de waarde waar het uit volgt. Een computed is lui en onthoudt zijn antwoord, dus een totaal dat niemand leest wordt nooit berekend, en een component dat het leest wordt als afhankelijke geregistreerd zonder één regel abonnementscode.",
  },
  angular4: {
    en: "The wishlist shows the other half of the family. A resource takes params and a loader, and it reloads when the params change. The params here are the access token, so signing in reloads the list, which is exactly the moment the server merged the anonymous list into the customer's own.",
    nl: "De verlanglijst laat de andere helft van de familie zien. Een resource neemt params en een loader, en laadt opnieuw zodra de params veranderen. De params zijn hier het accesstoken, dus inloggen laadt de lijst opnieuw, en dat is precies het moment waarop de server de anonieme lijst bij die van de klant heeft opgeteld.",
  },
  angular5: {
    en: "The catalogue closes the circle. The router feeds the query parameters into the component as inputs, because the application is configured with component input binding, and inputs in Angular 22 are signals. So the filter in the address is a signal without any reading of the address in the component, and the resource depends on those inputs, so a navigation is a new query.",
    nl: "De catalogus maakt de cirkel rond. De router voert de queryparameters als inputs aan het component, want de applicatie is met component input binding geconfigureerd, en inputs zijn in Angular 22 signals. Het filter in het adres is dus een signal zonder dat het component het adres uitleest, en de resource hangt van die inputs af, dus een navigatie is een nieuwe query.",
  },
  angular6: {
    en: "The three linkedSignal values in there are the form fields, and they are the Angular version of the half typed search term. They start from the address and stay writable while the visitor edits, and they start again when a navigation gives the component a new input. Pressing Filter navigates, and from that point the address is in charge again.",
    nl: "De drie linkedSignal-waarden daarin zijn de formuliervelden, en dat is de Angular-versie van de half getypte zoekterm. Ze beginnen bij het adres en blijven schrijfbaar terwijl de bezoeker typt, en ze beginnen opnieuw zodra een navigatie het component een nieuwe input geeft. Op Filter drukken is navigeren, en vanaf dat moment heeft het adres het weer voor het zeggen.",
  },

  hydrationTitle: {
    en: "Angular on the server, and the cache that crosses over",
    nl: "Angular op de server, en de cache die meereist",
  },
  hydration1: {
    en: "The Angular store front in this project is a single page application, so this section has no running Zappy Mart sample behind it. I am writing it as teaching, from the shipped type definitions of Angular 22.1.5 read on 9 September 2026, and I say so because the rest of the article is code I ran.",
    nl: "De Angular-winkel in dit project is een singlepageapplicatie, dus achter deze paragraaf zit geen draaiend Zappy Mart-voorbeeld. Ik schrijf hem als uitleg, op basis van de meegeleverde typedefinities van Angular 22.1.5, gelezen op 9 september 2026, en ik zeg dat erbij omdat de rest van dit artikel code is die ik heb gedraaid.",
  },
  hydration2: {
    en: "Server rendering comes from @angular/ssr, and the piece that matters for state is one provider in the application config. Calling provideClientHydration turns on three things at once in version 22: hydration of the server rendered DOM, the HTTP transfer cache, and incremental hydration. The transfer cache is the interesting one, because it is what carries the server's answers to the browser inside the page.",
    nl: "Serverrendering komt uit @angular/ssr, en het onderdeel dat voor state telt, is één provider in de applicatieconfiguratie. Een aanroep van provideClientHydration zet in versie 22 drie dingen tegelijk aan: hydratie van de servergerenderde DOM, de HTTP-transfercache, en incrementele hydratie. Die transfercache is de interessante, want die brengt de antwoorden van de server in de pagina mee naar de browser.",
  },
  hydration3: {
    en: "The defaults are worth reading closely, because a GraphQL front runs into all three of them. Only GET and HEAD requests are cached, and the option that turns POST caching on names GraphQL as its reason. Requests carrying an Authorization or a Cookie header are excluded, and there is a separate option for those. So a store front that posts its queries with a bearer token gets an empty transfer cache until it says otherwise, and every query it rendered on the server is asked again from the browser.",
    nl: "De standaardwaarden zijn het nauwkeurig lezen waard, want een GraphQL-voorkant loopt tegen alle drie aan. Alleen GET- en HEAD-verzoeken worden bewaard, en de optie die POST aanzet noemt GraphQL als reden. Verzoeken met een Authorization- of Cookie-header vallen erbuiten, en daar is een aparte optie voor. Een winkel die zijn queries met een bearertoken verstuurt, krijgt dus een lege transfercache tot hij het tegendeel zegt, en elke query die op de server is gerenderd wordt vanuit de browser opnieuw gesteld.",
  },
  hydrationCalloutTitle: {
    en: "Two things changed in version 22",
    nl: "Twee dingen zijn in versie 22 veranderd",
  },
  hydrationCalloutBody: {
    en: "Incremental hydration is on by default now. The withIncrementalHydration function still exists and is deprecated since v22.0.0 with an intent to remove in v24, so an application that passes it compiles and can drop it on its own schedule. The new function is withNoIncrementalHydration, which turns it off. Both statements come from the type definitions that ship with the package, not from a summary of them.",
    nl: "Incrementele hydratie staat nu standaard aan. De functie withIncrementalHydration bestaat nog en is sinds v22.0.0 deprecated, met het voornemen hem in v24 te verwijderen, dus een applicatie die hem meegeeft compileert gewoon en kan hem weghalen wanneer het uitkomt. De nieuwe functie is withNoIncrementalHydration, die het uitzet. Beide uitspraken komen uit de typedefinities die met het pakket meekomen, niet uit een samenvatting daarvan.",
  },
  hydration4: {
    en: "For the subject of this article the conclusion is short. With the transfer cache configured, the answers the server already had arrive in the browser inside the page, and the resource that made the request finds them there. The first render has its data, and there is no serialised store to write out on the server and read back in the browser.",
    nl: "Voor het onderwerp van dit artikel is de conclusie kort. Met een goed ingestelde transfercache komen de antwoorden die de server al had in de pagina mee naar de browser, en de resource die het verzoek deed, vindt ze daar. De eerste render heeft zijn data, en er is geen geserialiseerde store die op de server moet worden weggeschreven en in de browser weer moet worden ingelezen.",
  },

  nextTitle: {
    en: "Next.js in one section",
    nl: "Next.js in één paragraaf",
  },
  next1: {
    en: "The third store front puts the same three kinds of state in the same three places, with different words. A server component reads. The read is wrapped in the React cache function, so several components on one page that ask for the cart share one request. Apollo Client sits on the server here, with the fetch that carries the token and the API cookies.",
    nl: "De derde winkel zet dezelfde drie soorten state op dezelfde drie plekken, met andere woorden. Een servercomponent leest. Het lezen zit in de cache-functie van React, zodat meerdere componenten op één pagina die om de winkelwagen vragen samen één verzoek doen. Apollo Client staat hier op de server, met de fetch die het token en de API-cookies meedraagt.",
  },
  next2: {
    en: "A server action writes, and it names the cache it made stale. That call is the counterpart of revalidation in React Router, and it is the same idea: the write does not update a copy, it says that the copies are old.",
    nl: "Een server action schrijft, en benoemt de cache die daardoor verouderd is. Die aanroep is de tegenhanger van revalidatie in React Router, en het idee is hetzelfde: het schrijven werkt geen kopie bij, het zegt dat de kopieën oud zijn.",
  },
  next3: {
    en: "The filter is in the address here too, read from the search parameters that the page receives. The catalogue puts the filter and the grid behind their own boundaries, so the shell arrives first and the products stream in behind it. Between the three store fronts the words differ and the shape does not, which is what convinced me the shape is the point.",
    nl: "Het filter zit hier ook in het adres, gelezen uit de zoekparameters die de pagina meekrijgt. De catalogus zet het filter en het raster achter een eigen grens, zodat de romp eerst binnenkomt en de producten daarachteraan stromen. Tussen de drie winkels verschillen de woorden en niet de vorm, en dat overtuigde mij ervan dat de vorm het punt is.",
  },

  earnsTitle: {
    en: "When a store earns its place",
    nl: "Wanneer een store zijn plek verdient",
  },
  earns1: {
    en: "This store is small and its screens are ordinary, which is why the leftovers fit on a list. Plenty of applications have a value that is genuinely bigger than a signal, and here are the five I actually reach for a store for.",
    nl: "Deze winkel is klein en de schermen zijn gewoon, en daarom past wat overblijft op één lijst. Genoeg applicaties hebben een waarde die echt groter is dan een signal, en dit zijn de vijf waarvoor ik daadwerkelijk naar een store grijp.",
  },
  earnsUndoLabel: { en: "Undo and redo.", nl: "Ongedaan maken en opnieuw." },
  earnsUndoBody: {
    en: "A history of states with a pointer into it is exactly what a reducer is good at, and an editor or a drawing surface needs one.",
    nl: "Een geschiedenis van toestanden met een aanwijzer erin is precies waar een reducer goed in is, en een editor of een tekenvlak heeft die nodig.",
  },
  earnsOfflineLabel: { en: "Work that survives being offline.", nl: "Werk dat een offline moment overleeft." },
  earnsOfflineBody: {
    en: "Changes that have to queue up, be replayed and be reconciled when the connection returns are a domain of their own, and that queue is state the client owns.",
    nl: "Wijzigingen die in de rij moeten, opnieuw moeten worden afgespeeld en moeten worden verzoend zodra de verbinding terug is, vormen een eigen domein, en die rij is state waar de client de baas over is.",
  },
  earnsWizardLabel: { en: "A long form across several routes.", nl: "Een lang formulier over meerdere routes." },
  earnsWizardBody: {
    en: "Six steps that are only submitted at the end have to hold their answers somewhere that outlives each screen, and that somewhere is a store or a server draft.",
    nl: "Zes stappen die pas aan het eind worden verzonden, moeten hun antwoorden ergens bewaren dat elk scherm overleeft, en dat is een store of een concept op de server.",
  },
  earnsDerivedLabel: { en: "Client state many screens read.", nl: "Clientstate die veel schermen lezen." },
  earnsDerivedBody: {
    en: "A selection of rows, a comparison list, a set of open filters in a dashboard. Once several routes read and write the same client value, one owner with a clear API beats passing it around.",
    nl: "Een selectie van rijen, een vergelijkingslijst, een verzameling openstaande filters in een dashboard. Zodra meerdere routes dezelfde clientwaarde lezen en schrijven, wint één eigenaar met een duidelijke API het van doorgeven.",
  },
  earnsLiveLabel: { en: "A live connection feeding many screens.", nl: "Een live verbinding die veel schermen voedt." },
  earnsLiveBody: {
    en: "A socket that pushes prices or presence has one connection and many readers, and something has to own that one connection and hand out the latest value.",
    nl: "Een socket die prijzen of aanwezigheid doorstuurt, heeft één verbinding en veel lezers, en iets moet die ene verbinding bezitten en de laatste waarde uitdelen.",
  },
  earns2: {
    en: "Four libraries come up in every conversation about this, and each of them is good at something specific.",
    nl: "Vier bibliotheken komen in elk gesprek hierover langs, en elk van hen is ergens specifiek goed in.",
  },
  libSignalStore: {
    en: "An Angular store built on signals, so its state, its computed values and its methods live in the same graph as the rest of an Angular 22 application. It is at its best for the fourth case above, client state several routes share, and its entity helpers give a selection or a comparison list a ready made shape.",
    nl: "Een Angular-store op signals, zodat de state, de computed-waarden en de methodes in dezelfde graaf wonen als de rest van een Angular 22-applicatie. Hij komt het best tot zijn recht bij het vierde geval hierboven, clientstate die meerdere routes delen, en de entiteitshulpjes geven een selectie of een vergelijkingslijst een kant-en-klare vorm.",
  },
  libRedux: {
    en: "Reducers, immutable updates and a devtools timeline of every action that ever ran. That timeline is the reason it is strong for undo and redo and for anything where somebody has to explain afterwards how the screen got into this state.",
    nl: "Reducers, onveranderlijke updates en een devtools-tijdlijn van elke action die ooit is gedraaid. Die tijdlijn is de reden dat het sterk is voor ongedaan maken en opnieuw, en voor alles waarbij iemand achteraf moet uitleggen hoe het scherm in deze toestand is beland.",
  },
  libQuery: {
    en: "A cache for server data in React with the surrounding questions solved: staleness, retries, deduplication of identical requests, background refetching, pagination and offline queues. In a client rendered React application it does for REST and GraphQL what a loader plus revalidation does in framework mode.",
    nl: "Een cache voor serverdata in React met de vragen eromheen opgelost: verouderde data, opnieuw proberen, dubbele verzoeken samenvoegen, verversen op de achtergrond, paginering en offlinewachtrijen. In een client-gerenderde React-applicatie doet het voor REST en GraphQL wat een loader met opnieuw draaien in framework mode doet.",
  },
  libZustand: {
    en: "A very small store with a hook and a subscribe function, and no provider around the tree. It is the cheapest way to give a handful of client values one owner, which makes it a good fit for the panel, the selection and the wizard.",
    nl: "Een heel kleine store met een hook en een subscribe-functie, en geen provider om de boom heen. Het is de goedkoopste manier om een handvol clientwaarden één eigenaar te geven, en daarmee past het goed bij het paneel, de selectie en de meerstapsvorm.",
  },
  earns3: {
    en: "Every one of these is a good answer to the question it was built for. The work is deciding which question you have, and that decision is made per value, not per application.",
    nl: "Stuk voor stuk zijn dit goede antwoorden op de vraag waarvoor ze zijn gemaakt. Het werk zit in bepalen welke vraag je hebt, en die beslissing neem je per waarde, niet per applicatie.",
  },

  unwindTitle: {
    en: "The order to unwind a large store",
    nl: "De volgorde om een grote store af te pellen",
  },
  unwind1: {
    en: "If there is a store in front of you with a hundred actions in it, the order matters more than the destination. This is the sequence I use, and every step ships on its own.",
    nl: "Ligt er een store voor je met honderd actions erin, dan telt de volgorde zwaarder dan de bestemming. Dit is de reeks die ik gebruik, en elke stap gaat los live.",
  },
  unwindStep1: {
    en: "Make an inventory in three columns. Walk the state tree and mark every branch as server data, address, or client. This takes an afternoon and it usually settles the argument on its own, because the columns are rarely close to even.",
    nl: "Maak een inventarisatie in drie kolommen. Loop de stateboom langs en markeer elke tak als serverdata, adres of client. Dit kost een middag en beslecht de discussie meestal vanzelf, want de kolommen zijn zelden ongeveer gelijk.",
  },
  unwindStep2: {
    en: "Take the server data out first, one screen at a time. Give that screen a loader or a resource, let the component read it, and delete the branch and its actions when the last reader is gone. The screen keeps working the whole way, because the store stays until the last reader has moved.",
    nl: "Haal eerst de serverdata eruit, één scherm per keer. Geef dat scherm een loader of een resource, laat het component daaruit lezen, en verwijder de tak met zijn actions zodra de laatste lezer weg is. Het scherm blijft ondertussen werken, want de store blijft staan tot de laatste lezer is verhuisd.",
  },
  unwindStep3: {
    en: "Move the address values next. A filter, a page number and a sort order become search parameters, and the code that kept them in step with the address disappears with them. This step usually deletes more lines than it adds.",
    nl: "Verplaats daarna de adreswaarden. Een filter, een paginanummer en een sorteervolgorde worden zoekparameters, en de code die ze met het adres gelijk hield, verdwijnt ermee. Deze stap haalt meestal meer regels weg dan hij toevoegt.",
  },
  unwindStep4: {
    en: "Look at what is left and count it. In my experience that is a handful of values. Some of them belong in the component that uses them, and the ones that two components genuinely share stay in one owner.",
    nl: "Kijk naar wat overblijft en tel het. Mijn ervaring is dat het een handvol waarden is. Een deel hoort thuis in het component dat ze gebruikt, en wat twee componenten echt delen, blijft bij één eigenaar.",
  },
  unwindStep5: {
    en: "Decide about the store itself last, with the list in hand. A store that holds five values and pays for itself in devtools and testing is a fine outcome, and so is a store that has become one service with three signals. The point of the exercise is that the decision is now made about something you can see.",
    nl: "Beslis als laatste over de store zelf, met de lijst in de hand. Een store die vijf waarden bewaart en zichzelf terugverdient in devtools en tests, is een prima uitkomst, en een store die één service met drie signals is geworden ook. Het punt van de oefening is dat de beslissing nu gaat over iets wat je kunt zien.",
  },
  unwind2: {
    en: "Notice that the store is never the first thing to be touched. It is the last, and by then the question has answered itself.",
    nl: "Merk op dat de store nooit het eerste is wat je aanraakt. Hij is het laatste, en tegen die tijd heeft de vraag zichzelf beantwoord.",
  },

  testingTitle: {
    en: "Testing without a store",
    nl: "Testen zonder store",
  },
  testing1: {
    en: "The part I did not expect to enjoy this much is the tests. A loader is a function that takes a request and returns data, and an action is a function that takes form data and returns the outcome. Mock the one call that reaches the API and both are ordinary unit tests with no rendering in them.",
    nl: "Wat ik niet had verwacht zo prettig te vinden, zijn de tests. Een loader is een functie die een verzoek aanneemt en data teruggeeft, en een action is een functie die formuliergegevens aanneemt en de uitkomst teruggeeft. Mock de ene aanroep die de API bereikt en allebei zijn het gewone unittests zonder rendering.",
  },
  testing2: {
    en: "The second test asserts the variables that went to the API, which is the interesting half of an action. It parsed the form data, so the quantity has to arrive as the number three and not as the text three, and that is the sort of thing a schema catches at build time and a test catches for the parsing around it.",
    nl: "De tweede test controleert de variabelen die naar de API gingen, en dat is de interessante helft van een action. Hij heeft de formuliergegevens omgezet, dus het aantal moet als het getal drie aankomen en niet als de tekst drie, en dat is precies wat een schema tijdens het bouwen vangt en een test voor het omzetten eromheen.",
  },
  testing3: {
    en: "The Angular side has the same property. A computed is a function of the signals it reads, so a test sets the resource's value and reads the total. The wrapper around httpResource is the only place that knows about HTTP, and it is thirty lines with one job.",
    nl: "De Angular-kant heeft dezelfde eigenschap. Een computed is een functie van de signals die hij leest, dus een test zet de waarde van de resource en leest het totaal. De wikkel om httpResource is de enige plek die van HTTP weet, en dat zijn dertig regels met één taak.",
  },

  bolTitle: {
    en: "What this looks like at bol.com",
    nl: "Hoe dit er bij bol.com uitziet",
  },
  bol1: {
    en: "The storefront I work on there runs on a server-side-rendered React platform, in React Router framework mode with loaders and actions and typed GraphQL queries. On the shared subscription page the server fetches both subscriptions at once and one pure function maps the result to one of five mutually exclusive situations, so every situation is derived in one place. The types run from the GraphQL query into the component without casts. That is the record's own description, and it is the same shape as the cart above: read on the server, derive in a function, render what came back.",
    nl: "De winkel waar ik daar aan werk, draait op een servergerenderd React-platform, in React Router framework mode met loaders en actions en getypte GraphQL-queries. Op de gedeelde abonnementenpagina haalt de server beide abonnementen tegelijk op en zet één pure functie het resultaat om in een van vijf elkaar uitsluitende situaties, zodat elke situatie op één plek wordt afgeleid. De types lopen van de GraphQL-query het component in zonder casts. Dat is de beschrijving uit het dossier, en het is dezelfde vorm als de winkelwagen hierboven: lezen op de server, afleiden in een functie, renderen wat terugkwam.",
  },
  bol2: {
    en: "I want to be exact about the scope, because this article is about a pattern and not about a rescue. Those pages were built this way, and I have not taken a store out of anybody's codebase there. What I did do is decide, page by page, where each value belonged, and the Angular work behind me is what taught me to ask. At Athlon I designed the frontend architecture around RxJS and reactive data streams. At the Belastingdienst generic components took their logic and their appearance from injectable services and configuration files, and I took a senior developer through streams and the proper use of services.",
    nl: "Ik wil precies zijn over de reikwijdte, want dit artikel gaat over een patroon en niet over een redding. Die pagina's zijn zo gebouwd, en ik heb daar bij niemand een store uit de code gehaald. Wat ik wel deed, was pagina voor pagina bepalen waar elke waarde thuishoorde, en het Angular-werk achter me leerde mij die vraag te stellen. Bij Athlon ontwierp ik de frontendarchitectuur rond RxJS en reactieve datastromen. Bij de Belastingdienst haalden generieke componenten hun logica en hun uiterlijk uit injecteerbare services en configuratiebestanden, en nam ik een senior ontwikkelaar mee door streams en het juiste gebruik van services.",
  },
  bol3Before: {
    en: "The other half of this story is the schema. A contract that gives a page the shape it needs is what makes a loader short, and when the shape does not fit I take that to the backend team, so the change lands in the contract and every client gets it. I wrote that down separately in ",
    nl: "De andere helft van dit verhaal is het schema. Een contract dat een pagina de vorm geeft die ze nodig heeft, maakt een loader kort, en past de vorm niet, dan leg ik dat bij het backendteam neer, zodat de wijziging in het contract landt en elke client hem krijgt. Dat heb ik apart opgeschreven in ",
  },
  contractArticleLink: {
    en: "the article on GraphQL as a contract",
    nl: "het artikel over GraphQL als contract",
  },
  bol3After: {
    en: ".",
    nl: ".",
  },

  closingTitle: {
    en: "What to take away",
    nl: "Wat je meeneemt",
  },
  closing1: {
    en: "Ask who owns the truth about a value and the answer places it. The server owns the catalogue, the cart and the order, so a loader or a resource is where they arrive and a cache is what keeps one copy of each. The visitor owns the filter, the page and the search term, so the address holds them and a link carries them. The browser tab owns the open panel, the pending row, the checkout key and the token, and that list is short enough to read out loud.",
    nl: "Vraag wie de baas is over de waarheid van een waarde, en het antwoord zet hem op zijn plek. De server is de baas over de catalogus, de winkelwagen en de bestelling, dus daar komen een loader of een resource om de hoek kijken en houdt een cache er één kopie van bij. De bezoeker is de baas over het filter, de pagina en de zoekterm, dus die staan in het adres en reizen mee in een link. Het browsertabblad is de baas over het geopende paneel, de wachtende regel, de afrekensleutel en het token, en die lijst is kort genoeg om hardop voor te lezen.",
  },
  closing2Before: {
    en: "The Angular half of this leans on signals, and the question of where signals stop and streams start is the other half of the same conversation. That one has its own article, ",
    nl: "De Angular-helft hiervan leunt op signals, en de vraag waar signals ophouden en streams beginnen is de andere helft van hetzelfde gesprek. Daar staat een eigen artikel over, ",
  },
  rxjsArticleLink: {
    en: "on signals and RxJS in Angular",
    nl: "over signals en RxJS in Angular",
  },
  closing2After: {
    en: ", and the two together cover most of what a team asks me in the first week.",
    nl: ", en samen dekken die twee het meeste van wat een team mij in de eerste week vraagt.",
  },
  closing3: {
    en: "The exercise is worth an afternoon even if nothing changes afterwards. Three columns, every branch of the state tree in one of them, and a count at the bottom of the third. Whatever the answer turns out to be, it will be about something you can point at.",
    nl: "De oefening is een middag waard, ook als er daarna niets verandert. Drie kolommen, elke tak van de stateboom in een ervan, en onderaan de derde een telling. Wat het antwoord ook wordt, het gaat over iets waar je naar kunt wijzen.",
  },

  nodeScreen: { en: "One screen", nl: "Eén scherm" },
  nodeScreenSub: { en: "three kinds of state", nl: "drie soorten state" },
  nodeServerData: { en: "Server data", nl: "Serverdata" },
  nodeServerDataSub: { en: "products, cart, order", nl: "producten, wagen, bestelling" },
  nodeUrlState: { en: "State in the address", nl: "State in het adres" },
  nodeUrlStateSub: { en: "category, search, page", nl: "categorie, zoekterm, pagina" },
  nodeClientState: { en: "Client state", nl: "Clientstate" },
  nodeClientStateSub: { en: "panel, key, token", nl: "paneel, sleutel, token" },
  nodeHomeServer: { en: "loader and cache", nl: "loader en cache" },
  nodeHomeUrl: { en: "search parameters", nl: "zoekparameters" },
  nodeHomeUrlSub: { en: "one shareable link", nl: "één deelbare link" },
  nodeHomeClient: { en: "one signal, one fetcher", nl: "één signal, één fetcher" },
  nodeHomeClientSub: { en: "a few lines each", nl: "een paar regels elk" },
  edgeFromApi: { en: "from the API", nl: "van de API" },
  edgeVisitorChooses: { en: "the visitor chooses", nl: "de bezoeker kiest" },
  edgeThisBrowser: { en: "only this browser", nl: "alleen deze browser" },
  nodeSubmit: { en: "Form submit", nl: "Verzenden" },
  nodeActionSub: { en: "one urql mutation on the server", nl: "één urql-mutation op de server" },
  nodeApi: { en: "Zappy Mart API", nl: "Zappy Mart-API" },
  nodeApiSub: { en: "holds the cart", nl: "houdt de winkelwagen bij" },
  nodeRevalidate: { en: "Revalidation", nl: "De loaders opnieuw" },
  nodeRevalidateSub: { en: "every loader on the page", nl: "elke loader op de pagina" },
  nodeLoaderSub: { en: "one urql query on the server", nl: "één urql-query op de server" },
  nodeScreenAgain: { en: "Screen", nl: "Scherm" },
  nodeScreenAgainSub: { en: "renders loaderData", nl: "rendert loaderData" },
  edgeTheWrite: { en: "the write", nl: "de schrijfactie" },
  edgeOneRequest: { en: "one request", nl: "één verzoek" },
  edgeAnswered: { en: "answered", nl: "antwoord" },
  edgeRunsAgain: { en: "runs again", nl: "draait opnieuw" },
  edgeTheData: { en: "the data", nl: "de data" },
} as const;
