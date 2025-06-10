/**
 * Enterprise SEO Engine
 * Main orchestrator for comprehensive SEO functionality
 * Implements Google 2024 best practices with E-E-A-T focus
 */

import { Metadata } from 'next';
import { MetadataGenerator } from './metadata-generator';
import { SchemaGenerator } from './schema-generator';
import { AnalyticsManager } from './analytics-manager';
import type { 
  SEOPageConfig, 
  JsonLdSchema, 
  GA4Configuration,
  BreadcrumbItem,
  FAQItem,
  Locale,
  PageType 
} from '../types/seo-types';
import { 
  BUSINESS_PROFILE, 
  QUALIFICATIONS,
  PRICING,
  LOCALE_CONFIG
} from '../constants/meta-constants';

export class SEOEngine {
  private metadataGenerator: MetadataGenerator;
  private schemaGenerator: SchemaGenerator;
  private analyticsManager?: AnalyticsManager;
  private readonly baseUrl: string;

  constructor(baseUrl: string = BUSINESS_PROFILE.CONTACT.WEBSITE) {
    this.baseUrl = baseUrl;
    this.metadataGenerator = new MetadataGenerator(baseUrl);
    this.schemaGenerator = new SchemaGenerator(baseUrl);
    
    // Initialize analytics if configuration is available
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      this.initializeAnalytics();
    }
  }

  /**
   * Generate complete SEO configuration for a page
   */
  public generatePageSEO(config: SEOPageConfig): {
    metadata: Metadata;
    jsonLd: JsonLdSchema[];
    structuredData: string;
  } {
    // Generate comprehensive metadata
    const metadata = this.metadataGenerator.generateMetadata(config);
    
    // Generate schema.org structured data
    const jsonLd = this.schemaGenerator.generatePageSchema(config);
    
    // Create structured data script content
    const structuredData = this.generateStructuredDataScript(jsonLd);
    
    return {
      metadata,
      jsonLd,
      structuredData
    };
  }

  /**
   * Create SEO configuration for homepage
   */
  public createHomepageSEO(locale: Locale): {
    metadata: Metadata;
    jsonLd: JsonLdSchema[];
    structuredData: string;
  } {
    const config: SEOPageConfig = {
      pageType: 'homepage',
      locale,
      title: locale === 'nl' 
        ? `${BUSINESS_PROFILE.NAME} - Senior Frontend Developer Amsterdam`
        : `${BUSINESS_PROFILE.NAME} - Senior Frontend Developer Amsterdam`,
      description: locale === 'nl'
        ? `Senior Frontend Developer in Amsterdam met ${BUSINESS_PROFILE.YEARS_EXPERIENCE} jaar ervaring. Specialist in React, Angular, Next.js en TypeScript. MSc Physics UvA afgestudeerd.`
        : `Senior Frontend Developer in Amsterdam with ${BUSINESS_PROFILE.YEARS_EXPERIENCE} years experience. Expert in React, Angular, Next.js, and TypeScript. MSc Physics UvA graduate.`,
      keywords: [
        'Senior Frontend Developer Amsterdam',
        'React Developer Netherlands',
        'Angular Developer Amsterdam',
        'Next.js Expert Netherlands',
        'TypeScript Specialist Amsterdam'
      ],
      path: '',
      lastModified: new Date(),
      breadcrumbs: this.generateHomepageBreadcrumbs(locale)
    };

    return this.generatePageSEO(config);
  }

  /**
   * Create SEO configuration for about page
   */
  public createAboutSEO(locale: Locale): {
    metadata: Metadata;
    jsonLd: JsonLdSchema[];
    structuredData: string;
  } {
    const config: SEOPageConfig = {
      pageType: 'about',
      locale,
      title: locale === 'nl'
        ? `Over ${BUSINESS_PROFILE.NAME} - Senior Frontend Developer Biografie`
        : `About ${BUSINESS_PROFILE.NAME} - Senior Frontend Developer Biography`,
      description: locale === 'nl'
        ? `Leer meer over ${BUSINESS_PROFILE.NAME}, Senior Frontend Developer met ${BUSINESS_PROFILE.YEARS_EXPERIENCE} jaar ervaring. ${QUALIFICATIONS.EDUCATION} afgestudeerd met ervaring bij ${QUALIFICATIONS.PREVIOUS_CLIENTS.join(', ')}.`
        : `Learn about ${BUSINESS_PROFILE.NAME}, Senior Frontend Developer with ${BUSINESS_PROFILE.YEARS_EXPERIENCE} years experience. ${QUALIFICATIONS.EDUCATION} graduate with experience at ${QUALIFICATIONS.PREVIOUS_CLIENTS.join(', ')}.`,
      keywords: [
        `${BUSINESS_PROFILE.NAME} biography`,
        'Frontend Developer Experience',
        'University of Amsterdam Graduate',
        'React Angular Expert Background',
        'Amsterdam Developer Profile'
      ],
      path: 'about',
      lastModified: new Date(),
      breadcrumbs: this.generateBreadcrumbs(['About'], locale)
    };

    return this.generatePageSEO(config);
  }

  /**
   * Create SEO configuration for services page
   */
  public createServicesSEO(locale: Locale): {
    metadata: Metadata;
    jsonLd: JsonLdSchema[];
    structuredData: string;
  } {
    const config: SEOPageConfig = {
      pageType: 'services',
      locale,
      title: locale === 'nl'
        ? 'Frontend Development Services - React, Angular, Next.js'
        : 'Frontend Development Services - React, Angular, Next.js',
      description: locale === 'nl'
        ? `Professionele frontend development services in Amsterdam. Specialist in React, Angular en Next.js ontwikkeling. €${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX} per uur.`
        : `Professional frontend development services in Amsterdam. Expert in React, Angular, and Next.js development. €${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX} per hour.`,
      keywords: [
        'Frontend Development Services Amsterdam',
        'React Development Netherlands',
        'Angular Consulting Amsterdam',
        'Next.js Development Services',
        'TypeScript Programming Amsterdam'
      ],
      path: 'services',
      lastModified: new Date(),
      breadcrumbs: this.generateBreadcrumbs(['Services'], locale)
    };

    return this.generatePageSEO(config);
  }

  /**
   * Create SEO configuration for projects page
   */
  public createProjectsSEO(locale: Locale): {
    metadata: Metadata;
    jsonLd: JsonLdSchema[];
    structuredData: string;
  } {
    const config: SEOPageConfig = {
      pageType: 'projects',
      locale,
      title: locale === 'nl'
        ? 'Portfolio & Projecten - Frontend Development Case Studies'
        : 'Portfolio & Projects - Frontend Development Case Studies',
      description: locale === 'nl'
        ? `Bekijk mijn frontend development portfolio met React, Angular en Next.js projecten. Case studies van projecten bij ${QUALIFICATIONS.PREVIOUS_CLIENTS.slice(0, 2).join(' en ')}.`
        : `View my frontend development portfolio with React, Angular, and Next.js projects. Case studies from projects at ${QUALIFICATIONS.PREVIOUS_CLIENTS.slice(0, 2).join(' and ')}.`,
      keywords: [
        'Frontend Portfolio Amsterdam',
        'React Projects Netherlands',
        'Angular Case Studies',
        'Next.js Portfolio',
        'JavaScript Projects Amsterdam'
      ],
      path: 'projects',
      lastModified: new Date(),
      breadcrumbs: this.generateBreadcrumbs(['Projects'], locale)
    };

    return this.generatePageSEO(config);
  }

  /**
   * Create SEO configuration for contact page
   */
  public createContactSEO(locale: Locale): {
    metadata: Metadata;
    jsonLd: JsonLdSchema[];
    structuredData: string;
  } {
    const config: SEOPageConfig = {
      pageType: 'contact',
      locale,
      title: locale === 'nl'
        ? 'Contact - Frontend Developer Amsterdam Inhuren'
        : 'Contact - Hire Frontend Developer Amsterdam',
      description: locale === 'nl'
        ? `Neem contact op voor frontend development projecten. Gevestigd in Amsterdam, beschikbaar voor React, Angular en Next.js projecten. ${BUSINESS_PROFILE.CONTACT.EMAIL}`
        : `Get in touch for frontend development projects. Based in Amsterdam, available for React, Angular, and Next.js projects. ${BUSINESS_PROFILE.CONTACT.EMAIL}`,
      keywords: [
        'Contact Frontend Developer Amsterdam',
        'Hire React Developer Netherlands',
        'Frontend Development Consultation',
        'Amsterdam JavaScript Developer',
        'React Angular Next.js Freelancer'
      ],
      path: 'contact',
      lastModified: new Date(),
      breadcrumbs: this.generateBreadcrumbs(['Contact'], locale)
    };

    return this.generatePageSEO(config);
  }

  /**
   * Create SEO configuration for FAQ page
   */
  public createFAQSEO(locale: Locale, faqItems: FAQItem[]): {
    metadata: Metadata;
    jsonLd: JsonLdSchema[];
    structuredData: string;
  } {
    const config: SEOPageConfig = {
      pageType: 'faq',
      locale,
      title: locale === 'nl'
        ? 'Veelgestelde Vragen - Frontend Development Services'
        : 'Frequently Asked Questions - Frontend Development Services',
      description: locale === 'nl'
        ? 'Veelgestelde vragen over frontend development services, React, Angular en Next.js projecten in Amsterdam.'
        : 'Frequently asked questions about frontend development services, React, Angular, and Next.js projects in Amsterdam.',
      keywords: [
        'Frontend Development FAQ',
        'React Angular Questions',
        'Next.js Development Info',
        'Amsterdam Developer FAQ',
        'JavaScript Development Questions'
      ],
      path: 'faq',
      faqItems,
      lastModified: new Date(),
      breadcrumbs: this.generateBreadcrumbs(['FAQ'], locale)
    };

    return this.generatePageSEO(config);
  }

  /**
   * Create SEO configuration for booking page
   */
  public createBookingSEO(locale: Locale): {
    metadata: Metadata;
    jsonLd: JsonLdSchema[];
    structuredData: string;
  } {
    const config: SEOPageConfig = {
      pageType: 'booking',
      locale,
      title: locale === 'nl'
        ? 'Consultatie Boeken - Frontend Developer Amsterdam'
        : 'Book Consultation - Frontend Developer Amsterdam',
      description: locale === 'nl'
        ? `Boek een consultatie met een senior frontend developer in Amsterdam. €${PRICING.CONSULTATION_RATE} consultatietarief voor React, Angular en Next.js projecten.`
        : `Book a consultation with a senior frontend developer in Amsterdam. €${PRICING.CONSULTATION_RATE} consultation rate for React, Angular, and Next.js projects.`,
      keywords: [
        'Book Frontend Developer Amsterdam',
        'React Angular Consultation',
        'Next.js Development Booking',
        'Frontend Architecture Consultation',
        'Amsterdam JavaScript Developer Hire'
      ],
      path: 'book',
      lastModified: new Date(),
      breadcrumbs: this.generateBreadcrumbs(['Book Consultation'], locale)
    };

    return this.generatePageSEO(config);
  }

  /**
   * Create SEO configuration for blog page
   */
  public createBlogSEO(locale: Locale): {
    metadata: Metadata;
    jsonLd: JsonLdSchema[];
    structuredData: string;
  } {
    const config: SEOPageConfig = {
      pageType: 'blog',
      locale,
      title: locale === 'nl'
        ? 'Blog - Frontend Development Insights & Tips'
        : 'Blog - Frontend Development Insights & Tips',
      description: locale === 'nl'
        ? 'Technische inzichten, project updates en gedachten over frontend ontwikkeling van een senior React en Angular developer uit Amsterdam.'
        : 'Technical insights, project updates, and thoughts on frontend development from a senior React and Angular developer in Amsterdam.',
      keywords: [
        'Frontend Development Blog',
        'React Angular Tips',
        'Next.js Development Insights',
        'JavaScript Best Practices',
        'Amsterdam Developer Blog'
      ],
      path: 'blog',
      lastModified: new Date(),
      breadcrumbs: this.generateBreadcrumbs(['Blog'], locale)
    };

    return this.generatePageSEO(config);
  }

  /**
   * Create SEO configuration for privacy page
   */
  public createPrivacySEO(locale: Locale): {
    metadata: Metadata;
    jsonLd: JsonLdSchema[];
    structuredData: string;
  } {
    const config: SEOPageConfig = {
      pageType: 'privacy',
      locale,
      title: locale === 'nl'
        ? 'Privacybeleid - Frontend Developer Amsterdam'
        : 'Privacy Policy - Frontend Developer Amsterdam',
      description: locale === 'nl'
        ? 'Privacybeleid voor frontend development services van Hilmar van der Veen. Informatie over gegevensverzameling en -gebruik.'
        : 'Privacy policy for frontend development services by Hilmar van der Veen. Information about data collection and usage.',
      keywords: [
        'Privacy Policy',
        'Data Protection',
        'GDPR Compliance',
        'Frontend Developer Privacy',
        'Amsterdam Developer Terms'
      ],
      path: 'privacy',
      lastModified: new Date(),
      breadcrumbs: this.generateBreadcrumbs(['Privacy Policy'], locale)
    };

    return this.generatePageSEO(config);
  }

  /**
   * Initialize Google Analytics 4
   */
  private initializeAnalytics(): void {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

    if (measurementId) {
      const config: GA4Configuration = {
        measurementId,
        gtmId,
        enableEcommerce: true,
        enableEnhancedMeasurement: true,
        customDimensions: [
          { name: 'Page Type', parameterName: 'page_type', scope: 'EVENT' },
          { name: 'User Language', parameterName: 'user_language', scope: 'USER' },
          { name: 'Service Interest', parameterName: 'service_interest', scope: 'EVENT' }
        ],
        conversionEvents: [
          'contact_form_submit',
          'service_inquiry',
          'consultation_request',
          'cv_download'
        ]
      };

      this.analyticsManager = new AnalyticsManager(config);
    }
  }

  /**
   * Track page view with enhanced data
   */
  public trackPageView(pageType: PageType, locale: Locale, title: string, path: string): void {
    if (this.analyticsManager) {
      this.analyticsManager.trackPageView({
        pageTitle: title,
        pagePath: path,
        pageType,
        locale,
        contentGroup: this.getContentGroup(pageType)
      });
    }
  }

  /**
   * Get analytics manager for external use
   */
  public getAnalytics(): AnalyticsManager | undefined {
    return this.analyticsManager;
  }

  /**
   * Generate structured data script
   */
  private generateStructuredDataScript(schemas: JsonLdSchema[]): string {
    return schemas.map(schema => JSON.stringify(schema, null, 2)).join('\n\n');
  }

  /**
   * Generate breadcrumbs for pages
   */
  private generateBreadcrumbs(pathSegments: string[], locale: Locale): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [];
    const baseUrl = locale === LOCALE_CONFIG.DEFAULT ? this.baseUrl : `${this.baseUrl}/${locale}`;
    
    // Add home
    breadcrumbs.push({
      name: locale === 'nl' ? 'Home' : 'Home',
      url: baseUrl,
      position: 1
    });

    // Add path segments
    let currentPath = baseUrl;
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment.toLowerCase().replace(/\s+/g, '-')}`;
      breadcrumbs.push({
        name: segment,
        url: currentPath,
        position: index + 2
      });
    });

    return breadcrumbs;
  }

  /**
   * Generate homepage breadcrumbs
   */
  private generateHomepageBreadcrumbs(locale: Locale): BreadcrumbItem[] {
    const baseUrl = locale === LOCALE_CONFIG.DEFAULT ? this.baseUrl : `${this.baseUrl}/${locale}`;
    
    return [{
      name: `${BUSINESS_PROFILE.NAME} - ${BUSINESS_PROFILE.TITLE}`,
      url: baseUrl,
      position: 1
    }];
  }

  /**
   * Get content group for analytics
   */
  private getContentGroup(pageType: PageType): string {
    const groups = {
      homepage: 'Main Pages',
      about: 'About',
      services: 'Services',
      projects: 'Portfolio',
      contact: 'Contact',
      faq: 'Support',
      blog: 'Content',
      'blog-post': 'Content',
      privacy: 'Legal',
      booking: 'Conversion'
    };

    return groups[pageType] || 'Other';
  }

  /**
   * Validate SEO configuration
   */
  public validateSEOConfig(config: SEOPageConfig): {
    isValid: boolean;
    warnings: string[];
    errors: string[];
  } {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Title validation
    if (config.title.length < 30) {
      warnings.push('Title is shorter than 30 characters - consider adding more descriptive text');
    }
    if (config.title.length > 60) {
      errors.push('Title exceeds 60 characters and may be truncated in search results');
    }

    // Description validation
    if (config.description.length < 120) {
      warnings.push('Description is shorter than 120 characters - consider adding more detail');
    }
    if (config.description.length > 160) {
      errors.push('Description exceeds 160 characters and may be truncated in search results');
    }

    // Keywords validation
    if (config.keywords.length < 5) {
      warnings.push('Consider adding more keywords for better semantic targeting');
    }
    if (config.keywords.length > 15) {
      warnings.push('Too many keywords may dilute SEO effectiveness');
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors
    };
  }

  /**
   * Generate sitemap data for all pages
   */
  public generateSitemapData(): Array<{
    url: string;
    lastModified: string;
    changeFrequency: string;
    priority: number;
    alternates: Array<{ hreflang: string; href: string }>;
  }> {
    const pages = ['', 'about', 'services', 'projects', 'contact', 'faq', 'book'];
    const sitemapData: Array<any> = [];

    pages.forEach(page => {
      LOCALE_CONFIG.SUPPORTED.forEach(locale => {
        const isDefault = locale === LOCALE_CONFIG.DEFAULT;
        const localePrefix = isDefault ? '' : `/${locale}`;
        const pagePath = page ? `/${page}` : '';
        const url = `${this.baseUrl}${localePrefix}${pagePath}`;

        // Generate alternates for this page
        const alternates = LOCALE_CONFIG.SUPPORTED.map((locale: string) => ({  
          hreflang: LOCALE_CONFIG.HREFLANG[locale as keyof typeof LOCALE_CONFIG.HREFLANG],
          href: `${this.baseUrl}${locale === LOCALE_CONFIG.DEFAULT ? '' : `/${locale}`}${pagePath}`
        }));

        sitemapData.push({
          url,
          lastModified: new Date().toISOString(),
          changeFrequency: page === '' ? 'weekly' : 'monthly',
          priority: page === '' ? 1.0 : 0.8,
          alternates
        });
      });
    });

    return sitemapData;
  }
} 