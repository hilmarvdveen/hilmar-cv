import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  const response = intlMiddleware(request);
  
  const nextResponse = response || NextResponse.next();
  
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live https://vitals.vercel-analytics.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.g.doubleclick.net https://vitals.vercel-analytics.com https://vercel.live wss://vercel.live;
    frame-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  const headers = new Headers(nextResponse.headers);

  headers.set('x-nonce', nonce);

  headers.set('Content-Security-Policy', cspHeader);

  return new NextResponse(nextResponse.body, {
    status: nextResponse.status,
    statusText: nextResponse.statusText,
    headers: headers,
  });
}

export const config = {
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

