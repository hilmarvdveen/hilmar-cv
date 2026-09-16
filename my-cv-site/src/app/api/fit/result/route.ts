import { NextRequest, NextResponse } from "next/server";
import {
  enforceRateLimit,
  getClientIp,
  isAllowedOrigin,
  serverErrorResponse,
  tooManyRequestsResponse,
} from "@/lib/security";
import {
  FitAgentRateLimitError,
  getFitAgentConfiguration,
  requestStoredFitResult,
  sanitizeSessionId,
} from "@/lib/fit";
import { getFitLinkSecret, verifySession } from "@/lib/fit/resultLink";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const limited = enforceRateLimit(request, "read");
    if (limited) return limited;

    const sessionId = sanitizeSessionId(request.nextUrl.searchParams.get("session"));
    const key = request.nextUrl.searchParams.get("key") ?? "";
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Field "session" is not an allowed value.' },
        { status: 400 }
      );
    }

    const linkSecret = getFitLinkSecret();
    const configuration = getFitAgentConfiguration();
    if (!linkSecret || !configuration) {
      console.error("Missing required environment variables for the stored fit result");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    if (!verifySession(sessionId, key, linkSecret)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const stored = await requestStoredFitResult(configuration, {
      sessionId,
      clientAddress: getClientIp(request),
    });

    if (!stored) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      report: stored.report,
      locale: stored.locale,
      hasCv: stored.hasCv,
    });
  } catch (error: unknown) {
    if (error instanceof FitAgentRateLimitError) {
      return tooManyRequestsResponse(error.retryAfterSeconds);
    }
    console.error("Reopening a fit result failed");
    return serverErrorResponse(error, "The result is not available right now");
  }
}
