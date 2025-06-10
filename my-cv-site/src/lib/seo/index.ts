/**
 * Enterprise SEO System - Main Export
 * Comprehensive SEO solution for professional services
 * Implements Google 2024 best practices with E-E-A-T focus
 */

// Core engines and managers
export { SEOEngine } from './core/seo-engine';
export { MetadataGenerator } from './core/metadata-generator';
export { SchemaGenerator } from './core/schema-generator';
export { AnalyticsManager } from './core/analytics-manager';

// Constants and configuration
export * from './constants/meta-constants';

// Type definitions
export type * from './types/seo-types';

// Factory functions for common page types
import { SEOEngine } from './core/seo-engine';
import type { Locale, FAQItem } from './types/seo-types';

// Initialize default SEO engine
const defaultSEOEngine = new SEOEngine();

/**
 * Quick factory functions for generating SEO configurations
 */
export const SEOFactory = {
  /**
   * Generate homepage SEO
   */
  homepage: (locale: Locale) => defaultSEOEngine.createHomepageSEO(locale),

  /**
   * Generate about page SEO
   */
  about: (locale: Locale) => defaultSEOEngine.createAboutSEO(locale),

  /**
   * Generate services page SEO
   */
  services: (locale: Locale) => defaultSEOEngine.createServicesSEO(locale),

  /**
   * Generate projects page SEO
   */
  projects: (locale: Locale) => defaultSEOEngine.createProjectsSEO(locale),

  /**
   * Generate contact page SEO
   */
  contact: (locale: Locale) => defaultSEOEngine.createContactSEO(locale),

  /**
   * Generate FAQ page SEO
   */
  faq: (locale: Locale, faqItems: FAQItem[]) => defaultSEOEngine.createFAQSEO(locale, faqItems),

  /**
   * Generate booking page SEO
   */
  booking: (locale: Locale) => defaultSEOEngine.createBookingSEO(locale),

  /**
   * Generate blog page SEO
   */
  blog: (locale: Locale) => defaultSEOEngine.createBlogSEO(locale),

  /**
   * Generate privacy page SEO
   */
  privacy: (locale: Locale) => defaultSEOEngine.createPrivacySEO(locale),

  /**
   * Track page view
   */
  trackPageView: (pageType: any, locale: Locale, title: string, path: string) => // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultSEOEngine.trackPageView(pageType, locale, title, path),

  /**
   * Get analytics manager
   */
  getAnalytics: () => defaultSEOEngine.getAnalytics(),

  /**
   * Generate sitemap data
   */
  generateSitemapData: () => defaultSEOEngine.generateSitemapData()
};

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
  createMetaTags: (metadata: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const tags = [];

    // Basic meta tags
    if (metadata.title) tags.push({ name: 'title', content: metadata.title });
    if (metadata.description) tags.push({ name: 'description', content: metadata.description });
    if (metadata.keywords) tags.push({ name: 'keywords', content: metadata.keywords.join(', ') });

    // Open Graph tags
    if (metadata.openGraph) {
      Object.entries(metadata.openGraph).forEach(([key, value]) => {
        tags.push({ property: `og:${key}`, content: value });
      });
    }

    // Twitter tags
    if (metadata.twitter) {
      Object.entries(metadata.twitter).forEach(([key, value]) => {
        tags.push({ name: `twitter:${key}`, content: value });
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
   * Generate robots.txt content
   */
  generateRobotsTxt: () => {
    return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://hilmarvanderveen.com'}/sitemap.xml

# Block AI crawlers (optional)
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: ClaudeBot
Disallow: /

# Crawl delay for heavy crawlers
User-agent: *
Crawl-delay: 1`;
  }
};

/**
 * React hooks for SEO (if using React)
 */
export const useSEO = (pageType: any, locale: Locale, additionalParams?: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  // This would be implemented as a proper React hook in a React environment
  let seoConfig;
  
  try {
    const factoryMethod = SEOFactory[pageType as keyof typeof SEOFactory];
    if (typeof factoryMethod === 'function') {
      // Handle methods that need additional parameters
      if (pageType === 'faq' && additionalParams?.faqItems) {
        seoConfig = (factoryMethod as any)(locale, additionalParams.faqItems); // eslint-disable-line @typescript-eslint/no-explicit-any
      } else if (pageType !== 'trackPageView' && pageType !== 'getAnalytics' && pageType !== 'generateSitemapData') {
        seoConfig = (factoryMethod as any)(locale); // eslint-disable-line @typescript-eslint/no-explicit-any
      }
    }
  } catch (error) {
    console.warn(`Failed to generate SEO config for page type: ${pageType}`, error);
  }

  return {
    seo: seoConfig,
    trackPageView: (title: string, path: string) => 
      SEOFactory.trackPageView(pageType, locale, title, path)
  };
};

/**
 * Default export - SEO Engine instance
 */
export default defaultSEOEngine; 