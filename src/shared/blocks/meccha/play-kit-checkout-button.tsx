'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

export function PlayKitCheckoutButton({
  label,
  priceLabel,
}: {
  label: string;
  priceLabel: string;
}) {
  const [loading, setLoading] = useState(false);

  const startCheckout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/play-kit/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok || !data?.url) {
        throw new Error(data?.error || 'checkout failed');
      }
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert('Checkout could not start right now.');
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={startCheckout}
      disabled={loading}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#39ff88] px-5 py-3 text-sm font-bold text-[#07131f] transition hover:bg-[#72ffad] disabled:cursor-not-allowed disabled:opacity-70"
      data-analytics="download-tools-intent"
      data-product="meccha-play-kit"
      data-price={priceLabel}
    >
      <Download className="h-4 w-4" />
      {loading ? 'Opening checkout…' : label}
    </button>
  );
}
