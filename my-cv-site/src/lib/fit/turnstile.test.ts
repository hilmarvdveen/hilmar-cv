import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  TURNSTILE_VERIFY_URL,
  getTurnstileConfiguration,
  getTurnstileSiteKey,
  verifyTurnstileToken,
} from "./turnstile";

const originalEnvironment = { ...process.env };

beforeEach(() => {
  vi.restoreAllMocks();
  delete process.env.TURNSTILE_SECRET_KEY;
  delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
});

afterEach(() => {
  process.env = { ...originalEnvironment };
});

describe("getTurnstileSiteKey", () => {
  it("is null until the public key is set", () => {
    expect(getTurnstileSiteKey()).toBeNull();
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "site-key";
    expect(getTurnstileSiteKey()).toBe("site-key");
  });
});

describe("getTurnstileConfiguration", () => {
  it("needs both keys", () => {
    expect(getTurnstileConfiguration()).toBeNull();
    process.env.TURNSTILE_SECRET_KEY = "secret-key";
    expect(getTurnstileConfiguration()).toBeNull();
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "site-key";
    expect(getTurnstileConfiguration()).toEqual({ secretKey: "secret-key" });
  });
});

describe("verifyTurnstileToken", () => {
  const configuration = { secretKey: "secret-key" };

  it("refuses a missing or blank token without asking Cloudflare", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(
      await verifyTurnstileToken(configuration, { token: undefined, clientAddress: "1.2.3.4" })
    ).toBe(false);
    expect(
      await verifyTurnstileToken(configuration, { token: "  ", clientAddress: "1.2.3.4" })
    ).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the secret, the token and the address and accepts a success", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal("fetch", fetchMock);

    expect(
      await verifyTurnstileToken(configuration, { token: " token ", clientAddress: "1.2.3.4" })
    ).toBe(true);

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(TURNSTILE_VERIFY_URL);
    const sent = new URLSearchParams(String(options.body));
    expect(sent.get("secret")).toBe("secret-key");
    expect(sent.get("response")).toBe("token");
    expect(sent.get("remoteip")).toBe("1.2.3.4");
  });

  it("refuses a failed verification, a refused request and a thrown request", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: false }) })
    );
    expect(
      await verifyTurnstileToken(configuration, { token: "token", clientAddress: "1.2.3.4" })
    ).toBe(false);

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }));
    expect(
      await verifyTurnstileToken(configuration, { token: "token", clientAddress: "1.2.3.4" })
    ).toBe(false);

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    expect(
      await verifyTurnstileToken(configuration, { token: "token", clientAddress: "1.2.3.4" })
    ).toBe(false);
  });
});
