'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

import { envConfigs } from '@/config';
import { Brand as BrandType } from '@/shared/types/blocks/common';

export function Copyright({ brand }: { brand: BrandType }) {
  const locale = useLocale();
  const rightsCopy: Record<string, string> = {
    en: 'All rights reserved',
    zh: '保留所有权利',
    ru: 'Все права защищены',
    it: 'Tutti i diritti riservati',
    fr: 'Tous droits réservés',
    de: 'Alle Rechte vorbehalten',
    es: 'Todos los derechos reservados',
    pt: 'Todos os direitos reservados',
    ja: '無断転載を禁じます',
    ko: '모든 권리 보유',
    ar: 'جميع الحقوق محفوظة',
    th: 'สงวนลิขสิทธิ์',
    vi: 'Đã đăng ký bản quyền',
    'zh-TW': '保留所有權利',
    nl: 'Alle rechten voorbehouden',
  };
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className={`text-muted-foreground text-sm`}>
      © {currentYear || 2024}{' '}
      <a
        href={brand?.url || envConfigs.app_url}
        target={brand?.target || ''}
        className="text-primary hover:text-primary/80 cursor-pointer"
      >
        {brand?.title || envConfigs.app_name}
      </a>
      , {rightsCopy[locale] ?? rightsCopy.en}
    </div>
  );
}
