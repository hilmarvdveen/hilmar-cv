/**
 * Enterprise SEO Constants for Hilmar van der Veen Professional Portfolio
 * Implements Google 2024 best practices with E-E-A-T focus
 * Modular, DRY principles with comprehensive professional targeting
 */

// =============================================================================
// CORE BUSINESS CONSTANTS
// =============================================================================

export const BUSINESS_PROFILE = {
  NAME: 'Hilmar van der Veen',
  TITLE: 'Senior Frontend Developer',
  COMPANY: 'HVD Consulting',
  LOCATION: {
    CITY: 'Amsterdam',
    COUNTRY: 'Netherlands',
    COUNTRY_CODE: 'NL',
    REGION: 'NH',
    COORDINATES: {
      LAT: 52.3676,
      LNG: 4.9041
    }
  },
  CONTACT: {
    EMAIL: 'info@hilmarvanderveen.com',
    PHONE: '+31-20-123-4567',
    WEBSITE: 'https://hilmarvanderveen.com'
  },
  SOCIAL: {
    LINKEDIN: 'https://linkedin.com/in/hilmarvdv',
    GITHUB: 'https://github.com/hilmarvdv',
    TWITTER: '@hilmarvdv'
  },
  ESTABLISHED: '2016',
  YEARS_EXPERIENCE: '8+',
  SPECIALIZATION: 'React, Angular, Next.js, TypeScript'
} as const;

export const PRICING = {
  HOURLY_RATE_MIN: 85,
  HOURLY_RATE_MAX: 125,
  CURRENCY: 'EUR',
  CONSULTATION_RATE: 85,
  PROJECT_MIN: 2500
} as const;

export const QUALIFICATIONS = {
  EDUCATION: 'Master of Science in Physics, University of Amsterdam',
  CERTIFICATIONS: [
    'Scrum Master',
    'C# Developer',
    'React Developer',
    'Angular Developer',
    'Next.js Developer',
    'TypeScript Developer',
    'JavaScript Developer',
    'HTML Developer',
    'CSS Developer',
    'Node.js Developer',
    'Python Developer',
    'Java Developer',
    'SQL Developer',
    'DevOps Engineer',
  ],
  LANGUAGES: ['Dutch (Native)', 'English (Fluent)', 'German (Conversational)', 'Spanish (Conversational)', 'French (Conversational)'	],
  PREVIOUS_CLIENTS: [
    'Belastingdienst (Dutch Tax Authority)',
    'Ziggo (Telecommunications)',
    'NPL (National Postcode Lottery)',
    'Ortec',
    'Omniplan'
  ]
} as const;

// =============================================================================
// SEO TARGETING CONSTANTS
// =============================================================================

export const PRIMARY_KEYWORDS = {
  TIER_1: [
    'Senior Frontend Developer Amsterdam',
    'React Developer Netherlands',
    'Next.js Expert Amsterdam'
  ],
  TIER_2: [
    'Angular Developer Amsterdam',
    'TypeScript Specialist Netherlands',
    'Frontend Consultant Amsterdam',
    'JavaScript Expert Netherlands'
  ],
  TIER_3: [
    'React Native Developer Amsterdam',
    'Vue.js Developer Netherlands',
    'Frontend Architecture Consultant',
    'Web Performance Specialist Amsterdam'
  ],
  LONG_TAIL: [
    'Freelance React Developer Amsterdam with 8 years experience',
    'Senior Angular TypeScript Developer Netherlands',
    'Next.js Performance Optimization Consultant Amsterdam',
    'Frontend Team Lead Developer Netherlands',
    'React Redux Specialist Amsterdam Netherlands'
  ]
} as const;

export const SEMANTIC_KEYWORDS = {
  TECHNICAL_SKILLS: [
    'React Hooks optimization',
    'Angular dependency injection',
    'Next.js server-side rendering',
    'TypeScript type safety',
    'Redux state management',
    'GraphQL implementation',
    'Micro-frontends architecture',
    'Web performance optimization',
    'Progressive Web Apps',
    'Component library development'
  ],
  BUSINESS_TERMS: [
    'frontend consulting services',
    'web application development',
    'user interface optimization',
    'technical leadership',
    'code review services',
    'frontend architecture design',
    'development team mentoring',
    'agile development processes'
  ],
  INDUSTRY_TERMS: [
    'fintech frontend development',
    'e-commerce user interfaces',
    'enterprise web applications',
    'scalable frontend solutions',
    'responsive web design',
    'cross-browser compatibility',
    'accessibility compliance',
    'SEO-friendly development'
  ]
} as const;

// =============================================================================
// CONTENT QUALITY CONSTANTS
// =============================================================================

export const CONTENT_GUIDELINES = {
  E_E_A_T: {
    EXPERIENCE: {
      INDICATORS: [
        'First-hand development project examples',
        'Real client testimonials and case studies',
        'Live project demonstrations',
        'GitHub portfolio with commit history',
        'Technical blog posts with practical solutions'
      ]
    },
    EXPERTISE: {
      CREDENTIALS: [
        'Master of Science in Physics from University of Amsterdam',
        '8+ years professional frontend development',
        'Senior positions at major Dutch companies',
        'Technical certifications from major cloud providers',
        'Published technical articles and tutorials'
      ]
    },
    AUTHORITATIVENESS: {
      SIGNALS: [
        'Recognition in Dutch tech community',
        'Speaking at technical conferences',
        'Contributions to open-source projects',
        'Mentoring junior developers',
        'Technical advisory roles'
      ]
    },
    TRUSTWORTHINESS: {
      FACTORS: [
        'Verified contact information and business registration',
        'Transparent pricing and service descriptions',
        'Client references and testimonials',
        'Clear privacy policy and terms of service',
        'Secure website with HTTPS',
        'Regular content updates and maintenance'
      ]
    }
  },
  QUALITY_METRICS: {
    MIN_WORD_COUNT: 300,
    OPTIMAL_WORD_COUNT: 800,
    MAX_WORD_COUNT: 2500,
    READABILITY_LEVEL: 'Professional/Technical',
    UPDATE_FREQUENCY: 'Monthly'
  }
} as const;

// =============================================================================
// TECHNICAL SEO CONSTANTS
// =============================================================================

export const META_LIMITS = {
  TITLE: {
    MIN: 30,
    MAX: 60,
    OPTIMAL: 55
  },
  DESCRIPTION: {
    MIN: 120,
    MAX: 160,
    OPTIMAL: 155
  },
  KEYWORDS: {
    MIN: 5,
    MAX: 15,
    OPTIMAL: 10
  },
  URL_SLUG: {
    MAX: 75,
    OPTIMAL: 50
  }
} as const;

export const SCHEMA_TYPES = {
  PERSON: 'Person',
  ORGANIZATION: 'Organization',
  PROFESSIONAL_SERVICE: 'ProfessionalService',
  WEBSITE: 'WebSite',
  WEBPAGE: 'WebPage',
  ARTICLE: 'Article',
  BLOG_POSTING: 'BlogPosting',
  FAQ_PAGE: 'FAQPage',
  CONTACT_PAGE: 'ContactPage',
  ABOUT_PAGE: 'AboutPage',
  SERVICE: 'Service',
  OFFER: 'Offer',
  BREADCRUMB_LIST: 'BreadcrumbList',
  LOCAL_BUSINESS: 'LocalBusiness',
  REVIEW: 'Review',
  AGGREGATE_RATING: 'AggregateRating'
} as const;

// Meta robots directives supported by Google (2024)
export const ROBOTS_DIRECTIVES = {
  // Basic indexing directives
  INDEX: 'index',
  NOINDEX: 'noindex',
  FOLLOW: 'follow',
  NOFOLLOW: 'nofollow',
  
  // Combined directives
  ALL: 'all',
  NONE: 'none',
  
  // Snippet control directives
  NOSNIPPET: 'nosnippet',
  MAX_SNIPPET: {
    NONE: 'max-snippet:0',
    SMALL: 'max-snippet:50',
    MEDIUM: 'max-snippet:160',
    LARGE: 'max-snippet:320',
    UNLIMITED: 'max-snippet:-1',
  },
  
  // Image and video control directives
  NOIMAGEINDEX: 'noimageindex',
  MAX_IMAGE_PREVIEW: {
    NONE: 'max-image-preview:none',
    STANDARD: 'max-image-preview:standard',
    LARGE: 'max-image-preview:large',
  },
  MAX_VIDEO_PREVIEW: {
    NONE: 'max-video-preview:0',
    UNLIMITED: 'max-video-preview:-1',
  },
  
  // Other directives
  NOTRANSLATE: 'notranslate',
  UNAVAILABLE_AFTER: (date: string) => `unavailable_after:${date}`,
} as const;

// =============================================================================
// ANALYTICS & TRACKING CONSTANTS
// =============================================================================

export const GA4_EVENTS = {
  CORE: {
    PAGE_VIEW: 'page_view',
    SCROLL: 'scroll',
    CLICK: 'click',
    FORM_START: 'form_start',
    FORM_SUBMIT: 'form_submit',
    FILE_DOWNLOAD: 'file_download',
    VIDEO_START: 'video_start',
    VIDEO_COMPLETE: 'video_complete'
  },
  BUSINESS: {
    CONTACT_FORM_SUBMIT: 'contact_form_submit',
    SERVICE_INQUIRY: 'service_inquiry',
    PORTFOLIO_VIEW: 'portfolio_view',
    CV_DOWNLOAD: 'cv_download',
    CONSULTATION_REQUEST: 'consultation_request',
    PRICING_VIEW: 'pricing_view',
    TESTIMONIAL_VIEW: 'testimonial_view'
  },
  ENGAGEMENT: {
    MENU_CLICK: 'menu_click',
    CTA_CLICK: 'cta_click',
    SOCIAL_CLICK: 'social_click',
    EXTERNAL_LINK_CLICK: 'external_link_click',
    EMAIL_CLICK: 'email_click',
    PHONE_CLICK: 'phone_click'
  }
} as const;

export const TRACKING_PARAMETERS = {
  BUTTON_ID: 'button_id',
  BUTTON_TEXT: 'button_text',
  LINK_URL: 'link_url',
  LINK_TEXT: 'link_text',
  PAGE_SECTION: 'page_section',
  SERVICE_TYPE: 'service_type',
  FORM_NAME: 'form_name',
  FILE_NAME: 'file_name',
  CONTACT_METHOD: 'contact_method'
} as const;

// =============================================================================
// INTERNATIONALIZATION CONSTANTS
// =============================================================================

export const LOCALE_CONFIG = {
  DEFAULT: 'nl',
  SUPPORTED: ['nl', 'en'],
  HREFLANG: {
    'nl': 'nl-NL',
    'en': 'en-US'
  },
  COUNTRY_TARGETING: {
    'nl': 'NL',
    'en': 'US'
  },
  CURRENCY: {
    'nl': 'EUR',
    'en': 'EUR'
  }
} as const;

// =============================================================================
// PERFORMANCE & CORE WEB VITALS
// =============================================================================

export const PERFORMANCE_TARGETS = {
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100,  // First Input Delay (ms)
  CLS: 0.1,  // Cumulative Layout Shift
  FCP: 1800, // First Contentful Paint (ms)
  TTFB: 600  // Time to First Byte (ms)
} as const;

export const IMAGE_OPTIMIZATION = {
  FORMATS: ['webp', 'avif', 'jpg', 'png'],
  SIZES: [320, 640, 768, 1024, 1280, 1920],
  QUALITY: 85,
  LAZY_LOADING: true
} as const;

// =============================================================================
// SECURITY & PRIVACY
// =============================================================================

export const SECURITY_HEADERS = {
  CSP: "default-src 'self'; script-src 'self' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: *.googletagmanager.com *.google-analytics.com",
  REFERRER_POLICY: 'strict-origin-when-cross-origin',
  X_FRAME_OPTIONS: 'DENY',
  X_CONTENT_TYPE_OPTIONS: 'nosniff'
} as const;

export const PRIVACY_COMPLIANCE = {
  GDPR: true,
  CCPA: false,
  COOKIE_CONSENT: true,
  DATA_RETENTION: '26 months',
  ANONYMIZE_IP: true
} as const;

// =============================================================================
// SOCIAL MEDIA OPTIMIZATION
// =============================================================================

export const SOCIAL_OPTIMIZATION = {
  OPEN_GRAPH: {
    TYPE: 'website',
    IMAGE_SIZE: {
      WIDTH: 1200,
      HEIGHT: 630
    },
    IMAGE_TYPE: 'image/jpeg'
  },
  TWITTER: {
    CARD: 'summary_large_image',
    SITE: '@hilmarvdv',
    CREATOR: '@hilmarvdv'
  },
  LINKEDIN: {
    COMPANY: 'hvd-consulting'
  }
} as const;

export default {
  BUSINESS_PROFILE,
  PRICING,
  QUALIFICATIONS,
  PRIMARY_KEYWORDS,
  SEMANTIC_KEYWORDS,
  CONTENT_GUIDELINES,
  META_LIMITS,
  SCHEMA_TYPES,
  ROBOTS_DIRECTIVES,
  GA4_EVENTS,
  TRACKING_PARAMETERS,
  LOCALE_CONFIG,
  PERFORMANCE_TARGETS,
  IMAGE_OPTIMIZATION,
  SECURITY_HEADERS,
  PRIVACY_COMPLIANCE,
  SOCIAL_OPTIMIZATION
} as const; 