import { Metadata } from 'next';
import { SEOPageConfig } from '@/types/seo.types';
import { siteConfig, generatePageSEO } from '@/lib/seo.config';

export function generateSEOMetadata(locale: string, config: SEOPageConfig): Metadata {
  const baseUrl = siteConfig.url;
  const currentUrl = config.seo.url || `${baseUrl}/${locale}`;
  
  const seoConfig = generatePageSEO({
    ...config.seo,
    url: currentUrl,
  });

  const alternateLanguages: Record<string, string> = {
    'en': currentUrl.replace(`/${locale}`, '/en'),
    'nl': currentUrl.replace(`/${locale}`, '/nl'),
    'x-default': currentUrl.replace(`/${locale}`, '/nl'),
  };

  return {
    metadataBase: new URL(baseUrl),
    title: seoConfig.title,
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
}

export function generateStructuredData(config: SEOPageConfig, locale: string, currentUrl: string) {
  const schemas: Record<string, unknown>[] = [];

  // Default WebPage schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${currentUrl}#webpage`,
    "name": config.seo.title,
    "description": config.seo.description,
    "url": currentUrl,
    "inLanguage": locale === 'nl' ? 'nl-NL' : 'en-US',
    "isPartOf": {
      "@type": "WebSite",
      "@id": `${siteConfig.url}#website`,
      "name": siteConfig.name,
      "url": siteConfig.url,
    },
    "about": {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      "name": siteConfig.author.name,
    },
  });

  // Breadcrumbs schema
  if (config.breadcrumbs && config.breadcrumbs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": config.breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url,
      })),
    });
  }

  // Custom structured data
  if (config.structuredData) {
    config.structuredData.forEach(schema => {
      schemas.push({
        "@context": "https://schema.org",
        "@type": schema.type,
        ...schema.data,
      });
    });
  }

  return schemas;
} 