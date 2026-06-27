import { describe, it, expect, vi, afterEach } from "vitest";
import { getAccessToken, getGraphCredentials, getGraphClient } from "./client";

const CREDS = { clientId: "id", clientSecret: "secret", tenantId: "tenant" };

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.MS_CLIENT_ID;
  delete process.env.MS_CLIENT_SECRET;
  delete process.env.MS_TENANT_ID;
  delete process.env.SMTP_USER;
});

describe("getAccessToken", () => {
  it("returns the access token on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ access_token: "abc123" }), { status: 200 }))
    );
    await expect(getAccessToken(CREDS)).resolves.toBe("abc123");
  });

  it("throws with the Graph error description on failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ error_description: "bad secret" }), { status: 401 })
      )
    );
    await expect(getAccessToken(CREDS)).rejects.toThrow("bad secret");
  });

  it("throws a generic message when the failure has no description", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({}), { status: 500 }))
    );
    await expect(getAccessToken(CREDS)).rejects.toThrow("Failed to get Microsoft Graph token");
  });
});

describe("getGraphClient", () => {
  it("returns an initialized Graph client", () => {
    const client = getGraphClient("token-123");
    expect(client).toBeTruthy();
    expect(typeof client.api).toBe("function");
  });
});

describe("getGraphCredentials", () => {
  it.each(["MS_CLIENT_ID", "MS_CLIENT_SECRET", "MS_TENANT_ID", "SMTP_USER"])(
    "returns null when %s is the missing var",
    (missing) => {
      const all: Record<string, string> = {
        MS_CLIENT_ID: "id",
        MS_CLIENT_SECRET: "secret",
        MS_TENANT_ID: "tenant",
        SMTP_USER: "hilmar@example.com",
      };
      for (const [k, v] of Object.entries(all)) {
        if (k !== missing) process.env[k] = v;
      }
      expect(getGraphCredentials()).toBeNull();
    }
  );

  it("returns the credentials when all env vars are present", () => {
    process.env.MS_CLIENT_ID = "id";
    process.env.MS_CLIENT_SECRET = "secret";
    process.env.MS_TENANT_ID = "tenant";
    process.env.SMTP_USER = "hilmar@example.com";
    expect(getGraphCredentials()).toEqual({
      clientId: "id",
      clientSecret: "secret",
      tenantId: "tenant",
      smtpUser: "hilmar@example.com",
    });
  });
});
