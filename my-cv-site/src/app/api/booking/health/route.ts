import { NextRequest, NextResponse } from "next/server";
import {
  getGraphCredentials,
  getAccessToken,
  getGraphClient,
} from "@/lib/graph";
import { enforceRateLimit } from "@/lib/security";

export const runtime = "nodejs";

type HealthStep = {
  step: "environment" | "token" | "mailbox" | "calendar";
  ok: boolean;
  detail: string;
}

function describeGraphError(error: unknown, hint: string): string {
  const parts: string[] = [];
  if (error && typeof error === "object") {
    const graphError = error as {
      statusCode?: number;
      code?: string;
      message?: string;
    };
    if (graphError.statusCode) parts.push(`status ${graphError.statusCode}`);
    if (graphError.code) parts.push(`code ${graphError.code}`);
    if (graphError.message) parts.push(graphError.message.slice(0, 300));
  }
  if (parts.length === 0) parts.push(String(error).slice(0, 300));
  return `${parts.join(", ")}. ${hint}`;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const expectedToken = process.env.DIAGNOSTICS_TOKEN;
  const providedToken = request.headers.get("x-diagnostics-token");
  if (!expectedToken || providedToken !== expectedToken) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const limited = enforceRateLimit(request, "read");
  if (limited) return limited;

  const steps: HealthStep[] = [];
  const respond = (healthy: boolean): NextResponse =>
    NextResponse.json({ healthy, steps });

  const missingVariables = [
    "MS_CLIENT_ID",
    "MS_CLIENT_SECRET",
    "MS_TENANT_ID",
    "SMTP_USER",
  ].filter((name) => !process.env[name]);
  steps.push({
    step: "environment",
    ok: missingVariables.length === 0,
    detail:
      missingVariables.length === 0
        ? "all four Microsoft Graph variables are set"
        : `missing: ${missingVariables.join(", ")}. Set them in the hosting environment (Vercel project settings) and redeploy.`,
  });
  const credentials = getGraphCredentials();
  if (!credentials) return respond(false);

  let accessToken: string;
  try {
    accessToken = await getAccessToken(credentials);
    steps.push({
      step: "token",
      ok: true,
      detail: "client-credentials token acquired",
    });
  } catch (error) {
    steps.push({
      step: "token",
      ok: false,
      detail: describeGraphError(
        error,
        "Token request failed. AADSTS7000222 means the client secret has EXPIRED (create a new secret in the Azure app registration and update MS_CLIENT_SECRET). AADSTS700016 means the app was not found in this tenant (check MS_CLIENT_ID and MS_TENANT_ID). AADSTS7000215 means the secret value is wrong."
      ),
    });
    return respond(false);
  }

  const client = getGraphClient(accessToken);
  try {
    await client.api(`/users/${credentials.smtpUser}/calendar`).select("id").get();
    steps.push({
      step: "mailbox",
      ok: true,
      detail: `mailbox ${credentials.smtpUser} is reachable`,
    });
  } catch (error) {
    steps.push({
      step: "mailbox",
      ok: false,
      detail: describeGraphError(
        error,
        "Mailbox lookup failed. Status 403 means the application permission Calendars.ReadWrite is missing or lacks admin consent. Status 404 means SMTP_USER does not exist or the mailbox is unlicensed in this tenant."
      ),
    });
    return respond(false);
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    await client
      .api(`/users/${credentials.smtpUser}/calendarview`)
      .query({
        startDateTime: `${today}T00:00:00Z`,
        endDateTime: `${today}T23:59:59Z`,
        $top: "1",
      })
      .get();
    steps.push({
      step: "calendar",
      ok: true,
      detail: "calendar readable, Calendars.ReadWrite is consented",
    });
  } catch (error) {
    steps.push({
      step: "calendar",
      ok: false,
      detail: describeGraphError(
        error,
        "Calendar read failed. The app registration needs the APPLICATION permission Calendars.ReadWrite with admin consent (Mail.Send is needed for the confirmation and contact emails)."
      ),
    });
    return respond(false);
  }

  return respond(true);
}
