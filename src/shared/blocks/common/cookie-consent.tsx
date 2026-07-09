'use client';

import { Cookie, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'meccha_cookie_consent';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(window.localStorage.getItem(STORAGE_KEY) !== 'accepted');
  }, []);

  const accept = () => {
    window.localStorage.setItem(STORAGE_KEY, 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-[80] px-4 sm:bottom-6">
      <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-[8px] border border-white/15 bg-[#1f2d28]/95 px-4 py-3 text-white shadow-2xl backdrop-blur md:px-5">
        <div className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-[#a6ff7a]/50 bg-[#a6ff7a]/10 text-[#a6ff7a] sm:flex">
          <Cookie className="size-5" aria-hidden="true" />
        </div>
        <p className="min-w-0 flex-1 text-sm leading-5 text-white/82 md:text-base">
          We use cookies to improve your browsing experience and analyze site traffic.
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-full bg-[#a6ff7a] px-5 py-2 text-xs font-black uppercase tracking-wide text-[#1d241d] transition hover:bg-[#b9ff93] focus:outline-none focus:ring-2 focus:ring-[#a6ff7a] focus:ring-offset-2 focus:ring-offset-[#1f2d28]"
        >
          Got it
        </button>
        <button
          type="button"
          onClick={accept}
          aria-label="Close cookie notice"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/75 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/60"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
