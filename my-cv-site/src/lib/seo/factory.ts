
import { SEOEngine } from './core/seo-engine';
import type { Locale, FAQItem } from './types/seo-types';

const defaultSEOEngine = new SEOEngine();

export const SEOFactory = {
  homepage: (locale: Locale) => defaultSEOEngine.createHomepageSEO(locale),

  about: (locale: Locale) => defaultSEOEngine.createAboutSEO(locale),

  services: (locale: Locale) => defaultSEOEngine.createServicesSEO(locale),

  projects: (locale: Locale) => defaultSEOEngine.createProjectsSEO(locale),

  contact: (locale: Locale) => defaultSEOEngine.createContactSEO(locale),

  faq: (locale: Locale, faqItems: FAQItem[]) => defaultSEOEngine.createFAQSEO(locale, faqItems),

  booking: (locale: Locale) => defaultSEOEngine.createBookingSEO(locale),

  blog: (locale: Locale) => defaultSEOEngine.createBlogSEO(locale),

  blogPost: (
    locale: Locale,
    post: {
      slug: string;
      title: string;
      description: string;
      keywords: string[];
      category: string;
      publishedDate: string;
      updatedDate?: string;
    }
  ) => defaultSEOEngine.createBlogPostSEO(locale, post),

  privacy: (locale: Locale) => defaultSEOEngine.createPrivacySEO(locale),

  generateSitemapData: (
    dynamicPages?: Array<{
      path: string;
      lastModified?: string;
      changeFrequency?: string;
      priority?: number;
    }>
  ) => defaultSEOEngine.generateSitemapData(dynamicPages),

  frontendService: (locale: Locale) => defaultSEOEngine.createFrontendServiceSEO(locale),
  
  fullstackService: (locale: Locale) => defaultSEOEngine.createFullstackServiceSEO(locale),
  
  designSystemsService: (locale: Locale) => defaultSEOEngine.createDesignSystemsServiceSEO(locale),
  
  consultingService: (locale: Locale) => defaultSEOEngine.createConsultingServiceSEO(locale)
};

export default defaultSEOEngine; 