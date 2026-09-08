import { BUSINESS_PROFILE, RATE_TEXT } from './meta-constants';

export const HOMEPAGE_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Freelance senior frontend engineer Randstad',
    SECONDARY: ['React developer Netherlands', 'Next.js engineer Amsterdam Utrecht', 'Angular developer Rotterdam Den Haag'],
    LONG_TAIL: [
      'Senior frontend engineer ten years React Next.js Angular',
      'Legacy to server-side rendered React without downtime',
      'Frontend engineer available from 1 October 2026 Randstad'
    ]
  }
} as const;

export const ABOUT_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: `About ${BUSINESS_PROFILE.NAME}, ${BUSINESS_PROFILE.TITLE}`,
    SECONDARY: ['Senior frontend engineer since 2016', 'bol.com Belastingdienst Postcode Loterij Athlon', 'React Angular TypeScript background'],
    EXPERTISE: ['Certified Secure web security', 'WCAG 2.2 AA accessibility', 'BSc Physics and Astronomy University of Amsterdam']
  }
} as const;

export const SERVICES_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Frontend engineering services Randstad',
    SECONDARY: ['React development Netherlands', 'Next.js development Amsterdam Utrecht', 'Angular development Rotterdam Den Haag'],
    PRICING: RATE_TEXT.en,
    SPECIALIZATIONS: ['Legacy migration to React', 'Design systems with Storybook', 'GraphQL frontend contracts']
  }
} as const;

export const FRONTEND_SERVICE_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Frontend development React Next.js Angular',
    SECONDARY: ['React developer Randstad', 'Next.js App Router engineer', 'Angular TypeScript developer Netherlands'],
    TECHNICAL: ['Server-side rendered React', 'TypeScript frontend', 'WCAG 2.2 AA accessible frontend'],
    SPECIALIZATIONS: ['Customer-facing pages from specification to production', 'Phased cut-over from legacy', 'Tests and Storybook per component']
  }
} as const;

export const FULLSTACK_SERVICE_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Full-stack React with .NET or Kotlin',
    SECONDARY: ['React .NET developer Netherlands', 'React Kotlin engineer Randstad', 'GraphQL full-stack contract'],
    TECHNICAL: ['C# .NET Core API', 'Kotlin backend contributions', 'GraphQL schema design'],
    SPECIALIZATIONS: ['One engineer from API to page', 'Frontend specialist in backend-heavy teams', 'Enterprise web applications']
  }
} as const;

export const DESIGN_SYSTEMS_SERVICE_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Design system engineer Randstad',
    SECONDARY: ['React component library Netherlands', 'Storybook design system', 'Design tokens engineer'],
    TECHNICAL: ['Angular and React component libraries', 'Design tokens and theming', 'Storybook documentation'],
    SPECIALIZATIONS: ['Design systems teams maintain themselves', 'Belastingdienst forms platform', 'Nationale Postcode Loterij design system']
  }
} as const;

export const CONSULTING_SERVICE_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Frontend architecture consulting Randstad',
    SECONDARY: ['Legacy migration plan React', 'Frontend architecture review Netherlands', 'Senior frontend guidance'],
    TECHNICAL: ['Behavioural contract from legacy code', 'Reversible traffic cut-over', 'Error monitoring and funnel data'],
    SPECIALIZATIONS: ['Migration without downtime', 'Mentoring and code review', 'Handover that lasts']
  }
} as const;

export const PROJECTS_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Frontend case studies Netherlands',
    SECONDARY: ['bol.com React migration', 'Belastingdienst forms platform', 'Postcode Loterij design system'],
    CLIENT_FOCUS: ['bol.com', 'Belastingdienst', 'Nationale Postcode Loterij', 'Athlon'],
    TECH_FOCUS: ['Legacy Java to SSR React', 'Low-code forms platform', 'Design systems in production']
  }
} as const;

export const CONTACT_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Hire a senior frontend engineer Randstad',
    SECONDARY: ['Contact React developer Netherlands', 'Freelance frontend engineer enquiry'],
    ACTION_FOCUSED: ['Book a 30-minute call', 'Frontend engagement Amsterdam Utrecht Rotterdam Den Haag'],
    LOCAL_SEO: ['Freelance frontend engineer Randstad', 'ZZP frontend developer Netherlands']
  }
} as const;

export const BOOKING_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Book a 30-minute call with a senior frontend engineer',
    SECONDARY: ['Plan een gesprek frontend engineer', 'Intro call React developer', 'Frontend engineer availability 2026'],
    PRICING_FOCUSED: [RATE_TEXT.en, 'Freelance frontend rate Netherlands'],
    ACTION_FOCUSED: ['Schedule a call', 'Calendar invitation frontend engineer']
  }
} as const;

export const BLOG_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Frontend engineering blog',
    SECONDARY: [
      'React architecture',
      'React folder structure',
      'Unit testing React',
      'GraphQL contract between frontend and backend',
      'Reversible cut-over from legacy'
    ],
    TECHNICAL: [
      'React Router loaders and actions',
      'SEO for Next.js',
      'Vitest and Storybook',
      'ASP.NET Core minimal endpoints',
      'Hexagonal architecture in Kotlin and Java',
      'WCAG 2.2 AA in components'
    ],
    LOCAL: ['Dutch frontend engineer blog', 'Randstad frontend community']
  }
} as const;

export const FAQ_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Freelance frontend engineer questions',
    SECONDARY: ['Frontend engineer rate Netherlands', 'Hybrid frontend engagement Randstad', 'Availability from 1 October 2026'],
    SERVICE_FOCUSED: ['How a frontend engagement starts', 'Working with a backend team', 'Handover and documentation']
  }
} as const;

export const PRIVACY_CONTENT = {
  SEO_FOCUS: {
    PRIMARY: 'Privacy policy Hilmar ICT Services',
    SECONDARY: ['GDPR personal data hilmarvanderveen.com', 'Cookie use and consent', 'Data retention'],
    PROFESSIONAL: ['Freelance engineer privacy policy', 'AVG privacyverklaring']
  }
} as const;
