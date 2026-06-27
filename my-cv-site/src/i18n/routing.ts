import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // All the locales that are supported
  locales: ['en', 'nl'],
  
  // Used when no locale matches
  defaultLocale: 'nl',
  
  // Always show a locale prefix for all routes
  localePrefix: 'always',
  
  // Enable locale detection
  localeDetection: true
}); 