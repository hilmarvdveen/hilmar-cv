/**
 * SEO Factory Functions
 * Quick factory functions for generating SEO configurations
 * Provides simple interface for common page types
 */

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
  generateSitemapData: () => defaultSEOEngine.generateSitemapData(),

  /**
   * Service subpage SEO generators
   */
  frontendService: (locale: Locale) => defaultSEOEngine.createFrontendServiceSEO(locale),
  
  fullstackService: (locale: Locale) => defaultSEOEngine.createFullstackServiceSEO(locale),
  
  designSystemsService: (locale: Locale) => defaultSEOEngine.createDesignSystemsServiceSEO(locale),
  
  consultingService: (locale: Locale) => defaultSEOEngine.createConsultingServiceSEO(locale)
};

/**
 * Default export - SEO Engine instance for advanced usage
 */
export default defaultSEOEngine; 