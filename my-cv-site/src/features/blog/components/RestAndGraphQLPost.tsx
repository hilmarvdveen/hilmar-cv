import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, Lead, UL, OL, LI, Strong, Quote, Divider, A, InlineCode } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FlowDiagram } from "./FlowDiagram";
import { Contents } from "./Contents";
import { PostRepository } from "./PostRepository";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "rest-and-graphql-idempotency-status-codes-when-to-use-which",
  category: "fundamentals",
  track: "fullstack",
  publishedDate: "2026-09-16",
  readingTimeMin: 44,
  title: {
    en: "REST or GraphQL: idempotency, status codes and the choice",
    nl: "REST of GraphQL: idempotentie, statuscodes en de keuze",
  },
  description: {
    en: "Which methods may be retried, which stage picks the status code, problem details in REST and the error envelope in GraphQL, with running code.",
    nl: "Welke methodes je opnieuw mag proberen, welke stap de statuscode kiest, problem details in REST en de foutenvelop in GraphQL, met draaiende code.",
  },
  excerpt: {
    en: "One web store, one application layer, two doors into it. This walks through HTTP methods and idempotency from RFC 9110, the status codes that matter and who chooses each, problem details from RFC 9457, and the GraphQL envelope with what the GraphQL over HTTP draft says about its status code. Then the same cart and checkout as REST in C#, Kotlin and Node.js, as GraphQL in the same three, and a React Router front that talks to both.",
    nl: "Eén webwinkel, één applicatielaag, twee deuren erheen. Dit loopt door HTTP-methodes en idempotentie uit RFC 9110, de statuscodes die ertoe doen en wie ze kiest, problem details uit RFC 9457, en de GraphQL-envelop met wat het GraphQL over HTTP-concept over de statuscode zegt. Daarna dezelfde winkelwagen en afrekening als REST in C#, Kotlin en Node.js, als GraphQL in dezelfde drie, en een React Router-winkel die met allebei praat.",
  },
  keywords: [
    "rest versus graphql when to use which",
    "http idempotent methods rfc 9110 safe methods",
    "http status codes 201 location 409 conflict 204",
    "problem details rfc 9457 application problem json",
    "graphql over http status code application graphql-response+json",
    "idempotency key mutation retry safe checkout",
    "etag if-none-match 304 conditional request caching",
  ],
};

type ReferenceRow = { term: string; cells: string[] };

function ReferenceTable({
  caption,
  columns,
  rows,
  minimumWidth,
}: {
  caption: string;
  columns: string[];
  rows: ReferenceRow[];
  minimumWidth: number;
}) {
  return (
    <div className="my-8 overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full border-collapse text-left text-sm" style={{ minWidth: minimumWidth }}>
        <caption className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm text-gray-600">
          {caption}
        </caption>
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((column) => (
              <th key={column} scope="col" className="px-4 py-3 font-semibold text-textMain">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.term} className="border-b border-gray-200 last:border-b-0">
              <th scope="row" className="px-4 py-3 align-top font-semibold text-gray-800">
                {row.term}
              </th>
              {row.cells.map((cell, position) => (
                <td key={`${row.term}-${columns[position + 1]}`} className="px-4 py-3 align-top text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function buildTwoShapes(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("client", copy.nodeClient[locale], { x: 300, y: 0 }, { tone: "blue", subtitle: copy.nodeClientSub[locale], direction: "TB", width: 260 }),
    flowNode("restPost", "POST /api/orders", { x: 0, y: 150 }, { tone: "emerald", subtitle: copy.nodeRestPostSub[locale], direction: "TB", width: 260 }),
    flowNode("graphPost", "POST /graphql", { x: 600, y: 150 }, { tone: "violet", subtitle: copy.nodeGraphPostSub[locale], direction: "TB", width: 260 }),
    flowNode("restAnswer", copy.nodeRestAnswer[locale], { x: 0, y: 300 }, { tone: "slate", subtitle: "Location: /api/orders/{id}", direction: "TB", width: 260 }),
    flowNode("graphAnswer", copy.nodeGraphAnswer[locale], { x: 600, y: 300 }, { tone: "slate", subtitle: copy.nodeGraphAnswerSub[locale], direction: "TB", width: 260 }),
    flowNode("useCase", "PlaceOrder", { x: 300, y: 460 }, { tone: "amber", subtitle: copy.nodeUseCaseSub[locale], direction: "TB", width: 260 }),
  ];
  const edges = [
    flowEdge("client", "restPost", { label: copy.edgeRestStyle[locale] }),
    flowEdge("client", "graphPost", { label: copy.edgeGraphStyle[locale] }),
    flowEdge("restPost", "restAnswer", { label: "201" }),
    flowEdge("graphPost", "graphAnswer", { label: "200" }),
    flowEdge("restAnswer", "useCase", { label: copy.edgeSameWork[locale] }),
    flowEdge("graphAnswer", "useCase", { label: copy.edgeSameWork[locale] }),
  ];
  return { nodes, edges };
}

function buildStatusStages(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("arrives", copy.stageArrives[locale], { x: 0, y: 0 }, { tone: "blue", subtitle: copy.stageArrivesSub[locale], direction: "LR", width: 200 }),
    flowNode("method", copy.stageMethod[locale], { x: 260, y: 0 }, { tone: "slate", subtitle: "405 + Allow", direction: "LR", width: 200 }),
    flowNode("media", copy.stageMedia[locale], { x: 520, y: 0 }, { tone: "slate", subtitle: "415", direction: "LR", width: 200 }),
    flowNode("authentication", copy.stageAuthentication[locale], { x: 780, y: 0 }, { tone: "slate", subtitle: "401, 403", direction: "LR", width: 200 }),
    flowNode("binding", copy.stageBinding[locale], { x: 260, y: 160 }, { tone: "slate", subtitle: "400", direction: "LR", width: 200 }),
    flowNode("validation", copy.stageValidation[locale], { x: 520, y: 160 }, { tone: "slate", subtitle: "422", direction: "LR", width: 200 }),
    flowNode("rules", copy.stageRules[locale], { x: 780, y: 160 }, { tone: "rose", subtitle: "404, 409, 410", direction: "LR", width: 200 }),
    flowNode("answer", copy.stageAnswer[locale], { x: 520, y: 320 }, { tone: "emerald", subtitle: "200, 201, 204, 304", direction: "LR", width: 200 }),
  ];
  const edges = [
    flowEdge("arrives", "method"),
    flowEdge("method", "media"),
    flowEdge("media", "authentication"),
    flowEdge("authentication", "binding", { dashed: true }),
    flowEdge("binding", "validation"),
    flowEdge("validation", "rules"),
    flowEdge("rules", "answer", { dashed: true }),
  ];
  return { nodes, edges };
}

function methodRows(locale: Locale): ReferenceRow[] {
  return METHOD_ROWS.map((row) => ({
    term: row.method,
    cells: [row.safe[locale], row.idempotent[locale], row.here[locale]],
  }));
}

function statusRows(locale: Locale): ReferenceRow[] {
  return STATUS_ROWS.map((row) => ({
    term: row.status,
    cells: [row.decidedBy[locale], row.when[locale]],
  }));
}

function decisionRows(locale: Locale): ReferenceRow[] {
  return DECISION_ROWS.map((row) => ({
    term: row.question[locale],
    cells: [row.rest[locale], row.graph[locale]],
  }));
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  const twoShapes = buildTwoShapes(locale);
  const stages = buildStatusStages(locale);

  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <P>{copy.intro1[locale]}</P>
      <P>{copy.intro2[locale]}</P>
      <P>{copy.versionNote[locale]}</P>
      <P>
        {copy.normativeNoteBefore[locale]}
        <A href="https://www.rfc-editor.org/rfc/rfc9110">RFC 9110</A>
        {copy.normativeNoteMiddle[locale]}
        <A href="https://www.rfc-editor.org/rfc/rfc9457">RFC 9457</A>
        {copy.normativeNoteAfter[locale]}
      </P>
      <Quote>{copy.quote[locale]}</Quote>
      <PostRepository
        locale={locale}
        folders={["backends/dotnet", "backends/kotlin", "backends/node", "frontends/react-router"]}
      />
      <Contents
        label={copy.contentsLabel[locale]}
        items={[
          copy.oneJobTitle[locale],
          copy.methodsTitle[locale],
          copy.statusTitle[locale],
          copy.problemTitle[locale],
          copy.overHttpTitle[locale],
          copy.keyTitle[locale],
          copy.cachingTitle[locale],
          copy.restFitsTitle[locale],
          copy.graphFitsTitle[locale],
          copy.restBuildTitle[locale],
          copy.graphBuildTitle[locale],
          copy.frontTitle[locale],
          copy.recordTitle[locale],
          copy.decisionTitle[locale],
          copy.closingTitle[locale],
        ]}
      />

      <H2>{copy.oneJobTitle[locale]}</H2>
      <P>{copy.oneJob1[locale]}</P>
      <P>{copy.oneJob2[locale]}</P>
      <UL>
        <LI>
          <Strong>{copy.restShapeLabel[locale]}</Strong> {copy.restShapeBody[locale]}
        </LI>
        <LI>
          <Strong>{copy.graphShapeLabel[locale]}</Strong> {copy.graphShapeBody[locale]}
        </LI>
      </UL>
      <P>{copy.oneJob3[locale]}</P>
      <FlowDiagram
        nodes={twoShapes.nodes}
        edges={twoShapes.edges}
        height={620}
        ariaLabel={copy.twoShapesAria[locale]}
        caption={copy.twoShapesCaption[locale]}
      />
      <P>{copy.oneJob4[locale]}</P>

      <H2>{copy.methodsTitle[locale]}</H2>
      <P>{copy.methods1[locale]}</P>
      <UL>
        <LI>
          <Strong>{copy.safeLabel[locale]}</Strong> {copy.safeBody[locale]}
        </LI>
        <LI>
          <Strong>{copy.idempotentLabel[locale]}</Strong> {copy.idempotentBody[locale]}
        </LI>
      </UL>
      <P>{copy.methods2[locale]}</P>
      <ReferenceTable
        caption={copy.methodTableCaption[locale]}
        columns={[
          copy.methodColumn[locale],
          copy.safeColumn[locale],
          copy.idempotentColumn[locale],
          copy.hereColumn[locale],
        ]}
        rows={methodRows(locale)}
        minimumWidth={760}
      />
      <P>{copy.methods3[locale]}</P>
      <CodeBlock lang="http" filename="DELETE twice, the same answer twice" code={DELETE_TWICE_CODE} />
      <P>{copy.methods4[locale]}</P>
      <Callout variant="warning" title={copy.methodsCalloutTitle[locale]}>
        {copy.methodsCalloutBody[locale]}
      </Callout>
      <P>{copy.methods5[locale]}</P>

      <H2>{copy.statusTitle[locale]}</H2>
      <P>{copy.status1[locale]}</P>
      <FlowDiagram
        nodes={stages.nodes}
        edges={stages.edges}
        height={520}
        ariaLabel={copy.stagesAria[locale]}
        caption={copy.stagesCaption[locale]}
      />
      <P>{copy.status2[locale]}</P>
      <ReferenceTable
        caption={copy.statusTableCaption[locale]}
        columns={[copy.statusColumn[locale], copy.decidedByColumn[locale], copy.whenColumn[locale]]}
        rows={statusRows(locale)}
        minimumWidth={860}
      />
      <P>{copy.status3[locale]}</P>
      <P>{copy.status4[locale]}</P>

      <Divider />

      <H2>{copy.problemTitle[locale]}</H2>
      <P>{copy.problem1[locale]}</P>
      <UL>
        <LI>
          <Strong>type</Strong> {copy.problemType[locale]}
        </LI>
        <LI>
          <Strong>title</Strong> {copy.problemTitleMember[locale]}
        </LI>
        <LI>
          <Strong>status</Strong> {copy.problemStatus[locale]}
        </LI>
        <LI>
          <Strong>detail</Strong> {copy.problemDetail[locale]}
        </LI>
        <LI>
          <Strong>instance</Strong> {copy.problemInstance[locale]}
        </LI>
      </UL>
      <P>{copy.problem2[locale]}</P>
      <CodeBlock lang="http" filename="POST /api/cart/lines, more than the stock" code={PROBLEM_CONFLICT_CODE} />
      <P>{copy.problem3[locale]}</P>
      <CodeBlock lang="csharp" filename="src/Zappy.Adapters.Rest/Failures.cs" code={FAILURES_CODE} />
      <P>{copy.problem4[locale]}</P>
      <Callout variant="info" title={copy.problemCalloutTitle[locale]}>
        {copy.problemCalloutBody[locale]}
      </Callout>

      <H2>{copy.overHttpTitle[locale]}</H2>
      <P>{copy.overHttp1[locale]}</P>
      <P>{copy.overHttp2[locale]}</P>
      <CodeBlock lang="http" filename="POST /graphql, a refusal inside a 200" code={GRAPHQL_REFUSAL_CODE} />
      <P>{copy.overHttp3[locale]}</P>
      <CodeBlock lang="http" filename="POST /graphql, a document the schema rejects" code={GRAPHQL_BAD_REQUEST_CODE} />
      <P>{copy.overHttp4[locale]}</P>
      <OL>
        <LI>{copy.overHttpRule1[locale]}</LI>
        <LI>{copy.overHttpRule2[locale]}</LI>
        <LI>{copy.overHttpRule3[locale]}</LI>
        <LI>{copy.overHttpRule4[locale]}</LI>
      </OL>
      <P>{copy.overHttp5[locale]}</P>
      <CodeBlock lang="ts" filename="frontends/react-router/app/graphql/client.server.ts" code={CLIENT_HEADERS_CODE} />
      <P>{copy.overHttp6[locale]}</P>

      <H2>{copy.keyTitle[locale]}</H2>
      <P>{copy.key1[locale]}</P>
      <CodeBlock lang="graphql" filename="contract/schema.graphql" code={SCHEMA_PLACE_ORDER_CODE} />
      <P>{copy.key2[locale]}</P>
      <CodeBlock
        lang="ts"
        filename="backends/node/subgraphs/ordering/src/application/idempotentPlaceOrder.ts"
        code={IDEMPOTENT_PLACE_ORDER_CODE}
      />
      <P>{copy.key3[locale]}</P>
      <CodeBlock lang="http" filename="POST /api/orders twice with one key" code={REPEAT_CHECKOUT_CODE} />
      <P>{copy.key4[locale]}</P>
      <Callout variant="tip" title={copy.keyCalloutTitle[locale]}>
        {copy.keyCalloutBody[locale]}
      </Callout>

      <H2>{copy.cachingTitle[locale]}</H2>
      <P>{copy.caching1[locale]}</P>
      <CodeBlock lang="csharp" filename="src/Zappy.Adapters.Rest/RestEndpoints.cs" code={CATEGORIES_ENDPOINT_CODE} />
      <P>{copy.caching2[locale]}</P>
      <CodeBlock lang="http" filename="GET /api/categories, then the same request again" code={CONDITIONAL_CODE} />
      <P>{copy.caching3[locale]}</P>
      <P>{copy.caching4[locale]}</P>

      <Divider />

      <H2>{copy.restFitsTitle[locale]}</H2>
      <P>{copy.restFits1[locale]}</P>
      <UL>
        <LI>
          <Strong>{copy.restFitsIdentityLabel[locale]}</Strong> {copy.restFitsIdentityBody[locale]}
        </LI>
        <LI>
          <Strong>{copy.restFitsPublicLabel[locale]}</Strong> {copy.restFitsPublicBody[locale]}
        </LI>
        <LI>
          <Strong>{copy.restFitsCacheLabel[locale]}</Strong> {copy.restFitsCacheBody[locale]}
        </LI>
        <LI>
          <Strong>{copy.restFitsFilesLabel[locale]}</Strong> {copy.restFitsFilesBody[locale]}
        </LI>
        <LI>
          <Strong>{copy.restFitsSimpleLabel[locale]}</Strong> {copy.restFitsSimpleBody[locale]}
        </LI>
      </UL>
      <P>{copy.restFits2[locale]}</P>

      <H2>{copy.graphFitsTitle[locale]}</H2>
      <P>{copy.graphFits1[locale]}</P>
      <UL>
        <LI>
          <Strong>{copy.graphFitsScreensLabel[locale]}</Strong> {copy.graphFitsScreensBody[locale]}
        </LI>
        <LI>
          <Strong>{copy.graphFitsShapeLabel[locale]}</Strong> {copy.graphFitsShapeBody[locale]}
        </LI>
        <LI>
          <Strong>{copy.graphFitsTeamsLabel[locale]}</Strong> {copy.graphFitsTeamsBody[locale]}
        </LI>
        <LI>
          <Strong>{copy.graphFitsPartialLabel[locale]}</Strong> {copy.graphFitsPartialBody[locale]}
        </LI>
      </UL>
      <P>
        {copy.graphFits2Before[locale]}
        <A href={`/${locale}/blog/graphql-as-a-contract-between-frontend-and-backend`}>
          {copy.contractArticleLink[locale]}
        </A>
        {copy.graphFits2After[locale]}
      </P>

      <Divider />

      <H2>{copy.restBuildTitle[locale]}</H2>
      <P>{copy.restBuild1[locale]}</P>
      <P>{copy.restBuild2[locale]}</P>
      <CodeBlock lang="shell" filename="a new inbound adapter beside the GraphQL one" code={REST_PROJECT_SETUP_CODE} />
      <P>{copy.restBuild3[locale]}</P>
      <CodeBlock lang="xml" filename="src/Zappy.Adapters.Rest/Zappy.Adapters.Rest.csproj" code={REST_PROJECT_FILE_CODE} />
      <P>{copy.restBuild4[locale]}</P>
      <CodeBlock lang="csharp" filename="src/Zappy.Adapters.Rest/VisitorOfTheRestRequest.cs" code={REST_VISITOR_CODE} />
      <P>{copy.restBuild5[locale]}</P>
      <CodeBlock lang="csharp" filename="src/Zappy.Adapters.Rest/Representations.cs" code={REPRESENTATIONS_CODE} />
      <P>{copy.restBuild6[locale]}</P>
      <CodeBlock lang="csharp" filename="src/Zappy.Adapters.Rest/RestEndpoints.cs" code={REST_ENDPOINTS_CODE} />
      <P>{copy.restBuild7[locale]}</P>
      <CodeBlock lang="csharp" filename="src/Zappy.Host/Program.cs" code={HOST_WIRING_CODE} />
      <P>{copy.restBuild8[locale]}</P>
      <CodeBlock lang="shell" filename="build and run" code={RUN_COMMANDS_CODE} />
      <P>{copy.restBuild9[locale]}</P>
      <CodeBlock lang="http" filename="the five routes, one request each" code={REST_TRANSCRIPT_CODE} />
      <P>{copy.restBuild10[locale]}</P>
      <CodeBlock
        lang="csharp"
        filename="tests/Zappy.Adapters.Tests/CartAndOrdersOverRestTests.cs"
        code={REST_TESTS_CODE}
      />
      <P>{copy.restBuild11[locale]}</P>
      <CodeBlock lang="shell" filename="the test run" code={TEST_RUN_CODE} />
      <P>{copy.restBuild12[locale]}</P>
      <CodeBlock
        lang="kotlin"
        filename="zappy-adapters/src/main/kotlin/nl/zappymart/adapters/rest/CartRestController.kt"
        code={KOTLIN_REST_CODE}
      />
      <P>{copy.restBuild13[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/ordering/src/adapters/rest/orderRoutes.ts" code={NODE_REST_CODE} />
      <P>{copy.restBuild14[locale]}</P>

      <Divider />

      <H2>{copy.graphBuildTitle[locale]}</H2>
      <P>{copy.graphBuild1[locale]}</P>
      <CodeBlock lang="graphql" filename="contract/schema.graphql" code={SCHEMA_CART_CODE} />
      <P>{copy.graphBuild2[locale]}</P>
      <CodeBlock lang="csharp" filename="src/Zappy.Adapters.GraphQL/Mutation.cs" code={CSHARP_MUTATION_CODE} />
      <P>{copy.graphBuild3[locale]}</P>
      <CodeBlock
        lang="kotlin"
        filename="zappy-adapters/src/main/kotlin/nl/zappymart/adapters/graphql/OrderController.kt"
        code={KOTLIN_ORDER_CONTROLLER_CODE}
      />
      <P>{copy.graphBuild4[locale]}</P>
      <CodeBlock
        lang="ts"
        filename="backends/node/subgraphs/ordering/src/adapters/graphql/resolvers.ts"
        code={NODE_RESOLVERS_CODE}
      />
      <P>{copy.graphBuild5[locale]}</P>

      <H2>{copy.frontTitle[locale]}</H2>
      <P>
        {copy.front1Before[locale]}
        <A href={`/${locale}/blog/react-router-remix-routes-loaders-actions-folder-structure`}>
          {copy.routingArticleLink[locale]}
        </A>
        {copy.front1After[locale]}
      </P>
      <CodeBlock lang="ts" filename="frontends/react-router/app/routes/checkout.tsx" code={CHECKOUT_ROUTE_CODE} />
      <P>{copy.front2[locale]}</P>
      <CodeBlock lang="ts" filename="frontends/react-router/app/store/userErrors.ts" code={USER_ERRORS_CODE} />
      <P>{copy.front3[locale]}</P>
      <CodeBlock lang="ts" filename="app/routes/checkout.tsx, the REST version" code={CHECKOUT_REST_CODE} />
      <P>{copy.front4[locale]}</P>
      <P>{copy.front5[locale]}</P>

      <Divider />

      <H2>{copy.recordTitle[locale]}</H2>
      <P>{copy.record1[locale]}</P>
      <P>{copy.record2[locale]}</P>
      <P>
        {copy.record3Before[locale]}
        <A href={`/${locale}/blog/building-an-api-in-csharp`}>{copy.apiArticleLink[locale]}</A>
        {copy.record3After[locale]}
      </P>

      <H2>{copy.decisionTitle[locale]}</H2>
      <P>{copy.decision1[locale]}</P>
      <ReferenceTable
        caption={copy.decisionTableCaption[locale]}
        columns={[copy.questionColumn[locale], "REST", "GraphQL"]}
        rows={decisionRows(locale)}
        minimumWidth={860}
      />
      <P>{copy.decision2[locale]}</P>

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
      <P>
        {copy.closing3Before[locale]}
        <InlineCode>Idempotency-Key</InlineCode>
        {copy.closing3After[locale]}
      </P>
    </>
  );
}

const DELETE_TWICE_CODE = `DELETE /api/cart/lines/01a085f904dd7b15a60e53c775929665 HTTP/1.1

HTTP/1.1 204 No Content

DELETE /api/cart/lines/01a085f904dd7b15a60e53c775929665 HTTP/1.1

HTTP/1.1 204 No Content`;

const PROBLEM_CONFLICT_CODE = `POST /api/cart/lines HTTP/1.1
Content-Type: application/json

{"productId":"product-03","quantity":99}

HTTP/1.1 409 Conflict
Content-Type: application/problem+json

{
  "type": "https://zappymart.example/problems/out-of-stock",
  "title": "The state of the store refuses this",
  "status": 409,
  "detail": "Mens Cotton Jacket has 8 in stock and 99 were asked for.",
  "instance": "/api/cart/lines",
  "code": "OUT_OF_STOCK",
  "field": "quantity",
  "errors": [
    {
      "code": "OUT_OF_STOCK",
      "message": "Mens Cotton Jacket has 8 in stock and 99 were asked for.",
      "field": "quantity"
    }
  ]
}`;

const FAILURES_CODE = `using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Zappy.Domain;

namespace Zappy.Adapters.Rest;

public static class Failures
{
    private const string ProblemTypePrefix = "https://zappymart.example/problems/";

    public static ProblemHttpResult From(IReadOnlyList<UserError> errors, HttpContext context)
    {
        var first = errors[0];
        var status = StatusFor(first.Code);
        return TypedResults.Problem(
            detail: first.Message,
            instance: context.Request.Path,
            statusCode: status,
            title: TitleFor(status),
            type: ProblemTypePrefix + Slug(first.Code),
            extensions: new Dictionary<string, object?>
            {
                ["code"] = ContractNameOf(first.Code),
                ["field"] = first.Field,
                ["errors"] = errors
                    .Select(error => new { code = ContractNameOf(error.Code), message = error.Message, field = error.Field })
                    .ToList()
            });
    }

    public static ProblemHttpResult NotFound(HttpContext context, UserErrorCode code, string message) =>
        From([new UserError(code, message)], context);

    public static int StatusFor(UserErrorCode code) => code switch
    {
        UserErrorCode.NotAuthenticated => StatusCodes.Status401Unauthorized,
        UserErrorCode.SessionInvalid => StatusCodes.Status401Unauthorized,
        UserErrorCode.CredentialsInvalid => StatusCodes.Status401Unauthorized,
        UserErrorCode.ProductNotFound => StatusCodes.Status404NotFound,
        UserErrorCode.CartLineNotFound => StatusCodes.Status404NotFound,
        UserErrorCode.OrderNotFound => StatusCodes.Status404NotFound,
        UserErrorCode.SessionNotFound => StatusCodes.Status404NotFound,
        UserErrorCode.OutOfStock => StatusCodes.Status409Conflict,
        UserErrorCode.CartEmpty => StatusCodes.Status409Conflict,
        UserErrorCode.CodeExpired => StatusCodes.Status409Conflict,
        UserErrorCode.CodeExhausted => StatusCodes.Status409Conflict,
        UserErrorCode.CodeMinimumNotMet => StatusCodes.Status409Conflict,
        UserErrorCode.EmailTaken => StatusCodes.Status409Conflict,
        UserErrorCode.RateLimited => StatusCodes.Status429TooManyRequests,
        _ => StatusCodes.Status422UnprocessableEntity
    };

    private static string TitleFor(int status) => status switch
    {
        StatusCodes.Status401Unauthorized => "Not authenticated",
        StatusCodes.Status404NotFound => "Not found",
        StatusCodes.Status409Conflict => "The state of the store refuses this",
        StatusCodes.Status429TooManyRequests => "Too many attempts",
        _ => "The request could not be processed"
    };

    private static string ContractNameOf(UserErrorCode code) =>
        string.Concat(code.ToString().Select(Underscored)).TrimStart('_').ToUpperInvariant();

    private static string Slug(UserErrorCode code) => ContractNameOf(code).ToLowerInvariant().Replace('_', '-');

    private static string Underscored(char letter) => char.IsUpper(letter) ? "_" + letter : letter.ToString();
}`;

const GRAPHQL_REFUSAL_CODE = `POST /graphql HTTP/1.1
Content-Type: application/json
Accept: application/graphql-response+json, application/json

{"query":"mutation { addToCart(productId: \\"product-03\\", quantity: 99) { cart { total { amount } } availableStock errors { code message field } } }"}

HTTP/1.1 200 OK
Content-Type: application/graphql-response+json; charset=utf-8

{
  "data": {
    "addToCart": {
      "cart": { "total": { "amount": 0 } },
      "availableStock": 8,
      "errors": [
        {
          "code": "OUT_OF_STOCK",
          "message": "Mens Cotton Jacket has 8 in stock and 99 were asked for.",
          "field": "quantity"
        }
      ]
    }
  }
}`;

const GRAPHQL_BAD_REQUEST_CODE = `POST /graphql HTTP/1.1
Content-Type: application/json
Accept: application/graphql-response+json, application/json

{"query":"{ cart { id } unknownField }"}

HTTP/1.1 400 Bad Request
Content-Type: application/graphql-response+json; charset=utf-8

{
  "errors": [
    {
      "message": "The field \`unknownField\` does not exist on the type \`Query\`.",
      "locations": [{ "line": 1, "column": 15 }],
      "extensions": {
        "type": "Query",
        "field": "unknownField",
        "responseName": "unknownField",
        "specifiedBy": "https://spec.graphql.org/September2025/#sec-Field-Selections"
      }
    }
  ]
}`;

const CLIENT_HEADERS_CODE = `function buildHeaders(credentials: StoreCredentials): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/graphql-response+json, application/json",
    Origin: storeFrontOrigin(),
  };
  if (credentials.accessToken !== null) {
    headers.Authorization = \`Bearer \${credentials.accessToken}\`;
  }
  const cookieHeader = buildCookieHeader({
    [cartCookieName]: credentials.cartCookie,
    [refreshCookieName]: credentials.refreshCookie,
  });
  if (cookieHeader !== null) {
    headers.Cookie = cookieHeader;
  }
  return headers;
}`;

const SCHEMA_PLACE_ORDER_CODE = `"""
Places an order from the signed in customer's cart and empties the
cart. It needs a signed in customer and answers \`NOT_AUTHENTICATED\`
otherwise, a cart with at least one line and \`CART_EMPTY\` otherwise,
and stock for every line and \`OUT_OF_STOCK\` otherwise. Reserving stock
is all or nothing: when one line cannot be reserved, no order is placed
and no stock moves.
"""
placeOrder(
  """
  A value the client makes up once per checkout attempt, so that a
  retry after a lost answer does not place a second order. The
  federated backend stores it with the order and answers with the order
  it already placed when the same key comes back. The monoliths in
  \`backends/\` accept this argument and ignore it, because one database
  transaction already makes their checkout atomic, and they answer a
  second call with \`CART_EMPTY\`.
  """
  idempotencyKey: String
): OrderPayload!`;

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

const REPEAT_CHECKOUT_CODE = `POST /api/orders HTTP/1.1
Authorization: Bearer <access token>
Idempotency-Key: checkout-1

HTTP/1.1 201 Created
Location: /api/orders/01a085fa235d7616a78e4ecb4c19964f
Content-Type: application/json; charset=utf-8

{"id":"01a085fa235d7616a78e4ecb4c19964f","number":"ZAPPY-20260909-01A085","status":"PAID", ... }

POST /api/orders HTTP/1.1
Authorization: Bearer <access token>
Idempotency-Key: checkout-1

HTTP/1.1 409 Conflict
Content-Type: application/problem+json

{
  "type": "https://zappymart.example/problems/cart-empty",
  "title": "The state of the store refuses this",
  "status": 409,
  "detail": "The cart has no lines, so there is nothing to order.",
  "instance": "/api/orders",
  "code": "CART_EMPTY",
  "field": null
}`;

const CATEGORIES_ENDPOINT_CODE = `api.MapGet("/categories", async Task<Results<Ok<IReadOnlyList<CategoryRepresentation>>, StatusCodeHttpResult>> (
    HttpContext context,
    ListCategories listCategories,
    CancellationToken cancellationToken) =>
{
    var categories = (await listCategories.Execute(cancellationToken))
        .Select(CategoryRepresentation.Of)
        .ToList();

    var entityTag = EntityTagFor(categories);
    context.Response.Headers.ETag = entityTag;
    context.Response.Headers.CacheControl = "public, max-age=60";

    return context.Request.Headers.IfNoneMatch.Contains(entityTag)
        ? TypedResults.StatusCode(StatusCodes.Status304NotModified)
        : TypedResults.Ok<IReadOnlyList<CategoryRepresentation>>(categories);
});

private static string EntityTagFor<TRepresentation>(TRepresentation representation)
{
    var json = JsonSerializer.SerializeToUtf8Bytes(representation);
    return $"\\"{Convert.ToHexStringLower(SHA256.HashData(json).AsSpan(0, 8))}\\"";
}`;

const CONDITIONAL_CODE = `GET /api/categories HTTP/1.1

HTTP/1.1 200 OK
ETag: "e6d46a844e75c9e8"
Cache-Control: public, max-age=60
Content-Type: application/json; charset=utf-8

[{"id":"category-mens-clothing","name":"Men's clothing","slug":"mens-clothing"}, ... ]

GET /api/categories HTTP/1.1
If-None-Match: "e6d46a844e75c9e8"

HTTP/1.1 304 Not Modified
ETag: "e6d46a844e75c9e8"
Cache-Control: public, max-age=60`;

const REST_PROJECT_SETUP_CODE = `git clone https://github.com/hilmarvdveen/zappy-mart.git
cd zappy-mart/backends/dotnet

dotnet new classlib --output src/Zappy.Adapters.Rest --framework net10.0
dotnet sln add src/Zappy.Adapters.Rest/Zappy.Adapters.Rest.csproj
dotnet add src/Zappy.Host reference src/Zappy.Adapters.Rest

rm src/Zappy.Adapters.Rest/Class1.cs`;

const REST_PROJECT_FILE_CODE = `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <RootNamespace>Zappy.Adapters.Rest</RootNamespace>
  </PropertyGroup>

  <ItemGroup>
    <FrameworkReference Include="Microsoft.AspNetCore.App" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\\Zappy.Application\\Zappy.Application.csproj" />
  </ItemGroup>

</Project>`;

const REST_VISITOR_CODE = `using Microsoft.AspNetCore.Http;
using Zappy.Application;

namespace Zappy.Adapters.Rest;

public static class VisitorOfTheRestRequest
{
    public const string CartCookie = "zappy_cart";

    private static readonly TimeSpan HowLongACartCookieLives = TimeSpan.FromDays(30);

    public static Visitor Of(HttpContext context) =>
        new(
            context.User.FindFirst("sub")?.Value,
            context.User.FindFirst("sid")?.Value,
            context.Request.Cookies[CartCookie]);

    public static void RememberCart(HttpContext context, string cartId)
    {
        if (context.Request.Cookies[CartCookie] == cartId)
        {
            return;
        }

        context.Response.Cookies.Append(CartCookie, cartId, new CookieOptions
        {
            HttpOnly = true,
            Secure = context.Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Path = "/",
            Expires = DateTimeOffset.UtcNow.Add(HowLongACartCookieLives)
        });
    }
}`;

const REPRESENTATIONS_CODE = `using Zappy.Domain;

namespace Zappy.Adapters.Rest;

public sealed record AddCartLineRequest(string ProductId, int? Quantity);

public sealed record CategoryRepresentation(string Id, string Name, string Slug)
{
    public static CategoryRepresentation Of(Category category) =>
        new(category.Id, category.Name, category.Slug);
}

public sealed record MoneyRepresentation(int Amount, string Currency)
{
    public static MoneyRepresentation Of(Money money) => new(money.Amount, money.Currency);
}

public sealed record CartLineRepresentation(
    string Id,
    string ProductId,
    string ProductName,
    int Quantity,
    MoneyRepresentation LineTotal)
{
    public static CartLineRepresentation Of(CartLine line) =>
        new(line.Id, line.ProductId, line.Product.Name, line.Quantity, MoneyRepresentation.Of(line.LineTotal));
}

public sealed record CartRepresentation(
    string Id,
    IReadOnlyList<CartLineRepresentation> Lines,
    string? PromotionCode,
    MoneyRepresentation Subtotal,
    MoneyRepresentation Discount,
    MoneyRepresentation Shipping,
    MoneyRepresentation Total)
{
    public static CartRepresentation Of(Cart cart)
    {
        var totals = cart.Totals;
        return new CartRepresentation(
            cart.Id,
            cart.Lines.Select(CartLineRepresentation.Of).ToList(),
            cart.AppliedPromotionCode?.Code,
            MoneyRepresentation.Of(totals.Subtotal),
            MoneyRepresentation.Of(totals.Discount),
            MoneyRepresentation.Of(totals.Shipping),
            MoneyRepresentation.Of(totals.Total));
    }
}

public sealed record OrderLineRepresentation(
    string ProductId,
    string ProductName,
    int Quantity,
    MoneyRepresentation UnitPrice,
    MoneyRepresentation LineTotal)
{
    public static OrderLineRepresentation Of(OrderLine line) =>
        new(
            line.ProductId,
            line.ProductName,
            line.Quantity,
            MoneyRepresentation.Of(line.UnitPrice),
            MoneyRepresentation.Of(line.LineTotal));
}

public sealed record OrderRepresentation(
    string Id,
    string Number,
    string Status,
    IReadOnlyList<OrderLineRepresentation> Lines,
    string? PromotionCode,
    MoneyRepresentation Subtotal,
    MoneyRepresentation Discount,
    MoneyRepresentation Shipping,
    MoneyRepresentation Total,
    DateTimeOffset PlacedAt)
{
    public static OrderRepresentation Of(Order order) =>
        new(
            order.Id,
            order.Number,
            order.Status.ToString().ToUpperInvariant(),
            order.Lines.Select(OrderLineRepresentation.Of).ToList(),
            order.PromotionCode,
            MoneyRepresentation.Of(order.Subtotal),
            MoneyRepresentation.Of(order.Discount),
            MoneyRepresentation.Of(order.Shipping),
            MoneyRepresentation.Of(order.Total),
            order.PlacedAt);
}`;

const REST_ENDPOINTS_CODE = `using System.Security.Cryptography;
using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Routing;
using Zappy.Application;
using Zappy.Domain;

namespace Zappy.Adapters.Rest;

public static class RestEndpoints
{
    public const string IdempotencyKeyHeader = "Idempotency-Key";

    public static IEndpointRouteBuilder MapZappyRest(this IEndpointRouteBuilder routes)
    {
        var api = routes.MapGroup("/api");

        api.MapGet("/cart", async Task<Ok<CartRepresentation>> (
            HttpContext context,
            ReadCart readCart,
            CancellationToken cancellationToken) =>
        {
            var cart = await readCart.Execute(VisitorOfTheRestRequest.Of(context), cancellationToken);
            return TypedResults.Ok(CartRepresentation.Of(cart));
        });

        api.MapPost("/cart/lines", async Task<Results<Created<CartRepresentation>, ProblemHttpResult>> (
            AddCartLineRequest body,
            HttpContext context,
            AddToCart addToCart,
            CancellationToken cancellationToken) =>
        {
            var result = await addToCart.Execute(
                VisitorOfTheRestRequest.Of(context),
                body.ProductId,
                body.Quantity,
                cancellationToken);

            if (result.Errors.Count > 0)
            {
                return Failures.From(result.Errors, context);
            }

            VisitorOfTheRestRequest.RememberCart(context, result.Cart.Id);
            var line = result.Cart.Lines.Single(one => one.ProductId == body.ProductId);
            return TypedResults.Created($"/api/cart/lines/{line.Id}", CartRepresentation.Of(result.Cart));
        });

        api.MapDelete("/cart/lines/{lineId}", async Task<Results<NoContent, ProblemHttpResult>> (
            string lineId,
            HttpContext context,
            RemoveCartLine removeCartLine,
            CancellationToken cancellationToken) =>
        {
            var result = await removeCartLine.Execute(
                VisitorOfTheRestRequest.Of(context),
                lineId,
                cancellationToken);

            VisitorOfTheRestRequest.RememberCart(context, result.Cart.Id);
            var refusedForAnotherReason = result.Errors
                .Where(error => error.Code != UserErrorCode.CartLineNotFound)
                .ToList();

            return refusedForAnotherReason.Count > 0
                ? Failures.From(refusedForAnotherReason, context)
                : TypedResults.NoContent();
        });

        api.MapPost("/orders", async Task<Results<Created<OrderRepresentation>, ProblemHttpResult>> (
            HttpContext context,
            PlaceOrder placeOrder,
            CancellationToken cancellationToken) =>
        {
            var result = await placeOrder.Execute(
                VisitorOfTheRestRequest.Of(context),
                context.Request.Headers[IdempotencyKeyHeader],
                cancellationToken);

            if (result.Value is null)
            {
                return Failures.From(result.Errors, context);
            }

            return TypedResults.Created($"/api/orders/{result.Value.Id}", OrderRepresentation.Of(result.Value));
        });

        api.MapGet("/orders/{orderId}", async Task<Results<Ok<OrderRepresentation>, ProblemHttpResult>> (
            string orderId,
            HttpContext context,
            FindOrder findOrder,
            CancellationToken cancellationToken) =>
        {
            var order = await findOrder.Execute(VisitorOfTheRestRequest.Of(context), orderId, cancellationToken);
            return order is null
                ? Failures.NotFound(context, UserErrorCode.OrderNotFound, "No order with that id belongs to you.")
                : TypedResults.Ok(OrderRepresentation.Of(order));
        });

        return routes;
    }
}`;

const HOST_WIRING_CODE = `using Zappy.Adapters.GraphQL;
using Zappy.Adapters.Rest;

var application = builder.Build();

application.UseAuthentication();
application.UseAuthorization();
application.UseMiddleware<OriginCheck>();

application.MapGraphQL(application.Services.GetRequiredService<GraphQLSettings>().Path);

application.MapZappyRest();

await application.RunAsync();`;

const RUN_COMMANDS_CODE = `dotnet build
dotnet run --project src/Zappy.Host

# the store is on http://localhost:8090
# GraphQL at /graphql, the REST facet at /api`;

const REST_TRANSCRIPT_CODE = `GET /api/cart HTTP/1.1

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"id":"01a085f901fc768c80d27da271333895","lines":[],"promotionCode":null,
 "subtotal":{"amount":0,"currency":"EUR"},"discount":{"amount":0,"currency":"EUR"},
 "shipping":{"amount":0,"currency":"EUR"},"total":{"amount":0,"currency":"EUR"}}

POST /api/cart/lines HTTP/1.1
Content-Type: application/json

{"productId":"product-18","quantity":2}

HTTP/1.1 201 Created
Location: /api/cart/lines/01a085f904dd7b15a60e53c775929665
Set-Cookie: zappy_cart=01a085f9026a728e9ed99ee613eb08d1; path=/; samesite=lax; httponly
Content-Type: application/json; charset=utf-8

{"id":"01a085f9026a728e9ed99ee613eb08d1","lines":[{"id":"01a085f904dd7b15a60e53c775929665",
 "productId":"product-18","productName":"MBJ Women's Solid Short Sleeve Boat Neck V",
 "quantity":2,"lineTotal":{"amount":1970,"currency":"EUR"}}],"promotionCode":null,
 "subtotal":{"amount":1970,"currency":"EUR"},"discount":{"amount":0,"currency":"EUR"},
 "shipping":{"amount":495,"currency":"EUR"},"total":{"amount":2465,"currency":"EUR"}}

POST /api/orders HTTP/1.1

HTTP/1.1 401 Unauthorized
Content-Type: application/problem+json

{"type":"https://zappymart.example/problems/not-authenticated","title":"Not authenticated",
 "status":401,"detail":"This operation needs a signed in customer.","instance":"/api/orders",
 "code":"NOT_AUTHENTICATED","field":null}

POST /api/orders HTTP/1.1
Authorization: Bearer <access token>
Idempotency-Key: checkout-1

HTTP/1.1 201 Created
Location: /api/orders/01a085fa235d7616a78e4ecb4c19964f
Content-Type: application/json; charset=utf-8

{"id":"01a085fa235d7616a78e4ecb4c19964f","number":"ZAPPY-20260909-01A085","status":"PAID",
 "lines":[{"productId":"product-18","productName":"MBJ Women's Solid Short Sleeve Boat Neck V",
 "quantity":2,"unitPrice":{"amount":985,"currency":"EUR"},
 "lineTotal":{"amount":1970,"currency":"EUR"}}],"promotionCode":null,
 "subtotal":{"amount":1970,"currency":"EUR"},"discount":{"amount":0,"currency":"EUR"},
 "shipping":{"amount":495,"currency":"EUR"},"total":{"amount":2465,"currency":"EUR"},
 "placedAt":"2026-09-09T11:42:37.9161275+00:00"}

GET /api/orders/01a085fa235d7616a78e4ecb4c19964f HTTP/1.1
Authorization: Bearer <access token>

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"id":"01a085fa235d7616a78e4ecb4c19964f","number":"ZAPPY-20260909-01A085","status":"PAID", ... }`;

const REST_TESTS_CODE = `using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace Zappy.Adapters.Tests;

public sealed class CartAndOrdersOverRestTests(ZappyServer server) : IClassFixture<ZappyServer>
{
    [Fact]
    public async Task AddingALineAnswers201WithTheLineInTheLocationHeader()
    {
        var visitor = await AFreshVisitor();

        var added = await AddTwoShirts(visitor, null);

        Assert.Equal(HttpStatusCode.Created, added.Status);
        Assert.StartsWith("/api/cart/lines/", added.Location!, StringComparison.Ordinal);
    }

    [Fact]
    public async Task DeletingTheSameLineTwiceAnswers204Twice()
    {
        var visitor = await AFreshVisitor();
        var added = await AddTwoShirts(visitor, null);

        var first = await Send(visitor, HttpMethod.Delete, added.Location!, null, null);
        var second = await Send(visitor, HttpMethod.Delete, added.Location!, null, null);

        Assert.Equal(HttpStatusCode.NoContent, first.Status);
        Assert.Equal(HttpStatusCode.NoContent, second.Status);
    }

    [Fact]
    public async Task AskingForMoreThanTheStockAnswers409AsProblemDetails()
    {
        var visitor = await AFreshVisitor();

        var refused = await Send(
            visitor,
            HttpMethod.Post,
            "/api/cart/lines",
            JsonContent.Create(new { productId = "product-03", quantity = 99 }),
            null);

        Assert.Equal(HttpStatusCode.Conflict, refused.Status);
        Assert.Equal("application/problem+json", refused.MediaType);
        Assert.Equal(409, refused.Body.GetProperty("status").GetInt32());
        Assert.Equal("OUT_OF_STOCK", refused.Body.GetProperty("code").GetString());
        Assert.Equal("quantity", refused.Body.GetProperty("field").GetString());
        Assert.Equal("/api/cart/lines", refused.Body.GetProperty("instance").GetString());
    }

    [Fact]
    public async Task PlacingAnOrderWithoutASignedInCustomerAnswers401()
    {
        var visitor = await AFreshVisitor();
        await AddTwoShirts(visitor, null);

        var refused = await Send(visitor, HttpMethod.Post, "/api/orders", null, null);

        Assert.Equal(HttpStatusCode.Unauthorized, refused.Status);
        Assert.Equal("NOT_AUTHENTICATED", refused.Body.GetProperty("code").GetString());
    }

    [Fact]
    public async Task PlacingAnOrderAnswers201AndTheOrderIsReadableAtItsLocation()
    {
        var visitor = await AFreshVisitor();
        var accessToken = await SignIn(visitor);
        await AddTwoShirts(visitor, accessToken);

        var placed = await Send(visitor, HttpMethod.Post, "/api/orders", null, accessToken);
        var read = await Send(visitor, HttpMethod.Get, placed.Location!, null, accessToken);

        Assert.Equal(HttpStatusCode.Created, placed.Status);
        Assert.StartsWith("/api/orders/", placed.Location!, StringComparison.Ordinal);
        Assert.Equal(HttpStatusCode.OK, read.Status);
        Assert.Equal("PAID", read.Body.GetProperty("status").GetString());
        Assert.Equal(1970, read.Body.GetProperty("subtotal").GetProperty("amount").GetInt32());
        Assert.Equal(2465, read.Body.GetProperty("total").GetProperty("amount").GetInt32());
    }

    [Fact]
    public async Task RepeatingTheCheckoutAnswers409BecauseTheCartIsEmpty()
    {
        var visitor = await AFreshVisitor();
        var accessToken = await SignIn(visitor);
        await AddTwoShirts(visitor, accessToken);
        var first = await Send(visitor, HttpMethod.Post, "/api/orders", null, accessToken);

        var second = await Send(visitor, HttpMethod.Post, "/api/orders", null, accessToken);

        Assert.Equal(HttpStatusCode.Created, first.Status);
        Assert.Equal(HttpStatusCode.Conflict, second.Status);
        Assert.Equal("CART_EMPTY", second.Body.GetProperty("code").GetString());
    }

    [Fact]
    public async Task AnotherVisitorsOrderAnswers404()
    {
        var visitor = await AFreshVisitor();
        var accessToken = await SignIn(visitor);
        await AddTwoShirts(visitor, accessToken);
        var placed = await Send(visitor, HttpMethod.Post, "/api/orders", null, accessToken);

        var read = await Send(visitor, HttpMethod.Get, placed.Location!, null, null);

        Assert.Equal(HttpStatusCode.NotFound, read.Status);
        Assert.Equal("ORDER_NOT_FOUND", read.Body.GetProperty("code").GetString());
    }

    [Fact]
    public async Task TheCatalogueAnswersAnEntityTagAndThen304()
    {
        var visitor = await AFreshVisitor();

        var first = await Send(visitor, HttpMethod.Get, "/api/categories", null, null);
        var again = await Send(visitor, HttpMethod.Get, "/api/categories", null, null, first.EntityTag);

        Assert.Equal(HttpStatusCode.OK, first.Status);
        Assert.NotNull(first.EntityTag);
        Assert.Equal(HttpStatusCode.NotModified, again.Status);
    }

    private Task<Answer> AddTwoShirts(HttpClient visitor, string? accessToken) =>
        Send(
            visitor,
            HttpMethod.Post,
            "/api/cart/lines",
            JsonContent.Create(new { productId = "product-18", quantity = 2 }),
            accessToken);

    private static async Task<Answer> Send(
        HttpClient visitor,
        HttpMethod method,
        string path,
        HttpContent? content,
        string? accessToken,
        string? ifNoneMatch = null)
    {
        using var request = new HttpRequestMessage(method, path) { Content = content };

        if (accessToken is not null)
        {
            request.Headers.Add("Authorization", $"Bearer {accessToken}");
        }

        if (ifNoneMatch is not null)
        {
            request.Headers.Add("If-None-Match", ifNoneMatch);
        }

        using var response = await visitor.SendAsync(request, TestContext.Current.CancellationToken);
        var text = await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken);
        return new Answer(
            response.StatusCode,
            response.Headers.Location?.OriginalString,
            response.Content.Headers.ContentType?.MediaType,
            response.Headers.ETag?.ToString(),
            text.Length == 0 ? default : JsonDocument.Parse(text).RootElement.Clone());
    }

    private sealed record Answer(
        HttpStatusCode Status,
        string? Location,
        string? MediaType,
        string? EntityTag,
        JsonElement Body);

    private async Task<string> SignIn(HttpClient visitor) =>
        (await server.Ask(visitor, TheLogin)).Text("data", "login", "accessToken");

    private async Task<HttpClient> AFreshVisitor()
    {
        var visitor = server.AVisitor();
        await server.Ask(visitor, "mutation { resetSeed { success } }");
        return visitor;
    }

    private const string TheLogin =
        "mutation { login(input: { email: \\"jane@example.com\\", password: \\"correct horse battery staple\\" }) "
        + "{ accessToken errors { code } } }";
}`;

const TEST_RUN_CODE = `$ dotnet test tests/Zappy.Adapters.Tests

=== TEST EXECUTION SUMMARY ===
   Zappy.Adapters.Tests  Total: 8, Errors: 0, Failed: 0, Skipped: 0, Not Run: 0, Time: 12.852s`;

const KOTLIN_REST_CODE = `package nl.zappymart.adapters.rest

import nl.zappymart.application.cart.AddToCart
import nl.zappymart.application.cart.CartChange
import nl.zappymart.application.cart.RemoveCartLine
import nl.zappymart.application.ordering.PlaceOrder
import nl.zappymart.domain.shared.Result
import nl.zappymart.domain.shared.UserError
import nl.zappymart.domain.shared.UserErrorCode
import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.util.UriComponentsBuilder
import java.net.URI

data class AddCartLineRequest(val productId: String, val quantity: Int = 1)

@RestController
@RequestMapping("/api")
class CartRestController(
    private val addToCart: AddToCart,
    private val removeCartLine: RemoveCartLine,
    private val placeOrder: PlaceOrder,
) {

    @PostMapping("/cart/lines")
    fun addLine(
        @RequestBody body: AddCartLineRequest,
        visitorOfTheRequest: VisitorOfTheRestRequest,
    ): ResponseEntity<Any> {
        val change = addToCart.execute(visitorOfTheRequest.visitor, body.productId, body.quantity)
        if (change.errors.isNotEmpty()) {
            return problem(change.errors, "/api/cart/lines")
        }
        val line = change.cart.lines.first { it.productId == body.productId }
        return ResponseEntity.created(location("/api/cart/lines/\${line.id}"))
            .body(CartRepresentation.of(change.cart))
    }

    @DeleteMapping("/cart/lines/{lineId}")
    fun removeLine(
        @PathVariable lineId: String,
        visitorOfTheRequest: VisitorOfTheRestRequest,
    ): ResponseEntity<Any> {
        val change: CartChange = removeCartLine.execute(visitorOfTheRequest.visitor, lineId)
        val refusedForAnotherReason = change.errors.filter { it.code != UserErrorCode.CART_LINE_NOT_FOUND }
        return if (refusedForAnotherReason.isEmpty()) {
            ResponseEntity.noContent().build()
        } else {
            problem(refusedForAnotherReason, "/api/cart/lines/\$lineId")
        }
    }

    @PostMapping("/orders")
    fun place(visitorOfTheRequest: VisitorOfTheRestRequest): ResponseEntity<Any> =
        when (val outcome = placeOrder.execute(visitorOfTheRequest.visitor)) {
            is Result.Success -> ResponseEntity
                .created(location("/api/orders/\${outcome.value.id}"))
                .body(OrderRepresentation.of(outcome.value))
            is Result.Refused -> problem(outcome.errors, "/api/orders")
        }

    private fun problem(errors: List<UserError>, instance: String): ResponseEntity<Any> {
        val first = errors.first()
        val status = statusFor(first.code)
        val detail = ProblemDetail.forStatusAndDetail(status, first.message)
        detail.type = URI.create("https://zappymart.example/problems/\${first.code.slug()}")
        detail.instance = URI.create(instance)
        detail.setProperty("code", first.code.name)
        detail.setProperty("field", first.field)
        return ResponseEntity.status(status).body(detail)
    }

    private fun statusFor(code: UserErrorCode): HttpStatus = when (code) {
        UserErrorCode.NOT_AUTHENTICATED, UserErrorCode.CREDENTIALS_INVALID -> HttpStatus.UNAUTHORIZED
        UserErrorCode.PRODUCT_NOT_FOUND, UserErrorCode.CART_LINE_NOT_FOUND -> HttpStatus.NOT_FOUND
        UserErrorCode.ORDER_NOT_FOUND -> HttpStatus.NOT_FOUND
        UserErrorCode.OUT_OF_STOCK, UserErrorCode.CART_EMPTY -> HttpStatus.CONFLICT
        UserErrorCode.CODE_EXPIRED, UserErrorCode.CODE_EXHAUSTED -> HttpStatus.CONFLICT
        UserErrorCode.RATE_LIMITED -> HttpStatus.TOO_MANY_REQUESTS
        else -> HttpStatus.UNPROCESSABLE_ENTITY
    }

    private fun UserErrorCode.slug(): String = name.lowercase().replace('_', '-')

    private fun location(path: String): URI = UriComponentsBuilder.fromPath(path).build().toUri()
}`;

const NODE_REST_CODE = `import type { Request, Response, Router } from "express";
import express from "express";
import type { UserError } from "@zappy/shared";
import type { PlaceOrder } from "../../application/placeOrder.js";
import type { ReadOrders } from "../../application/readOrders.js";

const statusByCode: Record<string, number> = {
  NOT_AUTHENTICATED: 401,
  ORDER_NOT_FOUND: 404,
  OUT_OF_STOCK: 409,
  CART_EMPTY: 409,
  RATE_LIMITED: 429
};

function problem(response: Response, errors: readonly UserError[], instance: string): void {
  const first = errors[0];
  const status = statusByCode[first.code] ?? 422;
  response
    .status(status)
    .type("application/problem+json")
    .json({
      type: \`https://zappymart.example/problems/\${first.code.toLowerCase().replaceAll("_", "-")}\`,
      title: status === 409 ? "The state of the store refuses this" : "The request could not be processed",
      status,
      detail: first.message,
      instance,
      code: first.code,
      field: first.field ?? null
    });
}

export function orderRoutes(checkout: PlaceOrder, orders: ReadOrders): Router {
  const routes = express.Router();

  routes.post("/orders", async (request: Request, response: Response) => {
    const customerId = request.res?.locals.customerId ?? null;
    const idempotencyKey = request.header("Idempotency-Key") ?? null;
    const outcome = await checkout.place(customerId, idempotencyKey);

    if (outcome.kind === "refused") {
      problem(response, outcome.errors, "/api/orders");
      return;
    }

    response.status(201).location(\`/api/orders/\${outcome.order.id}\`).json(outcome.order);
  });

  routes.get("/orders/:orderId", async (request: Request, response: Response) => {
    const customerId = request.res?.locals.customerId ?? null;
    const order = await orders.byIdentifier(customerId, request.params.orderId);

    if (order === null) {
      problem(
        response,
        [{ code: "ORDER_NOT_FOUND", message: "No order with that id belongs to you.", field: null }],
        \`/api/orders/\${request.params.orderId}\`
      );
      return;
    }

    response.status(200).json(order);
  });

  return routes;
}`;

const SCHEMA_CART_CODE = `"""
Adds a product to the visitor's cart, or raises the quantity when the
product is already on a line. The quantity after the change may not
exceed the product's stock.
"""
addToCart(
  """
  The \`Product.id\` to add.
  """
  productId: ID!

  """
  How many to add, one or more. The default adds one.
  """
  quantity: Int = 1
): CartPayload!

"""
Removes one line from the visitor's cart.
"""
removeCartLine(
  """
  The \`CartLine.id\` to remove, which is not the product id.
  """
  lineId: ID!
): CartPayload!

"""
Removes the promotion code from the visitor's cart. A cart with no code
answers with the unchanged cart and no errors, so a client calls this
without checking first.
"""
removePromotionCode: CartPayload!`;

const CSHARP_MUTATION_CODE = `public async Task<CartPayload> AddToCart(
    [GraphQLType<NonNullType<IdType>>] string productId,
    [GraphQLType<IntType>][DefaultValue(1)] int? quantity,
    AddToCart addToCart,
    VisitorOfTheRequest visitor,
    CancellationToken cancellationToken) =>
    RememberCart(visitor, await addToCart.Execute(visitor.Current, productId, quantity, cancellationToken));

public async Task<CartPayload> RemoveCartLine(
    [GraphQLType<NonNullType<IdType>>] string lineId,
    RemoveCartLine removeCartLine,
    VisitorOfTheRequest visitor,
    CancellationToken cancellationToken) =>
    RememberCart(visitor, await removeCartLine.Execute(visitor.Current, lineId, cancellationToken));

public async Task<OrderPayload> PlaceOrder(
    string? idempotencyKey,
    PlaceOrder placeOrder,
    VisitorOfTheRequest visitor,
    CancellationToken cancellationToken) =>
    OrderPayload.From(await placeOrder.Execute(visitor.Current, idempotencyKey, cancellationToken));`;

const KOTLIN_ORDER_CONTROLLER_CODE = `@Controller
class OrderController(
    private val listOrders: ListOrders,
    private val findOrder: FindOrder,
    private val placeOrder: PlaceOrder,
) {

    @QueryMapping
    fun order(@ContextValue requestContext: RequestContext, @Argument id: String): Order? =
        findOrder.execute(requestContext.visitor, id)

    @MutationMapping
    fun placeOrder(
        @ContextValue requestContext: RequestContext,
        @Argument idempotencyKey: String?,
    ): OrderPayload = when (val outcome = placeOrder.execute(requestContext.visitor)) {
        is Result.Success -> OrderPayload(outcome.value, emptyList())
        is Result.Refused -> OrderPayload(null, outcome.errors)
    }
}`;

const NODE_RESOLVERS_CODE = `Mutation: {
  async placeOrder(_parent, args, context) {
    const outcome = await context.checkout.place(
      context.visitor?.customerId ?? null,
      args.idempotencyKey ?? null
    );
    if (outcome.kind === "placed") {
      return { order: outcome.order, errors: [] };
    }
    return { order: null, errors: [...outcome.errors] };
  }
},

Order: {
  async __resolveReference(reference, context) {
    return context.orderStore.readById(reference.id, context.visitor?.customerId ?? "");
  }
}`;

const CHECKOUT_ROUTE_CODE = `export async function loader({ url, context }: Route.LoaderArgs) {
  const connection = storeConnectionFrom(context);
  requireCustomer(connection, url);
  const answer = await connection.run(cartQuery, {});
  if (answer.cart.lines.length === 0) {
    throw redirect("/cart");
  }
  return {
    cart: answer.cart,
    customerName: connection.customerName,
    idempotencyKey: randomUUID(),
  };
}

export async function action({ request, url, context }: Route.ActionArgs) {
  const connection = storeConnectionFrom(context);
  requireCustomer(connection, url);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === applyPromotionCodeIntent) {
    const answer = await connection.run(applyPromotionCodeMutation, {
      code: String(formData.get("promotionCode") ?? "").trim(),
    });
    return { problems: describeUserErrors(answer.applyPromotionCode.errors) };
  }

  if (intent !== placeOrderIntent) {
    throw data(\`Checkout does not know the action \${intent}.\`, { status: 400 });
  }

  const answer = await connection.run(placeOrderMutation, {
    idempotencyKey: String(formData.get("idempotencyKey") ?? ""),
  });
  const order = answer.placeOrder.order;
  if (order === null) {
    return { problems: describeUserErrors(answer.placeOrder.errors) };
  }
  throw redirect(\`/orders/\${order.id}\`);
}`;

const USER_ERRORS_CODE = `const sentences: Record<string, string> = {
  PRODUCT_NOT_FOUND: "That product is not in the catalogue any more.",
  OUT_OF_STOCK: "There is not enough stock for that quantity.",
  QUANTITY_INVALID: "A quantity has to be one or more.",
  CART_LINE_NOT_FOUND: "That line is no longer in your cart.",
  CART_EMPTY: "Your cart is empty, so there is nothing to order.",
  CODE_UNKNOWN: "That promotion code does not exist.",
  CODE_EXPIRED: "That promotion code has expired.",
  NOT_AUTHENTICATED: "Please log in to continue.",
  ORDER_NOT_FOUND: "That order does not exist.",
};

export function describeUserError(userError: UserError): string {
  return sentences[userError.code] ?? userError.message;
}

export function describeUserErrors(userErrors: readonly UserError[]): string[] {
  return userErrors.map(describeUserError);
}`;

const CHECKOUT_REST_CODE = `type ProblemDocument = {
  status: number;
  detail: string;
  code?: string;
  field?: string | null;
};

async function callStore(
  path: string,
  init: RequestInit,
): Promise<{ status: number; location: string | null; body: unknown }> {
  const response = await fetch(\`\${storeApiUrl()}\${path}\`, init);
  const text = await response.text();
  return {
    status: response.status,
    location: response.headers.get("Location"),
    body: text.length === 0 ? null : JSON.parse(text),
  };
}

export async function loader({ url, context }: Route.LoaderArgs) {
  const connection = storeConnectionFrom(context);
  requireCustomer(connection, url);
  const answer = await callStore("/api/cart", { headers: connection.headers });
  const cart = answer.body as Cart;
  if (cart.lines.length === 0) {
    throw redirect("/cart");
  }
  return { cart, customerName: connection.customerName, idempotencyKey: randomUUID() };
}

export async function action({ request, url, context }: Route.ActionArgs) {
  const connection = storeConnectionFrom(context);
  requireCustomer(connection, url);
  const formData = await request.formData();

  const answer = await callStore("/api/orders", {
    method: "POST",
    headers: {
      ...connection.headers,
      "Idempotency-Key": String(formData.get("idempotencyKey") ?? ""),
    },
  });

  if (answer.status === 201 && answer.location !== null) {
    throw redirect(answer.location.replace("/api", ""));
  }

  if (answer.status >= 500) {
    throw data("The store is not answering right now.", { status: 502 });
  }

  const problem = answer.body as ProblemDocument;
  return { problems: [describeUserError({ code: problem.code ?? "", message: problem.detail })] };
}`;

const METHOD_ROWS = [
  {
    method: "GET",
    safe: { en: "Yes", nl: "Ja" },
    idempotent: { en: "Yes", nl: "Ja" },
    here: {
      en: "Reads the cart, one order, the categories. A proxy may repeat it and a browser may cache it.",
      nl: "Leest de winkelwagen, één bestelling, de categorieën. Een proxy mag hem herhalen en een browser mag hem cachen.",
    },
  },
  {
    method: "HEAD",
    safe: { en: "Yes", nl: "Ja" },
    idempotent: { en: "Yes", nl: "Ja" },
    here: {
      en: "The same answer without the body, so a client can check the entity tag before it downloads anything.",
      nl: "Hetzelfde antwoord zonder body, zodat een client de entity tag kan controleren voordat hij iets downloadt.",
    },
  },
  {
    method: "PUT",
    safe: { en: "No", nl: "Nee" },
    idempotent: { en: "Yes", nl: "Ja" },
    here: {
      en: "Sets a cart line to an exact quantity. Sending three twice still means three, which is why the store has this next to the add.",
      nl: "Zet een regel op een exact aantal. Twee keer drie sturen betekent nog steeds drie, en daarom staat deze naast het toevoegen.",
    },
  },
  {
    method: "DELETE",
    safe: { en: "No", nl: "Nee" },
    idempotent: { en: "Yes", nl: "Ja" },
    here: {
      en: "Removes a cart line. The second call answers 204 as well, because the line being gone is the state the caller asked for.",
      nl: "Verwijdert een regel. De tweede aanroep antwoordt ook met 204, want de regel die weg is, is precies de toestand waar de aanroeper om vroeg.",
    },
  },
  {
    method: "POST",
    safe: { en: "No", nl: "Nee" },
    idempotent: { en: "No", nl: "Nee" },
    here: {
      en: "Adds a line and places an order. A repeat can do the work twice, so the checkout carries an idempotency key.",
      nl: "Voegt een regel toe en plaatst een bestelling. Een herhaling kan het werk twee keer doen, dus draagt de afrekening een idempotentiesleutel.",
    },
  },
  {
    method: "PATCH",
    safe: { en: "No", nl: "Nee" },
    idempotent: { en: "Only by design", nl: "Alleen als je het zo ontwerpt" },
    here: {
      en: "Not used in this store. A patch that sets a field is idempotent, a patch that adds one to a counter is not.",
      nl: "Niet gebruikt in deze winkel. Een patch die een veld zet is idempotent, een patch die een teller ophoogt niet.",
    },
  },
];

const STATUS_ROWS = [
  {
    status: "200 OK",
    decidedBy: { en: "The handler", nl: "De handler" },
    when: {
      en: "A read answered, or a write answered with the new state in the body.",
      nl: "Een lees is beantwoord, of een schrijf is beantwoord met de nieuwe toestand in de body.",
    },
  },
  {
    status: "201 Created",
    decidedBy: { en: "The handler", nl: "De handler" },
    when: {
      en: "A resource now exists that did not exist before. The Location header names it, and here that is the new cart line or the new order.",
      nl: "Er bestaat nu iets wat er eerder niet was. De Location-header noemt het, en hier is dat de nieuwe regel of de nieuwe bestelling.",
    },
  },
  {
    status: "202 Accepted",
    decidedBy: { en: "The handler", nl: "De handler" },
    when: {
      en: "The work was taken but not finished. Only answer this when the client can find out later how it ended.",
      nl: "Het werk is aangenomen maar niet af. Antwoord dit alleen als de client later kan achterhalen hoe het is afgelopen.",
    },
  },
  {
    status: "204 No Content",
    decidedBy: { en: "The handler", nl: "De handler" },
    when: {
      en: "The work is done and there is nothing worth sending back. The delete in this store answers this twice.",
      nl: "Het werk is klaar en er valt niets terug te sturen. Het verwijderen in deze winkel antwoordt dit twee keer.",
    },
  },
  {
    status: "304 Not Modified",
    decidedBy: { en: "The conditional check", nl: "De voorwaardelijke controle" },
    when: {
      en: "The client already has this version. It carries no body, and the validators travel with it.",
      nl: "De client heeft deze versie al. Er gaat geen body mee, en de validators reizen wel mee.",
    },
  },
  {
    status: "400 Bad Request",
    decidedBy: { en: "Binding", nl: "Binding" },
    when: {
      en: "The bytes are not a request the server can read. Broken JSON, a missing field the shape needs.",
      nl: "De bytes zijn geen verzoek dat de server kan lezen. Kapotte JSON, een ontbrekend veld dat de vorm nodig heeft.",
    },
  },
  {
    status: "401 Unauthorized",
    decidedBy: { en: "Authentication", nl: "Authenticatie" },
    when: {
      en: "There are no valid credentials. The checkout answers this without a token, and a WWW-Authenticate header belongs with it.",
      nl: "Er zijn geen geldige gegevens. De afrekening antwoordt dit zonder token, en een WWW-Authenticate-header hoort erbij.",
    },
  },
  {
    status: "403 Forbidden",
    decidedBy: { en: "Authorisation", nl: "Autorisatie" },
    when: {
      en: "The credentials are valid and still not enough. Repeating the request will not help.",
      nl: "De gegevens zijn geldig en toch niet genoeg. Het verzoek herhalen helpt niet.",
    },
  },
  {
    status: "404 Not Found",
    decidedBy: { en: "The domain rules", nl: "De domeinregels" },
    when: {
      en: "Nothing at this address, or nothing this caller may know about. Another customer's order answers this on purpose.",
      nl: "Niets op dit adres, of niets waarvan deze aanroeper mag weten dat het bestaat. De bestelling van een andere klant antwoordt dit met opzet.",
    },
  },
  {
    status: "405 Method Not Allowed",
    decidedBy: { en: "Routing", nl: "Routering" },
    when: {
      en: "The address exists and this method does not belong to it. The answer has to carry an Allow header listing the methods that do.",
      nl: "Het adres bestaat en deze methode hoort er niet bij. Het antwoord moet een Allow-header dragen met de methodes die er wel bij horen.",
    },
  },
  {
    status: "409 Conflict",
    decidedBy: { en: "The domain rules", nl: "De domeinregels" },
    when: {
      en: "The request is well formed and the current state refuses it. Out of stock, an empty cart, a code that is used up.",
      nl: "Het verzoek klopt en de huidige toestand weigert het. Geen voorraad, een lege winkelwagen, een code die op is.",
    },
  },
  {
    status: "410 Gone",
    decidedBy: { en: "The domain rules", nl: "De domeinregels" },
    when: {
      en: "It existed and it is deliberately gone. Use it only when you actually know that, otherwise 404.",
      nl: "Het heeft bestaan en is bewust weg. Gebruik het alleen als je dat echt weet, anders 404.",
    },
  },
  {
    status: "412 Precondition Failed",
    decidedBy: { en: "The conditional check", nl: "De voorwaardelijke controle" },
    when: {
      en: "The If-Match validator did not match, so the write was refused and nobody's change was overwritten.",
      nl: "De If-Match-validator kwam niet overeen, dus de schrijf is geweigerd en het werk van een ander is niet overschreven.",
    },
  },
  {
    status: "415 Unsupported Media Type",
    decidedBy: { en: "Content negotiation", nl: "Contentonderhandeling" },
    when: {
      en: "The body has a media type this route does not read. It ends the request before any handler runs.",
      nl: "De body heeft een mediatype dat deze route niet leest. Het beëindigt het verzoek voordat er een handler draait.",
    },
  },
  {
    status: "422 Unprocessable Content",
    decidedBy: { en: "Validation", nl: "Validatie" },
    when: {
      en: "The shape is right and a value is wrong. A quantity of zero is this, not a 400.",
      nl: "De vorm klopt en een waarde niet. Een aantal van nul is dit, geen 400.",
    },
  },
  {
    status: "429 Too Many Requests",
    decidedBy: { en: "The rate limiter", nl: "De rate limiter" },
    when: {
      en: "Too many attempts in the window. Send Retry-After so the client knows when to come back.",
      nl: "Te veel pogingen in het venster. Stuur Retry-After mee, zodat de client weet wanneer hij terug mag komen.",
    },
  },
  {
    status: "500 Internal Server Error",
    decidedBy: { en: "The unexpected", nl: "Het onverwachte" },
    when: {
      en: "Something went wrong that the code did not foresee. Never use it for a refusal the domain expected.",
      nl: "Er is iets misgegaan dat de code niet had voorzien. Gebruik het nooit voor een weigering die het domein verwachtte.",
    },
  },
  {
    status: "502, 503, 504",
    decidedBy: { en: "The edge", nl: "De rand" },
    when: {
      en: "A gateway got a broken answer, the service is not taking work, or an upstream call ran out of time. A client may retry an idempotent request.",
      nl: "Een gateway kreeg een kapot antwoord, de dienst neemt geen werk aan, of een aanroep naar achteren duurde te lang. Een client mag een idempotent verzoek opnieuw proberen.",
    },
  },
];

const DECISION_ROWS = [
  {
    question: {
      en: "Does the thing have its own address that people will bookmark or share?",
      nl: "Heeft het ding een eigen adres dat mensen bewaren of delen?",
    },
    rest: { en: "Yes, that is the model", nl: "Ja, dat is het model" },
    graph: { en: "One address for everything", nl: "Eén adres voor alles" },
  },
  {
    question: {
      en: "Do you want proxies and browsers to cache the answer without your help?",
      nl: "Wil je dat proxy's en browsers het antwoord cachen zonder jouw hulp?",
    },
    rest: { en: "Yes, with ETag and Cache-Control", nl: "Ja, met ETag en Cache-Control" },
    graph: { en: "Only with persisted queries over GET", nl: "Alleen met persisted queries over GET" },
  },
  {
    question: {
      en: "Do many different screens need different slices of the same data?",
      nl: "Hebben veel verschillende schermen andere stukjes van dezelfde data nodig?",
    },
    rest: { en: "Every screen gets an endpoint or over-fetches", nl: "Elk scherm krijgt een endpoint of haalt te veel op" },
    graph: { en: "Yes, that is the model", nl: "Ja, dat is het model" },
  },
  {
    question: {
      en: "Do several backend teams own parts of one graph?",
      nl: "Bezitten meerdere backendteams delen van één graaf?",
    },
    rest: { en: "A gateway has to compose it", nl: "Een gateway moet het samenstellen" },
    graph: { en: "Federation composes it from subgraphs", nl: "Federatie stelt het samen uit subgraphs" },
  },
  {
    question: {
      en: "Does one screen need three sources at once and still render if one fails?",
      nl: "Heeft één scherm drie bronnen tegelijk nodig en moet het renderen als er één uitvalt?",
    },
    rest: { en: "Three calls and your own merge", nl: "Drie aanroepen en je eigen samenvoeging" },
    graph: { en: "One call, partial data with errors beside it", nl: "Eén aanroep, gedeeltelijke data met de fouten ernaast" },
  },
  {
    question: {
      en: "Are files, ranges or streams part of the job?",
      nl: "Horen bestanden, ranges of streams bij het werk?",
    },
    rest: { en: "HTTP already does this", nl: "HTTP doet dit al" },
    graph: { en: "It has to be bolted on", nl: "Dat moet je erbij bouwen" },
  },
  {
    question: {
      en: "Is the client a script, a partner system or a device you cannot update?",
      nl: "Is de client een script, een partnersysteem of een apparaat dat je niet kunt bijwerken?",
    },
    rest: { en: "curl and an OpenAPI document are enough", nl: "curl en een OpenAPI-document zijn genoeg" },
    graph: { en: "It needs a client that builds documents", nl: "Die heeft een client nodig die documenten opstelt" },
  },
  {
    question: {
      en: "Do you need one place that says what every failure looks like?",
      nl: "Wil je één plek die zegt hoe elke storing eruitziet?",
    },
    rest: { en: "RFC 9457 problem details", nl: "Problem details uit RFC 9457" },
    graph: { en: "A user error type in the payload", nl: "Een user-error-type in de payload" },
  },
];

const COPY = {
  contentsLabel: { en: "In this article", nl: "In dit artikel" },
  lead: {
    en: "Two questions settle most arguments about an API. Which request may be sent again without doing the work twice, and which stage of the request chose the status code that came back. Answer those two out loud and the choice between REST and GraphQL stops being a matter of taste.",
    nl: "Twee vragen beslechten de meeste discussies over een API. Welk verzoek mag je opnieuw sturen zonder het werk twee keer te doen, en welke stap van het verzoek koos de statuscode die terugkwam. Beantwoord die twee hardop en de keuze tussen REST en GraphQL is geen kwestie van smaak meer.",
  },
  intro1: {
    en: "Every article I write stands on code that runs. Zappy Mart is one small web store built several times over on one GraphQL contract: hexagonal monoliths in C#, Java and Kotlin, the same store again as five subgraphs behind a gateway, and three store fronts. Everything in the GraphQL half of this article is quoted from those projects, with the file path above each block.",
    nl: "Elk artikel dat ik schrijf staat op code die draait. Zappy Mart is één kleine webwinkel die meerdere keren is gebouwd op één GraphQL-contract: hexagonale monolieten in C#, Java en Kotlin, dezelfde winkel nog eens als vijf subgraphs achter een gateway, en drie winkels. Alles in de GraphQL-helft van dit artikel komt uit die projecten, met het bestandspad boven elk blok.",
  },
  intro2: {
    en: "The REST half is different, and that belongs at the top. The repository serves GraphQL today and contains no REST adapter. Its backlog carries one as an open item, so the REST adapter in this article is written here: a second inbound adapter over the same use cases, in a new project beside the GraphQL one. I compiled it against the real C# backend and covered it with eight integration tests, which pass. That is the whole point a hexagon is meant to prove. The application layer never learns which door the request came through.",
    nl: "De REST-helft is anders, en dat hoort meteen bovenaan. De repository serveert vandaag GraphQL en bevat geen REST-adapter. In de backlog staat er wel een als open punt, dus de REST-adapter in dit artikel is hier geschreven: een tweede inkomende adapter over dezelfde use cases, in een nieuw project naast het GraphQL-project. Ik heb hem gecompileerd tegen de echte C#-backend en afgedekt met acht integratietests, die slagen. Precies dat is wat een zeshoek moet bewijzen. De applicatielaag komt nooit te weten door welke deur het verzoek binnenkwam.",
  },
  versionNote: {
    en: "The runtimes here are .NET 10 with C# 14 and Hot Chocolate 16.6.4, Kotlin 2.4.10 on Spring Boot 4.1.1 with Gradle 9.5.0, Node.js 24 with Express 5.2.1 and Apollo Server 5.5.1, and React Router 8.3.1 with @urql/core 6.0.3 on the front. Every one of those numbers was read from the project files or from the npm registry on 9 September 2026.",
    nl: "De runtimes hier zijn .NET 10 met C# 14 en Hot Chocolate 16.6.4, Kotlin 2.4.10 op Spring Boot 4.1.1 met Gradle 9.5.0, Node.js 24 met Express 5.2.1 en Apollo Server 5.5.1, en React Router 8.3.1 met @urql/core 6.0.3 aan de voorkant. Elk van die nummers is op 9 september 2026 uit de projectbestanden of uit het npm-register gelezen.",
  },
  normativeNoteBefore: { en: "The HTTP facts come from ", nl: "De HTTP-feiten komen uit " },
  normativeNoteMiddle: {
    en: ", which is the current definition of HTTP semantics, and from ",
    nl: ", de huidige definitie van HTTP-semantiek, en uit ",
  },
  normativeNoteAfter: {
    en: ", which defines problem details. Section numbers appear beside the claims so you can check every sentence yourself. The GraphQL side leans on the September 2025 edition of the specification and on the GraphQL over HTTP work, which is still a draft and still moves, so its behaviour carries the date it was read.",
    nl: ", die problem details definieert. De sectienummers staan naast de beweringen, zodat je elke zin zelf kunt nakijken. De GraphQL-kant leunt op de editie van september 2025 van de specificatie en op het werk aan GraphQL over HTTP, dat nog een concept is en nog beweegt, dus daar staat de datum bij waarop het gelezen is.",
  },
  quote: {
    en: "A status code is not decoration. It is the one part of the answer that a proxy, a browser, a retry policy and a monitoring dashboard all read without knowing anything about your domain.",
    nl: "Een statuscode is geen versiering. Het is het enige deel van het antwoord dat een proxy, een browser, een retrybeleid en een monitoringdashboard allemaal lezen zonder iets van jouw domein te weten.",
  },

  oneJobTitle: { en: "Two styles, one job", nl: "Twee stijlen, één taak" },
  oneJob1: {
    en: "REST and GraphQL are usually argued about as if they were rival technologies. They are not. Both are a way to write down a contract between a client and a server over HTTP, and both leave the same questions on the table: what may be repeated, what went wrong, and who is allowed to know.",
    nl: "Over REST en GraphQL wordt meestal gediscussieerd alsof het concurrerende technieken zijn. Dat zijn ze niet. Allebei zijn ze een manier om een contract tussen een client en een server over HTTP vast te leggen, en allebei laten ze dezelfde vragen liggen: wat mag herhaald worden, wat ging er mis, en wie mag het weten.",
  },
  oneJob2: {
    en: "The difference is where the contract lives and how the answer is shaped.",
    nl: "Het verschil zit in waar het contract woont en hoe het antwoord is gevormd.",
  },
  restShapeLabel: { en: "REST.", nl: "REST." },
  restShapeBody: {
    en: "The contract is the set of addresses and the methods each address accepts. The outcome of a request is the status code, and the body is what came of it. HTTP itself carries caching, conditional requests, ranges and the retry rules, so a proxy that knows nothing about your store still behaves correctly.",
    nl: "Het contract is de verzameling adressen en de methodes die elk adres aanneemt. De uitkomst van een verzoek is de statuscode, en de body is wat het opleverde. HTTP zelf draagt caching, voorwaardelijke verzoeken, ranges en de regels voor herhalen, dus een proxy die niets van jouw winkel weet, gedraagt zich toch correct.",
  },
  graphShapeLabel: { en: "GraphQL.", nl: "GraphQL." },
  graphShapeBody: {
    en: "The contract is a schema. One address takes every operation, the client asks for the fields it will render, and the answer is an envelope with a data member and an errors member. HTTP becomes a transport, and almost everything that matters moves inside the body.",
    nl: "Het contract is een schema. Eén adres neemt elke operatie aan, de client vraagt om de velden die hij gaat tonen, en het antwoord is een envelop met een data-lid en een errors-lid. HTTP wordt een transportlaag, en bijna alles wat ertoe doet beweegt binnen de body.",
  },
  oneJob3: {
    en: "In this store both shapes end in the same place. A checkout is one class called PlaceOrder in the application layer, and it has no idea whether the request arrived as a mutation or as a POST to an address.",
    nl: "In deze winkel eindigen beide vormen op dezelfde plek. Een afrekening is één klasse die PlaceOrder heet in de applicatielaag, en die heeft geen idee of het verzoek binnenkwam als een mutation of als een POST naar een adres.",
  },
  twoShapesAria: {
    en: "Diagram: one client can place an order over a REST address that answers 201 with a Location header, or over one GraphQL address that answers 200 with an envelope, and both reach the same PlaceOrder use case",
    nl: "Diagram: één client kan een bestelling plaatsen via een REST-adres dat 201 met een Location-header antwoordt, of via één GraphQL-adres dat 200 met een envelop antwoordt, en allebei komen ze uit bij dezelfde use case PlaceOrder",
  },
  twoShapesCaption: {
    en: "The same outcome travels in two shapes. REST puts the outcome in the status line and names the new order in a Location header. GraphQL answers 200 and puts the order or the refusal inside the envelope. The client has to know which shape it is reading, and the use case underneath does not.",
    nl: "Dezelfde uitkomst reist in twee vormen. REST zet de uitkomst in de statusregel en noemt de nieuwe bestelling in een Location-header. GraphQL antwoordt 200 en zet de bestelling of de weigering in de envelop. De client moet weten welke vorm hij leest, en de use case eronder niet.",
  },
  oneJob4: {
    en: "So the question is never which style is better. It is which of the two puts the answers your clients need in the place where they will actually look, and what you have to build yourself once you choose.",
    nl: "De vraag is dus nooit welke stijl beter is. De vraag is welke van de twee de antwoorden die jouw clients nodig hebben neerlegt op de plek waar ze echt gaan kijken, en wat je zelf moet bouwen zodra je gekozen hebt.",
  },

  methodsTitle: { en: "Methods, and what idempotent means", nl: "Methodes, en wat idempotent betekent" },
  methods1: {
    en: "Two properties of a method decide what a network in between is allowed to do with it, and RFC 9110 defines both in one page. They are often confused, and they are not the same thing.",
    nl: "Twee eigenschappen van een methode bepalen wat een netwerk ertussenin ermee mag doen, en RFC 9110 definieert ze allebei op één pagina. Ze worden vaak door elkaar gehaald, en ze zijn niet hetzelfde.",
  },
  safeLabel: { en: "Safe, section 9.2.1.", nl: "Veilig, sectie 9.2.1." },
  safeBody: {
    en: "The request is read only as far as the client is concerned. GET, HEAD, OPTIONS and TRACE are safe. A crawler, a link prefetcher and a browser preview may fire them without asking anyone, which is exactly why a delete behind a GET is a bad afternoon waiting to happen.",
    nl: "Het verzoek is voor de client alleen lezen. GET, HEAD, OPTIONS en TRACE zijn veilig. Een crawler, een prefetcher en een browservoorbeeld mogen ze afvuren zonder iemand iets te vragen, en juist daarom is een verwijdering achter een GET een middag die nog moet komen.",
  },
  idempotentLabel: { en: "Idempotent, section 9.2.2.", nl: "Idempotent, sectie 9.2.2." },
  idempotentBody: {
    en: "Sending the request more than once has the same effect on the server as sending it once. PUT, DELETE and every safe method are idempotent. The same section is careful about what this does not mean: the server may still log each call, keep a revision history or fire other bookkeeping. Idempotency is about what the caller asked for, not about the server sitting perfectly still.",
    nl: "Het verzoek vaker sturen heeft op de server hetzelfde effect als het één keer sturen. PUT, DELETE en elke veilige methode zijn idempotent. Diezelfde sectie is precies over wat dat niet betekent: de server mag elke aanroep nog steeds loggen, een revisiehistorie bijhouden of andere administratie doen. Idempotentie gaat over wat de aanroeper vroeg, niet over een server die volmaakt stilzit.",
  },
  methods2: {
    en: "Written out for this store, with the method registry of section 16.1.1 as the source, it looks like this.",
    nl: "Uitgeschreven voor deze winkel, met het methoderegister van sectie 16.1.1 als bron, ziet het er zo uit.",
  },
  methodTableCaption: {
    en: "Every method the store uses, its two properties from RFC 9110, and what it does here",
    nl: "Elke methode die de winkel gebruikt, de twee eigenschappen uit RFC 9110, en wat hij hier doet",
  },
  methodColumn: { en: "Method", nl: "Methode" },
  safeColumn: { en: "Safe", nl: "Veilig" },
  idempotentColumn: { en: "Idempotent", nl: "Idempotent" },
  hereColumn: { en: "In this store", nl: "In deze winkel" },
  methods3: {
    en: "The delete is the one worth watching, because it is where most implementations quietly break the rule. Removing a cart line that is already gone is not a failure. The caller asked for a state, and that state is what they get. The adapter treats CART_LINE_NOT_FOUND as an outcome, not as an error, so the second call answers exactly like the first.",
    nl: "De verwijdering is de interessante, want daar breken de meeste implementaties stilletjes de regel. Een regel weghalen die er al niet meer is, is geen storing. De aanroeper vroeg om een toestand, en die toestand krijgt hij. De adapter behandelt CART_LINE_NOT_FOUND als een uitkomst en niet als een fout, dus de tweede aanroep antwoordt precies als de eerste.",
  },
  methods4: {
    en: "That behaviour is not cosmetic. A client on a train loses its answer, retries, and has to be able to tell the difference between the work not happening and the work having happened already. With an idempotent delete there is nothing to tell apart.",
    nl: "Dat gedrag is niet cosmetisch. Een client in de trein raakt zijn antwoord kwijt, probeert het opnieuw, en moet het verschil kunnen zien tussen werk dat niet is gebeurd en werk dat al gebeurd was. Bij een idempotente verwijdering valt er niets te onderscheiden.",
  },
  methodsCalloutTitle: {
    en: "A retry is not always yours to decide",
    nl: "Een herhaling is niet altijd jouw beslissing",
  },
  methodsCalloutBody: {
    en: "RFC 9110 section 9.2.2 says a client should not automatically retry a request with a method that is not idempotent. Proxies, connection pools and HTTP libraries take that seriously and will repeat an idempotent request on a dropped connection on their own. So the moment you make a POST route that can safely be repeated, say so in the contract, because nothing in the protocol will discover it for you.",
    nl: "RFC 9110 sectie 9.2.2 zegt dat een client een verzoek met een niet-idempotente methode niet automatisch opnieuw hoort te proberen. Proxy's, connectiepools en HTTP-bibliotheken nemen dat serieus en herhalen een idempotent verzoek bij een verbroken verbinding uit zichzelf. Dus zodra je een POST-route maakt die veilig herhaald kan worden, zet dat in het contract, want het protocol ontdekt het niet voor je.",
  },
  methods5: {
    en: "GraphQL has the same split under different names. A query is safe, a mutation is not, and the specification says a mutation must run its top level fields one after another so two writes in one document cannot race. What GraphQL does not have is a place in the protocol where any of that is visible, because every operation is a POST to the same address.",
    nl: "GraphQL kent dezelfde tweedeling onder andere namen. Een query is veilig, een mutation niet, en de specificatie zegt dat een mutation zijn velden op het hoogste niveau na elkaar moet uitvoeren, zodat twee schrijfacties in één document niet met elkaar kunnen botsen. Wat GraphQL niet heeft, is een plek in het protocol waar dat zichtbaar wordt, want elke operatie is een POST naar hetzelfde adres.",
  },

  statusTitle: { en: "The status codes that matter, and who chooses each", nl: "De statuscodes die ertoe doen, en wie ze kiest" },
  status1: {
    en: "A request walks through a line of stages, and every stage can end it. The stage that ends it is the one that chooses the status code. Knowing which stage answered tells you where to look, and that is the only reason a status code is worth arguing about.",
    nl: "Een verzoek loopt langs een rij stappen, en elke stap kan het beëindigen. De stap die het beëindigt, is de stap die de statuscode kiest. Weten welke stap antwoordde, vertelt je waar je moet kijken, en dat is de enige reden dat het de moeite waard is om over een statuscode te discussiëren.",
  },
  stagesAria: {
    en: "Diagram: a request passes routing, content negotiation, authentication, binding, validation and the domain rules before the handler answers, and each stage owns its own status codes",
    nl: "Diagram: een verzoek passeert routering, contentonderhandeling, authenticatie, binding, validatie en de domeinregels voordat de handler antwoordt, en elke stap bezit zijn eigen statuscodes",
  },
  stagesCaption: {
    en: "Each stage can end the request, and the stage that ends it chooses the status code. Routing owns 405, content negotiation owns 415, authentication owns 401 and 403, binding owns 400, validation owns 422, and only the domain rules may answer 404, 409 or 410. The handler that reaches the end answers 200, 201 or 204.",
    nl: "Elke stap kan het verzoek beëindigen, en de stap die het beëindigt kiest de statuscode. Routering bezit 405, contentonderhandeling 415, authenticatie 401 en 403, binding 400, validatie 422, en alleen de domeinregels mogen 404, 409 of 410 antwoorden. De handler die het eind haalt, antwoordt 200, 201 of 204.",
  },
  status2: {
    en: "The table below is the working list. Every row names the stage that owns the code, so a disagreement in a review turns into a question with one answer.",
    nl: "De tabel hieronder is de werklijst. Elke regel noemt de stap die de code bezit, zodat een meningsverschil in een review verandert in een vraag met één antwoord.",
  },
  statusTableCaption: {
    en: "The status codes worth knowing, the stage that owns each one, and when it is the right answer here. Section numbers are RFC 9110 unless noted.",
    nl: "De statuscodes die je moet kennen, de stap die elk ervan bezit, en wanneer het hier het juiste antwoord is. Sectienummers zijn uit RFC 9110 tenzij anders vermeld.",
  },
  statusColumn: { en: "Status", nl: "Status" },
  decidedByColumn: { en: "Chosen by", nl: "Gekozen door" },
  whenColumn: { en: "When it is right", nl: "Wanneer het klopt" },
  status3: {
    en: "Three of these are worth pinning down, because they are the ones teams argue about. 201 in section 15.3.2 says the primary resource created is identified by the Location header, or by the target address when there is no Location, so a create without a Location is a create the client cannot follow. 405 in section 15.5.6 says the server must send an Allow header listing the methods the address does take, which most frameworks will do for you and most hand rolled routers will not. And 409 in section 15.5.10 is for a request that conflicts with the current state of the resource, which is exactly what an empty cart or a sold out product is, and is not what a badly typed field is.",
    nl: "Drie hiervan zijn het vastleggen waard, want daar wordt in teams over gediscussieerd. 201 in sectie 15.3.2 zegt dat de belangrijkste aangemaakte bron wordt aangewezen door de Location-header, of door het doeladres als er geen Location is, dus een create zonder Location is een create die de client niet kan volgen. 405 in sectie 15.5.6 zegt dat de server een Allow-header moet sturen met de methodes die het adres wel aanneemt, wat de meeste frameworks voor je doen en de meeste zelfgebouwde routers niet. En 409 in sectie 15.5.10 is voor een verzoek dat botst met de huidige toestand van de bron, wat precies is wat een lege winkelwagen of een uitverkocht product is, en niet wat een verkeerd getypeerd veld is.",
  },
  status4: {
    en: "Two of the codes here live outside RFC 9110. 429 comes from RFC 6585 section 4, and Cache-Control comes from RFC 9111 section 5.2. The 304 answer they work with is back in RFC 9110 section 15.4.5, which also says the answer carries no body and does carry the validators. That mixture is normal, and it is worth knowing which document owns which sentence when someone asks you to prove it.",
    nl: "Twee van de codes hier wonen buiten RFC 9110. 429 komt uit RFC 6585 sectie 4, en Cache-Control komt uit RFC 9111 sectie 5.2. Het 304-antwoord waarmee ze werken staat weer in RFC 9110 sectie 15.4.5, waar ook staat dat het antwoord geen body draagt en de validators wel. Die vermenging is normaal, en het is nuttig te weten welk document welke zin bezit als iemand je vraagt het te bewijzen.",
  },

  problemTitle: { en: "One shape for every failure", nl: "Eén vorm voor elke storing" },
  problem1: {
    en: "A status code says what kind of thing went wrong. It does not say which product ran out or which field was refused. RFC 9457 fills that gap with a small JSON object under the media type application/problem+json, and section 3.1 names five members that every problem document may carry.",
    nl: "Een statuscode zegt wat voor soort ding er misging. Hij zegt niet welk product op was of welk veld werd geweigerd. RFC 9457 vult dat gat met een klein JSON-object onder het mediatype application/problem+json, en sectie 3.1 noemt vijf leden die elk problem-document mag dragen.",
  },
  problemType: {
    en: "A URI reference that identifies the kind of problem. It is the stable part, the one a client may switch on. When it is missing it means about:blank, which section 4.2 defines as the type that says nothing beyond the status code.",
    nl: "Een URI-verwijzing die het soort probleem aanwijst. Dat is het stabiele deel, waar een client op mag schakelen. Als het ontbreekt betekent het about:blank, dat sectie 4.2 definieert als het type dat niets zegt bovenop de statuscode.",
  },
  problemTitleMember: {
    en: "A short human readable summary of the type. It should not change per occurrence, other than for translation, so it belongs to the type and not to the incident.",
    nl: "Een korte, leesbare samenvatting van het type. Die hoort niet per geval te veranderen, behalve voor vertaling, dus hij hoort bij het type en niet bij het voorval.",
  },
  problemStatus: {
    en: "The status code, repeated inside the body. The RFC calls it advisory and adds that the generator must use the same code in the real response, so that software which knows nothing about problem details still behaves correctly.",
    nl: "De statuscode, herhaald in de body. De RFC noemt dat adviserend en voegt toe dat de opsteller dezelfde code in het echte antwoord moet gebruiken, zodat software die niets van problem details weet zich toch correct gedraagt.",
  },
  problemDetail: {
    en: "A sentence about this one occurrence. This is where the product name and the stock go, and it is meant for a person reading a log, not for a switch statement.",
    nl: "Een zin over dit ene voorval. Hier gaan de productnaam en de voorraad in, en het is bedoeld voor een mens die een log leest, niet voor een switch.",
  },
  problemInstance: {
    en: "A URI reference for this occurrence. The address the request went to is a reasonable value, and a correlation identifier is a better one when you have it.",
    nl: "Een URI-verwijzing voor dit voorval. Het adres waar het verzoek heen ging is een redelijke waarde, en een correlatie-identificatie is een betere als je die hebt.",
  },
  problem2: {
    en: "Section 3.2 then allows extension members, which is what makes the format usable. The store adds a machine readable code, the field the rule refused, and the full list when more than one rule fired at once. Those are the same codes the GraphQL schema publishes, so a client that already knows OUT_OF_STOCK does not learn a second vocabulary.",
    nl: "Sectie 3.2 staat vervolgens uitbreidingsleden toe, en dat is wat het formaat bruikbaar maakt. De winkel voegt een machineleesbare code toe, het veld dat de regel weigerde, en de volledige lijst als er meer dan één regel tegelijk afging. Dat zijn dezelfde codes die het GraphQL-schema publiceert, dus een client die OUT_OF_STOCK al kent, hoeft geen tweede woordenlijst te leren.",
  },
  problem3: {
    en: "Here is a real refusal from the running adapter, asking for ninety nine of a jacket the store has eight of.",
    nl: "Hier is een echte weigering uit de draaiende adapter, die om negenennegentig jassen vraagt terwijl de winkel er acht heeft.",
  },
  problem4: {
    en: "One small file produces every one of those documents. The mapping from a domain refusal to a status code lives in a single switch, which means the rule is reviewable in one place and never spread across handlers.",
    nl: "Eén klein bestand maakt al die documenten. De vertaling van een domeinweigering naar een statuscode staat in één switch, en dat betekent dat de regel op één plek te reviewen is en nooit verspreid over handlers.",
  },
  problemCalloutTitle: {
    en: "The type URI does not have to resolve",
    nl: "De type-URI hoeft niet te bestaan",
  },
  problemCalloutBody: {
    en: "RFC 9457 asks the type to be a URI reference, not a page you have to host. When it does resolve it should serve human readable documentation, and when it does not it still works as an identifier. Pick a namespace you control and keep the values stable, because a client that switches on the type is depending on the string and not on the website.",
    nl: "RFC 9457 vraagt om een URI-verwijzing als type, niet om een pagina die je moet hosten. Als hij wel bestaat hoort hij leesbare documentatie te serveren, en als hij niet bestaat werkt hij nog steeds als identificatie. Kies een namespace die je zelf beheert en houd de waarden stabiel, want een client die op het type schakelt hangt aan de tekenreeks en niet aan de website.",
  },

  overHttpTitle: { en: "GraphQL over HTTP, and the status code question", nl: "GraphQL over HTTP, en de vraag naar de statuscode" },
  overHttp1: {
    en: "The GraphQL specification describes a language and an execution model. It says nothing about HTTP. That gap is filled by the GraphQL over HTTP work, which is a draft, and by the habits of the servers people actually run. Both matter, and they do not fully agree.",
    nl: "De GraphQL-specificatie beschrijft een taal en een uitvoeringsmodel. Over HTTP zegt hij niets. Dat gat wordt gevuld door het werk aan GraphQL over HTTP, dat een concept is, en door de gewoontes van de servers die mensen echt draaien. Allebei doen ze ertoe, en ze zijn het niet helemaal eens.",
  },
  overHttp2: {
    en: "Start with what the running store does. A mutation that the domain refuses answers 200, and the refusal sits in the payload beside the data the client asked for. Nothing failed at the HTTP level, because from the protocol's point of view the operation ran and produced an answer.",
    nl: "Begin bij wat de draaiende winkel doet. Een mutation die het domein weigert antwoordt 200, en de weigering staat in de payload naast de data waar de client om vroeg. Op HTTP-niveau ging er niets mis, want vanuit het protocol gezien liep de operatie en leverde hij een antwoord op.",
  },
  overHttp3: {
    en: "Now ask for a field that does not exist. The server never runs the operation, there is no data member at all, and the answer is a 400. That is not a special case somebody configured, it is what the media type asks for, and the extensions even point at the section of the September 2025 specification that was broken.",
    nl: "Vraag nu om een veld dat niet bestaat. De server voert de operatie nooit uit, er is helemaal geen data-lid, en het antwoord is een 400. Dat is geen speciaal geval dat iemand heeft ingesteld, het is wat het mediatype vraagt, en de extensions wijzen zelfs de sectie van de specificatie van september 2025 aan die geschonden werd.",
  },
  overHttp4: {
    en: "The pattern behind those two answers is the whole of the draft, read on 7 September 2026 as a stage 2 document. Under the media type application/graphql-response+json it asks for four things.",
    nl: "Het patroon achter die twee antwoorden is het hele concept, op 7 september 2026 gelezen als document in fase 2. Onder het mediatype application/graphql-response+json vraagt het om vier dingen.",
  },
  overHttpRule1: {
    en: "A response with a non null data member must carry a 2xx status, and a response with data and no errors should be a plain 200.",
    nl: "Een antwoord met een data-lid dat niet null is moet een 2xx-status dragen, en een antwoord met data en zonder errors hoort een gewone 200 te zijn.",
  },
  overHttpRule2: {
    en: "A response with data and errors together should be answered with 294, a status the draft introduces for exactly this case. Servers in the field almost all still answer 200 here, so treat this one as the direction of travel and not as something you can rely on today.",
    nl: "Een antwoord met data en errors samen hoort met 294 beantwoord te worden, een status die het concept juist hiervoor introduceert. Servers in het veld antwoorden hier bijna allemaal nog met 200, dus zie deze als de richting en niet als iets waar je vandaag op kunt bouwen.",
  },
  overHttpRule3: {
    en: "A response whose data is null while errors is present is a failure, and gets whichever 4xx or 5xx fits the reason.",
    nl: "Een antwoord waarvan data null is terwijl errors aanwezig is, is een storing, en krijgt de 4xx of 5xx die bij de reden past.",
  },
  overHttpRule4: {
    en: "A request the server could not accept at all, including a document that fails validation, is a 400. That is the answer we just saw.",
    nl: "Een verzoek dat de server helemaal niet kon aannemen, inclusief een document dat de validatie niet haalt, is een 400. Dat is het antwoord dat we net zagen.",
  },
  overHttp5: {
    en: "Which of the two behaviours you get depends on what the client asks for. Under the older application/json the answer is almost always 200 whatever happened, and under application/graphql-response+json the rules above apply. The store front asks for both, in that order, so it gets the newer behaviour where the server offers it and keeps working where it does not.",
    nl: "Welk van beide gedragingen je krijgt, hangt af van wat de client vraagt. Onder het oudere application/json is het antwoord vrijwel altijd 200 wat er ook gebeurde, en onder application/graphql-response+json gelden de regels hierboven. De winkel vraagt om allebei, in die volgorde, dus krijgt hij het nieuwere gedrag waar de server dat aanbiedt en blijft hij werken waar dat niet zo is.",
  },
  overHttp6: {
    en: "The practical consequence is the part people miss. In REST a monitoring dashboard counting non 2xx answers sees your failures for free. In GraphQL that same dashboard sees a flat wall of 200s, and the errors it should be counting are inside a body it does not parse. Either you report them yourself from the client, or you do not have them. That is a build decision, not a discovery you want to make during an incident.",
    nl: "Het praktische gevolg is het deel dat mensen missen. In REST ziet een monitoringdashboard dat niet-2xx-antwoorden telt jouw storingen gratis. In GraphQL ziet datzelfde dashboard een vlakke muur van 200's, en de fouten die het zou moeten tellen zitten in een body die het niet uitleest. Of je rapporteert ze zelf vanuit de client, of je hebt ze niet. Dat is een bouwbeslissing, geen ontdekking die je tijdens een incident wilt doen.",
  },

  keyTitle: { en: "Idempotency in GraphQL", nl: "Idempotentie in GraphQL" },
  key1: {
    en: "GraphQL gives you no idempotent write. Every mutation is a POST, and POST is not idempotent, so a client that loses its answer has no safe way to ask again. The usual fix is a key the client makes up once and sends with the attempt, and the store puts that key in the schema where a client can see it.",
    nl: "GraphQL geeft je geen idempotente schrijfactie. Elke mutation is een POST, en POST is niet idempotent, dus een client die zijn antwoord kwijtraakt heeft geen veilige manier om het opnieuw te vragen. De gebruikelijke oplossing is een sleutel die de client één keer verzint en met de poging meestuurt, en de winkel zet die sleutel in het schema waar een client hem kan zien.",
  },
  key2: {
    en: "Read that description again, because it is doing something unusual. It says what the argument is for, and it also says which backends actually honour it. The federated graph stores the key with the order and hands back the order it already placed. The three monoliths accept the argument and ignore it, because one database transaction already makes their checkout atomic. Writing that down is cheaper than letting a client find it out.",
    nl: "Lees die beschrijving nog eens, want er gebeurt iets ongebruikelijks. Er staat waar het argument voor is, en er staat ook welke backends het echt honoreren. De gefedereerde graaf bewaart de sleutel bij de bestelling en geeft de bestelling terug die hij al plaatste. De drie monolieten nemen het argument aan en negeren het, want één databasetransactie maakt hun afrekening al atomair. Dat opschrijven is goedkoper dan een client het laten ontdekken.",
  },
  key3: {
    en: "The federated implementation is twenty lines and covers both races that matter. A second call after the first finished finds the stored order and answers with it. A second call that arrives while the first is still running gets handed the same promise, which is the double click case that a stored key alone does not catch.",
    nl: "De gefedereerde implementatie is twintig regels en dekt beide races die ertoe doen. Een tweede aanroep nadat de eerste klaar was, vindt de bewaarde bestelling en antwoordt ermee. Een tweede aanroep die binnenkomt terwijl de eerste nog loopt, krijgt dezelfde promise aangereikt, en dat is het geval van de dubbelklik dat een bewaarde sleutel alleen niet vangt.",
  },
  key4: {
    en: "In the REST facet the same value travels as an Idempotency-Key header, which is where a client will look for it, and the C# backend behaves the way its schema promises. The first checkout answers 201 with the order at its Location, and the second answers 409 because the cart it wanted to order is empty now. That is a defensible answer and it is not the same as replaying the order, so a client that needs the replay needs the federated graph or an equivalent store of keys.",
    nl: "In de REST-facet reist dezelfde waarde als een Idempotency-Key-header, en daar zoekt een client hem ook, en de C#-backend gedraagt zich zoals zijn schema belooft. De eerste afrekening antwoordt 201 met de bestelling op zijn Location, en de tweede antwoordt 409 omdat de winkelwagen die hij wilde bestellen nu leeg is. Dat is een verdedigbaar antwoord en het is niet hetzelfde als de bestelling opnieuw afspelen, dus een client die dat afspelen nodig heeft, heeft de gefedereerde graaf nodig of een gelijkwaardige opslag van sleutels.",
  },
  keyCalloutTitle: { en: "Say which answer a repeat gets", nl: "Zeg welk antwoord een herhaling krijgt" },
  keyCalloutBody: {
    en: "There are three defensible answers to a repeated checkout, and all three appear in the wild: replay the original answer, refuse with a conflict, or place a second order. The bug is never which one you picked. The bug is a contract that does not say, and a client that guesses.",
    nl: "Er zijn drie verdedigbare antwoorden op een herhaalde afrekening, en alle drie komen ze voor: het oorspronkelijke antwoord opnieuw geven, weigeren met een conflict, of een tweede bestelling plaatsen. De fout is nooit welke je koos. De fout is een contract dat het niet zegt, en een client die gokt.",
  },

  cachingTitle: { en: "Caching and conditional requests", nl: "Caching en voorwaardelijke verzoeken" },
  caching1: {
    en: "This is the part of HTTP that GraphQL gives up, and it is worth seeing what is being given up. A GET can carry a validator, the client can send it back, and the server can answer with no body at all. The categories in this store change rarely, so the endpoint computes an entity tag over the answer and honours If-None-Match.",
    nl: "Dit is het deel van HTTP dat GraphQL opgeeft, en het is de moeite waard om te zien wat er wordt opgegeven. Een GET kan een validator dragen, de client kan die terugsturen, en de server kan antwoorden zonder enige body. De categorieën in deze winkel veranderen zelden, dus het endpoint berekent een entity tag over het antwoord en honoreert If-None-Match.",
  },
  caching2: {
    en: "Two requests, and the second one costs almost nothing on the wire. ETag is defined in RFC 9110 section 8.8.3, If-None-Match in section 13.1.2, and the 304 they produce in section 15.4.5. Cache-Control belongs to RFC 9111 section 5.2, which is the companion document on caching.",
    nl: "Twee verzoeken, en de tweede kost bijna niets op de lijn. ETag staat in RFC 9110 sectie 8.8.3, If-None-Match in sectie 13.1.2, en de 304 die ze opleveren in sectie 15.4.5. Cache-Control hoort bij RFC 9111 sectie 5.2, het bijbehorende document over caching.",
  },
  caching3: {
    en: "The same mechanism carries the other way for writes. A client that read a resource with an entity tag can send If-Match on the update, and the server answers 412 when someone else changed it in between. That turns a lost update into a refusal the client can handle, and it costs one header.",
    nl: "Hetzelfde mechanisme werkt de andere kant op bij schrijfacties. Een client die een bron met een entity tag las, kan If-Match meesturen bij de wijziging, en de server antwoordt 412 als iemand anders er ondertussen aan zat. Zo wordt een verloren wijziging een weigering die de client kan afhandelen, en het kost één header.",
  },
  caching4: {
    en: "GraphQL sends every operation as a POST to one address, so none of this applies out of the box. The known route back is persisted queries, where the client sends a hash of a document the server already knows and the request becomes a GET with the hash in the query string. That is a cacheable address again, and it costs a build step and a registry of documents. Worth it for a public read heavy graph, and usually not worth it for an internal one.",
    nl: "GraphQL stuurt elke operatie als een POST naar één adres, dus hier geldt standaard niets van. De bekende weg terug zijn persisted queries, waarbij de client een hash stuurt van een document dat de server al kent en het verzoek een GET wordt met de hash in de querystring. Dat is weer een cachebaar adres, en het kost een bouwstap en een register van documenten. De moeite waard voor een publieke graaf die veel gelezen wordt, en meestal niet voor een interne.",
  },

  restFitsTitle: { en: "When REST fits", nl: "Wanneer REST past" },
  restFits1: {
    en: "Five situations where the address based model earns its place, and where choosing the other one means building the same behaviour by hand.",
    nl: "Vijf situaties waarin het adresmodel zijn plek verdient, en waarin de andere keuze betekent dat je hetzelfde gedrag met de hand bouwt.",
  },
  restFitsIdentityLabel: { en: "Things with their own identity.", nl: "Dingen met een eigen identiteit." },
  restFitsIdentityBody: {
    en: "An order has an address, that address can be linked to, bookmarked, logged and put in an email. When the resource is the unit people talk about, giving it a URL is not overhead.",
    nl: "Een bestelling heeft een adres, en naar dat adres kun je linken, het bewaren, het loggen en het in een mail zetten. Als de bron de eenheid is waar mensen het over hebben, is een URL geven geen overhead.",
  },
  restFitsPublicLabel: { en: "A contract that leaves the building.", nl: "Een contract dat het gebouw verlaat." },
  restFitsPublicBody: {
    en: "A partner integration, a public API, a system you do not control. An OpenAPI document plus curl is a complete onboarding, and every language has a client generator for it already.",
    nl: "Een koppeling met een partner, een publieke API, een systeem dat je niet beheert. Een OpenAPI-document plus curl is een complete introductie, en elke taal heeft er al een clientgenerator voor.",
  },
  restFitsCacheLabel: { en: "Reads that repeat.", nl: "Leesacties die zich herhalen." },
  restFitsCacheBody: {
    en: "A catalogue, a price list, a document that many people fetch and few people change. Entity tags and Cache-Control get you a content delivery network and a browser cache without writing any code.",
    nl: "Een catalogus, een prijslijst, een document dat veel mensen ophalen en weinigen wijzigen. Entity tags en Cache-Control leveren je een contentdeliverynetwerk en een browsercache op zonder dat je code schrijft.",
  },
  restFitsFilesLabel: { en: "Bytes, not fields.", nl: "Bytes, geen velden." },
  restFitsFilesBody: {
    en: "Uploads, downloads, ranges, resumable transfers, streams. HTTP has answers for all of these and GraphQL needs a second channel for every one.",
    nl: "Uploads, downloads, ranges, hervatbare overdrachten, streams. HTTP heeft hier overal een antwoord op en GraphQL heeft voor elk daarvan een tweede kanaal nodig.",
  },
  restFitsSimpleLabel: { en: "Clients you cannot update.", nl: "Clients die je niet kunt bijwerken." },
  restFitsSimpleBody: {
    en: "A shell script, an appliance, a system somebody wrote in 2014. They can all send a POST with a JSON body. Asking them to compose a query document is asking for a rewrite.",
    nl: "Een shellscript, een apparaat, een systeem dat iemand in 2014 schreef. Ze kunnen allemaal een POST met een JSON-body sturen. Vragen om een querydocument op te stellen is vragen om een herbouw.",
  },
  restFits2: {
    en: "At Ortec I settled the REST contracts with the backend teams on OpenAPI 3.0, which kept the frontend and the microservices in step while both sides changed. At Omniplan a legacy AngularJS and .NET application moved to Angular 9 with a .NET Core REST and gRPC layer under it. At Transdev the whole point was an address based gateway: a generic .NET Core API layer over a Delphi backend that modern applications could not reach, with authentication and authorisation at application level so later channels could connect to the same door.",
    nl: "Bij Ortec stemde ik de REST-contracten met de backendteams af op OpenAPI 3.0, waardoor de frontend en de microservices gelijk opliepen terwijl beide kanten veranderden. Bij Omniplan ging een verouderde AngularJS- en .NET-applicatie naar Angular 9 met een .NET Core-laag met REST en gRPC eronder. Bij Transdev was een gateway op adressen juist het hele punt: een generieke .NET Core-API-laag over een Delphi-backend die moderne applicaties niet konden bereiken, met authenticatie en autorisatie op applicatieniveau, zodat latere kanalen op dezelfde deur konden aansluiten.",
  },

  graphFitsTitle: { en: "When GraphQL fits", nl: "Wanneer GraphQL past" },
  graphFits1: {
    en: "Four situations where a schema earns its place, and where the address model starts multiplying endpoints.",
    nl: "Vier situaties waarin een schema zijn plek verdient, en waarin het adresmodel endpoints begint te vermenigvuldigen.",
  },
  graphFitsScreensLabel: { en: "Many screens over one graph.", nl: "Veel schermen over één graaf." },
  graphFitsScreensBody: {
    en: "A store front, a mobile app and an internal tool all want the same products in different shapes. With addresses you either build an endpoint per screen or send every screen everything. With a schema each screen asks for its own fields.",
    nl: "Een winkel, een mobiele app en een intern hulpmiddel willen allemaal dezelfde producten in een andere vorm. Met adressen bouw je een endpoint per scherm of stuur je elk scherm alles. Met een schema vraagt elk scherm om zijn eigen velden.",
  },
  graphFitsShapeLabel: { en: "A front end that composes its own shape.", nl: "Een frontend die zijn eigen vorm samenstelt." },
  graphFitsShapeBody: {
    en: "Each component declares the fields it renders, the page composes one document from all of them, and the types run from the query into the component without a hand written mapping in between.",
    nl: "Elk component verklaart de velden die het toont, de pagina stelt er één document uit samen, en de types lopen van de query naar het component zonder een met de hand geschreven vertaling ertussen.",
  },
  graphFitsTeamsLabel: { en: "Several teams behind one contract.", nl: "Meerdere teams achter één contract." },
  graphFitsTeamsBody: {
    en: "Federation lets each team own its own subgraph and its own database while the client sees one schema. Doing that with addresses means writing the gateway that composes them.",
    nl: "Federatie laat elk team zijn eigen subgraph en zijn eigen database bezitten terwijl de client één schema ziet. Datzelfde met adressen doen, betekent dat je de gateway schrijft die ze samenstelt.",
  },
  graphFitsPartialLabel: { en: "Answers that are allowed to be partial.", nl: "Antwoorden die gedeeltelijk mogen zijn." },
  graphFitsPartialBody: {
    en: "One field can fail while the rest of the page still renders, because data and errors travel side by side. That is a real advantage and it is also the trap, because a client that treats any error as a total failure throws away the data it was given.",
    nl: "Eén veld kan mislukken terwijl de rest van de pagina gewoon rendert, want data en fouten reizen naast elkaar. Dat is een echt voordeel en tegelijk de valkuil, want een client die elke fout als een totale mislukking behandelt, gooit de data weg die hij net kreeg.",
  },
  graphFits2Before: {
    en: "That last one is the one I have spent the most time on. At bol.com GraphQL was the contract between frontend and backend, and when a field made the interface awkward I took the change to the backend engineers and did not work around it on my side. One of the changes I made there was rewriting an all or nothing handler so a partial response still shows what is there while every error reaches the error tracker. The discipline that makes a schema hold up over time is ",
    nl: "Aan dat laatste heb ik de meeste tijd besteed. Bij bol.com was GraphQL het contract tussen frontend en backend, en als een veld de interface onhandig maakte, bracht ik de wijziging naar de backend-engineers en werkte ik er aan mijn kant niet omheen. Een van de wijzigingen die ik daar maakte, was het herschrijven van een alles-of-nietshandler, zodat een gedeeltelijk antwoord toch laat zien wat er is terwijl elke fout bij de foutentracker aankomt. De discipline waardoor een schema het op termijn volhoudt, staat in ",
  },
  contractArticleLink: {
    en: "the article on GraphQL as a contract",
    nl: "het artikel over GraphQL als contract",
  },
  graphFits2After: {
    en: ", which is the companion piece to this one.",
    nl: ", het zusterartikel van dit stuk.",
  },

  restBuildTitle: { en: "The same operations as REST", nl: "Dezelfde operaties als REST" },
  restBuild1: {
    en: "From here on it is a walkthrough. Everything below runs, and you can build it from an empty folder by following the blocks in order. The store you end up with serves GraphQL at /graphql and the same five operations at /api, over one application layer.",
    nl: "Vanaf hier is het een doorloop. Alles hieronder draait, en je kunt het vanuit een lege map bouwen door de blokken op volgorde te volgen. De winkel die je overhoudt, serveert GraphQL op /graphql en dezelfde vijf operaties op /api, over één applicatielaag.",
  },
  restBuild2: {
    en: "Start with the project. It is a class library and not a web project, because the host already exists and this adapter only contributes routes to it.",
    nl: "Begin met het project. Het is een classlibrary en geen webproject, want de host bestaat al en deze adapter draagt er alleen routes aan bij.",
  },
  restBuild3: {
    en: "The project file is four lines of substance. The framework reference is what lets a library use the ASP.NET Core types without being an application, and the single project reference is the rule of the hexagon written down. This adapter may see the use cases. It may not see the persistence, the security or the GraphQL adapter, and the compiler enforces that.",
    nl: "Het projectbestand is vier regels inhoud. De frameworkverwijzing is wat een bibliotheek toestaat de ASP.NET Core-types te gebruiken zonder een applicatie te zijn, en de ene projectverwijzing is de regel van de zeshoek, opgeschreven. Deze adapter mag de use cases zien. De persistentie, de beveiliging en de GraphQL-adapter mag hij niet zien, en de compiler handhaaft dat.",
  },
  restBuild4: {
    en: "Next, who is asking. The application layer expects a Visitor, which is a small record with a customer id, a session id and an anonymous cart id. The GraphQL adapter builds one from the claims and the cart cookie, and the REST adapter has to build the same one from the same places, so an anonymous cart started at /api is still there at /graphql.",
    nl: "Dan: wie het vraagt. De applicatielaag verwacht een Visitor, een klein record met een klant-id, een sessie-id en een anoniem winkelwagen-id. De GraphQL-adapter bouwt er een uit de claims en de winkelwagencookie, en de REST-adapter moet dezelfde bouwen uit dezelfde plekken, zodat een anonieme winkelwagen die op /api begon er op /graphql nog steeds is.",
  },
  restBuild5: {
    en: "Then the shapes that go over the wire. A domain type is not a response body, because a response body is a promise to a client and a domain type changes when a rule changes. These records are that seam, and every one of them is a projection of something the use case already returned.",
    nl: "Dan de vormen die over de lijn gaan. Een domeintype is geen responsbody, want een responsbody is een belofte aan een client en een domeintype verandert als een regel verandert. Deze records zijn die naad, en elk ervan is een projectie van iets wat de use case toch al teruggaf.",
  },
  restBuild6: {
    en: "Now the routes. Five of them, one method each, and every one is the same three steps: build the visitor, call the use case, turn the outcome into a status code. The delete is the interesting one, and the categories route is the one that carries the entity tag from the caching section.",
    nl: "Nu de routes. Vijf stuks, elk één methode, en elk ervan zijn dezelfde drie stappen: bouw de bezoeker, roep de use case aan, maak van de uitkomst een statuscode. De verwijdering is de interessante, en de categorieënroute is degene die de entity tag uit de sectie over caching draagt.",
  },
  restBuild7: {
    en: "The host gains two lines. One using and one call, in the middleware order that already existed.",
    nl: "De host krijgt er twee regels bij. Eén using en één aanroep, in de middlewarevolgorde die er al was.",
  },
  restBuild8: {
    en: "That is the whole adapter. Build it and run the host, and both doors are open.",
    nl: "Dat is de hele adapter. Bouw hem en draai de host, en beide deuren staan open.",
  },
  restBuild9: {
    en: "Here is one request per operation with the answer it gives, taken from the running host. Read the status lines first, and the bodies second. Every one of them was chosen by a different stage of the request.",
    nl: "Hier is één verzoek per operatie met het antwoord dat het geeft, uit de draaiende host. Lees eerst de statusregels en daarna de bodies. Elk ervan is door een andere stap van het verzoek gekozen.",
  },
  restBuild10: {
    en: "The claims a walkthrough makes are worth nothing without a test that holds them. These eight run against the real host through WebApplicationFactory, with a fresh seed per test, and they assert the status codes themselves.",
    nl: "De beweringen van een doorloop zijn niets waard zonder een test die ze vasthoudt. Deze acht draaien tegen de echte host via WebApplicationFactory, met een verse seed per test, en ze controleren de statuscodes zelf.",
  },
  restBuild11: {
    en: "The run is quick because the database is SQLite in a temporary file and the seed is small.",
    nl: "De run is snel, want de database is SQLite in een tijdelijk bestand en de seed is klein.",
  },
  restBuild12: {
    en: "The Kotlin backend has the same use cases under different names, so the same adapter is the same shape. Spring gives you ProblemDetail out of the box, which follows RFC 9457, so the mapping from a domain refusal to a problem document is a switch and nothing else.",
    nl: "De Kotlin-backend heeft dezelfde use cases onder andere namen, dus dezelfde adapter heeft dezelfde vorm. Spring geeft je ProblemDetail standaard, dat RFC 9457 volgt, dus de vertaling van een domeinweigering naar een problem-document is een switch en verder niets.",
  },
  restBuild13: {
    en: "On Node.js the ordering subgraph already runs an Express 5 server, because Apollo Server 5 ships no Express integration of its own and the graph is mounted on a route. So a REST facet there is one more router beside the one that already exists, over the same checkout use case with its idempotency key.",
    nl: "Op Node.js draait de ordering-subgraph al een Express 5-server, want Apollo Server 5 levert geen eigen Express-integratie en de graaf hangt aan een route. Een REST-facet is daar dus één router extra naast de router die er al is, over dezelfde afrekening met zijn idempotentiesleutel.",
  },
  restBuild14: {
    en: "Three languages, three frameworks, one shape. That is not a coincidence, it is what falls out when the use case is a class with one method and the adapter only translates. The thing worth copying is not the code. It is that the mapping from a refusal to a status code lives in exactly one file per backend.",
    nl: "Drie talen, drie frameworks, één vorm. Dat is geen toeval, het is wat eruit valt als de use case een klasse met één methode is en de adapter alleen vertaalt. Wat het kopiëren waard is, is niet de code. Het is dat de vertaling van een weigering naar een statuscode in precies één bestand per backend woont.",
  },

  graphBuildTitle: { en: "The same operations as GraphQL", nl: "Dezelfde operaties als GraphQL" },
  graphBuild1: {
    en: "The GraphQL side of the same store is already built, and the contract is one file that all four backends serve. Notice how much of the behaviour lives in the descriptions and not in the types. The types say what may be sent, and the descriptions say what happens when it is.",
    nl: "De GraphQL-kant van dezelfde winkel is al gebouwd, en het contract is één bestand dat alle vier de backends serveren. Let op hoeveel van het gedrag in de beschrijvingen woont en niet in de types. De types zeggen wat er gestuurd mag worden, en de beschrijvingen zeggen wat er dan gebeurt.",
  },
  graphBuild2: {
    en: "The C# resolvers are the mirror of the REST routes. Same use cases, same visitor, and a payload where the REST route had a status code. A refusal is a value in that payload and never an exception, which is why the transport may answer 200.",
    nl: "De C#-resolvers zijn de spiegel van de REST-routes. Dezelfde use cases, dezelfde bezoeker, en een payload waar de REST-route een statuscode had. Een weigering is een waarde in die payload en nooit een exception, en daarom mag het transport 200 antwoorden.",
  },
  graphBuild3: {
    en: "Kotlin with Spring for GraphQL says the same thing in fewer characters. A sealed result narrows in a when, and the compiler checks that both branches produce a payload.",
    nl: "Kotlin met Spring for GraphQL zegt hetzelfde in minder tekens. Een sealed result versmalt in een when, en de compiler controleert dat beide takken een payload opleveren.",
  },
  graphBuild4: {
    en: "The Node resolver is the same three lines again, with one extra job. It answers the entity reference, which is how the gateway resolves an Order that another subgraph mentioned but does not own.",
    nl: "De Node-resolver is weer dezelfde drie regels, met één extra taak. Hij beantwoordt de entity reference, en zo lost de gateway een Order op die een andere subgraph noemde maar niet bezit.",
  },
  graphBuild5: {
    en: "Put the two adapters next to each other and the difference is smaller than the argument suggests. Both are thin. Both translate one way in and one way out. The real difference is what the client on the other side has to do with the answer, and that is the next section.",
    nl: "Zet de twee adapters naast elkaar en het verschil is kleiner dan de discussie doet vermoeden. Beide zijn dun. Beide vertalen één kant in en één kant uit. Het echte verschil is wat de client aan de andere kant met het antwoord moet doen, en dat is de volgende sectie.",
  },

  frontTitle: { en: "The React Router front against both", nl: "De React Router-winkel tegen allebei" },
  front1Before: {
    en: "The store front is React Router 8 in framework mode, so a read is a loader and a write is an action. The routing itself is the subject of ",
    nl: "De winkel is React Router 8 in framework mode, dus een lees is een loader en een schrijf is een action. De routering zelf is het onderwerp van ",
  },
  routingArticleLink: {
    en: "the article on routes, loaders and actions",
    nl: "het artikel over routes, loaders en actions",
  },
  front1After: {
    en: ". What matters here is the checkout, because it is the one screen where the idempotency key, the refusal and the redirect all meet. This is the GraphQL version, as it runs.",
    nl: ". Wat hier telt is de afrekening, want dat is het ene scherm waar de idempotentiesleutel, de weigering en de doorverwijzing samenkomen. Dit is de GraphQL-versie, zoals hij draait.",
  },
  front2: {
    en: "Three things in that file are worth naming. The key is minted in the loader and not in the action, so a reload gets a new key and a resubmit of the same form gets the old one. A refusal comes back as data and renders, while only a failure the screen cannot handle is thrown. And the redirect after a successful order is a throw, which is how a loader or an action hands control back to the router.",
    nl: "Drie dingen in dat bestand zijn het benoemen waard. De sleutel wordt in de loader gemaakt en niet in de action, dus een herlaadbeurt krijgt een nieuwe sleutel en een herverzending van hetzelfde formulier de oude. Een weigering komt terug als data en wordt getoond, terwijl alleen een storing die het scherm niet aankan wordt gegooid. En de doorverwijzing na een geslaagde bestelling is een throw, en zo geeft een loader of action de besturing terug aan de router.",
  },
  front3: {
    en: "The refusals themselves become sentences in one small table. The keys are the codes from the schema, which are the same codes the problem documents carry, so this file does not change when the transport does.",
    nl: "De weigeringen zelf worden zinnen in één kleine tabel. De sleutels zijn de codes uit het schema, dezelfde codes die de problem-documenten dragen, dus dit bestand verandert niet als het transport verandert.",
  },
  front4: {
    en: "Against the REST facet the same screen keeps its shape and moves its reading. The status line is now the first thing the action looks at, a 201 carries the next address in a header where the mutation carried an id in a payload, and a problem document has to be told apart from a real outage. Everything below the action is untouched, because the component was already rendering a list of sentences.",
    nl: "Tegen de REST-facet houdt hetzelfde scherm zijn vorm en verplaatst het zijn aflezing. De statusregel is nu het eerste waar de action naar kijkt, een 201 draagt het volgende adres in een header waar de mutation een id in een payload droeg, en een problem-document moet worden onderscheiden van een echte storing. Alles onder de action blijft ongemoeid, want het component toonde toch al een lijst zinnen.",
  },
  front5: {
    en: "That is the difference at the client, in one paragraph. In GraphQL you read the payload and decide what the errors member means. In REST you read the status line first and the body second. Neither is harder. What is harder is a codebase that does both without agreeing which one it is doing, which is why the two versions of this action live in different files and not behind a flag.",
    nl: "Dat is het verschil bij de client, in één alinea. In GraphQL lees je de payload en bepaal je wat het errors-lid betekent. In REST lees je eerst de statusregel en daarna de body. Geen van beide is moeilijker. Wat wel moeilijker is, is een codebase die allebei doet zonder het eens te zijn over welke van de twee, en daarom wonen de twee versies van deze action in aparte bestanden en niet achter een vlag.",
  },

  recordTitle: { en: "Where this comes from", nl: "Waar dit vandaan komt" },
  record1: {
    en: "I have settled contracts on both sides of this article, and the pattern that keeps repeating is that the argument is rarely about the style. At Ortec the contracts were REST on OpenAPI 3.0 and the work was keeping the frontend and the microservices in step while both sides changed. At bol.com the contract is GraphQL and the work was the same: reading what the schema promises, taking a reshape to the team that owns it, and making sure a partial answer still renders.",
    nl: "Ik heb aan beide kanten van dit artikel contracten afgestemd, en het patroon dat zich blijft herhalen is dat de discussie zelden over de stijl gaat. Bij Ortec waren de contracten REST op OpenAPI 3.0 en was het werk om de frontend en de microservices gelijk op te laten lopen terwijl beide kanten veranderden. Bij bol.com is het contract GraphQL en was het werk hetzelfde: lezen wat het schema belooft, een hervorming neerleggen bij het team dat het bezit, en zorgen dat een gedeeltelijk antwoord toch rendert.",
  },
  record2: {
    en: "At Opinity the interface was Angular on ASP.NET Core, and validation sat in the interface and in the API both, so a mistake surfaced at the moment someone made it. At the Belastingdienst I built the visual forms editor and extended the backend endpoints it called. That is the same seam from the other side, and it is why the mapping from a rule to a status code is the part of this article I would defend first in a technical conversation.",
    nl: "Bij Opinity was de interface Angular op ASP.NET Core, en de validatie zat zowel in de interface als in de API, zodat een fout opviel op het moment dat iemand hem maakte. Bij de Belastingdienst bouwde ik de visuele formulierenbouwer en breidde ik de backend-endpoints uit die hij aanriep. Dat is dezelfde naad van de andere kant, en daarom is de vertaling van een regel naar een statuscode het deel van dit artikel dat ik als eerste zou verdedigen in een technisch gesprek.",
  },
  record3Before: {
    en: "Client code stays with the client. The reasoning comes with me, and the code that carries it is Zappy Mart, where you can read every file. The endpoint side of this walkthrough is worked out further in ",
    nl: "Klantcode blijft bij de klant. De redenering gaat met mij mee, en de code die haar draagt is Zappy Mart, waar je elk bestand kunt lezen. De endpointkant van deze doorloop is verder uitgewerkt in ",
  },
  apiArticleLink: {
    en: "the article on building an API in ASP.NET Core",
    nl: "het artikel over een API bouwen in ASP.NET Core",
  },
  record3After: {
    en: ", which builds the minimal API and the controller side by side.",
    nl: ", dat de minimal API en de controller naast elkaar bouwt.",
  },

  decisionTitle: { en: "A decision table you can hand to a team", nl: "Een keuzetabel die je aan een team kunt geven" },
  decision1: {
    en: "Eight questions, and the answer to each one is a fact about your situation and not a preference. Count the rows that point the same way and you have a decision you can defend in a review.",
    nl: "Acht vragen, en het antwoord op elke vraag is een feit over jouw situatie, geen voorkeur. Tel de regels die dezelfde kant op wijzen en je hebt een keuze die je in een review kunt verdedigen.",
  },
  decisionTableCaption: {
    en: "Eight questions about the work, and what each style gives you for free",
    nl: "Acht vragen over het werk, en wat elke stijl je gratis geeft",
  },
  questionColumn: { en: "The question", nl: "De vraag" },
  decision2: {
    en: "The two are not exclusive, and this repository is the proof. One application layer, a schema for the screens that need to compose their own shape, and addresses for the things a partner system or a cache wants to talk to. The cost of running both is one extra adapter and one extra mapping file. The cost of choosing wrong and then working around it is a great deal higher.",
    nl: "De twee sluiten elkaar niet uit, en deze repository is het bewijs. Eén applicatielaag, een schema voor de schermen die hun eigen vorm moeten samenstellen, en adressen voor de dingen waar een partnersysteem of een cache mee wil praten. Allebei draaien kost je één adapter en één vertaalbestand extra. Verkeerd kiezen en er daarna omheen werken kost een stuk meer.",
  },

  closingTitle: { en: "What to take away", nl: "Wat je meeneemt" },
  closing1: {
    en: "Six things that hold whichever style you pick.",
    nl: "Zes dingen die gelden welke stijl je ook kiest.",
  },
  closingStep1: {
    en: "Know which of your writes may be repeated. PUT and DELETE are idempotent by definition, POST is not, and a PATCH is only idempotent if you designed it that way.",
    nl: "Weet welke van je schrijfacties herhaald mogen worden. PUT en DELETE zijn per definitie idempotent, POST niet, en een PATCH is alleen idempotent als je hem zo hebt ontworpen.",
  },
  closingStep2: {
    en: "Let the stage that ends the request choose the status code, and keep that mapping in one file. A refusal the domain expected is never a 500.",
    nl: "Laat de stap die het verzoek beëindigt de statuscode kiezen, en houd die vertaling in één bestand. Een weigering die het domein verwachtte is nooit een 500.",
  },
  closingStep3: {
    en: "Give every failure the same shape. In REST that is a problem document with a stable type and a machine readable code beside the sentence. In GraphQL it is a user error type in the payload, with the same codes.",
    nl: "Geef elke storing dezelfde vorm. In REST is dat een problem-document met een stabiel type en een machineleesbare code naast de zin. In GraphQL is het een user-error-type in de payload, met dezelfde codes.",
  },
  closingStep4: {
    en: "If you serve GraphQL, decide today how a failure reaches your dashboard, because a wall of 200s will not tell you.",
    nl: "Serveer je GraphQL, beslis dan vandaag hoe een storing bij je dashboard aankomt, want een muur van 200's vertelt het je niet.",
  },
  closingStep5: {
    en: "Write down what a repeated write answers. Replay, conflict or a second record are all defensible. Saying nothing is not.",
    nl: "Schrijf op wat een herhaalde schrijfactie antwoordt. Opnieuw afspelen, een conflict of een tweede regel zijn allemaal verdedigbaar. Niets zeggen niet.",
  },
  closingStep6: {
    en: "Keep the adapter thin enough that a second one is an afternoon. If adding a door means touching the rules, the rules are living in the wrong place.",
    nl: "Houd de adapter zo dun dat een tweede een middag kost. Als een deur toevoegen betekent dat je aan de regels moet zitten, wonen de regels op de verkeerde plek.",
  },
  closing2: {
    en: "The version claims in this article were checked on 9 September 2026 against the project files and the npm registry, and the GraphQL over HTTP behaviour was read on 7 September 2026 while that document was a stage 2 draft. RFC 9110 and RFC 9457 are stable and the section numbers will still be there.",
    nl: "De versiebeweringen in dit artikel zijn op 9 september 2026 gecontroleerd tegen de projectbestanden en het npm-register, en het gedrag van GraphQL over HTTP is op 7 september 2026 gelezen toen dat document een concept in fase 2 was. RFC 9110 en RFC 9457 liggen vast en de sectienummers staan er nog.",
  },
  closing3Before: {
    en: "If you take one habit from this, take the header. Add ",
    nl: "Als je hier één gewoonte uit meeneemt, neem dan de header. Voeg ",
  },
  closing3After: {
    en: " to the one write in your system that costs money when it happens twice, decide what a repeat answers, and write that sentence into the contract. It is an afternoon of work and it removes a whole category of incident.",
    nl: " toe aan de ene schrijfactie in je systeem die geld kost als hij twee keer gebeurt, beslis wat een herhaling antwoordt, en zet die zin in het contract. Het is een middag werk en het haalt een hele categorie incidenten weg.",
  },

  nodeClient: { en: "One client", nl: "Eén client" },
  nodeClientSub: { en: "the checkout screen", nl: "het afrekenscherm" },
  nodeRestPostSub: { en: "Idempotency-Key header", nl: "Idempotency-Key-header" },
  nodeGraphPostSub: { en: "mutation placeOrder", nl: "mutation placeOrder" },
  nodeRestAnswer: { en: "201 Created", nl: "201 Created" },
  nodeGraphAnswer: { en: "200 with an envelope", nl: "200 met een envelop" },
  nodeGraphAnswerSub: { en: "data and errors side by side", nl: "data en errors naast elkaar" },
  nodeUseCaseSub: { en: "one class, one method", nl: "één klasse, één methode" },
  edgeRestStyle: { en: "as REST", nl: "als REST" },
  edgeGraphStyle: { en: "as GraphQL", nl: "als GraphQL" },
  edgeSameWork: { en: "the same work", nl: "hetzelfde werk" },

  stageArrives: { en: "The request arrives", nl: "Het verzoek komt binnen" },
  stageArrivesSub: { en: "method and address", nl: "methode en adres" },
  stageMethod: { en: "Routing", nl: "Routering" },
  stageMedia: { en: "Content negotiation", nl: "Contentonderhandeling" },
  stageAuthentication: { en: "Authentication", nl: "Authenticatie" },
  stageBinding: { en: "Binding", nl: "Binding" },
  stageValidation: { en: "Validation", nl: "Validatie" },
  stageRules: { en: "The domain rules", nl: "De domeinregels" },
  stageAnswer: { en: "The handler answers", nl: "De handler antwoordt" },
} as const;
