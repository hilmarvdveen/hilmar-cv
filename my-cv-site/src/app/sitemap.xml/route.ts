import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hilmarvanderveen.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const locales = ['en', 'nl'];
  
  // Define all your actual routes
  const routes = [
    { path: '', priority: 1.0, changefreq: 'daily' },
    { path: '/about', priority: 0.8, changefreq: 'monthly' },
    { path: '/contact', priority: 0.9, changefreq: 'monthly' },
    { path: '/faq', priority: 0.8, changefreq: 'monthly' },
    { path: '/services', priority: 0.9, changefreq: 'monthly' },
    { path: '/services/frontend', priority: 0.8, changefreq: 'monthly' },
    { path: '/services/fullstack', priority: 0.8, changefreq: 'monthly' },
    { path: '/services/design-systems', priority: 0.8, changefreq: 'monthly' },
    { path: '/services/consulting', priority: 0.8, changefreq: 'monthly' },
    { path: '/projects', priority: 0.7, changefreq: 'monthly' },
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  // Add root URL (no locale prefix)
  sitemap += `
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>1.0</priority>
    <changefreq>daily</changefreq>
    <xhtml:link rel="alternate" hreflang="nl" href="${baseUrl}/nl" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}" />
  </url>`;

  // Add localized URLs
  for (const locale of locales) {
    for (const route of routes) {
      const url = `${baseUrl}/${locale}${route.path}`;
      
      sitemap += `
  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>${route.priority}</priority>
    <changefreq>${route.changefreq}</changefreq>`;
      
      // Add alternate language links
      for (const altLocale of locales) {
        const altUrl = `${baseUrl}/${altLocale}${route.path}`;
        sitemap += `
    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${altUrl}" />`;
      }
      
      // Add x-default link to main locale (nl)
      sitemap += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/nl${route.path}" />`;
      
      sitemap += `
  </url>`;
    }
  }

  sitemap += `
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 