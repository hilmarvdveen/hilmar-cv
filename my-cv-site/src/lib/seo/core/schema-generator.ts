
import type {
  JsonLdSchema,
  PersonSchema,
  OrganizationSchema,
  ProfessionalServiceSchema,
  WebSiteSchema,
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

const BUILD_TIME = new Date().toISOString();

export class SchemaGenerator {
  private readonly baseUrl: string;
  
  constructor(baseUrl: string = BUSINESS_PROFILE.CONTACT.WEBSITE) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  public generatePageSchema(config: SEOPageConfig): JsonLdSchema[] {
    const schemas: JsonLdSchema[] = [];
    
    schemas.push(this.generateWebSiteSchema(config.locale));
    schemas.push(this.generateOrganizationSchema(config.locale));
    schemas.push(this.generatePersonSchema(config.locale));
    schemas.push(this.generateWebPageSchema(config));

    switch (config.pageType) {
      case 'homepage':
        schemas.push(this.generateProfessionalServiceSchema(config.locale));
        break;
      case 'services':
        schemas.push(...this.generateServiceSchemas(config.locale));
        break;
      case 'faq':
        if (config.faqItems) {
          schemas.push(this.generateFAQPageSchema(config.faqItems, config));
        }
        break;
      case 'about':
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
    
    if (config.breadcrumbs && config.breadcrumbs.length > 0) {
      schemas.push(this.generateBreadcrumbSchema(config.breadcrumbs));
    }
    
    return schemas;
  }

  private siteDescription(): string {
    return `${BUSINESS_PROFILE.NAME}, freelance ${BUSINESS_PROFILE.TITLE.toLowerCase()} for React, Next.js, Angular and TypeScript. Legacy to modern without downtime, design systems and GraphQL contracts, across the Randstad and remote.`;
  }

  private webSiteId(locale: Locale): string {
    return `${this.baseUrl}/${locale}#website`;
  }

  private generateWebSiteSchema(locale: Locale): WebSiteSchema {
    return {
      '@context': 'https://schema.org',
      '@type': SCHEMA_TYPES.WEBSITE,
      '@id': this.webSiteId(locale),
      name: `${BUSINESS_PROFILE.NAME} | ${BUSINESS_PROFILE.TITLE}`,
      description: this.siteDescription(),
      url: `${this.baseUrl}/${locale}`,
      author: {
        '@type': SCHEMA_TYPES.PERSON,
        name: BUSINESS_PROFILE.NAME,
        url: `${this.baseUrl}/${locale}/about`
      },
      publisher: {
        '@type': SCHEMA_TYPES.ORGANIZATION,
        name: BUSINESS_PROFILE.COMPANY,
        url: `${this.baseUrl}/${locale}`
      },
      inLanguage: LOCALE_CONFIG.SUPPORTED.map(supported => LOCALE_CONFIG.HREFLANG[supported]),
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.baseUrl}/${locale}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  }

  private generateOrganizationSchema(locale: Locale): OrganizationSchema {
    return {
      '@context': 'https://schema.org',
      '@type': SCHEMA_TYPES.ORGANIZATION,
      name: BUSINESS_PROFILE.COMPANY,
      legalName: BUSINESS_PROFILE.REGISTRATION.LEGAL_NAME,
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'KvK',
        value: BUSINESS_PROFILE.REGISTRATION.KVK
      },
      description: `${BUSINESS_PROFILE.COMPANY} is the freelance practice of ${BUSINESS_PROFILE.NAME}: senior frontend engineering in React, Next.js, Angular and TypeScript for organisations in the Randstad and beyond.`,
      url: `${this.baseUrl}/${locale}`,
      logo: `${this.baseUrl}/images/logo_v1.png`,
      image: `${this.baseUrl}/images/logo_v1.png`,
      telephone: BUSINESS_PROFILE.CONTACT.PHONE,
      email: BUSINESS_PROFILE.CONTACT.EMAIL,
      foundingDate: BUSINESS_PROFILE.ESTABLISHED,
      founder: {
        '@type': SCHEMA_TYPES.PERSON,
        name: BUSINESS_PROFILE.NAME,
        url: `${this.baseUrl}/${locale}/about`
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: BUSINESS_PROFILE.REGISTERED_ADDRESS.CITY,
        addressRegion: BUSINESS_PROFILE.REGISTERED_ADDRESS.REGION,
        addressCountry: BUSINESS_PROFILE.REGISTERED_ADDRESS.COUNTRY_CODE
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
        BUSINESS_PROFILE.SOCIAL.GITHUB
      ]
    };
  }

  private generatePersonSchema(locale: Locale): PersonSchema {
    const nameParts = BUSINESS_PROFILE.NAME.split(' ');

    return {
      '@context': 'https://schema.org',
      '@type': SCHEMA_TYPES.PERSON,
      name: BUSINESS_PROFILE.NAME,
      givenName: nameParts[0],
      familyName: nameParts.slice(1).join(' '),
      jobTitle: BUSINESS_PROFILE.TITLE,
      description: `Freelance ${BUSINESS_PROFILE.TITLE.toLowerCase()} since 2016, ${BUSINESS_PROFILE.YEARS_EXPERIENCE} years senior in ${BUSINESS_PROFILE.SPECIALIZATION}. Engagements at bol.com, the Dutch Tax Administration, Nationale Postcode Loterij and Athlon. ${QUALIFICATIONS.EDUCATION}.`,
      url: `${this.baseUrl}/${locale}/about`,
      email: BUSINESS_PROFILE.CONTACT.EMAIL,
      telephone: BUSINESS_PROFILE.CONTACT.PHONE,
      image: `${this.baseUrl}/images/profile.jpg`,
      sameAs: [
        BUSINESS_PROFILE.SOCIAL.LINKEDIN,
        BUSINESS_PROFILE.SOCIAL.GITHUB
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: BUSINESS_PROFILE.REGISTERED_ADDRESS.CITY,
        addressRegion: BUSINESS_PROFILE.REGISTERED_ADDRESS.REGION,
        addressCountry: BUSINESS_PROFILE.REGISTERED_ADDRESS.COUNTRY_CODE
      },
      worksFor: {
        '@type': SCHEMA_TYPES.ORGANIZATION,
        name: BUSINESS_PROFILE.COMPANY,
        url: `${this.baseUrl}/${locale}`
      },
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'University of Amsterdam',
        url: 'https://www.uva.nl'
      },
      knowsAbout: [
        'React',
        'Next.js',
        'React Router server-side rendering',
        'Angular',
        'TypeScript',
        'JavaScript',
        'GraphQL',
        'Design systems and Storybook',
        'Frontend architecture',
        'Legacy migration and phased cut-over',
        'A/B experimentation',
        'Web accessibility (WCAG 2.2 AA)',
        'Web security',
        'Nx monorepos',
        'Kotlin and .NET backends'
      ],
      hasCredential: QUALIFICATIONS.CERTIFICATIONS.map(name => ({
        '@type': 'EducationalOccupationalCredential' as const,
        name
      })),
      nationality: 'Dutch'
    };
  }

  private serviceArea() {
    return {
      '@type': 'Place' as const,
      name: `${BUSINESS_PROFILE.SERVICE_AREA.NAME} (${BUSINESS_PROFILE.SERVICE_AREA.CITIES.join(', ')}), ${BUSINESS_PROFILE.LOCATION.COUNTRY}`,
      address: {
        '@type': 'PostalAddress' as const,
        addressLocality: BUSINESS_PROFILE.LOCATION.CITY,
        addressRegion: BUSINESS_PROFILE.LOCATION.REGION,
        addressCountry: BUSINESS_PROFILE.LOCATION.COUNTRY_CODE
      }
    };
  }

  private hourlyOffer(name: string, description: string) {
    return {
      '@type': 'Offer' as const,
      name,
      description,
      price: `${PRICING.HOURLY_RATE_MIN}`,
      priceCurrency: PRICING.CURRENCY,
      priceRange: `€${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}`,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': SCHEMA_TYPES.ORGANIZATION,
        name: BUSINESS_PROFILE.COMPANY
      }
    };
  }

  private generateProfessionalServiceSchema(locale: Locale): ProfessionalServiceSchema {
    return {
      '@context': 'https://schema.org',
      '@type': SCHEMA_TYPES.PROFESSIONAL_SERVICE,
      name: `${BUSINESS_PROFILE.NAME} | Freelance frontend engineering`,
      description: this.siteDescription(),
      provider: {
        '@type': SCHEMA_TYPES.ORGANIZATION,
        name: BUSINESS_PROFILE.COMPANY,
        url: `${this.baseUrl}/${locale}`
      },
      areaServed: this.serviceArea(),
      serviceType: 'Frontend Development',
      url: `${this.baseUrl}/${locale}/services`,
      telephone: BUSINESS_PROFILE.CONTACT.PHONE,
      email: BUSINESS_PROFILE.CONTACT.EMAIL,
      image: `${this.baseUrl}/images/profile.jpg`,
      priceRange: `€${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: BUSINESS_PROFILE.REGISTERED_ADDRESS.CITY,
        addressRegion: BUSINESS_PROFILE.REGISTERED_ADDRESS.REGION,
        addressCountry: BUSINESS_PROFILE.REGISTERED_ADDRESS.COUNTRY_CODE
      },
      offers: [
        this.hourlyOffer(
          'Frontend development in React, Next.js or Angular',
          'The pages customers see, from specification to production, with tests, Storybook and WCAG 2.2 AA. Hourly rate excluding VAT.'
        ),
        this.hourlyOffer(
          'Legacy to modern migration',
          'A behavioural contract drawn from the legacy code, a rebuild page by page, and a phased, reversible cut-over of live traffic. Hourly rate excluding VAT.'
        ),
        this.hourlyOffer(
          'Design systems',
          'Component libraries, design tokens, Storybook and documentation that the team maintains after handover. Hourly rate excluding VAT.'
        ),
        {
          '@type': 'Offer',
          name: '30-minute intro call',
          description: 'A no-obligation call about the surface that has to change and what it runs on.',
          price: '0',
          priceCurrency: PRICING.CURRENCY,
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': SCHEMA_TYPES.ORGANIZATION,
            name: BUSINESS_PROFILE.COMPANY
          }
        }
      ]
    };
  }

  private generateServiceSchemas(locale: Locale): ServiceSchema[] {
    const services = [
      {
        name: 'Frontend development in React, Next.js and Angular',
        description: 'Customer-facing pages from specification to production, with TypeScript, tests, Storybook and WCAG 2.2 AA accessibility.',
        serviceType: 'Web Development'
      },
      {
        name: 'Full-stack development with .NET or Kotlin',
        description: 'Frontend in React or Angular with backend range in .NET (C#) and Kotlin, GraphQL as the contract between the two.',
        serviceType: 'Web Development'
      },
      {
        name: 'Design systems',
        description: 'Component libraries, design tokens, Storybook and documentation that the team maintains after handover.',
        serviceType: 'Design System'
      },
      {
        name: 'Frontend architecture and migration consulting',
        description: 'Architecture review, a migration plan from legacy to modern, a reversible cut-over and guidance for the team.',
        serviceType: 'Consulting'
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
        url: `${this.baseUrl}/${locale}`
      },
      serviceType: service.serviceType,
      areaServed: this.serviceArea(),
      offers: {
        '@type': 'Offer',
        name: service.name,
        description: `${service.description} Hourly rate excluding VAT.`,
        price: `${PRICING.HOURLY_RATE_MIN}`,
        priceCurrency: PRICING.CURRENCY,
        priceRange: `€${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}`,
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': SCHEMA_TYPES.ORGANIZATION,
          name: BUSINESS_PROFILE.COMPANY
        }
      }
    }));
  }

  private generateWebPageSchema(config: SEOPageConfig): JsonLdSchema {
    const canonicalUrl = this.buildCanonicalUrl(config.path, config.locale);

    return {
      '@context': 'https://schema.org',
      '@type': SCHEMA_TYPES.WEBPAGE,
      name: config.title,
      description: config.description,
      url: canonicalUrl,
      isPartOf: {
        '@type': SCHEMA_TYPES.WEBSITE,
        '@id': this.webSiteId(config.locale)
      },
      author: {
        '@type': SCHEMA_TYPES.PERSON,
        name: BUSINESS_PROFILE.NAME,
        url: `${this.baseUrl}/${config.locale}/about`
      },
      publisher: {
        '@type': SCHEMA_TYPES.ORGANIZATION,
        name: BUSINESS_PROFILE.COMPANY,
        url: `${this.baseUrl}/${config.locale}`
      },
      datePublished: config.publishedTime?.toISOString() || BUILD_TIME,
      dateModified: config.lastModified?.toISOString() || BUILD_TIME,
      inLanguage: LOCALE_CONFIG.HREFLANG[config.locale]
    };
  }

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
        url: `${this.baseUrl}/${config.locale}/about`
      },
      about: {
        '@type': 'CreativeWork',
        name: 'Frontend case studies',
        description: `Delivered frontend work by ${BUSINESS_PROFILE.NAME} at bol.com, the Dutch Tax Administration, Nationale Postcode Loterij and Athlon`
      }
    };
  }

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
        url: `${this.baseUrl}/${config.locale}/about`
      },
      publisher: {
        '@type': SCHEMA_TYPES.ORGANIZATION,
        name: BUSINESS_PROFILE.COMPANY,
        url: `${this.baseUrl}/${config.locale}`
      },
      inLanguage: LOCALE_CONFIG.HREFLANG[config.locale]
    };
  }

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
        url: `${this.baseUrl}/${config.locale}/about`
      },
      publisher: {
        '@type': SCHEMA_TYPES.ORGANIZATION,
        name: BUSINESS_PROFILE.COMPANY,
        url: `${this.baseUrl}/${config.locale}`,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/images/logo_v1.png`,
          width: 600,
          height: 60
        }
      },
      datePublished: config.publishedTime?.toISOString() || BUILD_TIME,
      dateModified: config.lastModified?.toISOString() || BUILD_TIME,
      image: `${this.baseUrl}/${config.locale}/opengraph-image`,
      articleSection: config.section || 'Technology',
      keywords: config.keywords?.join(', '),
      inLanguage: LOCALE_CONFIG.HREFLANG[config.locale],
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl
      }
    };
  }

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

  private buildCanonicalUrl(path: string, locale: Locale): string {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${this.baseUrl}/${locale}/${cleanPath}`.replace(/\/+$/, '');
  }
} 