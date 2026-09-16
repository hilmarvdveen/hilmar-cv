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
  FIT_LIMITS,
  FitAgentRateLimitError,
  getFitAgentConfiguration,
  isFitAnswer,
  requestFitAnswer,
  sanitizeFitAnswer,
  sanitizeSessionId,
} from "@/lib/fit";

export const runtime = "nodejs";
export const maxDuration = 60;

const EMPTY_FIT_ANSWER = { answer: "", engagements: [] };

type FitQuestionBody = {
  question: string;
  sessionId: string;
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

    const body = (await request.json()) as Partial<FitQuestionBody>;

    if (looksAutomated(body as Record<string, unknown>, Date.now())) {
      return NextResponse.json({ answer: EMPTY_FIT_ANSWER });
    }

    const validation = validateFields({
      question: {
        value: body.question,
        required: true,
        maxLength: FIT_LIMITS.questionMaximum,
      },
      sessionId: {
        value: body.sessionId,
        required: true,
        maxLength: FIT_LIMITS.sessionIdMaximum,
      },
    });
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const question = (body.question as string).trim();
    if (question.length < FIT_LIMITS.questionMinimum) {
      return NextResponse.json(
        { error: 'Field "question" is shorter than the minimum length.' },
        { status: 400 }
      );
    }

    const sessionId = sanitizeSessionId(body.sessionId);
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Field "sessionId" is not an allowed value.' },
        { status: 400 }
      );
    }

    const configuration = getFitAgentConfiguration();
    if (!configuration) {
      console.error("Missing required fit agent environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const result = await requestFitAnswer(configuration, {
      question,
      sessionId,
      locale: body.locale === "en" ? "en" : "nl",
      clientAddress: getClientIp(request),
    });

    if (!isFitAnswer(result?.answer)) {
      throw new Error("The fit agent returned an answer in an unexpected shape");
    }

    return NextResponse.json({ answer: sanitizeFitAnswer(result.answer) });
  } catch (error: unknown) {
    if (error instanceof FitAgentRateLimitError) {
      return tooManyRequestsResponse(error.retryAfterSeconds);
    }
    console.error("Fit question failed");
    return serverErrorResponse(error, "The fit check is not available right now");
  }
}
