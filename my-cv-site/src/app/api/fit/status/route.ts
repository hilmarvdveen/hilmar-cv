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
  agentBudget,
  getFitAgentConfiguration,
  requestFitJobStatus,
} from "@/lib/fit";
import { FIT_JOB_STATUS_BUDGET_MILLISECONDS, sanitizeJobId } from "@/lib/fit/job";

export const runtime = "nodejs";
export const maxDuration = 15;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const limited = enforceRateLimit(request, "fitStatus");
    if (limited) return limited;

    const jobId = sanitizeJobId(request.nextUrl.searchParams.get("job"));
    if (jobId === "") {
      return NextResponse.json({ error: 'Field "job" is not an allowed value.' }, { status: 400 });
    }

    const configuration = getFitAgentConfiguration();
    if (!configuration) {
      console.error("Missing required fit agent environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const status = await requestFitJobStatus(
      agentBudget(configuration, FIT_JOB_STATUS_BUDGET_MILLISECONDS),
      { jobId, clientAddress: getClientIp(request) }
    );

    return NextResponse.json(status, { headers: { "Cache-Control": "no-store" } });
  } catch (error: unknown) {
    if (error instanceof FitAgentRateLimitError) {
      return tooManyRequestsResponse(error.retryAfterSeconds);
    }
    console.error("The fit job status did not come through");
    return serverErrorResponse(error, "The fit check is not available right now");
  }
}
