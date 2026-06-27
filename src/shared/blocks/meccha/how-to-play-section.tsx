'use client';

import {
  Globe,
  MapPin,
  MessageCircle,
  PartyPopper,
  Users,
  Wifi,
  Check,
  Copy,
  Share2,
  Twitter,
  Send,
  Trophy,
  UserPlus,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type Step = {
  title: string;
  body: string;
  bullets: string[];
};

type ModeCard = {
  name: string;
  players: string;
  body: string;
};

type SectionCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  watchEyebrow: string;
  watchTitle: string;
  watchBody: string;
  watchBullets: string[];
  watchFooterLeft: string;
  watchFooterRight: string;
  shareTitle: string;
  shareBody: string;
  nativeShare: string;
  shared: string;
  unsupported: string;
  copyLink: string;
  copied: string;
  shareWhyTitle: string;
  shareWhyBody: string;
  rosterTitle: string;
  rosterBody: string;
  namePlaceholder: string;
  add: string;
  noCrew: string;
  scoreTip: string;
  statusLabel: string;
  statuses: Record<'invited' | 'joined' | 'ghosted', string>;
  platforms: Record<'PC' | 'Discord' | 'Mobile' | 'Other', string>;
  ctaTitle: string;
  ctaBody: string;
  ctaGuide: string;
  ctaPlay: string;
  shareText: string;
  pageTitle: string;
  modes: ModeCard[];
  steps: Step[];
};

const modeIcons = [Users, PartyPopper, MapPin, Globe];
const stepLocales = ['en', 'zh', 'ru', 'es', 'de', 'pt', 'fr', 'it', 'nl', 'ar', 'ja'] as const;

type SupportedLocale = (typeof stepLocales)[number];

const copy: Record<SupportedLocale, SectionCopy> = {
  ja: {
    eyebrow: 'マルチプレイ',
    title: '同じラウンドに仲間をどうやって集めるか',
    intro: 'Meccha Chameleon は友達と遊ぶパーティー ゲームです。フレンド グループ、遠距離のクラン、パブリック マッチメイキングの実践的なプレイブックをこの 1 ページにまとめました。',
    watchEyebrow: 'プレイ前に視聴',
    watchTitle: 'Meccha Chameleon ビギナー ガイド動画シリーズ',
    watchBody: '最初のクリップから始めて、プレイリストを自動再生にしておけばグループがページから離れずに視聴・検証できます。',
    watchBullets: ['1. ループと操作を覚える。', '2. ヒダーとシーカーの基本を確認。', '3. 次のラウンドまでタブを開いたままに。'],
    watchFooterLeft: 'プレイリストは自動で進みます。',
    watchFooterRight: '埋め込みはサイト内に保持。',
    shareTitle: '仲間にシェア',
    shareBody: 'いつものプラットフォームを選ぶだけ。ログインも登録も不要、リンクをチャットに投げるだけ。',
    nativeShare: 'シェア',
    shared: 'シェア済み!',
    unsupported: '未対応',
    copyLink: 'リンクをコピー',
    copied: 'コピー済み',
    shareWhyTitle: 'なぜシェア ボタン?',
    shareWhyBody: 'カスタム ルームは友達が来てこそ楽しい。"今夜これやろう" のひと言が、プレイと観戦とスポット比較が 1 ページで完結するリンクだと伝わりやすい。',
    rosterTitle: 'クラン名簿 + 招待スコアボード',
    rosterBody: '招待した人、実際に来た人、スコアボードを引っ張り上げている人を記録。データはこのブラウザだけに保存され、サーバーには送られません。',
    namePlaceholder: 'フレンドのニックネーム / ハンドル',
    add: '追加',
    noCrew: 'まだ仲間が登録されていません。カスタム ルームに誘いたい人を追加しましょう。招待したら +1、ラウンドを運んだら +5。',
    scoreTip: 'ヒント: スコアは正直に記録するのがコツ。パーティ ゲームの半分は、誰がグループ最弱のヒダーか発掘して 1 週間いじめる楽しみ。',
    statusLabel: 'ステータス',
    statuses: { invited: '招待済み', joined: '参加', ghosted: '音信不通' },
    platforms: { PC: 'PC', Discord: 'Discord', Mobile: 'モバイル', Other: 'その他' },
    ctaTitle: 'マッチ メーキング前に完全初心者向けガイドが必要ですか?',
    ctaBody: '操作方法、ペインティング ツール、役割ガイド、初回マッチのチェックリストを 1 ページに集約。',
    ctaGuide: '初心者ガイド',
    ctaPlay: 'オンラインでプレイ',
    shareText: 'Meccha Chameleon のブラウザ プレイ + マルチプレイ ガイドが 1 ページにまとまっているので、グループ チャットにそのまま投げやすい:',
    pageTitle: 'Meccha Chameleon 日本語',
    modes: [
      { name: 'クラシックかくれんぼ', players: '2 - 24', body: 'ヒダーがペイントして動かなくなる。シーカーが狩る。基本のループを教えるのに最適。' },
      { name: 'インフェクション', players: '4 - 12', body: '見つかった人がシーカーに変わる。ラウンドごとに緊張感が上がる。' },
      { name: 'スピード ハント', players: '3 - 8', body: 'ヒダーは同時にペイント、その後シーカーが走ってスキャンする。' },
      { name: 'カスタム ルーム', players: '2 - 24', body: 'フレンド グループ用のプライベート ロビー。' },
    ],
    steps: [
      { title: '同じ部屋・同じ Wi-Fi', body: '一番シンプル。ホスト 1 人 + 仲間が招待で参加。ポート開放もファイアーウォールも不要。', bullets: ['ホストがカスタム ルームを開く。', 'ゲーム内から直接フレンドを招待。', '音声チャットでシーカーが座標コール。'] },
      { title: '別宅・同じ国内', body: 'カスタム ルームはリレー サーバー経由なので、国内なら開ける必要なし。', bullets: ['ホストは最も近いリレー リージョンを選ぶ。', '80ms 以下で快適、140ms 以下はプレイ可能。', '会社のネットが厳しければモバイル ホットスポットが楽。'] },
      { title: '大陸をまたぐ場合', body: '遠距離では中央寄りのリレー リージョンを選択。', bullets: ['開始前に ping を比較。', '遅延を感じたらネットワーク統計を開く。', 'ボイスは外部でも OK、マッチ自体はクライアント内。'] },
      { title: 'パブリック マッチメイキング', body: 'パブリック キューは一番手軽。固定クランを作る前に、ループを覚える最短ルート。', bullets: ['推奨人数は 2 - 10 人。', 'キュー前に言語設定。', '玄人ロビーは Discord のカスタム ルーム。'] },
      { title: '配信・ウォッチ パーティ', body: 'ペイント フェーズとリビール フェーズは配信映えする。', bullets: ['1080p / 60 で十分。', 'クリップ ショートカットを先に設定。', 'チャットが snipe するならロビーの名前を非表示に。'] },
      { title: '家族やライト層と一緒に', body: 'スキル フロアが低いので、子供やライト層も 1 ラウンド説明すれば大丈夫。', bullets: ['Mac ネイティブ版なし。', 'モバイル版なし、PC からストリーミング。', 'プッシュ トゥ トークとペイント ツールは 1 ラウンドで教えられる。'] },
    ],
  },
  en: {
    eyebrow: 'Multiplayer',
    title: 'How to actually get a group into the same round',
    intro:
      'Meccha Chameleon is a party game, not a solo puzzle. This is the playbook for friend groups, long-distance crews, and the public queue, all kept on one page.',
    watchEyebrow: 'Watch before you play',
    watchTitle: 'Meccha Chameleon beginner guide series',
    watchBody:
      'Start with the first clip and let the playlist keep moving. The walkthrough stays embedded here so your group can watch, test, and compare hiding ideas without leaving the page.',
    watchBullets: [
      '1. Learn the loop and controls.',
      '2. Check hider and seeker basics.',
      '3. Leave the tab open for the next lesson.',
    ],
    watchFooterLeft: 'Playlist auto-advances in place.',
    watchFooterRight: 'Embed stays on-site.',
    shareTitle: 'Send this to your crew',
    shareBody:
      'Pick the platform your friend group already uses. No login, no signup — just drop the link straight into chat.',
    nativeShare: 'Native share',
    shared: 'Shared!',
    unsupported: 'Not supported',
    copyLink: 'Copy link',
    copied: 'Copied',
    shareWhyTitle: 'Why a share button?',
    shareWhyBody:
      'A Custom Room is only fun once enough friends show up. A one-line “we should try this tonight” works better when the link points to one page where the group can instantly play, watch, and compare hiding ideas.',
    rosterTitle: 'Crew roster + invite scoreboard',
    rosterBody:
      'Track who you invited, who actually joined, and who keeps carrying the scoreboard. Stored in this browser only — no account, no server.',
    namePlaceholder: "Friend's name or handle",
    add: 'Add',
    noCrew:
      'No crew yet. Add the friends you want to bring into a Custom Room. Invited people can get +1 for showing up and +5 for carrying a round.',
    scoreTip:
      'Tip: keep score honestly. Half the fun is finding the worst hider in the group and roasting them for the rest of the week.',
    statusLabel: 'status',
    statuses: { invited: 'Invited', joined: 'Joined', ghosted: 'Ghosted' },
    platforms: { PC: 'PC', Discord: 'Discord', Mobile: 'Mobile', Other: 'Other' },
    ctaTitle: 'Need a full beginner walkthrough before you queue up?',
    ctaBody: 'Controls, paint tool, role basics, and first-match checklist — all on one page.',
    ctaGuide: 'New player guide',
    ctaPlay: 'Play online',
    shareText:
      'I just found a clean Meccha Chameleon multiplayer walkthrough + browser play hub. Open this in your group chat:',
    pageTitle: 'Meccha Chameleon Play Online',
    modes: [
      { name: 'Classic Hide & Seek', players: '2 - 24', body: 'Hiders paint and freeze. Seekers hunt. Best mode for teaching the paint tool and the basic hide loop.' },
      { name: 'Infection', players: '4 - 12', body: 'Found players become seekers. Tension rises every round, and the last clean hider wins.' },
      { name: 'Speed Hunt', players: '3 - 8', body: 'All hiders paint in parallel, then seekers race to scan every angle. Quick and chaotic.' },
      { name: 'Custom Rooms', players: '2 - 24', body: 'Private lobby for friend groups. Best mode for long sessions, inside jokes, and map practice.' },
    ],
    steps: [
      {
        title: 'Same room, same Wi-Fi',
        body: 'The easiest setup: one person hosts a Custom Room and everyone else joins through the invite flow. No firewall fiddling, no port forwarding.',
        bullets: [
          'Host opens Meccha Chameleon and picks Custom Room.',
          'Invite friends directly from the in-game flow.',
          'Use Discord or push-to-talk so seekers can call coordinates.',
        ],
      },
      {
        title: 'Different house, same country',
        body: 'Custom Rooms run through relay servers, so friends across town or across the country can join without opening ports.',
        bullets: [
          'Let the host pick the closest relay region.',
          'Under 80 ms feels great; 140 ms is still playable.',
          'If someone is on a locked-down network, mobile hotspot is often easier.',
        ],
      },
      {
        title: 'Different continent',
        body: 'For long-distance groups, choose a relay region near the midpoint between host and friends. Lag spikes are usually ISP routing, not the game itself.',
        bullets: [
          'Have players compare ping before the room starts.',
          'Turn on the in-game network stats if someone complains about delay.',
          'Use voice chat separately; the match itself still runs in the game client.',
        ],
      },
      {
        title: 'Matchmaking with strangers',
        body: 'Public queue is the lowest-friction way to play. Drop in, paint, hide, hunt, and learn the flow before you build a regular crew.',
        bullets: [
          'Recommended match size is 2 to 10 players.',
          'Set your language preference before queueing.',
          'Veteran lobbies usually happen in Custom Rooms via Discord communities.',
        ],
      },
      {
        title: 'Streaming and watch parties',
        body: 'The paint phase and reveal phase are both easy to stream. It is one of the cleaner party games for OBS, Streamlabs, and Twitch clips.',
        bullets: [
          '1080p / 60 capture is enough for most groups.',
          'Set a clip shortcut before the reveal phase starts.',
          'Hide names in the lobby if chat likes to backseat or snipe.',
        ],
      },
      {
        title: 'Family play and less-technical friends',
        body: 'The game is still PC-first, but the skill floor is low enough that younger players or casual friends can join after one short explanation.',
        bullets: [
          'No native Mac client; Mac players usually use Crossover or a similar layer.',
          'No native mobile version; phone-in-hand play works better through PC streaming.',
          'Push-to-talk and the paint tool make it easy to teach in one round.',
        ],
      },
    ],
  },
  zh: {
    eyebrow: '多人联机',
    title: '怎么把一群人真正拉进同一局',
    intro: '超级变色龙本质上是派对游戏，不是单人解谜。这里把朋友局、异地联机和公共匹配的实战方法整理在同一页。',
    watchEyebrow: '开打前先看',
    watchTitle: 'Meccha Chameleon 新手教学视频合集',
    watchBody: '从第一条开始看，让播放列表自动往下播。视频直接嵌在这里，队友可以边看边试，不用来回跳页。',
    watchBullets: ['1. 先理解基本循环和按键。', '2. 看隐藏者与搜寻者的基础思路。', '3. 下一局前把这个标签页继续开着。'],
    watchFooterLeft: '播放列表会自动续播。',
    watchFooterRight: '视频始终留在站内。',
    shareTitle: '把这个发给你的队友',
    shareBody: '直接选你们平时就会用的平台。不用登录，不用注册，一下就能把链接丢进群聊。',
    nativeShare: '系统分享',
    shared: '已分享！',
    unsupported: '当前不支持',
    copyLink: '复制链接',
    copied: '已复制',
    shareWhyTitle: '为什么要做分享按钮？',
    shareWhyBody: '自定义房间至少得凑够几个人才好玩。一句“今晚试试这个”如果配的是一个能直接试玩、看教学、比点位的页面，成功率会高很多。',
    rosterTitle: '队伍名单 + 邀请记分板',
    rosterBody: '记录你邀请了谁、谁真的来了、谁在队里一直 carry。数据只存在当前浏览器里，不需要账号，也不会传到服务器。',
    namePlaceholder: '朋友昵称 / 群名片',
    add: '添加',
    noCrew: '还没有队友名单。先把准备拉进自定义房间的人加进来。到场可以 +1，带飞一局可以 +5。',
    scoreTip: '提示：分数最好如实记。派对游戏的一半乐趣，就是找出队里最菜的隐藏者，然后在群里笑他一整周。',
    statusLabel: '状态',
    statuses: { invited: '已邀请', joined: '已到场', ghosted: '放鸽子' },
    platforms: { PC: '电脑', Discord: 'Discord', Mobile: '手机', Other: '其他' },
    ctaTitle: '排队前还想看完整新手路线？',
    ctaBody: '按键、涂色工具、角色基础和第一局检查清单，都整理在同一页。',
    ctaGuide: '新手指南',
    ctaPlay: '在线玩',
    shareText: '我找到一个把超级变色龙试玩、多人联机说明和地图图鉴放在一起的页面，发群里正好：',
    pageTitle: '超级变色龙 Meccha Chameleon 在线玩',
    modes: [
      { name: '经典躲猫猫', players: '2 - 24', body: '隐藏者先涂色再定住，搜寻者开始找人。最适合教会新手伪装和基础流程。' },
      { name: '感染模式', players: '4 - 12', body: '被找到的人会转成搜寻者，局势会一轮轮变紧张，最后一个没暴露的人获胜。' },
      { name: '极速搜寻', players: '3 - 8', body: '所有隐藏者同时完成涂色，搜寻者拼的是扫描角度和识别速度。' },
      { name: '自定义房间', players: '2 - 24', body: '朋友固定队首选。适合长时间开黑、玩梗、练地图点位和自定义节奏。' },
    ],
    steps: [
      { title: '同屋同 Wi‑Fi', body: '最简单的方案：一个人建自定义房间，其他人走邀请流程加入。一般不用折腾端口和防火墙。', bullets: ['房主进游戏后选择自定义房间。', '直接用游戏内邀请把人拉进来。', '同时开语音，搜寻者报点会更快。'] },
      { title: '不同住处、同一个国家', body: '自定义房间走中继服务器，所以跨城或跨省也能连，不需要自己开端口。', bullets: ['尽量让房主选离大家都近的区域。', '80ms 以内体验最好，140ms 以内一般也能玩。', '公司网络太严格时，手机热点往往更省事。'] },
      { title: '跨洲联机', body: '距离很远时，让房主选双方中间的中继区域。中途卡顿多数是运营商路由问题，不一定是游戏本身。', bullets: ['开房前先让几个人比较一下延迟。', '有人说卡时，先开网络状态看看是不是线路问题。', '语音可以用外部软件，但对局还是在客户端里完成。'] },
      { title: '和路人匹配', body: '公共匹配门槛最低，适合先熟悉流程。先学会涂色、定姿势、扫角度，再考虑拉固定队。', bullets: ['推荐 2 到 10 人的局。', '匹配前先设置语言偏好。', '更硬核的房间通常在 Discord 群和自定义房里。'] },
      { title: '开播和看播局', body: '涂色阶段和揭晓阶段都很适合直播，OBS、Streamlabs、Twitch 这些都能直接用。', bullets: ['1080p / 60 对大多数队伍就够了。', '揭晓前先设好剪辑快捷键。', '如果观众爱指挥，记得把大厅名字显示关掉。'] },
      { title: '带家人和轻度玩家一起玩', body: '虽然游戏是 PC 为主，但入门门槛不高，稍微讲一遍颜色和姿势，很多轻度玩家也能很快上手。', bullets: ['Mac 没有原生版，通常要靠兼容层。', '手机没有原生版，更适合从 PC 串流。', '推按说话和涂色工具让教学一局就能完成。'] },
    ],
  },
  ru: {
    eyebrow: 'Мультиплеер',
    title: 'Как реально собрать всех в один матч',
    intro: 'Meccha Chameleon — это тусовочная игра, а не одиночная головоломка. Здесь собран практический сценарий для друзей, удалённых компаний и публичного матчмейкинга.',
    watchEyebrow: 'Сначала посмотрите',
    watchTitle: 'Серия гайдов для новичков Meccha Chameleon',
    watchBody: 'Запустите первый ролик и дайте плейлисту идти дальше. Видео остаются прямо на странице, чтобы команда могла смотреть и сразу пробовать.',
    watchBullets: ['1. Понять цикл матча и управление.', '2. Быстро пройти основы для прячущихся и ищущих.', '3. Оставить вкладку открытой перед следующей игрой.'],
    watchFooterLeft: 'Плейлист переключается сам.',
    watchFooterRight: 'Видео остаётся на сайте.',
    shareTitle: 'Отправьте это своей команде',
    shareBody: 'Выберите платформу, где уже сидит ваша группа. Без логина и регистрации — просто бросьте ссылку в чат.',
    nativeShare: 'Поделиться',
    shared: 'Отправлено!',
    unsupported: 'Не поддерживается',
    copyLink: 'Скопировать ссылку',
    copied: 'Скопировано',
    shareWhyTitle: 'Зачем тут кнопки шаринга?',
    shareWhyBody: 'Custom Room становится веселее, когда реально приходят друзья. Одна фраза «давайте вечером попробуем» работает лучше, если ссылка ведёт на страницу, где можно сразу играть, смотреть и сравнивать точки.',
    rosterTitle: 'Состав команды + счёт приглашений',
    rosterBody: 'Отмечайте, кого позвали, кто действительно пришёл и кто тащит счёт. Всё хранится только в этом браузере.',
    namePlaceholder: 'Ник друга / хэндл',
    add: 'Добавить',
    noCrew: 'Список пока пуст. Добавьте тех, кого хотите затащить в Custom Room. За появление можно дать +1, за решающий раунд — +5.',
    scoreTip: 'Совет: считайте честно. Половина фана — выяснить, кто в компании худший прячущийся, и подшучивать над ним всю неделю.',
    statusLabel: 'статус',
    statuses: { invited: 'Приглашён', joined: 'Пришёл', ghosted: 'Слился' },
    platforms: { PC: 'PC', Discord: 'Discord', Mobile: 'Телефон', Other: 'Другое' },
    ctaTitle: 'Нужен полный гайд перед очередью?',
    ctaBody: 'Управление, покраска, роли и чеклист первой игры — всё собрано на одной странице.',
    ctaGuide: 'Гайд для новичка',
    ctaPlay: 'Играть онлайн',
    shareText: 'Я нашёл удобную страницу с браузерной игрой Meccha Chameleon и мультиплеерным гайдом. Кидаю в чат:',
    pageTitle: 'Meccha Chameleon Играть Онлайн',
    modes: [
      { name: 'Классические прятки', players: '2 - 24', body: 'Прячущиеся красятся и замирают, ищущие охотятся. Лучший режим для освоения базовой петли.' },
      { name: 'Инфекция', players: '4 - 12', body: 'Найденные игроки переходят в команду ищущих. Напряжение растёт с каждым раундом.' },
      { name: 'Быстрая охота', players: '3 - 8', body: 'Все красятся одновременно, потом ищущие на скорость сканируют карту.' },
      { name: 'Custom Rooms', players: '2 - 24', body: 'Приватное лобби для друзей. Лучший режим для длинных посиделок и тренировок карт.' },
    ],
    steps: [
      { title: 'Одна комната, один Wi‑Fi', body: 'Самый простой вариант: один создаёт Custom Room, остальные заходят по приглашению.', bullets: ['Хост выбирает Custom Room.', 'Приглашайте друзей прямо из игры.', 'Используйте голосовую связь для координации.'] },
      { title: 'Разные дома, одна страна', body: 'Custom Rooms работают через relay, поэтому друзьям не нужно открывать порты.', bullets: ['Пусть хост выберет ближайший регион.', 'До 80 мс — отлично, до 140 мс ещё терпимо.', 'Если домашняя сеть всё режет, часто спасает мобильный хотспот.'] },
      { title: 'Разные континенты', body: 'Для дальних компаний выбирайте relay-площадку посередине между игроками.', bullets: ['Перед стартом пусть все сравнят пинг.', 'Если кто-то жалуется на лаг, сначала включите сетевую статистику.', 'Голос можно держать отдельно, матч всё равно идёт в клиенте.'] },
      { title: 'Матчмейкинг с незнакомцами', body: 'Публичная очередь — самый быстрый вход в игру. Хороший способ понять ритм матчей до своей постоянной команды.', bullets: ['Рекомендуемый размер — 2–10 игроков.', 'Перед очередью поставьте языковое предпочтение.', 'Более жёсткие лобби обычно живут в Discord и приватных комнатах.'] },
      { title: 'Стримы и watch party', body: 'Фаза покраски и фаза раскрытия отлично смотрятся на стриме. OBS и Twitch работают без лишних костылей.', bullets: ['1080p / 60 обычно достаточно.', 'Подготовьте shortcut для клипов до фазы раскрытия.', 'Спрячьте имена в лобби, если чат любит подсказывать.'] },
      { title: 'Семья и казуальные друзья', body: 'Порог входа низкий, поэтому даже менее опытные игроки быстро понимают игру после одного объяснения.', bullets: ['Нативного клиента для Mac нет.', 'Мобильной версии нет — лучше стримить с ПК.', 'Push-to-talk и покраска объясняются буквально за один раунд.'] },
    ],
  },
  es: {
    eyebrow: 'Multijugador', title: 'Cómo meter de verdad a tu grupo en la misma partida', intro: 'Meccha Chameleon funciona mejor como juego de grupo. Aquí está la guía rápida para amigos, equipos a distancia y cola pública.', watchEyebrow: 'Míralo antes de jugar', watchTitle: 'Serie de guía para principiantes de Meccha Chameleon', watchBody: 'Empieza por el primer video y deja que la lista siga sola. Todo queda incrustado aquí para que el grupo vea y pruebe sin salir de la página.', watchBullets: ['1. Aprende el bucle y los controles.', '2. Revisa la base de Ocultistas y Buscadores.', '3. Deja la pestaña abierta para la siguiente partida.'], watchFooterLeft: 'La lista avanza sola.', watchFooterRight: 'El embed sigue dentro del sitio.', shareTitle: 'Envía esto a tu grupo', shareBody: 'Elige la plataforma que ya usa tu equipo. Sin login ni registro: solo deja el enlace en el chat.', nativeShare: 'Compartir', shared: '¡Compartido!', unsupported: 'No compatible', copyLink: 'Copiar enlace', copied: 'Copiado', shareWhyTitle: '¿Por qué un botón para compartir?', shareWhyBody: 'Una sala privada solo despega cuando llegan suficientes amigos. Un “probemos esto hoy” funciona mejor si el enlace lleva a una página donde todos pueden jugar, mirar y comparar escondites.', rosterTitle: 'Lista del equipo + marcador de invitaciones', rosterBody: 'Apunta a quién invitaste, quién apareció y quién está cargando el marcador. Se guarda solo en este navegador.', namePlaceholder: 'Nombre o nick del amigo', add: 'Añadir', noCrew: 'Todavía no hay grupo. Añade a la gente que quieres meter en la Custom Room. Puedes dar +1 por aparecer y +5 por cargar una ronda.', scoreTip: 'Consejo: puntúa con honestidad. La mitad de la gracia es descubrir quién es el peor escondido del grupo y reírte de ello toda la semana.', statusLabel: 'estado', statuses: { invited: 'Invitado', joined: 'Entró', ghosted: 'Desapareció' }, platforms: { PC: 'PC', Discord: 'Discord', Mobile: 'Móvil', Other: 'Otro' }, ctaTitle: '¿Quieres una guía completa antes de entrar a cola?', ctaBody: 'Controles, pintura, roles y checklist de la primera partida, todo en una sola página.', ctaGuide: 'Guía para nuevos jugadores', ctaPlay: 'Jugar online', shareText: 'Encontré una página muy útil con juego en navegador y guía multijugador de Meccha Chameleon. La dejo aquí:', pageTitle: 'Meccha Chameleon en español',
    modes: [
      { name: 'Escondite clásico', players: '2 - 24', body: 'Los Ocultistas se pintan y se quedan quietos; los Buscadores cazan. Mejor modo para aprender la base.' },
      { name: 'Infección', players: '4 - 12', body: 'Quien es descubierto pasa al equipo de Buscadores. La tensión sube ronda tras ronda.' },
      { name: 'Caza rápida', players: '3 - 8', body: 'Todos se pintan a la vez y luego gana quien escanea más rápido.' },
      { name: 'Salas privadas', players: '2 - 24', body: 'Lobby privado para amigos. Perfecto para sesiones largas y práctica de mapas.' },
    ],
    steps: [
      { title: 'Misma casa, mismo Wi‑Fi', body: 'La opción más simple: una persona crea la sala y el resto entra por invitación.', bullets: ['El host elige Sala privada.', 'Invita directamente desde el juego.', 'Usa voz para cantar posiciones.'] },
      { title: 'Casas distintas, mismo país', body: 'Las salas privadas usan relay, así que no hace falta abrir puertos.', bullets: ['El host debe elegir la región más cercana.', 'Hasta 80 ms se siente muy bien.', 'Si la red bloquea tráfico, prueba hotspot móvil.'] },
      { title: 'Continentes distintos', body: 'Para grupos lejanos, usa una región intermedia.', bullets: ['Comparad el ping antes de abrir la sala.', 'Activa estadísticas de red si alguien nota retraso.', 'La voz puede ir fuera; la partida sigue dentro del cliente.'] },
      { title: 'Matchmaking público', body: 'La cola pública es la forma más rápida de entrar y aprender el ritmo del juego.', bullets: ['Lo ideal es 2 a 10 jugadores.', 'Configura el idioma antes de hacer cola.', 'Las lobbies más duras suelen vivir en Discord.'] },
      { title: 'Streaming y watch parties', body: 'La fase de pintura y la revelación se ven muy bien en stream.', bullets: ['1080p / 60 suele bastar.', 'Prepara un atajo para clips.', 'Oculta nombres si el chat tiende a snipear.'] },
      { title: 'Familia y amigos casuales', body: 'La entrada es sencilla y muchos jugadores nuevos entienden la base en una sola ronda.', bullets: ['No hay cliente nativo de Mac.', 'No hay versión móvil nativa.', 'Push-to-talk y pintura se enseñan rápido.'] },
    ],
  },
  de: { eyebrow: 'Mehrspieler', title: 'Wie du eine Gruppe wirklich in dieselbe Runde bekommst', intro: 'Meccha Chameleon lebt von Gruppenrunden. Hier ist der praktische Leitfaden für Freunde, Fernteams und die öffentliche Queue.', watchEyebrow: 'Vor dem Spielen ansehen', watchTitle: 'Meccha Chameleon Einsteiger-Videoreihe', watchBody: 'Starte mit dem ersten Clip und lass die Playlist weiterlaufen. Alles bleibt hier eingebettet, damit eure Gruppe direkt schauen und testen kann.', watchBullets: ['1. Schleife und Steuerung lernen.', '2. Grundlagen für Versteckende und Sucher ansehen.', '3. Den Tab für die nächste Runde offen lassen.'], watchFooterLeft: 'Playlist läuft automatisch weiter.', watchFooterRight: 'Das Embed bleibt auf der Seite.', shareTitle: 'Schick das an deine Crew', shareBody: 'Wähle einfach die Plattform, auf der deine Gruppe ohnehin lebt. Kein Login, keine Registrierung.', nativeShare: 'Teilen', shared: 'Geteilt!', unsupported: 'Nicht unterstützt', copyLink: 'Link kopieren', copied: 'Kopiert', shareWhyTitle: 'Warum ein Teilen-Button?', shareWhyBody: 'Ein Custom Room macht erst Spaß, wenn genug Freunde auftauchen. Ein kurzes „Lass uns das heute Abend testen“ funktioniert besser mit einer Seite, auf der man sofort spielen, schauen und Spots vergleichen kann.', rosterTitle: 'Crew-Liste + Einladungs-Scoreboard', rosterBody: 'Halte fest, wen du eingeladen hast, wer wirklich gekommen ist und wer die Runde trägt. Alles bleibt nur in diesem Browser.', namePlaceholder: 'Name oder Handle', add: 'Hinzufügen', noCrew: 'Noch keine Crew. Füge die Leute hinzu, die du in einen Custom Room holen willst. Fürs Erscheinen gibt es +1, fürs Carry +5.', scoreTip: 'Tipp: ehrlich werten. Die halbe Party besteht darin, den schlechtesten Verstecker der Gruppe zu finden und ihn die ganze Woche aufzuziehen.', statusLabel: 'Status', statuses: { invited: 'Eingeladen', joined: 'Gekommen', ghosted: 'Abgetaucht' }, platforms: { PC: 'PC', Discord: 'Discord', Mobile: 'Handy', Other: 'Andere' }, ctaTitle: 'Vor der Queue lieber noch ein kompletter Anfänger-Guide?', ctaBody: 'Steuerung, Painting, Rollen und Erstspiel-Checkliste — alles auf einer Seite.', ctaGuide: 'Guide für neue Spieler', ctaPlay: 'Online spielen', shareText: 'Ich habe eine gute Meccha-Chameleon-Seite mit Browser-Spiel und Multiplayer-Leitfaden gefunden. Hier ist der Link:', pageTitle: 'Meccha Chameleon Deutsch', modes: [{ name: 'Classic Hide & Seek', players: '2 - 24', body: 'Versteckende bemalen sich und frieren ein, Sucher jagen. Bester Modus für die Grundlagen.' }, { name: 'Infection', players: '4 - 12', body: 'Gefundene Spieler wechseln auf die Sucher-Seite. Jede Runde wird hektischer.' }, { name: 'Speed Hunt', players: '3 - 8', body: 'Alle bemalen sich gleichzeitig, dann gewinnt das schnellste Scannen.' }, { name: 'Custom Rooms', players: '2 - 24', body: 'Privatlobby für Freunde. Ideal für lange Sessions und Kartenpraxis.' }], steps: [{ title: 'Gleicher Raum, gleiches Wi‑Fi', body: 'Die einfachste Variante: Einer hostet, der Rest kommt per Einladung dazu.', bullets: ['Host startet einen Custom Room.', 'Freunde direkt im Spiel einladen.', 'Voice-Chat für Callouts nutzen.'] }, { title: 'Anderes Haus, gleiches Land', body: 'Custom Rooms laufen über Relay-Server, Ports musst du nicht öffnen.', bullets: ['Nächste Region wählen.', 'Bis 80 ms sehr gut, bis 140 ms spielbar.', 'Bei strengen Netzen hilft oft Hotspot.'] }, { title: 'Anderer Kontinent', body: 'Für weit entfernte Gruppen eine mittlere Relay-Region wählen.', bullets: ['Vorher Ping vergleichen.', 'Bei Lag zuerst Netzwerkstats einschalten.', 'Voice separat, Match im Client.'] }, { title: 'Matchmaking mit Fremden', body: 'Öffentliche Queue ist der schnellste Einstieg.', bullets: ['2 bis 10 Spieler sind ideal.', 'Sprache vor der Queue einstellen.', 'Schwierigere Lobbys leben meist in Discords.'] }, { title: 'Streaming und Watch-Partys', body: 'Painting- und Reveal-Phase funktionieren stark im Stream.', bullets: ['1080p / 60 reicht meist.', 'Clip-Hotkey vorher einrichten.', 'Namen verstecken, wenn Chat snipet.'] }, { title: 'Familie und Casual-Freunde', body: 'Die Einstiegshürde ist niedrig, daher verstehen auch Gelegenheitsspieler die Basis schnell.', bullets: ['Kein nativer Mac-Client.', 'Keine native Mobile-Version.', 'Push-to-talk und Painting sind schnell erklärt.'] }] },
  pt: { eyebrow: 'Multijogador', title: 'Como colocar o grupo na mesma partida de verdade', intro: 'Meccha Chameleon funciona melhor como party game. Aqui está o guia prático para amigos, equipes à distância e fila pública.', watchEyebrow: 'Veja antes de jogar', watchTitle: 'Série de guia iniciante de Meccha Chameleon', watchBody: 'Comece pelo primeiro vídeo e deixe a playlist seguir. Tudo fica incorporado aqui para o grupo ver e testar sem sair da página.', watchBullets: ['1. Entenda o loop e os controles.', '2. Revise a base de Escondedores e Buscadores.', '3. Deixe a aba aberta para a próxima rodada.'], watchFooterLeft: 'A playlist avança sozinha.', watchFooterRight: 'O embed fica no site.', shareTitle: 'Envie isso para sua equipe', shareBody: 'Escolha a plataforma que seu grupo já usa. Sem login nem cadastro: é só jogar o link no chat.', nativeShare: 'Compartilhar', shared: 'Compartilhado!', unsupported: 'Não suportado', copyLink: 'Copiar link', copied: 'Copiado', shareWhyTitle: 'Por que um botão de compartilhar?', shareWhyBody: 'Uma sala privada só engrena quando amigos de verdade aparecem. Um “vamos testar isso hoje” funciona melhor com uma página onde todo mundo já pode jogar, ver e comparar spots.', rosterTitle: 'Lista da equipe + placar de convites', rosterBody: 'Marque quem foi convidado, quem entrou de fato e quem está carregando o placar. Tudo fica só neste navegador.', namePlaceholder: 'Nome ou nick do amigo', add: 'Adicionar', noCrew: 'Ainda não há equipe. Adicione quem você quer puxar para a sala privada. Pode dar +1 para presença e +5 para quem carrega a rodada.', scoreTip: 'Dica: marque os pontos com honestidade. Metade da graça é descobrir quem é o pior escondedor do grupo e zoar isso a semana inteira.', statusLabel: 'status', statuses: { invited: 'Convidado', joined: 'Entrou', ghosted: 'Sumiu' }, platforms: { PC: 'PC', Discord: 'Discord', Mobile: 'Celular', Other: 'Outro' }, ctaTitle: 'Quer um guia completo antes de entrar na fila?', ctaBody: 'Controles, pintura, funções e checklist da primeira partida — tudo numa página só.', ctaGuide: 'Guia para iniciantes', ctaPlay: 'Jogar online', shareText: 'Achei uma página muito boa com browser play e guia multiplayer de Meccha Chameleon. Segue o link:', pageTitle: 'Meccha Chameleon em português', modes: [{ name: 'Esconde-esconde clássico', players: '2 - 24', body: 'Os Escondedores pintam e congelam; os Buscadores caçam. Melhor modo para aprender a base.' }, { name: 'Infecção', players: '4 - 12', body: 'Quem é encontrado vira Buscador. A tensão cresce a cada rodada.' }, { name: 'Caça rápida', players: '3 - 8', body: 'Todos pintam ao mesmo tempo e vence quem escaneia mais rápido.' }, { name: 'Salas privadas', players: '2 - 24', body: 'Lobby privado para amigos. Perfeito para sessões longas e treino de mapa.' }], steps: [{ title: 'Mesma casa, mesmo Wi‑Fi', body: 'A opção mais simples: uma pessoa hospeda e o resto entra por convite.', bullets: ['O host abre uma sala privada.', 'Convide amigos direto do jogo.', 'Use voz para chamar coordenadas.'] }, { title: 'Casas diferentes, mesmo país', body: 'As salas usam relay, então não é preciso abrir portas.', bullets: ['Escolha a região mais próxima.', 'Até 80 ms fica ótimo.', 'Rede bloqueada? Hotspot ajuda.'] }, { title: 'Continentes diferentes', body: 'Para grupos distantes, escolha uma região intermediária.', bullets: ['Compare ping antes da partida.', 'Ative estatísticas de rede se alguém reclamar.', 'A voz pode rodar fora; a partida fica no cliente.'] }, { title: 'Fila pública', body: 'A fila pública é a forma mais rápida de entender o ritmo do jogo.', bullets: ['2 a 10 jogadores é o ideal.', 'Ajuste o idioma antes de entrar.', 'Lobbies mais fortes costumam nascer no Discord.'] }, { title: 'Streaming e watch parties', body: 'Fase de pintura e revelação funcionam muito bem em stream.', bullets: ['1080p / 60 costuma bastar.', 'Separe um atalho de clip.', 'Esconda nomes se o chat costuma dedar.'] }, { title: 'Família e amigos casuais', body: 'A barreira de entrada é baixa e muita gente aprende o básico em uma rodada.', bullets: ['Sem cliente nativo para Mac.', 'Sem versão móvel nativa.', 'Push-to-talk e pintura são fáceis de ensinar.'] }] },
  fr: { eyebrow: 'Multijoueur', title: 'Comment mettre un vrai groupe dans la même partie', intro: 'Meccha Chameleon brille surtout en jeu de groupe. Voici le plan pratique pour les amis, les équipes à distance et la file publique.', watchEyebrow: 'À voir avant de jouer', watchTitle: 'Série guide débutant Meccha Chameleon', watchBody: 'Commencez par la première vidéo et laissez la playlist avancer. Tout reste intégré ici pour que le groupe regarde et teste sans quitter la page.', watchBullets: ['1. Comprendre la boucle et les contrôles.', '2. Revoir les bases Cacheur / Chercheur.', '3. Garder l’onglet ouvert pour la prochaine manche.'], watchFooterLeft: 'La playlist avance toute seule.', watchFooterRight: 'L’embed reste sur le site.', shareTitle: 'Envoyez ça à votre crew', shareBody: 'Choisissez la plateforme que votre groupe utilise déjà. Pas de connexion, pas d’inscription.', nativeShare: 'Partager', shared: 'Partagé !', unsupported: 'Non pris en charge', copyLink: 'Copier le lien', copied: 'Copié', shareWhyTitle: 'Pourquoi un bouton de partage ?', shareWhyBody: 'Une Custom Room devient vraiment amusante seulement quand assez d’amis répondent présent. Un simple “on teste ça ce soir ?” marche mieux avec une page où tout le monde peut jouer, regarder et comparer les cachettes.', rosterTitle: 'Roster du crew + tableau des invitations', rosterBody: 'Suivez qui vous avez invité, qui s’est vraiment pointé et qui porte le score. Tout reste uniquement dans ce navigateur.', namePlaceholder: 'Nom ou pseudo', add: 'Ajouter', noCrew: 'Pas encore de crew. Ajoutez les amis que vous voulez faire venir dans une Custom Room. Vous pouvez donner +1 pour la présence et +5 pour une manche portée.', scoreTip: 'Astuce : gardez un score honnête. La moitié du fun consiste à découvrir qui est le pire cacheur du groupe et à le chambrer toute la semaine.', statusLabel: 'statut', statuses: { invited: 'Invité', joined: 'Venu', ghosted: 'A disparu' }, platforms: { PC: 'PC', Discord: 'Discord', Mobile: 'Mobile', Other: 'Autre' }, ctaTitle: 'Besoin d’un guide complet avant de lancer la queue ?', ctaBody: 'Contrôles, peinture, rôles et checklist de première partie, tout est sur une seule page.', ctaGuide: 'Guide débutant', ctaPlay: 'Jouer en ligne', shareText: 'J’ai trouvé une page très pratique avec browser play et guide multijoueur Meccha Chameleon. Je vous la passe ici :', pageTitle: 'Meccha Chameleon en français', modes: [{ name: 'Cache-cache classique', players: '2 - 24', body: 'Les Cacheurs se peignent puis se figent, les Chercheurs traquent. Le meilleur mode pour apprendre la base.' }, { name: 'Infection', players: '4 - 12', body: 'Les joueurs trouvés passent du côté des Chercheurs. La pression monte à chaque manche.' }, { name: 'Chasse rapide', players: '3 - 8', body: 'Tout le monde se peint en parallèle, puis la vitesse de scan décide du vainqueur.' }, { name: 'Salles privées', players: '2 - 24', body: 'Lobby privé pour les amis. Idéal pour les longues sessions et le travail de carte.' }], steps: [{ title: 'Même pièce, même Wi‑Fi', body: 'La méthode la plus simple : une personne héberge et les autres rejoignent par invitation.', bullets: ['L’hôte ouvre une Custom Room.', 'Invitez directement depuis le jeu.', 'Utilisez la voix pour annoncer les positions.'] }, { title: 'Maisons différentes, même pays', body: 'Les salles privées passent par des relais, donc pas besoin d’ouvrir des ports.', bullets: ['Choisissez la région la plus proche.', 'Sous 80 ms c’est très bon.', 'Si le réseau bloque, le partage de connexion aide souvent.'] }, { title: 'Continents différents', body: 'Pour les groupes éloignés, choisissez une région intermédiaire.', bullets: ['Comparez les pings avant de lancer.', 'Activez les stats réseau si quelqu’un ressent du délai.', 'La voix peut tourner ailleurs ; la partie reste dans le client.'] }, { title: 'Matchmaking public', body: 'La file publique est la façon la plus simple de comprendre le rythme du jeu.', bullets: ['2 à 10 joueurs est le meilleur format.', 'Réglez la langue avant de faire la queue.', 'Les lobbies plus durs vivent souvent via Discord.'] }, { title: 'Streaming et watch party', body: 'La phase de peinture et la révélation se prêtent très bien au stream.', bullets: ['Le 1080p / 60 suffit dans la plupart des cas.', 'Préparez un raccourci clip.', 'Masquez les noms si le chat backseat.'] }, { title: 'Famille et amis casual', body: 'Le jeu reste accessible et beaucoup de nouveaux comprennent la base en une seule manche.', bullets: ['Pas de client Mac natif.', 'Pas de version mobile native.', 'Le push-to-talk et la peinture s’expliquent vite.'] }] },
  it: { eyebrow: 'Multiplayer', title: 'Come far entrare davvero il gruppo nella stessa partita', intro: 'Meccha Chameleon rende al massimo in gruppo. Qui trovi la guida pratica per amici, team a distanza e matchmaking pubblico.', watchEyebrow: 'Guarda prima di giocare', watchTitle: 'Serie guida principianti di Meccha Chameleon', watchBody: 'Parti dal primo video e lascia andare avanti la playlist. Tutto resta qui incorporato, così il gruppo può guardare e provare senza uscire dalla pagina.', watchBullets: ['1. Capisci il loop e i controlli.', '2. Rivedi le basi di Nasconditori e Cercatori.', '3. Lascia la scheda aperta per la prossima partita.'], watchFooterLeft: 'La playlist avanza da sola.', watchFooterRight: 'L’embed resta sul sito.', shareTitle: 'Mandalo al tuo gruppo', shareBody: 'Scegli la piattaforma che il tuo gruppo usa già. Nessun login, nessuna registrazione.', nativeShare: 'Condividi', shared: 'Condiviso!', unsupported: 'Non supportato', copyLink: 'Copia link', copied: 'Copiato', shareWhyTitle: 'Perché un pulsante di condivisione?', shareWhyBody: 'Una Custom Room decolla solo quando gli amici arrivano davvero. Un semplice “proviamo questo stasera” funziona meglio con una pagina dove il gruppo può giocare, guardare e confrontare gli spot.', rosterTitle: 'Roster del gruppo + tabellone inviti', rosterBody: 'Tieni traccia di chi hai invitato, chi si è presentato davvero e chi sta trascinando il punteggio. Tutto resta solo in questo browser.', namePlaceholder: 'Nome o nick dell’amico', add: 'Aggiungi', noCrew: 'Nessun gruppo ancora. Aggiungi le persone che vuoi portare in una Custom Room. Puoi dare +1 per la presenza e +5 per chi trascina un round.', scoreTip: 'Suggerimento: tieni il punteggio con onestà. Metà del divertimento è scoprire chi è il peggior Nasconditore del gruppo e prenderlo in giro per tutta la settimana.', statusLabel: 'stato', statuses: { invited: 'Invitato', joined: 'Entrato', ghosted: 'Scomparso' }, platforms: { PC: 'PC', Discord: 'Discord', Mobile: 'Mobile', Other: 'Altro' }, ctaTitle: 'Ti serve una guida completa prima della coda?', ctaBody: 'Controlli, pittura, ruoli e checklist della prima partita — tutto in una sola pagina.', ctaGuide: 'Guida per principianti', ctaPlay: 'Gioca online', shareText: 'Ho trovato una pagina molto comoda con browser play e guida multiplayer di Meccha Chameleon. La giro qui:', pageTitle: 'Meccha Chameleon in italiano', modes: [{ name: 'Nascondino classico', players: '2 - 24', body: 'I Nasconditori si dipingono e si fermano, i Cercatori danno la caccia. È il modo migliore per imparare la base.' }, { name: 'Infezione', players: '4 - 12', body: 'Chi viene trovato passa tra i Cercatori. La tensione cresce ogni round.' }, { name: 'Caccia veloce', players: '3 - 8', body: 'Tutti si dipingono insieme, poi vince chi scansiona più in fretta.' }, { name: 'Stanze private', players: '2 - 24', body: 'Lobby privata per amici. Ideale per sessioni lunghe e pratica delle mappe.' }], steps: [{ title: 'Stessa stanza, stesso Wi‑Fi', body: 'Il modo più semplice: una persona ospita e gli altri entrano tramite invito.', bullets: ['L’host apre una Custom Room.', 'Invita gli amici direttamente dal gioco.', 'Usate la voce per chiamare le coordinate.'] }, { title: 'Case diverse, stesso paese', body: 'Le stanze private passano dai relay, quindi non serve aprire porte.', bullets: ['Scegli la regione più vicina.', 'Sotto 80 ms si gioca benissimo.', 'Se la rete blocca traffico, spesso aiuta l’hotspot.'] }, { title: 'Continenti diversi', body: 'Per gruppi lontani scegli una regione intermedia.', bullets: ['Confrontate il ping prima di partire.', 'Attivate le statistiche di rete se qualcuno sente lag.', 'La voce può stare fuori; il match resta nel client.'] }, { title: 'Matchmaking pubblico', body: 'La coda pubblica è il modo più rapido per capire il ritmo del gioco.', bullets: ['2-10 giocatori è la fascia ideale.', 'Imposta la lingua prima della coda.', 'Le lobby più dure nascono spesso nei Discord.'] }, { title: 'Streaming e watch party', body: 'La fase di pittura e la rivelazione funzionano benissimo in stream.', bullets: ['1080p / 60 basta nella maggior parte dei casi.', 'Prepara un tasto clip.', 'Nascondi i nomi se la chat tende a suggerire troppo.'] }, { title: 'Famiglia e amici casual', body: 'La barriera d’ingresso è bassa e molti nuovi giocatori capiscono tutto in un round.', bullets: ['Nessun client Mac nativo.', 'Nessuna versione mobile nativa.', 'Push-to-talk e pittura si spiegano velocemente.'] }] },
  nl: { eyebrow: 'Multiplayer', title: 'Hoe je je groep echt in dezelfde ronde krijgt', intro: 'Meccha Chameleon werkt het best als groepsspel. Hier staat de praktische gids voor vrienden, teams op afstand en de openbare queue.', watchEyebrow: 'Kijk dit vóór je speelt', watchTitle: 'Meccha Chameleon beginnersreeks', watchBody: 'Begin met de eerste video en laat de playlist doorlopen. Alles blijft hier ingesloten, zodat de groep kan kijken en meteen testen zonder weg te klikken.', watchBullets: ['1. Leer de loop en de besturing.', '2. Bekijk de basis voor Verstoppers en Zoekers.', '3. Laat het tabblad open voor de volgende ronde.'], watchFooterLeft: 'De playlist loopt automatisch door.', watchFooterRight: 'De embed blijft op de site.', shareTitle: 'Stuur dit naar je crew', shareBody: 'Kies het platform dat je vriendengroep toch al gebruikt. Geen login, geen signup.', nativeShare: 'Delen', shared: 'Gedeeld!', unsupported: 'Niet ondersteund', copyLink: 'Link kopiëren', copied: 'Gekopieerd', shareWhyTitle: 'Waarom een deelknop?', shareWhyBody: 'Een Custom Room wordt pas leuk als genoeg vrienden echt op komen dagen. Een simpel “zullen we dit vanavond proberen?” werkt beter met een pagina waar de groep meteen kan spelen, kijken en schuilplekken vergelijken.', rosterTitle: 'Crewlijst + uitnodigingsscorebord', rosterBody: 'Houd bij wie je hebt uitgenodigd, wie echt kwam opdagen en wie het scorebord draagt. Alles blijft alleen in deze browser.', namePlaceholder: 'Naam of handle van vriend', add: 'Toevoegen', noCrew: 'Nog geen crew. Voeg de mensen toe die je in een Custom Room wilt trekken. Je kunt +1 geven voor opkomen dagen en +5 voor het dragen van een ronde.', scoreTip: 'Tip: houd de score eerlijk bij. De helft van de lol is ontdekken wie de slechtste Verstopper van de groep is en hem daar de hele week mee plagen.', statusLabel: 'status', statuses: { invited: 'Uitgenodigd', joined: 'Gekomen', ghosted: 'Afgehaakt' }, platforms: { PC: 'PC', Discord: 'Discord', Mobile: 'Mobiel', Other: 'Anders' }, ctaTitle: 'Nog een volledige beginnersgids nodig vóór je in de queue gaat?', ctaBody: 'Besturing, verf, rollen en de checklist voor je eerste match — alles op één pagina.', ctaGuide: 'Beginnersgids', ctaPlay: 'Speel online', shareText: 'Ik vond een handige pagina met browser play en een multiplayergids voor Meccha Chameleon. Hier is de link:', pageTitle: 'Meccha Chameleon in het Nederlands', modes: [{ name: 'Klassiek verstoppertje', players: '2 - 24', body: 'Verstoppers verven zich en bevriezen, Zoekers jagen. Beste modus om de basis te leren.' }, { name: 'Infection', players: '4 - 12', body: 'Gevonden spelers gaan over naar de Zoekers. Elke ronde wordt spannender.' }, { name: 'Snelle jacht', players: '3 - 8', body: 'Iedereen verft tegelijk, daarna wint de snelste scanner.' }, { name: 'Privékamers', players: '2 - 24', body: 'Privélobby voor vrienden. Ideaal voor lange sessies en maptraining.' }], steps: [{ title: 'Zelfde kamer, zelfde Wi‑Fi', body: 'De eenvoudigste setup: één persoon host en de rest komt via uitnodiging binnen.', bullets: ['De host opent een Custom Room.', 'Nodig vrienden direct vanuit het spel uit.', 'Gebruik voice om coördinaten te callen.'] }, { title: 'Ander huis, zelfde land', body: 'Privékamers lopen via relayservers, dus je hoeft geen poorten open te zetten.', bullets: ['Kies de dichtstbijzijnde regio.', 'Onder 80 ms voelt uitstekend.', 'Bij geblokkeerde netwerken helpt een hotspot vaak.'] }, { title: 'Ander continent', body: 'Kies voor verre groepen een regio in het midden.', bullets: ['Vergelijk de ping voor de start.', 'Zet netwerkstatistieken aan bij klachten over lag.', 'Voice kan apart; de match blijft in de client.'] }, { title: 'Publieke matchmaking', body: 'De openbare queue is de snelste manier om het ritme van de game te leren.', bullets: ['2 tot 10 spelers is ideaal.', 'Zet de taal goed vóór je queuet.', 'Zwaardere lobbies ontstaan vaak in Discords.'] }, { title: 'Streaming en watch parties', body: 'De verfase en de reveal werken sterk op stream.', bullets: ['1080p / 60 is meestal genoeg.', 'Stel vooraf een clip-hotkey in.', 'Verberg namen als de chat graag backseat.'] }, { title: 'Familie en casual vrienden', body: 'De instapdrempel is laag, dus veel nieuwe spelers begrijpen de basis in één ronde.', bullets: ['Geen native Mac-client.', 'Geen native mobiele versie.', 'Push-to-talk en verven zijn snel uit te leggen.'] }] },
  ar: { eyebrow: 'اللعب الجماعي', title: 'كيف تجمع مجموعتك فعلاً في نفس الجولة', intro: 'Meccha Chameleon لعبة حفلات أكثر من كونها تجربة فردية. هنا الدليل العملي للأصدقاء، والفرق البعيدة، والطابور العام.', watchEyebrow: 'شاهده قبل أن تلعب', watchTitle: 'سلسلة المبتدئين في Meccha Chameleon', watchBody: 'ابدأ من الفيديو الأول واترك القائمة تكمل تلقائياً. كل شيء يبقى داخل الصفحة حتى يشاهد فريقك ويجرب من دون التنقل بين صفحات كثيرة.', watchBullets: ['1. افهم دورة اللعب والأزرار.', '2. راجع أساسيات المختبئ والباحث.', '3. اترك التبويب مفتوحاً للجولة التالية.'], watchFooterLeft: 'قائمة التشغيل تتقدم تلقائياً.', watchFooterRight: 'الفيديو يبقى داخل الموقع.', shareTitle: 'أرسل هذا إلى مجموعتك', shareBody: 'اختر المنصة التي يستخدمها فريقك أصلاً. لا تسجيل دخول ولا إنشاء حساب.', nativeShare: 'مشاركة', shared: 'تمت المشاركة!', unsupported: 'غير مدعوم', copyLink: 'نسخ الرابط', copied: 'تم النسخ', shareWhyTitle: 'لماذا زر مشاركة؟', shareWhyBody: 'الغرفة الخاصة لا تصبح ممتعة إلا عندما يصل عدد كافٍ من الأصدقاء. عبارة قصيرة مثل “لنجرّب هذا الليلة” تعمل بشكل أفضل عندما يقود الرابط إلى صفحة يمكن للجميع اللعب والمشاهدة ومقارنة أماكن الاختباء منها مباشرة.', rosterTitle: 'قائمة الفريق + لوحة دعوات', rosterBody: 'تتبّع من دعوته، ومن حضر فعلاً، ومن يحمل الجولة على كتفيه. كل شيء يُخزَّن في هذا المتصفح فقط.', namePlaceholder: 'اسم الصديق أو المعرّف', add: 'إضافة', noCrew: 'لا يوجد فريق بعد. أضف الأصدقاء الذين تريد إدخالهم إلى غرفة خاصة. يمكنك منح +1 للحضور و +5 لمن يحمل جولة كاملة.', scoreTip: 'نصيحة: احسب النقاط بصدق. نصف المتعة هو معرفة أسوأ مختبئ في المجموعة ثم السخرية منه طوال الأسبوع.', statusLabel: 'الحالة', statuses: { invited: 'تمت الدعوة', joined: 'انضم', ghosted: 'اختفى' }, platforms: { PC: 'كمبيوتر', Discord: 'ديسكورد', Mobile: 'هاتف', Other: 'أخرى' }, ctaTitle: 'هل تريد دليلاً كاملاً قبل دخول الطابور؟', ctaBody: 'التحكم، أداة الطلاء، الأدوار، وقائمة أول مباراة — كلها في صفحة واحدة.', ctaGuide: 'دليل اللاعب الجديد', ctaPlay: 'العب الآن', shareText: 'وجدت صفحة مفيدة جداً تجمع اللعب عبر المتصفح مع دليل جماعي للعبة Meccha Chameleon. هذا هو الرابط:', pageTitle: 'Meccha Chameleon العب أونلاين', modes: [{ name: 'الغميضة الكلاسيكية', players: '2 - 24', body: 'المختبئون يلوّنون أنفسهم ثم يثبتون، والباحثون يبدؤون الصيد. أفضل وضع لتعلّم الأساسيات.' }, { name: 'العدوى', players: '4 - 12', body: 'من يتم العثور عليه يتحول إلى باحث. التوتر يرتفع مع كل جولة.' }, { name: 'الصيد السريع', players: '3 - 8', body: 'الجميع يلوّن في الوقت نفسه، ثم يفوز من يمسح الزوايا أسرع.' }, { name: 'غرف خاصة', players: '2 - 24', body: 'ردهة خاصة للأصدقاء. مثالية للجلسات الطويلة والتدرّب على الخرائط.' }], steps: [{ title: 'نفس الغرفة، نفس الواي فاي', body: 'أبسط إعداد: شخص واحد يستضيف والبقية ينضمون عبر الدعوة.', bullets: ['المضيف يفتح غرفة مخصصة.', 'ادعُ الأصدقاء مباشرة من داخل اللعبة.', 'استخدموا المحادثة الصوتية لنداءات المواقع.'] }, { title: 'بيوت مختلفة، نفس البلد', body: 'الغرف الخاصة تعمل عبر خوادم relay، لذلك لا حاجة لفتح المنافذ.', bullets: ['اختر أقرب منطقة ممكنة.', 'أقل من 80ms ممتاز.', 'إذا كانت الشبكة مقيدة، فغالباً نقطة اتصال الهاتف أسهل.'] }, { title: 'قارات مختلفة', body: 'للمجموعات البعيدة اختر منطقة وسطية.', bullets: ['قارنوا الـ ping قبل البدء.', 'فعّلوا إحصاءات الشبكة إذا اشتكى أحد من التأخير.', 'يمكن إبقاء الصوت خارجياً؛ المباراة تبقى داخل العميل.'] }, { title: 'المطابقة العامة', body: 'الطابور العام أسرع طريقة لفهم إيقاع اللعبة.', bullets: ['2 إلى 10 لاعبين هو النطاق الأفضل.', 'اضبط اللغة قبل الدخول للطابور.', 'اللوبيات الأصعب غالباً تنشأ عبر ديسكورد.'] }, { title: 'البث وجلسات المشاهدة', body: 'مرحلة الطلاء ومرحلة الكشف مناسبتان جداً للبث.', bullets: ['دقة 1080p / 60 تكفي غالباً.', 'جهّز اختصار clip مسبقاً.', 'أخفِ الأسماء إذا كان الجمهور يحب التلميح.'] }, { title: 'العائلة والأصدقاء غير التقنيين', body: 'عتبة الدخول منخفضة، لذلك يفهم كثير من اللاعبين الجدد الأساسيات خلال جولة واحدة.', bullets: ['لا يوجد عميل Mac أصلي.', 'لا توجد نسخة هاتف أصلية.', 'الدفع للحديث وأداة الطلاء سهلان في الشرح.'] }] },
};

type CrewMember = {
  name: string;
  platform: 'PC' | 'Discord' | 'Mobile' | 'Other';
  invitedAt: string;
  status: 'invited' | 'joined' | 'ghosted';
  score: number;
};

const STORAGE_KEY = 'mcc-crew-roster-v1';

function loadCrew(): CrewMember[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCrew(crew: CrewMember[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(crew));
  } catch {
    // ignore localStorage failures
  }
}

export function HowToPlaySection({ locale }: { locale: string }) {
  const getHref = (path: string) => (locale === 'en' ? path : `/${locale}${path}`);
  const t = copy[(stepLocales.includes(locale as SupportedLocale) ? locale : 'en') as SupportedLocale];

  const [crew, setCrew] = useState<CrewMember[]>(() => loadCrew());
  const [newName, setNewName] = useState('');
  const [newPlatform, setNewPlatform] = useState<CrewMember['platform']>('PC');
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [shareState, setShareState] = useState<'idle' | 'shared' | 'unavailable'>('idle');

  useEffect(() => {
    saveCrew(crew);
  }, [crew]);

  const pageUrl = typeof window !== 'undefined' ? window.location.origin + '/#how-to-play' : 'https://mecchachameleon.art/#how-to-play';

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      setCopyState('idle');
    }
  }

  async function handleNativeShare() {
    if (typeof navigator === 'undefined' || !navigator.share) {
      setShareState('unavailable');
      setTimeout(() => setShareState('idle'), 2500);
      return;
    }
    try {
      await navigator.share({ title: t.pageTitle, text: t.shareText, url: pageUrl });
      setShareState('shared');
      setTimeout(() => setShareState('idle'), 2000);
    } catch {
      setShareState('idle');
    }
  }

  function handleAddCrew(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const entry: CrewMember = {
      name,
      platform: newPlatform,
      invitedAt: new Date().toISOString(),
      status: 'invited',
      score: 0,
    };
    setCrew((prev) => [entry, ...prev].slice(0, 20));
    setNewName('');
  }

  function bumpScore(name: string, delta: number) {
    setCrew((prev) => prev.map((c) => (c.name === name ? { ...c, score: Math.max(0, c.score + delta) } : c)));
  }

  function setStatus(name: string, status: CrewMember['status']) {
    setCrew((prev) => prev.map((c) => (c.name === name ? { ...c, status } : c)));
  }

  function removeCrew(name: string) {
    setCrew((prev) => prev.filter((c) => c.name !== name));
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(t.shareText)}&url=${encodeURIComponent(pageUrl)}`;
  const redditUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(t.pageTitle)}&url=${encodeURIComponent(pageUrl)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${t.shareText} ${pageUrl}`)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(t.shareText)}`;
  const sortedCrew = [...crew].sort((a, b) => b.score - a.score);
  const dateLocale = locale === 'zh' ? 'zh-CN' : locale === 'ru' ? 'ru-RU' : locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : locale === 'pt' ? 'pt-BR' : locale === 'fr' ? 'fr-FR' : locale === 'it' ? 'it-IT' : locale === 'nl' ? 'nl-NL' : locale === 'ar' ? 'ar' : 'en-US';

  return (
    <section id="how-to-play" className="scroll-mt-28 border-b border-[#D8CFC6] bg-white">
      <div className="container py-16">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7D6D69]">{t.eyebrow}</p>
          <h2 className="mt-1 text-2xl font-bold leading-tight text-[#29211D] md:text-3xl">{t.title}</h2>
          <p className="mt-3 text-sm leading-6 text-[#4C3B35]">{t.intro}</p>
        </div>

        <div className="mb-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {t.modes.map((mode, idx) => {
            const Icon = modeIcons[idx % modeIcons.length];
            return (
              <div key={mode.name} className="flex h-full flex-col rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#ff8fb3] text-white"><Icon className="h-5 w-5" /></div>
                <h3 className="text-sm font-semibold text-[#29211D]">{mode.name}</h3>
                <p className="mt-1 text-xs font-semibold text-[#7D6D69]">{mode.players} players</p>
                <p className="mt-2 text-xs leading-5 text-[#4C3B35]">{mode.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mb-12 overflow-hidden rounded-md border border-[#efc8d3] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff]">
          <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_320px]">
            <div className="relative aspect-video w-full bg-[#eef8ff]">
              <iframe
                src="https://www.youtube-nocookie.com/embed/OwrQrvNRHoY?playlist=1_p9HKjNqnk,tiwvQyc2a8k,hGbThwkwU50,eCbimRl-VLw&rel=0&modestbranding=1&playsinline=1"
                title={t.watchTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <div className="flex flex-col justify-between gap-4 bg-white/80 p-5 text-[#29211D]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#ff6f9a]">{t.watchEyebrow}</p>
                <h3 className="mt-2 text-lg font-semibold leading-snug">{t.watchTitle}</h3>
                <p className="mt-2 text-sm leading-5 text-[#4C3B35]">{t.watchBody}</p>
                <ul className="mt-3 space-y-2 text-sm leading-5 text-[#4C3B35]">
                  {t.watchBullets.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="flex items-center justify-between gap-3 text-xs text-[#5f5260]">
                <span>{t.watchFooterLeft}</span>
                <span>{t.watchFooterRight}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-md border border-[#7D6D69]/30 bg-[#e6f3ec] p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#7D6D69] text-white"><Share2 className="h-4 w-4" /></span>
              <div>
                <h3 className="text-base font-semibold text-[#29211D]">{t.shareTitle}</h3>
                <p className="text-xs text-[#4C3B35]">{t.shareBody}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#61a8ff] px-3 text-sm font-semibold text-white transition hover:bg-[#4b92ec]"><Twitter className="h-4 w-4" /> X / Twitter</a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#25D366] px-3 text-sm font-semibold text-white transition hover:bg-[#1eb257]"><Send className="h-4 w-4" /> WhatsApp</a>
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#26A5E4] px-3 text-sm font-semibold text-white transition hover:bg-[#1b8ec7]"><Send className="h-4 w-4" /> Telegram</a>
              <a href={redditUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#FF4500] px-3 text-sm font-semibold text-white transition hover:bg-[#e63d00]"><MessageCircle className="h-4 w-4" /> Reddit</a>
              <button type="button" onClick={handleNativeShare} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#29211D] bg-white px-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#ece5d8]"><Share2 className="h-4 w-4" />{shareState === 'shared' ? t.shared : shareState === 'unavailable' ? t.unsupported : t.nativeShare}</button>
              <button type="button" onClick={handleCopy} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#7D6D69] bg-white px-3 text-sm font-semibold text-[#7D6D69] transition hover:bg-[#EFE2DA]">{copyState === 'copied' ? <><Check className="h-4 w-4" /> {t.copied}</> : <><Copy className="h-4 w-4" /> {t.copyLink}</>}</button>
            </div>
            <p className="mt-4 text-xs text-[#4C3B35]"><strong className="text-[#29211D]">{t.shareWhyTitle}</strong> {t.shareWhyBody}</p>
          </div>

          <div className="rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#ff8fb3] text-white"><Trophy className="h-4 w-4" /></span>
              <div>
                <h3 className="text-base font-semibold text-[#29211D]">{t.rosterTitle}</h3>
                <p className="text-xs text-[#4C3B35]">{t.rosterBody}</p>
              </div>
            </div>
            <form onSubmit={handleAddCrew} className="mb-3 grid gap-2 sm:grid-cols-[1fr_120px_auto]">
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={t.namePlaceholder} maxLength={32} className="rounded-md border border-[#D8CFC6] bg-white px-3 py-2 text-sm text-[#29211D] placeholder:text-[#4C3B35]/60 focus:border-[#7D6D69] focus:outline-none" />
              <select value={newPlatform} onChange={(e) => setNewPlatform(e.target.value as CrewMember['platform'])} className="rounded-md border border-[#D8CFC6] bg-white px-3 py-2 text-sm text-[#29211D] focus:border-[#7D6D69] focus:outline-none">
                <option value="PC">{t.platforms.PC}</option>
                <option value="Discord">{t.platforms.Discord}</option>
                <option value="Mobile">{t.platforms.Mobile}</option>
                <option value="Other">{t.platforms.Other}</option>
              </select>
              <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#7D6D69] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#5C4F4C]"><UserPlus className="h-4 w-4" />{t.add}</button>
            </form>
            {sortedCrew.length === 0 ? (
              <p className="rounded-md border border-dashed border-[#D8CFC6] bg-white/50 p-4 text-center text-xs text-[#4C3B35]">{t.noCrew}</p>
            ) : (
              <ol className="space-y-2">
                {sortedCrew.map((c, i) => (
                  <li key={c.name} className="flex items-center justify-between gap-3 rounded-md border border-[#D8CFC6] bg-white p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff8fb3] text-xs font-bold text-white">{i + 1}</span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-[#29211D]">{c.name}</div>
                        <div className="flex items-center gap-2 text-xs text-[#4C3B35]">
                          <span>{t.platforms[c.platform]}</span>
                          <span aria-hidden>·</span>
                          <span>{new Date(c.invitedAt).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select value={c.status} onChange={(e) => setStatus(c.name, e.target.value as CrewMember['status'])} className="rounded-sm border border-[#D8CFC6] bg-white px-1.5 py-1 text-xs" aria-label={`${c.name} ${t.statusLabel}`}>
                        <option value="invited">{t.statuses.invited}</option>
                        <option value="joined">{t.statuses.joined}</option>
                        <option value="ghosted">{t.statuses.ghosted}</option>
                      </select>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => bumpScore(c.name, -1)} className="rounded-sm border border-[#D8CFC6] bg-white px-2 py-1 text-xs hover:bg-[#F6F0EA]" aria-label={`Decrease ${c.name} score`}>−</button>
                        <span className="min-w-7 text-center text-sm font-bold text-[#7D6D69]">{c.score}</span>
                        <button type="button" onClick={() => bumpScore(c.name, 1)} className="rounded-sm border border-[#D8CFC6] bg-white px-2 py-1 text-xs hover:bg-[#F6F0EA]" aria-label={`Increase ${c.name} score`}>+</button>
                      </div>
                      <button type="button" onClick={() => removeCrew(c.name)} className="rounded-sm p-1 text-[#4C3B35] hover:bg-[#F6F0EA] hover:text-[#AA776E]" aria-label={`Remove ${c.name}`}><X className="h-3.5 w-3.5" /></button>
                    </div>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-3 text-xs text-[#4C3B35]">{t.scoreTip}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {t.steps.map((step, i) => (
            <div key={step.title} className="rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#7D6D69] text-xs font-bold text-white">{i + 1}</span>
                <h3 className="text-base font-semibold text-[#29211D]">{step.title}</h3>
              </div>
              <p className="text-sm leading-6 text-[#4C3B35]">{step.body}</p>
              <ul className="mt-4 space-y-2 text-xs leading-5 text-[#4C3B35]">
                {step.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2"><span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#7D6D69]" />{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#ff8fb3] text-white"><Wifi className="h-4 w-4" /></span>
            <div>
              <p className="text-sm font-semibold text-[#29211D]">{t.ctaTitle}</p>
              <p className="text-xs text-[#4C3B35]">{t.ctaBody}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a href={getHref('/new-player')} className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-[#ff6f9a] px-4 text-sm font-semibold text-white transition hover:bg-[#e95a88]"><MessageCircle className="h-4 w-4" />{t.ctaGuide}</a>
            <a href={getHref('/#play')} className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-[#29211D] bg-white px-4 text-sm font-semibold text-[#29211D] transition hover:border-[#7D6D69] hover:text-[#7D6D69]">{t.ctaPlay}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
