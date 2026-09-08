import { NextRequest, NextResponse } from "next/server";
import {
  getGraphCredentials,
  getAccessToken,
  getGraphClient,
  sendMail,
  runGraphHealthChecks,
} from "@/lib/graph";
import { describeSecretExpiry } from "@/lib/booking";
import { renderBookingWatchEmail } from "@/lib/email";
import { enforceRateLimit, serverErrorResponse } from "@/lib/security";

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const expectedSecret = process.env.CRON_SECRET;
  const authorizationHeader = request.headers.get("authorization");
  const providedSecret = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.slice("Bearer ".length)
    : undefined;
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const limited = enforceRateLimit(request, "read");
  if (limited) return limited;

  try {
    const report = await runGraphHealthChecks();
    const expiry = describeSecretExpiry(process.env.MS_CLIENT_SECRET_EXPIRES_ON, new Date());
    const needsAlert = !report.healthy || expiry.level !== "fine";
    if (!needsAlert) {
      return NextResponse.json({ healthy: true, alerted: false, secretExpiry: expiry });
    }

    const tokenWorks = report.steps.some((step) => step.step === "token" && step.ok);
    const credentials = getGraphCredentials();
    if (!tokenWorks || !credentials) {
      console.error("Booking watch cannot send its alert because the Graph token failed:", report.steps);
      return NextResponse.json(
        { healthy: false, alerted: false, steps: report.steps, secretExpiry: expiry },
        { status: 500 }
      );
    }

    const client = getGraphClient(await getAccessToken(credentials));
    const email = renderBookingWatchEmail({ steps: report.steps, expiry });
    await sendMail(client, credentials.smtpUser, {
      to: credentials.smtpUser,
      subject: email.subject,
      body: email.html,
      isHtml: true,
    });
    return NextResponse.json(
      { healthy: report.healthy, alerted: true, secretExpiry: expiry },
      { status: report.healthy ? 200 : 500 }
    );
  } catch (error: unknown) {
    return serverErrorResponse(error);
  }
}
