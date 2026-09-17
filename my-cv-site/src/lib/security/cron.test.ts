import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { isAuthorizedCron } from "./cron";

const originalEnvironment = { ...process.env };

const request = (headers: Record<string, string> = {}) =>
  new NextRequest("https://www.hilmarvanderveen.com/api/fit/leads-digest", {
    method: "GET",
    headers,
  });

afterEach(() => {
  process.env = { ...originalEnvironment };
});

describe("isAuthorizedCron", () => {
  it("refuses every request when the secret is not set", () => {
    delete process.env.CRON_SECRET;
    expect(isAuthorizedCron(request({ authorization: "Bearer anything" }))).toBe(false);
  });

  it("accepts the bearer that matches the secret", () => {
    process.env.CRON_SECRET = "a-long-cron-secret";
    expect(isAuthorizedCron(request({ authorization: "Bearer a-long-cron-secret" }))).toBe(true);
  });

  it("refuses a wrong bearer, another scheme and a missing header", () => {
    process.env.CRON_SECRET = "a-long-cron-secret";
    expect(isAuthorizedCron(request({ authorization: "Bearer another-secret" }))).toBe(false);
    expect(isAuthorizedCron(request({ authorization: "Bearer short" }))).toBe(false);
    expect(isAuthorizedCron(request({ authorization: "Basic a-long-cron-secret" }))).toBe(false);
    expect(isAuthorizedCron(request())).toBe(false);
  });
});
