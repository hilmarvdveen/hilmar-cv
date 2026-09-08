import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, Lead, UL, OL, LI, Strong, Quote, Divider } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FlowDiagram } from "./FlowDiagram";
import { Contents } from "./Contents";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "graphql-as-a-contract-between-frontend-and-backend",
  category: "architecture",
  track: "fullstack",
  publishedDate: "2026-09-06",
  readingTimeMin: 15,
  title: {
    en: "Treating GraphQL as a contract, not a data tap",
    nl: "GraphQL als contract, niet als datakraan",
  },
  description: {
    en: "Types from the schema with gql.tada, fragment masking, unions narrowed by type name, partial responses that still render, and how to ask for a field change.",
    nl: "Types uit het schema met gql.tada, fragment masking, unions op typenaam, gedeeltelijke responses die blijven renderen en hoe je om een ander veld vraagt.",
  },
  excerpt: {
    en: "A GraphQL endpoint is either a tap you take from or an agreement two teams keep. This is the second reading in TypeScript on React 19: typed queries with gql.tada, a fragment per component, unions narrowed by type name, and a partial response that renders while its errors reach the error tracker.",
    nl: "Een GraphQL-endpoint is een kraan waar je uit tapt of een afspraak die twee teams nakomen. Dit is die tweede lezing in TypeScript op React 19: getypte queries met gql.tada, een fragment per component, unions op typenaam, en een gedeeltelijke response die rendert terwijl de fouten in de monitoring belanden.",
  },
  keywords: [
    "graphql contract frontend backend",
    "gql.tada typed queries",
    "urql fragment masking",
    "graphql union typename narrowing",
    "graphql partial response errors",
    "graphql schema change request",
    "openapi rest contract frontend",
  ],
};

function buildComposition(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("planCard", "PlanCard", { x: 0, y: 0 }, { tone: "blue", subtitle: "fragment on Plan", direction: "TB", width: 210 }),
    flowNode("paymentRow", "PaymentMethodRow", { x: 240, y: 0 }, { tone: "blue", subtitle: "fragment on PaymentMethod", direction: "TB", width: 240 }),
    flowNode("renewalNotice", "RenewalNotice", { x: 510, y: 0 }, { tone: "blue", subtitle: "fragment on Subscription", direction: "TB", width: 230 }),
    flowNode("page", copy.nodePage[locale], { x: 240, y: 160 }, { tone: "violet", subtitle: copy.nodePageSub[locale], direction: "TB", width: 240 }),
    flowNode("document", copy.nodeDocument[locale], { x: 240, y: 310 }, { tone: "emerald", subtitle: copy.nodeDocumentSub[locale], direction: "TB", width: 240 }),
    flowNode("schema", copy.nodeSchema[locale], { x: 240, y: 460 }, { tone: "slate", subtitle: copy.nodeSchemaSub[locale], direction: "TB", width: 240 }),
  ];
  const edges = [
    flowEdge("planCard", "page", { label: copy.edgeFragment[locale] }),
    flowEdge("paymentRow", "page", { label: copy.edgeFragment[locale] }),
    flowEdge("renewalNotice", "page", { label: copy.edgeFragment[locale] }),
    flowEdge("page", "document", { label: copy.edgeComposes[locale] }),
    flowEdge("document", "schema", { dashed: true, label: copy.edgeChecked[locale] }),
  ];
  return { nodes, edges };
}

function buildPartialResponse(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("response", copy.nodeResponse[locale], { x: 0, y: 120 }, { tone: "slate", subtitle: copy.nodeResponseSub[locale], width: 220 }),
    flowNode("data", "data", { x: 310, y: 0 }, { tone: "emerald", subtitle: copy.nodeDataSub[locale], width: 200 }),
    flowNode("errors", "errors", { x: 310, y: 240 }, { tone: "amber", subtitle: copy.nodeErrorsSub[locale], width: 200 }),
    flowNode("render", copy.nodeRender[locale], { x: 680, y: 0 }, { tone: "blue", subtitle: copy.nodeRenderSub[locale], width: 240 }),
    flowNode("tracker", copy.nodeTracker[locale], { x: 680, y: 240 }, { tone: "violet", subtitle: copy.nodeTrackerSub[locale], width: 240 }),
  ];
  const edges = [
    flowEdge("response", "data"),
    flowEdge("response", "errors"),
    flowEdge("data", "render", { label: copy.edgeRenderPath[locale] }),
    flowEdge("errors", "tracker", { label: copy.edgeReportPath[locale] }),
  ];
  return { nodes, edges };
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  const composition = buildComposition(locale);
  const partialResponse = buildPartialResponse(locale);
  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <P>{copy.intro1[locale]}</P>
      <P>{copy.intro2[locale]}</P>
      <P>{copy.intro3[locale]}</P>
      <Quote>{copy.quote[locale]}</Quote>
      <Contents
        label={copy.contentsLabel[locale]}
        items={[
          copy.tapTitle[locale],
          copy.typesTitle[locale],
          copy.maskingTitle[locale],
          copy.unionsTitle[locale],
          copy.partialTitle[locale],
          copy.askTitle[locale],
          copy.howTitle[locale],
          copy.parallelTitle[locale],
          copy.testingTitle[locale],
          copy.restTitle[locale],
          copy.takeawayTitle[locale],
        ]}
      />

      <H2>{copy.tapTitle[locale]}</H2>
      <P>{copy.tap1[locale]}</P>
      <P>{copy.tap2[locale]}</P>
      <P>{copy.tap3[locale]}</P>

      <H2>{copy.typesTitle[locale]}</H2>
      <P>{copy.types1[locale]}</P>
      <P>{copy.types2[locale]}</P>
      <CodeBlock lang="ts" filename="subscriptionOverviewQuery.ts" code={TYPED_QUERY_CODE} />
      <P>{copy.types3[locale]}</P>

      <H2>{copy.maskingTitle[locale]}</H2>
      <P>{copy.masking1[locale]}</P>
      <P>{copy.masking2[locale]}</P>
      <FlowDiagram
        nodes={composition.nodes}
        edges={composition.edges}
        height={560}
        ariaLabel={copy.compositionAria[locale]}
        caption={copy.compositionCaption[locale]}
      />
      <P>{copy.masking3[locale]}</P>
      <CodeBlock lang="tsx" filename="PlanCard.tsx" code={FRAGMENT_CODE} />
      <CodeBlock lang="ts" filename="subscriptionPage.ts" code={COMPOSED_QUERY_CODE} />
      <P>{copy.masking4[locale]}</P>

      <H2>{copy.unionsTitle[locale]}</H2>
      <P>{copy.unions1[locale]}</P>
      <P>{copy.unions2[locale]}</P>
      <CodeBlock lang="ts" filename="customerView.ts" code={UNION_CODE} />
      <P>{copy.unions3[locale]}</P>

      <Divider />

      <H2>{copy.partialTitle[locale]}</H2>
      <P>{copy.partial1[locale]}</P>
      <P>{copy.partial2[locale]}</P>
      <CodeBlock lang="ts" filename="loadSubscriptionPage.ts" code={ALL_OR_NOTHING_CODE} />
      <P>{copy.partial3[locale]}</P>
      <CodeBlock lang="ts" filename="loadSubscriptionPage.ts" code={PARTIAL_RESPONSE_CODE} />
      <FlowDiagram
        nodes={partialResponse.nodes}
        edges={partialResponse.edges}
        height={360}
        ariaLabel={copy.partialAria[locale]}
        caption={copy.partialCaption[locale]}
      />
      <P>{copy.partial4[locale]}</P>
      <Callout variant="warning" title={copy.nullabilityTitle[locale]}>
        {copy.nullabilityBody[locale]}
      </Callout>
      <P>{copy.partial5[locale]}</P>

      <H2>{copy.askTitle[locale]}</H2>
      <P>{copy.ask1[locale]}</P>
      <UL>
        <LI><Strong>{copy.signalRebuildLabel[locale]}</Strong> {copy.signalRebuildBody[locale]}</LI>
        <LI><Strong>{copy.signalTwiceLabel[locale]}</Strong> {copy.signalTwiceBody[locale]}</LI>
        <LI><Strong>{copy.signalRuleLabel[locale]}</Strong> {copy.signalRuleBody[locale]}</LI>
      </UL>
      <P>{copy.ask2[locale]}</P>
      <P>{copy.ask3[locale]}</P>
      <P>{copy.ask4[locale]}</P>

      <H2>{copy.howTitle[locale]}</H2>
      <P>{copy.how1[locale]}</P>
      <UL>
        <LI><Strong>{copy.askScreenLabel[locale]}</Strong> {copy.askScreenBody[locale]}</LI>
        <LI><Strong>{copy.askStatesLabel[locale]}</Strong> {copy.askStatesBody[locale]}</LI>
        <LI><Strong>{copy.askShapeLabel[locale]}</Strong> {copy.askShapeBody[locale]}</LI>
        <LI><Strong>{copy.askRemovalLabel[locale]}</Strong> {copy.askRemovalBody[locale]}</LI>
        <LI><Strong>{copy.askFallbackLabel[locale]}</Strong> {copy.askFallbackBody[locale]}</LI>
      </UL>
      <P>{copy.how2[locale]}</P>
      <P>{copy.how3[locale]}</P>

      <H2>{copy.parallelTitle[locale]}</H2>
      <P>{copy.parallel1[locale]}</P>
      <P>{copy.parallel2[locale]}</P>
      <CodeBlock lang="ts" filename="loadAccountPage.ts" code={PARALLEL_CODE} />
      <P>{copy.parallel3[locale]}</P>

      <H2>{copy.testingTitle[locale]}</H2>
      <P>{copy.testing1[locale]}</P>
      <CodeBlock lang="tsx" filename="SubscriptionOverview.test.tsx" code={MOCKED_TEST_CODE} />
      <P>{copy.testing2[locale]}</P>
      <P>{copy.testing3[locale]}</P>

      <H2>{copy.restTitle[locale]}</H2>
      <P>{copy.rest1[locale]}</P>
      <P>{copy.rest2[locale]}</P>
      <P>{copy.rest3[locale]}</P>

      <H2>{copy.takeawayTitle[locale]}</H2>
      <P>{copy.takeaway1[locale]}</P>
      <OL>
        <LI>{copy.step1[locale]}</LI>
        <LI>{copy.step2[locale]}</LI>
        <LI>{copy.step3[locale]}</LI>
        <LI>{copy.step4[locale]}</LI>
        <LI>{copy.step5[locale]}</LI>
        <LI>{copy.step6[locale]}</LI>
      </OL>
      <P>{copy.takeaway2[locale]}</P>
      <P>{copy.takeaway3[locale]}</P>
    </>
  );
}

const TYPED_QUERY_CODE = `import { graphql, type ResultOf, type VariablesOf } from "gql.tada";

export const subscriptionOverviewQuery = graphql(\`
  query SubscriptionOverview($customerId: ID!) {
    subscription(customerId: $customerId) {
      status
      renewsOn
      plan {
        name
        priceInCents
        billingInterval
      }
      paymentMethod {
        label
        mandate {
          reference
          signedOn
          status
        }
      }
    }
  }
\`);

export type SubscriptionOverviewResult = ResultOf<typeof subscriptionOverviewQuery>;
export type SubscriptionOverviewVariables = VariablesOf<typeof subscriptionOverviewQuery>;

export function renewalLine(result: SubscriptionOverviewResult): string {
  const subscription = result.subscription;
  if (!subscription) {
    return "There is no subscription on this account";
  }
  if (subscription.status !== "ACTIVE") {
    return "This subscription is not running";
  }
  return \`Renews on \${subscription.renewsOn}\`;
}`;

const FRAGMENT_CODE = `import { graphql, readFragment, type FragmentOf } from "gql.tada";
import { formatPrice, intervalLabel } from "./money";

export const planCardFragment = graphql(\`
  fragment PlanCard on Plan {
    name
    priceInCents
    billingInterval
  }
\`);

export function PlanCard({ plan }: { plan: FragmentOf<typeof planCardFragment> }) {
  const card = readFragment(planCardFragment, plan);
  return (
    <article>
      <h3>{card.name}</h3>
      <p>
        {formatPrice(card.priceInCents)} per {intervalLabel(card.billingInterval)}
      </p>
    </article>
  );
}`;

const COMPOSED_QUERY_CODE = `import { graphql } from "gql.tada";
import { planCardFragment } from "./PlanCard";
import { paymentMethodRowFragment } from "./PaymentMethodRow";

export const subscriptionPageQuery = graphql(
  \`
    query SubscriptionPage($customerId: ID!) {
      subscription(customerId: $customerId) {
        status
        renewsOn
        plan {
          ...PlanCard
        }
        paymentMethod {
          ...PaymentMethodRow
        }
      }
    }
  \`,
  [planCardFragment, paymentMethodRowFragment]
);`;

const UNION_CODE = `import { graphql, type FragmentOf, type ResultOf } from "gql.tada";
import { subscriptionCardFragment } from "./SubscriptionCard";

export const customerQuery = graphql(
  \`
    query Customer($customerId: ID!) {
      customer(id: $customerId) {
        __typename
        ... on ActiveCustomer {
          subscription {
            ...SubscriptionCard
          }
        }
        ... on LapsedCustomer {
          endedOn
        }
        ... on UnknownCustomer {
          reason
        }
      }
    }
  \`,
  [subscriptionCardFragment]
);

type Customer = ResultOf<typeof customerQuery>["customer"];

export type CustomerView =
  | { situation: "subscribed"; subscription: FragmentOf<typeof subscriptionCardFragment> }
  | { situation: "lapsed"; endedOn: string }
  | { situation: "unknown"; reason: string };

export function toCustomerView(customer: Customer): CustomerView {
  switch (customer.__typename) {
    case "ActiveCustomer":
      return { situation: "subscribed", subscription: customer.subscription };
    case "LapsedCustomer":
      return { situation: "lapsed", endedOn: customer.endedOn };
    case "UnknownCustomer":
      return { situation: "unknown", reason: customer.reason };
    default: {
      const unhandled: never = customer;
      throw new Error("Unhandled customer type", { cause: unhandled });
    }
  }
}`;

const ALL_OR_NOTHING_CODE = `import type { Client } from "@urql/core";
import { subscriptionPageQuery } from "./subscriptionPage";

export async function loadSubscriptionPage(client: Client, customerId: string) {
  const result = await client.query(subscriptionPageQuery, { customerId }).toPromise();

  if (result.error) {
    throw new Error("The subscription page could not be loaded");
  }

  return result.data;
}`;

const PARTIAL_RESPONSE_CODE = `import type { Client } from "@urql/core";
import { reportToErrorTracker } from "./errorTracker";
import { subscriptionPageQuery } from "./subscriptionPage";

export async function loadSubscriptionPage(client: Client, customerId: string) {
  const result = await client.query(subscriptionPageQuery, { customerId }).toPromise();

  for (const schemaError of result.error?.graphQLErrors ?? []) {
    reportToErrorTracker(schemaError, { operation: "SubscriptionPage", customerId });
  }

  if (result.error?.networkError) {
    throw result.error.networkError;
  }

  if (!result.data?.subscription) {
    throw new Error("The subscription page could not be loaded");
  }

  return result.data;
}`;

const PARALLEL_CODE = `import type { Client } from "@urql/core";
import { membershipQuery } from "./membership";
import { paymentMethodsQuery } from "./paymentMethods";
import { reportPartialErrors } from "./errorTracker";
import { toAccountSituation } from "./accountSituation";

export async function loadAccountPage(client: Client, customerId: string) {
  const [membership, paymentMethods] = await Promise.all([
    client.query(membershipQuery, { customerId }).toPromise(),
    client.query(paymentMethodsQuery, { customerId }).toPromise(),
  ]);

  reportPartialErrors("AccountPage", [membership, paymentMethods]);

  return toAccountSituation({
    membership: membership.data?.membership ?? null,
    paymentMethods: paymentMethods.data?.paymentMethods ?? [],
  });
}`;

const MOCKED_TEST_CODE = `import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "urql";
import type { Client } from "@urql/core";
import { fromValue } from "wonka";
import { SubscriptionOverview } from "./SubscriptionOverview";
import type { SubscriptionOverviewResult } from "./subscriptionOverviewQuery";

const yearlyPlanWithSignedMandate: SubscriptionOverviewResult = {
  subscription: {
    status: "ACTIVE",
    renewsOn: "2027-01-14",
    plan: { name: "Yearly", priceInCents: 9900, billingInterval: "YEAR" },
    paymentMethod: {
      label: "Direct debit",
      mandate: { reference: "M-8842", signedOn: "2026-01-14", status: "SIGNED" },
    },
  },
};

function clientReturning(data: SubscriptionOverviewResult): Client {
  return {
    executeQuery: () => fromValue({ data, stale: false, hasNext: false }),
  } as unknown as Client;
}

describe("SubscriptionOverview", () => {
  it("shows the plan and the state of the mandate", () => {
    render(
      <Provider value={clientReturning(yearlyPlanWithSignedMandate)}>
        <SubscriptionOverview customerId="customer-1" />
      </Provider>
    );

    expect(screen.getByRole("heading", { name: "Yearly" })).toBeInTheDocument();
    expect(screen.getByText("Direct debit")).toBeInTheDocument();
  });
});`;

const COPY = {
  contentsLabel: { en: "In this article", nl: "In dit artikel" },
  lead: {
    en: "A GraphQL endpoint can be read in two ways. As a tap that hands over whatever it has, or as an agreement between two teams about what a page gets. The second reading is what keeps a screen simple for years.",
    nl: "Een GraphQL-endpoint kun je op twee manieren lezen. Als een kraan die geeft wat er is, of als een afspraak tussen twee teams over wat een pagina krijgt. Die tweede lezing houdt een scherm jarenlang eenvoudig.",
  },
  intro1: {
    en: "The difference shows up in the code. A frontend that treats the schema as a tap grows a layer that reshapes whatever arrived, checks for fields that may or may not be there, and state that rebuilds something the backend already knew. Each of those is the page deciding something about data it does not own.",
    nl: "Het verschil zie je terug in de code. Een frontend die het schema als kraan behandelt, krijgt een laag die alles omvormt, controles voor velden die er wel of niet zijn, en state die iets herbouwt wat de backend allang wist. Steeds beslist de pagina iets over data die niet van haar is.",
  },
  intro2: {
    en: "At bol.com I moved pages off a legacy Java storefront onto React. The schema there belongs to the backend teams, and my part was the pages plus the conversation about the fields they needed.",
    nl: "Bij bol.com verhuisde ik pagina's van een Java-winkel naar React. Het schema is daar van de backendteams, en mijn deel waren de pagina's en het gesprek over de velden die ze nodig hadden.",
  },
  intro3: {
    en: "The samples below are TypeScript with gql.tada and urql on React 19, checked on 6 September 2026, on a generic subscription schema with a plan and a payment method.",
    nl: "De voorbeelden hieronder zijn TypeScript met gql.tada en urql op React 19, gecontroleerd op 6 september 2026, op een algemeen abonnementsschema met een pakket en een betaalmethode.",
  },
  quote: {
    en: "A field that arrives in the wrong shape never stays one function. It becomes a function, then a test, then a second copy of both in the next component.",
    nl: "Een veld dat in de verkeerde vorm binnenkomt, blijft nooit één functie. Het wordt een functie, dan een test, en dan een tweede kopie van allebei in het volgende component.",
  },
  tapTitle: {
    en: "The difference between a contract and a tap",
    nl: "Het verschil tussen een contract en een kraan",
  },
  tap1: {
    en: "A tap is a source you take from. You ask, you receive, and from that moment the shape is the frontend's problem. That works right up to the day the page has to render a situation the data does not describe.",
    nl: "Een kraan is een bron waar je uit tapt. Je vraagt, je krijgt, en vanaf dat moment is de vorm het probleem van de frontend. Dat werkt tot de dag dat de pagina een situatie moet tonen die de data niet beschrijft.",
  },
  tap2: {
    en: "A contract is an agreement about meaning. Which fields exist, what they can contain, what they are when there is nothing, and which situations of the business they describe. GraphQL is built for that reading. The schema is a typed document both sides read, and a query either matches it or does not.",
    nl: "Een contract is een afspraak over betekenis. Welke velden er zijn, wat ze kunnen bevatten, wat ze zijn als er niets is, en welke situaties uit de business ze beschrijven. GraphQL is voor die lezing gemaakt. Het schema is een getypeerd document dat beide kanten lezen, en een query klopt ertegen of niet.",
  },
  tap3: {
    en: "The practical test is short. Open one component and count the lines that exist only because a field arrives in a shape the screen cannot use. Those lines are the difference between the two readings, and they are the material for the conversation further down this page.",
    nl: "De praktische toets is kort. Open één component en tel de regels die er alleen staan omdat een veld binnenkomt in een vorm die het scherm niet kan gebruiken. Die regels zijn het verschil tussen de twee lezingen, en ze zijn het materiaal voor het gesprek verderop op deze pagina.",
  },
  typesTitle: {
    en: "Types that come from the schema, not from your hand",
    nl: "Types die uit het schema komen, niet uit je hoofd",
  },
  types1: {
    en: "A hand-written result type is a copy of the schema from the moment somebody typed it. It is right that day and quietly wrong later, because nothing in the build reports a renamed field. The copy still compiles.",
    nl: "Een met de hand geschreven resultaattype is een kopie van het schema van het moment dat iemand het intikte. Het klopt die dag en klopt later stilletjes niet meer, want niets in de build meldt een hernoemd veld. De kopie compileert gewoon door.",
  },
  types2: {
    en: "gql.tada works the other way around. It reads the query text against the schema, so the result type follows from the document you wrote. Ask for three fields and the type carries three. Rename a field at the source and the query stops typechecking before anybody opens the page.",
    nl: "gql.tada doet het andersom. Het leest de querytekst tegen het schema, dus het resultaattype volgt uit het document dat je schreef. Vraag drie velden en het type heeft er drie. Hernoem een veld bij de bron en de query typecheckt niet meer voordat iemand de pagina opent.",
  },
  types3: {
    en: "Two things follow. Nullability is the schema's answer and not a guess, so a field that can be absent forces a branch in the component. And the type travels with the query, which is what makes a mocked response in a test worth something.",
    nl: "Daar volgen twee dingen uit. Nullability is het antwoord van het schema en geen aanname, dus een veld dat kan ontbreken dwingt een aftakking af in het component. En het type reist met de query mee, en daardoor is een nagebootste response in een test iets waard.",
  },
  maskingTitle: {
    en: "Fragment masking, and why a component should not see everything",
    nl: "Fragment masking, en waarom een component niet alles hoort te zien",
  },
  masking1: {
    en: "A page needs many fields and a component needs few. When the page hands the whole response to every component, each one can reach for anything in it. The query then grows fields nobody can trace back to a screen, and nobody dares remove them either.",
    nl: "Een pagina heeft veel velden nodig en een component maar een paar. Geeft de pagina de hele response aan elk component, dan kan elk component overal bij. De query krijgt er dan velden bij die niemand nog aan een scherm kan koppelen en die niemand durft weg te halen.",
  },
  masking2: {
    en: "A fragment turns that around. Each component declares the fields it uses, in the file that uses them. The page composes one document out of those fragments and sends it once.",
    nl: "Een fragment draait dat om. Elk component schrijft zelf op welke velden het gebruikt, in het bestand waar ze gebruikt worden. De pagina stelt uit die fragmenten één document samen en stuurt dat één keer op.",
  },
  compositionAria: {
    en: "Diagram: three components each declare a fragment, the page composes those fragments into one query document, and that document is sent once and checked against the schema the backend team owns",
    nl: "Diagram: drie componenten schrijven elk een fragment, de pagina stelt uit die fragmenten één querydocument samen, en dat document gaat één keer weg en wordt gecontroleerd tegen het schema van het backendteam",
  },
  compositionCaption: {
    en: "Each component asks for the fields it uses, and the page sends one query built from all of them.",
    nl: "Elk component vraagt om de velden die het gebruikt, en de pagina stuurt één query die uit al die fragmenten is opgebouwd.",
  },
  masking3: {
    en: "Masking is what makes that declaration real. The component receives a reference, and readFragment hands back exactly the fields its own fragment asked for. A field it did not declare is not in its type at all. Delete the component and its fields leave the query with it.",
    nl: "Masking maakt die verklaring echt. Het component krijgt een verwijzing, en readFragment geeft precies de velden terug waar het eigen fragment om vroeg. Een veld dat het niet opschreef, zit niet eens in het type. Verwijder het component en zijn velden verdwijnen mee uit de query.",
  },
  masking4: {
    en: "The page keeps its own job. It composes, it fetches once, and it passes fragment references down. It never reads a field on behalf of a child, so a change to a card stays inside that card.",
    nl: "De pagina houdt haar eigen taak. Ze stelt samen, ze haalt één keer op, en ze geeft fragmentverwijzingen door. Ze leest nooit een veld namens een onderliggend component, dus een wijziging aan een kaart blijft binnen die kaart.",
  },
  unionsTitle: {
    en: "Unions and narrowing by type name",
    nl: "Unions en narrowing op typenaam",
  },
  unions1: {
    en: "Some things are not one shape. A customer is subscribed, or lapsed, or unknown to the system. A schema can say that with a union, and the possible situations then sit in the contract itself. Without one they live in a chain of null checks and in someone's head.",
    nl: "Sommige dingen hebben niet één vorm. Een klant heeft een abonnement, is afgehaakt, of is onbekend in het systeem. Een schema kan dat met een union zeggen, en dan staan de mogelijke situaties in het contract zelf. Zonder union leven ze in een reeks null-controles en in iemands hoofd.",
  },
  unions2: {
    en: "The client narrows on the type name. Ask for it in the selection set and urql returns a result the compiler can split into its members. The switch below is exhaustive, and the compiler notices when a fourth member joins.",
    nl: "De client kiest op de typenaam. Vraag die op in de selectieset en urql geeft een resultaat terug dat de compiler in zijn leden kan splitsen. De switch hieronder is uitputtend, en de compiler merkt op dat er een vierde lid bij komt.",
  },
  unions3: {
    en: "The never in the default branch is the point. On the day a member is added, the build fails in the one place where a person decides what the screen does with it. At bol.com the shared subscription page narrows its customer result by type name, and one pure function turns that into one of five mutually exclusive situations.",
    nl: "De never in de default-tak is waar het om draait. Op de dag dat er een lid bij komt, faalt de build op de enige plek waar een mens bepaalt wat het scherm ermee doet. Bij bol.com kiest de gedeelde abonnementspagina op typenaam, en één pure functie maakt daar één van vijf elkaar uitsluitende situaties van.",
  },
  partialTitle: {
    en: "Partial responses, the case most clients get wrong",
    nl: "Gedeeltelijke responses, het geval dat vaak misgaat",
  },
  partial1: {
    en: "A GraphQL response is not one thing. It carries data and errors in the same envelope. When one resolver fails, that field comes back empty, an entry appears under errors, and everything else is still there.",
    nl: "Een GraphQL-response is niet één ding. Er zitten data en errors in dezelfde envelop. Faalt één resolver, dan komt dat veld leeg terug, verschijnt er een regel onder errors, en staat de rest er gewoon.",
  },
  partial2: {
    en: "It is easy to read that envelope as a boolean. If errors is not empty, throw. The visitor then sees nothing, while the response is full of fields that did arrive. One unrelated failure has emptied the screen.",
    nl: "Het is verleidelijk om die envelop als een ja of nee te lezen. Staat er iets in errors, dan gooien. De bezoeker ziet dan niets, terwijl de response vol staat met velden die wel binnenkwamen. Eén losse fout heeft het scherm leeggemaakt.",
  },
  partial3: {
    en: "At bol.com customers were seeing an empty list for that reason. The data-loading code discarded the entire result as soon as any error came back, valid data included. I removed the all-or-nothing bail-out, so the page shows whatever is present while the errors still reach Sentry.",
    nl: "Bij bol.com zagen klanten om die reden een lege lijst. De datalaag gooide het hele resultaat weg zodra er een fout terugkwam, inclusief de geldige data. Ik haalde die alles-of-niets-afslag eruit, zodat de pagina toont wat er wel is terwijl de fouten nog steeds in Sentry belanden.",
  },
  partialAria: {
    en: "Diagram: a GraphQL response splits into data and errors, the data goes to the render path of the page and the errors go to the reporting path of the error tracker",
    nl: "Diagram: een GraphQL-response splitst in data en errors, de data gaat naar het renderpad van de pagina en de errors gaan naar het meldpad van de foutmonitoring",
  },
  partialCaption: {
    en: "A partial response still has data. Rendering it and reporting the errors are two different jobs.",
    nl: "Een gedeeltelijke response bevat nog steeds data. Die tonen en de fouten melden zijn twee verschillende taken.",
  },
  partial4: {
    en: "Two paths, two jobs. The render path takes the data and decides per section what it can show. The reporting path hands every error to the error tracker with the operation name and the identifiers you need to find the case back.",
    nl: "Twee paden, twee taken. Het renderpad neemt de data en bepaalt per onderdeel wat het kan tonen. Het meldpad geeft elke fout door aan de foutmonitoring, met de naam van de operatie en de gegevens waarmee je het geval terugvindt.",
  },
  nullabilityTitle: {
    en: "Nullability decides how much of the page survives",
    nl: "Nullability bepaalt hoeveel van de pagina overeind blijft",
  },
  nullabilityBody: {
    en: "A field that cannot be empty takes its parent down with it when it fails, up to the nearest field that may be empty. The nullability in the schema therefore decides how large the hole in a partial response is. That is a design question for both teams when the field is added.",
    nl: "Een veld dat niet leeg mag zijn, sleept bij een fout zijn ouder mee, tot aan het dichtstbijzijnde veld dat wel leeg mag zijn. De nullability in het schema bepaalt dus hoe groot het gat in een gedeeltelijke response is. Dat is een ontwerpvraag voor beide teams op het moment dat het veld erbij komt.",
  },
  partial5: {
    en: "A network error is a different case and still throws. Nothing arrived, so there is nothing to render and the page shows its error state. That distinction is the reason to read the two halves of the envelope separately.",
    nl: "Een netwerkfout is een ander geval en gooit nog steeds. Er kwam niets binnen, dus er valt niets te tonen en de pagina toont haar foutstand. Dat onderscheid is de reden om de twee helften van de envelop apart te lezen.",
  },
  askTitle: {
    en: "When to ask the backend to change a field",
    nl: "Wanneer je de backend om een ander veld vraagt",
  },
  ask1: {
    en: "Not every awkward field deserves a change to the schema. Three signals say that this one does.",
    nl: "Niet elk onhandig veld verdient een wijziging in het schema. Drie signalen zeggen dat dit veld dat wel doet.",
  },
  signalRebuildLabel: {
    en: "The page rebuilds what the backend knows.",
    nl: "De pagina bouwt na wat de backend al weet.",
  },
  signalRebuildBody: {
    en: "A reference the frontend has to interpret is a decision that moved to the wrong side of the API. The backend can answer that question outright.",
    nl: "Een referentie die de frontend moet interpreteren, is een beslissing die naar de verkeerde kant van de API is verhuisd. De backend kan die vraag gewoon beantwoorden.",
  },
  signalTwiceLabel: {
    en: "The same mapping appears twice.",
    nl: "Dezelfde omvorming staat er twee keer.",
  },
  signalTwiceBody: {
    en: "Once is a helper function. Twice is a shape that the screens keep disagreeing with, and the third copy is already being written somewhere.",
    nl: "Eén keer is een hulpfunctie. Twee keer is een vorm waar de schermen het steeds niet mee eens zijn, en de derde kopie wordt ergens al getypt.",
  },
  signalRuleLabel: {
    en: "The frontend cannot get it right alone.",
    nl: "De frontend kan het alleen niet goed krijgen.",
  },
  signalRuleBody: {
    en: "Reading meaning out of a string, or deriving a status from a combination of fields, is a business rule. It belongs where the data lives, so every consumer gets the same answer.",
    nl: "Betekenis uit een string halen, of een status afleiden uit een combinatie van velden, is een bedrijfsregel. Die hoort bij de data te staan, zodat elke afnemer hetzelfde antwoord krijgt.",
  },
  ask2: {
    en: "At bol.com one page received a bare mandate reference where it needed the state of the mandate itself. I proposed a structured mandate object and explained which screen needed it. The backend team implemented that change, and the frontend lost code and gained no new layer.",
    nl: "Bij bol.com kreeg een pagina een kale mandaatreferentie terwijl ze de staat van dat mandaat nodig had. Ik stelde een gestructureerd mandaatobject voor en legde uit welk scherm dat nodig had. Het backendteam voerde die wijziging door, en de frontend raakte code kwijt en kreeg er geen laag bij.",
  },
  ask3: {
    en: "The other side of the line is just as clear. Formatting, sorting for one screen, a label in one language and everything else that is presentation stays in the frontend. Every field on a schema is something two teams keep true for years.",
    nl: "De andere kant van de streep is net zo duidelijk. Opmaak, sorteren voor één scherm, een label in één taal en al het andere dat presentatie is, blijft in de frontend. Elk veld op een schema is iets wat twee teams jarenlang waar houden.",
  },
  ask4: {
    en: "And when the change cannot land in time, the page takes the shape as it is, in one adapter at the edge of the frontend with a note that says why it is there. The proposal still goes to the backend team that week, so the next version fixes it at the source.",
    nl: "En als de wijziging niet op tijd lukt, neemt de pagina de vorm zoals die is, in één adapter aan de rand van de frontend, met een notitie waarom die er staat. Het voorstel gaat die week alsnog naar het backendteam, zodat de volgende versie het bij de bron oplost.",
  },
  howTitle: {
    en: "How to ask, and what makes it an easy yes",
    nl: "Hoe je het vraagt, en waardoor het een makkelijke ja wordt",
  },
  how1: {
    en: "A field change costs the backend team a migration, a release and a version of the schema they have to keep supporting. What makes it an easy yes is a request that already contains most of the answer. Five things belong in it.",
    nl: "Een veldwijziging kost het backendteam een migratie, een release en een versie van het schema die ze moeten blijven ondersteunen. Wat het een makkelijke ja maakt, is een verzoek waar het antwoord al grotendeels in staat. Vijf dingen horen erin.",
  },
  askScreenLabel: { en: "The screen.", nl: "Het scherm." },
  askScreenBody: {
    en: "Which page needs this and in which situation. A field without a screen behind it is a preference, and it will be treated as one.",
    nl: "Welke pagina dit nodig heeft en in welke situatie. Een veld zonder scherm erachter is een voorkeur, en zo wordt het ook behandeld.",
  },
  askStatesLabel: { en: "The situations.", nl: "De situaties." },
  askStatesBody: {
    en: "Everything the field has to describe, the empty one and the failed one included. That list is where most of the design work happens.",
    nl: "Alles wat het veld moet beschrijven, inclusief de lege en de mislukte. In die lijst zit het meeste ontwerpwerk.",
  },
  askShapeLabel: { en: "The shape.", nl: "De vorm." },
  askShapeBody: {
    en: "The fields you propose, written in schema language. A backend engineer reads a type definition in two seconds and a paragraph of prose in a minute.",
    nl: "De velden die je voorstelt, in de taal van het schema. Een backend-engineer leest een typedefinitie in twee seconden en een alinea proza in een minuut.",
  },
  askRemovalLabel: { en: "What disappears.", nl: "Wat verdwijnt." },
  askRemovalBody: {
    en: "The function, the test and the piece of state that come out of the frontend once the field lands. That turns a request into a shared win.",
    nl: "De functie, de test en het stukje state die uit de frontend verdwijnen zodra het veld er is. Dat maakt er een gezamenlijke winst van.",
  },
  askFallbackLabel: { en: "The fallback.", nl: "De terugvaloptie." },
  askFallbackBody: {
    en: "What the page does until then, so nothing is blocked on the answer and the team can plan the change in its own rhythm.",
    nl: "Wat de pagina tot die tijd doet, zodat er niets op het antwoord wacht en het team de wijziging in zijn eigen ritme kan inplannen.",
  },
  how2: {
    en: "Timing carries as much weight as content. The request belongs in refinement, next to the ticket that needs it. At bol.com almost every change I shipped touched another team's code, so agreeing an approach first was how work moved. I was in regular contact with two teams and with up to six at once for larger features.",
    nl: "Het moment weegt net zo zwaar als de inhoud. Het verzoek hoort in de refinement, naast het ticket dat het nodig heeft. Bij bol.com raakte bijna elke wijziging die ik opleverde code van een ander team, dus eerst een aanpak afstemmen was hoe het werk liep. Ik had doorlopend contact met twee teams en bij grotere features met zes tegelijk.",
  },
  how3: {
    en: "One habit is worth more than any template. Raise the shape of the data while it can still be a proposal. A field discussed in refinement is a design decision two people take together. The same field the day before a release is a problem somebody has to absorb.",
    nl: "Eén gewoonte is meer waard dan welk sjabloon ook. Breng de vorm van de data op tafel zolang het nog een voorstel kan zijn. Een veld dat in de refinement langskomt, is een ontwerpbeslissing die twee mensen samen nemen. Datzelfde veld de dag voor een release is een probleem dat iemand moet opvangen.",
  },
  parallelTitle: {
    en: "Two queries in parallel on the server",
    nl: "Twee queries tegelijk op de server",
  },
  parallel1: {
    en: "With server-side rendering the fetching happens before the HTML goes out. Two queries that do not depend on each other should leave at the same moment. Written one after the other, the page waits for the sum. Written in parallel, it waits for the slower of the two.",
    nl: "Bij server-side rendering gebeurt het ophalen voordat de HTML weggaat. Twee queries die niet van elkaar afhangen, horen op hetzelfde moment te vertrekken. Achter elkaar geschreven wacht de pagina op de som. Parallel geschreven wacht ze op de traagste van de twee.",
  },
  parallel2: {
    en: "Keeping this as two documents is deliberate. They cover two areas of the schema with two teams behind them, and either can come back empty for a customer who has only one of the two. The outcome of one then does not decide the fate of the other.",
    nl: "Twee documenten en niet één is hier bewust. Ze dekken twee delen van het schema met twee teams erachter, en allebei kunnen ze leeg terugkomen bij een klant die er maar één heeft. De uitkomst van de één bepaalt dan niet het lot van de ander.",
  },
  parallel3: {
    en: "The joining happens in a pure function that takes both results and returns the one situation the page renders. At bol.com the shared subscription page fetches both subscriptions at once and one pure function turns that into one of five mutually exclusive situations. The reasoning sits in a function with a test around it.",
    nl: "Het samenvoegen gebeurt in een pure functie die beide resultaten neemt en de ene situatie teruggeeft die de pagina toont. Bij bol.com haalt de gedeelde abonnementspagina beide abonnementen tegelijk op en maakt één pure functie daar één van vijf elkaar uitsluitende situaties van. De redenering staat in een functie met een test eromheen.",
  },
  testingTitle: {
    en: "Testing against a mocked network",
    nl: "Testen tegen een nagebootst netwerk",
  },
  testing1: {
    en: "The useful test on a data-driven component sits at the network boundary. Mock the response, not the hook. The test then runs the real query path, the real narrowing and the real render, and only the transport is fake.",
    nl: "De bruikbare test op een datagedreven component zit op de grens met het netwerk. Boots de response na en niet de hook. De test draait dan het echte querypad, de echte narrowing en de echte render, en alleen het transport is nep.",
  },
  testing2: {
    en: "Type the mocked response with the result type of the query itself. A mock that no longer matches the schema then fails the build, which is the moment you want to hear about it. An untyped mock keeps a test green while the page has already changed.",
    nl: "Typeer de nagebootste response met het resultaattype van de query zelf. Een mock die niet meer bij het schema past, laat de build dan falen, en dat is het moment waarop je het wilt horen. Een ongetypeerde mock houdt een test groen terwijl de pagina allang veranderd is.",
  },
  testing3: {
    en: "Two more cheap tests sit next to it. One for the partial response, which asserts that what arrived is on screen and that the failure was reported. And one Storybook story per situation. At bol.com every page I built carried unit tests, GraphQL mocks and a story per scenario, because the team that keeps it after me is strongest on the backend.",
    nl: "Twee goedkope tests staan ernaast. Eén voor de gedeeltelijke response, die controleert dat wat binnenkwam op het scherm staat en dat de storing gemeld is. En één Storybook-verhaal per situatie. Bij bol.com had elke pagina die ik bouwde unittests, GraphQL-mocks en een verhaal per scenario, omdat het team dat haar na mij beheert het sterkst is in de backend.",
  },
  restTitle: {
    en: "The same discipline in REST with OpenAPI",
    nl: "Dezelfde discipline in REST met OpenAPI",
  },
  rest1: {
    en: "None of this is unique to GraphQL. At Ortec I built the Angular portal that shows logistics planning on one screen, running over .NET Core microservices, and I settled the REST contracts with the backend teams on OpenAPI 3.0. Same discipline, different document.",
    nl: "Niets hiervan is uniek voor GraphQL. Bij Ortec bouwde ik het Angular-portaal dat logistieke planning op één scherm toont, bovenop .NET Core-microservices, en de REST-contracten stemde ik met de backendteams af op OpenAPI 3.0. Dezelfde discipline, een ander document.",
  },
  rest2: {
    en: "OpenAPI gives you the agreement in one file, client types generated from it, and a breaking change that arrives as a version. It gives you no component that declares its own fields, and a response is one status code, so partial success has to be modelled in the payload when a screen needs it.",
    nl: "OpenAPI geeft je de afspraak in één bestand, clienttypes die daaruit komen, en een brekende wijziging die als versie binnenkomt. Het geeft je geen component dat zijn eigen velden opschrijft, en een response is één statuscode, dus gedeeltelijk succes moet je in de payload modelleren als een scherm dat nodig heeft.",
  },
  rest3: {
    en: "The constant across both is the direction of the fix. When a shape does not fit the screen, the conversation goes to the source. Left alone, a frontend slowly becomes a translation layer for somebody else's data model.",
    nl: "De constante in allebei is de richting van de oplossing. Past een vorm niet bij het scherm, dan gaat het gesprek naar de bron. Gebeurt dat niet, dan wordt een frontend langzaam een vertaallaag voor het datamodel van een ander.",
  },
  takeawayTitle: {
    en: "What to take away",
    nl: "Wat je meeneemt",
  },
  takeaway1: {
    en: "Six things, in the order they pay off.",
    nl: "Zes dingen, in de volgorde waarin ze zich terugbetalen.",
  },
  step1: {
    en: "Let the schema write your types. A copy typed by hand is right for about a week.",
    nl: "Laat het schema je types schrijven. Een met de hand getypte kopie klopt ongeveer een week.",
  },
  step2: {
    en: "Give every component its own fragment and let the page compose the document from them.",
    nl: "Geef elk component zijn eigen fragment en laat de pagina het document daaruit samenstellen.",
  },
  step3: {
    en: "Model the possible situations as a union and narrow by type name, so the compiler asks the question when a situation is added.",
    nl: "Modelleer de mogelijke situaties als union en kies op typenaam, zodat de compiler de vraag stelt als er een situatie bij komt.",
  },
  step4: {
    en: "Read a response as data and errors, not as one boolean. Render what arrived and report what failed.",
    nl: "Lees een response als data en errors, niet als één ja of nee. Toon wat er binnenkwam en meld wat er misging.",
  },
  step5: {
    en: "Fetch independent queries in parallel on the server and join them in one pure function with a test around it.",
    nl: "Haal onafhankelijke queries parallel op de server op en voeg ze samen in één pure functie met een test eromheen.",
  },
  step6: {
    en: "Take the shape you need to the team that owns the field, with the screen, the situations and the code that disappears written into the request.",
    nl: "Leg de vorm die je nodig hebt neer bij het team dat het veld bezit, met het scherm, de situaties en de code die verdwijnt erbij.",
  },
  takeaway2: {
    en: "On a migration this comes up early. A page moving off an old system is the one moment when the fields are being written anyway, so a shape that fits the screen costs the same as a shape that does not. It is the cheapest moment to agree a field.",
    nl: "Bij een migratie speelt dit al vroeg. Een pagina die van een oud systeem af gaat, is het ene moment waarop de velden toch geschreven worden, dus een vorm die bij het scherm past kost evenveel als een vorm die dat niet doet. Het is het goedkoopste moment om een veld af te spreken.",
  },
  takeaway3: {
    en: "The question on every screen stays the same. Which part of this component exists only because a field arrives in a shape the screen cannot use? That part is a conversation with the backend team, and the code that disappears afterwards says whether the contract was worth agreeing.",
    nl: "De vraag bij elk scherm blijft dezelfde. Welk deel van dit component bestaat alleen omdat een veld binnenkomt in een vorm die het scherm niet kan gebruiken? Dat deel is een gesprek met het backendteam, en de code die daarna verdwijnt, zegt of het contract de afspraak waard was.",
  },
  nodePage: { en: "Subscription page", nl: "Abonnementspagina" },
  nodePageSub: { en: "composes the document", nl: "stelt het document samen" },
  nodeDocument: { en: "One query", nl: "Eén query" },
  nodeDocumentSub: { en: "sent once", nl: "één keer verstuurd" },
  nodeSchema: { en: "Schema", nl: "Schema" },
  nodeSchemaSub: { en: "owned by the backend team", nl: "van het backendteam" },
  nodeResponse: { en: "GraphQL response", nl: "GraphQL-response" },
  nodeResponseSub: { en: "one envelope", nl: "één envelop" },
  nodeDataSub: { en: "the fields that arrived", nl: "de velden die aankwamen" },
  nodeErrorsSub: { en: "what failed", nl: "wat misging" },
  nodeRender: { en: "The page renders", nl: "De pagina rendert" },
  nodeRenderSub: { en: "what is present", nl: "wat er is" },
  nodeTracker: { en: "Error tracker", nl: "Foutmonitoring" },
  nodeTrackerSub: { en: "one report per error", nl: "één melding per fout" },
  edgeFragment: { en: "fragment", nl: "fragment" },
  edgeComposes: { en: "composes", nl: "stelt samen" },
  edgeChecked: { en: "checked against", nl: "gecontroleerd tegen" },
  edgeRenderPath: { en: "render path", nl: "renderpad" },
  edgeReportPath: { en: "reporting path", nl: "meldpad" },
} as const;
