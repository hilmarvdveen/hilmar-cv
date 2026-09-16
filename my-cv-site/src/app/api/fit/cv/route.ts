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
  fetchTailoredCvDocument,
  getFitAgentConfiguration,
  requestTailoredCv,
  sanitizeSessionId,
} from "@/lib/fit";
import { getFitLinkSecret, verifySession } from "@/lib/fit/resultLink";

export const runtime = "nodejs";
export const maxDuration = 60;

const documentFileName = (locale: "nl" | "en"): string =>
  `cv-hilmar-van-der-veen-${locale}.pdf`;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const limited = enforceRateLimit(request, "read");
    if (limited) return limited;

    const parameters = request.nextUrl.searchParams;
    const sessionId = sanitizeSessionId(parameters.get("session"));
    const key = parameters.get("key") ?? "";
    const locale = parameters.get("locale") === "en" ? "en" : "nl";
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Field "session" is not an allowed value.' },
        { status: 400 }
      );
    }

    const linkSecret = getFitLinkSecret();
    const configuration = getFitAgentConfiguration();
    if (!linkSecret || !configuration) {
      console.error("Missing required environment variables for the tailored CV");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    if (!verifySession(sessionId, key, linkSecret)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const clientAddress = getClientIp(request);
    await requestTailoredCv(configuration, { sessionId, locale, clientAddress });
    const document = await fetchTailoredCvDocument(configuration, {
      sessionId,
      locale,
      clientAddress,
    });

    return new NextResponse(document.body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${documentFileName(locale)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    if (error instanceof FitAgentRateLimitError) {
      return tooManyRequestsResponse(error.retryAfterSeconds);
    }
    console.error("The tailored CV did not come through");
    return serverErrorResponse(error, "The CV is not available right now");
  }
}
