import { NextRequest, NextResponse } from "next/server";
import { getGraphCredentials, getAccessToken, getGraphClient, sendMail } from "@/lib/graph";
import {
  LIMITS,
  enforceRateLimit,
  getClientIp,
  isAllowedOrigin,
  looksAutomated,
  serverErrorResponse,
  tooManyRequestsResponse,
  validateFields,
} from "@/lib/security";
import { renderFitLeadNotification, renderFitLinkEmail } from "@/lib/email";
import {
  CV_BUILD_BUDGET_MILLISECONDS,
  FIT_LIMITS,
  FitAgentRateLimitError,
  agentBudget,
  getFitAgentConfiguration,
  getFitLeadsToken,
  hasSentResultLink,
  rememberSentResultLink,
  reportRequesterEmailDomain,
  requestLead,
  requestStoredFitResult,
  requestTailoredCv,
  sanitizeSessionId,
  type FitAgentConfiguration,
  type FitLocale,
  type VacancyLeadRecord,
} from "@/lib/fit";
import { fitResultUrl, getFitLinkSecret, signSession } from "@/lib/fit/resultLink";
import { getTurnstileConfiguration, verifyTurnstileToken } from "@/lib/fit/turnstile";

export const runtime = "nodejs";
export const maxDuration = 60;

type FitCvRequestBody = {
  sessionId: string;
  name: string;
  email: string;
  organisation?: string;
  locale: string;
  turnstileToken?: string;
  company_website?: string;
  formStartedAt?: number;
};

const SENT = { sent: true } as const;

const emailDomainOf = (email: string): string =>
  email.slice(email.lastIndexOf("@") + 1).toLowerCase();

async function announceRequester(
  configuration: FitAgentConfiguration,
  sessionId: string,
  email: string,
  clientAddress: string
) {
  const leadsToken = getFitLeadsToken();
  if (!leadsToken) return;
  try {
    await reportRequesterEmailDomain(configuration, {
      sessionId,
      emailDomain: emailDomainOf(email),
      clientAddress,
      leadsToken,
    });
  } catch {
    console.error("The fit agent did not accept the requester domain");
  }
}

async function startTailoredCvBuild(
  configuration: FitAgentConfiguration,
  sessionId: string,
  locale: FitLocale,
  clientAddress: string
) {
  try {
    await requestTailoredCv(agentBudget(configuration, CV_BUILD_BUDGET_MILLISECONDS), {
      sessionId,
      locale,
      clientAddress,
    });
  } catch {
    console.error("The tailored CV build did not start");
  }
}

async function readLeadRecord(
  configuration: FitAgentConfiguration,
  sessionId: string,
  clientAddress: string
): Promise<VacancyLeadRecord | null> {
  const leadsToken = getFitLeadsToken();
  if (!leadsToken) return null;
  try {
    return await requestLead(configuration, { sessionId, clientAddress, leadsToken });
  } catch {
    console.error("The fit agent did not answer the lead record");
    return null;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const limited = enforceRateLimit(request, "email");
    if (limited) return limited;

    const body = (await request.json()) as Partial<FitCvRequestBody>;

    if (looksAutomated(body as Record<string, unknown>, Date.now())) {
      return NextResponse.json(SENT);
    }

    const validation = validateFields({
      name: { value: body.name, required: true, maxLength: LIMITS.name },
      email: { value: body.email, required: true, email: true },
      organisation: { value: body.organisation, maxLength: LIMITS.subjectLike },
      sessionId: {
        value: body.sessionId,
        required: true,
        maxLength: FIT_LIMITS.sessionIdMaximum,
      },
    });
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const sessionId = sanitizeSessionId(body.sessionId);
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Field "sessionId" is not an allowed value.' },
        { status: 400 }
      );
    }

    const clientAddress = getClientIp(request);
    const turnstile = getTurnstileConfiguration();
    if (
      turnstile &&
      !(await verifyTurnstileToken(turnstile, { token: body.turnstileToken, clientAddress }))
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const credentials = getGraphCredentials();
    const linkSecret = getFitLinkSecret();
    const configuration = getFitAgentConfiguration();
    if (!credentials || !linkSecret || !configuration) {
      console.error("Missing required environment variables for the fit CV request");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const name = body.name as string;
    const email = body.email as string;
    const organisation = typeof body.organisation === "string" ? body.organisation.trim() : "";
    const locale = body.locale === "en" ? "en" : "nl";

    const stored = await requestStoredFitResult(configuration, { sessionId, clientAddress });
    if (!stored) return NextResponse.json(SENT);
    if (hasSentResultLink(sessionId, email)) return NextResponse.json(SENT);
    rememberSentResultLink(sessionId, email);

    await startTailoredCvBuild(configuration, sessionId, stored.locale, clientAddress);

    const resultUrl = fitResultUrl(locale, sessionId, signSession(sessionId, linkSecret));
    const accessToken = await getAccessToken(credentials);
    const client = getGraphClient(accessToken);
    const { smtpUser } = credentials;

    const visitorEmail = renderFitLinkEmail({
      locale,
      name,
      resultUrl,
      vacancyTitle: stored.title,
    });
    await sendMail(client, smtpUser, {
      to: email,
      toName: name,
      subject: visitorEmail.subject,
      body: visitorEmail.html,
      isHtml: true,
    });

    const lead = await readLeadRecord(configuration, sessionId, clientAddress);
    const ownerEmail = renderFitLeadNotification({
      name,
      email,
      organisation,
      sessionId,
      resultUrl,
      vacancyTitle: stored.title || lead?.lead.title || "",
      endClient: lead?.lead.endClient ?? "",
      closingDate: lead?.lead.closingDate ?? "",
      verdictCounts: lead?.verdictCounts,
    });
    await sendMail(client, smtpUser, {
      to: smtpUser,
      toName: "Hilmar van der Veen",
      subject: ownerEmail.subject,
      body: ownerEmail.html,
      isHtml: true,
      replyTo: email,
      replyToName: name,
    });

    await announceRequester(configuration, sessionId, email, clientAddress);

    return NextResponse.json(SENT);
  } catch (error: unknown) {
    if (error instanceof FitAgentRateLimitError) {
      return tooManyRequestsResponse(error.retryAfterSeconds);
    }
    console.error("The fit CV request failed");
    return serverErrorResponse(error, "The CV request did not come through");
  }
}
