export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'service';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface StructuredDataConfig {
  type: 'WebPage' | 'Article' | 'Person' | 'Organization' | 'Service' | 'Product' | 'WebSite' | 'ProfilePage' | 'ContactPage' | 'CollectionPage' | 'FAQPage' | 'ItemList' | 'Review' | 'AggregateRating' | 'LocalBusiness' | 'JobPosting' | 'Course' | 'Event' | 'BreadcrumbList';
  data: Record<string, unknown>;
}

export interface SEOPageConfig {
  seo: SEOConfig;
  structuredData?: StructuredDataConfig[];
  breadcrumbs?: BreadcrumbItem[];
  canonicalUrl?: string;
  alternateLanguages?: Record<string, string>;
}

// Enhanced SEO types for better type safety
export interface PersonSchema {
  '@context': string;
  '@type': 'Person';
  '@id': string;
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image: string | object;
  sameAs: string[];
  address: object;
  knowsAbout: string[];
  hasOccupation: object;
}

export interface OrganizationSchema {
  '@context': string;
  '@type': 'Organization' | string[];
  '@id': string;
  name: string;
  url: string;
  logo: object;
  description: string;
  foundingDate: string;
  address: object;
  contactPoint: object;
  sameAs: string[];
}

export interface ServiceSchema {
  '@context': string;
  '@type': 'Service' | 'ProfessionalService';
  '@id': string;
  name: string;
  description: string;
  provider: object;
  serviceType: string | string[];
  areaServed: object[];
  hasOfferCatalog: object;
}

export interface WebPageSchema {
  '@context': string;
  '@type': 'WebPage';
  '@id': string;
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  isPartOf: object;
  about: object;
}

export interface FAQSchema {
  '@context': string;
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}