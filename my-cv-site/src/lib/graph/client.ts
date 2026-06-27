import { Client } from "@microsoft/microsoft-graph-client";

export type GraphCredentials = {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  smtpUser: string;
}

/**
 * Read and validate the Microsoft Graph credentials from the environment.
 * Returns null when any are missing so callers can respond with a generic
 * "Server configuration error" without leaking which var is absent.
 */
export function getGraphCredentials(): GraphCredentials | null {
  const clientId = process.env.MS_CLIENT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;
  const tenantId = process.env.MS_TENANT_ID;
  const smtpUser = process.env.SMTP_USER;

  if (!clientId || !clientSecret || !tenantId || !smtpUser) {
    return null;
  }
  return { clientId, clientSecret, tenantId, smtpUser };
}

/**
 * Acquire an application (client-credentials) access token for Microsoft Graph.
 */
export async function getAccessToken({
  clientId,
  clientSecret,
  tenantId,
}: Pick<GraphCredentials, "clientId" | "clientSecret" | "tenantId">): Promise<string> {
  const res = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default",
      }),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || "Failed to get Microsoft Graph token");
  }
  return data.access_token as string;
}

/** Build a Graph client bound to a previously-acquired access token. */
export function getGraphClient(accessToken: string): Client {
  return Client.init({
    authProvider: (done) => done(null, accessToken),
  });
}
