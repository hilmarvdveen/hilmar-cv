/**
 * Dynamic Robots.txt Generator
 * Implements comprehensive robots.txt with AI crawler blocking
 * Following Google 2024 best practices for SEO
 */

import { SEOUtils } from '@/lib/seo';

export async function GET() {
  const robotsTxt = SEOUtils.generateRobotsTxt();

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  });
} 