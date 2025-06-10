import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '../i18n/routing';

// Create the base middleware from next-intl
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Generate a unique nonce for each request using crypto.randomUUID()
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // Get the response from next-intl middleware first
  const response = intlMiddleware(request);
  
  // Create a new response if intlMiddleware doesn't return one
  const nextResponse = response || NextResponse.next();
  
  // Enhanced CSP following 2024 best practices with strict-dynamic and nonce
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live https://vitals.vercel-analytics.com;
    style-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https: w3.org;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://www.google-analytics.com https://vitals.vercel-analytics.com https://vercel.live wss://vercel.live;
    frame-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    block-all-mixed-content;
  `.replace(/\s{2,}/g, ' ').trim();

  // Security headers following 2024 best practices
  const headers = new Headers(nextResponse.headers);
  
  // Add nonce header for components to access
  headers.set('x-nonce', nonce);
  
  // Content Security Policy with nonce - ENFORCEMENT mode (not report-only)
  headers.set('Content-Security-Policy', cspHeader);
  
  // HSTS with 2 years max-age (recommended), includeSubDomains, and preload
  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  
  // Cross-Origin-Opener-Policy for popup isolation (COOP)
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  
  // Additional security headers following OWASP guidelines
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-DNS-Prefetch-Control', 'on');
  
  // Permissions Policy to restrict dangerous features
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), accelerometer=(), gyroscope=(), magnetometer=(), payment=(), usb=()');
  
  // Cross-Origin Embedder Policy for additional isolation
  headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  
  // Cross-Origin Resource Policy 
  headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  
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