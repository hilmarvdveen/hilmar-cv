import { NextRequest } from "next/server";

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

export function isAllowedOrigin(request: NextRequest): boolean {
  const originHost = hostFromUrl(request.headers.get("origin"));
  const refererHost = hostFromUrl(request.headers.get("referer"));
  const candidate = originHost ?? refererHost;

  if (!candidate) {
    return process.env.NODE_ENV !== "production";
  }

  return ALLOWED_HOSTS.has(candidate);
}
