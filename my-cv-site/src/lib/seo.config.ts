import { SEOConfig } from '@/types/seo.types';

export const siteConfig = {
  name: "Hilmar van der Veen",
  title: "Senior Frontend Developer",
  description: "Experienced Senior Frontend Developer specializing in React, Next.js, and Angular. Building scalable, accessible, and future-proof web applications in the Netherlands.",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hilmarvanderveen.com',
  locale: 'nl',
  author: {
    name: "Hilmar van der Veen",
    email: "hilmar@hilmarvanderveen.com",
    twitter: "@hilmarvdv",
    linkedin: "https://www.linkedin.com/in/hilmarvanderveen",
    github: "https://github.com/hilmarvanderveen",
  },
  social: {
    twitter: "@hilmarvdv",
    linkedin: "hilmarvanderveen",
    github: "hilmarvanderveen",
  },
  location: {
    city: "Amsterdam",
    country: "Netherlands",
    region: "Noord-Holland",
  },
  business: {
    type: "Freelance Developer",
    founded: "2016",
    services: [
      "Frontend Development",
      "React Development", 
      "Next.js Development",
      "Angular Development",
      "TypeScript Development",
      "Full-Stack Development",
      "Design Systems",
      "Technical Consulting"
    ]
  }
} as const;

export const defaultSEO: SEOConfig = {
  title: `${siteConfig.name} - ${siteConfig.title}`,
  description: siteConfig.description,
  keywords: [
    "Frontend Developer",
    "React Developer",
    "Next.js Developer", 
    "Angular Developer",
    "TypeScript Expert",
    "Netherlands",
    "Web Development",
    "UI/UX Development",
    "Accessible Web Design",
    "Senior Developer",
    "Freelance Developer",
    "Amsterdam",
    "Utrecht",
    "Rotterdam"
  ],
  image: `${siteConfig.url}/images/og-image.jpg`,
  url: siteConfig.url,
  type: 'website',
  author: siteConfig.author.name,
};

export const generatePageSEO = (overrides: Partial<SEOConfig> = {}): SEOConfig => {
  return {
    ...defaultSEO,
    ...overrides,
    keywords: overrides.keywords 
      ? [...(defaultSEO.keywords || []), ...overrides.keywords]
      : defaultSEO.keywords,
  };
}; 