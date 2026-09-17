import { NextRequest, NextResponse } from "next/server";
import { getGraphCredentials, getAccessToken, getGraphClient, sendMail } from "@/lib/graph";
import {
  enforceRateLimit,
  getClientIp,
  isAuthorizedCron,
  serverErrorResponse,
} from "@/lib/security";
import { renderFitLeadsDigestEmail } from "@/lib/email";
import {
  digestSinceDate,
  getFitAgentConfiguration,
  getFitLeadsToken,
  requestRecentLeads,
} from "@/lib/fit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const limited = enforceRateLimit(request, "read");
  if (limited) return limited;

  try {
    const credentials = getGraphCredentials();
    const configuration = getFitAgentConfiguration();
    const leadsToken = getFitLeadsToken();
    if (!credentials || !configuration || !leadsToken) {
      console.error("Missing required environment variables for the fit leads digest");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const since = digestSinceDate(new Date());
    const leads = await requestRecentLeads(configuration, {
      since,
      clientAddress: getClientIp(request),
      leadsToken,
    });

    if (leads.length === 0) {
      return NextResponse.json({ sent: false, count: 0 });
    }

    const accessToken = await getAccessToken(credentials);
    const client = getGraphClient(accessToken);
    const { smtpUser } = credentials;
    const digest = renderFitLeadsDigestEmail({ since, leads });

    await sendMail(client, smtpUser, {
      to: smtpUser,
      toName: "Hilmar van der Veen",
      subject: digest.subject,
      body: digest.html,
      isHtml: true,
    });

    return NextResponse.json({ sent: true, count: leads.length });
  } catch (error: unknown) {
    console.error("The fit leads digest failed");
    return serverErrorResponse(error);
  }
}
