import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '../i18n/routing';

// Create the base middleware from next-intl
const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // Generate a unique nonce for each request using crypto.randomUUID()
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // Get the response from next-intl middleware first
  const response = intlMiddleware(request);
  
  // Create a new response if intlMiddleware doesn't return one
  const nextResponse = response || NextResponse.next();
  
  // Single source of truth for the Content-Security-Policy (the duplicate in
  // next.config.ts has been removed). Nonce + 'strict-dynamic' is the strong
  // model: Next.js auto-applies this nonce to its framework and next/script
  // tags, and trusted scripts may then load GA/GTM. The explicit analytics
  // hosts are a fallback for browsers that ignore 'strict-dynamic'.
  // 'unsafe-inline'/'unsafe-eval' are intentionally NOT in script-src.
  // 'unsafe-inline' remains in style-src only (React's style prop / Tailwind
  // can emit inline styles; style nonces are impractical with the style prop).
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live https://vitals.vercel-analytics.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://www.google-analytics.com https://vitals.vercel-analytics.com https://vercel.live wss://vercel.live;
    frame-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  // This middleware (Next.js 16 "proxy") owns ONLY the dynamic, per-request
  // CSP — it is the single source of truth for Content-Security-Policy.
  // All other (static) security headers are set once in next.config.ts so they
  // also cover API and static-asset routes that this matcher excludes.
  const headers = new Headers(nextResponse.headers);

  // Expose the nonce so server components/route handlers can read it if needed.
  headers.set('x-nonce', nonce);

  // Content Security Policy with nonce - ENFORCEMENT mode (not report-only).
  headers.set('Content-Security-Policy', cspHeader);

  // Return response with updated headers
  return new NextResponse(nextResponse.body, {
    status: nextResponse.status,
    statusText: nextResponse.statusText,
    headers: headers,
  });
}

export const config = {
  // Match all pathnames except for static assets and API routes
  // Updated matcher to be more comprehensive and exclude prefetch requests
  matcher: [
    {
      source: '/((?!api|_next|_vercel|favicon|android-chrome|apple-touch-icon|images|assets|fonts|.*\\..*|manifest).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ]
};


