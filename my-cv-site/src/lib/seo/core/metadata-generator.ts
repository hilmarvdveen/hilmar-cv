
import { Metadata } from 'next';
import type { 
  SEOPageConfig, 
  Locale, 
  PageType, 
  OpenGraphMetadata,
  TwitterMetadata 
} from '../types/seo-types';
import { 
  BUSINESS_PROFILE, 
  PRICING,
  PRIMARY_KEYWORDS, 
  SEMANTIC_KEYWORDS,
  META_LIMITS,
  ROBOTS_DIRECTIVES,
  LOCALE_CONFIG,
  SOCIAL_OPTIMIZATION
} from '../constants/meta-constants';

export class MetadataGenerator {
  private readonly baseUrl: string;
  
  constructor(baseUrl: string = BUSINESS_PROFILE.CONTACT.WEBSITE) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  public generateMetadata(config: SEOPageConfig): Metadata {
    const canonicalUrl = this.buildCanonicalUrl(config.path, config.locale);
    const alternateUrls = this.generateAlternateUrls(config.path);
    
    return {
      metadataBase: new URL(this.baseUrl),
      title: this.optimizeTitle(config.title, config.pageType),
      description: this.optimizeDescription(config.description, config.pageType),
      keywords: this.buildKeywords(config.keywords, config.pageType, config.locale),
      
      authors: [{ 
        name: BUSINESS_PROFILE.NAME, 
        url: `${this.baseUrl}/${config.locale}/about`
      }],
      creator: BUSINESS_PROFILE.NAME,
      publisher: BUSINESS_PROFILE.COMPANY,
      
      robots: this.generateRobotsDirectives(config),
      
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
      
      openGraph: this.generateOpenGraphMetadata(config, canonicalUrl),
      
      twitter: this.generateTwitterMetadata(config),
      
      category: this.getCategoryForPageType(config.pageType),
      classification: 'Professional Services',
      
      other: this.generateExtendedMetaTags(config),
      
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      },
      
      manifest: '/site.webmanifest',
      applicationName: `${BUSINESS_PROFILE.NAME} - Portfolio`,
      generator: 'Next.js',
      referrer: 'origin-when-cross-origin',
      
      ...(config.publishedTime && {
        other: {
          ...this.generateExtendedMetaTags(config),
          'article:published_time': config.publishedTime.toISOString(),
        }
      }),
      ...(config.lastModified && {
        other: {
          ...this.generateExtendedMetaTags(config),
          'article:modified_time': config.lastModified.toISOString(),
        }
      }),
    };
  }

  private optimizeTitle(title: string, pageType: PageType): string {
    const max = META_LIMITS.TITLE.MAX;
    const suffix = `${this.getProfessionalSuffix(pageType)} | Amsterdam, Netherlands`;

    const withSuffix = `${title}${suffix}`;
    if (withSuffix.length <= max) return withSuffix;

    if (title.length <= max) return title;

    return title.slice(0, max - 1).replace(/\s+\S*$/, '').trimEnd() + '…';
  }

  private optimizeDescription(description: string, pageType: PageType): string {
    if (description.length > META_LIMITS.DESCRIPTION.MAX) {
      description = description.substring(0, META_LIMITS.DESCRIPTION.MAX - 3) + '...';
    }
    
    const valueProposition = this.getValueProposition(pageType);
    const enhancedDescription = `${description} ${valueProposition}`;
    
    if (enhancedDescription.length <= META_LIMITS.DESCRIPTION.MAX) {
      return enhancedDescription;
    }
    
    return description;
  }

  private buildKeywords(baseKeywords: string[], pageType: PageType, locale: Locale): string[] {
    const keywords = [...baseKeywords];
    
    keywords.push(...this.getPageTypeKeywords(pageType));
    
    keywords.push(...this.getSemanticKeywords(pageType));
    
    keywords.push(...this.getLocationKeywords(locale));
    
    keywords.push(...this.getProfessionalKeywords());
    
    const uniqueKeywords = [...new Set(keywords)];
    return uniqueKeywords.slice(0, META_LIMITS.KEYWORDS.OPTIMAL);
  }

  private generateRobotsDirectives(config: SEOPageConfig): string {
    const directives = [
      config.noIndex ? ROBOTS_DIRECTIVES.NOINDEX : ROBOTS_DIRECTIVES.INDEX,
      config.noFollow ? ROBOTS_DIRECTIVES.NOFOLLOW : ROBOTS_DIRECTIVES.FOLLOW,
      ROBOTS_DIRECTIVES.MAX_SNIPPET.MEDIUM,
      ROBOTS_DIRECTIVES.MAX_IMAGE_PREVIEW.LARGE,
      ROBOTS_DIRECTIVES.MAX_VIDEO_PREVIEW.UNLIMITED
    ];

    return directives.join(', ');
  }

  private generateOpenGraphMetadata(config: SEOPageConfig, canonicalUrl: string): OpenGraphMetadata {
    return {
      title: config.title,
      description: config.description,
      type: config.pageType === 'blog-post' ? 'article' : 'website',
      url: canonicalUrl,
      siteName: `${BUSINESS_PROFILE.NAME} - ${BUSINESS_PROFILE.TITLE}`,
      locale: LOCALE_CONFIG.HREFLANG[config.locale],
      alternateLocale: Object.values(LOCALE_CONFIG.HREFLANG).filter(
        locale => locale !== LOCALE_CONFIG.HREFLANG[config.locale]
      ),
      images: [
        {
          url: `${this.baseUrl}/${config.locale}/opengraph-image`,
          width: SOCIAL_OPTIMIZATION.OPEN_GRAPH.IMAGE_SIZE.WIDTH,
          height: SOCIAL_OPTIMIZATION.OPEN_GRAPH.IMAGE_SIZE.HEIGHT,
          alt: config.title,
        },
      ],
    };
  }

  private generateTwitterMetadata(config: SEOPageConfig): TwitterMetadata {
    return {
      card: SOCIAL_OPTIMIZATION.TWITTER.CARD,
      title: config.title,
      description: config.description,
      images: [`${this.baseUrl}/${config.locale}/twitter-image`],
    };
  }

  private generateExtendedMetaTags(config: SEOPageConfig): Record<string, string> {
    const languageCode = LOCALE_CONFIG.HREFLANG[config.locale];
    
    return {
      'geo.region': LOCALE_CONFIG.COUNTRY_TARGETING[config.locale],
      'geo.placename': `${BUSINESS_PROFILE.LOCATION.CITY}, ${BUSINESS_PROFILE.LOCATION.COUNTRY}`,
      'geo.position': `${BUSINESS_PROFILE.LOCATION.COORDINATES.LAT};${BUSINESS_PROFILE.LOCATION.COORDINATES.LNG}`,
      'ICBM': `${BUSINESS_PROFILE.LOCATION.COORDINATES.LAT}, ${BUSINESS_PROFILE.LOCATION.COORDINATES.LNG}`,
      
      'content-language': languageCode,
      'language': config.locale === 'nl' ? 'Dutch' : 'English',
      
      'profile:first_name': BUSINESS_PROFILE.NAME.split(' ')[0],
      'profile:last_name': BUSINESS_PROFILE.NAME.split(' ').slice(1).join(' '),
      'profile:username': 'hilmarvdveen',
      
      'business:contact_data:locality': BUSINESS_PROFILE.LOCATION.CITY,
      'business:contact_data:region': BUSINESS_PROFILE.LOCATION.REGION,
      'business:contact_data:country_name': BUSINESS_PROFILE.LOCATION.COUNTRY,
      
      'article:author': BUSINESS_PROFILE.NAME,
      'article:publisher': BUSINESS_PROFILE.COMPANY,
      'article:section': this.getCategoryForPageType(config.pageType),
      
      'generator': 'Next.js',
      'referrer': 'origin-when-cross-origin',
      
      'apple-mobile-web-app-title': BUSINESS_PROFILE.NAME,
      'application-name': `${BUSINESS_PROFILE.NAME} - Portfolio`,
      'msapplication-TileColor': '#2563eb',
      'theme-color': '#2563eb',
      
      'DC.title': config.title,
      'DC.creator': BUSINESS_PROFILE.NAME,
      'DC.subject': this.getCategoryForPageType(config.pageType),
      'DC.publisher': BUSINESS_PROFILE.COMPANY,
      'DC.language': config.locale,
      'DC.coverage': `${BUSINESS_PROFILE.LOCATION.CITY}, ${BUSINESS_PROFILE.LOCATION.COUNTRY}`,
      'DC.rights': `© ${new Date().getFullYear()} ${BUSINESS_PROFILE.NAME}`,
    };
  }

  private buildCanonicalUrl(path: string, locale: Locale): string {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const localePrefix = `/${locale}`;
    return `${this.baseUrl}${localePrefix}/${cleanPath}`.replace(/\/+$/, '');
  }

  private generateAlternateUrls(path: string): Record<string, string> {
    const alternates: Record<string, string> = {};
    
    LOCALE_CONFIG.SUPPORTED.forEach(locale => {
      const url = this.buildCanonicalUrl(path, locale);
      alternates[LOCALE_CONFIG.HREFLANG[locale]] = url;
    });
    
    alternates['x-default'] = this.buildCanonicalUrl(path, LOCALE_CONFIG.DEFAULT);
    
    return alternates;
  }

  private getProfessionalSuffix(pageType: PageType): string {
    const suffixes = {
      homepage: ` | ${BUSINESS_PROFILE.TITLE}`,
      about: ` | ${BUSINESS_PROFILE.YEARS_EXPERIENCE} Years Experience`,
      services: ' | Professional Frontend Services',
      projects: ' | Portfolio & Case Studies',
      contact: ' | Get In Touch',
      faq: ' | Frequently Asked Questions',
      blog: ' | Technical Blog',
      'blog-post': ` | ${BUSINESS_PROFILE.NAME}`,
      privacy: ' | Privacy Policy',
      booking: ' | Book Consultation'
    };
    
    return suffixes[pageType] || ` | ${BUSINESS_PROFILE.NAME}`;
  }

  private getValueProposition(pageType: PageType): string {
    const propositions = {
      homepage: `Expert React & Angular development in Amsterdam. ${BUSINESS_PROFILE.YEARS_EXPERIENCE} years experience.`,
      about: `MSc Physics graduate with ${BUSINESS_PROFILE.YEARS_EXPERIENCE} years frontend development experience.`,
      services: `Professional frontend development services €${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}/hour.`,
      projects: 'View real-world projects and case studies from major Dutch companies.',
      contact: 'Contact for professional frontend development consultation.',
      faq: 'Get answers to common questions about frontend development services.',
      blog: 'Technical insights and tutorials from a senior frontend developer.',
      'blog-post': `Expert insights from ${BUSINESS_PROFILE.YEARS_EXPERIENCE} years of frontend development.`,
      privacy: 'Transparent privacy policy and GDPR compliance information.',
      booking: 'Book a consultation with a senior frontend developer in Amsterdam.'
    };
    
    return propositions[pageType] || `Professional frontend development by ${BUSINESS_PROFILE.NAME}.`;
  }

  private getPageTypeKeywords(pageType: PageType): string[] {
    const keywordMap = {
      homepage: [...PRIMARY_KEYWORDS.TIER_1],
      about: ['Frontend Developer Biography', 'Amsterdam Developer Experience', 'React Angular Expert'],
      services: ['Frontend Development Services', 'React Development Amsterdam', 'Angular Consulting'],
      projects: ['Frontend Portfolio', 'React Projects Amsterdam', 'Web Development Case Studies'],
      contact: ['Contact Frontend Developer', 'Amsterdam Developer Hire', 'Frontend Consultation'],
      faq: ['Frontend Development FAQ', 'React Angular Questions', 'Developer Services Info'],
      blog: ['Frontend Development Blog', 'React Angular Tutorials', 'JavaScript Insights'],
      'blog-post': ['Technical Blog Post', 'Frontend Development Article', 'Programming Tutorial'],
      privacy: ['Privacy Policy', 'GDPR Compliance', 'Data Protection'],
      booking: ['Book Frontend Developer', 'Consultation Booking', 'Developer Meeting']
    };
    
    return keywordMap[pageType] || [];
  }

  private getSemanticKeywords(pageType: PageType): string[] {
    if (pageType === 'services') {
      return SEMANTIC_KEYWORDS.BUSINESS_TERMS.slice(0, 5);
    }
    if (pageType === 'projects') {
      return SEMANTIC_KEYWORDS.TECHNICAL_SKILLS.slice(0, 5);
    }
    return SEMANTIC_KEYWORDS.INDUSTRY_TERMS.slice(0, 3);
  }

  private getLocationKeywords(locale: Locale): string[] {
    const baseLocation = ['Amsterdam', 'Netherlands'];
    if (locale === 'nl') {
      return [...baseLocation, 'Nederland', 'Nederlandse ontwikkelaar'];
    }
    return [...baseLocation, 'Dutch developer', 'Netherlands programmer'];
  }

  private getProfessionalKeywords(): string[] {
    return [
      `${BUSINESS_PROFILE.YEARS_EXPERIENCE} years experience`,
      'MSc Physics',
      'University of Amsterdam',
      'Senior Developer',
      'Professional Frontend'
    ];
  }

  private getCategoryForPageType(pageType: PageType): string {
    const categories = {
      homepage: 'Professional Portfolio',
      about: 'Biography',
      services: 'Professional Services',
      projects: 'Portfolio',
      contact: 'Contact Information',
      faq: 'Support',
      blog: 'Technical Blog',
      'blog-post': 'Technical Article',
      privacy: 'Legal',
      booking: 'Consultation'
    };
    
    return categories[pageType] || 'Professional Services';
  }

} 