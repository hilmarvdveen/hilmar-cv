import { describe, it, expect, afterEach, vi } from "vitest";
import { serverErrorResponse } from "./http";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("serverErrorResponse", () => {
  it("returns a generic 500 without details in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const response = serverErrorResponse(new Error("secret internals"), "Oops");
    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json.error).toBe("Oops");
    expect(json.details).toBeUndefined();
    expect(JSON.stringify(json)).not.toContain("secret internals");
  });

  it("includes details in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const response = serverErrorResponse(new Error("debug me"), "Oops");
    const json = await response.json();
    expect(json.error).toBe("Oops");
    expect(json.details).toContain("debug me");
  });

  it("uses the default public message when none is given", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const response = serverErrorResponse("weird");
    const json = await response.json();
    expect(json.error).toBe("Internal Server Error");
  });

  it("stringifies non-Error values for details in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const response = serverErrorResponse("just a string", "Oops");
    const json = await response.json();
    expect(json.details).toBe("just a string");
  });

  it("falls back to the message when an Error has no stack (dev)", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const error = new Error("no-stack message");
    error.stack = undefined;
    const response = serverErrorResponse(error, "Oops");
    const json = await response.json();
    expect(json.details).toBe("no-stack message");
  });
});
