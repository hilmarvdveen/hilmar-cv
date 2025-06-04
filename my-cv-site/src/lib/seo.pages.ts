import { SEOPageConfig } from '@/types/seo.types';
import { siteConfig } from '@/lib/seo.config';

export const homepageSEO = (locale: string): SEOPageConfig => ({
  seo: {
    title: `${siteConfig.name} - Senior Frontend Developer | React, Next.js, Angular Expert`,
    description: "Experienced Senior Frontend Developer from the Netherlands specializing in React, Next.js, and Angular. 10+ years building scalable, accessible web applications for top companies. Available for freelance projects.",
    keywords: [
      "Senior Frontend Developer",
      "React Developer Netherlands", 
      "Next.js Expert",
      "Angular Developer",
      "TypeScript Specialist",
      "Frontend Consultant",
      "Web Development Amsterdam",
      "JavaScript Expert",
      "UI/UX Developer",
      "Accessible Web Design",
      "Performance Optimization",
      "Modern Frontend Architecture",
      "Component Libraries",
      "Design Systems",
      "Freelance Developer Netherlands"
    ],
    image: `${siteConfig.url}/images/hilmar-hero-og.jpg`,
    type: 'profile',
  },
  structuredData: [
    {
      type: 'Person',
      data: {
        "@id": `${siteConfig.url}/#person`,
        "name": siteConfig.author.name,
        "alternateName": "Hilmar",
        "jobTitle": "Senior Frontend Developer",
        "description": "Experienced Senior Frontend Developer with 10+ years of expertise in React, Next.js, Angular, and TypeScript",
        "url": siteConfig.url,
        "image": `${siteConfig.url}/images/hilmar-profile.jpg`,
        "sameAs": [
          siteConfig.author.linkedin,
          siteConfig.author.github,
          `https://twitter.com/${siteConfig.social.twitter.replace('@', '')}`
        ],
        "address": {
          "@type": "PostalAddress",
          "addressLocality": siteConfig.location.city,
          "addressRegion": siteConfig.location.region,
          "addressCountry": "NL"
        },
        "knowsAbout": [
          "React.js", "Next.js", "Angular", "TypeScript", "JavaScript",
          "Frontend Development", "Web Development", "UI/UX Design"
        ],
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Senior Frontend Developer",
          "occupationLocation": {
            "@type": "Country",
            "name": siteConfig.location.country
          },
          "skills": [
            "React.js", "Next.js", "Angular", "TypeScript", "JavaScript",
            "HTML5", "CSS3", "SASS/SCSS", "Tailwind CSS", "Redux",
            "GraphQL", "REST APIs", "Git", "Webpack", "Vite",
            "Testing (Jest, Cypress)", "Accessibility (WCAG)",
            "Performance Optimization", "Progressive Web Apps"
          ]
        }
      }
    }
  ],
  breadcrumbs: [
    {
      name: "Home",
      url: `${siteConfig.url}/${locale}`
    }
  ]
});

export const servicesSEO = (locale: string): SEOPageConfig => ({
  seo: {
    title: "Frontend Development Services | React, Next.js, Angular Expert",
    description: "Professional frontend development services in React, Next.js, Angular, and TypeScript. Full-stack solutions, design systems, and technical consulting. 15+ years experience in the Netherlands.",
    keywords: [
      "Frontend Development Services",
      "React Development Netherlands",
      "Next.js Development",
      "Angular Development",
      "Full-Stack Development",
      "Design Systems",
      "Technical Consulting",
      "TypeScript Development",
      "Web Development Amsterdam",
      "JavaScript Expert",
      "UI/UX Development",
      "Component Libraries",
      "Performance Optimization",
      "Freelance Developer",
      "Remote Development Services"
    ],
    image: `${siteConfig.url}/images/services-og.jpg`,
    type: 'website',
  },
  structuredData: [
    {
      type: 'Service',
      data: {
        "@type": "ProfessionalService",
        "name": "Frontend Development Services",
        "description": "Professional web development services specializing in React, Next.js, Angular, and TypeScript",
        "provider": {
          "@type": "Person",
          "@id": `${siteConfig.url}/#person`,
          "name": siteConfig.author.name
        },
        "areaServed": {
          "@type": "Country",
          "name": siteConfig.location.country
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Development Services",
          "itemListElement": siteConfig.business.services.map(service => ({
            "@type": "Offer",
            "name": service,
            "description": `Professional ${service.toLowerCase()} services`,
            "category": "Web Development"
          }))
        }
      }
    }
  ],
  breadcrumbs: [
    {
      name: "Home",
      url: `${siteConfig.url}/${locale}`
    },
    {
      name: "Services",
      url: `${siteConfig.url}/${locale}/services`
    }
  ]
});

export const aboutSEO = (locale: string): SEOPageConfig => ({
  seo: {
    title: "About Hilmar van der Veen - Senior Frontend Developer",
    description: "Learn about Hilmar van der Veen, a Senior Frontend Developer with 10+ years of experience in React, Next.js, and Angular. Based in Amsterdam, Netherlands.",
    keywords: [
      "About Hilmar van der Veen",
      "Senior Frontend Developer Amsterdam",
      "React Developer Biography",
      "Frontend Developer Experience",
      "JavaScript Expert Netherlands"
    ],
    image: `${siteConfig.url}/images/about-og.jpg`,
    type: 'profile',
  },
  breadcrumbs: [
    {
      name: "Home", 
      url: `${siteConfig.url}/${locale}`
    },
    {
      name: "About",
      url: `${siteConfig.url}/${locale}/about`
    }
  ]
});

export const contactSEO = (locale: string): SEOPageConfig => ({
  seo: {
    title: "Contact Hilmar van der Veen - Frontend Development Services",
    description: "Get in touch with Hilmar van der Veen for frontend development projects. Available for React, Next.js, Angular, and TypeScript development work.",
    keywords: [
      "Contact Frontend Developer",
      "Hire React Developer",
      "Frontend Development Contact",
      "Web Developer Amsterdam",
      "Freelance Developer Contact"
    ],
    image: `${siteConfig.url}/images/contact-og.jpg`,
    type: 'website',
  },
  breadcrumbs: [
    {
      name: "Home",
      url: `${siteConfig.url}/${locale}`
    },
    {
      name: "Contact",
      url: `${siteConfig.url}/${locale}/contact`
    }
  ]
});

export const projectsSEO = (locale: string): SEOPageConfig => ({
  seo: {
    title: "Frontend Development Projects - React, Next.js, Angular Portfolio",
    description: "Explore Hilmar van der Veen's frontend development portfolio featuring React, Next.js, and Angular projects. See real-world applications and case studies.",
    keywords: [
      "Frontend Portfolio",
      "React Projects",
      "Next.js Portfolio",
      "Angular Projects",
      "Web Development Portfolio",
      "JavaScript Projects",
      "TypeScript Applications"
    ],
    image: `${siteConfig.url}/images/projects-og.jpg`,
    type: 'website',
  },
  breadcrumbs: [
    {
      name: "Home",
      url: `${siteConfig.url}/${locale}`
    },
    {
      name: "Projects", 
      url: `${siteConfig.url}/${locale}/projects`
    }
  ]
}); 