import { Heart, ImagePlus, UploadCloud } from 'lucide-react';
import Image from 'next/image';

import { COMMUNITY_R2_PUBLIC_DOMAIN, demoCommunityChallenge } from '@/shared/blocks/meccha/community-challenges';
import { getLocalizedPath } from '@/shared/blocks/meccha/atlas-data';

export function CommunityChallengePreview({ locale }: { locale: string }) {
  const zh = locale === 'zh';
  const cta = zh
    ? {
        eyebrow: '社区演示',
        title: '30 分钟未被发现的隐藏挑战',
        description: '玩家提交 30 分钟隐藏成功的截图，获得最多赞的会成为本周社区冠军。',
        submit: '提交我的 30 分钟截图',
        viewAll: '查看社区榜',
        mapLabel: demoCommunityChallenge.mapName,
        player: demoCommunityChallenge.playerName,
        minutes: `${demoCommunityChallenge.minutesHidden}+ 分钟`,
        screenshotAlt: 'Meccha Chameleon 30 分钟隐藏挑战样例截图',
      }
    : {
        eyebrow: 'Community demo',
        title: '30-Minute Hiding Challenge',
        description:
          'Players submit screenshots after surviving 30 minutes undiscovered. The most-liked card becomes the weekly community winner.',
        submit: 'Submit your 30-minute win',
        viewAll: 'See community board',
        mapLabel: demoCommunityChallenge.mapName,
        player: demoCommunityChallenge.playerName,
        minutes: `${demoCommunityChallenge.minutesHidden}+ min`,
        screenshotAlt: 'Meccha Chameleon 30-minute hiding challenge sample screenshot',
      };

  return (
    <div className="rounded-2xl border border-[#E8D7CC] bg-gradient-to-br from-[#FFF1CC] via-[#FFE2D1] to-[#D7E9FF] p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#AA776E]">
        <ImagePlus className="h-3.5 w-3.5" />
        {cta.eyebrow}
      </div>
      <h3 className="text-2xl font-black tracking-tight text-[#29211D] md:text-3xl">{cta.title}</h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-[#4C3B35]">{cta.description}</p>

      <div className="mt-5 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-xl border border-[#E8D7CC] bg-white">
          <Image
            src={demoCommunityChallenge.screenshotUrl}
            alt={cta.screenshotAlt}
            width={800}
            height={448}
            className="h-56 w-full object-cover"
          />
          <div className="p-4">
            <div className="text-base font-black text-[#29211D]">{demoCommunityChallenge.title}</div>
            <div className="mt-1 text-xs text-[#4C3B35]">
              {cta.mapLabel} · {cta.minutes} · {cta.player}
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FFD7E1] px-3 py-1 text-sm font-black text-[#FF6F9A]">
              <Heart className="h-4 w-4 fill-current" />
              {demoCommunityChallenge.likes.toLocaleString()} {zh ? '赞' : 'likes'}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={getLocalizedPath(locale, '/community')}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#29211D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#4C3B35]"
          >
            <UploadCloud className="h-4 w-4" />
            {cta.submit}
          </a>
          <a
            href={getLocalizedPath(locale, '/community')}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#29211D] bg-white px-5 py-3 text-sm font-black text-[#29211D] transition hover:bg-[#fff7c8]"
          >
            {cta.viewAll}
          </a>
          <p className="text-[11px] leading-5 text-[#7D6D69]">
            R2 bucket{' '}
            <a className="underline" href={`${COMMUNITY_R2_PUBLIC_DOMAIN}/`} target="_blank" rel="noopener noreferrer">
              mecchachameleon-art-community
            </a>
            . Submissions are public for this demo; the agent review endpoint can remove unsuitable entries.
          </p>
        </div>
      </div>
    </div>
  );
}
