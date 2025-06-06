import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hilmarvanderveen.com';
  
  const robotsTxt = `# robots.txt for ${baseUrl}
User-agent: *
Allow: /

# Specific bot rules
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 2

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Applebot
Allow: /
Crawl-delay: 1

# Disallow sensitive directories
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /.well-known/

# Allow important pages
Allow: /en/
Allow: /nl/
Allow: /services/
Allow: /contact/
Allow: /faq/
Allow: /projects/
Allow: /book/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Host preference (optional)
Host: ${baseUrl}
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
} 