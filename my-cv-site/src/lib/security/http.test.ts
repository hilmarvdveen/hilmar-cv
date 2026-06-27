import { describe, it, expect, afterEach, vi } from "vitest";
import { serverErrorResponse } from "./http";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("serverErrorResponse", () => {
  it("returns a generic 500 without details in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const res = serverErrorResponse(new Error("secret internals"), "Oops");
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Oops");
    expect(json.details).toBeUndefined();
    expect(JSON.stringify(json)).not.toContain("secret internals");
  });

  it("includes details in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const res = serverErrorResponse(new Error("debug me"), "Oops");
    const json = await res.json();
    expect(json.error).toBe("Oops");
    expect(json.details).toContain("debug me");
  });

  it("uses the default public message when none is given", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const res = serverErrorResponse("weird");
    const json = await res.json();
    expect(json.error).toBe("Internal Server Error");
  });
});
