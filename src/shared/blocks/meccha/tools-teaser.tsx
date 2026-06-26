import { ArrowRight, ShieldCheck, Wrench } from 'lucide-react';

import { getLocalizedPath, getHomeCopy } from './meccha-i18n';

export function ToolsTeaser({ locale }: { locale: string }) {
  const copy = getHomeCopy(locale);

  return (
    <section className="border-b border-[#e0b44d]/35 bg-[#fffaf0]">
      <div className="container py-6">
        <div className="rounded-2xl border border-[#e0b44d]/45 bg-white p-5 shadow-[0_16px_50px_rgba(224,180,77,0.18)] md:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#e0b44d] text-[#29211D] shadow-sm">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-normal text-[#8B6A18]">
                  <Wrench className="size-4" />
                  {copy.secondEyebrow}
                </p>
                <h2 className="text-2xl font-bold tracking-normal text-[#29211D] md:text-3xl">
                  {copy.secondTitle}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-[#4C3B35] md:text-base">
                  {copy.secondDesc}
                </p>
              </div>
            </div>
            <a
              href={getLocalizedPath(locale, '/tools')}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-[#e0b44d] px-5 py-3 text-sm font-bold text-[#29211D] transition hover:bg-[#c99d2e]"
            >
              {copy.openTools}
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
