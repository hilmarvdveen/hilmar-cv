/**
 * Page Content Constants for SEO
 * Comprehensive page-specific content for accurate metadata generation
 * Based on actual page content analysis
 */

import { BUSINESS_PROFILE, PRICING } from './meta-constants';

// =============================================================================
// HOMEPAGE CONTENT
// =============================================================================

export const HOMEPAGE_CONTENT = {
  SECTIONS: [
    'Hero Section with CTA buttons',
    'About Section with professional introduction', 
    'Client Logos Carousel featuring top clients',
    'USP Section highlighting unique value',
    'Work Experience timeline',
    'Project Highlights showcase',
    'Tech Stack visualization',
    'Client Testimonials',
    'Certifications display',
    'Netherlands Map showing service area',
    'Call-to-Action sections'
  ],
  
  KEY_FEATURES: [
    'Book consultation scheduling',
    'CV download functionality',
    'Contact form integration',
    'Project portfolio showcase',
    'Client testimonials display',
    'Interactive tech stack',
    'Service area mapping'
  ],

  VALUE_PROPOSITIONS: [
    `${BUSINESS_PROFILE.YEARS_EXPERIENCE} years experience in frontend development`,
    `€${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}/hour competitive rates`,
    'MSc Physics University of Amsterdam graduate',
    'Major Dutch clients: Belastingdienst, Ziggo, NPL',
    'React, Angular, Next.js, TypeScript specialist',
    'Amsterdam-based, Netherlands-wide service',
    'Full-stack capabilities with modern frameworks'
  ],

  SEO_FOCUS: {
    PRIMARY: 'Senior Frontend Developer Amsterdam',
    SECONDARY: ['React Developer Netherlands', 'Angular Expert Amsterdam', 'Next.js Specialist'],
    LONG_TAIL: [
      'Freelance Senior Frontend Developer Amsterdam 8 years experience',
      'React Angular Next.js TypeScript Developer Netherlands',
      'MSc Physics Frontend Developer Amsterdam hire'
    ]
  }
} as const;

// =============================================================================
// ABOUT PAGE CONTENT  
// =============================================================================

export const ABOUT_CONTENT = {
  CURRENT_STATE: 'Coming soon page with contact CTA',
  
  PLANNED_CONTENT: [
    'Professional background and education',
    'Career journey and milestones',
    'Technical expertise timeline',
    'Client success stories',
    'Personal interests and hobbies',
    'Professional philosophy',
    'Awards and recognitions'
  ],

  KEY_POINTS: [
    `${BUSINESS_PROFILE.YEARS_EXPERIENCE} years full-stack development experience`,
    'MSc in Physics from University of Amsterdam',
    'Specialized in scalable web applications',
    'Experience across European markets',
    'Technical solutions for enterprise clients',
    'Based in Amsterdam, Netherlands'
  ],

  SEO_FOCUS: {
    PRIMARY: `About ${BUSINESS_PROFILE.NAME} - Senior Frontend Developer`,
    SECONDARY: ['Frontend Developer Biography', 'Amsterdam Developer Profile', 'React Angular Expert Background'],
    EXPERTISE: ['University of Amsterdam Graduate', 'Physics MSc Frontend Developer', 'Enterprise Development Experience']
  }
} as const;

// =============================================================================
// SERVICES PAGE CONTENT
// =============================================================================

export const SERVICES_CONTENT = {
  MAIN_SERVICES: {
    FRONTEND: {
      TITLE: 'Frontend Development',
      TECHNOLOGIES: ['React', 'Next.js', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'Redux'],
      BENEFITS: [
        'Modern responsive interfaces',
        'Performance optimization',
        'Cross-browser compatibility',
        'Mobile-first development',
        'SEO-friendly implementations'
      ],
      DESCRIPTION: 'Expert frontend development with modern frameworks and best practices'
    },
    
    FULLSTACK: {
      TITLE: 'Full-Stack Development', 
      TECHNOLOGIES: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker'],
      BENEFITS: [
        'End-to-end application development',
        'API design and integration',
        'Database optimization',
        'Cloud deployment',
        'Performance monitoring'
      ],
      DESCRIPTION: 'Complete web application development from frontend to backend'
    },

    DESIGN_SYSTEMS: {
      TITLE: 'Design Systems',
      TECHNOLOGIES: ['Storybook', 'Figma', 'React', 'Styled Components', 'Sass', 'Design Tokens'],
      BENEFITS: [
        'Consistent user experiences',
        'Scalable component libraries',
        'Design-development alignment',
        'Faster development cycles',
        'Maintainable codebases'
      ],
      DESCRIPTION: 'Comprehensive design system development and component library creation'
    },

    CONSULTING: {
      TITLE: 'Technical Consulting',
      TECHNOLOGIES: ['Architecture Review', 'Performance Audit', 'Code Review', 'Team Training', 'Process Optimization'],
      BENEFITS: [
        'Architecture improvements',
        'Performance optimizations',
        'Code quality enhancement',
        'Team skill development',
        'Process optimization'
      ],
      DESCRIPTION: 'Strategic technical consulting and team development services'
    }
  },

  SEO_FOCUS: {
    PRIMARY: 'Frontend Development Services Amsterdam',
    SECONDARY: ['React Development Netherlands', 'Angular Consulting Amsterdam', 'Next.js Development Services'],
    PRICING: `€${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX} per hour`,
    SPECIALIZATIONS: ['TypeScript Programming', 'Modern JavaScript Frameworks', 'Enterprise Web Applications']
  }
} as const;

// =============================================================================
// FRONTEND SERVICE SUBPAGE CONTENT
// =============================================================================

export const FRONTEND_SERVICE_CONTENT = {
  PAGE_FOCUS: 'Frontend Development Specialization',
  
  SECTIONS: [
    'Hero section with frontend development focus',
    'Benefits and deliverables showcase',
    'Technology stack and expertise levels',
    'Development process workflow',
    'Client results and case studies',
    'Booking and consultation CTAs'
  ],

  TECHNOLOGIES: [
    'React.js (Expert level)',
    'Next.js (Expert level)',
    'Vue.js (Advanced level)',
    'TypeScript (Expert level)',
    'Tailwind CSS (Expert level)',
    'Redux/State Management (Expert level)',
    'Modern JavaScript ES6+ (Expert level)',
    'Webpack/Build Tools (Advanced level)'
  ],

  BENEFITS: [
    'Mobile-first responsive design',
    'Performance optimization',
    'SEO-friendly development',
    'Cross-browser compatibility',
    'Accessibility compliance',
    'Modern UI/UX implementation'
  ],

  PROCESS_HIGHLIGHTS: [
    'Requirements analysis and planning',
    'UI/UX design collaboration',
    'Component-driven development',
    'Performance optimization'
  ],

  SEO_FOCUS: {
    PRIMARY: 'Frontend Development Services Amsterdam',
    SECONDARY: ['React Development Amsterdam', 'Next.js Developer Netherlands', 'Vue.js Expert Amsterdam'],
    TECHNICAL: ['TypeScript Frontend Development', 'Modern JavaScript Amsterdam', 'Responsive Web Design Netherlands'],
    SPECIALIZATIONS: ['React.js Expert Amsterdam', 'Frontend Performance Optimization', 'Mobile-First Development']
  }
} as const;

// =============================================================================
// FULLSTACK SERVICE SUBPAGE CONTENT
// =============================================================================

export const FULLSTACK_SERVICE_CONTENT = {
  PAGE_FOCUS: 'Full-Stack Development Solutions',
  
  SECTIONS: [
    'Hero section with full-stack emphasis',
    'End-to-end development benefits',
    'Frontend and backend technology categories',
    'Development workflow and process',
    'Architecture and deployment expertise',
    'Project consultation booking'
  ],

  TECHNOLOGY_CATEGORIES: [
    'Frontend Technologies (React, Next.js, Vue.js, TypeScript)',
    'Backend Technologies (Node.js, Express, FastAPI, PostgreSQL)',
    'Cloud & DevOps (AWS, Docker, CI/CD, Kubernetes)',
    'Database Technologies (PostgreSQL, MongoDB, Redis, Prisma)',
    'API Development (RESTful, GraphQL, Authentication)',
    'Testing & Quality (Jest, Cypress, Unit Testing, E2E Testing)'
  ],

  BENEFITS: [
    'End-to-end application architecture',
    'Seamless frontend-backend integration',
    'Database design and optimization',
    'Cloud deployment and scaling',
    'API design and development',
    'Performance monitoring and optimization'
  ],

  DELIVERABLES: [
    'Complete web application development',
    'API design and implementation',
    'Database architecture and setup',
    'Cloud deployment configuration',
    'Performance optimization',
    'Documentation and training'
  ],

  SEO_FOCUS: {
    PRIMARY: 'Full-Stack Development Services Amsterdam',
    SECONDARY: ['React Node.js Developer Netherlands', 'Full-Stack JavaScript Amsterdam', 'End-to-End Web Development'],
    TECHNICAL: ['MERN Stack Developer Amsterdam', 'PostgreSQL Node.js Netherlands', 'AWS Cloud Development'],
    SPECIALIZATIONS: ['Full-Stack TypeScript Development', 'Enterprise Web Applications', 'Cloud-Native Development']
  }
} as const;

// =============================================================================
// DESIGN SYSTEMS SERVICE SUBPAGE CONTENT
// =============================================================================

export const DESIGN_SYSTEMS_SERVICE_CONTENT = {
  PAGE_FOCUS: 'Design Systems Development',
  
  SECTIONS: [
    'Hero section with design systems focus',
    'Deliverables and component libraries',
    'Benefits for teams and organizations',
    'Technology stack for design systems',
    'Implementation process and workflow',
    'Project consultation and booking'
  ],

  DELIVERABLES: [
    'Component library development',
    'Design token systems',
    'Storybook documentation',
    'Style guide creation',
    'Design-development workflow',
    'Team training and adoption'
  ],

  TECHNOLOGIES: [
    'Storybook (Expert level)',
    'React Component Libraries (Expert level)',
    'Design Tokens (Advanced level)',
    'Figma Integration (Advanced level)',
    'Styled Components (Expert level)',
    'CSS-in-JS Solutions (Expert level)',
    'Component Testing (Advanced level)',
    'Documentation Systems (Advanced level)'
  ],

  BENEFITS: [
    'Consistent user experiences',
    'Faster development cycles',
    'Scalable component architecture',
    'Design-development alignment',
    'Maintainable code systems',
    'Cross-team collaboration'
  ],

  PROCESS_STEPS: [
    'Design audit and analysis',
    'Component architecture planning',
    'Design token system setup',
    'Component library development',
    'Documentation and training',
    'Team adoption support'
  ],

  SEO_FOCUS: {
    PRIMARY: 'Design Systems Development Amsterdam',
    SECONDARY: ['React Component Libraries Netherlands', 'Storybook Development Amsterdam', 'Design Token Systems'],
    TECHNICAL: ['Frontend Design Systems', 'Component Library Development', 'Figma to Code Amsterdam'],
    SPECIALIZATIONS: ['Enterprise Design Systems', 'React Component Architecture', 'Design-Development Workflow']
  }
} as const;

// =============================================================================
// CONSULTING SERVICE SUBPAGE CONTENT
// =============================================================================

export const CONSULTING_SERVICE_CONTENT = {
  PAGE_FOCUS: 'Technical Consulting Services',
  
  SECTIONS: [
    'Hero section with consulting expertise',
    'Service deliverables and reports',
    'Consulting benefits for organizations',
    'Expertise areas and specializations',
    'Consulting process and methodology',
    'Experience stats and credentials',
    'Consultation booking and contact'
  ],

  DELIVERABLES: [
    'Technical architecture review',
    'Performance audit reports',
    'Code quality assessments',
    'Team training programs',
    'Process optimization recommendations',
    'Technology stack evaluation'
  ],

  EXPERTISE_AREAS: [
    'Frontend Architecture (React, Angular, Next.js)',
    'Performance Optimization (Core Web Vitals, Loading Speed)',
    'Code Quality & Best Practices (ESLint, TypeScript, Testing)',
    'Team Development (Training, Code Reviews, Mentoring)',
    'Technology Strategy (Framework Selection, Migration Planning)',
    'DevOps & Deployment (CI/CD, Cloud Architecture, Monitoring)'
  ],

  BENEFITS: [
    'Expert technical guidance',
    'Performance improvements',
    'Risk mitigation strategies',
    'Team skill development',
    'Process optimization',
    'Strategic technology decisions'
  ],

  EXPERIENCE_STATS: [
    '8+ years technical leadership',
    '50+ projects consulted',
    'Major enterprise clients',
    'Government sector experience',
    'Multi-language team training',
    'Architecture review expertise'
  ],

  SEO_FOCUS: {
    PRIMARY: 'Technical Consulting Services Amsterdam',
    SECONDARY: ['Frontend Architecture Consulting', 'React Angular Consulting Netherlands', 'Performance Optimization Amsterdam'],
    TECHNICAL: ['Code Review Services Amsterdam', 'Team Training Frontend Development', 'Technology Strategy Consulting'],
    SPECIALIZATIONS: ['Enterprise Frontend Consulting', 'Technical Leadership Amsterdam', 'Development Process Optimization']
  }
} as const;

// =============================================================================
// PROJECTS PAGE CONTENT
// =============================================================================

export const PROJECTS_CONTENT = {
  SHOWCASE_FOCUS: [
    'Frontend development case studies',
    'React and Angular project examples',
    'Next.js application portfolios',
    'Client project successes',
    'Technical implementation details',
    'Performance optimization results'
  ],

  CLIENT_WORK: [
    'Belastingdienst (Dutch Tax Authority) - Government portal development',
    'Ziggo (Telecommunications) - Customer interface applications', 
    'NPL (National Postcode Lottery) - Gaming platform frontend',
    'Enterprise web applications',
    'E-commerce solutions',
    'Data visualization dashboards'
  ],

  TECHNICAL_HIGHLIGHTS: [
    'React.js enterprise applications',
    'Angular progressive web apps',
    'Next.js full-stack solutions',
    'TypeScript implementations',
    'Performance-optimized frontends',
    'Responsive design systems'
  ],

  SEO_FOCUS: {
    PRIMARY: 'Frontend Portfolio Amsterdam',
    SECONDARY: ['React Projects Netherlands', 'Angular Case Studies', 'Next.js Portfolio'],
    CLIENT_FOCUS: ['Belastingdienst Projects', 'Ziggo Development', 'NPL Frontend Work'],
    TECH_FOCUS: ['JavaScript Projects Amsterdam', 'TypeScript Portfolio', 'Modern Frontend Examples']
  }
} as const;

// =============================================================================
// CONTACT PAGE CONTENT
// =============================================================================

export const CONTACT_CONTENT = {
  FEATURES: [
    'Contact form with project details',
    'Direct email communication',
    'Phone consultation scheduling',
    'Professional business information',
    'Service inquiry options',
    'Project estimation requests'
  ],

  CONTACT_METHODS: [
    `Email: ${BUSINESS_PROFILE.CONTACT.EMAIL}`,
    `Phone: ${BUSINESS_PROFILE.CONTACT.PHONE}`,
    `Location: ${BUSINESS_PROFILE.LOCATION.CITY}, ${BUSINESS_PROFILE.LOCATION.COUNTRY}`,
    'Online consultation available',
    'Project discussion scheduling',
    'Technical requirement assessment'
  ],

  SERVICE_AREAS: [
    'Amsterdam and surrounding areas',
    'Netherlands nationwide',
    'European remote projects',
    'International collaboration',
    'On-site and remote work',
    'Flexible engagement models'
  ],

  SEO_FOCUS: {
    PRIMARY: 'Contact Frontend Developer Amsterdam',
    SECONDARY: ['Hire React Developer Netherlands', 'Frontend Development Consultation'],
    ACTION_FOCUSED: ['Amsterdam JavaScript Developer Contact', 'React Angular Next.js Freelancer Hire'],
    LOCAL_SEO: ['Amsterdam Frontend Developer', 'Netherlands React Developer']
  }
} as const;

// =============================================================================
// BOOKING PAGE CONTENT  
// =============================================================================

export const BOOKING_CONTENT = {
  SERVICES_OFFERED: [
    'Hourly consultation sessions',
    'Project-based development',
    'Technical architecture review',
    'Code review and optimization',
    'Team training and mentoring',
    'Emergency development support'
  ],

  PRICING_MODELS: {
    HOURLY: {
      RATE: `€${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX}`,
      FEATURES: [
        'Flexible scheduling',
        'Quick project turnaround',
        'Direct communication',
        'Agile development approach',
        'Regular progress updates'
      ]
    },
    PROJECT: {
      MINIMUM: `€${PRICING.PROJECT_MIN}`,
      FEATURES: [
        'Fixed-price proposals',
        'Comprehensive project planning',
        'Milestone-based delivery',
        'Full project documentation',
        'Post-launch support included'
      ]
    }
  },

  BOOKING_BENEFITS: [
    'Free initial consultation',
    'Fast project delivery',
    'Full support throughout',
    'Competitive Amsterdam rates',
    'Proven track record',
    'Major client experience'
  ],

  SEO_FOCUS: {
    PRIMARY: 'Book Frontend Developer Amsterdam',
    SECONDARY: ['Hire React Developer', 'Schedule Frontend Consultation', 'Amsterdam Developer Booking'],
    PRICING_FOCUSED: [`€${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX} Frontend Developer`, 'Competitive Amsterdam Developer Rates'],
    ACTION_FOCUSED: ['Frontend Developer Consultation Booking', 'React Angular Next.js Developer Hire']
  }
} as const;

// =============================================================================
// BLOG PAGE CONTENT
// =============================================================================

export const BLOG_CONTENT = {
  TOPICS: [
    'Frontend development best practices',
    'React and Angular tutorials',
    'Next.js implementation guides',
    'TypeScript tips and tricks',
    'Performance optimization techniques',
    'Modern JavaScript frameworks',
    'Amsterdam tech scene insights'
  ],

  CONTENT_TYPES: [
    'Technical tutorials',
    'Industry insights',
    'Project case studies',
    'Tool reviews',
    'Framework comparisons',
    'Best practice guides'
  ],

  SEO_FOCUS: {
    PRIMARY: 'Frontend Development Blog Amsterdam',
    SECONDARY: ['React Angular Tutorials', 'Next.js Development Guide', 'JavaScript Best Practices'],
    TECHNICAL: ['TypeScript Tips', 'Frontend Performance Blog', 'Modern Web Development'],
    LOCAL: ['Amsterdam Developer Blog', 'Netherlands Frontend Community']
  }
} as const;

// =============================================================================
// FAQ PAGE CONTENT
// =============================================================================

export const FAQ_CONTENT = {
  CATEGORIES: [
    'Service inquiries and pricing',
    'Technical expertise and capabilities',
    'Project timelines and processes',
    'Communication and collaboration',
    'Location and availability',
    'Post-project support'
  ],

  COMMON_QUESTIONS: [
    'What frontend frameworks do you specialize in?',
    'What are your hourly rates?',
    'How do you handle project timelines?',
    'Do you work with international clients?',
    'What is your experience with enterprise projects?',
    'Do you offer post-launch support?'
  ],

  SEO_FOCUS: {
    PRIMARY: 'Frontend Development FAQ Amsterdam',
    SECONDARY: ['React Angular Questions', 'Next.js Development Info', 'Amsterdam Developer FAQ'],
    SERVICE_FOCUSED: ['JavaScript Development Questions', 'Frontend Consulting FAQ', 'Developer Pricing Questions']
  }
} as const;

// =============================================================================
// PRIVACY PAGE CONTENT
// =============================================================================

export const PRIVACY_CONTENT = {
  COVERAGE: [
    'Data collection and usage policies',
    'Cookie usage and preferences',
    'User rights and privacy controls',
    'Contact form data handling',
    'Analytics and tracking information',
    'Third-party service integrations'
  ],

  COMPLIANCE: [
    'GDPR compliance for EU visitors',
    'Cookie consent management',
    'Data retention policies',
    'User data deletion rights',
    'Privacy policy updates',
    'Contact information for privacy concerns'
  ],

  SEO_FOCUS: {
    PRIMARY: 'Privacy Policy - Frontend Developer Amsterdam',
    SECONDARY: ['Data Privacy Netherlands', 'GDPR Compliance Developer', 'Website Privacy Policy'],
    PROFESSIONAL: ['Professional Developer Privacy', 'Amsterdam Business Privacy Policy']
  }
} as const; 