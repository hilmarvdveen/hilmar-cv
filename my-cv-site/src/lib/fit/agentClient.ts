import { normalizeVacancyLeads, readVacancyLeadRecord } from "./leads";
import {
  readFitCvStatus,
  readFitRefusalReason,
  readStoredFitResult,
  retryAfterSecondsFromBody,
} from "./report";
import type {
  FitAnswerResponse,
  FitCvStatus,
  FitLocale,
  FitRefusalReason,
  FitReportResponse,
  FitStoredResult,
  VacancyLeadRecord,
} from "./types";

export class FitAgentRateLimitError extends Error {
  readonly retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super("The fit agent answered 429");
    this.name = "FitAgentRateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class FitAgentRefusalError extends Error {
  readonly reason: FitRefusalReason;

  constructor(reason: FitRefusalReason) {
    super("The fit agent refused the text");
    this.name = "FitAgentRefusalError";
    this.reason = reason;
  }
}

export class FitCvNotReadyError extends Error {
  constructor() {
    super("The tailored CV is not ready");
    this.name = "FitCvNotReadyError";
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

export function getFitLeadsToken(): string | null {
  const token = process.env.FIT_LEADS_TOKEN;
  return token ? token : null;
}

export function agentBudget(
  configuration: FitAgentConfiguration,
  budgetMilliseconds: number
): FitAgentConfiguration {
  return {
    ...configuration,
    timeoutMilliseconds: Math.min(configuration.timeoutMilliseconds, budgetMilliseconds),
  };
}

type AgentRequest = {
  configuration: FitAgentConfiguration;
  path: string;
  body: Record<string, unknown>;
  clientAddress: string;
  token?: string;
  toleratedStatuses?: readonly number[];
};

async function readAgentBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function readRetryAfterSeconds(response: Response): Promise<number> {
  return retryAfterSecondsFromBody(await readAgentBody(response));
}

async function refuseOrThrow(response: Response): Promise<never> {
  if (response.status === 429) {
    throw new FitAgentRateLimitError(await readRetryAfterSeconds(response));
  }
  if (response.status === 400) {
    const reason = readFitRefusalReason(await readAgentBody(response));
    if (reason) throw new FitAgentRefusalError(reason);
  }
  throw new Error(`The fit agent answered ${response.status}`);
}

async function postToAgent({
  configuration,
  path,
  body,
  clientAddress,
  token,
  toleratedStatuses = [],
}: AgentRequest): Promise<{ status: number; body: unknown }> {
  const response = await fetch(`${configuration.url}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token ?? configuration.token}`,
      "x-forwarded-for": clientAddress,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(configuration.timeoutMilliseconds),
    cache: "no-store",
  });

  if (!response.ok && !toleratedStatuses.includes(response.status)) {
    return refuseOrThrow(response);
  }

  return { status: response.status, body: await readAgentBody(response) };
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
  const answer = await postToAgent({
    configuration,
    path: "/fit",
    body: { vacancy, locale },
    clientAddress,
  });
  return answer.body as FitReportResponse;
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
  const answer = await postToAgent({
    configuration,
    path: "/fit/question",
    body: { question, sessionId, locale },
    clientAddress,
  });
  return answer.body as FitAnswerResponse;
}

export function agentStoredResultPath(sessionId: string): string {
  return `/fit/${encodeURIComponent(sessionId)}`;
}

type AgentReadRequest = {
  configuration: FitAgentConfiguration;
  path: string;
  clientAddress: string;
  token?: string;
  toleratedStatuses?: readonly number[];
};

async function getFromAgent({
  configuration,
  path,
  clientAddress,
  token,
  toleratedStatuses = [],
}: AgentReadRequest): Promise<Response> {
  const response = await fetch(`${configuration.url}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token ?? configuration.token}`,
      "x-forwarded-for": clientAddress,
    },
    signal: AbortSignal.timeout(configuration.timeoutMilliseconds),
    cache: "no-store",
  });

  if (!response.ok && !toleratedStatuses.includes(response.status)) {
    return refuseOrThrow(response);
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
    toleratedStatuses: [404],
  });
  if (response.status === 404) return null;
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
  const answer = await postToAgent({
    configuration,
    path: `${agentStoredResultPath(sessionId)}/cv`,
    body: { locale },
    clientAddress,
    toleratedStatuses: [404],
  });
  if (answer.status === 404) return { ready: false, pages: 0, failed: true };
  return readFitCvStatus(answer.body);
}

export async function requestTailoredCvStatus(
  configuration: FitAgentConfiguration,
  { sessionId, locale, clientAddress }: FitCvRequest
): Promise<FitCvStatus> {
  const response = await getFromAgent({
    configuration,
    path: `${agentStoredResultPath(sessionId)}/cv?locale=${encodeURIComponent(locale)}`,
    clientAddress,
    toleratedStatuses: [404],
  });
  if (response.status === 404) return { ready: false, pages: 0, failed: true };
  return readFitCvStatus(await response.json());
}

export async function fetchTailoredCvDocument(
  configuration: FitAgentConfiguration,
  { sessionId, locale, clientAddress }: FitCvRequest
): Promise<Response> {
  const response = await getFromAgent({
    configuration,
    path: `${agentStoredResultPath(sessionId)}/cv.pdf?locale=${encodeURIComponent(locale)}`,
    clientAddress,
    toleratedStatuses: [404, 409],
  });
  if (!response.ok) throw new FitCvNotReadyError();
  return response;
}

export type FitRequesterRequest = {
  sessionId: string;
  emailDomain: string;
  clientAddress: string;
  leadsToken: string;
};

export async function reportRequesterEmailDomain(
  configuration: FitAgentConfiguration,
  { sessionId, emailDomain, clientAddress, leadsToken }: FitRequesterRequest
): Promise<void> {
  await postToAgent({
    configuration,
    path: `/leads/${encodeURIComponent(sessionId)}/requester`,
    body: { emailDomain },
    clientAddress,
    token: leadsToken,
  });
}

export type FitLeadRequest = {
  sessionId: string;
  clientAddress: string;
  leadsToken: string;
};

export async function requestLead(
  configuration: FitAgentConfiguration,
  { sessionId, clientAddress, leadsToken }: FitLeadRequest
): Promise<VacancyLeadRecord | null> {
  const response = await getFromAgent({
    configuration,
    path: `/leads/${encodeURIComponent(sessionId)}`,
    clientAddress,
    token: leadsToken,
    toleratedStatuses: [404],
  });
  if (response.status === 404) return null;
  const body = (await response.json()) as { lead?: unknown };
  return readVacancyLeadRecord(body.lead);
}

export type FitLeadsRequest = {
  since: string;
  clientAddress: string;
  leadsToken: string;
};

export async function requestRecentLeads(
  configuration: FitAgentConfiguration,
  { since, clientAddress, leadsToken }: FitLeadsRequest
): Promise<VacancyLeadRecord[]> {
  const response = await getFromAgent({
    configuration,
    path: `/leads?since=${encodeURIComponent(since)}`,
    clientAddress,
    token: leadsToken,
  });
  return normalizeVacancyLeads(await response.json());
}
