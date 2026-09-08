import { NextRequest, NextResponse } from "next/server";
import { runGraphHealthChecks } from "@/lib/graph";
import { enforceRateLimit } from "@/lib/security";

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const expectedToken = process.env.DIAGNOSTICS_TOKEN;
  const providedToken = request.headers.get("x-diagnostics-token");
  if (!expectedToken || providedToken !== expectedToken) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const limited = enforceRateLimit(request, "read");
  if (limited) return limited;

  const report = await runGraphHealthChecks();
  return NextResponse.json(report);
}
