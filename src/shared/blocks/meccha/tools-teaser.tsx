import Image from 'next/image';
import { Download, ShieldCheck, Wrench } from 'lucide-react';

import {
  getPlayKitCompareAtLabel,
  getPlayKitOfferLabel,
  getPlayKitPriceLabel,
} from '@/shared/lib/play-kit';
import { getHomeCopy, getLocalizedPath } from './meccha-i18n';
import { PaidDownloadButton } from './paid-download-button';

export function ToolsTeaser({ locale }: { locale: string }) {
  const copy = getHomeCopy(locale);
  const zh = locale === 'zh';
  const price = getPlayKitPriceLabel();
  const compareAtPrice = getPlayKitCompareAtLabel();
  const offerLabel = getPlayKitOfferLabel(locale);
  const paidTitle = zh
    ? `超级变色龙 Play Kit ${price}，让你更顺手地玩`
    : `Meccha Chameleon Play Kit - play better for ${price}`;
  const paidBody = zh
    ? '把开局清单、联机修复、FPS 调整、伪装练习和路线卡放在一个包里，省去来回找资料的时间。'
    : 'Keep the useful parts in one place: fast starts, lobby fixes, FPS tuning, camo practice, and route cards.';
  const paidButton = zh
    ? `获取 Play Kit - ${price}`
    : `Get Play Kit - ${price}`;

  return (
    <section className="border-b border-[#e0b44d]/35 bg-[#fffaf0]">
      <div className="container py-6">
        <div className="rounded-2xl border border-[#e0b44d]/45 bg-white p-5 shadow-[0_16px_50px_rgba(224,180,77,0.18)] md:p-6">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="overflow-hidden rounded-xl border border-[#e0b44d]/35 bg-[#fff8e6]">
              <Image
                src="/imgs/meccha/play-kit-promo.png"
                alt="Meccha Chameleon Play Kit promo preview"
                width={1672}
                height={941}
                className="h-auto w-full"
              />
            </div>
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#e0b44d] text-[#29211D] shadow-sm">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-normal text-[#8B6A18] uppercase">
                  <Wrench className="size-4" />
                  {copy.secondEyebrow}
                </p>
                <h2 className="text-2xl font-bold tracking-normal text-[#29211D] md:text-3xl">
                  {paidTitle}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-[#4C3B35] md:text-base">
                  {paidBody}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded-full bg-[#fff3c9] px-3 py-1 font-semibold text-[#8B6A18]">
                    {offerLabel}
                  </span>
                  <span className="font-bold text-[#29211D]">{price}</span>
                  <span className="text-[#8E7B63] line-through">
                    {compareAtPrice}
                  </span>
                </div>
              </div>
              </div>
              <PaidDownloadButton
                locale={locale}
                href={`${getLocalizedPath(locale, '/tools')}#paid-download-intent`}
                price={price}
                source="home_tools_teaser"
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-[#e0b44d] px-5 py-3 text-sm font-bold text-[#29211D] transition hover:bg-[#c99d2e]"
              >
                <Download className="size-4" />
                {paidButton}
              </PaidDownloadButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
