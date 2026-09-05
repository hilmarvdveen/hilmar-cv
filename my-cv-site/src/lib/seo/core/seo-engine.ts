
import { MetadataGenerator } from './metadata-generator';
import { SchemaGenerator } from './schema-generator';
import type {
  SEOPageConfig,
  JsonLdSchema,
  Locale,
  BreadcrumbItem,
  FAQItem
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

const SITE_LAST_MODIFIED = process.env.NEXT_PUBLIC_BUILD_DATE ?? new Date().toISOString();
const SITE_LAST_MODIFIED_DATE = new Date(SITE_LAST_MODIFIED);
const DUTCH_BREADCRUMB_LABELS: Record<string, string> = {
  About: 'Over mij',
  Services: 'Diensten',
  Projects: 'Projecten',
  Contact: 'Contact',
  FAQ: 'Veelgestelde vragen',
  Book: 'Afspraak boeken',
  Blog: 'Blog',
  Privacy: 'Privacy'
};

export class SEOEngine {
  private metadataGenerator: MetadataGenerator;
  private schemaGenerator: SchemaGenerator;
  private readonly baseUrl: string;

  constructor(baseUrl: string = BUSINESS_PROFILE.CONTACT.WEBSITE) {
    this.baseUrl = baseUrl;
    this.metadataGenerator = new MetadataGenerator(baseUrl);
    this.schemaGenerator = new SchemaGenerator(baseUrl);
  }

  public generatePageSEO(config: SEOPageConfig): {
    metadata: Metadata;
    jsonLd: JsonLdSchema[];
    structuredData: string;
  } {
    const metadata = this.metadataGenerator.generateMetadata(config);
    
    const jsonLd = this.schemaGenerator.generatePageSchema(config);
    
    const structuredData = this.generateStructuredDataScript(jsonLd);

    return {
      metadata,
      jsonLd,
      structuredData,
    };
  }

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
        ? `Frontend developer inhuren voor React, Next.js of Angular: legacy naar modern zonder onderbreking en design systems. ${RATE_TEXT.nl}.`
        : `Hire a frontend developer for React, Next.js or Angular: legacy to modern without interruption and design systems. ${RATE_TEXT.en}.`,
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
        ? `Inzet, tarief (${RATE_TEXT.nl}), beschikbaarheid vanaf ${BUSINESS_PROFILE.AVAILABLE_FROM_DUTCH}, hybride werken in de Randstad en hoe een opdracht start.`
        : `Engagements, the rate (${RATE_TEXT.en}), availability from ${BUSINESS_PROFILE.AVAILABLE_FROM}, hybrid work in the Randstad and how a contract starts.`,
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
      lastModified: SITE_LAST_MODIFIED_DATE
    };

    return this.generatePageSEO(config);
  }

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
      lastModified: SITE_LAST_MODIFIED_DATE
    };

    return this.generatePageSEO(config);
  }

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
      lastModified: SITE_LAST_MODIFIED_DATE
    };

    return this.generatePageSEO(config);
  }

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
      lastModified: SITE_LAST_MODIFIED_DATE
    };

    return this.generatePageSEO(config);
  }

  private generateStructuredDataScript(schemas: JsonLdSchema[]): string {
    return JSON.stringify(schemas, null, 2);
  }

  private generateBreadcrumbs(pathSegments: string[], locale: Locale): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [];
    const baseUrl = `${this.baseUrl}/${locale}`;

    breadcrumbs.push({
      name: 'Home',
      url: baseUrl,
      position: 1
    });

    let currentPath = baseUrl;
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment.toLowerCase().replace(/\s+/g, '-')}`;
      breadcrumbs.push({
        name: locale === 'nl' ? DUTCH_BREADCRUMB_LABELS[segment] ?? segment : segment,
        url: currentPath,
        position: index + 2
      });
    });

    return breadcrumbs;
  }

  private generateHomepageBreadcrumbs(locale: Locale): BreadcrumbItem[] {
    const baseUrl = `${this.baseUrl}/${locale}`;
    
    return [{
      name: BUSINESS_PROFILE.NAME,
      url: baseUrl,
      position: 1
    }];
  }

  public validateSEOConfig(config: SEOPageConfig): {
    isValid: boolean;
    warnings: string[];
    errors: string[];
  } {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (config.title.length < 30) {
      warnings.push('Title is shorter than 30 characters - consider adding more descriptive text');
    }
    if (config.title.length > 60) {
      errors.push('Title exceeds 60 characters and may be truncated in search results');
    }

    if (config.description.length < 120) {
      warnings.push('Description is shorter than 120 characters - consider adding more detail');
    }
    if (config.description.length > 160) {
      errors.push('Description exceeds 160 characters and may be truncated in search results');
    }

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
      'book',
      'privacy',
      'terms',
      'cookies',
      'disclaimer'
    ];

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
        priority = 0.9;
        changeFrequency = 'monthly';
      } else if (page === 'contact' || page === 'book') {
        priority = 0.9;
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