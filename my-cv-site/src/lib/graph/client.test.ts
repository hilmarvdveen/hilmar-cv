import { describe, it, expect, vi, afterEach } from "vitest";
import { getAccessToken, getGraphCredentials } from "./client";

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
});

describe("getGraphCredentials", () => {
  it("returns null when any required env var is missing", () => {
    process.env.MS_CLIENT_ID = "id";
    process.env.MS_CLIENT_SECRET = "secret";
    process.env.MS_TENANT_ID = "tenant";
    // SMTP_USER intentionally unset
    expect(getGraphCredentials()).toBeNull();
  });

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
