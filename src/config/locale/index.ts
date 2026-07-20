import { envConfigs } from '..';

export const localeNames: any = {
  en: 'English',
  zh: '中文',
  ru: 'Русский',
  it: 'Italiano',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
  ja: '日本語',
  ko: '한국어',
  ar: 'العربية',
  th: 'ไทย',
  vi: 'Tiếng Việt',
  'zh-TW': '繁體中文',
  nl: 'Nederlands',
};

export const locales = [
  'en',
  'zh',
  'ru',
  'it',
  'fr',
  'de',
  'es',
  'pt',
  'ja',
  'ko',
  'ar',
  'th',
  'vi',
  'zh-TW',
  'nl',
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale = envConfigs.locale;

export const localePrefix = 'as-needed';

export const localeDetection = false;

export const localeMessagesRootPath = '@/config/locale/messages';

export const localeMessagesPaths = [
  'common',
  'landing',
  'showcases',
  'blog',
  'updates',
  'pricing',
  'settings/sidebar',
  'settings/profile',
  'settings/security',
  'settings/billing',
  'settings/payments',
  'settings/credits',
  'settings/apikeys',
  'admin/sidebar',
  'admin/users',
  'admin/roles',
  'admin/permissions',
  'admin/categories',
  'admin/posts',
  'admin/payments',
  'admin/subscriptions',
  'admin/credits',
  'admin/settings',
  'admin/apikeys',
  'admin/ai-tasks',
  'admin/chats',
  'ai/music',
  'ai/chat',
  'ai/image',
  'ai/video',
  'activity/sidebar',
  'activity/ai-tasks',
  'activity/chats',
  'pages/index',
  'pages/pricing',
  'pages/showcases',
  'pages/blog',
  'pages/updates',
];

// Locales that have a full i18n JSON bundle under src/config/locale/messages/<locale>.
// `ru` is included for legacy reasons (the brand is anchored in Russian search intent).
export const fullyTranslatedLocales: Locale[] = ['en', 'zh', 'ru'];

// Only locales with acceptable page-body completeness stay in SEO alternates.
// New-site rule: do not expose half-translated locales to Google. Promote a
// locale here only after target-country keyword research and native rewrite.
export const seoLocales: Locale[] = [
  'en',
  'zh',
  'ru',
  'es',
  'de',
  'pt',
  'fr',
  'it',
  'nl',
  'ar',
  'ja',
  'ko',
];

// Key SEO pages that stay indexable for currently approved SEO locales.
export const keySeoPages = [
  '/',
  '/tools',
  '/new-player',
  '/maps',
  '/community',
  '/how-to-play',
  '/hiding-spots',
  '/camo-guide',
] as const;

// These guide pages have substantial, independently written English and
// Spanish bodies. Other locale variants stay consolidated until their copy is
// ready, so hreflang never advertises a translated URL that redirects.
export const localizedGuidePages = [
  '/how-to-play',
  '/hiding-spots',
  '/camo-guide',
] as const;

// Locales that read right-to-left.
export const rtlLocales: Locale[] = ['ar'];

export function isRtl(locale: string): boolean {
  return (rtlLocales as readonly string[]).includes(locale);
}

export function isKeySeoPath(pathname: string): boolean {
  // Strip locale prefix (e.g. "/fr/maps/vintage-room" -> "/maps/vintage-room")
  const stripped = pathname.replace(
    /^\/(en|zh|ru|it|fr|de|es|pt|ja|ko|ar|th|vi|zh-TW|nl)(?=\/|$)/,
    ''
  );
  return keySeoPages.some(
    (p) => stripped === p || stripped.startsWith(`${p}/`)
  );
}
