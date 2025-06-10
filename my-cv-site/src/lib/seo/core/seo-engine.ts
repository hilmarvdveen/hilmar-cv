/**
 * Enterprise SEO Engine
 * Comprehensive SEO solution with Google 2024 best practices
 * Implements E-E-A-T framework for professional services
 */

import { MetadataGenerator } from './metadata-generator';
import { SchemaGenerator } from './schema-generator';
import { AnalyticsManager } from './analytics-manager';
import type { 
  SEOPageConfig, 
  JsonLdSchema, 
  Locale, 
  PageType, 
  BreadcrumbItem,
  FAQItem,
  GA4Configuration 
} from '../types/seo-types';
import type { Metadata } from 'next';
import { 
  BUSINESS_PROFILE, 
  PRICING, 
  LOCALE_CONFIG 
} from '../constants/meta-constants';
import {
  HOMEPAGE_CONTENT,
  ABOUT_CONTENT,
  SERVICES_CONTENT,
  PROJECTS_CONTENT,
  CONTACT_CONTENT,
  BOOKING_CONTENT,
  BLOG_CONTENT,
  FAQ_CONTENT,
  PRIVACY_CONTENT,
  FRONTEND_SERVICE_CONTENT,
  FULLSTACK_SERVICE_CONTENT,
  DESIGN_SYSTEMS_SERVICE_CONTENT,
  CONSULTING_SERVICE_CONTENT
} from '../constants/page-content';

/**
 * Main SEO Engine orchestrating metadata, structured data, and analytics
 */
export class SEOEngine {
  private metadataGenerator: MetadataGenerator;
  private schemaGenerator: SchemaGenerator;
  private analyticsManager?: AnalyticsManager;
  private readonly baseUrl: string;

  constructor(baseUrl: string = BUSINESS_PROFILE.CONTACT.WEBSITE) {
    this.baseUrl = baseUrl;
    this.metadataGenerator = new MetadataGenerator(baseUrl);
    this.schemaGenerator = new SchemaGenerator(baseUrl);
    
    // Initialize analytics if in browser environment
    if (typeof window !== 'undefined') {
      this.initializeAnalytics();
    }
  }

  /**
   * Generate comprehensive SEO configuration for any page type
   */
  public generatePageSEO(config: SEOPageConfig): {
    metadata: Metadata;
    jsonLd: JsonLdSchema[];
    structuredData: string;
  } {
    // Generate metadata
    const metadata = this.metadataGenerator.generateMetadata(config);
    
    // Generate structured data schemas
    const jsonLd = this.schemaGenerator.generatePageSchema(config);
    
    // Create JSON-LD script content
    const structuredData = this.generateStructuredDataScript(jsonLd);

    return {
      metadata,
      jsonLd,
      structuredData,
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
        ? `${BUSINESS_PROFILE.NAME} - Senior Frontend Developer Amsterdam | React, Angular, Next.js`
        : `${BUSINESS_PROFILE.NAME} - Senior Frontend Developer Amsterdam | React, Angular, Next.js`,
      description: locale === 'nl'
        ? `Senior Frontend Developer in Amsterdam met ${BUSINESS_PROFILE.YEARS_EXPERIENCE} jaar ervaring. Specialist in React, Angular, Next.js. €${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}/uur. MSc Physics UvA. Klanten: Belastingdienst, Ziggo, NPL.`
        : `Senior Frontend Developer in Amsterdam with ${BUSINESS_PROFILE.YEARS_EXPERIENCE} years experience. Expert in React, Angular, Next.js. €${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}/hour. MSc Physics UvA. Clients: Belastingdienst, Ziggo, NPL.`,
      keywords: [
        ...HOMEPAGE_CONTENT.SEO_FOCUS.SECONDARY,
        ...HOMEPAGE_CONTENT.SEO_FOCUS.LONG_TAIL,
        'MSc Physics Frontend Developer Amsterdam',
        'Belastingdienst Ziggo NPL Developer',
        'TypeScript React Amsterdam Expert'
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
        ? `Over ${BUSINESS_PROFILE.NAME} - Senior Frontend Developer | MSc Physics UvA`
        : `About ${BUSINESS_PROFILE.NAME} - Senior Frontend Developer | MSc Physics UvA`,
      description: locale === 'nl'
        ? `Leer meer over ${BUSINESS_PROFILE.NAME}, Senior Frontend Developer met ${BUSINESS_PROFILE.YEARS_EXPERIENCE} jaar ervaring. MSc Physics UvA afgestudeerd. Ervaring bij Belastingdienst, Ziggo, NPL. Specialist in React, Angular, Next.js ontwikkeling.`
        : `Learn about ${BUSINESS_PROFILE.NAME}, Senior Frontend Developer with ${BUSINESS_PROFILE.YEARS_EXPERIENCE} years experience. MSc Physics UvA graduate. Experience at Belastingdienst, Ziggo, NPL. Expert in React, Angular, Next.js development.`,
      keywords: [
        ...ABOUT_CONTENT.SEO_FOCUS.SECONDARY,
        ...ABOUT_CONTENT.SEO_FOCUS.EXPERTISE,
        `${BUSINESS_PROFILE.NAME} biography`,
        'Physics MSc Frontend Developer',
        'Amsterdam Developer Experience',
        'Enterprise Development Background'
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
        ? `Frontend Development Services Amsterdam | React, Angular, Next.js | €${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}/uur`
        : `Frontend Development Services Amsterdam | React, Angular, Next.js | €${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}/hour`,
      description: locale === 'nl'
        ? `Professionele frontend development services in Amsterdam. Specialist in React, Angular, Next.js en TypeScript. Full-stack ontwikkeling, design systems, technical consulting. €${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}/uur. Ervaring bij grote Nederlandse bedrijven.`
        : `Professional frontend development services in Amsterdam. Expert in React, Angular, Next.js, and TypeScript. Full-stack development, design systems, technical consulting. €${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}/hour. Experience at major Dutch companies.`,
      keywords: [
        ...SERVICES_CONTENT.SEO_FOCUS.SECONDARY,
        ...SERVICES_CONTENT.SEO_FOCUS.SPECIALIZATIONS,
        'Full-stack Development Amsterdam',
        'Design Systems Development',
        'Technical Consulting Netherlands',
        'Enterprise Frontend Services'
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
        ? `Portfolio & Projecten - Frontend Development Case Studies | Belastingdienst, Ziggo, NPL`
        : `Portfolio & Projects - Frontend Development Case Studies | Belastingdienst, Ziggo, NPL`,
      description: locale === 'nl'
        ? `Bekijk mijn frontend development portfolio met React, Angular en Next.js projecten. Case studies van projecten bij Belastingdienst, Ziggo, NPL. Enterprise web applicaties, e-commerce oplossingen en data visualisatie dashboards.`
        : `View my frontend development portfolio with React, Angular, and Next.js projects. Case studies from projects at Belastingdienst, Ziggo, NPL. Enterprise web applications, e-commerce solutions, and data visualization dashboards.`,
      keywords: [
        ...PROJECTS_CONTENT.SEO_FOCUS.SECONDARY,
        ...PROJECTS_CONTENT.SEO_FOCUS.CLIENT_FOCUS,
        ...PROJECTS_CONTENT.SEO_FOCUS.TECH_FOCUS,
        'Enterprise Web Applications Portfolio',
        'Dutch Government Portal Development',
        'Telecommunications Frontend Projects'
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
        ? `Contact - Frontend Developer Amsterdam Inhuren | React, Angular, Next.js`
        : `Contact - Hire Frontend Developer Amsterdam | React, Angular, Next.js`,
      description: locale === 'nl'
        ? `Neem contact op voor frontend development projecten in Amsterdam. Gespecialiseerd in React, Angular en Next.js. Beschikbaar voor Nederlandse en internationale projecten. Email: ${BUSINESS_PROFILE.CONTACT.EMAIL}`
        : `Get in touch for frontend development projects in Amsterdam. Specialized in React, Angular, and Next.js. Available for Dutch and international projects. Email: ${BUSINESS_PROFILE.CONTACT.EMAIL}`,
      keywords: [
        ...CONTACT_CONTENT.SEO_FOCUS.SECONDARY,
        ...CONTACT_CONTENT.SEO_FOCUS.ACTION_FOCUSED,
        ...CONTACT_CONTENT.SEO_FOCUS.LOCAL_SEO,
        'Frontend Development Consultation Amsterdam',
        'React Angular Next.js Developer Hire',
        'Netherlands Remote Development'
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
        ? `Veelgestelde Vragen - Frontend Development Services | React, Angular, Next.js`
        : `Frequently Asked Questions - Frontend Development Services | React, Angular, Next.js`,
      description: locale === 'nl'
        ? `Veelgestelde vragen over frontend development services in Amsterdam. Informatie over React, Angular, Next.js projecten, prijzen, tijdlijnen en samenwerking. Expert antwoorden van ervaren developer.`
        : `Frequently asked questions about frontend development services in Amsterdam. Information about React, Angular, Next.js projects, pricing, timelines, and collaboration. Expert answers from experienced developer.`,
      keywords: [
        ...FAQ_CONTENT.SEO_FOCUS.SECONDARY,
        ...FAQ_CONTENT.SEO_FOCUS.SERVICE_FOCUSED,
        'Frontend Development Pricing FAQ',
        'React Angular Project Questions',
        'Amsterdam Developer Information',
        'JavaScript Development Process'
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
        ? `Book Frontend Developer Amsterdam | €${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}/uur | Gratis Consultatie`
        : `Book Frontend Developer Amsterdam | €${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}/hour | Free Consultation`,
      description: locale === 'nl'
        ? `Boek een frontend developer in Amsterdam. €${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}/uur voor React, Angular, Next.js projecten. Gratis initiële consultatie. Snelle levering, volledige ondersteuning. Projecten vanaf €${PRICING.PROJECT_MIN}.`
        : `Book a frontend developer in Amsterdam. €${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}/hour for React, Angular, Next.js projects. Free initial consultation. Fast delivery, full support. Projects from €${PRICING.PROJECT_MIN}.`,
      keywords: [
        ...BOOKING_CONTENT.SEO_FOCUS.SECONDARY,
        ...BOOKING_CONTENT.SEO_FOCUS.PRICING_FOCUSED,
        ...BOOKING_CONTENT.SEO_FOCUS.ACTION_FOCUSED,
        'Free Frontend Consultation Amsterdam',
        'Book React Developer Netherlands',
        'Schedule Frontend Development'
      ],
      path: 'book',
      lastModified: new Date(),
      breadcrumbs: this.generateBreadcrumbs(['Book'], locale)
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
        ? `Frontend Development Blog Amsterdam | React, Angular, Next.js Tutorials`
        : `Frontend Development Blog Amsterdam | React, Angular, Next.js Tutorials`,
      description: locale === 'nl'
        ? `Frontend development blog met React, Angular en Next.js tutorials. Best practices, performance tips, TypeScript guides en Amsterdam tech scene insights van ervaren developer.`
        : `Frontend development blog with React, Angular, and Next.js tutorials. Best practices, performance tips, TypeScript guides, and Amsterdam tech scene insights from experienced developer.`,
      keywords: [
        ...BLOG_CONTENT.SEO_FOCUS.SECONDARY,
        ...BLOG_CONTENT.SEO_FOCUS.TECHNICAL,
        ...BLOG_CONTENT.SEO_FOCUS.LOCAL,
        'Frontend Performance Optimization',
        'Modern JavaScript Frameworks Blog',
        'React Angular Best Practices'
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
        ? `Privacy Policy - ${BUSINESS_PROFILE.NAME} | GDPR Compliant | Amsterdam`
        : `Privacy Policy - ${BUSINESS_PROFILE.NAME} | GDPR Compliant | Amsterdam`,
      description: locale === 'nl'
        ? `Privacy policy van ${BUSINESS_PROFILE.NAME}, frontend developer in Amsterdam. GDPR-compliant databeleid, cookie-gebruik en gebruikersrechten. Transparante omgang met privacygegevens.`
        : `Privacy policy of ${BUSINESS_PROFILE.NAME}, frontend developer in Amsterdam. GDPR-compliant data policy, cookie usage, and user rights. Transparent privacy data handling.`,
      keywords: [
        ...PRIVACY_CONTENT.SEO_FOCUS.SECONDARY,
        ...PRIVACY_CONTENT.SEO_FOCUS.PROFESSIONAL,
        'GDPR Frontend Developer',
        'Amsterdam Business Privacy',
        'Developer Data Protection',
        'Website Privacy Netherlands'
      ],
      path: 'privacy',
      lastModified: new Date(),
      breadcrumbs: this.generateBreadcrumbs(['Privacy'], locale)
    };

    return this.generatePageSEO(config);
  }

  /**
   * Create SEO configuration for frontend service subpage
   */
  public createFrontendServiceSEO(locale: Locale): {
    metadata: Metadata;
    jsonLd: JsonLdSchema[];
    structuredData: string;
  } {
    const config: SEOPageConfig = {
      pageType: 'services',
      locale,
      title: locale === 'nl'
        ? `Frontend Development Amsterdam | React, Next.js, Vue.js Expert | €${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}/uur`
        : `Frontend Development Amsterdam | React, Next.js, Vue.js Expert | €${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}/hour`,
      description: locale === 'nl'
        ? `Expert frontend development services in Amsterdam. Specialist in React, Next.js, Vue.js en TypeScript. Mobile-first responsive design, performance optimization, SEO-friendly development. ${BUSINESS_PROFILE.YEARS_EXPERIENCE} jaar ervaring.`
        : `Expert frontend development services in Amsterdam. Specialized in React, Next.js, Vue.js, and TypeScript. Mobile-first responsive design, performance optimization, SEO-friendly development. ${BUSINESS_PROFILE.YEARS_EXPERIENCE} years experience.`,
      keywords: [
        ...FRONTEND_SERVICE_CONTENT.SEO_FOCUS.SECONDARY,
        ...FRONTEND_SERVICE_CONTENT.SEO_FOCUS.TECHNICAL,
        ...FRONTEND_SERVICE_CONTENT.SEO_FOCUS.SPECIALIZATIONS,
        'Expert React Developer Amsterdam',
        'Vue.js Development Netherlands',
        'Frontend Performance Expert'
      ],
      path: 'services/frontend',
      lastModified: new Date(),
      breadcrumbs: this.generateBreadcrumbs(['Services', 'Frontend Development'], locale)
    };

    return this.generatePageSEO(config);
  }

  /**
   * Create SEO configuration for fullstack service subpage
   */
  public createFullstackServiceSEO(locale: Locale): {
    metadata: Metadata;
    jsonLd: JsonLdSchema[];
    structuredData: string;
  } {
    const config: SEOPageConfig = {
      pageType: 'services',
      locale,
      title: locale === 'nl'
        ? `Full-Stack Development Amsterdam | React + Node.js Expert | End-to-End Solutions`
        : `Full-Stack Development Amsterdam | React + Node.js Expert | End-to-End Solutions`,
      description: locale === 'nl'
        ? `Complete full-stack development services in Amsterdam. Expert in React, Node.js, PostgreSQL, AWS. End-to-end web application development, API design, cloud deployment. Enterprise-grade solutions met ${BUSINESS_PROFILE.YEARS_EXPERIENCE} jaar ervaring.`
        : `Complete full-stack development services in Amsterdam. Expert in React, Node.js, PostgreSQL, AWS. End-to-end web application development, API design, cloud deployment. Enterprise-grade solutions with ${BUSINESS_PROFILE.YEARS_EXPERIENCE} years experience.`,
      keywords: [
        ...FULLSTACK_SERVICE_CONTENT.SEO_FOCUS.SECONDARY,
        ...FULLSTACK_SERVICE_CONTENT.SEO_FOCUS.TECHNICAL,
        ...FULLSTACK_SERVICE_CONTENT.SEO_FOCUS.SPECIALIZATIONS,
        'Node.js React Developer Amsterdam',
        'PostgreSQL Development Netherlands',
        'Cloud Development Expert Amsterdam'
      ],
      path: 'services/fullstack',
      lastModified: new Date(),
      breadcrumbs: this.generateBreadcrumbs(['Services', 'Full-Stack Development'], locale)
    };

    return this.generatePageSEO(config);
  }

  /**
   * Create SEO configuration for design systems service subpage
   */
  public createDesignSystemsServiceSEO(locale: Locale): {
    metadata: Metadata;
    jsonLd: JsonLdSchema[];
    structuredData: string;
  } {
    const config: SEOPageConfig = {
      pageType: 'services',
      locale,
      title: locale === 'nl'
        ? `Design Systems Development Amsterdam | React Component Libraries | Storybook Expert`
        : `Design Systems Development Amsterdam | React Component Libraries | Storybook Expert`,
      description: locale === 'nl'
        ? `Professional design systems development in Amsterdam. Expert in React component libraries, Storybook, design tokens. Scalable component architecture, team collaboration, consistent user experiences. Enterprise design system solutions.`
        : `Professional design systems development in Amsterdam. Expert in React component libraries, Storybook, design tokens. Scalable component architecture, team collaboration, consistent user experiences. Enterprise design system solutions.`,
      keywords: [
        ...DESIGN_SYSTEMS_SERVICE_CONTENT.SEO_FOCUS.SECONDARY,
        ...DESIGN_SYSTEMS_SERVICE_CONTENT.SEO_FOCUS.TECHNICAL,
        ...DESIGN_SYSTEMS_SERVICE_CONTENT.SEO_FOCUS.SPECIALIZATIONS,
        'Storybook Development Amsterdam',
        'React Component Library Netherlands',
        'Design Token Systems Expert'
      ],
      path: 'services/design-systems',
      lastModified: new Date(),
      breadcrumbs: this.generateBreadcrumbs(['Services', 'Design Systems'], locale)
    };

    return this.generatePageSEO(config);
  }

  /**
   * Create SEO configuration for consulting service subpage
   */
  public createConsultingServiceSEO(locale: Locale): {
    metadata: Metadata;
    jsonLd: JsonLdSchema[];
    structuredData: string;
  } {
    const config: SEOPageConfig = {
      pageType: 'services',
      locale,
      title: locale === 'nl'
        ? `Technical Consulting Amsterdam | Frontend Architecture Expert | Performance Optimization`
        : `Technical Consulting Amsterdam | Frontend Architecture Expert | Performance Optimization`,
      description: locale === 'nl'
        ? `Expert technical consulting services in Amsterdam. Frontend architecture review, performance optimization, code quality assessment, team training. ${BUSINESS_PROFILE.YEARS_EXPERIENCE} jaar ervaring bij enterprise clients zoals Belastingdienst en Ziggo.`
        : `Expert technical consulting services in Amsterdam. Frontend architecture review, performance optimization, code quality assessment, team training. ${BUSINESS_PROFILE.YEARS_EXPERIENCE} years experience with enterprise clients like Belastingdienst and Ziggo.`,
      keywords: [
        ...CONSULTING_SERVICE_CONTENT.SEO_FOCUS.SECONDARY,
        ...CONSULTING_SERVICE_CONTENT.SEO_FOCUS.TECHNICAL,
        ...CONSULTING_SERVICE_CONTENT.SEO_FOCUS.SPECIALIZATIONS,
        'Frontend Architecture Consulting Amsterdam',
        'Performance Audit Netherlands',
        'Technical Leadership Consulting'
      ],
      path: 'services/consulting',
      lastModified: new Date(),
      breadcrumbs: this.generateBreadcrumbs(['Services', 'Technical Consulting'], locale)
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
    const groups: Record<PageType, string> = {
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
    const pages = [
      '', 
      'about', 
      'services', 
      'services/frontend',
      'services/fullstack', 
      'services/design-systems',
      'services/consulting',
      'projects', 
      'contact', 
      'faq', 
      'book'
    ];
    const sitemapData: Array<{
      url: string;
      lastModified: string;
      changeFrequency: string;
      priority: number;
      alternates: Array<{ hreflang: string; href: string }>;
    }> = [];

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

        // Determine priority and change frequency based on page type
        let priority = 0.8;
        let changeFrequency = 'monthly';
        
        if (page === '') {
          priority = 1.0;
          changeFrequency = 'weekly';
        } else if (page === 'services' || page.startsWith('services/')) {
          priority = 0.9; // High priority for service pages
          changeFrequency = 'monthly';
        } else if (page === 'contact' || page === 'book') {
          priority = 0.9; // High priority for conversion pages
          changeFrequency = 'monthly';
        }

        sitemapData.push({
          url,
          lastModified: new Date().toISOString(),
          changeFrequency,
          priority,
          alternates
        });
      });
    });

    return sitemapData;
  }
} 