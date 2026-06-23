import { Globe, MapPin, MessageCircle, PartyPopper, Users, Wifi } from 'lucide-react';

type Step = {
  title: string;
  body: string;
  bullets: string[];
};

const steps: Step[] = [
  {
    title: 'Same room, same Wi-Fi',
    body:
      'Easiest setup of all: one of you hosts a Custom Room in Steam, the rest join through Steam friends. No firewall fiddling, no port forwarding — Steam handles the relay and latency stays under 30 ms on a normal home network.',
    bullets: [
      'Host opens Meccha Chameleon on Steam and picks Custom Room.',
      'Friends list auto-sync — invite up to 9 friends directly from the Steam overlay (Shift+Tab).',
      'Voice chat through Discord or in-game push-to-talk so seekers can call coordinates.',
    ],
  },
  {
    title: 'Different house, same country',
    body:
      'Custom Rooms route over Steam relay servers, so your friends across town or across the country can join without you opening any ports. The default relay is fine for casual matches; if anyone is on a corporate network that blocks Steam, ask them to switch to mobile hotspot.',
    bullets: [
      'Host region: closest relay server is auto-picked (Hong Kong, Tokyo, Singapore for Asia; Frankfurt, Amsterdam, Virginia for EU/NA).',
      'Latency budget: under 80 ms feels great, up to 140 ms is still playable.',
      'Avoid hosting from a VPN exit node — Steam sees the VPN IP and may pick a far relay.',
    ],
  },
  {
    title: 'Different continent',
    body:
      'For long-distance crews, set Steam to use a relay in the midpoint between host and friends. Custom Rooms always use Steam relay, never direct IP, so NATs are not a problem. If lag spikes appear mid-round it is almost always ISP routing, not the game itself.',
    bullets: [
      'Have one person in each region check the ping on the Steam server list — the host picks the lowest combined ping.',
      'Use the in-game ping overlay (Settings → Display → Network Stats) to confirm it is the network and not your local Wi-Fi.',
      'Discord "Together" / Watch Party works for voice but the match itself runs on Steam, not Discord.',
    ],
  },
  {
    title: 'Matchmaking with strangers',
    body:
      'Public matchmaking is the lowest-friction way to play — drop in, get matched with 2-9 other players, paint, hide, hunt. Most public lobbies lean casual; veteran paint-hiders usually cluster in Custom Rooms via Discord servers.',
    bullets: [
      'Recommended 2-10 players per match. Up to 24 is supported but the maps get crowded.',
      'Set your language preference in Steam → Friends → Language. The matchmaker uses it as a soft tie-breaker.',
      'For ranked / sweaty lobbies, the r/MechaChameleon Discord has region-specific channels with custom-room codes.',
    ],
  },
  {
    title: 'Streaming and watch parties',
    body:
      'Meccha Chameleon is one of the cleanest party games to stream. The painting phase and the seek phase are both visually distinct, so chat has natural cut-in points. OBS, Streamlabs, and Twitch all work without extra plugins.',
    bullets: [
      'OBS game-capture at 1080p/60 works on any GPU that launched after 2018.',
      'The Reveal phase makes for instant clip moments — set up a Twitch clip keyboard shortcut before you start painting.',
      'Streamers: turn on "Hide Hider Names" in the lobby so chat cannot snipe your friends in the open tabs.',
    ],
  },
  {
    title: 'Cross-platform and family play',
    body:
      'Meccha Chameleon is PC-only on Steam, so there is no console or mobile port to worry about crossplay with. But you can absolutely include a younger sibling or a less-technical friend — the in-game paint tool is the entire skill floor.',
    bullets: [
      'No native Mac client. Mac players join through Crossover, Whisky / Game Porting Toolkit, or Parallels. The Steam page links a step-by-step Mac guide.',
      'No mobile port. For "phone-in-hand while PC plays" use Steam Link, Moonlight, or Sunshine — the in-game UI scales fine on touch.',
      'Family-friendly: no chat filter required, all lobbies default to push-to-talk, and the Steam family sharing plan works for siblings in the same household.',
    ],
  },
];

const modes = [
  {
    name: 'Classic Hide & Seek',
    icon: Users,
    players: '2 - 24',
    body:
      'Hiders paint and freeze. Seekers hunt. Last hider standing wins. Best mode to teach the paint tool.',
  },
  {
    name: 'Infection',
    icon: PartyPopper,
    players: '4 - 12',
    body:
      'When you are found you become a seeker. Tension builds round after round — last uninfected hider wins.',
  },
  {
    name: 'Speed Hunt',
    icon: MapPin,
    players: '3 - 8',
    body:
      'All hiders paint in parallel, then seekers race to scan every camera angle. Fastest scanner wins.',
  },
  {
    name: 'Custom Rooms',
    icon: Globe,
    players: '2 - 24',
    body:
      'Private lobby. Adjust time limits, switch maps, ban certain roles. The only mode that survives 4-hour group sessions.',
  },
];

export function HowToPlaySection({ locale }: { locale: string }) {
  const getHref = (path: string) => (locale === 'en' ? path : `/${locale}${path}`);

  return (
    <section
      id="how-to-play"
      className="scroll-mt-28 border-b border-[#ded6c4] bg-white"
    >
      <div className="container py-16">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#287c63]">
            Multiplayer
          </p>
          <h2 className="mt-1 text-2xl font-bold leading-tight text-[#151512] md:text-3xl">
            How to actually get a group into the same round
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#5d584b]">
            Meccha Chameleon is a party game, not a single-player puzzle — half the fun is hunting
            someone you can actually call on Discord. Below is the playbook we use for friend groups,
            long-distance crews, and the random matchmaking queue. The official beginner guide has the
            full step-by-step on the in-game controls.
          </p>
        </div>

        {/* 4 game modes */}
        <div className="mb-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <div
                key={mode.name}
                className="flex h-full flex-col rounded-md border border-[#ded6c4] bg-[#f6f3ea] p-5"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#151512] text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-[#151512]">{mode.name}</h3>
                <p className="mt-1 text-xs font-semibold text-[#287c63]">{mode.players} players</p>
                <p className="mt-2 text-xs leading-5 text-[#5d584b]">{mode.body}</p>
              </div>
            );
          })}
        </div>

        {/* 6 how-to scenarios */}
        <div className="grid gap-6 lg:grid-cols-2">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="rounded-md border border-[#ded6c4] bg-[#f6f3ea] p-6"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#287c63] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="text-base font-semibold text-[#151512]">{step.title}</h3>
              </div>
              <p className="text-sm leading-6 text-[#5d584b]">{step.body}</p>
              <ul className="mt-4 space-y-2 text-xs leading-5 text-[#5d584b]">
                {step.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#287c63]" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-start gap-4 rounded-md border border-[#ded6c4] bg-[#f6f3ea] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#151512] text-white">
              <Wifi className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#151512]">
                Need a full beginner walkthrough before you queue up?
              </p>
              <p className="text-xs text-[#5d584b]">
                Controls, paint tool, role guides, and the first-match checklist — all on one page.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={getHref('/new-player')}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-[#151512] px-4 text-sm font-semibold text-white transition hover:bg-[#2a2a26]"
            >
              <MessageCircle className="h-4 w-4" />
              New player guide
            </a>
            <a
              href="https://store.steampowered.com/app/4704690/MECCHA_CHAMELEON/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-[#151512] bg-white px-4 text-sm font-semibold text-[#151512] transition hover:border-[#287c63] hover:text-[#287c63]"
            >
              Buy on Steam
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
