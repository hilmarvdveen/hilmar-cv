/**
 * Enterprise Schema.org Generator
 * Implements comprehensive structured data for Google 2024 best practices
 * Focus on E-E-A-T signals and professional service optimization
 */

import type {
  JsonLdSchema,
  PersonSchema,
  OrganizationSchema,
  ProfessionalServiceSchema,
  WebSiteSchema,
  WebPageSchema,
  FAQPageSchema,
  ServiceSchema,
  Locale,
  SEOPageConfig,
  FAQItem,
  BreadcrumbItem
} from '../types/seo-types';

import {
  BUSINESS_PROFILE,
  PRICING,
  QUALIFICATIONS,
  SCHEMA_TYPES,
  LOCALE_CONFIG
} from '../constants/meta-constants';

export class SchemaGenerator {
  private readonly baseUrl: string;
  
  constructor(baseUrl: string = BUSINESS_PROFILE.CONTACT.WEBSITE) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  /**
   * Generate comprehensive schema for a page
   */
  public generatePageSchema(config: SEOPageConfig): JsonLdSchema[] {
    const schemas: JsonLdSchema[] = [];
    
    // Always include website schema
    schemas.push(this.generateWebSiteSchema());
    
    // Always include organization schema
    schemas.push(this.generateOrganizationSchema());
    
    // Always include person schema (for E-E-A-T)
    schemas.push(this.generatePersonSchema());
    
    // Page-specific schema
    schemas.push(this.generateWebPageSchema(config));
    
    // Add page type specific schemas
    switch (config.pageType) {
      case 'homepage':
        schemas.push(this.generateProfessionalServiceSchema());
        break;
      case 'services':
        schemas.push(...this.generateServiceSchemas());
        break;
      case 'faq':
        if (config.faqItems) {
          schemas.push(this.generateFAQPageSchema(config.faqItems, config));
        }
        break;
      case 'about':
        // Enhanced person schema is already included
        break;
      case 'contact':
        schemas.push(this.generateContactPageSchema(config));
        break;
      case 'projects':
        schemas.push(this.generatePortfolioSchema(config));
        break;
      case 'blog':
        schemas.push(this.generateBlogSchema(config));
        break;
      case 'blog-post':
        schemas.push(this.generateBlogPostSchema(config));
        break;
    }
    
    // Add breadcrumbs if available
    if (config.breadcrumbs && config.breadcrumbs.length > 0) {
      schemas.push(this.generateBreadcrumbSchema(config.breadcrumbs));
    }
    
    return schemas;
  }

  /**
   * Generate website schema with search action
   */
  private generateWebSiteSchema(): WebSiteSchema {
    return {
      '@context': 'https://schema.org',
      '@type': SCHEMA_TYPES.WEBSITE,
      name: `${BUSINESS_PROFILE.NAME} - ${BUSINESS_PROFILE.TITLE}`,
      description: `Professional frontend development services by ${BUSINESS_PROFILE.NAME}. Expert in React, Angular, Next.js, and TypeScript development in Amsterdam, Netherlands.`,
      url: this.baseUrl,
      author: {
        '@type': SCHEMA_TYPES.PERSON,
        name: BUSINESS_PROFILE.NAME,
        url: `${this.baseUrl}/en/about`
      },
      publisher: {
        '@type': SCHEMA_TYPES.ORGANIZATION,
        name: BUSINESS_PROFILE.COMPANY,
        url: this.baseUrl
      },
      inLanguage: LOCALE_CONFIG.SUPPORTED.map(locale => LOCALE_CONFIG.HREFLANG[locale]),
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  }

  /**
   * Generate organization schema for business
   */
  private generateOrganizationSchema(): OrganizationSchema {
    return {
      '@context': 'https://schema.org',
      '@type': SCHEMA_TYPES.ORGANIZATION,
      name: BUSINESS_PROFILE.COMPANY,
      description: `${BUSINESS_PROFILE.COMPANY} provides professional frontend development services specializing in React, Angular, and Next.js applications.`,
      url: this.baseUrl,
      logo: `${this.baseUrl}/images/logo.png`,
      foundingDate: BUSINESS_PROFILE.ESTABLISHED,
      founder: {
        '@type': SCHEMA_TYPES.PERSON,
        name: BUSINESS_PROFILE.NAME,
        url: `${this.baseUrl}/en/about`
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: BUSINESS_PROFILE.LOCATION.CITY,
        addressRegion: BUSINESS_PROFILE.LOCATION.REGION,
        addressCountry: BUSINESS_PROFILE.LOCATION.COUNTRY_CODE
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: BUSINESS_PROFILE.CONTACT.EMAIL,
        telephone: BUSINESS_PROFILE.CONTACT.PHONE,
        contactType: 'customer service',
        areaServed: BUSINESS_PROFILE.LOCATION.COUNTRY_CODE,
        availableLanguage: ['Dutch', 'English']
      },
      sameAs: [
        BUSINESS_PROFILE.SOCIAL.LINKEDIN,
        BUSINESS_PROFILE.SOCIAL.GITHUB,
        BUSINESS_PROFILE.SOCIAL.TWITTER
      ]
    };
  }

  /**
   * Generate comprehensive person schema with E-E-A-T signals
   */
  private generatePersonSchema(): PersonSchema {
    const nameParts = BUSINESS_PROFILE.NAME.split(' ');
    
    return {
      '@context': 'https://schema.org',
      '@type': SCHEMA_TYPES.PERSON,
      name: BUSINESS_PROFILE.NAME,
      givenName: nameParts[0],
      familyName: nameParts.slice(1).join(' '),
      jobTitle: BUSINESS_PROFILE.TITLE,
      description: `${BUSINESS_PROFILE.TITLE} with ${BUSINESS_PROFILE.YEARS_EXPERIENCE} years of experience specializing in ${BUSINESS_PROFILE.SPECIALIZATION}. ${QUALIFICATIONS.EDUCATION} graduate with proven track record at major Dutch companies.`,
      url: `${this.baseUrl}/en/about`,
      email: BUSINESS_PROFILE.CONTACT.EMAIL,
      telephone: BUSINESS_PROFILE.CONTACT.PHONE,
      image: `${this.baseUrl}/images/hilmar-profile.jpg`,
      sameAs: [
        BUSINESS_PROFILE.SOCIAL.LINKEDIN,
        BUSINESS_PROFILE.SOCIAL.GITHUB,
        BUSINESS_PROFILE.SOCIAL.TWITTER
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: BUSINESS_PROFILE.LOCATION.CITY,
        addressRegion: BUSINESS_PROFILE.LOCATION.REGION,
        addressCountry: BUSINESS_PROFILE.LOCATION.COUNTRY_CODE
      },
      worksFor: {
        '@type': SCHEMA_TYPES.ORGANIZATION,
        name: BUSINESS_PROFILE.COMPANY,
        url: this.baseUrl
      },
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'University of Amsterdam',
        url: 'https://www.uva.nl'
      },
      knowsAbout: [
        'React Development',
        'Angular Development',
        'Next.js Development',
        'TypeScript Programming',
        'JavaScript Programming',
        'Frontend Architecture',
        'Web Performance Optimization',
        'Progressive Web Apps',
        'Component Libraries',
        'State Management',
        'GraphQL Implementation',
        'Micro-frontends',
        'User Interface Design',
        'Web Accessibility',
        'Cross-browser Compatibility'
      ],
             hasCredential: [...QUALIFICATIONS.CERTIFICATIONS],
      nationality: 'Dutch'
    };
  }

  /**
   * Generate professional service schema
   */
  private generateProfessionalServiceSchema(): ProfessionalServiceSchema {
    return {
      '@context': 'https://schema.org',
      '@type': SCHEMA_TYPES.PROFESSIONAL_SERVICE,
      name: `${BUSINESS_PROFILE.NAME} - Frontend Development Services`,
      description: `Professional frontend development services specializing in React, Angular, and Next.js. ${BUSINESS_PROFILE.YEARS_EXPERIENCE} years of experience delivering high-quality web applications.`,
      provider: {
        '@type': SCHEMA_TYPES.ORGANIZATION,
        name: BUSINESS_PROFILE.COMPANY,
        url: this.baseUrl
      },
      areaServed: {
        '@type': 'Place',
        name: BUSINESS_PROFILE.LOCATION.COUNTRY,
        address: {
          '@type': 'PostalAddress',
          addressLocality: BUSINESS_PROFILE.LOCATION.CITY,
          addressRegion: BUSINESS_PROFILE.LOCATION.REGION,
          addressCountry: BUSINESS_PROFILE.LOCATION.COUNTRY_CODE
        }
      },
      serviceType: 'Frontend Development',
      offers: [
        {
          '@type': 'Offer',
          name: 'React Development Services',
          description: 'Professional React application development with modern hooks, state management, and performance optimization.',
          price: `${PRICING.HOURLY_RATE_MIN}`,
          priceCurrency: PRICING.CURRENCY,
          priceRange: `€${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}`,
          availability: 'InStock',
          seller: {
            '@type': SCHEMA_TYPES.ORGANIZATION,
            name: BUSINESS_PROFILE.COMPANY
          }
        },
        {
          '@type': 'Offer',
          name: 'Angular Development Services',
          description: 'Expert Angular development with TypeScript, dependency injection, and enterprise-grade architecture.',
          price: `${PRICING.HOURLY_RATE_MIN}`,
          priceCurrency: PRICING.CURRENCY,
          priceRange: `€${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}`,
          availability: 'InStock',
          seller: {
            '@type': SCHEMA_TYPES.ORGANIZATION,
            name: BUSINESS_PROFILE.COMPANY
          }
        },
        {
          '@type': 'Offer',
          name: 'Next.js Development Services',
          description: 'Modern Next.js development with server-side rendering, static generation, and optimal performance.',
          price: `${PRICING.HOURLY_RATE_MIN}`,
          priceCurrency: PRICING.CURRENCY,
          priceRange: `€${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}`,
          availability: 'InStock',
          seller: {
            '@type': SCHEMA_TYPES.ORGANIZATION,
            name: BUSINESS_PROFILE.COMPANY
          }
        },
        {
          '@type': 'Offer',
          name: 'Frontend Consultation',
          description: 'Technical consultation and architecture review for frontend projects.',
          price: `${PRICING.CONSULTATION_RATE}`,
          priceCurrency: PRICING.CURRENCY,
          availability: 'InStock',
          seller: {
            '@type': SCHEMA_TYPES.ORGANIZATION,
            name: BUSINESS_PROFILE.COMPANY
          }
        }
      ]
    };
  }

  /**
   * Generate service schemas for individual services
   */
  private generateServiceSchemas(): ServiceSchema[] {
    const services = [
      {
        name: 'React Development',
        description: 'Professional React application development with modern practices, hooks, and state management solutions.',
        serviceType: 'Web Development'
      },
      {
        name: 'Angular Development',
        description: 'Enterprise Angular development with TypeScript, dependency injection, and scalable architecture.',
        serviceType: 'Web Development'
      },
      {
        name: 'Next.js Development',
        description: 'Modern Next.js development with SSR, SSG, and optimal performance optimization.',
        serviceType: 'Web Development'
      },
      {
        name: 'Frontend Consulting',
        description: 'Technical consultation, code reviews, and architecture guidance for frontend projects.',
        serviceType: 'Consulting'
      },
      {
        name: 'Performance Optimization',
        description: 'Web performance optimization, Core Web Vitals improvement, and loading speed enhancement.',
        serviceType: 'Optimization'
      }
    ];

    return services.map(service => ({
      '@context': 'https://schema.org',
      '@type': SCHEMA_TYPES.SERVICE,
      name: service.name,
      description: service.description,
      provider: {
        '@type': SCHEMA_TYPES.ORGANIZATION,
        name: BUSINESS_PROFILE.COMPANY,
        url: this.baseUrl
      },
      serviceType: service.serviceType,
      areaServed: {
        '@type': 'Place',
        name: BUSINESS_PROFILE.LOCATION.COUNTRY,
        address: {
          '@type': 'PostalAddress',
          addressLocality: BUSINESS_PROFILE.LOCATION.CITY,
          addressRegion: BUSINESS_PROFILE.LOCATION.REGION,
          addressCountry: BUSINESS_PROFILE.LOCATION.COUNTRY_CODE
        }
      },
      offers: {
        '@type': 'Offer',
        name: service.name,
        description: service.description,
        price: `${PRICING.HOURLY_RATE_MIN}`,
        priceCurrency: PRICING.CURRENCY,
        priceRange: `€${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}`,
        availability: 'InStock',
        seller: {
          '@type': SCHEMA_TYPES.ORGANIZATION,
          name: BUSINESS_PROFILE.COMPANY
        }
      }
    }));
  }

  /**
   * Generate webpage schema for any page
   */
  private generateWebPageSchema(config: SEOPageConfig): WebPageSchema {
    const canonicalUrl = this.buildCanonicalUrl(config.path, config.locale);
    
    return {
      '@context': 'https://schema.org',
      '@type': SCHEMA_TYPES.WEBPAGE,
      name: config.title,
      description: config.description,
      url: canonicalUrl,
      isPartOf: {
        '@context': 'https://schema.org',
        '@type': SCHEMA_TYPES.WEBSITE,
        name: `${BUSINESS_PROFILE.NAME} - ${BUSINESS_PROFILE.TITLE}`,
        description: `Professional frontend development services by ${BUSINESS_PROFILE.NAME}, specializing in React, Angular, and Next.js development in Amsterdam.`,
        url: this.baseUrl,
        author: {
          '@type': SCHEMA_TYPES.PERSON,
          name: BUSINESS_PROFILE.NAME,
          url: `${this.baseUrl}/en/about`
        },
        publisher: {
          '@type': SCHEMA_TYPES.ORGANIZATION,
          name: BUSINESS_PROFILE.COMPANY,
          url: this.baseUrl
        },
        inLanguage: [LOCALE_CONFIG.HREFLANG['en'], LOCALE_CONFIG.HREFLANG['nl']]
      },
      author: {
        '@type': SCHEMA_TYPES.PERSON,
        name: BUSINESS_PROFILE.NAME,
        url: `${this.baseUrl}/en/about`
      },
      publisher: {
        '@type': SCHEMA_TYPES.ORGANIZATION,
        name: BUSINESS_PROFILE.COMPANY,
        url: this.baseUrl
      },
      datePublished: config.publishedTime?.toISOString() || new Date().toISOString(),
      dateModified: config.lastModified?.toISOString() || new Date().toISOString(),
      inLanguage: LOCALE_CONFIG.HREFLANG[config.locale]
    };
  }

  /**
   * Generate FAQ page schema
   */
  private generateFAQPageSchema(faqItems: FAQItem[], config: SEOPageConfig): FAQPageSchema {
    const canonicalUrl = this.buildCanonicalUrl(config.path, config.locale);
    
    return {
      '@context': 'https://schema.org',
      '@type': SCHEMA_TYPES.FAQ_PAGE,
      name: config.title,
      description: config.description,
      url: canonicalUrl,
      mainEntity: faqItems.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    };
  }

  /**
   * Generate contact page schema
   */
  private generateContactPageSchema(config: SEOPageConfig): JsonLdSchema {
    const canonicalUrl = this.buildCanonicalUrl(config.path, config.locale);
    
    return {
      '@context': 'https://schema.org',
      '@type': SCHEMA_TYPES.CONTACT_PAGE,
      name: config.title,
      description: config.description,
      url: canonicalUrl,
      mainEntity: {
        '@type': SCHEMA_TYPES.ORGANIZATION,
        name: BUSINESS_PROFILE.COMPANY,
        contactPoint: {
          '@type': 'ContactPoint',
          email: BUSINESS_PROFILE.CONTACT.EMAIL,
          telephone: BUSINESS_PROFILE.CONTACT.PHONE,
          contactType: 'customer service',
          areaServed: BUSINESS_PROFILE.LOCATION.COUNTRY_CODE,
          availableLanguage: ['Dutch', 'English']
        }
      }
    };
  }

  /**
   * Generate portfolio schema
   */
  private generatePortfolioSchema(config: SEOPageConfig): JsonLdSchema {
    const canonicalUrl = this.buildCanonicalUrl(config.path, config.locale);
    
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: config.title,
      description: config.description,
      url: canonicalUrl,
      author: {
        '@type': SCHEMA_TYPES.PERSON,
        name: BUSINESS_PROFILE.NAME,
        url: `${this.baseUrl}/en/about`
      },
      about: {
        '@type': 'CreativeWork',
        name: 'Frontend Development Portfolio',
        description: `Portfolio of frontend development projects by ${BUSINESS_PROFILE.NAME}`
      }
    };
  }

  /**
   * Generate blog schema
   */
  private generateBlogSchema(config: SEOPageConfig): JsonLdSchema {
    const canonicalUrl = this.buildCanonicalUrl(config.path, config.locale);
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: config.title,
      description: config.description,
      url: canonicalUrl,
      author: {
        '@type': SCHEMA_TYPES.PERSON,
        name: BUSINESS_PROFILE.NAME,
        url: `${this.baseUrl}/en/about`
      },
      publisher: {
        '@type': SCHEMA_TYPES.ORGANIZATION,
        name: BUSINESS_PROFILE.COMPANY,
        url: this.baseUrl
      },
      inLanguage: LOCALE_CONFIG.HREFLANG[config.locale]
    };
  }

  /**
   * Generate blog post schema
   */
  private generateBlogPostSchema(config: SEOPageConfig): JsonLdSchema {
    const canonicalUrl = this.buildCanonicalUrl(config.path, config.locale);
    
    return {
      '@context': 'https://schema.org',
      '@type': SCHEMA_TYPES.BLOG_POSTING,
      headline: config.title,
      description: config.description,
      url: canonicalUrl,
      author: {
        '@type': SCHEMA_TYPES.PERSON,
        name: BUSINESS_PROFILE.NAME,
        url: `${this.baseUrl}/en/about`
      },
      publisher: {
        '@type': SCHEMA_TYPES.ORGANIZATION,
        name: BUSINESS_PROFILE.COMPANY,
        url: this.baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/images/logo.png`,
          width: 600,
          height: 60
        }
      },
      datePublished: config.publishedTime?.toISOString() || new Date().toISOString(),
      dateModified: config.lastModified?.toISOString() || new Date().toISOString(),
      image: `${this.baseUrl}/images/og/blog-post.jpg`,
      articleSection: config.section || 'Technology',
      keywords: config.keywords?.join(', '),
      inLanguage: LOCALE_CONFIG.HREFLANG[config.locale],
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl
      }
    };
  }

  /**
   * Generate breadcrumb schema
   */
  private generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]): JsonLdSchema {
    return {
      '@context': 'https://schema.org',
      '@type': SCHEMA_TYPES.BREADCRUMB_LIST,
      itemListElement: breadcrumbs.map(item => ({
        '@type': 'ListItem',
        position: item.position,
        name: item.name,
        item: item.url
      }))
    };
  }

  /**
   * Build canonical URL helper
   */
  private buildCanonicalUrl(path: string, locale: Locale): string {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const localePrefix = locale === LOCALE_CONFIG.DEFAULT ? '' : `/${locale}`;
    return `${this.baseUrl}${localePrefix}/${cleanPath}`.replace(/\/+$/, '') || `${this.baseUrl}${localePrefix}`;
  }
} 