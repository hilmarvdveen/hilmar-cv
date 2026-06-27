import { NextRequest } from "next/server";

/**
 * Origins allowed to call the mutating API routes. Mirrors the
 * `experimental.serverActions.allowedOrigins` list in next.config.ts.
 * In development we also accept requests with no Origin header (curl, tests).
 */
const ALLOWED_HOSTS = new Set<string>([
  "hilmarvanderveen.com",
  "www.hilmarvanderveen.com",
  "localhost:3000",
  "localhost:3001",
]);

function hostFromUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).host;
  } catch {
    return null;
  }
}

/**
 * Verify that a state-changing request originates from a trusted origin.
 * Returns true when allowed. Rejects cross-site/`null`-origin requests,
 * which is the primary CSRF / abuse guard for these unauthenticated routes.
 */
export function isAllowedOrigin(request: NextRequest): boolean {
  const originHost = hostFromUrl(request.headers.get("origin"));
  const refererHost = hostFromUrl(request.headers.get("referer"));
  const candidate = originHost ?? refererHost;

  if (!candidate) {
    // No Origin/Referer at all: only tolerate this outside production
    // (e.g. server-to-server, curl during local dev, unit tests).
    return process.env.NODE_ENV !== "production";
  }

  return ALLOWED_HOSTS.has(candidate);
}
