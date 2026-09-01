import { BUSINESS_PROFILE, PRICING } from './meta-constants';

export const HOMEPAGE_CONTENT = {
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

export const ABOUT_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: `About ${BUSINESS_PROFILE.NAME} - Senior Frontend Developer`,
    SECONDARY: ['Frontend Developer Biography', 'Amsterdam Developer Profile', 'React Angular Expert Background'],
    EXPERTISE: ['University of Amsterdam Graduate', 'Physics MSc Frontend Developer', 'Enterprise Development Experience']
  }
} as const;

export const SERVICES_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Frontend Development Services Amsterdam',
    SECONDARY: ['React Development Netherlands', 'Angular Consulting Amsterdam', 'Next.js Development Services'],
    PRICING: `€${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX} per hour`,
    SPECIALIZATIONS: ['TypeScript Programming', 'Modern JavaScript Frameworks', 'Enterprise Web Applications']
  }
} as const;

export const FRONTEND_SERVICE_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Frontend Development Services Amsterdam',
    SECONDARY: ['React Development Amsterdam', 'Next.js Developer Netherlands', 'Vue.js Expert Amsterdam'],
    TECHNICAL: ['TypeScript Frontend Development', 'Modern JavaScript Amsterdam', 'Responsive Web Design Netherlands'],
    SPECIALIZATIONS: ['React.js Expert Amsterdam', 'Frontend Performance Optimization', 'Mobile-First Development']
  }
} as const;

export const FULLSTACK_SERVICE_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Full-Stack Development Services Amsterdam',
    SECONDARY: ['React Node.js Developer Netherlands', 'Full-Stack JavaScript Amsterdam', 'End-to-End Web Development'],
    TECHNICAL: ['MERN Stack Developer Amsterdam', 'PostgreSQL Node.js Netherlands', 'AWS Cloud Development'],
    SPECIALIZATIONS: ['Full-Stack TypeScript Development', 'Enterprise Web Applications', 'Cloud-Native Development']
  }
} as const;

export const DESIGN_SYSTEMS_SERVICE_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Design Systems Development Amsterdam',
    SECONDARY: ['React Component Libraries Netherlands', 'Storybook Development Amsterdam', 'Design Token Systems'],
    TECHNICAL: ['Frontend Design Systems', 'Component Library Development', 'Figma to Code Amsterdam'],
    SPECIALIZATIONS: ['Enterprise Design Systems', 'React Component Architecture', 'Design-Development Workflow']
  }
} as const;

export const CONSULTING_SERVICE_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Technical Consulting Services Amsterdam',
    SECONDARY: ['Frontend Architecture Consulting', 'React Angular Consulting Netherlands', 'Performance Optimization Amsterdam'],
    TECHNICAL: ['Code Review Services Amsterdam', 'Team Training Frontend Development', 'Technology Strategy Consulting'],
    SPECIALIZATIONS: ['Enterprise Frontend Consulting', 'Technical Leadership Amsterdam', 'Development Process Optimization']
  }
} as const;

export const PROJECTS_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Frontend Portfolio Amsterdam',
    SECONDARY: ['React Projects Netherlands', 'Angular Case Studies', 'Next.js Portfolio'],
    CLIENT_FOCUS: ['Belastingdienst Projects', 'Ziggo Development', 'NPL Frontend Work'],
    TECH_FOCUS: ['JavaScript Projects Amsterdam', 'TypeScript Portfolio', 'Modern Frontend Examples']
  }
} as const;

export const CONTACT_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Contact Frontend Developer Amsterdam',
    SECONDARY: ['Hire React Developer Netherlands', 'Frontend Development Consultation'],
    ACTION_FOCUSED: ['Amsterdam JavaScript Developer Contact', 'React Angular Next.js Freelancer Hire'],
    LOCAL_SEO: ['Amsterdam Frontend Developer', 'Netherlands React Developer']
  }
} as const;

export const BOOKING_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Book Frontend Developer Amsterdam',
    SECONDARY: ['Hire React Developer', 'Schedule Frontend Consultation', 'Amsterdam Developer Booking'],
    PRICING_FOCUSED: [`€${PRICING.HOURLY_RATE_MIN}-${PRICING.HOURLY_RATE_MAX} Frontend Developer`, 'Competitive Amsterdam Developer Rates'],
    ACTION_FOCUSED: ['Frontend Developer Consultation Booking', 'React Angular Next.js Developer Hire']
  }
} as const;

export const BLOG_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Frontend Development Blog Amsterdam',
    SECONDARY: ['React Angular Tutorials', 'Next.js Development Guide', 'JavaScript Best Practices'],
    TECHNICAL: ['TypeScript Tips', 'Frontend Performance Blog', 'Modern Web Development'],
    LOCAL: ['Amsterdam Developer Blog', 'Netherlands Frontend Community']
  }
} as const;

export const FAQ_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Frontend Development FAQ Amsterdam',
    SECONDARY: ['React Angular Questions', 'Next.js Development Info', 'Amsterdam Developer FAQ'],
    SERVICE_FOCUSED: ['JavaScript Development Questions', 'Frontend Consulting FAQ', 'Developer Pricing Questions']
  }
} as const;

export const PRIVACY_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Privacy Policy - Frontend Developer Amsterdam',
    SECONDARY: ['Data Privacy Netherlands', 'GDPR Compliance Developer', 'Website Privacy Policy'],
    PROFESSIONAL: ['Professional Developer Privacy', 'Amsterdam Business Privacy Policy']
  }
} as const;
