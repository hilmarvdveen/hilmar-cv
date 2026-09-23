
import { SEOFactory } from '@/lib/seo';
import { BLOG_POSTS } from '@/features/blog';
import { workHistory } from '@/data/workHistory';
import { REGIONS, REGION_PATH } from '@/data/regions';

export async function GET() {
  const experienceDetailPages = workHistory.map((entry) => ({
    path: `experience/${entry.id}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blogPostPages = BLOG_POSTS.map((post) => ({
    path: `blog/${post.slug}`,
    lastModified: new Date(`${post.updatedDate ?? post.publishedDate}T00:00:00`).toISOString(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const experiencePage = {
    path: 'experience',
    changeFrequency: 'monthly',
    priority: 0.8,
  };

  const regionPages = [
    { path: REGION_PATH, changeFrequency: 'monthly', priority: 0.8 },
    ...REGIONS.map((region) => ({
      path: `${REGION_PATH}/${region.id}`,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
  ];

  const sitemapData = SEOFactory.generateSitemapData([
    experiencePage,
    ...regionPages,
    ...experienceDetailPages,
    ...blogPostPages,
  ]);

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