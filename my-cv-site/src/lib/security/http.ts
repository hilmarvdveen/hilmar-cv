import { NextResponse } from "next/server";

/**
 * Build a 500 response that never leaks internals in production.
 * In development the original error message/stack is included to aid debugging.
 */
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
