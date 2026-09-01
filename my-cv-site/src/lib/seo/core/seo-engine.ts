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
  RATE_TEXT,
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

// Stable per-deployment timestamp for sitemap <lastmod>. Computed once at module
// load (≈ deploy time) rather than per request, so we don't signal to crawlers
// that every page changes on every crawl.
const SITE_LAST_MODIFIED = new Date().toISOString();
// Same instant as a Date, for page-config `lastModified` (feeds schema
// dateModified). Stable per deploy — never `new Date()` per request.
const SITE_LAST_MODIFIED_DATE = new Date(SITE_LAST_MODIFIED);

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
    
    // Initialize analytics if in browser environment. The non-browser branch
    // is only taken under SSR/Node and cannot be reached from the jsdom tests.
    /* v8 ignore next 3 */
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
      title: `${BUSINESS_PROFILE.NAME} | Freelance ${BUSINESS_PROFILE.SEARCH_TITLE}`,
      description: locale === 'nl'
        ? `Freelance senior frontend developer, 10+ jaar React, Next.js en Angular. Nu bij bol.com, drie keer verlengd. Vanaf ${BUSINESS_PROFILE.AVAILABLE_FROM_DUTCH} in de Randstad en remote.`
        : `Freelance senior frontend developer, 10+ years of React, Next.js and Angular. At bol.com now, extended three times. From ${BUSINESS_PROFILE.AVAILABLE_FROM}, Randstad and remote.`,
      keywords: [
        ...HOMEPAGE_CONTENT.SEO_FOCUS.SECONDARY,
        ...HOMEPAGE_CONTENT.SEO_FOCUS.LONG_TAIL,
        'bol.com Belastingdienst Postcode Loterij Athlon',
        'TypeScript GraphQL frontend developer'
      ],
      path: '',
      lastModified: SITE_LAST_MODIFIED_DATE,
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
        ? `Over ${BUSINESS_PROFILE.NAME}, senior frontend developer`
        : `About ${BUSINESS_PROFILE.NAME}, senior frontend developer`,
      description: locale === 'nl'
        ? `Senior frontend developer sinds 2016 bij bol.com, de Belastingdienst, Postcode Loterij en Athlon. React, Next.js en Angular, van specificatie tot cut-over.`
        : `Senior frontend developer since 2016 at bol.com, the Belastingdienst, Postcode Loterij and Athlon. React, Next.js and Angular, from specification to cut-over.`,
      keywords: [
        ...ABOUT_CONTENT.SEO_FOCUS.SECONDARY,
        ...ABOUT_CONTENT.SEO_FOCUS.EXPERTISE,
        `${BUSINESS_PROFILE.NAME} profile`,
        'Frontend engineer Randstad'
      ],
      path: 'about',
      lastModified: SITE_LAST_MODIFIED_DATE,
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
        ? 'Diensten | Freelance frontend developer, Randstad'
        : 'Services | Freelance frontend developer, Randstad',
      description: locale === 'nl'
        ? `Frontend developer inhuren voor React, Next.js of Angular: legacy naar modern zonder downtime en design systems. ${RATE_TEXT.nl}.`
        : `Hire a frontend developer for React, Next.js or Angular: legacy to modern without downtime and design systems. ${RATE_TEXT.en}.`,
      keywords: [
        ...SERVICES_CONTENT.SEO_FOCUS.SECONDARY,
        ...SERVICES_CONTENT.SEO_FOCUS.SPECIALIZATIONS,
        'Full-stack React with .NET or Kotlin',
        'Frontend architecture consulting Netherlands'
      ],
      path: 'services',
      lastModified: SITE_LAST_MODIFIED_DATE,
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
        ? 'Cases | bol.com, Belastingdienst, Postcode Loterij, Athlon'
        : 'Case studies | bol.com, Belastingdienst, Athlon and more',
      description: locale === 'nl'
        ? `Opgeleverd: legacy Java naar SSR React bij bol.com, een low-code formulierenplatform bij de Belastingdienst, design systems bij Postcode Loterij en Athlon.`
        : `Delivered: legacy Java to SSR React at bol.com, a low-code forms platform at the Belastingdienst, design systems at Postcode Loterij and Athlon.`,
      keywords: [
        ...PROJECTS_CONTENT.SEO_FOCUS.SECONDARY,
        ...PROJECTS_CONTENT.SEO_FOCUS.CLIENT_FOCUS,
        ...PROJECTS_CONTENT.SEO_FOCUS.TECH_FOCUS,
        'E-commerce and government frontend'
      ],
      path: 'projects',
      lastModified: SITE_LAST_MODIFIED_DATE,
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
        ? 'Contact | Freelance frontend developer inhuren, Randstad'
        : 'Contact | Hire a freelance frontend developer, Randstad',
      description: locale === 'nl'
        ? `Frontend developer inhuren voor React, Next.js of Angular in Amsterdam, Utrecht, Rotterdam of Den Haag, hybride of remote. Of plan een gesprek van 30 minuten.`
        : `Hire a frontend developer for React, Next.js or Angular in Amsterdam, Utrecht, Rotterdam or The Hague, hybrid or remote. Or book a 30-minute call directly.`,
      keywords: [
        ...CONTACT_CONTENT.SEO_FOCUS.SECONDARY,
        ...CONTACT_CONTENT.SEO_FOCUS.ACTION_FOCUSED,
        ...CONTACT_CONTENT.SEO_FOCUS.LOCAL_SEO,
        'Hybrid or remote frontend engineer'
      ],
      path: 'contact',
      lastModified: SITE_LAST_MODIFIED_DATE,
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
        ? 'Veelgestelde vragen | Freelance frontend developer'
        : 'Frequently asked questions | Freelance frontend developer',
      description: locale === 'nl'
        ? `Antwoorden over inzet, tarief (${RATE_TEXT.nl}), beschikbaarheid vanaf ${BUSINESS_PROFILE.AVAILABLE_FROM_DUTCH}, hybride werken in de Randstad en hoe een opdracht start.`
        : `Answers on engagements, the rate (${RATE_TEXT.en}), availability from ${BUSINESS_PROFILE.AVAILABLE_FROM}, hybrid work across the Randstad and how a contract starts.`,
      keywords: [
        ...FAQ_CONTENT.SEO_FOCUS.SECONDARY,
        ...FAQ_CONTENT.SEO_FOCUS.SERVICE_FOCUSED,
        'Frontend engineer rate excluding VAT',
        'Freelance frontend Randstad questions'
      ],
      path: 'faq',
      faqItems,
      lastModified: SITE_LAST_MODIFIED_DATE,
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
        ? `Plan een gesprek van 30 minuten | ${BUSINESS_PROFILE.NAME}`
        : `Book a 30-minute call | ${BUSINESS_PROFILE.NAME}`,
      description: locale === 'nl'
        ? `Kies een moment, laat je naam en e-mailadres achter, klaar. Een vrijblijvend gesprek van 30 minuten over je frontend, met de uitnodiging direct in je agenda.`
        : `Pick a moment, leave your name and email, done. A no-obligation 30-minute call about your frontend, with the invitation straight in your calendar.`,
      keywords: [
        ...BOOKING_CONTENT.SEO_FOCUS.SECONDARY,
        ...BOOKING_CONTENT.SEO_FOCUS.PRICING_FOCUSED,
        ...BOOKING_CONTENT.SEO_FOCUS.ACTION_FOCUSED,
        'Book a senior frontend engineer Randstad'
      ],
      path: 'book',
      lastModified: SITE_LAST_MODIFIED_DATE,
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
        ? 'Blog | React, Next.js en frontend-architectuur'
        : 'Blog | React, Next.js and frontend architecture',
      description: locale === 'nl'
        ? `Artikelen over React-architectuur, mappenstructuur, unit testing, routing en SEO, geschreven vanuit tien jaar productiewerk.`
        : `Articles on React architecture, folder structure, unit testing, routing and SEO, written from ten years of production work.`,
      keywords: [
        ...BLOG_CONTENT.SEO_FOCUS.SECONDARY,
        ...BLOG_CONTENT.SEO_FOCUS.TECHNICAL,
        ...BLOG_CONTENT.SEO_FOCUS.LOCAL,
        'Frontend best practices from production'
      ],
      path: 'blog',
      lastModified: SITE_LAST_MODIFIED_DATE,
      breadcrumbs: this.generateBreadcrumbs(['Blog'], locale)
    };

    return this.generatePageSEO(config);
  }

  /**
   * Create SEO configuration for an individual blog post.
   * Emits BlogPosting structured data with publish/modified dates and a
   * Home → Blog → <post> breadcrumb trail.
   */
  public createBlogPostSEO(
    locale: Locale,
    post: {
      slug: string;
      title: string;
      description: string;
      keywords: string[];
      category: string;
      publishedDate: string;
      updatedDate?: string;
    }
  ): {
    metadata: Metadata;
    jsonLd: JsonLdSchema[];
    structuredData: string;
  } {
    const localeBase =
      `${this.baseUrl}/${locale}`;

    const config: SEOPageConfig = {
      pageType: 'blog-post',
      locale,
      title: post.title,
      description: post.description,
      keywords: post.keywords,
      path: `blog/${post.slug}`,
      publishedTime: new Date(post.publishedDate),
      lastModified: new Date(post.updatedDate ?? post.publishedDate),
      section: post.category,
      breadcrumbs: [
        { name: 'Home', url: localeBase, position: 1 },
        { name: 'Blog', url: `${localeBase}/blog`, position: 2 },
        { name: post.title, url: `${localeBase}/blog/${post.slug}`, position: 3 }
      ]
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
        ? 'Privacyverklaring'
        : 'Privacy policy',
      description: locale === 'nl'
        ? `Hoe ${BUSINESS_PROFILE.COMPANY} persoonsgegevens verwerkt op hilmarvanderveen.com: welke gegevens, waarom, hoe lang en welke rechten je hebt onder de AVG.`
        : `How ${BUSINESS_PROFILE.COMPANY} processes personal data on hilmarvanderveen.com: which data, why, for how long and your rights under the GDPR.`,
      keywords: [
        ...PRIVACY_CONTENT.SEO_FOCUS.SECONDARY,
        ...PRIVACY_CONTENT.SEO_FOCUS.PROFESSIONAL
      ],
      path: 'privacy',
      lastModified: SITE_LAST_MODIFIED_DATE,
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
        ? 'React, Next.js en Angular developer | Freelance, Randstad'
        : 'React, Next.js and Angular developer | Freelance, Randstad',
      description: locale === 'nl'
        ? `Freelance frontend developer voor de pagina's die klanten zien, van specificatie tot productie in React, Next.js of Angular. Tests, Storybook en WCAG 2.2 AA.`
        : `Freelance frontend developer for the pages customers see, from specification to production in React, Next.js or Angular. Tests, Storybook and WCAG 2.2 AA.`,
      keywords: [
        ...FRONTEND_SERVICE_CONTENT.SEO_FOCUS.SECONDARY,
        ...FRONTEND_SERVICE_CONTENT.SEO_FOCUS.TECHNICAL,
        ...FRONTEND_SERVICE_CONTENT.SEO_FOCUS.SPECIALIZATIONS,
        'React developer Amsterdam Utrecht Rotterdam Den Haag'
      ],
      path: 'services/frontend',
      lastModified: SITE_LAST_MODIFIED_DATE,
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
        ? 'Full-stack developer | React met .NET of Kotlin | Randstad'
        : 'Full-stack developer | React with .NET or Kotlin | Randstad',
      description: locale === 'nl'
        ? `Frontend in React of Angular met bereik in de backend: .NET (C#) en Kotlin, GraphQL als contract. Eén engineer voor de hele keten, van API tot pagina.`
        : `Frontend in React or Angular with range in the backend: .NET (C#) and Kotlin, GraphQL as the contract. One engineer for the whole chain, from API to page.`,
      keywords: [
        ...FULLSTACK_SERVICE_CONTENT.SEO_FOCUS.SECONDARY,
        ...FULLSTACK_SERVICE_CONTENT.SEO_FOCUS.TECHNICAL,
        ...FULLSTACK_SERVICE_CONTENT.SEO_FOCUS.SPECIALIZATIONS,
        'Full-stack engineer Amsterdam Utrecht Rotterdam Den Haag'
      ],
      path: 'services/fullstack',
      lastModified: SITE_LAST_MODIFIED_DATE,
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
        ? 'Design system developer | Storybook, tokens | Randstad'
        : 'Design system developer | Storybook, tokens | Randstad',
      description: locale === 'nl'
        ? `Design systems die teams zelf onderhouden: React- of Angular-componenten, design tokens, Storybook, documentatie. Bij de Belastingdienst en Postcode Loterij.`
        : `Design systems teams maintain themselves: React or Angular components, design tokens, Storybook and docs. Built at the Belastingdienst and Postcode Loterij.`,
      keywords: [
        ...DESIGN_SYSTEMS_SERVICE_CONTENT.SEO_FOCUS.SECONDARY,
        ...DESIGN_SYSTEMS_SERVICE_CONTENT.SEO_FOCUS.TECHNICAL,
        ...DESIGN_SYSTEMS_SERVICE_CONTENT.SEO_FOCUS.SPECIALIZATIONS,
        'Design system engineer Amsterdam Utrecht Rotterdam Den Haag'
      ],
      path: 'services/design-systems',
      lastModified: SITE_LAST_MODIFIED_DATE,
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
        ? 'Frontend consultant | Architectuur en migratie | Randstad'
        : 'Frontend consultant | Architecture and migration | Randstad',
      description: locale === 'nl'
        ? `Architectuurreview, migratieplan van legacy naar modern en begeleiding van het team. Tien jaar senior ervaring bij bol.com, de Belastingdienst en Athlon.`
        : `Architecture review, a migration plan from legacy to modern and guidance for the team. Ten years senior at bol.com, the Belastingdienst and Athlon.`,
      keywords: [
        ...CONSULTING_SERVICE_CONTENT.SEO_FOCUS.SECONDARY,
        ...CONSULTING_SERVICE_CONTENT.SEO_FOCUS.TECHNICAL,
        ...CONSULTING_SERVICE_CONTENT.SEO_FOCUS.SPECIALIZATIONS,
        'Frontend consulting Amsterdam Utrecht Rotterdam Den Haag'
      ],
      path: 'services/consulting',
      lastModified: SITE_LAST_MODIFIED_DATE,
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
    // A single <script type="application/ld+json"> must contain exactly ONE
    // JSON value. Emit the schemas as a JSON array (each keeps its own
    // @context) — NOT multiple objects concatenated with newlines, which is
    // invalid JSON and stops parsers after the first object.
    return JSON.stringify(schemas, null, 2);
  }

  /**
   * Generate breadcrumbs for pages
   */
  private generateBreadcrumbs(pathSegments: string[], locale: Locale): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [];
    const baseUrl = `${this.baseUrl}/${locale}`;
    
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
    const baseUrl = `${this.baseUrl}/${locale}`;
    
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
  public generateSitemapData(
    dynamicPages: Array<{
      path: string;
      lastModified?: string;
      changeFrequency?: string;
      priority?: number;
    }> = []
  ): Array<{
    url: string;
    lastModified: string;
    changeFrequency: string;
    priority: number;
    alternates: Array<{ hreflang: string; href: string }>;
  }> {
    const staticPages = [
      '',
      'about',
      'services',
      'services/frontend',
      'services/fullstack',
      'services/design-systems',
      'services/consulting',
      'projects',
      'blog',
      'contact',
      'faq',
      'book'
    ];

    // Normalise static + dynamic pages into one descriptor list so the
    // locale/alternate loop below is identical for both kinds.
    const pageDescriptors: Array<{
      path: string;
      lastModified: string;
      changeFrequency: string;
      priority: number;
    }> = staticPages.map(page => {
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
      } else if (page === 'blog') {
        priority = 0.8;
        changeFrequency = 'weekly';
      }

      return { path: page, lastModified: SITE_LAST_MODIFIED, changeFrequency, priority };
    });

    dynamicPages.forEach(page => {
      pageDescriptors.push({
        path: page.path,
        lastModified: page.lastModified ?? SITE_LAST_MODIFIED,
        changeFrequency: page.changeFrequency ?? 'monthly',
        priority: page.priority ?? 0.7
      });
    });

    const sitemapData: Array<{
      url: string;
      lastModified: string;
      changeFrequency: string;
      priority: number;
      alternates: Array<{ hreflang: string; href: string }>;
    }> = [];

    pageDescriptors.forEach(descriptor => {
      const pagePath = descriptor.path ? `/${descriptor.path}` : '';

      LOCALE_CONFIG.SUPPORTED.forEach(locale => {
        const url = `${this.baseUrl}/${locale}${pagePath}`;

        const alternates: Array<{ hreflang: string; href: string }> = LOCALE_CONFIG.SUPPORTED.map(
          (alternateLocale) => ({
            hreflang: LOCALE_CONFIG.HREFLANG[alternateLocale],
            href: `${this.baseUrl}/${alternateLocale}${pagePath}`
          })
        );
        alternates.push({
          hreflang: 'x-default',
          href: `${this.baseUrl}/${LOCALE_CONFIG.DEFAULT}${pagePath}`
        });

        sitemapData.push({
          url,
          lastModified: descriptor.lastModified,
          changeFrequency: descriptor.changeFrequency,
          priority: descriptor.priority,
          alternates
        });
      });
    });

    return sitemapData;
  }
} 