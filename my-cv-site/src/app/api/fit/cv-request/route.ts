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
  FIT_LIMITS,
  FitAgentRateLimitError,
  getFitAgentConfiguration,
  reportRequesterEmailDomain,
  sanitizeSessionId,
} from "@/lib/fit";
import { fitResultUrl, getFitLinkSecret, signSession } from "@/lib/fit/resultLink";

export const runtime = "nodejs";
export const maxDuration = 60;

type FitCvRequestBody = {
  sessionId: string;
  name: string;
  email: string;
  organisation?: string;
  locale: string;
  company_website?: string;
  formStartedAt?: number;
};

const emailDomainOf = (email: string): string =>
  email.slice(email.lastIndexOf("@") + 1).toLowerCase();

async function announceRequester(sessionId: string, email: string, clientAddress: string) {
  const configuration = getFitAgentConfiguration();
  if (!configuration) return;
  try {
    await reportRequesterEmailDomain(configuration, {
      sessionId,
      emailDomain: emailDomainOf(email),
      clientAddress,
    });
  } catch {
    console.error("The fit agent did not accept the requester domain");
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const limited = enforceRateLimit(request, "fit");
    if (limited) return limited;

    const body = (await request.json()) as Partial<FitCvRequestBody>;

    if (looksAutomated(body as Record<string, unknown>, Date.now())) {
      return NextResponse.json({ sent: true });
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

    const credentials = getGraphCredentials();
    const linkSecret = getFitLinkSecret();
    if (!credentials || !linkSecret) {
      console.error("Missing required environment variables for the fit CV request");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const name = body.name as string;
    const email = body.email as string;
    const organisation = typeof body.organisation === "string" ? body.organisation.trim() : "";
    const locale = body.locale === "en" ? "en" : "nl";
    const resultUrl = fitResultUrl(locale, sessionId, signSession(sessionId, linkSecret));

    const accessToken = await getAccessToken(credentials);
    const client = getGraphClient(accessToken);
    const { smtpUser } = credentials;

    const visitorEmail = renderFitLinkEmail({ locale, name, resultUrl });
    await sendMail(client, smtpUser, {
      to: email,
      toName: name,
      subject: visitorEmail.subject,
      body: visitorEmail.html,
      isHtml: true,
    });

    const ownerEmail = renderFitLeadNotification({
      name,
      email,
      organisation,
      sessionId,
      resultUrl,
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

    await announceRequester(sessionId, email, getClientIp(request));

    return NextResponse.json({ sent: true });
  } catch (error: unknown) {
    if (error instanceof FitAgentRateLimitError) {
      return tooManyRequestsResponse(error.retryAfterSeconds);
    }
    console.error("The fit CV request failed");
    return serverErrorResponse(error, "The CV request did not come through");
  }
}
