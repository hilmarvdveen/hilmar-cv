import { normalizeVacancyLeads } from "./leads";
import { readFitCvStatus, readStoredFitResult, retryAfterSecondsFromBody } from "./report";
import type {
  FitAnswerResponse,
  FitCvStatus,
  FitLocale,
  FitReportResponse,
  FitStoredResult,
  VacancyLead,
} from "./types";

export class FitAgentRateLimitError extends Error {
  readonly retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super("The fit agent answered 429");
    this.name = "FitAgentRateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export type FitAgentConfiguration = {
  url: string;
  token: string;
  timeoutMilliseconds: number;
};

export const FIT_AGENT_DEFAULT_TIMEOUT_MILLISECONDS = 50_000;

export function getFitAgentConfiguration(): FitAgentConfiguration | null {
  const url = process.env.FIT_AGENT_URL;
  const token = process.env.FIT_AGENT_TOKEN;
  if (!url || !token) return null;
  const configured = Number(process.env.FIT_AGENT_TIMEOUT_MS);
  const timeoutMilliseconds =
    Number.isFinite(configured) && configured > 0
      ? configured
      : FIT_AGENT_DEFAULT_TIMEOUT_MILLISECONDS;
  return { url: url.replace(/\/+$/, ""), token, timeoutMilliseconds };
}

type AgentRequest = {
  configuration: FitAgentConfiguration;
  path: string;
  body: Record<string, unknown>;
  clientAddress: string;
};

async function readRetryAfterSeconds(response: Response): Promise<number> {
  try {
    return retryAfterSecondsFromBody(await response.json());
  } catch {
    return 0;
  }
}

async function postToAgent({
  configuration,
  path,
  body,
  clientAddress,
}: AgentRequest): Promise<unknown> {
  const response = await fetch(`${configuration.url}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${configuration.token}`,
      "x-forwarded-for": clientAddress,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(configuration.timeoutMilliseconds),
    cache: "no-store",
  });

  if (response.status === 429) {
    throw new FitAgentRateLimitError(await readRetryAfterSeconds(response));
  }

  if (!response.ok) {
    throw new Error(`The fit agent answered ${response.status}`);
  }

  return response.json();
}

export type FitReportRequest = {
  vacancy: string;
  locale: FitLocale;
  clientAddress: string;
};

export async function requestFitReport(
  configuration: FitAgentConfiguration,
  { vacancy, locale, clientAddress }: FitReportRequest
): Promise<FitReportResponse> {
  return (await postToAgent({
    configuration,
    path: "/fit",
    body: { vacancy, locale },
    clientAddress,
  })) as FitReportResponse;
}

export type FitAnswerRequest = {
  question: string;
  sessionId: string;
  locale: FitLocale;
  clientAddress: string;
};

export async function requestFitAnswer(
  configuration: FitAgentConfiguration,
  { question, sessionId, locale, clientAddress }: FitAnswerRequest
): Promise<FitAnswerResponse> {
  return (await postToAgent({
    configuration,
    path: "/fit/question",
    body: { question, sessionId, locale },
    clientAddress,
  })) as FitAnswerResponse;
}

export function agentStoredResultPath(sessionId: string): string {
  return `/fit/${encodeURIComponent(sessionId)}`;
}

type AgentReadRequest = {
  configuration: FitAgentConfiguration;
  path: string;
  clientAddress: string;
};

async function getFromAgent({
  configuration,
  path,
  clientAddress,
}: AgentReadRequest): Promise<Response> {
  const response = await fetch(`${configuration.url}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${configuration.token}`,
      "x-forwarded-for": clientAddress,
    },
    signal: AbortSignal.timeout(configuration.timeoutMilliseconds),
    cache: "no-store",
  });

  if (response.status === 429) {
    throw new FitAgentRateLimitError(await readRetryAfterSeconds(response));
  }

  if (!response.ok) {
    throw new Error(`The fit agent answered ${response.status}`);
  }

  return response;
}

export type FitStoredResultRequest = {
  sessionId: string;
  clientAddress: string;
};

export async function requestStoredFitResult(
  configuration: FitAgentConfiguration,
  { sessionId, clientAddress }: FitStoredResultRequest
): Promise<FitStoredResult | null> {
  const response = await getFromAgent({
    configuration,
    path: agentStoredResultPath(sessionId),
    clientAddress,
  });
  return readStoredFitResult(await response.json());
}

export type FitCvRequest = {
  sessionId: string;
  locale: FitLocale;
  clientAddress: string;
};

export async function requestTailoredCv(
  configuration: FitAgentConfiguration,
  { sessionId, locale, clientAddress }: FitCvRequest
): Promise<FitCvStatus> {
  return readFitCvStatus(
    await postToAgent({
      configuration,
      path: `${agentStoredResultPath(sessionId)}/cv`,
      body: { locale },
      clientAddress,
    })
  );
}

export async function fetchTailoredCvDocument(
  configuration: FitAgentConfiguration,
  { sessionId, locale, clientAddress }: FitCvRequest
): Promise<Response> {
  return getFromAgent({
    configuration,
    path: `${agentStoredResultPath(sessionId)}/cv.pdf?locale=${encodeURIComponent(locale)}`,
    clientAddress,
  });
}

export type FitRequesterRequest = {
  sessionId: string;
  emailDomain: string;
  clientAddress: string;
};

export async function reportRequesterEmailDomain(
  configuration: FitAgentConfiguration,
  { sessionId, emailDomain, clientAddress }: FitRequesterRequest
): Promise<void> {
  await postToAgent({
    configuration,
    path: `/leads/${encodeURIComponent(sessionId)}/requester`,
    body: { emailDomain },
    clientAddress,
  });
}

export type FitLeadsRequest = {
  since: string;
  clientAddress: string;
};

export async function requestRecentLeads(
  configuration: FitAgentConfiguration,
  { since, clientAddress }: FitLeadsRequest
): Promise<VacancyLead[]> {
  const response = await getFromAgent({
    configuration,
    path: `/leads?since=${encodeURIComponent(since)}`,
    clientAddress,
  });
  return normalizeVacancyLeads(await response.json());
}
