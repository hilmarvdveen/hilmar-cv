import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hilmarvanderveen.com';
  
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Block unnecessary crawling
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /dashboard/

# Allow specific important paths
Allow: /en/
Allow: /nl/
Allow: /services/
Allow: /contact/
Allow: /faq/
Allow: /projects/`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 