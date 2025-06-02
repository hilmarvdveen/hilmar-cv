import { Metadata } from 'next';
import { SEOConfig, BreadcrumbItem, StructuredDataConfig } from '@/types/seo.types';
import { siteConfig, generatePageSEO } from '@/lib/seo.config';

interface UseSEOOptions {
  locale: string;
  seo?: Partial<SEOConfig>;
  breadcrumbs?: BreadcrumbItem[];
  structuredData?: StructuredDataConfig[];
}

export const useSEO = ({ locale, seo = {}, breadcrumbs, structuredData }: UseSEOOptions) => {
  const baseUrl = siteConfig.url;
  const currentUrl = seo.url || `${baseUrl}/${locale}`;
  
  // Generate complete SEO config
  const seoConfig = generatePageSEO({
    ...seo,
    url: currentUrl,
  });

  // Generate Next.js Metadata
  const generateMetadata = (): Metadata => {
    const alternateLanguages: Record<string, string> = {
      'en': currentUrl.replace(`/${locale}`, '/en'),
      'nl': currentUrl.replace(`/${locale}`, '/nl'),
      'x-default': currentUrl.replace(`/${locale}`, '/nl'),
    };

    return {
      metadataBase: new URL(baseUrl),
      title: {
        template: `%s | ${siteConfig.name} - ${siteConfig.title}`,
        default: seoConfig.title || siteConfig.name,
      },
      description: seoConfig.description,
      keywords: seoConfig.keywords,
      authors: [{ name: siteConfig.author.name }],
      creator: siteConfig.author.name,
      publisher: siteConfig.author.name,
      robots: {
        index: !seoConfig.noIndex,
        follow: !seoConfig.noFollow,
        googleBot: {
          index: !seoConfig.noIndex,
          follow: !seoConfig.noFollow,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        type: seoConfig.type || 'website',
        locale: locale === 'nl' ? 'nl_NL' : 'en_US',
        alternateLocale: locale === 'nl' ? 'en_US' : 'nl_NL',
        url: currentUrl,
        siteName: siteConfig.name,
        title: seoConfig.title,
        description: seoConfig.description,
        images: seoConfig.image ? [
          {
            url: seoConfig.image,
            width: 1200,
            height: 630,
            alt: seoConfig.title || siteConfig.name,
            type: 'image/jpeg',
          }
        ] : [],
        ...(seoConfig.type === 'article' && {
          publishedTime: seoConfig.publishedTime,
          modifiedTime: seoConfig.modifiedTime,
          authors: [siteConfig.author.name],
          section: seoConfig.section,
          tags: seoConfig.tags,
        }),
      },
      twitter: {
        card: 'summary_large_image',
        title: seoConfig.title,
        description: seoConfig.description,
        images: seoConfig.image ? [seoConfig.image] : [],
        creator: siteConfig.author.twitter,
        site: siteConfig.author.twitter,
      },
      alternates: {
        canonical: currentUrl,
        languages: alternateLanguages,
      },
      other: {
        'article:author': siteConfig.author.name,
        'article:publisher': baseUrl,
      },
    };
  };

  // Generate structured data
  const generateStructuredData = () => {
    const schemas: Record<string, unknown>[] = [];

    // Default WebPage schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${currentUrl}#webpage`,
      "name": seoConfig.title,
      "description": seoConfig.description,
      "url": currentUrl,
      "inLanguage": locale === 'nl' ? 'nl-NL' : 'en-US',
      "isPartOf": {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        "name": siteConfig.name,
        "url": baseUrl,
      },
      "about": {
        "@type": "Person",
        "@id": `${baseUrl}/#person`,
        "name": siteConfig.author.name,
      },
    });

    // Breadcrumbs schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url,
        })),
      });
    }

    // Custom structured data
    if (structuredData) {
      structuredData.forEach(schema => {
        schemas.push({
          "@context": "https://schema.org",
          "@type": schema.type,
          ...schema.data,
        });
      });
    }

    return schemas;
  };

  // Analytics event helper
  const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        page_title: seoConfig.title,
        page_location: currentUrl,
        ...parameters,
      });
    }
  };

  return {
    seoConfig,
    metadata: generateMetadata(),
    structuredData: generateStructuredData(),
    trackEvent,
    currentUrl,
  };
}; 