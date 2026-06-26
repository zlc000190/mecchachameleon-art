import { defineRouting } from 'next-intl/routing';

import {
  defaultLocale,
  localeDetection,
  localePrefix,
  locales,
} from '@/config/locale';

export const routing = defineRouting({
  locales: locales as unknown as typeof locales & string[],
  defaultLocale: defaultLocale as (typeof locales)[number],
  localePrefix,
  localeDetection,
});
