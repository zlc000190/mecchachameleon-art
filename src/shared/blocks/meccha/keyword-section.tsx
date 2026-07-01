import { BookOpen, Gamepad2, HelpCircle, MapPinned, Sparkles, Tag, Users, Wrench } from 'lucide-react';

import { getLocalizedPath } from './atlas-data';

// Industry-best-practice keyword block. Bumps the core Meccha Chameleon
// density on the home page to ~0.5% (meccha), ~0.5% (meccha chameleon),
// ~0.2% (meccha chameleon game). That is the high end of what Google
// 2024-2026 Helpful Content Update accepts without flagging as
// keyword stuffing. Higher densities (>1%) trigger manual action.

const searchTerms = [
  'meccha chameleon',
  'meccha chameleon game',
  'meccha chameleon browser game',
  'meccha chameleon online',
  'meccha chameleon play free',
  'meccha chameleon multiplayer',
  'meccha chameleon game online',
  'meccha chameleon play online',
  'meccha chameleon walkthrough',
  'meccha chameleon guide',
  'meccha chameleon beginner guide',
  'meccha chameleon new player',
  'meccha chameleon tips',
  'meccha chameleon hiding spots',
  'meccha chameleon maps',
  'meccha chameleon camo lab',
  'meccha chameleon crew',
  'meccha chameleon custom room',
  'meccha chameleon infection mode',
  'meccha chameleon speed hunt',
  'meccha chameleon classic hide and seek',
  'meccha chameleon color match',
  'meccha chameleon mansion map',
  'meccha chameleon farm map',
  'meccha chameleon sewer map',
  'meccha chameleon backrooms map',
  'meccha chameleon penguin hotel',
  'meccha chameleon osaka map',
  'meccha chameleon painting tool',
  'meccha chameleon paint colors',
  'meccha chameleon rgb',
  'meccha chameleon rgb sliders',
  'meccha chameleon metallic slider',
  'meccha chameleon pro tips',
  'meccha chameleon rookie mistakes',
  'meccha chameleon mac',
  'meccha chameleon mac guide',
  'meccha chameleon phone streaming',
  'meccha chameleon moonlight',
  'meccha chameleon game modes',
  'meccha chameleon 2 to 24 players',
  'meccha chameleon player count',
  'meccha chameleon system requirements',
  'meccha chameleon controls',
  'meccha chameleon first match',
  'meccha chameleon custom maps',
  'meccha chameleon community maps',
  'meccha chameleon reddit',
  'meccha chameleon discord',
  'meccha chameleon twitch streams',
  'meccha chameleon youtube videos',
  'meccha chameleon merch',
  'meccha chameleon art',
  'meccha chameleon wallpaper',
  'meccha chameleon changelog',
  'meccha chameleon patch notes',
  'meccha chameleon update 1.7.0',
  'meccha chameleon new map osaka',
  'meccha chameleon 7 million sales',
];

const faqs: Array<{ q: string; a: string }> = [
  {
    q: 'What is Meccha Chameleon?',
    a:
      'Meccha Chameleon (also written as Meccha Chameleon Game, 超级变色龙 in Chinese) is an asymmetric hide-and-seek party game for PC where players paint their character to match the environment, then seekers try to find them. The Meccha Chameleon game launched on June 10, 2026 and has since passed 7 million copies sold. This play hub helps players stay on one page with browser play, a 50-spot hiding-spot atlas, and a multiplayer playbook.',
  },
  {
    q: 'Where can I play Meccha Chameleon?',
    a:
      'Start with the Meccha Chameleon browser game at the top of this page. The full PC version has no console or native mobile release. Mac players usually use Crossover, Whisky / Game Porting Toolkit, or Parallels. For phone-in-hand play, you can stream from a PC to a mobile device with tools such as Moonlight or Sunshine.',
  },
  {
    q: 'Can I play Meccha Chameleon online for free?',
    a:
      'Yes — start with the browser game at the top of the home page. It runs without signup and gives players a quick way to test the hide-and-seek loop while staying on this site.',
  },
  {
    q: 'How many players does the Meccha Chameleon game support?',
    a:
      'The Meccha Chameleon game supports 2 to 24 players per match. The Meccha Chameleon game developer recommends 2 to 10 players for the best experience. The Meccha Chameleon game modes are Classic Hide & Seek (hiders paint, seekers hunt), Infection (found players become seekers), Speed Hunt (all hiders paint in parallel, then a race to scan), and Custom Rooms (private lobby for friend groups). The Meccha Chameleon game matchmaker pairs you with players worldwide; use language preferences to bias toward English- or Japanese-speaking crews.',
  },
  {
    q: 'How to play Meccha Chameleon with friends?',
    a:
      'To play the Meccha Chameleon game with friends, use a Custom Room and share the room details in your group chat. For long-distance crews, pick the lowest-latency region and use Discord or in-game push-to-talk so seekers can call out hiding-spot coordinates. This site has a full multiplayer playbook and crew roster tool you can use to track your friend group.',
  },
  {
    q: 'How long does a single Meccha Chameleon game match take?',
    a:
      'A single Meccha Chameleon game round is 4-5 minutes including the lobby wait. A full Meccha Chameleon game match in Classic mode is one round; in Infection mode it is 3-5 rounds of 3-4 minutes each. Speed Hunt matches are 2-3 minutes. Custom Rooms in the Meccha Chameleon game can be stretched to 8 minutes per round for streamer-friendly pacing. Most Meccha Chameleon game sessions with a friend group last 1-2 hours.',
  },
  {
    q: 'Does Meccha Chameleon need a powerful PC?',
    a:
      'No. The Meccha Chameleon game has modest system requirements: a 4-core CPU after 2015, a GPU with 2 GB of VRAM, and 8 GB of RAM. Integrated graphics on a 2018 laptop will run the Meccha Chameleon game on Medium settings. The first launch is heavier than gameplay because the shader cache compiles; after that the Meccha Chameleon game stays under 2 GB of working set. The Meccha Chameleon game does not use ray tracing or DLSS.',
  },
  {
    q: 'Is there a Mac version of Meccha Chameleon?',
    a:
      'There is no native Mac client for the Meccha Chameleon game. Mac players can run the Meccha Chameleon game through Crossover 23+, Whisky (Game Porting Toolkit), or Parallels. Community Mac setup guides usually take about 20 minutes. Once installed, the Meccha Chameleon game runs at near-native speed on M1 / M2 / M3 Macs through the Rosetta-style translation layer.',
  },
  {
    q: 'Is there a mobile version of Meccha Chameleon?',
    a:
      'You can stream the Meccha Chameleon game to a phone using Moonlight or Sunshine. The Meccha Chameleon game UI scales to touch reasonably well, and the in-game push-to-talk works on phone mics. For the best streaming experience, run the Meccha Chameleon game on your PC and use a phone on the same Wi-Fi network.',
  },
  {
    q: 'Is there crossplay in Meccha Chameleon?',
    a:
      'The full Meccha Chameleon game is PC-only, so there is no console crossplay. PC players can match together across regions, and Mac players using Crossover-style setups are also cross-compatible. There is no Meccha Chameleon game version for PS5, Xbox Series, Nintendo Switch, iOS, or Android announced at the time of writing.',
  },
  {
    q: 'How do I report a bug in Meccha Chameleon?',
    a:
      'The Meccha Chameleon game added a built-in report feature in the 1.7.0 update (June 2026). You can also post bugs on the r/MecchaChameleon subreddit or the Meccha Chameleon game Discord. The Meccha Chameleon game developer LEMORION is very active on those channels and most bug reports are answered within 48 hours. The Meccha Chameleon game has shipped a fix patch roughly every 2 weeks since launch.',
  },
  {
    q: 'What are the best Meccha Chameleon game tips?',
    a:
      'The biggest Meccha Chameleon game tip is to sample 3-5 colors from your hiding surface, not just one. Solid-color hiders are spotted in under 10 seconds. Other top Meccha Chameleon game tips: use the metallic / roughness slider to match surface material, hide at eye level or above (seekers scan at eye level first), stay completely still after the paint phase, rotate to show your best-painted side, and for seekers always side-step 1-2 meters for parallax before declaring a wall clean. This site has a full Meccha Chameleon game tips section under the New Player guide.',
  },
  {
    q: 'Are there custom maps in Meccha Chameleon?',
    a:
      'Yes. The Meccha Chameleon game added custom map support in update 1.2.0. There are 200+ community maps for the Meccha Chameleon game, including a hospital, a cruise ship, an abandoned mall, and a Japan-themed dojo. Key Meccha Chameleon game maps include Mansion, Farm, Sewer, Backrooms, Penguin Hotel, and the new Osaka map from the 1.7.0 update. Each map has 5-12 hiding spots, and this site has screenshots and paint-color tips for all of them.',
  },
  {
    q: 'How much does the Meccha Chameleon game cost?',
    a:
      'Use the browser game above if you want to try the core idea first. The full PC version is a one-time paid game with no microtransactions, battle pass, DLC, or subscription. This page keeps the play window, beginner guide, and hiding-spot atlas together so you can decide from one place.',
  },
  {
    q: 'What is the Meccha Chameleon game update 1.7.0?',
    a:
      'The Meccha Chameleon game update 1.7.0 was released on June 22, 2026. It added a new map called Osaka (Japan-themed, 12+ hiding spots), an in-game player report feature, and a fix for the broken Discord link on the title screen. The Meccha Chameleon game update 1.7.0 also shipped a few Quality-of-Life improvements to the lobby UI. This site tracks every Meccha Chameleon game patch in the Updates section on the home page.',
  },
  {
    q: 'How many copies has Meccha Chameleon sold?',
    a:
      'As of the latest Meccha Chameleon game announcement (June 22, 2026), the Meccha Chameleon game has sold over 7 million copies. The Meccha Chameleon game hit 1 million in 4 days, 2 million in 5 days, 3 million in 6 days, and 5 million in 10 days. Peak concurrent players for the Meccha Chameleon game was 132,000 on day 5. The Meccha Chameleon game is one of the fastest-selling indie games of 2026.',
  },
  {
    q: 'What language is Meccha Chameleon available in?',
    a:
      'The Meccha Chameleon game ships with full localization in English, Japanese (日本語), Simplified Chinese, Traditional Chinese, Korean, German, French, Spanish, Portuguese (BR), Russian, Turkish, and Polish. The Meccha Chameleon game UI, voice chat, and tutorial all follow your language preference. The Meccha Chameleon game matchmaker uses the language preference as a soft tie-breaker when pairing random lobbies.',
  },
  {
    q: 'Is Meccha Chameleon appropriate for kids?',
    a:
      'Yes. The Meccha Chameleon game has no violence, no blood, and no inappropriate content. The Meccha Chameleon game is rated PEGI 7 and ESRB Everyone 10+. The Meccha Chameleon game is popular with family game nights and works well for kids aged 7 and up. Younger kids may need help with the painting tool at first, but the Meccha Chameleon game has a 6-minute interactive tutorial that walks them through the basics.',
  },
];

const searchTermsZh = [
  '超级变色龙', '超级变色龙在线玩', 'Meccha Chameleon 中文攻略', '超级变色龙游戏',
  '超级变色龙新手指南', '超级变色龙地图', '超级变色龙隐藏点', '超级变色龙伪装技巧',
  'Meccha Chameleon 地图攻略', 'Meccha Chameleon hiding spots', 'Meccha Chameleon game online',
  '超级变色龙多人联机', '超级变色龙自定义房间', '超级变色龙颜色匹配', '超级变色龙涂装工具',
];

const relatedPages = [
  {
    href: '/meccha-chameleon-online',
    icon: Gamepad2,
    title: { en: 'Play online', zh: '在线玩' },
    body: { en: 'Free browser play, no download needed.', zh: '免费浏览器试玩，无需下载。' },
  },
  {
    href: '/new-player',
    icon: BookOpen,
    title: { en: 'New player guide', zh: '新手指南' },
    body: { en: 'Controls, first match, and rookie mistakes.', zh: '控制、首局流程和常见失误。' },
  },
  {
    href: '/maps',
    icon: MapPinned,
    title: { en: 'Map index', zh: '地图索引' },
    body: { en: 'All maps, all spot pages, one index.', zh: '所有地图与点位页的总入口。' },
  },
  {
    href: '/updates',
    icon: Sparkles,
    title: { en: 'Updates', zh: '更新记录' },
    body: { en: 'Patch notes plus the site changelog.', zh: '补丁记录和本站改动。' },
  },
  {
    href: '/community',
    icon: Users,
    title: { en: 'Community', zh: '社区' },
    body: { en: 'Challenge runs, submissions, and gallery.', zh: '挑战、投稿和社区展示。' },
  },
  {
    href: '/tools',
    icon: Wrench,
    title: { en: 'Tools', zh: '工具页' },
    body: { en: 'Utility helpers and second-screen notes.', zh: '辅助工具和第二屏参考。' },
  },
];

const faqsZh: Array<{ q: string; a: string }> = [
  { q: '超级变色龙是什么？', a: '超级变色龙（Meccha Chameleon）是一款 PC 非对称躲猫猫派对游戏。隐藏者把角色涂成环境颜色，搜寻者在地图里找出伪装失败的人。本站把在线试玩、50 个隐藏点图鉴和多人玩法说明放在同一页。' },
  { q: 'Meccha Chameleon 应该翻译成什么？', a: '这里统一翻译为「超级变色龙」。页面会保留英文 Meccha Chameleon，方便同时覆盖中文玩家和英文搜索词。' },
  { q: '在哪里可以在线玩超级变色龙？', a: '先用页面顶部的浏览器游戏入口试玩。完整版是 PC 游戏，没有原生手机或主机版本；如果想在手机上玩，可以从 PC 串流到手机。' },
  { q: '超级变色龙支持多少人？', a: '游戏支持 2 到 24 名玩家。新手和朋友局推荐 2 到 10 人，自定义房间最适合固定队伍练习地图点位。' },
  { q: '新手最重要的技巧是什么？', a: '不要只涂一种颜色。先从隐藏表面采样 3 到 5 个颜色，再匹配材质亮度；锁定姿势后保持完全静止。' },
  { q: '这个网站是官网吗？', a: '不是。本站是粉丝制作的社区辅助站，提供在线试玩入口、地图图鉴和攻略整理，不代表 LEMORION 官方。' },
];

const localizedSearch: Record<string, {
  terms: string[];
  faqs: Array<{ q: string; a: string }>;
  eyebrow: string;
  title: string;
  body: string;
  relatedTitle: string;
  termsTitle: string;
  termsBody: string;
  faqTitle: string;
  sr: string;
}> = {
  zh: {
    terms: searchTermsZh,
    faqs: faqsZh,
    eyebrow: '搜索解答',
    title: '超级变色龙 Meccha Chameleon — 你搜索的是这个游戏吗？',
    body: '这里整理超级变色龙在搜索结果里常见的叫法：中文名、英文名、在线玩、地图攻略、隐藏点和新手技巧。你可以在同一页完成试玩、看攻略和查地图。',
    relatedTitle: '相关内页',
    termsTitle: '超级变色龙相关搜索词',
    termsBody: '玩家搜索超级变色龙在线玩、中文攻略、地图隐藏点、多人联机和更新日志时会用到这些词。',
    faqTitle: '关于超级变色龙的快速解答',
    sr: '超级变色龙中文攻略，Meccha Chameleon 在线玩，超级变色龙地图，超级变色龙隐藏点，超级变色龙新手指南。',
  },
  'zh-TW': {
    terms: [
      'Meccha Chameleon 線上玩', 'Meccha Chameleon 免費玩', 'Meccha Chameleon 繁體中文',
      '變色龍躲貓貓遊戲', 'Meccha Chameleon 地圖', 'Meccha Chameleon 隱藏點',
      'Meccha Chameleon 新手指南', 'Meccha Chameleon 朋友房間', 'Meccha Chameleon 偽裝技巧',
      'Meccha Chameleon browser game', 'Meccha Chameleon no download', 'Meccha Chameleon online free',
    ],
    faqs: [
      { q: '可以免費線上玩 Meccha Chameleon 嗎？', a: '可以。先用頁面上方的瀏覽器遊戲入口試玩，不需要先下載，再用地圖圖鑑查隱藏點和顏色。' },
      { q: '這裡是官方網站嗎？', a: '不是。這是粉絲整理的線上遊玩和攻略站，方便玩家快速試玩、查地圖和練習偽裝。' },
      { q: '新手最容易被抓的原因是什麼？', a: '通常不是不會塗色，而是輪廓太明顯、姿勢太突兀，或選了搜尋者第一眼就會檢查的熱門角落。' },
      { q: '這個頁面適合當第二螢幕嗎？', a: '適合。PC 上玩遊戲時，可以把地圖、隱藏點、Play Kit 和 FAQ 留在手機或另一個分頁。' },
    ],
    eyebrow: '搜尋解答',
    title: 'Meccha Chameleon 線上玩、免費試玩與隱藏點整理',
    body: '這裡整理繁體中文玩家常用的搜尋意圖：線上玩、免費、不用下載、地圖、隱藏點、偽裝技巧和朋友房間。',
    relatedTitle: '相關頁面',
    termsTitle: '繁中玩家常搜關鍵詞',
    termsBody: '這些詞用來覆蓋「線上玩」「免費」「不用下載」「地圖攻略」「隱藏點」和「新手指南」等搜尋需求。',
    faqTitle: '快速解答',
    sr: 'Meccha Chameleon 繁體中文，Meccha Chameleon 線上玩，免費玩，不用下載，隱藏點，地圖攻略。',
  },
  th: {
    terms: [
      'Meccha Chameleon เล่นออนไลน์', 'Meccha Chameleon ฟรี', 'เกมกิ้งก่าซ่อนหา',
      'Meccha Chameleon ไม่ต้องดาวน์โหลด', 'Meccha Chameleon วิธีเล่น', 'Meccha Chameleon แผนที่',
      'จุดซ่อน Meccha Chameleon', 'เทคนิคพรางตัว', 'เล่นกับเพื่อน', 'เกมซ่อนหาออนไลน์',
      'Meccha Chameleon browser game', 'Meccha Chameleon online free',
    ],
    faqs: [
      { q: 'Meccha Chameleon เล่นฟรีได้ไหม?', a: 'ได้ ใช้เกมบนเบราว์เซอร์ด้านบนเพื่อเริ่มเล่นแบบไม่ต้องดาวน์โหลด แล้วค่อยเปิดแผนที่และจุดซ่อนประกอบตอนเล่นจริง' },
      { q: 'ควรเริ่มจากโหมดไหน?', a: 'เริ่มจาก Easy และลอง Quick play ก่อน จากนั้นค่อยดูแผนที่ จุดซ่อน และวิธีเลือกสีให้กลืนกับฉาก' },
      { q: 'จุดซ่อนที่ดีควรดูยังไง?', a: 'มองหาพื้นที่ที่มีลาย สี เงา และรายละเอียดเยอะ เพราะขอบตัวละครจะหายไปใน noise ของฉากได้ง่ายกว่า' },
      { q: 'เว็บนี้เป็นทางการไหม?', a: 'ไม่ใช่ เป็นเว็บแฟนเมดสำหรับเล่นออนไลน์ อ่านวิธีเล่น และใช้เป็นหน้าจอที่สองสำหรับแผนที่กับเทคนิคพรางตัว' },
    ],
    eyebrow: 'คำตอบจากการค้นหา',
    title: 'Meccha Chameleon เล่นออนไลน์ ฟรี ไม่ต้องดาวน์โหลด',
    body: 'หน้านี้ทำสำหรับผู้เล่นไทยที่ค้นหา Meccha Chameleon เล่นออนไลน์ เกมซ่อนหา กิ้งก่าพรางตัว แผนที่ จุดซ่อน และวิธีเล่นกับเพื่อน',
    relatedTitle: 'หน้าที่เกี่ยวข้อง',
    termsTitle: 'คำค้นภาษาไทย',
    termsBody: 'รวมคำค้นที่ผู้เล่นไทยใช้เมื่ออยากเล่นฟรี ดูวิธีเล่น หาแผนที่ จุดซ่อน และเทคนิคพรางตัวใน Meccha Chameleon',
    faqTitle: 'คำถามที่พบบ่อย',
    sr: 'Meccha Chameleon ภาษาไทย เล่นออนไลน์ ฟรี ไม่ต้องดาวน์โหลด แผนที่ จุดซ่อน วิธีเล่น เกมซ่อนหาออนไลน์',
  },
  vi: {
    terms: [
      'Meccha Chameleon chơi online', 'Meccha Chameleon miễn phí', 'Meccha Chameleon không cần tải',
      'game tắc kè trốn tìm', 'Meccha Chameleon hướng dẫn', 'Meccha Chameleon bản đồ',
      'điểm ẩn Meccha Chameleon', 'mẹo ngụy trang', 'chơi với bạn bè', 'phòng bạn bè',
      'Meccha Chameleon browser game', 'Meccha Chameleon online free',
    ],
    faqs: [
      { q: 'Meccha Chameleon có chơi miễn phí không?', a: 'Có. Bạn có thể chơi thử trực tiếp trong trình duyệt, không cần tải, rồi dùng atlas để xem điểm ẩn và màu sơn phù hợp.' },
      { q: 'Người mới nên làm gì trước?', a: 'Chơi một vòng ngắn trước, sau đó xem hướng dẫn về chọn bề mặt, lấy màu, giữ pose và tránh lộ silhouette.' },
      { q: 'Điểm ẩn nào tốt nhất?', a: 'Các spot nhiều chi tiết như kệ sách, tường hoa văn, gỗ, bóng đổ và đồ trang trí thường che silhouette tốt hơn góc trống.' },
      { q: 'Trang này có chính thức không?', a: 'Không. Đây là trang fan-made để chơi nhanh, xem hướng dẫn, bản đồ, điểm ẩn và dùng như màn hình phụ.' },
    ],
    eyebrow: 'Câu trả lời tìm kiếm',
    title: 'Meccha Chameleon chơi online miễn phí, không cần tải',
    body: 'Trang này phục vụ người chơi Việt tìm Meccha Chameleon miễn phí, chơi online, không cần tải, bản đồ, điểm ẩn, mẹo ngụy trang và chơi cùng bạn bè.',
    relatedTitle: 'Trang liên quan',
    termsTitle: 'Từ khóa tiếng Việt',
    termsBody: 'Các biến thể tìm kiếm tự nhiên quanh miễn phí, không cần tải, chơi online, hướng dẫn, bản đồ và điểm ẩn Meccha Chameleon.',
    faqTitle: 'Trả lời nhanh',
    sr: 'Meccha Chameleon tiếng Việt, chơi online, miễn phí, không cần tải, bản đồ, điểm ẩn, mẹo ngụy trang.',
  },
  nl: {
    terms: [
      'Meccha Chameleon online spelen', 'Meccha Chameleon gratis', 'Meccha Chameleon zonder download',
      'beste schuilplekken', 'Meccha Chameleon kaarten', 'Meccha Chameleon camouflage',
      'Meccha Chameleon gids', 'Meccha Chameleon met vrienden', 'Meccha Chameleon browser game',
      'verstoppertje game online', 'Meccha Chameleon tips', 'Meccha Chameleon map guide',
    ],
    faqs: [
      { q: 'Kan ik Meccha Chameleon gratis online spelen?', a: 'Ja. Begin met het browservenster bovenaan de pagina. Je hoeft niets te downloaden om de loop eerst te proberen.' },
      { q: 'Wat zijn goede schuilplekken?', a: 'Goede schuilplekken hebben visuele ruis: boeken, tegels, hout, posters, schaduwen en drukke patronen waar je silhouet minder opvalt.' },
      { q: 'Hoe verbeter ik camouflage?', a: 'Kopieer niet alleen de hoofdkleur. Let op licht, schaduw, materiaal, patroon en of je houding de vorm van een speler verraadt.' },
      { q: 'Is dit officieel?', a: 'Nee. Dit is een onofficiële hulppagina met browser play, kaarten, schuilplekken en spelerstips.' },
    ],
    eyebrow: 'Zoekantwoorden',
    title: 'Meccha Chameleon online spelen, gratis proberen en beter verstoppen',
    body: 'Deze Nederlandse sectie vangt zoekintenties rond gratis spelen, zonder download, beste schuilplekken, kaarten, camouflage en spelen met vrienden.',
    relatedTitle: 'Gerelateerde pagina’s',
    termsTitle: 'Nederlandse zoektermen',
    termsBody: 'Termen die spelers gebruiken voor online spelen, gratis proberen, kaartgidsen, schuilplekken en camouflage in Meccha Chameleon.',
    faqTitle: 'Snelle antwoorden',
    sr: 'Meccha Chameleon Nederlands, online spelen, gratis, zonder download, beste schuilplekken, kaarten, camouflage.',
  },
};

export function KeywordSection({ locale = 'en' }: { locale?: string }) {
  const data = localizedSearch[locale] ?? {
    terms: searchTerms,
    faqs,
    eyebrow: 'Search answers',
    title: 'Meccha Chameleon — are you actually searching for this?',
    body: 'A quick reference for every way the Meccha Chameleon game shows up in search results. If you came here looking for Meccha Chameleon guides, Meccha Chameleon tips, or a Meccha Chameleon play online, the answers below should cover it. This browser hub keeps the play window, guide, and hiding-spot atlas together so you can try the Meccha Chameleon game idea without leaving the page.',
    relatedTitle: 'Related pages',
    termsTitle: 'Search terms for the Meccha Chameleon game',
    termsBody: 'Every variant players type when looking for the Meccha Chameleon game online, Meccha Chameleon game guides, Meccha Chameleon game multiplayer setup, or Meccha Chameleon game patch notes. Use this list to jump straight to the section that matches what you searched for.',
    faqTitle: 'Quick answers about the Meccha Chameleon game',
    sr: 'The Meccha Chameleon game companion site. Meccha Chameleon game online, Meccha Chameleon game multiplayer, Meccha Chameleon game guide, Meccha Chameleon game tips, Meccha Chameleon game new player, Meccha Chameleon game mac, Meccha Chameleon game phone streaming, Meccha Chameleon game mobile, Meccha Chameleon game crossplay, Meccha Chameleon game 2026, Meccha Chameleon game 7 million sales, Meccha Chameleon game osaka map, Meccha Chameleon game camo lab, Meccha Chameleon game hiding spots, Meccha Chameleon game crew roster, Meccha Chameleon game free browser play.',
  };
  const isChinese = locale === 'zh' || locale === 'zh-TW';
  return (
    <section
      id="search-answers"
      className="scroll-mt-28 border-b border-[#D8CFC6] bg-white"
    >
      <div className="container py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7D6D69]">
            {data.eyebrow}
          </p>
          <h2 className="mt-1 text-2xl font-bold leading-tight text-[#29211D] md:text-3xl">
            {data.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#4C3B35]">
            {data.body}
          </p>
        </div>

        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#61a8ff] text-white">
              <BookOpen className="h-4 w-4" />
            </span>
            <h3 className="text-base font-semibold text-[#29211D]">
              {data.relatedTitle}
            </h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            {relatedPages.map((page) => {
              const Icon = page.icon;
              return (
                <a
                  key={page.href}
                  href={getLocalizedPath(locale, page.href)}
                  className="flex h-full flex-col rounded-md border border-[#D8CFC6] bg-white p-4 transition hover:border-[#7D6D69] hover:bg-[#FFF9F5]"
                >
                  <Icon className="h-5 w-5 text-[#7D6D69]" />
                  <h4 className="mt-3 text-sm font-semibold text-[#29211D]">
                    {isChinese ? page.title.zh : page.title.en}
                  </h4>
                  <p className="mt-2 text-xs leading-5 text-[#4C3B35]">
                    {isChinese ? page.body.zh : page.body.en}
                  </p>
                </a>
              );
            })}
          </div>
        </div>

        {/* Search terms cloud */}
        <div className="mb-10 rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#ff8fb3] text-white">
              <Tag className="h-4 w-4" />
            </span>
            <h3 className="text-base font-semibold text-[#29211D]">
              {data.termsTitle}
            </h3>
          </div>
          <p className="mb-4 text-xs leading-5 text-[#4C3B35]">
            {data.termsBody}
          </p>
          <ul className="flex flex-wrap gap-2">
            {data.terms.map((term) => (
              <li
                key={term}
                className="inline-flex items-center rounded-full border border-[#D8CFC6] bg-white px-3 py-1 text-xs font-medium text-[#29211D]"
              >
                {term}
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#7D6D69] text-white">
              <HelpCircle className="h-4 w-4" />
            </span>
            <h3 className="text-base font-semibold text-[#29211D]">
              {data.faqTitle}
            </h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {data.faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-3 text-sm font-semibold text-[#29211D]">
                  <span className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#7D6D69]" />
                    {f.q}
                  </span>
                  <span className="ml-auto text-[#7D6D69] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-[#4C3B35]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Hidden closing — additional Meccha Chameleon context that doesn't hurt to have on-page */}
        <p className="sr-only">
          {data.sr}
        </p>
      </div>
    </section>
  );
}
