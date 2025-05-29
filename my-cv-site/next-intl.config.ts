import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const safeLocale = locale || 'nl';
  return {
    locale: safeLocale,
    messages: (await import(`./src/i18n/messages/${safeLocale}.json`)).default,
    onError(error) {
      // Log the error but don't throw it
      console.warn('Translation error:', error);
    },
    getMessageFallback({ namespace, key }) {
      // Return the full key path when translation is missing
      const path = [namespace, key].filter(Boolean).join('.');
      return path || key;
    }
  };
});