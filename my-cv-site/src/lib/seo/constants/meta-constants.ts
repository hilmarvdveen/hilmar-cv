export const BUSINESS_PROFILE = {
  NAME: 'Hilmar van der Veen',
  TITLE: 'Senior Frontend Engineer',
  COMPANY: 'Hilmar ICT Services',
  REGISTRATION: {
    LEGAL_NAME: 'Hilmar ICT Services',
    LEGAL_FORM: 'Eenmanszaak',
    KVK: '97564303',
    ESTABLISHMENT_NUMBER: '000062792784',
  },
  REGISTERED_ADDRESS: {
    CITY: 'Zandvoort',
    REGION: 'NH',
    COUNTRY: 'Netherlands',
    COUNTRY_CODE: 'NL',
  },
  LOCATION: {
    CITY: 'Zandvoort',
    COUNTRY: 'Netherlands',
    COUNTRY_CODE: 'NL',
    REGION: 'NH',
    COORDINATES: {
      LAT: 52.3731,
      LNG: 4.5322
    }
  },
  SERVICE_AREA: {
    NAME: 'Randstad',
    CITIES: ['Amsterdam', 'Utrecht', 'Rotterdam', 'Den Haag'],
    CITIES_ENGLISH: ['Amsterdam', 'Utrecht', 'Rotterdam', 'The Hague'],
  },
  CONTACT: {
    EMAIL: 'hilmar@hilmarvanderveen.com',
    PHONE: '+31680149947',
    PHONE_DISPLAY: '+31 6 8014 9947',
    WHATSAPP: 'https://wa.me/31680149947',
    WEBSITE: 'https://www.hilmarvanderveen.com'
  },
  SOCIAL: {
    LINKEDIN: 'https://www.linkedin.com/in/hilmar-van-der-veen/',
    GITHUB: 'https://github.com/hilmarvdveen',
    WHATSAPP: 'https://wa.me/31680149947'
  },
  SEARCH_TITLE: 'Senior Frontend Developer',
  SEARCH_TITLE_DUTCH: 'Senior Frontend Developer',
  ESTABLISHED: '2016',
  YEARS_EXPERIENCE: '10+',
  AVAILABLE_FROM: '1 October 2026',
  AVAILABLE_FROM_DUTCH: '1 oktober 2026',
  SPECIALIZATION: 'React, Next.js, Angular, TypeScript and GraphQL'
} as const;

export const PRICING = {
  HOURLY_RATE_MIN: 95,
  HOURLY_RATE_MAX: 125,
  CURRENCY: 'EUR',
  VAT_INCLUDED: false
} as const;

export const RATE_TEXT = {
  nl: `€${PRICING.HOURLY_RATE_MIN} tot €${PRICING.HOURLY_RATE_MAX} per uur, excl. btw`,
  en: `€${PRICING.HOURLY_RATE_MIN} to €${PRICING.HOURLY_RATE_MAX} per hour, excluding VAT`
} as const;

export const QUALIFICATIONS = {
  EDUCATION: 'BSc Physics and Astronomy, University of Amsterdam',
  CERTIFICATIONS: [
    'Certified Secure Essential Security',
    'Certified Secure Essential Specialties',
    'Certified Secure Security Specialist',
    'Certified Secure Web Security Specialist',
    'Certified Secure Server Security Specialist',
  ],
  LANGUAGES: ['Dutch (native)', 'English (fluent)'],
  PREVIOUS_CLIENTS: [
    'bol.com',
    'Belastingdienst (Dutch Tax Administration)',
    'Nationale Postcode Loterij',
    'Athlon',
    'Ortec',
    'Omniplan',
    'Randstad',
    'Transdev'
  ]
} as const;

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
  PROFILE_PAGE: 'ProfilePage',
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

export const ROBOTS_DIRECTIVES = {
  INDEX: 'index',
  NOINDEX: 'noindex',
  FOLLOW: 'follow',
  NOFOLLOW: 'nofollow',
  ALL: 'all',
  NONE: 'none',
  NOSNIPPET: 'nosnippet',
  MAX_SNIPPET: {
    NONE: 'max-snippet:0',
    SMALL: 'max-snippet:50',
    MEDIUM: 'max-snippet:160',
    LARGE: 'max-snippet:320',
    UNLIMITED: 'max-snippet:-1',
  },
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
  NOTRANSLATE: 'notranslate',
  UNAVAILABLE_AFTER: (date: string) => `unavailable_after:${date}`,
} as const;

export const LOCALE_CONFIG = {
  DEFAULT: 'nl',
  SUPPORTED: ['nl', 'en'],
  HREFLANG: {
    'nl': 'nl-NL',
    'en': 'en-US'
  },
  OPEN_GRAPH_LOCALE: {
    'nl': 'nl_NL',
    'en': 'en_US'
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

export const SOCIAL_OPTIMIZATION = {
  OPEN_GRAPH: {
    TYPE: 'website',
    IMAGE_SIZE: {
      WIDTH: 1200,
      HEIGHT: 630
    },
    IMAGE_TYPE: 'image/png'
  },
  TWITTER: {
    CARD: 'summary_large_image'
  }
} as const;
