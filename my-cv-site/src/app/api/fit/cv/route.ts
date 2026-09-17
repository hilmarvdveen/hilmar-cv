import { NextRequest, NextResponse } from "next/server";
import {
  enforceRateLimit,
  getClientIp,
  isAllowedOrigin,
  serverErrorResponse,
  tooManyRequestsResponse,
} from "@/lib/security";
import {
  CV_BUILD_BUDGET_MILLISECONDS,
  CV_STREAM_BUDGET_MILLISECONDS,
  FitAgentRateLimitError,
  FitCvNotReadyError,
  agentBudget,
  fetchTailoredCvDocument,
  getFitAgentConfiguration,
  requestTailoredCv,
  tailoredCvFileName,
} from "@/lib/fit";
import { getFitLinkSecret, readSignedFitRequest } from "@/lib/fit/resultLink";

export const runtime = "nodejs";
export const maxDuration = 60;

type FitCvBuildBody = {
  session?: string;
  key?: string;
  locale?: string;
};

const forbidden = () => NextResponse.json({ error: "Forbidden" }, { status: 403 });

const unusableSession = () =>
  NextResponse.json({ error: 'Field "session" is not an allowed value.' }, { status: 400 });

const configurationError = (message: string) => {
  console.error(message);
  return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isAllowedOrigin(request)) return forbidden();

    const limited = enforceRateLimit(request, "fit");
    if (limited) return limited;

    const body = (await request.json()) as FitCvBuildBody;
    const linkSecret = getFitLinkSecret();
    const configuration = getFitAgentConfiguration();
    if (!linkSecret || !configuration) {
      return configurationError("Missing required environment variables for the tailored CV");
    }

    const signed = readSignedFitRequest(body.session, body.key, body.locale, linkSecret);
    if (signed.status === "invalidSession") return unusableSession();
    if (signed.status === "invalidKey") return forbidden();

    const status = await requestTailoredCv(
      agentBudget(configuration, CV_BUILD_BUDGET_MILLISECONDS),
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
    console.error("The tailored CV build did not start");
    return serverErrorResponse(error, "The CV is not available right now");
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isAllowedOrigin(request)) return forbidden();

    const limited = enforceRateLimit(request, "read");
    if (limited) return limited;

    const parameters = request.nextUrl.searchParams;
    const linkSecret = getFitLinkSecret();
    const configuration = getFitAgentConfiguration();
    if (!linkSecret || !configuration) {
      return configurationError("Missing required environment variables for the tailored CV");
    }

    const signed = readSignedFitRequest(
      parameters.get("session"),
      parameters.get("key"),
      parameters.get("locale"),
      linkSecret
    );
    if (signed.status === "invalidSession") return unusableSession();
    if (signed.status === "invalidKey") return forbidden();

    const document = await fetchTailoredCvDocument(
      agentBudget(configuration, CV_STREAM_BUDGET_MILLISECONDS),
      {
        sessionId: signed.sessionId,
        locale: signed.locale,
        clientAddress: getClientIp(request),
      }
    );

    return new NextResponse(document.body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${tailoredCvFileName("", signed.locale)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    if (error instanceof FitAgentRateLimitError) {
      return tooManyRequestsResponse(error.retryAfterSeconds);
    }
    if (error instanceof FitCvNotReadyError) {
      return NextResponse.json({ ready: false }, { status: 409 });
    }
    console.error("The tailored CV did not come through");
    return serverErrorResponse(error, "The CV is not available right now");
  }
}
