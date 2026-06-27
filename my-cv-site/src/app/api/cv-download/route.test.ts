import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const sendMail = vi.fn();
const getGraphCredentials = vi.fn();
vi.mock("@/lib/graph", () => ({
  getGraphCredentials: () => getGraphCredentials(),
  getAccessToken: vi.fn(async () => "token"),
  getGraphClient: vi.fn(() => ({})),
  sendMail: (...args: unknown[]) => sendMail(...args),
}));

import { POST } from "./route";

const CREDS = {
  clientId: "id",
  clientSecret: "secret",
  tenantId: "tenant",
  smtpUser: "hilmar@hilmarvanderveen.com",
};

function post(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("https://hilmarvanderveen.com/api/cv-download", {
    method: "POST",
    headers: {
      origin: "https://hilmarvanderveen.com",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

const valid = () => ({
  name: "Jane",
  email: "jane@example.com",
  purpose: "recruitment",
  locale: "en",
  timestamp: new Date().toISOString(),
  formStartedAt: Date.now() - 10000,
});

beforeEach(() => {
  sendMail.mockReset().mockResolvedValue(undefined);
  getGraphCredentials.mockReset().mockReturnValue(CREDS);
});

describe("POST /api/cv-download", () => {
  it("rejects cross-origin with 403", async () => {
    const res = await POST(post(valid(), { origin: "https://evil.example.com" }));
    expect(res.status).toBe(403);
  });

  it("returns 400 on missing fields", async () => {
    const res = await POST(post({ ...valid(), purpose: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 on invalid email", async () => {
    const res = await POST(post({ ...valid(), email: "bad" }));
    expect(res.status).toBe(400);
  });

  it("silently succeeds on honeypot without sending mail", async () => {
    const res = await POST(post({ ...valid(), company_website: "bot" }));
    expect(res.status).toBe(200);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("returns 500 config error when credentials are missing", async () => {
    getGraphCredentials.mockReturnValue(null);
    const res = await POST(post(valid()));
    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({ error: "Server configuration error" });
  });

  it("sends owner + thank-you mail on happy path", async () => {
    const res = await POST(post(valid()));
    expect(res.status).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(2);
  });

  it("maps the purpose to the requested locale (NL)", async () => {
    await POST(post({ ...valid(), locale: "nl", purpose: "recruitment" }));
    const ownerMail = sendMail.mock.calls.find((c) => c[2]?.isHtml !== true);
    expect(ownerMail![2].body).toContain("Werving/Vacature");
  });

  it("escapes the user name in the HTML thank-you email", async () => {
    await POST(post({ ...valid(), name: "<script>evil</script>" }));
    const htmlMail = sendMail.mock.calls.find((c) => c[2]?.isHtml === true);
    expect(htmlMail![2].body).toContain("&lt;script&gt;");
    expect(htmlMail![2].body).not.toContain("<script>evil");
  });

  it("does not leak internal error details on Graph failure", async () => {
    sendMail.mockRejectedValueOnce(new Error("graph secret"));
    const res = await POST(post(valid()));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Failed to track CV download");
    expect(JSON.stringify(json)).not.toContain("graph secret");
  });
});
