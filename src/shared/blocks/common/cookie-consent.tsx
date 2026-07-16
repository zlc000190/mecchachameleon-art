'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'meccha_cookie_consent';

export function CookieConsent() {
  const isVisible = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('storage', onStoreChange);
      window.addEventListener('meccha-consent-change', onStoreChange);
      return () => {
        window.removeEventListener('storage', onStoreChange);
        window.removeEventListener('meccha-consent-change', onStoreChange);
      };
    },
    () => window.localStorage.getItem(STORAGE_KEY) === null,
    () => false
  );

  const saveChoice = (choice: 'accepted' | 'rejected') => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    window.dispatchEvent(new Event('meccha-consent-change'));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-3 z-[80] px-3 sm:bottom-6 sm:px-4">
      <div className="mx-auto flex max-w-4xl items-center gap-2 rounded-[8px] border border-white/15 bg-[#1f2d28]/95 px-3 py-2.5 text-white shadow-2xl backdrop-blur sm:gap-3 sm:px-4 sm:py-3 md:px-5">
        <div className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-[#a6ff7a]/50 bg-[#a6ff7a]/10 text-[#a6ff7a] sm:flex">
          <Cookie className="size-5" aria-hidden="true" />
        </div>
        <p className="min-w-0 flex-1 text-xs leading-5 text-white/82 sm:text-sm md:text-base">
          This site uses local storage for convenience features. Advertising and
          analytics are disabled by default during review. See our{' '}
          <Link href="/privacy-policy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={() => saveChoice('accepted')}
          className="shrink-0 rounded-full bg-[#a6ff7a] px-3 py-2 text-xs font-black tracking-wide text-[#1d241d] uppercase transition hover:bg-[#b9ff93] focus:ring-2 focus:ring-[#a6ff7a] focus:ring-offset-2 focus:ring-offset-[#1f2d28] focus:outline-none sm:px-5"
        >
          Allow storage
        </button>
        <button
          type="button"
          onClick={() => saveChoice('rejected')}
          className="shrink-0 rounded-full border border-white/30 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10 sm:px-4"
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={() => saveChoice('rejected')}
          aria-label="Close cookie notice"
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/75 transition hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-white/60 focus:outline-none sm:size-9"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
