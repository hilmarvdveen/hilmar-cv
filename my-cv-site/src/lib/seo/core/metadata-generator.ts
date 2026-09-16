
import { Metadata } from 'next';
import { socialCardUrl } from '../socialCard';
import type {
  SEOPageConfig, 
  Locale, 
  PageType, 
  OpenGraphMetadata,
  TwitterMetadata 
} from '../types/seo-types';
import {
  BUSINESS_PROFILE,
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
      description: this.optimizeDescription(config.description),

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

      other: this.generateExtendedMetaTags(config),
      
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      },
      
      manifest: '/manifest.json',
      applicationName: BUSINESS_PROFILE.NAME,
      generator: 'Next.js',
      
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
    const suffix = this.getProfessionalSuffix(pageType);

    const withSuffix = `${title}${suffix}`;
    if (withSuffix.length <= max) return withSuffix;

    if (title.length <= max) return title;

    return title.slice(0, max - 1).replace(/\s+\S*$/, '').trimEnd() + '…';
  }

  private optimizeDescription(description: string): string {
    if (description.length <= META_LIMITS.DESCRIPTION.MAX) return description;
    return description.slice(0, META_LIMITS.DESCRIPTION.MAX - 1).replace(/\s+\S*$/, '').trimEnd() + '…';
  }

  private generateRobotsDirectives(config: SEOPageConfig): string {
    const directives = [
      config.noIndex ? ROBOTS_DIRECTIVES.NOINDEX : ROBOTS_DIRECTIVES.INDEX,
      config.noFollow ? ROBOTS_DIRECTIVES.NOFOLLOW : ROBOTS_DIRECTIVES.FOLLOW,
      ROBOTS_DIRECTIVES.MAX_SNIPPET.UNLIMITED,
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
      siteName: BUSINESS_PROFILE.NAME,
      locale: LOCALE_CONFIG.OPEN_GRAPH_LOCALE[config.locale],
      alternateLocale: Object.values(LOCALE_CONFIG.OPEN_GRAPH_LOCALE).filter(
        locale => locale !== LOCALE_CONFIG.OPEN_GRAPH_LOCALE[config.locale]
      ),
      images: [
        {
          url: socialCardUrl(this.baseUrl, config.locale, config.title),
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
      images: [socialCardUrl(this.baseUrl, config.locale, config.title)],
    };
  }

  private generateExtendedMetaTags(config: SEOPageConfig): Record<string, string> {
    return {
      'geo.region': LOCALE_CONFIG.COUNTRY_TARGETING[config.locale],
      'geo.placename': `${BUSINESS_PROFILE.LOCATION.CITY}, ${BUSINESS_PROFILE.LOCATION.COUNTRY}`,
      'geo.position': `${BUSINESS_PROFILE.LOCATION.COORDINATES.LAT};${BUSINESS_PROFILE.LOCATION.COORDINATES.LNG}`,

      'profile:first_name': BUSINESS_PROFILE.NAME.split(' ')[0],
      'profile:last_name': BUSINESS_PROFILE.NAME.split(' ').slice(1).join(' '),
      'profile:username': 'hilmarvdveen',
      
      'business:contact_data:locality': BUSINESS_PROFILE.LOCATION.CITY,
      'business:contact_data:region': BUSINESS_PROFILE.LOCATION.REGION,
      'business:contact_data:country_name': BUSINESS_PROFILE.LOCATION.COUNTRY,
      
      'article:author': BUSINESS_PROFILE.NAME,
      'article:publisher': BUSINESS_PROFILE.COMPANY,
      'article:section': this.getCategoryForPageType(config.pageType),
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
      homepage: '',
      about: ` | ${BUSINESS_PROFILE.YEARS_EXPERIENCE} years senior`,
      services: ` | ${BUSINESS_PROFILE.NAME}`,
      projects: ` | ${BUSINESS_PROFILE.NAME}`,
      contact: ` | ${BUSINESS_PROFILE.NAME}`,
      faq: ` | ${BUSINESS_PROFILE.NAME}`,
      blog: ` | ${BUSINESS_PROFILE.NAME}`,
      'blog-post': ` | ${BUSINESS_PROFILE.NAME}`,
      privacy: ` | ${BUSINESS_PROFILE.COMPANY}`,
      booking: ''
    };

    return suffixes[pageType] ?? ` | ${BUSINESS_PROFILE.NAME}`;
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