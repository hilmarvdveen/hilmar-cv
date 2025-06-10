/**
 * Dynamic robots.txt Route
 * Generates robots.txt following Google 2024 best practices
 * Replaces static public/robots.txt with dynamic generation
 */

import { NextResponse } from 'next/server';
import { SEOUtils } from '@/lib/seo';

export function GET() {
  try {
    const robotsContent = SEOUtils.generateRobotsTxt();
    
    return new NextResponse(robotsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200', // 24h cache, 12h stale
      },
    });
  } catch (error) {
    console.error('Failed to generate robots.txt:', error);
    
    // Fallback robots.txt
    const fallbackRobots = `User-agent: *
Allow: /

Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://hilmarvanderveen.com'}/sitemap.xml`;

    return new NextResponse(fallbackRobots, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600', // 1h cache for fallback
      },
    });
  }
} 