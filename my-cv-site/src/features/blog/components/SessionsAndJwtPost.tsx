import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, Lead, UL, OL, LI, Strong, Quote, Divider, A } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FlowDiagram } from "./FlowDiagram";
import { Contents } from "./Contents";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "sessions-and-jwt-one-design-built-seven-times",
  category: "architecture",
  track: "fullstack",
  publishedDate: "2026-09-09",
  readingTimeMin: 43,
  title: {
    en: "Sessions and JWT, one design built seven times",
    nl: "Sessies en JWT, één ontwerp zeven keer gebouwd",
  },
  description: {
    en: "A short lived access token, a rotating refresh cookie, a session read on every request. One design, three monoliths, a federated graph, three fronts.",
    nl: "Een kortlevend accesstoken, een roterende refreshcookie, een sessie die elk verzoek wordt gelezen. Eén ontwerp, drie monolieten, een graaf, drie winkels.",
  },
  excerpt: {
    en: "Zappy Mart is one small web store built seven times over on one GraphQL contract. Every backend issues the same two tokens, every store front holds them in the way its runtime allows, and one shared conformance run holds every backend to it. This walks through the whole design file by file, in C#, Java, Kotlin, Node.js, React Router, Next.js and Angular.",
    nl: "Zappy Mart is één kleine webwinkel die zeven keer is gebouwd op één GraphQL-contract. Elke backend geeft dezelfde twee tokens uit, elke winkel bewaart ze zoals zijn runtime dat toelaat, en één gedeelde conformance-run houdt elke backend eraan. Dit loopt bestand voor bestand door het hele ontwerp, in C#, Java, Kotlin, Node.js, React Router, Next.js en Angular.",
  },
  keywords: [
    "jwt access token refresh token rotation",
    "refresh token reuse detection family revocation",
    "argon2id owasp password hashing parameters",
    "graphql origin check cross site request forgery",
    "jwks distributed verification apollo federation",
    "httponly refresh cookie samesite lax path",
    "session revocation logout takes effect at once",
  ],
};

function buildTokenJourney(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("login", copy.nodeLogin[locale], { x: 300, y: 0 }, { tone: "blue", subtitle: copy.nodeLoginSub[locale], direction: "TB", width: 280 }),
    flowNode("access", copy.nodeAccess[locale], { x: 0, y: 150 }, { tone: "emerald", subtitle: "JWT, RS256, 15 min", direction: "TB", width: 280 }),
    flowNode("refresh", copy.nodeRefresh[locale], { x: 600, y: 150 }, { tone: "violet", subtitle: copy.nodeRefreshSub[locale], direction: "TB", width: 280 }),
    flowNode("everyRequest", copy.nodeEveryRequest[locale], { x: 0, y: 310 }, { tone: "slate", subtitle: "Authorization: Bearer", direction: "TB", width: 280 }),
    flowNode("refreshCall", copy.nodeRefreshCall[locale], { x: 600, y: 310 }, { tone: "slate", subtitle: copy.nodeRefreshCallSub[locale], direction: "TB", width: 280 }),
    flowNode("sessionRow", copy.nodeSessionRow[locale], { x: 300, y: 470 }, { tone: "amber", subtitle: copy.nodeSessionRowSub[locale], direction: "TB", width: 280 }),
    flowNode("revoke", copy.nodeRevoke[locale], { x: 300, y: 620 }, { tone: "rose", subtitle: copy.nodeRevokeSub[locale], direction: "TB", width: 280 }),
    flowNode("dead", copy.nodeDead[locale], { x: 300, y: 770 }, { tone: "slate", subtitle: copy.nodeDeadSub[locale], direction: "TB", width: 280 }),
  ];
  const edges = [
    flowEdge("login", "access", { label: copy.edgeSigned[locale] }),
    flowEdge("login", "refresh", { label: "Set-Cookie" }),
    flowEdge("access", "everyRequest", { label: copy.edgeInTheHeader[locale] }),
    flowEdge("refresh", "refreshCall", { label: copy.edgeInTheCookie[locale] }),
    flowEdge("everyRequest", "sessionRow", { label: copy.edgeSessionRead[locale] }),
    flowEdge("refreshCall", "sessionRow", { label: copy.edgeRotates[locale] }),
    flowEdge("sessionRow", "revoke", { label: copy.edgeCustomerEnds[locale] }),
    flowEdge("revoke", "dead", { label: copy.edgeAtOnce[locale] }),
  ];
  return { nodes, edges };
}

function buildRotation(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("call", copy.nodeCall[locale], { x: 260, y: 0 }, { tone: "blue", subtitle: copy.nodeCallSub[locale], direction: "TB", width: 300 }),
    flowNode("found", copy.nodeFound[locale], { x: 260, y: 140 }, { tone: "slate", subtitle: copy.nodeFoundSub[locale], direction: "TB", width: 300 }),
    flowNode("fresh", copy.nodeFresh[locale], { x: 0, y: 290 }, { tone: "emerald", subtitle: copy.nodeFreshSub[locale], direction: "TB", width: 300 }),
    flowNode("used", copy.nodeUsed[locale], { x: 520, y: 290 }, { tone: "rose", subtitle: copy.nodeUsedSub[locale], direction: "TB", width: 300 }),
    flowNode("rotated", copy.nodeRotated[locale], { x: 0, y: 440 }, { tone: "slate", subtitle: copy.nodeRotatedSub[locale], direction: "TB", width: 300 }),
    flowNode("family", copy.nodeFamily[locale], { x: 520, y: 440 }, { tone: "amber", subtitle: copy.nodeFamilySub[locale], direction: "TB", width: 300 }),
    flowNode("pair", copy.nodePair[locale], { x: 0, y: 590 }, { tone: "emerald", subtitle: copy.nodePairSub[locale], direction: "TB", width: 300 }),
    flowNode("invalid", "SESSION_INVALID", { x: 520, y: 590 }, { tone: "rose", subtitle: copy.nodeInvalidSub[locale], direction: "TB", width: 300 }),
  ];
  const edges = [
    flowEdge("call", "found", { label: copy.edgeByItsHash[locale] }),
    flowEdge("found", "fresh", { label: copy.edgeFirstUse[locale] }),
    flowEdge("found", "used", { label: copy.edgeSecondUse[locale] }),
    flowEdge("fresh", "rotated"),
    flowEdge("used", "family"),
    flowEdge("rotated", "pair"),
    flowEdge("family", "invalid"),
  ];
  return { nodes, edges };
}

type RuleRow = {
  rule: string;
  dotnet: string;
  java: string;
  kotlin: string;
  node: string;
};

function RuleTable({
  caption,
  ruleHeader,
  rows,
}: {
  caption: string;
  ruleHeader: string;
  rows: RuleRow[];
}) {
  return (
    <div className="my-8 overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[840px] border-collapse text-left text-sm">
        <caption className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm text-gray-600">
          {caption}
        </caption>
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th scope="col" className="px-4 py-3 font-semibold text-textMain">
              {ruleHeader}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-textMain">
              C#
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-textMain">
              Java
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-textMain">
              Kotlin
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-textMain">
              Node.js
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.rule} className="border-b border-gray-200 last:border-b-0">
              <th scope="row" className="px-4 py-3 align-top font-semibold text-gray-800">
                {row.rule}
              </th>
              <td className="px-4 py-3 align-top font-mono text-gray-700">{row.dotnet}</td>
              <td className="px-4 py-3 align-top font-mono text-gray-700">{row.java}</td>
              <td className="px-4 py-3 align-top font-mono text-gray-700">{row.kotlin}</td>
              <td className="px-4 py-3 align-top font-mono text-gray-700">{row.node}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  const journey = buildTokenJourney(locale);
  const rotation = buildRotation(locale);
  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <P>{copy.intro1[locale]}</P>
      <P>{copy.intro2[locale]}</P>
      <P>{copy.versionNote[locale]}</P>
      <P>{copy.libraryNote[locale]}</P>
      <Quote>{copy.quote[locale]}</Quote>
      <Contents
        label={copy.contentsLabel[locale]}
        items={[
          copy.tokensTitle[locale],
          copy.whyTitle[locale],
          copy.frontsTitle[locale],
          copy.logoutTitle[locale],
          copy.rotationTitle[locale],
          copy.originTitle[locale],
          copy.argonTitle[locale],
          copy.limitsTitle[locale],
          copy.devicesTitle[locale],
          copy.jwksTitle[locale],
          copy.loggingTitle[locale],
          copy.tableTitle[locale],
          copy.recordTitle[locale],
          copy.closingTitle[locale],
        ]}
      />

      <H2>{copy.tokensTitle[locale]}</H2>
      <P>{copy.tokens1[locale]}</P>
      <UL>
        <LI><Strong>{copy.accessLabel[locale]}</Strong> {copy.accessBody[locale]}</LI>
        <LI><Strong>{copy.refreshLabel[locale]}</Strong> {copy.refreshBody[locale]}</LI>
      </UL>
      <P>{copy.tokens2[locale]}</P>
      <CodeBlock lang="graphql" filename="contract/schema.graphql" code={SCHEMA_AUTHENTICATION_CODE} />
      <P>{copy.tokens3[locale]}</P>
      <CodeBlock lang="csharp" filename="src/Zappy.Application/Accounts/SessionLifetime.cs" code={SESSION_LIFETIME_CODE} />
      <CodeBlock lang="csharp" filename="src/Zappy.Adapters.Security/JwtTokenIssuer.cs" code={JWT_TOKEN_ISSUER_CODE} />
      <P>{copy.tokens4[locale]}</P>
      <CodeBlock lang="csharp" filename="src/Zappy.Application/Accounts/StartSession.cs" code={START_SESSION_CODE} />
      <P>{copy.tokens5[locale]}</P>
      <FlowDiagram
        nodes={journey.nodes}
        edges={journey.edges}
        height={880}
        ariaLabel={copy.journeyAria[locale]}
        caption={copy.journeyCaption[locale]}
      />

      <H2>{copy.whyTitle[locale]}</H2>
      <P>{copy.why1[locale]}</P>
      <UL>
        <LI><Strong>{copy.whyJwtLabel[locale]}</Strong> {copy.whyJwtBody[locale]}</LI>
        <LI><Strong>{copy.whySessionLabel[locale]}</Strong> {copy.whySessionBody[locale]}</LI>
      </UL>
      <P>{copy.why2[locale]}</P>
      <Callout variant="info" title={copy.whyCalloutTitle[locale]}>
        {copy.whyCalloutBody[locale]}
      </Callout>
      <P>{copy.why3[locale]}</P>

      <Divider />

      <H2>{copy.frontsTitle[locale]}</H2>
      <P>{copy.fronts1[locale]}</P>
      <P>{copy.fronts2[locale]}</P>
      <CodeBlock lang="ts" filename="app/session/sessionCookie.server.ts" code={REACT_ROUTER_SESSION_CODE} />
      <P>{copy.fronts3[locale]}</P>
      <CodeBlock lang="ts" filename="app/session/storeConnection.server.ts" code={REACT_ROUTER_CONNECTION_CODE} />
      <P>{copy.fronts4[locale]}</P>
      <CodeBlock lang="ts" filename="app/graphql/client.server.ts" code={REACT_ROUTER_HEADERS_CODE} />
      <P>{copy.fronts5[locale]}</P>
      <CodeBlock lang="ts" filename="server/session.ts" code={NEXT_SESSION_CODE} />
      <P>{copy.fronts6[locale]}</P>
      <CodeBlock lang="ts" filename="app/api/session/route.ts" code={NEXT_REFRESH_ROUTE_CODE} />
      <P>{copy.fronts7[locale]}</P>
      <CodeBlock lang="ts" filename="src/app/api/access-token-store.ts" code={ANGULAR_TOKEN_STORE_CODE} />
      <P>{copy.fronts8[locale]}</P>
      <CodeBlock lang="ts" filename="src/app/api/authentication.interceptor.ts" code={ANGULAR_INTERCEPTOR_CODE} />
      <P>{copy.fronts9[locale]}</P>
      <CodeBlock lang="ts" filename="src/app/account/session-marker.ts" code={ANGULAR_MARKER_CODE} />
      <P>
        {copy.fronts10Before[locale]}
        <A href={`/${locale}/blog/state-without-a-store-react-router-angular-graphql`}>
          {copy.stateArticleLink[locale]}
        </A>
        {copy.fronts10After[locale]}
      </P>

      <H2>{copy.logoutTitle[locale]}</H2>
      <P>{copy.logout1[locale]}</P>
      <CodeBlock lang="csharp" filename="src/Zappy.Domain/Accounts/Session.cs" code={SESSION_ENTITY_CODE} />
      <P>{copy.logout2[locale]}</P>
      <CodeBlock lang="csharp" filename="src/Zappy.Host/BearerTokenSetup.cs" code={BEARER_TOKEN_SETUP_CODE} />
      <P>{copy.logout3[locale]}</P>
      <P>{copy.logout4[locale]}</P>
      <CodeBlock lang="ts" filename="shared/src/security/sessionChecker.ts" code={SESSION_CHECKER_CODE} />
      <Callout variant="warning" title={copy.logoutCalloutTitle[locale]}>
        {copy.logoutCalloutBody[locale]}
      </Callout>

      <H2>{copy.rotationTitle[locale]}</H2>
      <P>{copy.rotation1[locale]}</P>
      <CodeBlock lang="csharp" filename="src/Zappy.Domain/Accounts/RefreshToken.cs" code={REFRESH_TOKEN_CODE} />
      <P>{copy.rotation2[locale]}</P>
      <CodeBlock lang="csharp" filename="src/Zappy.Application/Accounts/RefreshSession.cs" code={REFRESH_SESSION_CODE} />
      <P>{copy.rotation3[locale]}</P>
      <CodeBlock lang="java" filename="zappy-application/.../accounts/RefreshSession.java" code={JAVA_FAMILY_CODE} />
      <P>{copy.rotation4[locale]}</P>
      <FlowDiagram
        nodes={rotation.nodes}
        edges={rotation.edges}
        height={720}
        ariaLabel={copy.rotationAria[locale]}
        caption={copy.rotationCaption[locale]}
      />
      <P>{copy.rotation5[locale]}</P>
      <CodeBlock lang="json" filename="contract/expected/refresh-session-replayed.json" code={REPLAY_EXPECTED_CODE} />
      <P>{copy.rotation6[locale]}</P>
      <CodeBlock lang="ts" filename="tools/end-to-end/tests/sessionsAndReplay.spec.ts" code={REPLAY_END_TO_END_CODE} />
      <P>{copy.rotation7[locale]}</P>
      <CodeBlock lang="ts" filename="src/app/api/session-refresher.ts" code={ANGULAR_REFRESHER_CODE} />
      <P>{copy.rotation8[locale]}</P>

      <Divider />

      <H2>{copy.originTitle[locale]}</H2>
      <P>{copy.origin1[locale]}</P>
      <P>{copy.origin2[locale]}</P>
      <CodeBlock lang="csharp" filename="src/Zappy.Adapters.GraphQL/Origin/OriginCheck.cs" code={ORIGIN_CHECK_CODE} />
      <P>{copy.origin3[locale]}</P>
      <CodeBlock lang="kotlin" filename="zappy-adapters/.../graphql/RequestContextInterceptor.kt" code={KOTLIN_ORIGIN_CODE} />
      <P>{copy.origin4[locale]}</P>
      <CodeBlock lang="ts" filename="shared/src/security/originCheck.ts" code={NODE_ORIGIN_CODE} />
      <P>{copy.origin5[locale]}</P>

      <H2>{copy.argonTitle[locale]}</H2>
      <P>{copy.argon1[locale]}</P>
      <CodeBlock lang="csharp" filename="src/Zappy.Adapters.Security/Argon2idPasswordHasher.cs" code={ARGON_DOTNET_CODE} />
      <P>{copy.argon2[locale]}</P>
      <CodeBlock lang="java" filename="zappy-adapters/.../security/Argon2PasswordHasher.java" code={ARGON_JAVA_CODE} />
      <CodeBlock lang="kotlin" filename="zappy-adapters/.../security/Argon2PasswordHasher.kt" code={ARGON_KOTLIN_CODE} />
      <P>{copy.argon3[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/accounts/.../security/argon2PasswordHasher.ts" code={ARGON_NODE_CODE} />
      <P>{copy.argon4[locale]}</P>

      <H2>{copy.limitsTitle[locale]}</H2>
      <P>{copy.limits1[locale]}</P>
      <CodeBlock lang="csharp" filename="src/Zappy.Adapters.Security/InMemoryRateLimiter.cs" code={RATE_LIMITER_CODE} />
      <P>{copy.limits2[locale]}</P>
      <CodeBlock lang="csharp" filename="src/Zappy.Application/Accounts/LogIn.cs" code={LOG_IN_CODE} />
      <P>{copy.limits3[locale]}</P>
      <P>{copy.limits4[locale]}</P>

      <H2>{copy.devicesTitle[locale]}</H2>
      <P>{copy.devices1[locale]}</P>
      <CodeBlock lang="graphql" filename="contract/schema.graphql" code={SCHEMA_SESSION_CODE} />
      <P>{copy.devices2[locale]}</P>
      <CodeBlock lang="ts" filename="app/session/deviceDescription.ts" code={DEVICE_DESCRIPTION_CODE} />
      <P>{copy.devices3[locale]}</P>

      <H2>{copy.jwksTitle[locale]}</H2>
      <P>{copy.jwks1[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/accounts/.../security/rsaTokenIssuer.ts" code={RSA_TOKEN_ISSUER_CODE} />
      <P>{copy.jwks2[locale]}</P>
      <CodeBlock lang="ts" filename="subgraphs/accounts/src/host/main.ts" code={JWKS_ROUTE_CODE} />
      <P>{copy.jwks3[locale]}</P>
      <CodeBlock lang="ts" filename="shared/src/security/accessToken.ts" code={ACCESS_TOKEN_VERIFIER_CODE} />
      <P>{copy.jwks4[locale]}</P>

      <H2>{copy.loggingTitle[locale]}</H2>
      <P>{copy.logging1[locale]}</P>
      <CodeBlock lang="graphql" filename="contract/schema.graphql" code={SCHEMA_USER_ERROR_CODE} />
      <P>{copy.logging2[locale]}</P>
      <P>{copy.logging3[locale]}</P>

      <Divider />

      <H2>{copy.tableTitle[locale]}</H2>
      <P>{copy.table1[locale]}</P>
      <RuleTable
        caption={copy.tableCaption[locale]}
        ruleHeader={copy.tableRuleHeader[locale]}
        rows={RULE_ROWS.map((row) => ({ ...row, rule: row.rule[locale] }))}
      />
      <P>{copy.table2[locale]}</P>

      <H2>{copy.recordTitle[locale]}</H2>
      <P>{copy.record1[locale]}</P>
      <P>{copy.record2[locale]}</P>
      <P>{copy.record3[locale]}</P>

      <H2>{copy.closingTitle[locale]}</H2>
      <P>{copy.closing1[locale]}</P>
      <OL>
        <LI>{copy.closingStep1[locale]}</LI>
        <LI>{copy.closingStep2[locale]}</LI>
        <LI>{copy.closingStep3[locale]}</LI>
        <LI>{copy.closingStep4[locale]}</LI>
        <LI>{copy.closingStep5[locale]}</LI>
      </OL>
      <P>
        {copy.closing2Before[locale]}
        <A href={`/${locale}/blog/graphql-as-a-contract-between-frontend-and-backend`}>
          {copy.contractArticleLink[locale]}
        </A>
        {copy.closing2After[locale]}
      </P>
      <P>{copy.closing3[locale]}</P>
    </>
  );
}

const SCHEMA_AUTHENTICATION_CODE = `"""
The answer of \`register\`, \`login\` and \`refreshSession\`. The refresh token
is not in this payload: it is set as an httpOnly, Secure, SameSite Lax
cookie whose path is limited to the refresh mutation, so no script can
read it and no other request carries it.
"""
type AuthenticationPayload {
  customer: Customer
  accessToken: String
  accessTokenExpiresAt: DateTime
  errors: [UserError!]!
}

type Mutation {
  register(input: RegisterInput!): AuthenticationPayload!
  login(input: LoginInput!): AuthenticationPayload!
  refreshSession: AuthenticationPayload!
  logout: LogoutPayload!
  revokeSession(sessionId: ID!): RevokeSessionPayload!
}`;

const SESSION_LIFETIME_CODE = `namespace Zappy.Application;

public static class SessionLifetime
{
    public static readonly TimeSpan AccessToken = TimeSpan.FromMinutes(15);

    public static readonly TimeSpan RefreshToken = TimeSpan.FromDays(30);
}`;

const JWT_TOKEN_ISSUER_CODE = `using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Zappy.Application;

namespace Zappy.Adapters.Security;

public sealed class JwtTokenIssuer(SigningKeys keys, SecuritySettings settings) : ITokenIssuer
{
    private static readonly JsonWebTokenHandler Handler = new();

    public AccessToken IssueAccessToken(string customerId, string sessionId, DateTimeOffset moment)
    {
        var issuedAt = WholeSeconds(moment);
        var expiresAt = WholeSeconds(moment.Add(SessionLifetime.AccessToken));

        var descriptor = new SecurityTokenDescriptor
        {
            Issuer = settings.Issuer,
            Audience = settings.Audience,
            IssuedAt = issuedAt.UtcDateTime,
            NotBefore = issuedAt.UtcDateTime,
            Expires = expiresAt.UtcDateTime,
            Claims = new Dictionary<string, object>
            {
                ["sub"] = customerId,
                ["sid"] = sessionId
            },
            SigningCredentials = new SigningCredentials(keys.Key, SecurityAlgorithms.RsaSha256)
        };

        return new AccessToken(Handler.CreateToken(descriptor), expiresAt);
    }

    public string IssueRefreshToken() => Base64UrlEncoder.Encode(RandomNumberGenerator.GetBytes(32));

    public string HashRefreshToken(string refreshToken) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(refreshToken))).ToLowerInvariant();

    private static DateTimeOffset WholeSeconds(DateTimeOffset moment) =>
        new(moment.Ticks - (moment.Ticks % TimeSpan.TicksPerSecond), moment.Offset);
}`;

const START_SESSION_CODE = `using Zappy.Domain;

namespace Zappy.Application;

public sealed class StartSession(ISessionRepository sessions, ITokenIssuer tokenIssuer, IClock clock)
{
    public async Task<Authentication> Execute(Customer customer, string device, CancellationToken cancellationToken)
    {
        var now = clock.Now;
        var session = new Session(
            Identifier.New(),
            customer.Id,
            device,
            await sessions.NextCreationOrderFor(customer.Id, cancellationToken),
            now,
            now.Add(SessionLifetime.RefreshToken));
        var refreshToken = tokenIssuer.IssueRefreshToken();
        var storedToken = new RefreshToken(
            Identifier.New(),
            session.Id,
            tokenIssuer.HashRefreshToken(refreshToken),
            now,
            session.ExpiresAt);

        await sessions.Add(session, storedToken, cancellationToken);

        var accessToken = tokenIssuer.IssueAccessToken(customer.Id, session.Id, now);
        return new Authentication(
            customer,
            accessToken.Value,
            accessToken.ExpiresAt,
            refreshToken,
            session.ExpiresAt,
            session.Id);
    }
}`;

const REACT_ROUTER_SESSION_CODE = `import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";
import { createCookie } from "react-router";
import { runningInProduction, sessionSecret } from "~/environment.server";

export type StoreFrontSession = {
  accessToken: string | null;
  accessTokenExpiresAt: string | null;
  accessTokenObtainedAt: string | null;
  refreshCookie: string | null;
  cartCookie: string | null;
  customerName: string | null;
};

export const emptyStoreFrontSession: StoreFrontSession = {
  accessToken: null,
  accessTokenExpiresAt: null,
  accessTokenObtainedAt: null,
  refreshCookie: null,
  cartCookie: null,
  customerName: null,
};

const cipherAlgorithm = "aes-256-gcm";
const keyLength = 32;
const nonceLength = 12;
const authenticationTagLength = 16;
const keyDerivationSalt = "zappy-mart-store-front-session";
const thirtyDaysInSeconds = 60 * 60 * 24 * 30;

const storeFrontCookie = createCookie("zappy_store_front", {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  maxAge: thirtyDaysInSeconds,
  secure: runningInProduction(),
});

let derivedKey: Buffer | null = null;

function encryptionKey(): Buffer {
  if (derivedKey === null) {
    derivedKey = scryptSync(sessionSecret(), keyDerivationSalt, keyLength);
  }
  return derivedKey;
}

export function encryptSession(session: StoreFrontSession): string {
  const nonce = randomBytes(nonceLength);
  const cipher = createCipheriv(cipherAlgorithm, encryptionKey(), nonce);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(session), "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([nonce, cipher.getAuthTag(), ciphertext]).toString(
    "base64url",
  );
}

export function decryptSession(encrypted: string): StoreFrontSession {
  try {
    const raw = Buffer.from(encrypted, "base64url");
    const nonce = raw.subarray(0, nonceLength);
    const authenticationTag = raw.subarray(
      nonceLength,
      nonceLength + authenticationTagLength,
    );
    const ciphertext = raw.subarray(nonceLength + authenticationTagLength);
    const decipher = createDecipheriv(cipherAlgorithm, encryptionKey(), nonce);
    decipher.setAuthTag(authenticationTag);
    const plaintext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString("utf8");
    return { ...emptyStoreFrontSession, ...JSON.parse(plaintext) };
  } catch {
    return emptyStoreFrontSession;
  }
}

export async function readStoreFrontSession(
  request: Request,
): Promise<StoreFrontSession> {
  const encrypted: unknown = await storeFrontCookie.parse(
    request.headers.get("Cookie"),
  );
  if (typeof encrypted !== "string") {
    return emptyStoreFrontSession;
  }
  return decryptSession(encrypted);
}

export async function writeStoreFrontSession(
  session: StoreFrontSession,
): Promise<string> {
  return storeFrontCookie.serialize(encryptSession(session));
}

export async function clearStoreFrontSession(): Promise<string> {
  return storeFrontCookie.serialize("", { maxAge: 0 });
}`;

const REACT_ROUTER_CONNECTION_CODE = `const renewalMarginMilliseconds = 30_000;

const documentsThatCarryTheRefreshCookie: readonly unknown[] = [
  refreshSessionMutation,
  logoutMutation,
];

export async function connectToStore(
  request: Request,
): Promise<StoreConnection> {
  let session = await readStoreFrontSession(request);
  let sessionChanged = false;

  function credentials(document: unknown): StoreCredentials {
    return {
      accessToken: session.accessToken,
      cartCookie: session.cartCookie,
      refreshCookie: documentsThatCarryTheRefreshCookie.includes(document)
        ? session.refreshCookie
        : null,
    };
  }

  function accessTokenNeedsRenewal(): boolean {
    if (session.accessToken === null || session.accessTokenObtainedAt === null) {
      return true;
    }
    const obtainedAt = Date.parse(session.accessTokenObtainedAt);
    if (Number.isNaN(obtainedAt)) {
      return true;
    }
    if (Date.now() - obtainedAt >= accessTokenMaximumAgeSeconds() * 1000) {
      return true;
    }
    if (session.accessTokenExpiresAt === null) {
      return false;
    }
    const expiresAt = Date.parse(session.accessTokenExpiresAt);
    return (
      !Number.isNaN(expiresAt) &&
      expiresAt - Date.now() <= renewalMarginMilliseconds
    );
  }

  async function renewAccessToken(): Promise<void> {
    const answer = await callStore(
      refreshSessionMutation,
      {},
      credentials(refreshSessionMutation),
    );
    absorbCookies(answer.setCookieHeaders);
    const payload = answer.data?.refreshSession ?? null;
    if (payload === null || payload.accessToken === null) {
      forgetCustomer();
      return;
    }
    rememberAuthentication(payload);
  }

  if (session.refreshCookie !== null && accessTokenNeedsRenewal()) {
    await renewAccessToken();
  }

  return { signedIn: session.accessToken !== null, run, headers };
}`;

const REACT_ROUTER_HEADERS_CODE = `export const cartCookieName = "zappy_cart";
export const refreshCookieName = "zappy_refresh";

export type StoreCredentials = {
  accessToken: string | null;
  cartCookie: string | null;
  refreshCookie: string | null;
};

function buildHeaders(credentials: StoreCredentials): Record<string, string> {
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

const NEXT_SESSION_CODE = `import { cookies } from "next/headers";

import { runningInProduction } from "@/configuration";
import {
  decryptSession,
  emptySession,
  encryptSession,
  type StorefrontSession,
} from "@/server/sessionCipher";

export const sessionCookieName = "zappy_store_front";

const thirtyDaysInSeconds = 60 * 60 * 24 * 30;

export async function readSession(): Promise<StorefrontSession> {
  const cookieStore = await cookies();
  const stored = cookieStore.get(sessionCookieName);
  return stored === undefined ? emptySession : decryptSession(stored.value);
}

export async function writeSession(session: StorefrontSession): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, encryptSession(session), {
    httpOnly: true,
    secure: runningInProduction,
    sameSite: "lax",
    path: "/",
    maxAge: thirtyDaysInSeconds,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function storeAccessToken(
  accessToken: string,
  accessTokenExpiresAt: string | null,
): Promise<void> {
  const session = await readSession();
  await writeSession({ ...session, accessToken, accessTokenExpiresAt });
}

export async function forgetAccessToken(): Promise<void> {
  const session = await readSession();
  await writeSession({
    ...session,
    accessToken: null,
    accessTokenExpiresAt: null,
    refreshCookie: null,
  });
}`;

const NEXT_REFRESH_ROUTE_CODE = `import { NextResponse } from "next/server";

import type { SessionAnswer } from "@/browser/sessionRefresh";
import { storefrontOrigin } from "@/configuration";
import { refreshSessionMutation } from "@/graphql/operations";
import { clearSession, readSession, storeAccessToken } from "@/server/session";
import { writeToApi } from "@/server/storefrontClient";

const signedOut: SessionAnswer = {
  signedIn: false,
  accessTokenExpiresAt: null,
};

export async function POST(request: Request): Promise<NextResponse> {
  if (request.headers.get("origin") !== storefrontOrigin) {
    return NextResponse.json(
      { message: "This endpoint answers the store front only." },
      { status: 403 },
    );
  }

  const session = await readSession();
  if (session.accessToken === null) {
    return NextResponse.json(signedOut);
  }

  const data = await writeToApi(refreshSessionMutation, {});
  const accessToken = data?.refreshSession.accessToken ?? null;
  if (accessToken === null) {
    await clearSession();
    return NextResponse.json(signedOut);
  }

  const accessTokenExpiresAt =
    data?.refreshSession.accessTokenExpiresAt ?? null;
  await storeAccessToken(accessToken, accessTokenExpiresAt);

  return NextResponse.json({
    signedIn: true,
    accessTokenExpiresAt,
  } satisfies SessionAnswer);
}`;

const ANGULAR_TOKEN_STORE_CODE = `import { computed, Injectable, signal } from '@angular/core';

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

const ANGULAR_INTERCEPTOR_CODE = `import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { accessTokenHeader } from './access-token-header';
import { AccessTokenStore } from './access-token-store';
import { withoutAccessToken } from './authentication-context';
import { GRAPHQL_URL } from './graphql-url';
import { SessionRefresher } from './session-refresher';

const unauthorisedStatus = 401;

export const authenticationInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.url !== inject(GRAPHQL_URL)) {
    return next(request);
  }

  const carriesCookies = request.clone({ withCredentials: true });

  if (carriesCookies.context.get(withoutAccessToken)) {
    return next(carriesCookies);
  }

  const accessTokenStore = inject(AccessTokenStore);
  const sessionRefresher = inject(SessionRefresher);
  const sendAgainWithTheNewToken = () =>
    next(carriesCookies.clone({ setHeaders: accessTokenHeader(accessTokenStore.token()) }));

  if (accessTokenStore.aboutToExpire()) {
    return sessionRefresher.refresh().pipe(switchMap(sendAgainWithTheNewToken));
  }

  return next(carriesCookies).pipe(
    catchError((failure: unknown) => {
      if (!(failure instanceof HttpErrorResponse) || failure.status !== unauthorisedStatus) {
        return throwError(() => failure);
      }

      return sessionRefresher
        .refresh()
        .pipe(
          switchMap((refreshed) =>
            refreshed ? sendAgainWithTheNewToken() : throwError(() => failure)
          )
        );
    })
  );
};`;

const ANGULAR_MARKER_CODE = `import { DOCUMENT, inject, Injectable } from '@angular/core';

const cookieName = 'zappy_session';

@Injectable({ providedIn: 'root' })
export class SessionMarker {
  private readonly document = inject(DOCUMENT);

  present(): boolean {
    return this.document.cookie
      .split(';')
      .some((entry) => entry.trim().startsWith(\`\${cookieName}=\`));
  }

  remember(): void {
    this.write('open', 'max-age=2592000');
  }

  forget(): void {
    this.write('', 'max-age=0');
  }

  private write(value: string, lifetime: string): void {
    const secure = this.document.location.protocol === 'https:' ? '; secure' : '';
    this.document.cookie = \`\${cookieName}=\${value}; path=/; samesite=lax; \${lifetime}\${secure}\`;
  }
}`;

const SESSION_ENTITY_CODE = `namespace Zappy.Domain;

public sealed class Session
{
    public string Id { get; private set; } = null!;

    public string CustomerId { get; private set; } = null!;

    public string Device { get; private set; } = null!;

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset LastUsedAt { get; private set; }

    public DateTimeOffset ExpiresAt { get; private set; }

    public DateTimeOffset? RevokedAt { get; private set; }

    public bool IsOpenAt(DateTimeOffset moment) => RevokedAt is null && moment < ExpiresAt;

    public void Revoke(DateTimeOffset moment) => RevokedAt ??= moment;

    public void RecordUse(DateTimeOffset moment) => LastUsedAt = moment;
}`;

const BEARER_TOKEN_SETUP_CODE = `using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Zappy.Adapters.Security;
using Zappy.Application;

namespace Zappy.Host;

public sealed class BearerTokenSetup(SecuritySettings settings, SigningKeys keys)
    : IConfigureNamedOptions<JwtBearerOptions>
{
    public void Configure(string? name, JwtBearerOptions options) => Configure(options);

    public void Configure(JwtBearerOptions options)
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = settings.Issuer,
            ValidAudience = settings.Audience,
            IssuerSigningKey = keys.Key,
            ClockSkew = TimeSpan.FromSeconds(5),
            NameClaimType = "sub"
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = TheSessionMustStillBeOpen
        };
    }

    private static async Task TheSessionMustStillBeOpen(TokenValidatedContext context)
    {
        var sessionId = context.Principal?.FindFirst("sid")?.Value;
        if (sessionId is null)
        {
            context.Fail("The access token names no session.");
            return;
        }

        var services = context.HttpContext.RequestServices;
        var sessions = services.GetRequiredService<ISessionRepository>();
        var clock = services.GetRequiredService<IClock>();
        var session = await sessions.WithId(sessionId, context.HttpContext.RequestAborted);

        if (session is null || !session.IsOpenAt(clock.Now))
        {
            context.Fail("The session was logged out or revoked.");
        }
    }
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

const REFRESH_TOKEN_CODE = `namespace Zappy.Domain;

public sealed class RefreshToken
{
    public RefreshToken(string id, string sessionId, string tokenHash, DateTimeOffset createdAt, DateTimeOffset expiresAt)
    {
        Id = id;
        SessionId = sessionId;
        TokenHash = tokenHash;
        CreatedAt = createdAt;
        ExpiresAt = expiresAt;
    }

    public string Id { get; private set; } = null!;

    public string SessionId { get; private set; } = null!;

    public string TokenHash { get; private set; } = null!;

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset ExpiresAt { get; private set; }

    public DateTimeOffset? RotatedAt { get; private set; }

    public bool WasAlreadyUsed => RotatedAt is not null;

    public bool HasExpiredAt(DateTimeOffset moment) => moment >= ExpiresAt;

    public void Rotate(DateTimeOffset moment) => RotatedAt = moment;
}`;

const REFRESH_SESSION_CODE = `using Zappy.Domain;

namespace Zappy.Application;

public sealed class RefreshSession(
    ISessionRepository sessions,
    ICustomerRepository customers,
    ITokenIssuer tokenIssuer,
    IUnitOfWork unitOfWork,
    IClock clock)
{
    public Task<Result<Authentication>> Execute(string? presentedRefreshToken, CancellationToken cancellationToken) =>
        unitOfWork.RunInOneTransaction(
            async token =>
            {
                if (string.IsNullOrWhiteSpace(presentedRefreshToken))
                {
                    return Unusable();
                }

                var now = clock.Now;
                var stored = await sessions.WithTokenHash(tokenIssuer.HashRefreshToken(presentedRefreshToken), token);
                if (stored is null)
                {
                    return Unusable();
                }

                var session = await sessions.WithId(stored.SessionId, token);
                if (session is null)
                {
                    return Unusable();
                }

                if (stored.WasAlreadyUsed)
                {
                    session.Revoke(now);
                    return Unusable();
                }

                if (stored.HasExpiredAt(now) || !session.IsOpenAt(now))
                {
                    return Unusable();
                }

                var customer = await customers.WithId(session.CustomerId, token);
                if (customer is null)
                {
                    return Unusable();
                }

                stored.Rotate(now);
                session.RecordUse(now);

                var replacement = tokenIssuer.IssueRefreshToken();
                await sessions.AddRefreshToken(
                    new RefreshToken(
                        Identifier.New(),
                        session.Id,
                        tokenIssuer.HashRefreshToken(replacement),
                        now,
                        session.ExpiresAt),
                    token);

                var accessToken = tokenIssuer.IssueAccessToken(customer.Id, session.Id, now);
                return Result<Authentication>.Success(new Authentication(
                    customer,
                    accessToken.Value,
                    accessToken.ExpiresAt,
                    replacement,
                    session.ExpiresAt,
                    session.Id));
            },
            cancellationToken);

    private static Result<Authentication> Unusable() =>
        Result<Authentication>.Failure(
            UserErrorCode.SessionInvalid,
            "The refresh token is unknown, expired or was already used.");
}`;

const JAVA_FAMILY_CODE = `Optional<RefreshToken> stored =
        sessionStore.refreshTokenByHash(tokenIssuer.hashOfRefreshToken(presentedRefreshToken));
if (stored.isEmpty()) {
    return sessionInvalid();
}
RefreshToken refreshToken = stored.get();
if (refreshToken.wasAlreadyUsed()) {
    sessionStore.revokeFamily(refreshToken.sessionId(), moment);
    return sessionInvalid();
}
if (refreshToken.hasExpiredAt(moment)) {
    return sessionInvalid();
}`;

const REPLAY_EXPECTED_CODE = `{
  "data": {
    "refreshSession": {
      "accessToken": null,
      "accessTokenExpiresAt": null,
      "customer": null,
      "errors": [
        {
          "code": "SESSION_INVALID",
          "field": null
        }
      ]
    }
  },
  "errors": []
}`;

const REPLAY_END_TO_END_CODE = `async function cookiesOfTheSignedInBrowser(context: BrowserContext): Promise<Cookie[]> {
  const cookies = await context.cookies();
  if (cookies.length === 0) {
    throw new Error(
      "The store front set no cookie while signed in, so there is nothing to replay.",
    );
  }
  return cookies;
}

const cookiesBeforeLogout = await cookiesOfTheSignedInBrowser(firstContext);
await logOut(firstPage);
await firstContext.addCookies(cookiesBeforeLogout);
await firstPage.goto("/account");
await expectSessionEndedNotice(firstPage);`;

const ANGULAR_REFRESHER_CODE = `@Injectable({ providedIn: 'root' })
export class SessionRefresher {
  private readonly httpClient = inject(HttpClient);
  private readonly graphqlUrl = inject(GRAPHQL_URL);
  private readonly accessTokenStore = inject(AccessTokenStore);

  private runningRefresh: Observable<boolean> | null = null;

  refresh(): Observable<boolean> {
    if (this.runningRefresh === null) {
      this.runningRefresh = this.askForNewAccessToken().pipe(
        finalize(() => {
          this.runningRefresh = null;
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }

    return this.runningRefresh;
  }

  private askForNewAccessToken(): Observable<boolean> {
    return this.httpClient
      .post<GraphqlAnswer<RefreshSessionMutation>>(
        this.graphqlUrl,
        { query: print(RefreshSessionDocument), variables: {} },
        {
          headers: { 'Content-Type': 'application/json' },
          context: new HttpContext().set(withoutAccessToken, true),
          withCredentials: true,
        }
      )
      .pipe(
        map((answer) => this.holdTokenFrom(answer)),
        catchError(() => {
          this.accessTokenStore.release();
          return of(false);
        })
      );
  }

  private holdTokenFrom(answer: GraphqlAnswer<RefreshSessionMutation>): boolean {
    const payload = answer.data?.refreshSession;

    if (payload === undefined || payload.accessToken === null) {
      this.accessTokenStore.release();
      return false;
    }

    this.accessTokenStore.hold(payload.accessToken, payload.accessTokenExpiresAt);
    return true;
  }
}`;

const ORIGIN_CHECK_CODE = `using System.Text;
using System.Text.Json;
using HotChocolate.Language;
using Microsoft.AspNetCore.Http;

namespace Zappy.Adapters.GraphQL;

public sealed class OriginCheck(RequestDelegate next, GraphQLSettings settings)
{
    private const string Refusal =
        "{\\"errors\\":[{\\"message\\":\\"A mutation needs an Origin header that names an allowed origin.\\","
        + "\\"extensions\\":{\\"code\\":\\"ORIGIN_NOT_ALLOWED\\"}}]}";

    public async Task InvokeAsync(HttpContext context)
    {
        if (!IsGraphQLPost(context))
        {
            await next(context);
            return;
        }

        context.Request.EnableBuffering();
        var carriesAMutation = await CarriesAMutation(context.Request);
        context.Request.Body.Position = 0;

        if (carriesAMutation && !OriginIsAllowed(context))
        {
            context.Response.StatusCode = StatusCodes.Status200OK;
            context.Response.ContentType = "application/json; charset=utf-8";
            await context.Response.WriteAsync(Refusal, Encoding.UTF8, context.RequestAborted);
            return;
        }

        await next(context);
    }

    private bool OriginIsAllowed(HttpContext context)
    {
        var origin = context.Request.Headers.Origin.ToString().TrimEnd('/');
        return !string.IsNullOrWhiteSpace(origin)
            && settings.AllowedOrigins.Any(allowed =>
                string.Equals(allowed.TrimEnd('/'), origin, StringComparison.OrdinalIgnoreCase));
    }

    private static bool HasMutation(JsonElement request)
    {
        if (!request.TryGetProperty("query", out var query) || query.ValueKind != JsonValueKind.String)
        {
            return false;
        }

        var asked = request.TryGetProperty("operationName", out var operationName)
            && operationName.ValueKind == JsonValueKind.String
                ? operationName.GetString()
                : null;

        try
        {
            var document = Utf8GraphQLParser.Parse(query.GetString() ?? string.Empty);
            return document.Definitions
                .OfType<OperationDefinitionNode>()
                .Where(operation => asked is null || operation.Name?.Value == asked)
                .Any(operation => operation.Operation == OperationType.Mutation);
        }
        catch (SyntaxException)
        {
            return false;
        }
    }
}`;

const KOTLIN_ORIGIN_CODE = `override fun intercept(request: WebGraphQlRequest, chain: WebGraphQlInterceptor.Chain): Mono<WebGraphQlResponse> {
    if (changesSomething(request) && !comesFromAnAllowedOrigin(request)) {
        return Mono.just(refuseTheOrigin(request))
    }
    val context = RequestContext(
        startingVisitor = identifyVisitor.execute(bearerTokenOf(request), cookieValueOf(request, Cookies.CART_NAME)),
        presentedRefreshToken = cookieValueOf(request, Cookies.REFRESH_TOKEN_NAME),
        device = request.headers.getFirst(HttpHeaders.USER_AGENT) ?: "An unnamed device",
        cookies = cookies,
    )
    request.configureExecutionInput { _, builder ->
        builder.graphQLContext { holder -> holder.put(RequestContext.KEY, context) }.build()
    }
    return chain.next(request).doOnNext { response ->
        context.cookiesToSet().forEach { cookie -> response.responseHeaders.add(HttpHeaders.SET_COOKIE, cookie) }
    }
}

private fun changesSomething(request: WebGraphQlRequest): Boolean = try {
    Parser.parse(request.document)
        .getDefinitionsOfType(OperationDefinition::class.java)
        .filter { definition -> request.operationName == null || definition.name == request.operationName }
        .any { definition -> definition.operation == OperationDefinition.Operation.MUTATION }
} catch (malformed: RuntimeException) {
    false
}

private fun comesFromAnAllowedOrigin(request: WebGraphQlRequest): Boolean {
    val origin = request.headers.getFirst(HttpHeaders.ORIGIN) ?: return false
    return properties.allowedOrigins.contains(origin)
}`;

const NODE_ORIGIN_CODE = `import { allowedOrigins } from "../configuration.js";

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

const ARGON_DOTNET_CODE = `using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using Konscious.Security.Cryptography;
using Zappy.Application;

namespace Zappy.Adapters.Security;

public sealed class Argon2idPasswordHasher(SecuritySettings settings) : IPasswordHasher
{
    private const int SaltLength = 16;

    private const int HashLength = 32;

    private const string Algorithm = "argon2id";

    private const string Version = "v=19";

    private const char Separator = '$';

    public string Hash(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltLength);
        var hash = Compute(
            password,
            salt,
            settings.Argon2MemoryKibibytes,
            settings.Argon2Iterations,
            settings.Argon2Parallelism);

        var parameters = string.Format(
            CultureInfo.InvariantCulture,
            "m={0},t={1},p={2}",
            settings.Argon2MemoryKibibytes,
            settings.Argon2Iterations,
            settings.Argon2Parallelism);

        var salted = Convert.ToBase64String(salt);
        var hashed = Convert.ToBase64String(hash);
        return string.Join(Separator, string.Empty, Algorithm, Version, parameters, salted, hashed);
    }

    public bool Matches(string password, string hash)
    {
        var parts = hash.Split(Separator, StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length != 5 || parts[0] != Algorithm)
        {
            return false;
        }

        var chosen = parts[2].Split(',');
        if (chosen.Length != 3)
        {
            return false;
        }

        var memoryKibibytes = ValueOf(chosen[0]);
        var iterations = ValueOf(chosen[1]);
        var parallelism = ValueOf(chosen[2]);
        if (memoryKibibytes is null || iterations is null || parallelism is null)
        {
            return false;
        }

        var salt = Convert.FromBase64String(parts[3]);
        var stored = Convert.FromBase64String(parts[4]);
        var computed = Compute(password, salt, memoryKibibytes.Value, iterations.Value, parallelism.Value);
        return CryptographicOperations.FixedTimeEquals(stored, computed);
    }

    private static int? ValueOf(string setting) =>
        int.TryParse(setting.AsSpan(setting.IndexOf('=') + 1), CultureInfo.InvariantCulture, out var value)
            ? value
            : null;

    private static byte[] Compute(string password, byte[] salt, int memoryKibibytes, int iterations, int parallelism)
    {
        using var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
        {
            Salt = salt,
            MemorySize = memoryKibibytes,
            Iterations = iterations,
            DegreeOfParallelism = parallelism
        };

        return argon2.GetBytes(HashLength);
    }
}`;

const ARGON_JAVA_CODE = `package com.zappymart.adapters.security;

import com.zappymart.application.ports.PasswordHasher;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;

public final class Argon2PasswordHasher implements PasswordHasher {

    public static final int SALT_LENGTH_IN_BYTES = 16;

    public static final int HASH_LENGTH_IN_BYTES = 32;

    public static final int PARALLELISM = 1;

    public static final int MEMORY_IN_KIBIBYTES = 19456;

    public static final int ITERATIONS = 2;

    private final Argon2PasswordEncoder encoder = new Argon2PasswordEncoder(
            SALT_LENGTH_IN_BYTES, HASH_LENGTH_IN_BYTES, PARALLELISM, MEMORY_IN_KIBIBYTES, ITERATIONS);

    @Override
    public String hash(String password) {
        return encoder.encode(password);
    }

    @Override
    public boolean matches(String password, String storedHash) {
        return encoder.matches(password, storedHash);
    }
}`;

const ARGON_KOTLIN_CODE = `package nl.zappymart.adapters.security

import nl.zappymart.application.ports.PasswordHasher
import nl.zappymart.domain.accounts.PasswordHash
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder
import org.springframework.stereotype.Component

@Component
class Argon2PasswordHasher : PasswordHasher {

    private val encoder = Argon2PasswordEncoder(
        SALT_LENGTH_IN_BYTES,
        HASH_LENGTH_IN_BYTES,
        PARALLELISM,
        MEMORY_IN_KIBIBYTES,
        ITERATIONS,
    )

    override fun hash(password: String) = PasswordHash(requireNotNull(encoder.encode(password)))

    override fun matches(password: String, hash: PasswordHash) = encoder.matches(password, hash.value)

    private companion object {
        const val SALT_LENGTH_IN_BYTES = 16
        const val HASH_LENGTH_IN_BYTES = 32
        const val PARALLELISM = 1
        const val MEMORY_IN_KIBIBYTES = 19456
        const val ITERATIONS = 2
    }
}`;

const ARGON_NODE_CODE = `import argon2 from "argon2";
import type { PasswordHasher } from "../../application/ports.js";

export const argon2idParameters = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1
} as const;

export function argon2PasswordHasher(): PasswordHasher {
  return {
    async hash(password: string): Promise<string> {
      return argon2.hash(password, argon2idParameters);
    },

    async verify(passwordHash: string, password: string): Promise<boolean> {
      try {
        return await argon2.verify(passwordHash, password);
      } catch {
        return false;
      }
    }
  };
}`;

const RATE_LIMITER_CODE = `using Zappy.Application;

namespace Zappy.Adapters.Security;

public sealed class InMemoryRateLimiter(SecuritySettings settings) : IRateLimiter
{
    private readonly Dictionary<string, List<DateTimeOffset>> attemptsByKey = [];

    private readonly Lock guard = new();

    public bool AllowsAttempt(string key, DateTimeOffset moment)
    {
        var window = TimeSpan.FromMinutes(settings.LoginAttemptWindowMinutes);

        lock (guard)
        {
            if (!attemptsByKey.TryGetValue(key, out var attempts))
            {
                attempts = [];
                attemptsByKey[key] = attempts;
            }

            attempts.RemoveAll(attempt => moment - attempt > window);
            if (attempts.Count >= settings.LoginAttemptsAllowed)
            {
                return false;
            }

            attempts.Add(moment);
            return true;
        }
    }

    public void Forget()
    {
        lock (guard)
        {
            attemptsByKey.Clear();
        }
    }
}`;

const LOG_IN_CODE = `public Task<Result<Authentication>> Execute(
    Visitor visitor,
    string email,
    string password,
    string device,
    string clientAddress,
    CancellationToken cancellationToken) =>
    unitOfWork.RunInOneTransaction(
        async token =>
        {
            var now = clock.Now;
            if (!rateLimiter.AllowsAttempt($"login:{clientAddress}", now) ||
                !rateLimiter.AllowsAttempt($"login:{email.Trim().ToLowerInvariant()}", now))
            {
                return Result<Authentication>.Failure(
                    UserErrorCode.RateLimited,
                    "Too many attempts in a short time. Wait a moment and try again.");
            }

            var emailAddress = EmailAddress.Create(email);
            var customer = emailAddress is null ? null : await customers.WithEmail(emailAddress, token);
            if (customer is null)
            {
                passwordHasher.Hash(password);
                return WrongCredentials();
            }

            if (!passwordHasher.Matches(password, customer.PasswordHash))
            {
                return WrongCredentials();
            }

            var authentication = await startSession.Execute(customer, device, token);
            await mergeAnonymousWishlist.Execute(customer, visitor, token);
            await mergeAnonymousCart.Execute(customer, visitor, token);
            return Result<Authentication>.Success(authentication);
        },
        cancellationToken);

private static Result<Authentication> WrongCredentials() =>
    Result<Authentication>.Failure(
        UserErrorCode.CredentialsInvalid,
        "The email address and the password together do not match a customer.");`;

const SCHEMA_SESSION_CODE = `"""
One login of one customer, on one device. A session is what makes a
logout immediate: the access token is short lived and stateless, and this
row is what a customer revokes.
"""
type Session {
  """
  The opaque id of the session, which \`revokeSession\` takes. It is not
  the refresh token and it is safe to show.
  """
  id: ID!

  """
  How the customer recognises this session, for example
  \`Chrome on Windows\`. It comes from the \`device\` field of \`login\` when
  the client sends one, and from the user agent otherwise.
  """
  device: String!

  createdAt: DateTime!

  """
  When this session last exchanged its refresh token, so the customer
  sees which sessions are still in use.
  """
  lastUsedAt: DateTime!

  """
  True for the session the request is being made from, so a client can
  label it and warn before revoking it.
  """
  current: Boolean!
}`;

const DEVICE_DESCRIPTION_CODE = `const browsers = [
  { marker: "Edg/", name: "Edge" },
  { marker: "OPR/", name: "Opera" },
  { marker: "Firefox/", name: "Firefox" },
  { marker: "Chrome/", name: "Chrome" },
  { marker: "Safari/", name: "Safari" },
];

const systems = [
  { marker: "Windows", name: "Windows" },
  { marker: "Android", name: "Android" },
  { marker: "iPhone", name: "iPhone" },
  { marker: "iPad", name: "iPad" },
  { marker: "Mac OS X", name: "macOS" },
  { marker: "Linux", name: "Linux" },
];

export function describeDevice(userAgent: string | null): string {
  if (userAgent === null || userAgent.trim().length === 0) {
    return "Unknown browser";
  }
  const browser = browsers.find((candidate) =>
    userAgent.includes(candidate.marker),
  );
  const system = systems.find((candidate) =>
    userAgent.includes(candidate.marker),
  );
  if (browser === undefined && system === undefined) {
    return "Unknown browser";
  }
  if (system === undefined) {
    return browser?.name ?? "Unknown browser";
  }
  if (browser === undefined) {
    return system.name;
  }
  return \`\${browser.name} on \${system.name}\`;
}`;

const RSA_TOKEN_ISSUER_CODE = `import { createHash, randomBytes } from "node:crypto";
import { SignJWT, exportJWK, generateKeyPair, type CryptoKey, type JWK } from "jose";
import {
  accessTokenLifetimeInSeconds,
  toContractDateTime,
  tokenAudience,
  tokenIssuer
} from "@zappy/shared";
import type { IssuedAccessToken, TokenIssuer } from "../../application/ports.js";

export type SigningKeys = {
  readonly keyIdentifier: string;
  readonly privateKey: CryptoKey;
  readonly publicJsonWebKey: JWK;
};

export async function generateSigningKeys(): Promise<SigningKeys> {
  const { privateKey, publicKey } = await generateKeyPair("RS256", { extractable: true });
  const publicJsonWebKey = await exportJWK(publicKey);
  const keyIdentifier = createHash("sha256")
    .update(JSON.stringify(publicJsonWebKey))
    .digest("base64url")
    .slice(0, 16);
  return { keyIdentifier, privateKey, publicJsonWebKey };
}

export function jsonWebKeySet(keys: SigningKeys): { keys: readonly JWK[] } {
  return {
    keys: [{ ...keys.publicJsonWebKey, kid: keys.keyIdentifier, alg: "RS256", use: "sig" }]
  };
}

export function rsaTokenIssuer(keys: SigningKeys, now: () => Date): TokenIssuer {
  return {
    async issueAccessToken(customerId: string, sessionId: string): Promise<IssuedAccessToken> {
      const issuedAt = Math.floor(now().getTime() / 1000);
      const expiresAt = issuedAt + accessTokenLifetimeInSeconds;
      const token = await new SignJWT({ sessionId })
        .setProtectedHeader({ alg: "RS256", kid: keys.keyIdentifier })
        .setSubject(customerId)
        .setIssuer(tokenIssuer)
        .setAudience(tokenAudience)
        .setIssuedAt(issuedAt)
        .setExpirationTime(expiresAt)
        .sign(keys.privateKey);
      return { token, expiresAt: toContractDateTime(new Date(expiresAt * 1000)) };
    },

    newRefreshToken(): { value: string; hash: string } {
      const value = randomBytes(32).toString("base64url");
      return { value, hash: hashOf(value) };
    },

    hashRefreshToken(value: string): string {
      return hashOf(value);
    }
  };
}

function hashOf(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}`;

const JWKS_ROUTE_CODE = `addRoutes(application: Express): void {
  application.get("/.well-known/jwks.json", (_request: Request, response: Response) => {
    response.set("cache-control", "public, max-age=300");
    response.json(jsonWebKeySet(keys));
  });
}`;

const ACCESS_TOKEN_VERIFIER_CODE = `import { createRemoteJWKSet, jwtVerify } from "jose";
import { jsonWebKeySetUrl, tokenAudience, tokenIssuer } from "../configuration.js";
import { accountsSessionChecker, type SessionChecker } from "./sessionChecker.js";

export type SignedInVisitor = {
  readonly customerId: string;
  readonly sessionId: string;
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

const SCHEMA_USER_ERROR_CODE = `"""
One reason a mutation refused, in a shape a client renders. A \`UserError\`
is an expected outcome and not a bug: the request was well formed and a
rule said no.
"""
type UserError {
  """
  Which rule said no. A client switches on this value and never on the
  message.
  """
  code: UserErrorCode!

  """
  One English sentence for a developer reading a response or a log. It is
  not translated and it never carries a password, a token or an email
  address, so a client shows its own text for the code instead.
  """
  message: String!

  """
  The input field the error belongs to. Null when the error belongs to
  the operation as a whole rather than to one field.
  """
  field: String
}`;

const RULE_ROWS: Array<Omit<RuleRow, "rule"> & { rule: Record<Locale, string> }> = [
  {
    rule: {
      en: "The access token, RS256, carrying the session id",
      nl: "Het accesstoken, RS256, met de sessie-id erin",
    },
    dotnet: "Adapters.Security/JwtTokenIssuer.cs",
    java: "adapters/security/JsonWebTokenIssuer.java",
    kotlin: "adapters/security/JsonWebTokenIssuer.kt",
    node: "accounts/adapters/security/rsaTokenIssuer.ts",
  },
  {
    rule: {
      en: "The session read on every request",
      nl: "De sessie die elk verzoek wordt gelezen",
    },
    dotnet: "Host/BearerTokenSetup.cs",
    java: "application/accounts/IdentifyVisitor.java",
    kotlin: "application/accounts/IdentifyVisitor.kt",
    node: "shared/security/accessToken.ts",
  },
  {
    rule: {
      en: "Rotation, and the revocation on a second use",
      nl: "Rotatie, en het intrekken bij tweede gebruik",
    },
    dotnet: "Application/Accounts/RefreshSession.cs",
    java: "application/accounts/RefreshSession.java",
    kotlin: "application/accounts/RefreshSession.kt",
    node: "accounts/application/authenticate.ts",
  },
  {
    rule: {
      en: "The two cookies, zappy_refresh and zappy_cart",
      nl: "De twee cookies, zappy_refresh en zappy_cart",
    },
    dotnet: "Adapters.GraphQL/Requests/Cookies.cs",
    java: "adapters/graphql/Cookies.java",
    kotlin: "adapters/graphql/Cookies.kt",
    node: "shared/security/cookies.ts",
  },
  {
    rule: {
      en: "The Origin check, before any resolver runs",
      nl: "De Origin-controle, voordat een resolver draait",
    },
    dotnet: "Adapters.GraphQL/Origin/OriginCheck.cs",
    java: "adapters/graphql/OriginCheckInterceptor.java",
    kotlin: "adapters/graphql/RequestContextInterceptor.kt",
    node: "shared/security/originCheck.ts",
  },
  {
    rule: {
      en: "Argon2id with the OWASP parameters",
      nl: "Argon2id met de OWASP-parameters",
    },
    dotnet: "Adapters.Security/Argon2idPasswordHasher.cs",
    java: "adapters/security/Argon2PasswordHasher.java",
    kotlin: "adapters/security/Argon2PasswordHasher.kt",
    node: "accounts/adapters/security/argon2PasswordHasher.ts",
  },
  {
    rule: {
      en: "The limit on login attempts",
      nl: "De limiet op inlogpogingen",
    },
    dotnet: "Adapters.Security/InMemoryRateLimiter.cs",
    java: "adapters/security/SlidingWindowRateLimiter.java",
    kotlin: "adapters/security/InMemoryRateLimiter.kt",
    node: "accounts/application/attemptLimiter.ts",
  },
];

const COPY = {
  contentsLabel: { en: "In this article", nl: "In dit artikel" },
  lead: {
    en: "A login hands out two tokens. One is signed, lives fifteen minutes and carries nothing worth stealing. The other is a random string in a cookie that may be used once. Almost everything else in this article follows from those two sentences.",
    nl: "Een inlog geeft twee tokens uit. Het ene is ondertekend, leeft vijftien minuten en draagt niets mee dat het stelen waard is. Het andere is een willekeurige reeks in een cookie die één keer gebruikt mag worden. Bijna al het andere in dit artikel volgt uit die twee zinnen.",
  },
  intro1: {
    en: "Every article I write stands on code that runs. Zappy Mart is one small web store built seven times over on one GraphQL contract: three hexagonal monoliths in C#, Java and Kotlin, the same store again as five subgraphs behind an Apollo gateway, and three store fronts on React Router, Next.js and Angular. Any front runs against any backend, because one schema and one set of expected answers hold them together.",
    nl: "Elk artikel dat ik schrijf staat op code die draait. Zappy Mart is één kleine webwinkel die zeven keer is gebouwd op één GraphQL-contract: drie hexagonale monolieten in C#, Java en Kotlin, dezelfde winkel nog eens als vijf subgraphs achter een Apollo-gateway, en drie winkels op React Router, Next.js en Angular. Elke winkel draait tegen elke backend, want één schema en één set verwachte antwoorden houden ze bij elkaar.",
  },
  intro2: {
    en: "Security was not a chapter at the end. It is one of the ten rules the repository started under, written down before the first backend existed, and thirty three shared conformance scenarios run against every backend. Two of those scenarios are about nothing else: one presents a refresh token that was already used, and one sends a mutation with no Origin header at all. A backend is finished when all thirty three are green.",
    nl: "Beveiliging was geen hoofdstuk aan het eind. Het is een van de tien regels waarmee de repository begon, opgeschreven voordat de eerste backend bestond, en drieëndertig gedeelde conformance-scenario's draaien tegen elke backend. Twee daarvan gaan nergens anders over: het ene biedt een refreshtoken aan dat al gebruikt is, het andere stuurt een mutation zonder Origin-header. Een backend is af als alle drieëndertig groen zijn.",
  },
  versionNote: {
    en: "The seven runtimes here are .NET 10 with C# 14, Java 25, Kotlin 2.4.10, Node.js 24, React Router 8.3.1, Next.js 16.3.4 and Angular 22.1.5, with Spring Boot 4.1.1 on both the Java and the Kotlin side. Those numbers come from the project's own version table, whose rows were verified between 6 and 9 September 2026.",
    nl: "De zeven runtimes hier zijn .NET 10 met C# 14, Java 25, Kotlin 2.4.10, Node.js 24, React Router 8.3.1, Next.js 16.3.4 en Angular 22.1.5, met Spring Boot 4.1.1 aan zowel de Java- als de Kotlin-kant. Die nummers komen uit de eigen versietabel van het project, waarvan de regels tussen 6 en 9 september 2026 zijn gecontroleerd.",
  },
  libraryNote: {
    en: "The security libraries under them are Konscious.Security.Cryptography.Argon2 1.3.1 with Microsoft.AspNetCore.Authentication.JwtBearer 10.0.12 on .NET, Spring Security 7.1.1 with bcprov-jdk18on 1.85.2 on the JVM, and jose 6.2.12 with argon2 0.45.1 on Node.js, each read from its registry on 9 September 2026.",
    nl: "De beveiligingsbibliotheken eronder zijn Konscious.Security.Cryptography.Argon2 1.3.1 met Microsoft.AspNetCore.Authentication.JwtBearer 10.0.12 op .NET, Spring Security 7.1.1 met bcprov-jdk18on 1.85.2 op de JVM, en jose 6.2.12 met argon2 0.45.1 op Node.js, elk op 9 september 2026 uit hun register gelezen.",
  },
  quote: {
    en: "A signed token says who you were fifteen minutes ago. A session row says whether you still are. Both answers matter, and only one of them can change after the token was handed out.",
    nl: "Een ondertekend token zegt wie je vijftien minuten geleden was. Een sessieregel zegt of je dat nog steeds bent. Beide antwoorden tellen, en maar één ervan kan nog veranderen nadat het token is uitgegeven.",
  },

  tokensTitle: {
    en: "The two tokens, and what each one does",
    nl: "De twee tokens, en wat elk van beide doet",
  },
  tokens1: {
    en: "A login answers with two values that do different jobs. Confusing them is where most of the trouble in this area starts, so it is worth naming both jobs out loud before any code.",
    nl: "Een inlog antwoordt met twee waarden die verschillend werk doen. Ze door elkaar halen is waar de meeste problemen op dit terrein beginnen, dus het is de moeite waard om beide taken hardop te benoemen voordat er code komt.",
  },
  accessLabel: { en: "The access token.", nl: "Het accesstoken." },
  accessBody: {
    en: "A JSON Web Token signed with an asymmetric key, so the holder of the private key signs and anybody with the public key verifies. It lives fifteen minutes, it carries the customer id, the session id and the expiry, and it carries nothing personal. It is never stored on the server. It travels in the Authorization header on every request that needs a customer.",
    nl: "Een JSON Web Token dat met een asymmetrische sleutel is ondertekend, dus wie de privésleutel heeft tekent en wie de publieke sleutel heeft controleert. Het leeft vijftien minuten, het draagt de klant-id, de sessie-id en de vervaltijd, en verder niets persoonlijks. Het wordt nooit op de server bewaard. Het reist mee in de Authorization-header bij elk verzoek dat een klant nodig heeft.",
  },
  refreshLabel: { en: "The refresh token.", nl: "Het refreshtoken." },
  refreshBody: {
    en: "Thirty two random bytes, meaningless on its own, valid for thirty days. Only its SHA-256 hash is stored, in a table row next to the customer id, the device description and the timestamps. It travels in the cookie zappy_refresh, httpOnly, Secure, SameSite Lax, with its path limited to the refresh mutation, so no script can read it and no other request carries it.",
    nl: "Tweeëndertig willekeurige bytes, op zichzelf betekenisloos, dertig dagen geldig. Alleen de SHA-256-hash ervan wordt bewaard, in een tabelregel naast de klant-id, de apparaatomschrijving en de tijdstempels. Het reist in de cookie zappy_refresh, httpOnly, Secure, SameSite Lax, met een pad dat tot de refresh-mutation beperkt is, dus geen script kan het lezen en geen ander verzoek draagt het mee.",
  },
  tokens2: {
    en: "The schema says the same thing in the shape a client sees. Notice what is missing from the payload: the refresh token is not a field, because a field is something a script can read.",
    nl: "Het schema zegt hetzelfde in de vorm die een client ziet. Let op wat er in de payload ontbreekt: het refreshtoken is geen veld, want een veld is iets wat een script kan lezen.",
  },
  tokens3: {
    en: "The two lifetimes live in one file, in the application layer, where both the login and the refresh use case can reach them. Fifteen minutes and thirty days are the two numbers the whole design turns on, so they get a name and are never typed twice.",
    nl: "De twee levensduren staan in één bestand, in de applicatielaag, waar zowel het inloggen als het vernieuwen erbij kan. Vijftien minuten en dertig dagen zijn de twee getallen waar het hele ontwerp om draait, dus ze krijgen een naam en worden niet twee keer ingetypt.",
  },
  tokens4: {
    en: "One use case mints both at once. It writes the session row and the hash of the refresh token in the same transaction, and only then signs the access token that names that session. The order matters. A signed token that names a session nobody wrote is a token nothing can check.",
    nl: "Eén use case maakt ze allebei tegelijk aan. Die schrijft de sessieregel en de hash van het refreshtoken in dezelfde transactie, en pas daarna wordt het accesstoken ondertekend dat naar die sessie verwijst. De volgorde doet ertoe. Een ondertekend token dat verwijst naar een sessie die niemand heeft weggeschreven, is een token waar niets tegen te controleren valt.",
  },
  tokens5: {
    en: "Put together, the journey of the two values from a login to a logout looks like this.",
    nl: "Bij elkaar ziet de reis van die twee waarden, van inloggen tot uitloggen, er zo uit.",
  },
  journeyAria: {
    en: "Diagram: a login hands out an access token and a refresh cookie, both point at one session row, and revoking that row ends both",
    nl: "Diagram: een inlog geeft een accesstoken en een refreshcookie uit, beide wijzen naar één sessieregel, en die regel intrekken beëindigt allebei",
  },
  journeyCaption: {
    en: "Login hands out both. The access token rides the Authorization header on every request. The refresh cookie goes only to the refresh call. Revoking the session row ends both of them in the same moment.",
    nl: "Bij het inloggen worden beide uitgegeven. Het accesstoken reist bij elk verzoek mee in de Authorization-header. De refreshcookie gaat alleen naar de refresh-aanroep. De sessieregel intrekken beëindigt ze allebei op hetzelfde moment.",
  },

  whyTitle: {
    en: "Why not one of the two on its own",
    nl: "Waarom niet één van de twee alleen",
  },
  why1: {
    en: "Two tokens is more machinery than one, so the design owes an answer for why the simpler shapes were not enough. Each of them has one property that decides it.",
    nl: "Twee tokens zijn meer machinerie dan één, dus het ontwerp is een antwoord schuldig op de vraag waarom de eenvoudigere vormen niet volstonden. Elk ervan heeft één eigenschap die de doorslag geeft.",
  },
  whyJwtLabel: { en: "A signed token on its own.", nl: "Alleen een ondertekend token." },
  whyJwtBody: {
    en: "It cannot be taken back before it expires, because nothing is written down anywhere. A customer who signs out on a laptop they are handing back needs that login gone now, not in fifteen minutes. The session table is what makes now possible.",
    nl: "Het kan niet worden ingetrokken voordat het verloopt, want er staat nergens iets vast. Een klant die uitlogt op een laptop die ze inlevert, wil dat de inlog nu weg is, niet over vijftien minuten. De sessietabel is wat dat nu mogelijk maakt.",
  },
  whySessionLabel: { en: "A server session on its own.", nl: "Alleen een serversessie." },
  whySessionBody: {
    en: "It ties every client to one cookie and one domain. A mobile app, a partner integration and a store front on a different host all want an Authorization header, and a cookie does not travel that way. The access token is what makes those callers possible.",
    nl: "Die bindt elke client aan één cookie en één domein. Een mobiele app, een integratie van een partner en een winkel op een andere host willen allemaal een Authorization-header, en zo reist een cookie niet mee. Het accesstoken is wat die aanroepers mogelijk maakt.",
  },
  why2: {
    en: "There is a case where a plain server session is the right answer and this design would be overhead. One server, one domain, one kind of client, and no plan for a second one. The React Router store front here is exactly that case for its own session with the browser, which is why its cookie is a plain encrypted cookie and not a token pair.",
    nl: "Er is een geval waarin een gewone serversessie het juiste antwoord is en dit ontwerp alleen maar overhead. Eén server, één domein, één soort client, en geen plan voor een tweede. De React Router-winkel hier is precies dat geval voor zijn eigen sessie met de browser, en daarom is zijn cookie een gewone versleutelde cookie en geen tokenpaar.",
  },
  whyCalloutTitle: {
    en: "The trade this design actually makes",
    nl: "De afweging die dit ontwerp echt maakt",
  },
  whyCalloutBody: {
    en: "A signed token is often sold as fifteen minutes of database-free requests. This design gives that away on purpose: every bearer request reads the session row. The gain is that a logout bites in the same moment it is asked for. The cost is one indexed read by primary key per request in a monolith, and one cached call in the federated graph. That is the whole bargain, and it is worth naming out loud.",
    nl: "Een ondertekend token wordt vaak verkocht als vijftien minuten aan verzoeken zonder database. Dit ontwerp geeft dat bewust weg: elk verzoek met een bearer-token leest de sessieregel. De winst is dat uitloggen bijt op het moment dat erom gevraagd wordt. De prijs is één geïndexeerde leesactie op de primaire sleutel per verzoek in een monoliet, en één gecachete aanroep in de gefedereerde graaf. Dat is de hele afweging, en die benoem je het beste hardop.",
  },
  why3: {
    en: "The rest of this article is that bargain worked out in seven codebases. Where a language or a runtime changes the shape, the section says so.",
    nl: "De rest van dit artikel is die afweging, uitgewerkt in zeven codebases. Waar een taal of een runtime de vorm verandert, zegt de sectie dat erbij.",
  },

  frontsTitle: {
    en: "Where the tokens live in each front",
    nl: "Waar de tokens wonen in elke winkel",
  },
  fronts1: {
    en: "Three store fronts, two shapes. React Router and Next.js both have a server, so the browser never sees an API token at all. Angular is a single page application talking to the API directly, so the token has to live somewhere in the page, and where it lives is the whole question.",
    nl: "Drie winkels, twee vormen. React Router en Next.js hebben allebei een server, dus de browser ziet nooit een API-token. Angular is een single page application die rechtstreeks met de API praat, dus het token moet ergens in de pagina wonen, en waar dat is, is de hele vraag.",
  },
  fronts2: {
    en: "The React Router front holds one cookie for the browser, zappy_store_front, encrypted with AES-256-GCM under a key derived once from a secret. A stolen cookie is bytes. A changed cookie fails its authentication tag and reads as no session at all, which is why the decrypt returns the empty session on any failure and never throws.",
    nl: "De React Router-winkel houdt één cookie voor de browser, zappy_store_front, versleuteld met AES-256-GCM onder een sleutel die één keer uit een geheim is afgeleid. Een gestolen cookie is bytes. Een gewijzigde cookie faalt op zijn authenticatietag en leest als helemaal geen sessie, en daarom geeft het ontsleutelen bij elke fout de lege sessie terug en faalt het nooit.",
  },
  fronts3: {
    en: "One connection per request reads that cookie, renews the access token when it is old enough, runs the documents and hands back the Set-Cookie header at the end. Three decisions live in it. The refresh cookie travels only with the two documents that need it, because the API limits its path to the refresh mutation and this server has to keep that promise itself. The access token is renewed when it is older than a minute, not when it is about to expire, so the store gets to say no much sooner than fifteen minutes. And a refused renewal ends the session on the spot, because a second attempt with the same refresh value is exactly what a leak looks like.",
    nl: "Eén verbinding per verzoek leest die cookie, vernieuwt het accesstoken als het oud genoeg is, draait de documenten en geeft aan het eind de Set-Cookie-header terug. Er zitten drie beslissingen in. De refreshcookie reist alleen mee met de twee documenten die hem nodig hebben, want de API beperkt het pad tot de refresh-mutation en deze server moet die belofte zelf nakomen. Het accesstoken wordt vernieuwd zodra het ouder is dan een minuut, niet pas als het bijna verloopt, zodat de winkel veel eerder dan vijftien minuten nee te horen kan krijgen. En een geweigerde vernieuwing beëindigt de sessie meteen, want een tweede poging met dezelfde refreshwaarde is precies hoe een lek eruitziet.",
  },
  fronts4: {
    en: "The call itself adds three things to every request: the bearer header when there is a token, the API's own cookies rebuilt into a Cookie header, and an Origin header naming the store front. That last one is not decoration. Section six is about the check on the other end that reads it.",
    nl: "De aanroep zelf voegt drie dingen aan elk verzoek toe: de bearer-header als er een token is, de eigen cookies van de API opnieuw opgebouwd tot één Cookie-header, en een Origin-header die de winkel noemt. Die laatste is geen versiering. Sectie zes gaat over de controle aan de andere kant die hem leest.",
  },
  fronts5: {
    en: "The Next.js front holds the same shape in its own idiom. One encrypted cookie, the API's two cookies carried inside it and never forwarded to the browser, and a small module that is the only place in the application that knows the cookie exists.",
    nl: "De Next.js-winkel houdt dezelfde vorm aan in zijn eigen idioom. Eén versleutelde cookie, de twee cookies van de API daarbinnen bewaard en nooit doorgegeven aan de browser, en één kleine module die de enige plek in de applicatie is die weet dat de cookie bestaat.",
  },
  fronts6: {
    en: "The refresh has to run from the browser there, because only the browser knows the visitor is still on the page, and in the App Router only a route handler or a server action may write a cookie. So the front has one route handler for it, and it refuses anything whose origin is not the store front itself.",
    nl: "Het vernieuwen moet daar vanuit de browser gebeuren, want alleen de browser weet dat de bezoeker nog op de pagina is, en in de App Router mag alleen een route handler of een server action een cookie schrijven. Dus heeft de winkel er één route handler voor, en die weigert alles waarvan de origin niet de winkel zelf is.",
  },
  fronts7: {
    en: "Angular has no server of its own, so the access token lives in a signal and nowhere else. Not in local storage, not in a cookie the page can read, and gone on a reload. That is the point. A script running in this page finds nothing that outlives the page.",
    nl: "Angular heeft geen eigen server, dus het accesstoken woont in een signal en nergens anders. Niet in local storage, niet in een cookie die de pagina kan lezen, en na een herlaadactie weg. Dat is precies de bedoeling. Een script dat in deze pagina draait, vindt niets dat de pagina overleeft.",
  },
  fronts8: {
    en: "An interceptor does the rest of the work. It puts withCredentials on every call to the API, so the httpOnly refresh cookie goes along on the calls whose path allows it, and it renews in two places: before it sends a token that is within half a minute of expiry, and again when the API answers 401.",
    nl: "Een interceptor doet de rest van het werk. Die zet withCredentials op elke aanroep naar de API, zodat de httpOnly refreshcookie meegaat op de aanroepen waarvan het pad dat toelaat, en hij vernieuwt op twee plekken: voordat hij een token stuurt dat binnen een halve minuut verloopt, en nog eens als de API met 401 antwoordt.",
  },
  fronts9: {
    en: "One more cookie exists on that front, and it is worth being precise about it, because it looks like a token and is not. zappy_session holds the word open and grants nothing. It says only that this browser had a session. A visitor without it makes no refresh call at all, so a first visit is one request lighter, and a visitor with it whose refresh is refused can be told why the login screen is showing.",
    nl: "Er bestaat nog één cookie op die winkel, en het is de moeite waard om daar precies over te zijn, want hij lijkt op een token en is het niet. zappy_session bevat het woord open en geeft nergens recht op. Hij zegt alleen dat deze browser een sessie had. Een bezoeker zonder die cookie doet helemaal geen refresh-aanroep, dus een eerste bezoek is één verzoek lichter, en een bezoeker met die cookie wiens vernieuwing wordt geweigerd, kan te horen krijgen waarom het inlogscherm er staat.",
  },
  fronts10Before: {
    en: "That last cookie is the smallest example of a bigger question, which is where every value on a screen belongs and who owns the truth about it. I worked that one out separately in ",
    nl: "Die laatste cookie is het kleinste voorbeeld van een grotere vraag, namelijk waar elke waarde op een scherm thuishoort en wie de baas is over de waarheid ervan. Die heb ik apart uitgewerkt in ",
  },
  stateArticleLink: {
    en: "the article on what a store still does",
    nl: "het artikel over wat een store nog doet",
  },
  fronts10After: {
    en: ", using the same three store fronts.",
    nl: ", met dezelfde drie winkels.",
  },

  logoutTitle: {
    en: "A logout that takes effect at once",
    nl: "Uitloggen dat meteen werkt",
  },
  logout1: {
    en: "The session row is a small thing with one important field. Everything else on it is for the customer to read. RevokedAt is what the server reads.",
    nl: "De sessieregel is een klein ding met één belangrijk veld. Al het andere erop is er voor de klant om te lezen. RevokedAt is wat de server leest.",
  },
  logout2: {
    en: "On .NET the check hangs off the bearer authentication event, so it runs after the signature and the expiry have been accepted and before any resolver sees a customer. A token whose session is gone fails validation the same way a forged signature does, and the request continues as an anonymous one.",
    nl: "Op .NET hangt de controle aan het bearer-authenticatie-event, dus hij draait nadat de handtekening en de vervaltijd zijn geaccepteerd en voordat een resolver een klant ziet. Een token waarvan de sessie weg is, faalt op dezelfde manier als een vervalste handtekening, en het verzoek gaat verder als een anoniem verzoek.",
  },
  logout3: {
    en: "The Java and Kotlin backends do the same thing in a use case called IdentifyVisitor, which takes the bearer token and the cart cookie and answers with a visitor. When the session is missing, closed or belongs to another customer, it answers with the anonymous visitor. Same rule, one layer further in, because on the JVM side the GraphQL interceptor is where the request is assembled.",
    nl: "De Java- en Kotlin-backends doen hetzelfde in een use case die IdentifyVisitor heet, die het bearer-token en de winkelwagencookie aanneemt en een bezoeker teruggeeft. Als de sessie ontbreekt, gesloten is of bij een andere klant hoort, antwoordt hij met de anonieme bezoeker. Dezelfde regel, een laag verder naar binnen, want aan de JVM-kant is de GraphQL-interceptor de plek waar het verzoek wordt samengesteld.",
  },
  logout4: {
    en: "In the federated graph this rule costs more, and the cost is worth looking at. Five subgraphs each verify for themselves, so each of them would have to ask the accounts subgraph whether that session is still live, on every request. What they do instead is ask once and remember the answer for five seconds.",
    nl: "In de gefedereerde graaf kost deze regel meer, en die kosten zijn het bekijken waard. Vijf subgraphs controleren elk voor zichzelf, dus elk van hen zou bij elk verzoek aan de accounts-subgraph moeten vragen of die sessie nog leeft. Wat ze doen is één keer vragen en het antwoord vijf seconden onthouden.",
  },
  logoutCalloutTitle: {
    en: "Five seconds is a real window",
    nl: "Vijf seconden is een echt venster",
  },
  logoutCalloutBody: {
    en: "A cache in front of a revocation check is a window in which a revoked session still passes, in the subgraphs that had already asked. Five seconds is the number this project chose, and the accurate way to describe it is as a bound on the delay, never as its absence. The accounts subgraph itself never caches, so the mutations that matter most, the ones that touch the session list, are always exact. Lower the number and the graph talks to accounts more. Raise it and the window grows. There is no setting that makes the choice go away.",
    nl: "Een cache voor een intrekcontrole is een venster waarin een ingetrokken sessie nog doorkomt, in de subgraphs die al hadden gevraagd. Vijf seconden is het getal dat dit project heeft gekozen, en de juiste beschrijving is een bovengrens op de vertraging, nooit de afwezigheid ervan. De accounts-subgraph zelf cachet nooit, dus de mutations die het meeste tellen, die aan de sessielijst komen, kloppen altijd. Verlaag het getal en de graaf praat vaker met accounts. Verhoog het en het venster groeit. Er is geen instelling die de keuze laat verdwijnen.",
  },

  rotationTitle: {
    en: "Rotation, and what a replay costs",
    nl: "Rotatie, en wat hergebruik kost",
  },
  rotation1: {
    en: "A refresh token may be used once. The refresh call answers with a new access token and a new refresh token and marks the old one as rotated. The domain entity carries that rule in one line and nothing else knows how to set it.",
    nl: "Een refreshtoken mag één keer gebruikt worden. De refresh-aanroep antwoordt met een nieuw accesstoken en een nieuw refreshtoken en markeert het oude als geroteerd. De domeinentiteit draagt die regel in één regel code en niets anders weet hoe je hem zet.",
  },
  rotation2: {
    en: "The use case reads like a list of ways to say no, which is what a security use case should look like. The interesting branch is the fourth one. A token that was already used is not an error to report and move on from. It means two parties hold the same value, so the session is revoked and both of them lose it.",
    nl: "De use case leest als een lijst manieren om nee te zeggen, en zo hoort een use case over beveiliging eruit te zien. De interessante tak is de vierde. Een token dat al gebruikt is, is geen fout om te melden en verder te gaan. Het betekent dat twee partijen dezelfde waarde hebben, dus de sessie wordt ingetrokken en ze raken hem allebei kwijt.",
  },
  rotation3: {
    en: "The Java and Kotlin stores go one step further and revoke the session together with every token that belongs to it, in one call. The Node backend marks every token of that session rotated for the same reason. Three spellings, one outcome: after a replay there is nothing left in that family to present.",
    nl: "De Java- en Kotlin-opslag gaan een stap verder en trekken de sessie samen met elk token dat erbij hoort in één aanroep in. De Node-backend markeert om dezelfde reden elk token van die sessie als geroteerd. Drie schrijfwijzen, één uitkomst: na hergebruik is er in die familie niets meer om aan te bieden.",
  },
  rotation4: {
    en: "Drawn out, the refresh call has two endings and they share their first two steps.",
    nl: "Uitgetekend heeft de refresh-aanroep twee einden, en de eerste twee stappen delen ze.",
  },
  rotationAria: {
    en: "Diagram: a refresh call finds its token by hash, a first use rotates it and issues a new pair, a second use revokes the session and every token in it",
    nl: "Diagram: een refresh-aanroep vindt zijn token op hash, een eerste gebruik roteert het en geeft een nieuw paar uit, een tweede gebruik trekt de sessie en alle tokens erin in",
  },
  rotationCaption: {
    en: "A refresh token is used once. The first use rotates it and hands out the next pair. A second use of the same value means it leaked, so the session and every token in it are revoked and every device has to log in again.",
    nl: "Een refreshtoken wordt één keer gebruikt. Het eerste gebruik roteert het en geeft het volgende paar uit. Een tweede gebruik van dezelfde waarde betekent dat het is uitgelekt, dus de sessie en alle tokens erin worden ingetrokken en elk apparaat moet opnieuw inloggen.",
  },
  rotation5: {
    en: "That is a rule, and a rule that is not tested is a hope. It is scenario nineteen of the shared conformance run, and the runner earns it by keeping the previous value of the refresh cookie in its jar on purpose, so it can present the token that the rotation replaced. Every backend has to answer exactly this.",
    nl: "Dat is een regel, en een regel die niet getest wordt, is een hoop. Het is scenario negentien van de gedeelde conformance-run, en de runner verdient dat door de vorige waarde van de refreshcookie expres in zijn koekjestrommel te houden, zodat hij het token kan aanbieden dat de rotatie heeft vervangen. Elke backend moet precies dit antwoorden.",
  },
  rotation6: {
    en: "There is a second proof at the other end, in the browser. The shared Playwright suite takes every cookie the browser holds while signed in, logs out, puts all of them back and asks for the account page again. Taking every cookie matters, because the three fronts do not use the same cookies, and the suite is the contract for all three.",
    nl: "Er is een tweede bewijs aan de andere kant, in de browser. De gedeelde Playwright-suite neemt elke cookie die de browser heeft terwijl er is ingelogd, logt uit, zet ze allemaal terug en vraagt opnieuw om de accountpagina. Elke cookie nemen is belangrijk, want de drie winkels gebruiken niet dezelfde cookies, en de suite is het contract voor alle drie.",
  },
  rotation7: {
    en: "Rotation has one practical consequence a front has to answer for. If two parts of a page refresh at the same moment, the second one presents a token the first has already rotated, and the family is revoked for no reason at all. The Angular front answers that by keeping one refresh in flight at a time and sharing its answer.",
    nl: "Rotatie heeft één praktisch gevolg waar een winkel een antwoord op moet hebben. Als twee delen van een pagina op hetzelfde moment vernieuwen, biedt de tweede een token aan dat de eerste al heeft geroteerd, en wordt de familie zonder enige reden ingetrokken. De Angular-winkel lost dat op door er telkens maar één vernieuwing tegelijk te laten lopen en het antwoord te delen.",
  },
  rotation8: {
    en: "The two server rendered fronts get this free, because the renewal happens once per request inside one connection object. It is worth knowing that this is why, and not a property of the framework.",
    nl: "De twee servergerenderde winkels krijgen dit gratis, want de vernieuwing gebeurt één keer per verzoek binnen één verbindingsobject. Het is goed om te weten dat dát de reden is, en niet een eigenschap van het framework.",
  },

  originTitle: {
    en: "The Origin check on every mutation",
    nl: "De Origin-controle op elke mutation",
  },
  origin1: {
    en: "A cookie is attached by the browser, not by the page, so any page anywhere can cause a request that carries it. SameSite Lax removes most of that, because it keeps the cookie off cross site POST requests. It is the first layer and it is not the only one, because a cookie policy is a browser promise and the server is where the rule has to hold.",
    nl: "Een cookie wordt door de browser meegestuurd, niet door de pagina, dus elke pagina waar dan ook kan een verzoek veroorzaken dat hem meedraagt. SameSite Lax haalt daar het meeste van weg, want het houdt de cookie van cross-site POST-verzoeken af. Dat is de eerste laag en niet de enige, want een cookiebeleid is een belofte van de browser en de server is de plek waar de regel moet gelden.",
  },
  origin2: {
    en: "So every backend refuses a mutation whose Origin header is missing or unknown, before any resolver runs. On .NET that is a piece of middleware in front of the GraphQL endpoint. It has to read the body to know whether the document carries a mutation, so it buffers the request and puts the position back, and it parses the document, because searching the text for a word is a different question.",
    nl: "Dus weigert elke backend een mutation waarvan de Origin-header ontbreekt of onbekend is, voordat een resolver draait. Op .NET is dat een stuk middleware voor het GraphQL-eindpunt. Het moet de body lezen om te weten of het document een mutation bevat, dus buffert het het verzoek en zet het de positie terug, en het parseert het document, want in de tekst naar een woord zoeken is een andere vraag.",
  },
  origin3: {
    en: "Parsing is the part that is easy to get wrong. A document can hold several operations, and the request may name which one to run, so the check follows the same rule the executor will: filter by the requested operation name when there is one, and ask whether any of what is left is a mutation. The Kotlin interceptor makes the same decision in the Spring for GraphQL shape, and refuses before it even builds the request context.",
    nl: "Het parseren is het deel dat makkelijk misgaat. Een document kan meerdere operaties bevatten, en het verzoek mag noemen welke gedraaid moet worden, dus de controle volgt dezelfde regel als de uitvoerder: filter op de gevraagde operatienaam als die er is, en vraag of wat er overblijft een mutation bevat. De Kotlin-interceptor neemt dezelfde beslissing in de vorm van Spring for GraphQL, en weigert nog voordat hij de request-context opbouwt.",
  },
  origin4: {
    en: "The Java interceptor is the same shape under Java's names, so it is not worth a second listing. The federated graph has one difference: the judgement is a pure function of the header, so the gateway and every subgraph can call it. A caller who reaches a subgraph directly meets the same rule, and one origin value is reserved for the graph's own internal calls.",
    nl: "De Java-interceptor heeft dezelfde vorm onder Java-namen, dus een tweede listing is niet nodig. De gefedereerde graaf heeft één verschil: het oordeel is een pure functie van de header, dus de gateway en elke subgraph kunnen hem aanroepen. Wie rechtstreeks bij een subgraph aanklopt, krijgt dezelfde regel, en één origin-waarde is gereserveerd voor de interne aanroepen van de graaf zelf.",
  },
  origin5: {
    en: "Two things follow from putting the check on mutations only. A query needs no Origin header, which keeps a plain page load and a server side read working. And a mutation with no Origin at all is refused, not waved through, which is scenario thirty three of the conformance run and the reason it exists.",
    nl: "Uit de keuze om alleen mutations te controleren volgen twee dingen. Een query heeft geen Origin-header nodig, waardoor een gewone paginalading en een leesactie vanaf de server blijven werken. En een mutation zonder Origin wordt geweigerd en niet doorgelaten, wat scenario drieëndertig van de conformance-run is en de reden dat het bestaat.",
  },

  argonTitle: {
    en: "Argon2id in four languages",
    nl: "Argon2id in vier talen",
  },
  argon1: {
    en: "Four backends, four libraries, three numbers that are the same everywhere: 19456 kibibytes of memory, two iterations, parallelism one. Those are the first choice of the OWASP password storage guidance, and they are written into each backend's own settings so the numbers can be raised as machines get faster. The .NET one composes and reads the hash string itself, which makes the whole shape visible in one file.",
    nl: "Vier backends, vier bibliotheken, drie getallen die overal hetzelfde zijn: 19456 kibibytes geheugen, twee iteraties, parallellisme één. Dat is de eerste keuze uit de OWASP-richtlijn voor wachtwoordopslag, en de getallen staan in de eigen instellingen van elke backend, zodat ze omhoog kunnen als machines sneller worden. De .NET-versie stelt de hashtekst zelf samen en leest hem ook zelf, waardoor de hele vorm in één bestand zichtbaar is.",
  },
  argon2: {
    en: "Two details in that file carry the weight. Matches reads the parameters back out of the stored hash and computes with those, so raising the numbers tomorrow leaves every existing login working. And the comparison is FixedTimeEquals, not an equality operator, because an equality operator on bytes tells a patient caller how many of them matched. On the JVM side Spring Security's encoder takes the same five numbers in its constructor and writes the same self describing format, so the Java and Kotlin files are almost the same file.",
    nl: "Twee details in dat bestand dragen het gewicht. Matches leest de parameters weer uit de opgeslagen hash en rekent daarmee, dus als de getallen morgen omhooggaan, blijft elke bestaande inlog werken. En de vergelijking is FixedTimeEquals en geen gelijkheidsoperator, want een gelijkheidsoperator op bytes vertelt een geduldige aanroeper hoeveel bytes er overeenkwamen. Aan de JVM-kant neemt de encoder van Spring Security dezelfde vijf getallen aan in zijn constructor en schrijft hij hetzelfde zelfbeschrijvende formaat, dus het Java- en het Kotlin-bestand zijn bijna hetzelfde bestand.",
  },
  argon3: {
    en: "Node.js takes an options object and does the encoding for you, and its verify throws on a hash it cannot read, so the adapter catches that and answers false. A password that cannot be read is a password that does not match, and it should not become an exception halfway up the stack.",
    nl: "Node.js neemt een optie-object aan en doet het coderen voor je, en verify daar faalt op een hash die het niet kan lezen, dus de adapter vangt dat op en antwoordt met false. Een wachtwoord dat niet gelezen kan worden, is een wachtwoord dat niet klopt, en dat hoort halverwege de stapel geen uitzondering te worden.",
  },
  argon4: {
    en: "The contract adds two rules that no library enforces for you. A password below twelve characters is refused, and the maximum is one hundred and twenty eight, high on purpose, because a short maximum is a hint about the storage and a passphrase is a good password. Both are error codes in the schema, so every client can say the same thing in its own language.",
    nl: "Het contract voegt twee regels toe die geen enkele bibliotheek voor je afdwingt. Een wachtwoord onder de twaalf tekens wordt geweigerd, en het maximum is honderdachtentwintig en niet iets kleins, want een kort maximum verraadt iets over de opslag en een wachtwoordzin is een goed wachtwoord. Allebei zijn het foutcodes in het schema, zodat elke client hetzelfde in zijn eigen taal kan zeggen.",
  },

  limitsTitle: {
    en: "Rate limits, and answering the same way every time",
    nl: "Limieten, en elke keer hetzelfde antwoord",
  },
  limits1: {
    en: "A login endpoint that answers as fast as it can is a login endpoint somebody will try a list against. The limiter is a sliding window per key, kept in memory, twenty attempts in the window and no more. In a deployment with several instances this moves to a shared store, and the call sites stay exactly the same, which is the reason it sits behind a port.",
    nl: "Een inlog-eindpunt dat zo snel mogelijk antwoordt, is een inlog-eindpunt waar iemand een lijst tegenaan gooit. De begrenzer is een schuivend venster per sleutel, in het geheugen gehouden, twintig pogingen in het venster en niet meer. In een omgeving met meerdere instanties verhuist dit naar een gedeelde opslag, en de aanroepplekken blijven precies hetzelfde, en dat is de reden dat het achter een port zit.",
  },
  limits2: {
    en: "Two keys, not one. Per client address, which stops one machine from working through a list of addresses, and per email address, which stops a spread of machines from working through one account. The login use case asks both before it does anything else.",
    nl: "Twee sleutels, niet één. Per clientadres, wat voorkomt dat één machine een lijst met adressen afwerkt, en per e-mailadres, wat voorkomt dat een spreiding van machines één account afwerkt. De inlog-use-case vraagt allebei voordat hij iets anders doet.",
  },
  limits3: {
    en: "The line in that file that looks pointless is the important one. When no customer matches the address, the hasher still hashes the password before answering. Nothing is done with the result. Without that line the answer for an unknown address comes back in a fraction of the time it takes for a known one, and the timing alone tells a caller which addresses have accounts. The Node backend reaches the same place from the other side, by verifying against a fixed hash.",
    nl: "De regel in dat bestand die zinloos lijkt, is de belangrijke. Als geen klant bij het adres hoort, hasht de hasher toch het wachtwoord voordat er wordt geantwoord. Met het resultaat gebeurt niets. Zonder die regel komt het antwoord voor een onbekend adres terug in een fractie van de tijd die een bekend adres kost, en alleen die tijd vertelt een aanroeper al welke adressen een account hebben. De Node-backend komt van de andere kant op dezelfde plek uit, door tegen een vaste hash te controleren.",
  },
  limits4: {
    en: "The same discipline runs through the answer itself. A wrong password and an address nobody registered both answer CREDENTIALS_INVALID, and the expected file settles that its field is null, so the answer does not name which half was wrong. Registration is the one place an address may be named, because there the customer already knows the address they typed.",
    nl: "Dezelfde discipline loopt door het antwoord zelf. Een verkeerd wachtwoord en een adres dat niemand heeft geregistreerd, antwoorden allebei CREDENTIALS_INVALID, en het verwachte antwoord legt vast dat het veld null is, zodat het antwoord niet noemt welke helft fout was. Registreren is de enige plek waar een adres genoemd mag worden, want daar kent de klant het adres dat ze zelf heeft ingetypt al.",
  },

  devicesTitle: {
    en: "The device list, and ending a login",
    nl: "De sessielijst, en een inlog beëindigen",
  },
  devices1: {
    en: "Everything above is machinery. This is the part a customer sees, and it is the reason the session table exists at all. A signed in customer can read their open sessions and end any of them, including the one they are looking at.",
    nl: "Alles hierboven is machinerie. Dit is het deel dat een klant ziet, en het is de reden dat de sessietabel überhaupt bestaat. Een ingelogde klant kan haar open sessies lezen en er elk van beëindigen, ook die waar ze naar kijkt.",
  },
  devices2: {
    en: "Two fields on that type are worth pausing on. The id is the session id and not the refresh token, so it is safe to render in a list and safe to send back in a mutation. And current is true for the session the request is being made from, which lets a client label the row and warn before somebody logs themselves out. The conformance run holds that expectation in a scenario with two devices, where the newest is current and the older one is not.",
    nl: "Twee velden op dat type zijn het stilstaan waard. De id is de sessie-id en niet het refreshtoken, dus die is veilig om in een lijst te tonen en veilig om terug te sturen in een mutation. En current is waar voor de sessie waarvandaan het verzoek wordt gedaan, waardoor een client de regel kan labelen en kan waarschuwen voordat iemand zichzelf uitlogt. De conformance-run legt die verwachting vast in een scenario met twee apparaten, waarin de nieuwste de huidige is en de oudere niet.",
  },
  devices3: {
    en: "A row nobody recognises is a row nobody dares to click, so the device line has to be readable. The API takes it from the device field of login when a client sends one, and falls back to the user agent. The React Router front sends one, turned into a phrase a person recognises by a function with two lists in it and no dependency at all. Chrome on Windows is what a customer needs to see. The raw user agent string is what they get if nobody does this small piece of work.",
    nl: "Een regel die niemand herkent, is een regel die niemand durft aan te klikken, dus de apparaatregel moet leesbaar zijn. De API neemt hem uit het device-veld van login als een client er een stuurt, en valt anders terug op de user agent. De React Router-winkel stuurt er een, omgezet in een zin die iemand herkent door een functie met twee lijsten erin en zonder enige afhankelijkheid. Chrome on Windows is wat een klant moet zien. De rauwe user agent is wat ze krijgt als niemand dit kleine stukje werk doet.",
  },

  jwksTitle: {
    en: "One key set, five subgraphs",
    nl: "Eén sleutelset, vijf subgraphs",
  },
  jwks1: {
    en: "The federated version is where the choice of an asymmetric signature pays for itself. One subgraph, accounts, holds the private key and signs. The other four never see it. They verify with the public half, which accounts publishes as a JSON Web Key Set, and the key carries an identifier so a rotation of the key is a matter of publishing two and letting the old one age out.",
    nl: "De gefedereerde versie is waar de keuze voor een asymmetrische handtekening zich terugbetaalt. Eén subgraph, accounts, heeft de privésleutel en tekent. De andere vier zien hem nooit. Zij controleren met de publieke helft, die accounts publiceert als een JSON Web Key Set, en de sleutel draagt een identificatie mee, zodat het wisselen van sleutel een kwestie is van er twee publiceren en de oude laten verlopen.",
  },
  jwks2: {
    en: "Publishing it is four lines on the same Express application the subgraph already runs. The cache header is not decoration either. It is what keeps four subgraphs from asking for the same key set on every request.",
    nl: "Het publiceren is vier regels op dezelfde Express-applicatie die de subgraph toch al draait. De cache-header is ook geen versiering. Die zorgt ervoor dat vier subgraphs niet bij elk verzoek om dezelfde sleutelset vragen.",
  },
  jwks3: {
    en: "The verifier on the other side is one function every subgraph shares. It reads the bearer scheme strictly, verifies against the remote key set with the issuer, the audience and the algorithm pinned, refuses anything whose claims are not the two strings it expects, and only then asks whether the session is live. Pinning the algorithm matters. A verifier that accepts whatever the token's own header asks for is a verifier that can be told to accept none.",
    nl: "De controleur aan de andere kant is één functie die elke subgraph deelt. Die leest het bearer-schema streng, controleert tegen de sleutelset op afstand met de uitgever, het publiek en het algoritme vastgezet, weigert alles waarvan de claims niet de twee strings zijn die hij verwacht, en vraagt pas daarna of de sessie leeft. Het algoritme vastzetten doet ertoe. Een controleur die accepteert wat de header van het token zelf vraagt, is een controleur die je kunt vertellen om niets te accepteren.",
  },
  jwks4: {
    en: "The gateway itself does none of this. It forwards the Authorization header and hands the Set-Cookie headers back to the browser, and that is deliberate: no subgraph is a gate in front of another, and each one can be reached directly and still holds its own rules. That property is the whole reason the check lives in a shared module and not in the gateway.",
    nl: "De gateway zelf doet hier niets van. Die stuurt de Authorization-header door en geeft de Set-Cookie-headers terug aan de browser, en dat is met opzet: geen enkele subgraph staat als poort voor een andere, en elk van hen is rechtstreeks bereikbaar en houdt dan nog steeds zijn eigen regels aan. Die eigenschap is de hele reden dat de controle in een gedeelde module woont en niet in de gateway.",
  },

  loggingTitle: {
    en: "What is written down, and what never is",
    nl: "Wat wordt vastgelegd, en wat nooit",
  },
  logging1: {
    en: "A log line is a copy of something, kept somewhere with different rules than the database. The design allows four things in one: the session id, the customer id, the outcome and the reason code. Never a token, never a password, and never an email address sitting in clear next to a failure, because a log of failed logins with addresses in it is a list of accounts worth attacking.",
    nl: "Een logregel is een kopie van iets, bewaard op een plek met andere regels dan de database. Het ontwerp staat vier dingen toe in één regel: de sessie-id, de klant-id, de uitkomst en de redencode. Nooit een token, nooit een wachtwoord, en nooit een e-mailadres dat in leesbare vorm naast een mislukking staat, want een log met mislukte inlogpogingen met adressen erin is een lijst met accounts die het aanvallen waard zijn.",
  },
  logging2: {
    en: "The schema carries the same rule for the message a client receives, which is the other place text leaks. A UserError message is one English sentence for a developer, it is never translated, and it never carries a password, a token or an email address. A client switches on the code and shows its own text, so nothing an attacker sends can end up echoed back at somebody else.",
    nl: "Het schema draagt dezelfde regel voor het bericht dat een client krijgt, en dat is de andere plek waar tekst weglekt. Een UserError-bericht is één Engelse zin voor een ontwikkelaar, het wordt nooit vertaald, en het draagt nooit een wachtwoord, een token of een e-mailadres mee. Een client kijkt naar de code en toont zijn eigen tekst, dus niets wat een aanvaller instuurt kan bij iemand anders teruggekaatst worden.",
  },
  logging3: {
    en: "The one thing the refresh token is stored as is its SHA-256 hash, and that is the same idea one layer down. A dump of the sessions table is a list of hashes and devices. It is not a set of thirty day logins somebody can use.",
    nl: "Het refreshtoken wordt alleen als SHA-256-hash bewaard, en dat is hetzelfde idee een laag lager. Een dump van de sessietabel is een lijst met hashes en apparaten. Het is geen set inloggegevens van dertig dagen die iemand kan gebruiken.",
  },

  tableTitle: {
    en: "Where each rule lives",
    nl: "Waar elke regel woont",
  },
  table1: {
    en: "Seven rules, four backends. The point of the table is that a reader who knows one backend can find the same rule in the other three without reading them, because the four keep the same shape under their own names.",
    nl: "Zeven regels, vier backends. Het punt van de tabel is dat wie één backend kent, dezelfde regel in de andere drie kan vinden zonder ze te lezen, want de vier houden dezelfde vorm aan onder hun eigen namen.",
  },
  tableCaption: {
    en: "Every rule of the design, and the file that holds it in each of the four backends. Paths are relative to each backend's source root.",
    nl: "Elke regel van het ontwerp, en het bestand dat hem bevat in elk van de vier backends. De paden zijn relatief aan de broncodemap van elke backend.",
  },
  tableRuleHeader: { en: "Rule", nl: "Regel" },
  table2: {
    en: "There is one thing the table does not show and it is worth saying. Every one of those files sits behind an interface in the application layer, so the domain and the use cases compile without a JWT library, a hashing library or a web framework anywhere on their path. That is the same hexagon the rest of the project follows, and security is where it earns the most, because the rules stay readable when the libraries under them are swapped.",
    nl: "Er is één ding dat de tabel niet laat zien en dat het zeggen waard is. Elk van die bestanden zit achter een interface in de applicatielaag, dus het domein en de use cases compileren zonder een JWT-bibliotheek, een hashbibliotheek of een webframework op hun pad. Dat is dezelfde hexagon die de rest van het project volgt, en bij beveiliging levert die het meeste op, want de regels blijven leesbaar als de bibliotheken eronder worden vervangen.",
  },

  recordTitle: {
    en: "Where this comes from in my own work",
    nl: "Waar dit vandaan komt in mijn eigen werk",
  },
  record1: {
    en: "The training behind this is Certified Secure, done live and hands on through bol.com: Essential Security, Essential Specialties, Security Specialist, Web Security Specialist and Server Security Specialist, with the Secure Development, Full-Stack Security and Kubernetes network security trainings on top, plus compliance training on personal data under the GDPR and on the EU AI Act. The engagement where authentication was my own work is Opinity, where I built an Angular front end on ASP.NET Core with authentication and role-based access, for a trip and freight registration the business depended on and which had a four month deadline.",
    nl: "De opleiding hierachter is Certified Secure, live en hands-on gevolgd via bol.com: Essential Security, Essential Specialties, Security Specialist, Web Security Specialist en Server Security Specialist, met daarbovenop de trainingen Secure Development, Full-Stack Security en Kubernetes-netwerkbeveiliging, plus compliance-training over persoonsgegevens onder de AVG en over de EU AI Act. De opdracht waar authenticatie mijn eigen werk was, is Opinity, waar ik een Angular-frontend op ASP.NET Core bouwde met authenticatie en rolgebaseerde toegang, voor een rit- en vrachtregistratie waar het bedrijf van afhing en die een deadline van vier maanden had.",
  },
  record2: {
    en: "At bol.com my security work is on the delivery side, and I want to be exact about the scope. The application I built from an empty folder went live through the platform's routing layer with a content security policy profile and an authentication allow-list, both arranged with the team that owns those systems. Designing a token model is a different job from that one. Zappy Mart is where I could design one end to end and then have it checked by something other than my own opinion.",
    nl: "Bij bol.com zit mijn beveiligingswerk aan de opleveringskant, en ik wil precies zijn over de reikwijdte. De applicatie die ik vanaf een lege map bouwde, ging live via de routeringslaag van het platform met een content-security-policy-profiel en een allow-list voor authenticatie, allebei geregeld met het team dat die systemen beheert. Een tokenmodel ontwerpen is ander werk dan dat. Zappy Mart is de plek waar ik er wel een van begin tot eind kon ontwerpen en daarna kon laten toetsen door iets anders dan mijn eigen mening.",
  },
  record3: {
    en: "The security code I can point at without asking anybody is this site. Every response carries a content security policy generated per request, with a fresh nonce and strict-dynamic, so a script that does not carry that nonce does not run, and a test asserts that two requests never receive the same one. The static headers, the strict transport policy, the frame ancestors, the referrer policy and the permissions policy, sit in one place so they cover the API routes as well as the pages. And the diagnostics route that reports on the calendar connection answers a plain 404 to every request that does not carry the right header, so a route that exists for me does not exist for anybody else.",
    nl: "De beveiligingscode waar ik zonder iemand iets te vragen naar kan wijzen, is deze site. Elk antwoord draagt een content security policy die per verzoek wordt opgebouwd, met een verse nonce en strict-dynamic, dus een script zonder die nonce draait niet, en een test controleert dat twee verzoeken er nooit dezelfde krijgen. De statische headers, het strikte transportbeleid, de frame ancestors, het referrer-beleid en het permissiebeleid, staan op één plek zodat ze zowel de API-routes als de pagina's dekken. En de diagnoseroute die over de agendaverbinding rapporteert, antwoordt met een kale 404 op elk verzoek zonder de juiste header, dus een route die voor mij bestaat, bestaat voor niemand anders.",
  },

  closingTitle: {
    en: "What to take away",
    nl: "Wat je meeneemt",
  },
  closing1: {
    en: "If you build this once, build it in this order. Each step is testable on its own, and each one is worth less if the one before it is missing.",
    nl: "Als je dit één keer bouwt, bouw het dan in deze volgorde. Elke stap is op zichzelf te testen, en elke stap is minder waard als de stap ervoor ontbreekt.",
  },
  closingStep1: {
    en: "The sessions table and the session entity, with the one field that says when it was revoked. Everything else hangs off that field.",
    nl: "De sessietabel en de sessie-entiteit, met dat ene veld dat zegt wanneer hij is ingetrokken. Al het andere hangt aan dat veld.",
  },
  closingStep2: {
    en: "The token issuer behind an interface, so the domain never learns what a JWT is, and the two lifetimes in one named place.",
    nl: "De tokenuitgever achter een interface, zodat het domein nooit leert wat een JWT is, en de twee levensduren op één plek met een naam.",
  },
  closingStep3: {
    en: "Login, refresh and logout as three use cases, with the refresh use case treating a second use of one token as a leak and not as a mistake.",
    nl: "Inloggen, vernieuwen en uitloggen als drie use cases, waarbij de vernieuwing een tweede gebruik van hetzelfde token als een lek behandelt en niet als een vergissing.",
  },
  closingStep4: {
    en: "The transport rules at the edge: the bearer header read once, the refresh cookie limited to one path, and the Origin check on every mutation before a resolver runs.",
    nl: "De transportregels aan de rand: de bearer-header die één keer wordt gelezen, de refreshcookie beperkt tot één pad, en de Origin-controle op elke mutation voordat een resolver draait.",
  },
  closingStep5: {
    en: "The two tests that make the rest real: a replayed refresh token that has to answer SESSION_INVALID, and a mutation with no Origin header that has to be refused.",
    nl: "De twee tests die de rest echt maken: een opnieuw aangeboden refreshtoken dat SESSION_INVALID moet antwoorden, en een mutation zonder Origin-header die geweigerd moet worden.",
  },
  closing2Before: {
    en: "None of this design lives in a backend alone. It is written down in a schema that three languages serve and three fronts consume, and the schema is what keeps the wording of a rule identical in seven places. I wrote about that side of it separately in ",
    nl: "Niets van dit ontwerp woont alleen in een backend. Het staat opgeschreven in een schema dat drie talen bedienen en drie winkels lezen, en dat schema is wat de formulering van een regel op zeven plekken gelijk houdt. Over die kant ervan schreef ik apart in ",
  },
  contractArticleLink: {
    en: "the article on GraphQL as a contract",
    nl: "het artikel over GraphQL als contract",
  },
  closing2After: {
    en: ".",
    nl: ".",
  },
  closing3: {
    en: "The measure of a session design is not how clever it is. It is how quickly you can answer one question about a system you did not write: when a customer clicks sign out on a machine they no longer have, what exactly stops working, and when. If the answer takes longer than a sentence, that is the thing to go and look at first.",
    nl: "De maat van een sessieontwerp is niet hoe slim het is. Het is hoe snel je één vraag kunt beantwoorden over een systeem dat je niet zelf hebt geschreven: als een klant op uitloggen klikt op een machine die ze niet meer heeft, wat werkt er dan precies niet meer, en wanneer. Duurt dat antwoord langer dan een zin, dan is dat het eerste om naar te gaan kijken.",
  },

  nodeLogin: { en: "Login", nl: "Inloggen" },
  nodeLoginSub: { en: "email and password", nl: "e-mail en wachtwoord" },
  nodeAccess: { en: "Access token", nl: "Accesstoken" },
  nodeRefresh: { en: "Refresh cookie", nl: "Refreshcookie" },
  nodeRefreshSub: { en: "random, 30 days, hashed", nl: "willekeurig, 30 dagen, gehasht" },
  nodeEveryRequest: { en: "Every request", nl: "Elk verzoek" },
  nodeRefreshCall: { en: "The refresh call only", nl: "Alleen de refresh-aanroep" },
  nodeRefreshCallSub: { en: "zappy_refresh, one path", nl: "zappy_refresh, één pad" },
  nodeSessionRow: { en: "The session row", nl: "De sessieregel" },
  nodeSessionRowSub: { en: "device, expiry, revokedAt", nl: "apparaat, vervaltijd, revokedAt" },
  nodeRevoke: { en: "logout or revokeSession", nl: "logout of revokeSession" },
  nodeRevokeSub: { en: "revokedAt is set", nl: "revokedAt wordt gezet" },
  nodeDead: { en: "Both tokens are dead", nl: "Beide tokens zijn dood" },
  nodeDeadSub: { en: "the next request is refused", nl: "het volgende verzoek wordt geweigerd" },
  edgeSigned: { en: "signed", nl: "ondertekend" },
  edgeInTheHeader: { en: "in the header", nl: "in de header" },
  edgeInTheCookie: { en: "in the cookie", nl: "in de cookie" },
  edgeSessionRead: { en: "session read", nl: "sessie gelezen" },
  edgeRotates: { en: "rotates it", nl: "roteert hem" },
  edgeCustomerEnds: { en: "the customer ends it", nl: "de klant beëindigt hem" },
  edgeAtOnce: { en: "at once", nl: "meteen" },

  nodeCall: { en: "Refresh call", nl: "Refresh-aanroep" },
  nodeCallSub: { en: "the cookie carries token A", nl: "de cookie draagt token A" },
  nodeFound: { en: "Token A found", nl: "Token A gevonden" },
  nodeFoundSub: { en: "by its SHA-256 hash", nl: "op zijn SHA-256-hash" },
  nodeFresh: { en: "Not used yet", nl: "Nog niet gebruikt" },
  nodeFreshSub: { en: "the normal path", nl: "de normale weg" },
  nodeUsed: { en: "Already rotated", nl: "Al geroteerd" },
  nodeUsedSub: { en: "the token leaked", nl: "het token is uitgelekt" },
  nodeRotated: { en: "Token A marked rotated", nl: "Token A op geroteerd gezet" },
  nodeRotatedSub: { en: "token B written", nl: "token B weggeschreven" },
  nodeFamily: { en: "The session is revoked", nl: "De sessie wordt ingetrokken" },
  nodeFamilySub: { en: "with every token in it", nl: "met alle tokens erin" },
  nodePair: { en: "A new pair", nl: "Een nieuw paar" },
  nodePairSub: { en: "access token and cookie", nl: "accesstoken en cookie" },
  nodeInvalidSub: { en: "every device logs in again", nl: "elk apparaat logt opnieuw in" },
  edgeByItsHash: { en: "looked up", nl: "opgezocht" },
  edgeFirstUse: { en: "first use", nl: "eerste gebruik" },
  edgeSecondUse: { en: "second use", nl: "tweede gebruik" },
} as const;
