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
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
