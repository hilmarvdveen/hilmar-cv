import { NextResponse } from "next/server";
import { automatedSignal } from "./honeypot";

export function serverErrorResponse(
  error: unknown,
  publicMessage = "Internal Server Error"
): NextResponse {
  const isDev = process.env.NODE_ENV === "development";
  return NextResponse.json(
    {
      error: publicMessage,
      ...(isDev && {
        details: error instanceof Error ? error.stack || error.message : String(error),
      }),
    },
    { status: 500 }
  );
}

export function rejectAutomatedSubmission(
  route: string,
  body: Record<string, unknown>,
  now: number
): NextResponse | null {
  const signal = automatedSignal(body, now);
  if (signal === null) return null;
  console.warn(`Automated submission rejected: route=${route} signal=${signal}`);
  return NextResponse.json({ reason: "looksAutomated" }, { status: 422 });
}
