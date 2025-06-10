/**
 * Enterprise Metadata Generator
 * Implements Google 2024 SEO best practices with E-E-A-T focus
 * Comprehensive metadata generation for all page types
 */

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
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Generate comprehensive metadata for a page
   */
  public generateMetadata(config: SEOPageConfig): Metadata {
    const canonicalUrl = this.buildCanonicalUrl(config.path, config.locale);
    const alternateUrls = this.generateAlternateUrls(config.path);
    
    return {
      metadataBase: new URL(this.baseUrl),
      title: this.optimizeTitle(config.title, config.pageType),
      description: this.optimizeDescription(config.description, config.pageType),
      keywords: this.buildKeywords(config.keywords, config.pageType, config.locale),
      
      // Author and creator information (E-E-A-T signals)
      authors: [{ 
        name: BUSINESS_PROFILE.NAME, 
        url: `${this.baseUrl}/${config.locale}/about`
      }],
      creator: BUSINESS_PROFILE.NAME,
      publisher: BUSINESS_PROFILE.COMPANY,
      
      // Advanced robots directives
      robots: this.generateRobotsDirectives(config),
      
      // Canonical and language alternates (critical for duplicate content prevention)
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
      
      // Enhanced Open Graph
      openGraph: this.generateOpenGraphMetadata(config, canonicalUrl),
      
      // Enhanced Twitter metadata
      twitter: this.generateTwitterMetadata(config),
      
      // Additional metadata for better search understanding
      category: this.getCategoryForPageType(config.pageType),
      classification: 'Professional Services',
      
      // Extended meta tags for enhanced SEO
      other: this.generateExtendedMetaTags(config),
      
      // Verification tags
      verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      },
      
      // App metadata
      manifest: '/site.webmanifest',
      applicationName: `${BUSINESS_PROFILE.NAME} - Portfolio`,
      generator: 'Next.js',
      referrer: 'origin-when-cross-origin',
      
      // Content timing
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

  /**
   * Optimize title with E-E-A-T signals and location targeting
   */
  private optimizeTitle(title: string, pageType: PageType): string {
    // Ensure title is within optimal length
    if (title.length > META_LIMITS.TITLE.MAX) {
      title = title.substring(0, META_LIMITS.TITLE.MAX - 3) + '...';
    }
    
    // Add E-E-A-T signals for professional credibility
    const professionalSuffix = this.getProfessionalSuffix(pageType);
    const locationSuffix = ' | Amsterdam, Netherlands';
    
    const optimizedTitle = `${title}${professionalSuffix}${locationSuffix}`;
    
    // Final length check
    if (optimizedTitle.length > META_LIMITS.TITLE.MAX) {
      return `${title} | ${BUSINESS_PROFILE.NAME}`;
    }
    
    return optimizedTitle;
  }

  /**
   * Optimize description with semantic keywords and value proposition
   */
  private optimizeDescription(description: string, pageType: PageType): string {
    // Ensure description is within optimal length
    if (description.length > META_LIMITS.DESCRIPTION.MAX) {
      description = description.substring(0, META_LIMITS.DESCRIPTION.MAX - 3) + '...';
    }
    
    // Add value proposition if space allows
    const valueProposition = this.getValueProposition(pageType);
    const enhancedDescription = `${description} ${valueProposition}`;
    
    if (enhancedDescription.length <= META_LIMITS.DESCRIPTION.MAX) {
      return enhancedDescription;
    }
    
    return description;
  }

  /**
   * Build comprehensive keyword list with semantic targeting
   */
  private buildKeywords(baseKeywords: string[], pageType: PageType, locale: Locale): string[] {
    const keywords = [...baseKeywords];
    
    // Add page-specific primary keywords
    keywords.push(...this.getPageTypeKeywords(pageType));
    
    // Add semantic keywords based on content
    keywords.push(...this.getSemanticKeywords(pageType));
    
    // Add location-based keywords for local SEO
    keywords.push(...this.getLocationKeywords(locale));
    
    // Add professional qualifications (E-E-A-T)
    keywords.push(...this.getProfessionalKeywords());
    
    // Remove duplicates and limit to optimal count
    const uniqueKeywords = [...new Set(keywords)];
    return uniqueKeywords.slice(0, META_LIMITS.KEYWORDS.OPTIMAL);
  }

  /**
   * Generate comprehensive robots directives
   */
  private generateRobotsDirectives(config: SEOPageConfig): string {
    const directives = [
      config.noIndex ? ROBOTS_DIRECTIVES.NOINDEX : ROBOTS_DIRECTIVES.INDEX,
      config.noFollow ? ROBOTS_DIRECTIVES.NOFOLLOW : ROBOTS_DIRECTIVES.FOLLOW,
      ROBOTS_DIRECTIVES.MAX_SNIPPET.MEDIUM,
      ROBOTS_DIRECTIVES.MAX_IMAGE_PREVIEW.STANDARD,
      ROBOTS_DIRECTIVES.MAX_VIDEO_PREVIEW.UNLIMITED
    ];
    
    // Note: noarchive directive is deprecated and no longer used by Google
    // All pages now use consistent max-snippet controls for better UX
    
    return directives.join(', ');
  }

  /**
   * Generate Open Graph metadata with proper image optimization
   */
  private generateOpenGraphMetadata(config: SEOPageConfig, canonicalUrl: string): OpenGraphMetadata {
    const imageUrl = this.getOptimizedImageUrl(config.pageType);
    
    return {
      title: config.title,
      description: config.description,
      type: config.pageType === 'blog-post' ? 'article' : 'website',
      url: canonicalUrl,
      siteName: `${BUSINESS_PROFILE.NAME} - ${BUSINESS_PROFILE.TITLE}`,
      locale: LOCALE_CONFIG.HREFLANG[config.locale],
      alternateLocales: Object.values(LOCALE_CONFIG.HREFLANG).filter(
        locale => locale !== LOCALE_CONFIG.HREFLANG[config.locale]
      ),
      ...(imageUrl && {
        image: imageUrl,
        imageAlt: `${config.title} - ${BUSINESS_PROFILE.NAME}`,
      }),
    };
  }

  /**
   * Generate Twitter Card metadata
   */
  private generateTwitterMetadata(config: SEOPageConfig): TwitterMetadata {
    const imageUrl = this.getOptimizedImageUrl(config.pageType);
    
    return {
      card: SOCIAL_OPTIMIZATION.TWITTER.CARD,
      site: SOCIAL_OPTIMIZATION.TWITTER.SITE,
      creator: SOCIAL_OPTIMIZATION.TWITTER.CREATOR,
      title: config.title,
      description: config.description,
      ...(imageUrl && {
        image: imageUrl,
        imageAlt: `${config.title} - ${BUSINESS_PROFILE.NAME}`,
      }),
    };
  }

  /**
   * Generate extended meta tags for enhanced SEO
   */
  private generateExtendedMetaTags(config: SEOPageConfig): Record<string, string> {
    const languageCode = LOCALE_CONFIG.HREFLANG[config.locale];
    
    return {
      // Geographic targeting for local SEO
      'geo.region': LOCALE_CONFIG.COUNTRY_TARGETING[config.locale],
      'geo.placename': `${BUSINESS_PROFILE.LOCATION.CITY}, ${BUSINESS_PROFILE.LOCATION.COUNTRY}`,
      'geo.position': `${BUSINESS_PROFILE.LOCATION.COORDINATES.LAT};${BUSINESS_PROFILE.LOCATION.COORDINATES.LNG}`,
      'ICBM': `${BUSINESS_PROFILE.LOCATION.COORDINATES.LAT}, ${BUSINESS_PROFILE.LOCATION.COORDINATES.LNG}`,
      
      // Language and localization
      'content-language': languageCode,
      'language': config.locale === 'nl' ? 'Dutch' : 'English',
      
      // Professional metadata (E-E-A-T signals)
      'profile:first_name': BUSINESS_PROFILE.NAME.split(' ')[0],
      'profile:last_name': BUSINESS_PROFILE.NAME.split(' ').slice(1).join(' '),
      'profile:username': 'hilmarvdv',
      
      // Business information
      'business:contact_data:locality': BUSINESS_PROFILE.LOCATION.CITY,
      'business:contact_data:region': BUSINESS_PROFILE.LOCATION.REGION,
      'business:contact_data:country_name': BUSINESS_PROFILE.LOCATION.COUNTRY,
      
      // Content metadata
      'article:author': BUSINESS_PROFILE.NAME,
      'article:publisher': BUSINESS_PROFILE.COMPANY,
      'article:section': this.getCategoryForPageType(config.pageType),
      
      // Technical optimization
      'generator': 'Next.js',
      'referrer': 'origin-when-cross-origin',
      
      // App-specific
      'apple-mobile-web-app-title': BUSINESS_PROFILE.NAME,
      'application-name': `${BUSINESS_PROFILE.NAME} - Portfolio`,
      'msapplication-TileColor': '#2563eb',
      'theme-color': '#2563eb',
      
      // Dublin Core metadata for academic/professional credibility
      'DC.title': config.title,
      'DC.creator': BUSINESS_PROFILE.NAME,
      'DC.subject': this.getCategoryForPageType(config.pageType),
      'DC.publisher': BUSINESS_PROFILE.COMPANY,
      'DC.language': config.locale,
      'DC.coverage': `${BUSINESS_PROFILE.LOCATION.CITY}, ${BUSINESS_PROFILE.LOCATION.COUNTRY}`,
      'DC.rights': `© ${new Date().getFullYear()} ${BUSINESS_PROFILE.NAME}`,
    };
  }

  /**
   * Build canonical URL with proper locale handling
   */
  private buildCanonicalUrl(path: string, locale: Locale): string {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const localePrefix = locale === LOCALE_CONFIG.DEFAULT ? '' : `/${locale}`;
    return `${this.baseUrl}${localePrefix}/${cleanPath}`.replace(/\/+$/, '') || `${this.baseUrl}${localePrefix}`;
  }

  /**
   * Generate alternate URLs for hreflang implementation
   */
  private generateAlternateUrls(path: string): Record<string, string> {
    const alternates: Record<string, string> = {};
    
    LOCALE_CONFIG.SUPPORTED.forEach(locale => {
      const url = this.buildCanonicalUrl(path, locale);
      alternates[LOCALE_CONFIG.HREFLANG[locale]] = url;
    });
    
    // Add x-default for international targeting
    alternates['x-default'] = this.buildCanonicalUrl(path, LOCALE_CONFIG.DEFAULT);
    
    return alternates;
  }

  /**
   * Get professional suffix for titles (E-E-A-T)
   */
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

  /**
   * Get value proposition for descriptions
   */
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

  /**
   * Get page type specific keywords
   */
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

  /**
   * Get semantic keywords for content
   */
  private getSemanticKeywords(pageType: PageType): string[] {
    if (pageType === 'services') {
      return SEMANTIC_KEYWORDS.BUSINESS_TERMS.slice(0, 5);
    }
    if (pageType === 'projects') {
      return SEMANTIC_KEYWORDS.TECHNICAL_SKILLS.slice(0, 5);
    }
    return SEMANTIC_KEYWORDS.INDUSTRY_TERMS.slice(0, 3);
  }

  /**
   * Get location-based keywords for local SEO
   */
  private getLocationKeywords(locale: Locale): string[] {
    const baseLocation = ['Amsterdam', 'Netherlands'];
    if (locale === 'nl') {
      return [...baseLocation, 'Nederland', 'Nederlandse ontwikkelaar'];
    }
    return [...baseLocation, 'Dutch developer', 'Netherlands programmer'];
  }

  /**
   * Get professional qualification keywords (E-E-A-T)
   */
  private getProfessionalKeywords(): string[] {
    return [
      `${BUSINESS_PROFILE.YEARS_EXPERIENCE} years experience`,
      'MSc Physics',
      'University of Amsterdam',
      'Senior Developer',
      'Professional Frontend'
    ];
  }

  /**
   * Get category for page type
   */
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

  /**
   * Get optimized image URL for social sharing
   */
  private getOptimizedImageUrl(pageType: PageType): string {
    const baseUrl = this.baseUrl;
    const imageMap = {
      homepage: `${baseUrl}/images/og/homepage.jpg`,
      about: `${baseUrl}/images/og/about.jpg`,
      services: `${baseUrl}/images/og/services.jpg`,
      projects: `${baseUrl}/images/og/projects.jpg`,
      contact: `${baseUrl}/images/og/contact.jpg`,
      faq: `${baseUrl}/images/og/faq.jpg`,
      blog: `${baseUrl}/images/og/blog.jpg`,
      'blog-post': `${baseUrl}/images/og/blog-post.jpg`,
      privacy: `${baseUrl}/images/og/privacy.jpg`,
      booking: `${baseUrl}/images/og/booking.jpg`
    };
    
    return imageMap[pageType] || `${baseUrl}/images/og/default.jpg`;
  }
} 