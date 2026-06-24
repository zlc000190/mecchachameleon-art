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
          '/admin',
          '/api',
          '/ai-image-generator',
          '/ai-music-generator',
          '/ai-video-generator',
          '/blog',
          '/docs',
          '/no-permission',
          '/pricing',
          '/showcases',
          '/sign-in',
          '/sign-up',
          '/updates',
          '/verify-email',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/ai-image-generator',
          '/ai-music-generator',
          '/ai-video-generator',
          '/blog',
          '/docs',
          '/no-permission',
          '/pricing',
          '/showcases',
          '/sign-in',
          '/sign-up',
          '/updates',
          '/verify-email',
        ],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/admin', '/api'],
        crawlDelay: 1,
      },
      {
        userAgent: 'YandexBot',
        allow: '/',
        disallow: ['/admin', '/api'],
        crawlDelay: 1,
      },
    ],
    sitemap: [
      `${base}/sitemap.xml`,
      // 显式声明多语言站点, 帮 Yandex 抓全
    ],
    host: base,
  };
}
