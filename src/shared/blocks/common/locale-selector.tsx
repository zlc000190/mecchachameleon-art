'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronDown, Languages } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { usePathname, useRouter } from '@/core/i18n/navigation';
import { localeNames } from '@/config/locale';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { cacheSet } from '@/shared/lib/cache';

const localeFlags: Record<string, string> = {
  en: '🇬🇧',
  zh: '🇨🇳',
  ru: '🇷🇺',
  it: '🇮🇹',
  fr: '🇫🇷',
  de: '🇩🇪',
  es: '🇪🇸',
  pt: '🇵🇹',
  ja: '🇯🇵',
  ko: '🇰🇷',
  ar: '🇸🇦',
  th: '🇹🇭',
  vi: '🇻🇳',
  'zh-TW': '⚐',
  nl: '🇳🇱',
};

export function LocaleSelector({
  type = 'icon',
}: {
  type?: 'icon' | 'button' | 'flag' | 'footer-select';
}) {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentFlag = localeFlags[currentLocale] ?? '🌐';

  const handleSwitchLanguage = (value: string) => {
    if (value !== currentLocale) {
      cacheSet('locale', value);
      const query = searchParams?.toString?.() ?? '';
      const href = query ? `${pathname}?${query}` : pathname;
      router.push(href, { locale: value });
    }
  };

  const buttonClass =
    type === 'footer-select'
      ? 'min-w-[220px] justify-between whitespace-nowrap border-[#D8CFC6] bg-white text-[#29211D] hover:bg-[#fff7c8]'
      : type === 'flag'
        ? 'h-9 gap-1.5 whitespace-nowrap rounded-full border border-[#e0b44d]/50 bg-white/85 px-2.5 text-base shadow-sm hover:bg-[#fff7c8]'
        : type === 'icon'
          ? 'h-auto w-auto p-0'
          : 'hover:bg-primary/10';

  if (!mounted) {
    return (
      <Button
        variant={type === 'icon' ? 'ghost' : 'outline'}
        size={type === 'icon' ? 'icon' : 'sm'}
        className={buttonClass}
        disabled
        aria-label="Switch language"
      >
        {type === 'flag' ? (
          <span aria-hidden>{currentFlag}</span>
        ) : type === 'footer-select' ? (
          <>
            <span>{currentFlag} {localeNames[currentLocale]}</span>
            <ChevronDown size={16} />
          </>
        ) : type === 'icon' ? (
          <Languages size={18} />
        ) : (
          <span>{currentFlag} {localeNames[currentLocale]}</span>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={type === 'icon' ? 'ghost' : 'outline'}
          size={type === 'icon' ? 'icon' : 'sm'}
          className={buttonClass}
          aria-label="Switch language"
        >
          {type === 'flag' ? (
            <>
              <span aria-hidden className="text-lg leading-none">{currentFlag}</span>
              <ChevronDown size={13} />
            </>
          ) : type === 'footer-select' ? (
            <>
              <span>{currentFlag} {localeNames[currentLocale]}</span>
              <ChevronDown size={16} />
            </>
          ) : type === 'icon' ? (
            <Languages size={18} />
          ) : (
            <span>{currentFlag} {localeNames[currentLocale]}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[360px] min-w-[220px] overflow-y-auto">
        {Object.keys(localeNames).map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleSwitchLanguage(locale)}
            className="flex cursor-pointer items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden>{localeFlags[locale] ?? '🌐'}</span>
              <span>{localeNames[locale]}</span>
            </span>
            {locale === currentLocale && <Check size={16} className="text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
