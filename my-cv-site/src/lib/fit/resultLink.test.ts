import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  fitReopenState,
  fitResultPath,
  fitResultUrl,
  getFitLinkSecret,
  signSession,
  verifySession,
} from "./resultLink";

const SECRET = "a-long-random-signing-secret";
const SESSION = "session-id-value-1";

const originalEnvironment = { ...process.env };

beforeEach(() => {
  delete process.env.FIT_LINK_SECRET;
});

afterEach(() => {
  process.env = { ...originalEnvironment };
});

describe("getFitLinkSecret", () => {
  it("returns null until the secret is set", () => {
    expect(getFitLinkSecret()).toBeNull();
    process.env.FIT_LINK_SECRET = SECRET;
    expect(getFitLinkSecret()).toBe(SECRET);
  });
});

describe("signSession", () => {
  it("signs a session into base64url without padding", () => {
    const signature = signSession(SESSION, SECRET);
    expect(signature).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(signature).toBe(signSession(SESSION, SECRET));
  });

  it("gives a different signature per session and per secret", () => {
    expect(signSession(SESSION, SECRET)).not.toBe(signSession("another-session-id", SECRET));
    expect(signSession(SESSION, SECRET)).not.toBe(signSession(SESSION, "another-secret"));
  });
});

describe("verifySession", () => {
  it("accepts its own signature", () => {
    expect(verifySession(SESSION, signSession(SESSION, SECRET), SECRET)).toBe(true);
  });

  it("refuses a signature for another session, another secret or another length", () => {
    expect(verifySession(SESSION, signSession("other-session-id", SECRET), SECRET)).toBe(false);
    expect(verifySession(SESSION, signSession(SESSION, "other-secret"), SECRET)).toBe(false);
    expect(verifySession(SESSION, "short", SECRET)).toBe(false);
  });

  it("refuses an empty session, key or secret", () => {
    expect(verifySession("", signSession(SESSION, SECRET), SECRET)).toBe(false);
    expect(verifySession(SESSION, "", SECRET)).toBe(false);
    expect(verifySession(SESSION, signSession(SESSION, SECRET), "")).toBe(false);
  });
});

describe("fitResultPath and fitResultUrl", () => {
  it("builds the locale path with both parameters encoded", () => {
    expect(fitResultPath("nl", SESSION, "key+value")).toBe(
      "/nl/fit?result=session-id-value-1&key=key%2Bvalue"
    );
  });

  it("builds an absolute link for the mail", () => {
    expect(fitResultUrl("en", SESSION, "signature")).toBe(
      "https://www.hilmarvanderveen.com/en/fit?result=session-id-value-1&key=signature"
    );
  });
});

describe("fitReopenState", () => {
  it("is none when the page carries neither parameter", () => {
    expect(fitReopenState(undefined, undefined, SECRET)).toBe("none");
  });

  it("is valid for a signature this site made", () => {
    expect(fitReopenState(SESSION, signSession(SESSION, SECRET), SECRET)).toBe("valid");
  });

  it("is invalid for a wrong key, an unusable session or a missing secret", () => {
    expect(fitReopenState(SESSION, "wrong-key-value-here", SECRET)).toBe("invalid");
    expect(fitReopenState("short", signSession("short", SECRET), SECRET)).toBe("invalid");
    expect(fitReopenState(SESSION, 42, SECRET)).toBe("invalid");
    expect(fitReopenState(SESSION, signSession(SESSION, SECRET), null)).toBe("invalid");
  });
});
