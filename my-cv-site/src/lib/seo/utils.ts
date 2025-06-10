/**
 * SEO Utility Functions
 * Helper functions for SEO components and validation
 */

import type { Metadata } from 'next';
import { BUSINESS_PROFILE } from './constants/meta-constants';

/**
 * Utility functions for SEO components
 */
export const SEOUtils = {
  /**
   * Generate JSON-LD script tag content
   */
  generateJSONLD: (schemas: any[]) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    return schemas.map(schema => JSON.stringify(schema, null, 2)).join('\n\n');
  },

  /**
   * Create meta tags array for manual implementation
   */
  createMetaTags: (metadata: Metadata) => {
    const tags = [];

    // Basic meta tags
    if (metadata.title) tags.push({ name: 'title', content: metadata.title });
    if (metadata.description) tags.push({ name: 'description', content: metadata.description });
    if (metadata.keywords) tags.push({ name: 'keywords', content: Array.isArray(metadata.keywords) ? metadata.keywords.join(', ') : metadata.keywords });

    // Open Graph tags
    if (metadata.openGraph) {
      Object.entries(metadata.openGraph).forEach(([key, value]) => {
        if (value) tags.push({ property: `og:${key}`, content: value });
      });
    }

    // Twitter tags
    if (metadata.twitter) {
      Object.entries(metadata.twitter).forEach(([key, value]) => {
        if (value) tags.push({ name: `twitter:${key}`, content: value });
      });
    }

    return tags;
  },

  /**
   * Validate URL structure for SEO
   */
  validateURL: (url: string) => {
    const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return urlPattern.test(url);
  },

  /**
   * Generate robots.txt content following Google 2024 best practices
   */
  generateRobotsTxt: () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || BUSINESS_PROFILE.CONTACT.WEBSITE;
    
    return `# Robots.txt for Professional Frontend Developer Portfolio
# Generated following Google 2024 SEO Best Practices
# Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}

# =============================================================================
# GENERAL CRAWLING RULES
# =============================================================================

# Allow all legitimate search engines to crawl the entire site
User-agent: *
Allow: /

# Block unnecessary pages from being crawled
Disallow: /api/
Disallow: /*?*          # Block URL parameters (search, filters, etc.)
Disallow: /*&*          # Block multiple parameters
Disallow: /?s=*         # Block internal search results
Disallow: /?search=*    # Block search parameter variations
Disallow: /*sort=*      # Block sorting parameters
Disallow: /*filter=*    # Block filter parameters

# Allow important assets and content
Allow: /images/
Allow: /videos/
Allow: /_next/static/   # Next.js static assets
Allow: /favicon.ico
Allow: /sitemap.xml
Allow: /sitemap_index.xml

# =============================================================================
# AI CRAWLER BLOCKING (2024 Standard Practice)
# =============================================================================

# Block OpenAI GPT crawlers
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

# Block Claude (Anthropic) crawlers
User-agent: Claude-Web
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

# Block Google's generative AI training (separate from search)
User-agent: Google-Extended
Disallow: /

# Block other AI training bots
User-agent: Bytespider
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Diffbot
Disallow: /

# Block common scrapers and content harvesters
User-agent: CCBot
Disallow: /

User-agent: Scrapy
Disallow: /

User-agent: magpie-crawler
Disallow: /

User-agent: omgili
Disallow: /

User-agent: omgilibot
Disallow: /

User-agent: Node/simplecrawler
Disallow: /

# =============================================================================
# SEARCH ENGINE SPECIFIC RULES
# =============================================================================

# Allow Google to crawl everything for search indexing
User-agent: Googlebot
Allow: /

# Allow Bing to crawl everything
User-agent: Bingbot
Allow: /

# Allow other major search engines
User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: YandexBot
Allow: /

# =============================================================================
# SITEMAP LOCATIONS
# =============================================================================

# Main sitemap locations (Next.js with app router)
Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/sitemap-0.xml

# Language-specific sitemaps (if generated)
Sitemap: ${siteUrl}/en/sitemap.xml
Sitemap: ${siteUrl}/nl/sitemap.xml

# =============================================================================
# ADDITIONAL BEST PRACTICES
# =============================================================================

# Crawl delay for heavy bots (not supported by Google but used by others)
User-agent: *
Crawl-delay: 1

# Note: This robots.txt follows Google 2024 best practices including:
# - AI crawler blocking to prevent unauthorized content training
# - Parameter blocking to prevent infinite crawl loops
# - Sitemap declarations for better indexing
# - Support for multilingual content structure
# - Focus on crawl budget optimization for professional services website`;
  }
}; 