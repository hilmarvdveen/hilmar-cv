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
    CITY: 'Utrecht',
    COUNTRY: 'Netherlands',
    COUNTRY_CODE: 'NL',
    REGION: 'UT',
    COORDINATES: {
      LAT: 52.0907,
      LNG: 5.1214
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

export const PRIMARY_KEYWORDS = {
  TIER_1: [
    'Freelance frontend developer',
    'Senior frontend developer Randstad',
    'React developer Netherlands',
    'Freelance React developer Amsterdam',
    'Frontend developer inhuren'
  ],
  TIER_2: [
    'Next.js developer Netherlands',
    'Angular developer Netherlands',
    'TypeScript developer Randstad',
    'ZZP frontend developer',
    'Interim frontend developer',
    'Frontend ontwikkelaar freelance'
  ],
  TIER_3: [
    'Senior frontend engineer',
    'Frontend architect Netherlands',
    'Frontend consultant Randstad',
    'Design system developer Storybook',
    'GraphQL frontend developer',
    'React developer Utrecht',
    'React developer Rotterdam',
    'React developer Den Haag'
  ],
  LONG_TAIL: [
    'Freelance senior React Next.js developer with ten years of experience',
    'Frontend developer for legacy to React migration without downtime',
    'ZZP frontend developer Amsterdam Utrecht Rotterdam Den Haag',
    'Frontend developer for e-commerce and government platforms Netherlands',
    'Senior front-end developer beschikbaar vanaf oktober 2026',
    'Freelance frontend developer hybride of remote'
  ]
} as const;

export const SEMANTIC_KEYWORDS = {
  TECHNICAL_SKILLS: [
    'React 19 and React Router server-side rendering',
    'Next.js App Router',
    'Angular and TypeScript',
    'JavaScript ES2024',
    'GraphQL contracts between frontend and backend',
    'Design systems with Storybook and design tokens',
    'Tailwind CSS and CSS architecture',
    'WCAG 2.2 AA accessibility',
    'A/B experimentation in production',
    'Headless CMS integration',
    'Nx monorepo',
    'Kotlin and .NET backend range',
    'Component libraries',
    'Vitest, Jest and Testing Library'
  ],
  BUSINESS_TERMS: [
    'legacy to modern migration',
    'zero-downtime cut-over',
    'frontend architecture',
    'design system delivery',
    'senior engineer for backend-heavy teams',
    'mentoring and code review',
    'handover documentation',
    'hybrid and remote engagements'
  ],
  INDUSTRY_TERMS: [
    'e-commerce frontend',
    'government forms platform',
    'enterprise web applications',
    'revenue-critical customer pages',
    'accessible public services',
    'scalable frontend platforms'
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
