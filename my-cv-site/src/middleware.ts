import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '../i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always' // Force prefix, e.g. /nl, /en
});

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|assets|api|.*\\..*).*)'], // Match root and locale-prefix
}; 