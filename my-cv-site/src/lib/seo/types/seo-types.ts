/**
 * Enterprise SEO TypeScript Definitions
 * Type-safe interfaces for comprehensive SEO system
 * Supports all Google 2024 best practices and E-E-A-T requirements
 */

// =============================================================================
// CORE TYPES
// =============================================================================

export type Locale = 'nl' | 'en';

export type PageType = 
  | 'homepage' 
  | 'about' 
  | 'services' 
  | 'projects' 
  | 'contact' 
  | 'faq' 
  | 'blog' 
  | 'blog-post'
  | 'privacy'
  | 'booking';

export type SchemaType = 
  | 'Person'
  | 'Organization' 
  | 'ProfessionalService'
  | 'WebSite'
  | 'WebPage'
  | 'Article'
  | 'BlogPosting'
  | 'FAQPage'
  | 'ContactPage'
  | 'AboutPage'
  | 'Service'
  | 'Offer'
  | 'BreadcrumbList'
  | 'LocalBusiness'
  | 'Review'
  | 'AggregateRating'
  | 'CollectionPage'
  | 'Blog';

// =============================================================================
// METADATA INTERFACES
// =============================================================================

export type BaseMetadata = {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  locale: Locale;
  noIndex?: boolean;
  noFollow?: boolean;
  noArchive?: boolean;
  noSnippet?: boolean;
  noTranslate?: boolean;
  noImageIndex?: boolean;
}

export type OpenGraphMetadata = {
  title: string;
  description: string;
  type: 'website' | 'article' | 'profile';
  url: string;
  siteName: string;
  locale: string;
  alternateLocale: string[];
}

export type TwitterMetadata = {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  title: string;
  description: string;
  site?: string;
  creator?: string;
}

export type ExtendedMetadata = BaseMetadata & {
  openGraph: OpenGraphMetadata;
  twitter: TwitterMetadata;
  alternates: Record<string, string>;
  jsonLd: JsonLdSchema[];
  breadcrumbs?: BreadcrumbItem[];
  lastModified?: string;
  publishedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

// =============================================================================
// SCHEMA.ORG INTERFACES
// =============================================================================

export type JsonLdSchema = {
  '@context': string;
  '@type': SchemaType;
  [key: string]: unknown;
}

export type PersonSchema = JsonLdSchema & {
  '@type': 'Person';
  name: string;
  givenName: string;
  familyName: string;
  jobTitle: string;
  description: string;
  url: string;
  email: string;
  telephone?: string;
  image?: string;
  sameAs: string[];
  address: PostalAddress;
  worksFor: Organization;
  alumniOf?: EducationalOrganization;
  knowsAbout: string[];
  hasCredential?: string[];
  nationality?: string;
}

export type OrganizationSchema = JsonLdSchema & {
  '@type': 'Organization';
  name: string;
  description: string;
  url: string;
  logo: string;
  foundingDate: string;
  founder: Person;
  address: PostalAddress;
  contactPoint: ContactPoint;
  sameAs: string[];
  hasOfferCatalog?: OfferCatalog;
}

export type ProfessionalServiceSchema = JsonLdSchema & {
  '@type': 'ProfessionalService';
  name: string;
  description: string;
  provider: Organization;
  areaServed: Place;
  serviceType: string;
  offers: Offer[];
  aggregateRating?: AggregateRating;
  review?: Review[];
}

export type WebSiteSchema = JsonLdSchema & {
  '@type': 'WebSite';
  name: string;
  description: string;
  url: string;
  author: Person;
  publisher: Organization;
  inLanguage: string[];
  potentialAction?: SearchAction;
}

export type WebPageSchema = JsonLdSchema & {
  '@type': 'WebPage';
  name: string;
  description: string;
  url: string;
  isPartOf: WebSiteSchema;
  author: Person;
  publisher: Organization;
  datePublished: string;
  dateModified: string;
  inLanguage: string;
  breadcrumb?: BreadcrumbList;
  mainEntity?: Thing;
}

export type FAQPageSchema = JsonLdSchema & {
  '@type': 'FAQPage';
  name: string;
  description: string;
  url: string;
  mainEntity: Question[];
}

export type ServiceSchema = JsonLdSchema & {
  '@type': 'Service';
  name: string;
  description: string;
  provider: Organization;
  serviceType: string;
  areaServed: Place;
  offers: Offer;
  hasOfferCatalog?: OfferCatalog;
}

// =============================================================================
// SUPPORTING SCHEMA INTERFACES
// =============================================================================

export type PostalAddress = {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality: string;
  addressRegion: string;
  postalCode?: string;
  addressCountry: string;
}

export type ContactPoint = {
  '@type': 'ContactPoint';
  telephone?: string;
  email: string;
  contactType: string;
  areaServed?: string;
  availableLanguage: string[];
}

export type Place = {
  '@type': 'Place';
  name: string;
  address: PostalAddress;
  geo?: GeoCoordinates;
}

export type GeoCoordinates = {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}

export type Organization = {
  '@type': 'Organization';
  name: string;
  url?: string;
  logo?: string;
  description?: string;
}

export type Person = {
  '@type': 'Person';
  name: string;
  url?: string;
  image?: string;
}

export type EducationalOrganization = {
  '@type': 'EducationalOrganization';
  name: string;
  url?: string;
}

export type Offer = {
  '@type': 'Offer';
  name: string;
  description: string;
  price?: string;
  priceCurrency: string;
  priceRange?: string;
  availability: string;
  validFrom?: string;
  validThrough?: string;
  seller: Organization;
}

export type OfferCatalog = {
  '@type': 'OfferCatalog';
  name: string;
  itemListElement: Offer[];
}

export type AggregateRating = {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export type Review = {
  '@type': 'Review';
  author: Person;
  reviewRating: Rating;
  reviewBody: string;
  datePublished: string;
}

export type Rating = {
  '@type': 'Rating';
  ratingValue: number;
  bestRating?: number;
  worstRating?: number;
}

export type Question = {
  '@type': 'Question';
  name: string;
  acceptedAnswer: Answer;
}

export type Answer = {
  '@type': 'Answer';
  text: string;
}

export type SearchAction = {
  '@type': 'SearchAction';
  target: string;
  'query-input': string;
}

export type BreadcrumbList = {
  '@type': 'BreadcrumbList';
  itemListElement: ListItem[];
}

export type ListItem = {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

export type Thing = {
  '@type': string;
  name: string;
  description?: string;
  url?: string;
}

// =============================================================================
// NAVIGATION & BREADCRUMB INTERFACES
// =============================================================================

export type BreadcrumbItem = {
  name: string;
  url: string;
  position: number;
}

// =============================================================================
// ANALYTICS INTERFACES
// =============================================================================

export type GA4Configuration = {
  measurementId: string;
  gtmId?: string;
  enableEcommerce?: boolean;
  enableEnhancedMeasurement?: boolean;
  customDimensions?: CustomDimension[];
  customMetrics?: CustomMetric[];
  conversionEvents?: string[];
}

export type CustomDimension = {
  name: string;
  parameterName: string;
  scope: 'EVENT' | 'USER' | 'ITEM';
  description?: string;
}

export type CustomMetric = {
  name: string;
  parameterName: string;
  measurementUnit: 'STANDARD' | 'CURRENCY' | 'FEET' | 'METERS' | 'KILOMETERS' | 'MILES' | 'MILLISECONDS' | 'SECONDS' | 'MINUTES' | 'HOURS';
  restrictedMetricType?: string[];
  description?: string;
}

export type EventConfig = {
  eventName: string;
  parameters?: Record<string, string | number | boolean>;
  customParameters?: Record<string, unknown>;
}

export type ConversionEvent = EventConfig & {
  isConversion: true;
  conversionValue?: number;
  conversionCurrency?: string;
}

// =============================================================================
// CONTENT OPTIMIZATION INTERFACES
// =============================================================================

export type ContentAnalysis = {
  wordCount: number;
  readabilityScore: number;
  keywordDensity: Record<string, number>;
  headingStructure: HeadingAnalysis[];
  semanticKeywords: string[];
  internalLinks: number;
  externalLinks: number;
  imageCount: number;
  imageOptimization: ImageAnalysis[];
}

export type HeadingAnalysis = {
  level: number;
  text: string;
  wordCount: number;
  keywords: string[];
}

export type ImageAnalysis = {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  format: string;
  optimized: boolean;
  lazyLoaded: boolean;
}

// =============================================================================
// SEO CONFIGURATION INTERFACES
// =============================================================================

export type SEOPageConfig = {
  pageType: PageType;
  locale: Locale;
  title: string;
  description: string;
  keywords: string[];
  path: string;
  lastModified?: Date;
  publishedTime?: Date;
  author?: string;
  section?: string;
  tags?: string[];
  breadcrumbs?: BreadcrumbItem[];
  faqItems?: FAQItem[];
  customSchemas?: JsonLdSchema[];
  noIndex?: boolean;
  noFollow?: boolean;
  priority?: number;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

export type FAQItem = {
  question: string;
  answer: string;
}

export type SEOAuditResult = {
  score: number;
  issues: SEOIssue[];
  recommendations: SEORecommendation[];
  performance: PerformanceMetrics;
  accessibility: AccessibilityResult;
  bestPractices: BestPracticesResult;
}

export type SEOIssue = {
  type: 'error' | 'warning' | 'info';
  category: 'technical' | 'content' | 'performance' | 'accessibility';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  fix?: string;
}

export type SEORecommendation = {
  category: 'content' | 'technical' | 'performance' | 'user-experience';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  impact: 'high' | 'medium' | 'low';
}

export type PerformanceMetrics = {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  score: number;
}

export type AccessibilityResult = {
  score: number;
  violations: AccessibilityViolation[];
  passes: number;
  incomplete: number;
}

export type AccessibilityViolation = {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  nodes: number;
}

export type BestPracticesResult = {
  score: number;
  audits: BestPracticeAudit[];
}

export type BestPracticeAudit = {
  id: string;
  title: string;
  description: string;
  score: number;
  passed: boolean;
}

// =============================================================================
// SITEMAP INTERFACES
// =============================================================================

export type SitemapUrl = {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: SitemapAlternate[];
  images?: SitemapImage[];
}

export type SitemapAlternate = {
  hreflang: string;
  href: string;
}

export type SitemapImage = {
  loc: string;
  title?: string;
  caption?: string;
  geoLocation?: string;
  license?: string;
}

// =============================================================================
// ROBOTS.TXT INTERFACES
// =============================================================================

export type RobotsConfig = {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
  sitemap?: string[];
}

 