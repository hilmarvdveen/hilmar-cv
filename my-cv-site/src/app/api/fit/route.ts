import { NextRequest, NextResponse } from "next/server";
import {
  enforceRateLimit,
  getClientIp,
  isAllowedOrigin,
  looksAutomated,
  serverErrorResponse,
  tooManyRequestsResponse,
  validateFields,
} from "@/lib/security";
import {
  EMPTY_FIT_REPORT,
  FIT_LIMITS,
  FitAgentRateLimitError,
  FitAgentRefusalError,
  getFitAgentConfiguration,
  isFitReport,
  sanitizeFitReport,
  sanitizeSessionId,
  agentBudget,
  startFitJob,
} from "@/lib/fit";
import { FIT_JOB_START_BUDGET_MILLISECONDS } from "@/lib/fit/job";
import { getTurnstileConfiguration, verifyTurnstileToken } from "@/lib/fit/turnstile";

export const runtime = "nodejs";
export const maxDuration = 60;

type FitRequestBody = {
  vacancy: string;
  locale: string;
  company_website?: string;
  formStartedAt?: number;
  turnstileToken?: string;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const limited = enforceRateLimit(request, "fit");
    if (limited) return limited;

    const body = (await request.json()) as Partial<FitRequestBody>;

    if (looksAutomated(body as Record<string, unknown>, Date.now())) {
      return NextResponse.json({ report: EMPTY_FIT_REPORT, sessionId: "" });
    }

    const validation = validateFields({
      vacancy: {
        value: body.vacancy,
        required: true,
        maxLength: FIT_LIMITS.vacancyMaximum,
      },
    });
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const vacancy = (body.vacancy as string).trim();
    if (vacancy.length < FIT_LIMITS.vacancyMinimum) {
      return NextResponse.json({ reason: "tooShort" }, { status: 422 });
    }

    const turnstile = getTurnstileConfiguration();
    if (
      turnstile &&
      !(await verifyTurnstileToken(turnstile, {
        token: body.turnstileToken,
        clientAddress: getClientIp(request),
      }))
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const configuration = getFitAgentConfiguration();
    if (!configuration) {
      console.error("Missing required fit agent environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const job = await startFitJob(agentBudget(configuration, FIT_JOB_START_BUDGET_MILLISECONDS), {
      vacancy,
      locale: body.locale === "en" ? "en" : "nl",
      clientAddress: getClientIp(request),
    });

    if (job.started) {
      return NextResponse.json({ jobId: job.jobId }, { status: 202 });
    }

    if (!isFitReport(job.answer?.report)) {
      throw new Error("The fit agent returned a report in an unexpected shape");
    }

    return NextResponse.json({
      report: sanitizeFitReport(job.answer.report),
      sessionId: sanitizeSessionId(job.answer.sessionId),
    });
  } catch (error: unknown) {
    if (error instanceof FitAgentRateLimitError) {
      return tooManyRequestsResponse(error.retryAfterSeconds);
    }
    if (error instanceof FitAgentRefusalError) {
      return NextResponse.json({ reason: error.reason }, { status: 422 });
    }
    console.error("Fit check failed");
    return serverErrorResponse(error, "The fit check is not available right now");
  }
}
