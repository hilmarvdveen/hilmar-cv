import type { Metadata } from 'next';
import { BUSINESS_PROFILE } from './constants/meta-constants';

export const SEOUtils = {
  generateJSONLD: (schemas: any[]) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    return schemas.map(schema => JSON.stringify(schema, null, 2)).join('\n\n');
  },

  createMetaTags: (metadata: Metadata) => {
    const tags = [];

    if (metadata.title) tags.push({ name: 'title', content: metadata.title });
    if (metadata.description) tags.push({ name: 'description', content: metadata.description });
    if (metadata.keywords) tags.push({ name: 'keywords', content: Array.isArray(metadata.keywords) ? metadata.keywords.join(', ') : metadata.keywords });

    if (metadata.openGraph) {
      Object.entries(metadata.openGraph).forEach(([key, value]) => {
        if (value) tags.push({ property: `og:${key}`, content: value });
      });
    }

    if (metadata.twitter) {
      Object.entries(metadata.twitter).forEach(([key, value]) => {
        if (value) tags.push({ name: `twitter:${key}`, content: value });
      });
    }

    return tags;
  },

  validateURL: (url: string) => {
    const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return urlPattern.test(url);
  },

  generateRobotsTxt: () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || BUSINESS_PROFILE.CONTACT.WEBSITE;
    const trainingCrawlers = ['GPTBot', 'ClaudeBot', 'Applebot-Extended', 'CCBot'];
    const harvesters = [
      'Bytespider',
      'Diffbot',
      'Scrapy',
      'magpie-crawler',
      'omgili',
      'omgilibot',
      'Node/simplecrawler',
      'Claude-Web',
      'anthropic-ai',
      'cohere-ai'
    ];
    const blockedCrawlers = [...harvesters, ...trainingCrawlers];
    const blockedGroups = blockedCrawlers
      .map((agent) => `User-agent: ${agent}\nDisallow: /`)
      .join('\n\n');

    return `User-agent: *\nAllow: /api/og\nDisallow: /api/\n\n${blockedGroups}\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  }
}; 