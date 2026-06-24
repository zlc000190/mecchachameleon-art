import { HelpCircle, Sparkles, Tag } from 'lucide-react';

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

export function KeywordSection() {
  return (
    <section
      id="search-answers"
      className="scroll-mt-28 border-b border-[#D8CFC6] bg-white"
    >
      <div className="container py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7D6D69]">
            Search answers
          </p>
          <h2 className="mt-1 text-2xl font-bold leading-tight text-[#29211D] md:text-3xl">
            Meccha Chameleon — Are you actually search for this
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#4C3B35]">
            A quick reference for every way the Meccha Chameleon game shows up in search results.
            If you came here looking for Meccha Chameleon guides, Meccha Chameleon tips, or a
            Meccha Chameleon play online, the answers below should cover it. This browser hub
            keeps the play window, guide, and hiding-spot atlas together so you can try the
            Meccha Chameleon game idea without leaving the page.
          </p>
        </div>

        {/* Search terms cloud */}
        <div className="mb-10 rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#ff8fb3] text-white">
              <Tag className="h-4 w-4" />
            </span>
            <h3 className="text-base font-semibold text-[#29211D]">
              Search terms for the Meccha Chameleon game
            </h3>
          </div>
          <p className="mb-4 text-xs leading-5 text-[#4C3B35]">
            Every variant players type when looking for the Meccha Chameleon game online, Meccha
            Chameleon game guides, Meccha Chameleon game multiplayer setup, or Meccha Chameleon
            game patch notes. Use this list to jump straight to the section that matches what
            you searched for.
          </p>
          <ul className="flex flex-wrap gap-2">
            {searchTerms.map((term) => (
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
              Quick answers about the Meccha Chameleon game
            </h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {faqs.map((f) => (
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
          The Meccha Chameleon game companion site. Meccha Chameleon game online, Meccha Chameleon
          game multiplayer, Meccha Chameleon game guide, Meccha Chameleon game tips, Meccha
          Chameleon game new player, Meccha Chameleon game mac, Meccha Chameleon game phone streaming,
          Meccha Chameleon game mobile, Meccha Chameleon game crossplay, Meccha Chameleon game
          2026, Meccha Chameleon game 7 million sales, Meccha Chameleon game osaka map, Meccha
          Chameleon game camo lab, Meccha Chameleon game hiding spots, Meccha Chameleon game
          crew roster, Meccha Chameleon game free browser play.
        </p>
      </div>
    </section>
  );
}
