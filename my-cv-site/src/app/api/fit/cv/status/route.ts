import { NextRequest, NextResponse } from "next/server";
import {
  enforceRateLimit,
  getClientIp,
  isAllowedOrigin,
  serverErrorResponse,
  tooManyRequestsResponse,
} from "@/lib/security";
import {
  CV_STATUS_BUDGET_MILLISECONDS,
  FitAgentRateLimitError,
  agentBudget,
  getFitAgentConfiguration,
  requestTailoredCvStatus,
} from "@/lib/fit";
import { getFitLinkSecret, readSignedFitRequest } from "@/lib/fit/resultLink";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const limited = enforceRateLimit(request, "read");
    if (limited) return limited;

    const parameters = request.nextUrl.searchParams;
    const linkSecret = getFitLinkSecret();
    const configuration = getFitAgentConfiguration();
    if (!linkSecret || !configuration) {
      console.error("Missing required environment variables for the tailored CV status");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const signed = readSignedFitRequest(
      parameters.get("session"),
      parameters.get("key"),
      parameters.get("locale"),
      linkSecret
    );
    if (signed.status === "invalidSession") {
      return NextResponse.json(
        { error: 'Field "session" is not an allowed value.' },
        { status: 400 }
      );
    }
    if (signed.status === "invalidKey") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const status = await requestTailoredCvStatus(
      agentBudget(configuration, CV_STATUS_BUDGET_MILLISECONDS),
      {
        sessionId: signed.sessionId,
        locale: signed.locale,
        clientAddress: getClientIp(request),
      }
    );

    return NextResponse.json(status);
  } catch (error: unknown) {
    if (error instanceof FitAgentRateLimitError) {
      return tooManyRequestsResponse(error.retryAfterSeconds);
    }
    console.error("The tailored CV status did not come through");
    return serverErrorResponse(error, "The CV is not available right now");
  }
}
