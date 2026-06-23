'use client';

import { Globe, MapPin, MessageCircle, PartyPopper, Users, Wifi, Check, Copy, Share2, Twitter, Send, Trophy, UserPlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

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

type CrewMember = {
  name: string;
  platform: 'Steam' | 'Discord' | 'Mobile' | 'Other';
  invitedAt: string; // ISO
  status: 'invited' | 'joined' | 'ghosted';
  score: number; // for the leaderboard
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
    // localStorage full / disabled — silently ignore
  }
}

export function HowToPlaySection({ locale }: { locale: string }) {
  const getHref = (path: string) => (locale === 'en' ? path : `/${locale}${path}`);

  // Lazy init reads from localStorage on first client render. SSR sees []
  // and the effect-free hydrator below mirrors any state that arrived
  // between SSR markup and JS activation.
  const [crew, setCrew] = useState<CrewMember[]>(() => loadCrew());
  const [newName, setNewName] = useState('');
  const [newPlatform, setNewPlatform] = useState<CrewMember['platform']>('Steam');
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [shareState, setShareState] = useState<'idle' | 'shared' | 'unavailable'>('idle');

  useEffect(() => {
    if (crew.length > 0) saveCrew(crew);
  }, [crew]);

  const pageUrl = typeof window !== 'undefined' ? window.location.origin + '/#how-to-play' : 'https://mecchachameleon.art/#how-to-play';
  const shareText = 'I just found a clean Meccha Chameleon multiplayer walkthrough + a working browser demo. Open this in your Steam group chat:';

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
      await navigator.share({ title: 'Meccha Chameleon Art Lab', text: shareText, url: pageUrl });
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

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`;
  const redditUrl = `https://www.reddit.com/submit?title=${encodeURIComponent('Meccha Chameleon multiplayer walkthrough + browser demo')}&url=${encodeURIComponent(pageUrl)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + pageUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;

  const sortedCrew = [...crew].sort((a, b) => b.score - a.score);

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

        {/* YouTube embed — "with friends" gameplay video */}
        <div className="mb-12 overflow-hidden rounded-md border border-[#ded6c4] bg-[#151512]">
          <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_320px]">
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src="https://www.youtube-nocookie.com/embed/8GlZbl7rLjE?rel=0&modestbranding=1"
                title="Meccha Chameleon with Friends — playtest by VictimofGLaDOS"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <div className="flex flex-col justify-between gap-4 bg-[#1a1a1a] p-5 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#7ed0b4]">
                  Watch before you play
                </p>
                <h3 className="mt-2 text-lg font-semibold leading-snug">
                  Meccha Chameleon with Friends — 14 minute playtest
                </h3>
                <p className="mt-2 text-sm leading-5 text-white/70">
                  VictimofGLaDOS runs a full custom-room night with a Discord crew. The first 3
                  minutes alone cover every multiplayer rule on this page. We picked this clip
                  because it is the most realistic representation of what a friend group will
                  actually see on round one.
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 text-xs text-white/60">
                <span>1.3M views · 4 weeks ago · YouTube</span>
                <a
                  href="https://www.youtube.com/watch?v=8GlZbl7rLjE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-white/5 px-2.5 py-1.5 text-white transition hover:bg-white/10"
                >
                  Open on YouTube
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Share + crew roster */}
        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          {/* Share block */}
          <div className="rounded-md border border-[#287c63]/30 bg-[#e6f3ec] p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#287c63] text-white">
                <Share2 className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-[#151512]">Send this to your crew</h3>
                <p className="text-xs text-[#5d584b]">
                  Pick the platform your friend group already lives on. No login, no signup — one tap
                  and the link is in their DM.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#151512] px-3 text-sm font-semibold text-white transition hover:bg-[#2a2a26]"
              >
                <Twitter className="h-4 w-4" /> X / Twitter
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#25D366] px-3 text-sm font-semibold text-white transition hover:bg-[#1eb257]"
              >
                <Send className="h-4 w-4" /> WhatsApp
              </a>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#26A5E4] px-3 text-sm font-semibold text-white transition hover:bg-[#1b8ec7]"
              >
                <Send className="h-4 w-4" /> Telegram
              </a>
              <a
                href={redditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#FF4500] px-3 text-sm font-semibold text-white transition hover:bg-[#e63d00]"
              >
                <MessageCircle className="h-4 w-4" /> Reddit
              </a>
              <button
                type="button"
                onClick={handleNativeShare}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#151512] bg-white px-3 text-sm font-semibold text-[#151512] transition hover:bg-[#ece5d8]"
              >
                <Share2 className="h-4 w-4" />
                {shareState === 'shared' ? 'Shared!' : shareState === 'unavailable' ? 'Not supported' : 'Native share'}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#287c63] bg-white px-3 text-sm font-semibold text-[#287c63] transition hover:bg-[#d8efe5]"
              >
                {copyState === 'copied' ? (
                  <>
                    <Check className="h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy link
                  </>
                )}
              </button>
            </div>

            <p className="mt-4 text-xs text-[#5d584b]">
              <strong className="text-[#151512]">Why a share button?</strong> A Custom Room is only
              fun with at least 4 friends. Dropping the link in your group chat with a one-line
              &quot;we should try this tonight&quot; converts 3x better than a Steam store link
              alone — Mechameleon sells itself once one person in the chat has played a round.
            </p>
          </div>

          {/* Crew roster */}
          <div className="rounded-md border border-[#ded6c4] bg-[#f6f3ea] p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#151512] text-white">
                <Trophy className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-[#151512]">Crew roster + invite scoreboard</h3>
                <p className="text-xs text-[#5d584b]">
                  Track who you invited, who actually showed up, and who is carrying the scoreboard.
                  Stored in this browser only — no account, no server.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddCrew} className="mb-3 grid gap-2 sm:grid-cols-[1fr_120px_auto]">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Friend's name or handle"
                maxLength={32}
                className="rounded-md border border-[#ded6c4] bg-white px-3 py-2 text-sm text-[#151512] placeholder:text-[#5d584b]/60 focus:border-[#287c63] focus:outline-none"
              />
              <select
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value as CrewMember['platform'])}
                className="rounded-md border border-[#ded6c4] bg-white px-3 py-2 text-sm text-[#151512] focus:border-[#287c63] focus:outline-none"
              >
                <option value="Steam">Steam</option>
                <option value="Discord">Discord</option>
                <option value="Mobile">Mobile</option>
                <option value="Other">Other</option>
              </select>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#287c63] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f664f]"
              >
                <UserPlus className="h-4 w-4" />
                Add
              </button>
            </form>

            {sortedCrew.length === 0 ? (
              <p className="rounded-md border border-dashed border-[#ded6c4] bg-white/50 p-4 text-center text-xs text-[#5d584b]">
                No crew yet. Add the names of the friends you plan to bring into a Custom Room.
                Invited people get a +1 when they accept, +5 when they carry a round.
              </p>
            ) : (
              <ol className="space-y-2">
                {sortedCrew.map((c, i) => (
                  <li
                    key={c.name}
                    className="flex items-center justify-between gap-3 rounded-md border border-[#ded6c4] bg-white p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#151512] text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-[#151512]">
                          {c.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#5d584b]">
                          <span>{c.platform}</span>
                          <span aria-hidden>·</span>
                          <span>
                            {new Date(c.invitedAt).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={c.status}
                        onChange={(e) => setStatus(c.name, e.target.value as CrewMember['status'])}
                        className="rounded-sm border border-[#ded6c4] bg-white px-1.5 py-1 text-xs"
                        aria-label={`${c.name} status`}
                      >
                        <option value="invited">Invited</option>
                        <option value="joined">Joined</option>
                        <option value="ghosted">Ghosted</option>
                      </select>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => bumpScore(c.name, -1)}
                          className="rounded-sm border border-[#ded6c4] bg-white px-2 py-1 text-xs hover:bg-[#f6f3ea]"
                          aria-label={`Decrease ${c.name} score`}
                        >
                          −
                        </button>
                        <span className="min-w-7 text-center text-sm font-bold text-[#287c63]">
                          {c.score}
                        </span>
                        <button
                          type="button"
                          onClick={() => bumpScore(c.name, 1)}
                          className="rounded-sm border border-[#ded6c4] bg-white px-2 py-1 text-xs hover:bg-[#f6f3ea]"
                          aria-label={`Increase ${c.name} score`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCrew(c.name)}
                        className="rounded-sm p-1 text-[#5d584b] hover:bg-[#f6f3ea] hover:text-[#c45b38]"
                        aria-label={`Remove ${c.name}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-3 text-xs text-[#5d584b]">
              Tip: keep score honestly. The whole point of the party game is to find who is the
              worst hider in the group and then dunk on them in chat for the rest of the week.
            </p>
          </div>
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
