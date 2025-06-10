/**
 * Dynamic Sitemap Generator
 * Implements Google 2024 best practices for multilingual sitemaps
 * Includes proper hreflang implementation and all page types
 */

import { SEOFactory } from '@/lib/seo';

export async function GET() {
  const sitemapData = SEOFactory.generateSitemapData();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapData
  .map(
    (url) => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
${url.alternates
  .map(
    (alternate) =>
      `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.href}" />`
  )
  .join('\n')}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
} 