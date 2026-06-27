import { Heart, ImagePlus, UploadCloud } from 'lucide-react';
import Image from 'next/image';

import { COMMUNITY_R2_PUBLIC_DOMAIN, demoCommunityChallenge } from '@/shared/blocks/meccha/community-challenges';
import { getLocalizedPath } from '@/shared/blocks/meccha/atlas-data';

const previewCopy = {
  zh: {
    eyebrow: '社区演示',
    title: '30 分钟未被发现的隐藏挑战',
    description: '玩家提交 30 分钟隐藏成功的截图，获得最多赞的会成为本周社区冠军。',
    submit: '提交我的 30 分钟截图',
    viewAll: '查看社区榜',
    minutes: `${demoCommunityChallenge.minutesHidden}+ 分钟`,
    screenshotAlt: 'Meccha Chameleon 30 分钟隐藏挑战样例截图',
    likes: '赞',
    note: 'R2 存储桶 mecchachameleon-art-community。当前演示中的投稿默认公开；agent 审核端点可以移除不合适内容。',
  },
  ru: {
    eyebrow: 'Демо сообщества',
    title: 'Испытание: спрячься на 30 минут',
    description: 'Игроки загружают скриншоты после 30 минут выживания без обнаружения. Карточка с наибольшим числом лайков становится победителем недели.',
    submit: 'Отправить мой скрин на 30 минут',
    viewAll: 'Открыть рейтинг сообщества',
    minutes: `${demoCommunityChallenge.minutesHidden}+ мин`,
    screenshotAlt: 'Пример скриншота испытания Meccha Chameleon на 30 минут',
    likes: 'лайков',
    note: 'R2 bucket mecchachameleon-art-community. В этой демо-версии публикации публичны; endpoint агентской модерации может удалить неподходящие записи.',
  },
  es: {
    eyebrow: 'Demo de la comunidad',
    title: 'Desafío de esconderse 30 minutos',
    description: 'Los jugadores suben capturas después de sobrevivir 30 minutos sin ser descubiertos. La tarjeta con más votos se convierte en la ganadora semanal de la comunidad.',
    submit: 'Enviar mi captura de 30 minutos',
    viewAll: 'Ver tabla de la comunidad',
    minutes: `${demoCommunityChallenge.minutesHidden}+ min`,
    screenshotAlt: 'Captura de ejemplo del desafío de esconderse 30 minutos en Meccha Chameleon',
    likes: 'me gusta',
    note: 'Bucket R2 mecchachameleon-art-community. En esta demo las publicaciones son públicas; el endpoint de revisión del agente puede eliminar entradas no adecuadas.',
  },
  de: {
    eyebrow: 'Community-Demo',
    title: '30-Minuten-Versteck-Challenge',
    description: 'Spieler laden Screenshots hoch, nachdem sie 30 Minuten unentdeckt überlebt haben. Die Karte mit den meisten Likes wird zum Community-Sieger der Woche.',
    submit: 'Mein 30-Minuten-Screenshot einreichen',
    viewAll: 'Community-Board ansehen',
    minutes: `${demoCommunityChallenge.minutesHidden}+ Min`,
    screenshotAlt: 'Beispiel-Screenshot der 30-Minuten-Versteck-Challenge in Meccha Chameleon',
    likes: 'Likes',
    note: 'R2-Bucket mecchachameleon-art-community. Einsendungen sind in dieser Demo öffentlich; der Agent-Review-Endpunkt kann ungeeignete Einträge entfernen.',
  },
  pt: {
    eyebrow: 'Demo da comunidade',
    title: 'Desafio de 30 minutos escondido',
    description: 'Os jogadores enviam capturas depois de sobreviver 30 minutos sem serem encontrados. O cartão com mais curtidas vira o vencedor semanal da comunidade.',
    submit: 'Enviar minha captura de 30 minutos',
    viewAll: 'Ver ranking da comunidade',
    minutes: `${demoCommunityChallenge.minutesHidden}+ min`,
    screenshotAlt: 'Captura de exemplo do desafio de 30 minutos em Meccha Chameleon',
    likes: 'curtidas',
    note: 'Bucket R2 mecchachameleon-art-community. Nesta demo os envios são públicos; o endpoint de revisão do agente pode remover entradas inadequadas.',
  },
  fr: {
    eyebrow: 'Démo communauté',
    title: 'Défi cachette de 30 minutes',
    description: 'Les joueurs envoient leurs captures après 30 minutes de survie sans être repérés. La carte la plus likée devient la gagnante hebdomadaire de la communauté.',
    submit: 'Envoyer ma capture des 30 minutes',
    viewAll: 'Voir le tableau communauté',
    minutes: `${demoCommunityChallenge.minutesHidden}+ min`,
    screenshotAlt: 'Capture d’exemple du défi cachette 30 minutes sur Meccha Chameleon',
    likes: 'likes',
    note: 'Bucket R2 mecchachameleon-art-community. Les soumissions sont publiques dans cette démo ; l’endpoint de revue par agent peut supprimer les entrées inappropriées.',
  },
  it: {
    eyebrow: 'Demo community',
    title: 'Sfida: 30 minuti nascosto',
    description: 'I giocatori inviano screenshot dopo 30 minuti di sopravvivenza senza essere scoperti. La scheda con più like diventa la vincitrice settimanale della community.',
    submit: 'Invia il mio screenshot da 30 minuti',
    viewAll: 'Apri la classifica community',
    minutes: `${demoCommunityChallenge.minutesHidden}+ min`,
    screenshotAlt: 'Screenshot di esempio della sfida nascondersi 30 minuti in Meccha Chameleon',
    likes: 'like',
    note: 'Bucket R2 mecchachameleon-art-community. In questa demo gli invii sono pubblici; l’endpoint di revisione dell’agente può rimuovere contenuti non adatti.',
  },
  nl: {
    eyebrow: 'Community-demo',
    title: '30 minuten verstop-challenge',
    description: 'Spelers sturen screenshots in nadat ze 30 minuten onontdekt zijn gebleven. De kaart met de meeste likes wordt de communitywinnaar van de week.',
    submit: 'Stuur mijn 30-minuten screenshot in',
    viewAll: 'Bekijk communityranglijst',
    minutes: `${demoCommunityChallenge.minutesHidden}+ min`,
    screenshotAlt: 'Voorbeeldscreenshot van de 30 minuten verstop-challenge in Meccha Chameleon',
    likes: 'likes',
    note: 'R2-bucket mecchachameleon-art-community. In deze demo zijn inzendingen openbaar; het agent-review-endpoint kan ongeschikte items verwijderen.',
  },
  ar: {
    eyebrow: 'عرض المجتمع',
    title: 'تحدي الاختباء 30 دقيقة',
    description: 'يرسل اللاعبون لقطات شاشة بعد النجاة 30 دقيقة من دون اكتشاف. البطاقة ذات أكبر عدد من الإعجابات تصبح فائزة المجتمع لهذا الأسبوع.',
    submit: 'أرسل لقطتي بعد 30 دقيقة',
    viewAll: 'اعرض لوحة المجتمع',
    minutes: `${demoCommunityChallenge.minutesHidden}+ دقيقة`,
    screenshotAlt: 'لقطة مثال لتحدي الاختباء 30 دقيقة في Meccha Chameleon',
    likes: 'إعجاب',
    note: 'حاوية R2 mecchachameleon-art-community. في هذا العرض تكون المشاركات عامة؛ ويمكن لنقطة مراجعة الوكيل إزالة الإدخالات غير المناسبة.',
  },
  ja: {
    eyebrow: 'コミュニティ デモ',
    title: '30分 見つからずに隠れるチャレンジ',
    description: '30分間見つからずに生き残ったスクリーンショットを投稿。最多いいねを獲得した投稿が今週のコミュニティ優勝です。',
    submit: '私の30分スクリーンショットを送る',
    viewAll: 'コミュニティ ボードを見る',
    minutes: `${demoCommunityChallenge.minutesHidden}+ 分`,
    screenshotAlt: 'Meccha Chameleon 30分隠れのチャレンジ サンプル画像',
    likes: 'いいね',
    note: 'R2 バケット mecchachameleon-art-community を使用。デモは公開投稿のみを含み、エージェントのモデレーションで不適切な投稿は除外できます。',
  },
  ko: {
    eyebrow: '커뮤니티 데모',
    title: '30분 동안 숨기 챌린지',
    description: '30분 동안 들키지 않고 살아남은 스크린샷을 올리세요. 좋아요가 가장 많은 게시글이 이번 주 커뮤니티 우승입니다.',
    submit: '내 30분 스크린샷 보내기',
    viewAll: '커뮤니티 보드 보기',
    minutes: `${demoCommunityChallenge.minutesHidden}+ 분`,
    screenshotAlt: 'Meccha Chameleon 30분 숨기 챌린지 샘플 스크린샷',
    likes: '좋아요',
    note: 'R2 버킷 mecchachameleon-art-community 사용. 데모는 공개 게시물만 포함하며, 에이전트 검수에서 부적절한 항목은 제외할 수 있습니다.',
  },
  en: {
    eyebrow: 'Community demo',
    title: '30-Minute Hiding Challenge',
    description: 'Players submit screenshots after surviving 30 minutes undiscovered. The most-liked card becomes the weekly community winner.',
    submit: 'Submit your 30-minute win',
    viewAll: 'See community board',
    minutes: `${demoCommunityChallenge.minutesHidden}+ min`,
    screenshotAlt: 'Meccha Chameleon 30-minute hiding challenge sample screenshot',
    likes: 'likes',
    note: 'R2 bucket mecchachameleon-art-community. Submissions are public for this demo; the agent review endpoint can remove unsuitable entries.',
  },
} as const;

export function CommunityChallengePreview({ locale }: { locale: string }) {
  const cta = previewCopy[(locale in previewCopy ? locale : 'en') as keyof typeof previewCopy];

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
              {demoCommunityChallenge.mapName} · {cta.minutes} · {demoCommunityChallenge.playerName}
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FFD7E1] px-3 py-1 text-sm font-black text-[#FF6F9A]"> 
              <Heart className="h-4 w-4 fill-current" />
              {demoCommunityChallenge.likes.toLocaleString()} {cta.likes}
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
            href={getLocalizedPath(locale, '/community/gallery')}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#29211D] bg-white px-5 py-3 text-sm font-black text-[#29211D] transition hover:bg-[#fff7c8]"
          >
            {cta.viewAll}
          </a>
          <p className="text-[11px] leading-5 text-[#7D6D69]">
            <a className="underline" href={`${COMMUNITY_R2_PUBLIC_DOMAIN}/`} target="_blank" rel="noopener noreferrer">mecchachameleon-art-community</a>. {cta.note}
          </p>
        </div>
      </div>
    </div>
  );
}
