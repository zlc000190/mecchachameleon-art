import type { MetadataRoute } from 'next';

import { envConfigs } from '@/config';

export default function robots(): MetadataRoute.Robots {
  const base = envConfigs.app_url.replace(/\/$/, '');
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api',
          '/admin',
          '/settings',
          '/activity',
          '/sign-in',
          '/sign-up',
          '/verify-email',
        ],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/api', '/admin', '/settings', '/activity'],
        crawlDelay: 1,
      },
      {
        userAgent: 'YandexBot',
        allow: '/',
        disallow: ['/api', '/admin', '/settings', '/activity'],
        crawlDelay: 1,
      },
    ],
    sitemap: [`${base}/sitemap.xml`],
    host: base,
  };
}
