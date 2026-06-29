import { Download, ShieldCheck, Wrench } from 'lucide-react';

import { getHomeCopy, getLocalizedPath } from './meccha-i18n';
import { PaidDownloadButton } from './paid-download-button';

export function ToolsTeaser({ locale }: { locale: string }) {
  const copy = getHomeCopy(locale);
  const zh = locale === 'zh';
  const price = '$7';
  const paidTitle = zh
    ? `超级变色龙工具箱 ${price} 付费下载测试`
    : `Meccha Chameleon Tools paid download test - ${price}`;
  const paidBody = zh
    ? '不再把用户导向免费镜像或安装包。先用低价一次性下载按钮测试付费意愿；如果点击足够强，再接 Stripe 支付后下载。'
    : 'No more free mirror or file handoff here. This low one-time download button tests paid intent before Stripe checkout is connected.';
  const paidButton = zh
    ? `Download Tools - ${price}`
    : `Download Tools - ${price}`;

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
    </section>
  );
}
