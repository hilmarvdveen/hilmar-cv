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

      // Every SEOFactory entry is a function, so the non-function branch is
      // defensive and unreachable.
      /* v8 ignore next */
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
    /* v8 ignore start -- defensive guard; factory methods don't throw for valid page types */
  } catch (error) {
    console.warn(`Failed to generate SEO config for page type: ${pageType}`, error);
  }
  /* v8 ignore stop */

  return {
    seo: seoConfig,
    trackPageView: (title: string, path: string) => 
      SEOFactory.trackPageView(pageType as any, locale, title, path) // eslint-disable-line @typescript-eslint/no-explicit-any
  };
}; 