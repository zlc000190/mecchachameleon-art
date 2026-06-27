import '@/config/style/global.css';

import { getLocale, setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';

import { envConfigs } from '@/config';
import { seoLocales } from '@/config/locale';
import { UtmCapture } from '@/shared/blocks/common/utm-capture';
import { getAllConfigs } from '@/shared/models/config';
import { getAdsService } from '@/shared/services/ads';
import { getAffiliateService } from '@/shared/services/affiliate';
import { getAnalyticsService } from '@/shared/services/analytics';
import { getCustomerService } from '@/shared/services/customer_service';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  setRequestLocale(locale);

  const isProduction = process.env.NODE_ENV === 'production';
  const isDebug = process.env.NEXT_PUBLIC_DEBUG === 'true';

  // app url
  const appUrl = envConfigs.app_url || '';

  // current URL — set by middleware/proxy as `x-url`. Used to build hreflang
  // alternates that point at the SAME pathname in each language instead of
  // every alternate pointing at the homepage (the old bug).
  const headerList = await headers();
  const requestUrl = headerList.get('x-url') || '';
  let currentPath = '/';
  try {
    currentPath = requestUrl ? new URL(requestUrl).pathname.replace(/\/+$/, '/') || '/' : '/';
  } catch {
    currentPath = '/';
  }
  // strip leading locale segment so we can rebuild per-locale URLs
  const strippedPath = currentPath.replace(
    /^\/(en|zh|ru|it|fr|de|es|pt|ja|ko|ar|th|vi|zh-TW|nl)(?=\/|$)/,
    ''
  ) || '/';
  const altUrl = (loc: string) => {
    const homePath = strippedPath === '/';
    if (loc === 'en') {
      return `${appUrl}${homePath ? '/' : strippedPath}`;
    }
    return `${appUrl}/${loc}${homePath ? '' : strippedPath}`;
  };

  const activeSeoLocales = strippedPath === '/'
    ? seoLocales
    : seoLocales.filter((loc) => loc !== 'es' && loc !== 'de' && loc !== 'pt' && loc !== 'fr' && loc !== 'it' && loc !== 'nl' && loc !== 'ar');

  // ads components
  let adsMetaTags = null;
  let adsHeadScripts = null;
  let adsBodyScripts = null;

  // analytics components
  let analyticsMetaTags = null;
  let analyticsHeadScripts = null;
  let analyticsBodyScripts = null;

  // affiliate components
  let affiliateMetaTags = null;
  let affiliateHeadScripts = null;
  let affiliateBodyScripts = null;

  // customer service components
  let customerServiceMetaTags = null;
  let customerServiceHeadScripts = null;
  let customerServiceBodyScripts = null;

  if (isProduction || isDebug) {
    const configs = await getAllConfigs();

    const [adsService, analyticsService, affiliateService, customerService] =
      await Promise.all([
        getAdsService(configs),
        getAnalyticsService(configs),
        getAffiliateService(configs),
        getCustomerService(configs),
      ]);

    // get ads components
    adsMetaTags = adsService.getMetaTags();
    adsHeadScripts = adsService.getHeadScripts();
    adsBodyScripts = adsService.getBodyScripts();

    // get analytics components
    analyticsMetaTags = analyticsService.getMetaTags();
    analyticsHeadScripts = analyticsService.getHeadScripts();
    analyticsBodyScripts = analyticsService.getBodyScripts();

    // get affiliate components
    affiliateMetaTags = affiliateService.getMetaTags();
    affiliateHeadScripts = affiliateService.getHeadScripts();
    affiliateBodyScripts = affiliateService.getBodyScripts();

    // get customer service components
    customerServiceMetaTags = customerService.getMetaTags();
    customerServiceHeadScripts = customerService.getHeadScripts();
    customerServiceBodyScripts = customerService.getBodyScripts();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="icon" href={envConfigs.app_favicon} />
        <link rel="alternate icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="google-adsense-account" content="ca-pub-5387615281666707" />

        {/* hreflang alternates — only SEO-approved locales are emitted.
            Half-translated new locales are routable only after native keyword
            rewrites; exposing them here would dilute the new site's quality. */}
        {activeSeoLocales ? (
          <>
            {activeSeoLocales.map((loc) => (
              <link
                key={loc}
                rel="alternate"
                hrefLang={loc}
                href={altUrl(loc)}
              />
            ))}
            <link
              rel="alternate"
              hrefLang="x-default"
              href={altUrl('en')}
            />
          </>
        ) : null}

        {/* inject ads meta tags */}
        {adsMetaTags}
        {/* inject ads head scripts */}
        {adsHeadScripts}

        {/* inject analytics meta tags */}
        {analyticsMetaTags}
        {/* inject analytics head scripts */}
        {analyticsHeadScripts}

        {/* inject affiliate meta tags */}
        {affiliateMetaTags}
        {/* inject affiliate head scripts */}
        {affiliateHeadScripts}

        {/* inject customer service meta tags */}
        {customerServiceMetaTags}
        {/* inject customer service head scripts */}
        {customerServiceHeadScripts}
      </head>
      <body suppressHydrationWarning className="overflow-x-hidden">
        <NextTopLoader
          color="#6466F1"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
        />

        <UtmCapture />

        {children}

        {/* inject ads body scripts */}
        {adsBodyScripts}

        {/* inject analytics body scripts */}
        {analyticsBodyScripts}

        {/* inject affiliate body scripts */}
        {affiliateBodyScripts}

        {/* inject customer service body scripts */}
        {customerServiceBodyScripts}
      </body>
    </html>
  );
}
