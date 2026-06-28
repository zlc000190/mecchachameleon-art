import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';
import createIntlMiddleware from 'next-intl/middleware';

import { isKeySeoPath, locales } from '@/config/locale';
import { routing } from '@/core/i18n/config';

const intlMiddleware = createIntlMiddleware(routing);

// Locales whose landing.json has been translated and reviewed. The homepage
// (/, /<locale>) is promoted to search engines; sub-pages still fall back
// to the English version of the page (e.g. /th/tools -> /tools) via the
// isKeySeoPath() check below + next-intl's locale-stripping. This list
// intentionally includes every locale that has a landing.json translation,
// regardless of translation maturity. Adding a locale here is the
// canonical "promote this locale to first-class homepage visibility"
// switch.
const LOCALES_WITH_HOMEPAGE = [
  'es',
  'de',
  'pt',
  'fr',
  'it',
  'nl',
  'ar',
  'ja',
  'ko',
  'th',
  'vi',
  'zh-TW',
] as const;

function stripLocale(pathname: string): { locale: string; rest: string } {
  const seg = pathname.split('/')[1] ?? '';
  if ((locales as readonly string[]).includes(seg)) {
    return { locale: seg, rest: '/' + pathname.split('/').slice(2).join('/') };
  }
  return { locale: '', rest: pathname };
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle internationalization first
  const intlResponse = intlMiddleware(request);

  // Extract locale from pathname
  const locale = pathname.split('/')[1];
  const isValidLocale = (locales as readonly string[]).includes(locale);
  const pathWithoutLocale = isValidLocale
    ? pathname.slice(locale.length + 1)
    : pathname;

  // For every locale that has a translated landing page, only key SEO
  // pages (/, /tools, /new-player, /maps, /community) are promoted at
  // their non-root path. Deeper paths (e.g. /it/pricing, /ja/showcases)
  // are consolidated to the English homepage because the shared/models
  // translations are not yet complete for any locale other than en/zh.
  // Key SEO paths themselves are NOT 301'd here; next-intl middleware
  // strips the locale prefix and serves the English version of the page.
  if (
    isValidLocale &&
    (LOCALES_WITH_HOMEPAGE as readonly string[]).includes(locale) &&
    pathWithoutLocale !== '' &&
    pathWithoutLocale !== '/' &&
    !isKeySeoPath(pathWithoutLocale)
  ) {
    const fallbackUrl = new URL('/', request.url);
    return NextResponse.redirect(fallbackUrl, 301);
  }

  // Only check authentication for admin routes
  if (
    pathWithoutLocale.startsWith('/admin') ||
    pathWithoutLocale.startsWith('/settings') ||
    pathWithoutLocale.startsWith('/activity')
  ) {
    // Check if session cookie exists
    const sessionCookie = getSessionCookie(request);

    // If no session token found, redirect to sign-in
    if (!sessionCookie) {
      const signInUrl = new URL(
        isValidLocale ? `/${locale}/sign-in` : '/sign-in',
        request.url
      );
      // Add the current path (including search params) as callback - use relative path for multi-language support
      const callbackPath = pathWithoutLocale + request.nextUrl.search;
      signInUrl.searchParams.set('callbackUrl', callbackPath);
      return NextResponse.redirect(signInUrl);
    }

    // For admin routes, we need to check RBAC permissions
    // Note: Full permission check happens in the page/API route level
    // This is a lightweight session check to prevent unauthorized access
    // The detailed permission check (admin.access and specific permissions)
    // will be done in the layout or individual pages using requirePermission()
  }

  intlResponse.headers.set('x-pathname', request.nextUrl.pathname);
  intlResponse.headers.set('x-url', request.url);

  const normalizedPathForSeo = pathWithoutLocale === '' ? '/' : pathWithoutLocale;
  if (!isKeySeoPath(normalizedPathForSeo)) {
    intlResponse.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  // Remove Set-Cookie from public pages to allow caching
  // We exclude admin, settings, activity, and auth pages from this behavior
  if (
    !pathWithoutLocale.startsWith('/admin') &&
    !pathWithoutLocale.startsWith('/settings') &&
    !pathWithoutLocale.startsWith('/activity') &&
    !pathWithoutLocale.startsWith('/sign-') &&
    !pathWithoutLocale.startsWith('/auth')
  ) {
    intlResponse.headers.delete('Set-Cookie');

    // Cache-Control header for public pages
    const cacheControl = 'public, s-maxage=3600, stale-while-revalidate=14400';

    intlResponse.headers.set('Cache-Control', cacheControl);
    intlResponse.headers.set('CDN-Cache-Control', cacheControl);
    intlResponse.headers.set('Cloudflare-CDN-Cache-Control', cacheControl);
  }

  // For all other routes (including /, /sign-in, /sign-up, /sign-out), just return the intl response
  return intlResponse;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
