/**
 * SEO React Hooks
 * React hooks for SEO integration
 */

import { SEOFactory } from '../factory';
import type { Locale, FAQItem } from '../types/seo-types';

// Define the factory method keys that actually exist
type FactoryPageType = keyof typeof SEOFactory;

/**
 * React hook for SEO configuration
 */
export const useSEO = (
  pageType: string, 
  locale: Locale, 
  additionalParams?: { faqItems?: FAQItem[] }
) => {
  let seoConfig;
  
  try {
    // Map page types to available factory methods
    const mappedPageType = pageType === 'blog-post' ? 'blog' : pageType;
    
    if (mappedPageType in SEOFactory) {
      const factoryMethod = SEOFactory[mappedPageType as FactoryPageType];
      
      if (typeof factoryMethod === 'function') {
        // Handle methods that need additional parameters
        if (mappedPageType === 'faq' && additionalParams?.faqItems) {
          // @ts-expect-error - We know this is the FAQ method that needs faqItems
          seoConfig = factoryMethod(locale, additionalParams.faqItems);
        } else if (!['trackPageView', 'getAnalytics', 'generateSitemapData'].includes(mappedPageType)) {
          // @ts-expect-error - We know these are methods that only need locale
          seoConfig = factoryMethod(locale);
        }
      }
    }
  } catch (error) {
    console.warn(`Failed to generate SEO config for page type: ${pageType}`, error);
  }

  return {
    seo: seoConfig,
    trackPageView: (title: string, path: string) => 
      SEOFactory.trackPageView(pageType as any, locale, title, path) // eslint-disable-line @typescript-eslint/no-explicit-any
  };
}; 