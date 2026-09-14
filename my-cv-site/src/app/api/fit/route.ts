import { NextRequest, NextResponse } from "next/server";
import {
  enforceRateLimit,
  getClientIp,
  isAllowedOrigin,
  looksAutomated,
  serverErrorResponse,
  validateFields,
} from "@/lib/security";
import {
  EMPTY_FIT_REPORT,
  FIT_LIMITS,
  getFitAgentConfiguration,
  isFitReport,
  requestFitReport,
  sanitizeFitReport,
  sanitizeSessionId,
} from "@/lib/fit";

export const runtime = "nodejs";
export const maxDuration = 60;

type FitRequestBody = {
  vacancy: string;
  locale: string;
  company_website?: string;
  formStartedAt?: number;
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
      return NextResponse.json(
        { error: 'Field "vacancy" is shorter than the minimum length.' },
        { status: 400 }
      );
    }

    const configuration = getFitAgentConfiguration();
    if (!configuration) {
      console.error("Missing required fit agent environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const result = await requestFitReport(configuration, {
      vacancy,
      locale: body.locale === "en" ? "en" : "nl",
      clientAddress: getClientIp(request),
    });

    if (!isFitReport(result?.report)) {
      throw new Error("The fit agent returned a report in an unexpected shape");
    }

    return NextResponse.json({
      report: sanitizeFitReport(result.report),
      sessionId: sanitizeSessionId(result.sessionId),
    });
  } catch (error: unknown) {
    console.error("Fit check failed");
    return serverErrorResponse(error, "The fit check is not available right now");
  }
}
