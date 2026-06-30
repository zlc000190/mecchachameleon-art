import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Download, ShieldCheck } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { getCanonicalUrl } from '@/shared/lib/seo';

const ORIGINAL_DOWNLOAD_URL =
  'https://pub-df9b5ddb7c4049af9616db9a99a48adf.r2.dev/mecchachameleon.art-ass/MecchaCamouflage.exe';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = await getCanonicalUrl('/tools/success', locale);
  return {
    title: 'Play Kit payment complete',
    description: 'Your Stripe payment went through. Download the Meccha Chameleon tools pack now.',
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: 'Play Kit payment complete',
      description: 'Your Stripe payment went through. Download the Meccha Chameleon tools pack now.',
      url: canonicalUrl,
      images: [envConfigs.app_preview_image],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Play Kit payment complete',
      description: 'Your Stripe payment went through. Download the Meccha Chameleon tools pack now.',
      images: [envConfigs.app_preview_image],
    },
  };
}

export default async function ToolsSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale } = await params;
  const { session_id: sessionId } = await searchParams;
  setRequestLocale(locale);

  const downloadHref = sessionId
    ? `/api/play-kit/download?session_id=${encodeURIComponent(sessionId)}`
    : ORIGINAL_DOWNLOAD_URL;

  return (
    <main className="min-h-screen bg-[#06121b] text-white">
      <section className="container py-28 lg:py-36">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#39ff88]/35 bg-[#39ff88]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#39ff88]">
            <CheckCircle2 className="h-4 w-4" />
            Payment confirmed
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-normal md:text-6xl">
            Your Play Kit is ready.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 md:text-lg">
            Stripe marked this purchase as paid. Download the pack now, then jump back into the maps-first guide flow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={downloadHref}
              className="inline-flex min-h-12 items-center gap-2 rounded-md bg-[#39ff88] px-5 py-3 text-sm font-bold text-[#06121b] hover:bg-[#72ffad]"
            >
              <Download className="h-4 w-4" />
              Download original file
            </a>
            <Link
              href="/tools"
              className="inline-flex min-h-12 items-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              <ShieldCheck className="h-4 w-4" />
              Back to tools
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
