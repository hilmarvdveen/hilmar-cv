import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hilmarvanderveen.com';
  
  const crawlRules = `
Disallow: /api/*
Disallow: /_next/*
Disallow: /admin/*
Disallow: /dashboard/*

Allow: /en/
Allow: /nl/
Allow: /services/
Allow: /contact/
Allow: /faq/
Allow: /projects/
`;

  const robotsTxt = `
# Allow Googlebot
User-agent: Googlebot
${crawlRules}

# Allow Bingbot
User-agent: Bingbot
Crawl-delay: 10
${crawlRules}

# Allow DuckDuckBot
User-agent: DuckDuckBot
${crawlRules}

# Allow Applebot
User-agent: Applebot
${crawlRules}

# Block all other bots
User-agent: *
Disallow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 