import { Client } from "@microsoft/microsoft-graph-client";

export type GraphCredentials = {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  smtpUser: string;
}

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

export async function getAccessToken({
  clientId,
  clientSecret,
  tenantId,
}: Pick<GraphCredentials, "clientId" | "clientSecret" | "tenantId">): Promise<string> {
  const response = await fetch(
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

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || "Failed to get Microsoft Graph token");
  }
  return data.access_token as string;
}

export function getGraphClient(accessToken: string): Client {
  return Client.init({
    /* v8 ignore next */
    authProvider: (done) => done(null, accessToken),
  });
}
