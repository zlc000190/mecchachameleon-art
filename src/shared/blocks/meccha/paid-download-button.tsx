'use client';

import type { ReactNode } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, string> }
    ) => void;
    op?: (...args: unknown[]) => void;
  }
}

type PaidDownloadButtonProps = {
  children: ReactNode;
  className: string;
  href?: string;
  locale: string;
  price: string;
  source: string;
};

export function PaidDownloadButton({
  children,
  className,
  href = '#paid-download-intent',
  locale,
  price,
  source,
}: PaidDownloadButtonProps) {
  const trackIntent = () => {
    const value = Number.parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    const props = {
      locale,
      price,
      source,
    };

    window.gtag?.('event', 'paid_download_intent', {
      currency: 'USD',
      event_category: 'monetization',
      event_label: source,
      locale,
      value,
    });
    window.plausible?.('Paid Download Intent', { props });
    window.op?.('track', 'paid_download_intent', props);
  };

  return (
    <a
      href={href}
      onClick={trackIntent}
      data-event="paid_download_intent"
      data-locale={locale}
      data-price={price}
      data-source={source}
      className={className}
    >
      {children}
    </a>
  );
}
