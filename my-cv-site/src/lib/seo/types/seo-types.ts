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

export interface BaseMetadata {
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

export interface OpenGraphMetadata {
  title: string;
  description: string;
  type: 'website' | 'article' | 'profile';
  image?: string;
  imageAlt?: string;
  url: string;
  siteName: string;
  locale: string;
  alternateLocales: string[];
}

export interface TwitterMetadata {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  site: string;
  creator: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

export interface ExtendedMetadata extends BaseMetadata {
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

export interface JsonLdSchema {
  '@context': string;
  '@type': SchemaType;
  [key: string]: unknown;
}

export interface PersonSchema extends JsonLdSchema {
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

export interface OrganizationSchema extends JsonLdSchema {
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

export interface ProfessionalServiceSchema extends JsonLdSchema {
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

export interface WebSiteSchema extends JsonLdSchema {
  '@type': 'WebSite';
  name: string;
  description: string;
  url: string;
  author: Person;
  publisher: Organization;
  inLanguage: string[];
  potentialAction?: SearchAction;
}

export interface WebPageSchema extends JsonLdSchema {
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

export interface FAQPageSchema extends JsonLdSchema {
  '@type': 'FAQPage';
  name: string;
  description: string;
  url: string;
  mainEntity: Question[];
}

export interface ServiceSchema extends JsonLdSchema {
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

export interface PostalAddress {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality: string;
  addressRegion: string;
  postalCode?: string;
  addressCountry: string;
}

export interface ContactPoint {
  '@type': 'ContactPoint';
  telephone?: string;
  email: string;
  contactType: string;
  areaServed?: string;
  availableLanguage: string[];
}

export interface Place {
  '@type': 'Place';
  name: string;
  address: PostalAddress;
  geo?: GeoCoordinates;
}

export interface GeoCoordinates {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}

export interface Organization {
  '@type': 'Organization';
  name: string;
  url?: string;
  logo?: string;
  description?: string;
}

export interface Person {
  '@type': 'Person';
  name: string;
  url?: string;
  image?: string;
}

export interface EducationalOrganization {
  '@type': 'EducationalOrganization';
  name: string;
  url?: string;
}

export interface Offer {
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

export interface OfferCatalog {
  '@type': 'OfferCatalog';
  name: string;
  itemListElement: Offer[];
}

export interface AggregateRating {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export interface Review {
  '@type': 'Review';
  author: Person;
  reviewRating: Rating;
  reviewBody: string;
  datePublished: string;
}

export interface Rating {
  '@type': 'Rating';
  ratingValue: number;
  bestRating?: number;
  worstRating?: number;
}

export interface Question {
  '@type': 'Question';
  name: string;
  acceptedAnswer: Answer;
}

export interface Answer {
  '@type': 'Answer';
  text: string;
}

export interface SearchAction {
  '@type': 'SearchAction';
  target: string;
  'query-input': string;
}

export interface BreadcrumbList {
  '@type': 'BreadcrumbList';
  itemListElement: ListItem[];
}

export interface ListItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

export interface Thing {
  '@type': string;
  name: string;
  description?: string;
  url?: string;
}

// =============================================================================
// NAVIGATION & BREADCRUMB INTERFACES
// =============================================================================

export interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

// =============================================================================
// ANALYTICS INTERFACES
// =============================================================================

export interface GA4Configuration {
  measurementId: string;
  gtmId?: string;
  enableEcommerce?: boolean;
  enableEnhancedMeasurement?: boolean;
  customDimensions?: CustomDimension[];
  customMetrics?: CustomMetric[];
  conversionEvents?: string[];
}

export interface CustomDimension {
  name: string;
  parameterName: string;
  scope: 'EVENT' | 'USER' | 'ITEM';
  description?: string;
}

export interface CustomMetric {
  name: string;
  parameterName: string;
  measurementUnit: 'STANDARD' | 'CURRENCY' | 'FEET' | 'METERS' | 'KILOMETERS' | 'MILES' | 'MILLISECONDS' | 'SECONDS' | 'MINUTES' | 'HOURS';
  restrictedMetricType?: string[];
  description?: string;
}

export interface EventConfig {
  eventName: string;
  parameters?: Record<string, string | number | boolean>;
  customParameters?: Record<string, unknown>;
}

export interface ConversionEvent extends EventConfig {
  isConversion: true;
  conversionValue?: number;
  conversionCurrency?: string;
}

// =============================================================================
// CONTENT OPTIMIZATION INTERFACES
// =============================================================================

export interface ContentAnalysis {
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

export interface HeadingAnalysis {
  level: number;
  text: string;
  wordCount: number;
  keywords: string[];
}

export interface ImageAnalysis {
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

export interface SEOPageConfig {
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

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOAuditResult {
  score: number;
  issues: SEOIssue[];
  recommendations: SEORecommendation[];
  performance: PerformanceMetrics;
  accessibility: AccessibilityResult;
  bestPractices: BestPracticesResult;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: 'technical' | 'content' | 'performance' | 'accessibility';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  fix?: string;
}

export interface SEORecommendation {
  category: 'content' | 'technical' | 'performance' | 'user-experience';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  impact: 'high' | 'medium' | 'low';
}

export interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  score: number;
}

export interface AccessibilityResult {
  score: number;
  violations: AccessibilityViolation[];
  passes: number;
  incomplete: number;
}

export interface AccessibilityViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  nodes: number;
}

export interface BestPracticesResult {
  score: number;
  audits: BestPracticeAudit[];
}

export interface BestPracticeAudit {
  id: string;
  title: string;
  description: string;
  score: number;
  passed: boolean;
}

// =============================================================================
// SITEMAP INTERFACES
// =============================================================================

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: SitemapAlternate[];
  images?: SitemapImage[];
}

export interface SitemapAlternate {
  hreflang: string;
  href: string;
}

export interface SitemapImage {
  loc: string;
  title?: string;
  caption?: string;
  geoLocation?: string;
  license?: string;
}

// =============================================================================
// ROBOTS.TXT INTERFACES
// =============================================================================

export interface RobotsConfig {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
  sitemap?: string[];
}

 