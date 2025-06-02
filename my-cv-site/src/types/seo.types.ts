export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
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
  type: 'WebPage' | 'Article' | 'Person' | 'Organization' | 'Service' | 'Product';
  data: Record<string, unknown>;
}

export interface SEOPageConfig {
  seo: SEOConfig;
  structuredData?: StructuredDataConfig[];
  breadcrumbs?: BreadcrumbItem[];
  canonicalUrl?: string;
  alternateLanguages?: Record<string, string>;
} 