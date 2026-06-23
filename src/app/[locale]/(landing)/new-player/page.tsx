import { ArrowLeft, CheckCircle2, Clock, Compass, Cpu, Gamepad2, Lightbulb, Palette, PartyPopper, Search, Sparkles, Target, Timer, Users, XCircle, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

const steamUrl = 'https://store.steampowered.com/app/4704690/MECCHA_CHAMELEON/';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const title = 'Meccha Chameleon New Player Guide — 10-min Walkthrough';
  const description =
    'Meccha Chameleon beginner walkthrough in 10 minutes: controls, paint tool, role guide, first-match checklist, and 8 rookie mistakes to avoid in round one.';
  return {
    metadataBase: new URL('https://mecchachameleon.art'),
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

const quickStart = [
  {
    step: '01',
    icon: Cpu,
    title: 'Install in 4 minutes',
    body:
      'Buy on Steam for $5.99 (no microtransactions, no subscription). Steam downloads the client, which is under 1.5 GB. The launcher is your standard Steam overlay.',
    detail:
      'System requirements are modest: any 4-core CPU after 2015 and a GPU with 2 GB VRAM. The game does not use ray tracing or DLSS, so even a 2018 integrated GPU runs it on Medium.',
  },
  {
    step: '02',
    icon: Gamepad2,
    title: 'Boot up and finish the tutorial',
    body:
      'The first launch drops you into a 6-minute interactive tutorial. It walks the paint tool, the pose lock, the seek scan, and one full round. Skip the optional Discord invite — the in-game voice works fine.',
    detail:
      'Pay attention to the "Parallax" demo at minute 4. It is the single mechanic that separates good hiders from great ones, and the game only shows it once.',
  },
  {
    step: '03',
    icon: Users,
    title: 'Join a public lobby first',
    body:
      'Click Multiplayer → Quick Match. The matchmaker drops you into a 6-8 player Classic Hide & Seek round. There is no skill rating on public lobbies, so nobody will be upset if you paint yourself neon orange in round one.',
    detail:
      'Public lobbies default to push-to-talk voice. If you prefer quiet, hit F8 in the lobby to mute yourself — chat is opt-in, not opt-out.',
  },
];

const controls = [
  { key: 'WASD', action: 'Move' },
  { key: 'Mouse', action: 'Aim paint brush' },
  { key: 'LMB', action: 'Paint (hold for thicker stroke)' },
  { key: 'RMB', action: 'Eyedropper — sample color from environment' },
  { key: 'Shift', action: 'Crouch / lower silhouette' },
  { key: 'Ctrl', action: 'Pose lock — freeze in place' },
  { key: 'R', action: 'Reset paint (clears the canvas)' },
  { key: 'F', action: 'Toggle flashlight as seeker' },
  { key: 'Tab', action: 'Scoreboard' },
  { key: 'F8', action: 'Mute / unmute mic' },
];

const roles = [
  {
    title: 'Hider',
    icon: Palette,
    color: 'bg-[#287c63] text-white',
    body:
      'You get 45-90 seconds (depending on map and rule) to paint your character to match a chosen surface. Once the phase ends, you cannot move. Seekers then scan the map for 2-4 minutes.',
    tips: [
      'Pick a spot before you start painting — samples from a moving target throw off the color match.',
      'Use 3+ colors. A flat-color hider reads as a flat-color shape against a textured wall.',
      'Pose lock is your friend. Even one pixel of motion will give you away.',
    ],
  },
  {
    title: 'Seeker',
    icon: Search,
    color: 'bg-[#c45b38] text-white',
    body:
      'You run, jump, crouch, and use the flashlight to scan every surface. Each found hider is converted into a point for the seeker team. You can ping a suspect for your teammates with the middle mouse button.',
    tips: [
      'Walk, do not run. Aiming the flashlight while sprinting makes the cone wobble.',
      'Parallax: side-step a few meters and re-scan. A hider painted from one angle may look like scenery from another.',
      'Trash first. The default scan zone for most new seekers is corners, dark spots, and behind objects. Look in plain sight.',
    ],
  },
];

const firstMatch = [
  { time: '00:00', label: 'Round start', body: 'Lobby assigns roles. You will see either "Hider" or "Seeker" in the top bar.' },
  { time: '00:10', label: 'Map vote (Custom Rooms only)', body: 'Public matchmaking skips this. Custom Rooms let the host pick from 5 stock maps + workshop.' },
  { time: '00:30', label: 'Hiding phase', body: 'Hiders spawn and the timer starts. Seekers wait in a sealed lobby. You have 60-90 seconds to walk to a spot and paint it.' },
  { time: '02:00', label: 'Lock in', body: 'A chime signals paint phase is over. Hiders are pose-locked. A countdown from 5 begins for seekers.' },
  { time: '02:10', label: 'Seeking phase', body: 'Seekers spawn. Their flashlight turns on. The round timer (default 2:30) starts.' },
  { time: '04:40', label: 'Round end', body: 'Any hiders still standing score. In Classic, the round resets. In Speed Hunt, scores accumulate.' },
];

const proTips = [
  {
    icon: Palette,
    title: 'Sample multiple colors from the same surface',
    body:
      'Walls are not one color. A "white" wall has at least four shades depending on the light. Sample 3-5 spots around you and blend them with a soft brush.',
  },
  {
    icon: Target,
    title: 'Hide in plain sight',
    body:
      'Seekers check corners, behind objects, and dark spots first. The middle of an open patterned surface (wallpaper, brick, tile) is paradoxically the safest place.',
  },
  {
    icon: Zap,
    title: 'Mind the parallax',
    body:
      'Both as hider and seeker. As a hider, rotate so your best-painted side faces the most common camera path. As a seeker, side-step 1-2 meters before declaring a wall clean.',
  },
  {
    icon: Timer,
    title: 'Stay completely still after painting',
    body:
      'Movement is the single biggest give-away. A perfectly painted chameleon that takes one step at second 50 will be caught. Pose-lock the moment you finish painting.',
  },
  {
    icon: Compass,
    title: 'Hide at eye level or above',
    body:
      'Most players default to scanning at eye level. Shelves, ledges, ceiling fixtures, and objects on the wall are statistically safer than floor-level crouches.',
  },
  {
    icon: Lightbulb,
    title: 'Match the metallic slider',
    body:
      'The paint tool has a metallic / roughness slider. Walls are matte. Metal fixtures are glossy. Use it. A matte-only paint job on a brass lamp gets spotted in two seconds.',
  },
];

const mistakes = [
  { bad: 'One solid color is enough.', good: 'Sample 3+ colors from your hiding surface and blend them.' },
  { bad: 'The corner is the safest spot.', good: 'Hide in open areas — corners are the first things checked.' },
  { bad: 'Keep adjusting my position after painting.', good: 'Stay completely still the moment you lock in.' },
  { bad: 'Dark areas are invisible.', good: 'Seekers check dark spots first — moderate light is safer.' },
  { bad: 'Skip the metallic slider.', good: 'Match the surface roughness and metallic with the slider.' },
  { bad: 'Any angle works fine.', good: 'Rotate so your best-painted side faces the most-likely camera path.' },
  { bad: 'Scan quickly as a seeker.', good: 'Side-step 1-2 meters and re-scan — parallax reveals flat-color hiders.' },
  { bad: 'Paint during the hiding phase only.', good: 'Memorize the surface colors before the round starts, then paint fast.' },
];

const faqs = [
  {
    q: 'Can I play with friends in a different country?',
    a:
      'Yes. Custom Rooms route over Steam relay servers. Pick the relay closest to the median location of your group and you will get sub-150 ms latency. For example, a Tokyo-Sydney-Sao Paulo group should use the Singapore relay.',
  },
  {
    q: 'Is there crossplay with console?',
    a:
      'No. Meccha Chameleon is PC-only on Steam. There is no PlayStation, Xbox, or Switch version announced. If you want to play on a phone, use Steam Link or Moonlight to stream from your PC.',
  },
  {
    q: 'How long does a single round take?',
    a:
      'Classic: 4-5 minutes including the lobby wait. Infection: 3-4 minutes per round, 3-5 rounds. Speed Hunt: 2-3 minutes per match. Custom Rooms can be stretched to 8 minutes for streamer-friendly pacing.',
  },
  {
    q: 'Do I need a powerful PC?',
    a:
      'No. The game has modest requirements: 4-core CPU, 2 GB VRAM GPU, 8 GB RAM. Integrated graphics on a 2018 laptop run it on Medium. The first launch is heavier than gameplay because the shader cache compiles.',
  },
  {
    q: 'Can I play on Mac?',
    a:
      'There is no native Mac client. Mac players join through Crossover, Whisky / Game Porting Toolkit, or Parallels. The Steam community has a maintained Mac guide that walks the Crossover install in about 20 minutes.',
  },
  {
    q: 'Is the Steam Workshop worth it?',
    a:
      'For longevity, yes. After 1.2.0 the Workshop has 200+ custom maps. The top-rated ones add maps that the official rotation does not have: hospital, cruise ship, abandoned mall, etc. Steam integration is one-click install.',
  },
  {
    q: 'What is the player count sweet spot?',
    a:
      '8 players is the most fun. 2-4 is too easy for the seekers. 24 is chaos — fine for streamers, bad for first-timers. The developer recommends 2-10 in the Steam listing and we agree.',
  },
];

export default async function NewPlayerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const backHref = locale === 'en' ? '/#new-player' : `/${locale}/#new-player`;
  const atHowToPlay = locale === 'en' ? '/#how-to-play' : `/${locale}/#how-to-play`;

  return (
    <main className="min-h-screen bg-white text-[#151512]">
      {/* Hero */}
      <section className="border-b border-[#ded6c4] bg-[#f6f3ea]">
        <div className="container py-14">
          <a
            href={backHref}
            className="mb-6 inline-flex min-h-10 items-center gap-1.5 rounded-md border border-[#ded6c4] bg-white px-3 text-sm font-semibold text-[#151512] transition hover:border-[#287c63]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </a>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#287c63]">
            Beginner walkthrough
          </p>
          <h1 className="mt-1 text-3xl font-bold leading-tight md:text-4xl">
            New to Meccha Chameleon? Read this in 10 minutes.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5d584b]">
            A complete first-match walkthrough. Controls, paint tool, role responsibilities, and the
            eight mistakes that get you caught in 30 seconds — all on one page. No fluff, no
            marketing. Written for a player who has never launched the game.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-[#5d584b]">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-[#ded6c4] bg-white px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 text-[#287c63]" /> 10 min read
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-[#ded6c4] bg-white px-3 py-1.5">
              <Gamepad2 className="h-3.5 w-3.5 text-[#287c63]" /> Beginner
            </span>
            <a
              href={steamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#151512] bg-[#151512] px-3 py-1.5 text-white transition hover:bg-[#2a2a26]"
            >
              Buy on Steam — $5.99
            </a>
          </div>
        </div>
      </section>

      {/* Quick start */}
      <section className="border-b border-[#ded6c4] bg-white">
        <div className="container py-14">
          <h2 className="text-2xl font-bold leading-tight md:text-3xl">Quick start: from install to first round</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5d584b]">
            Three steps. Twenty minutes. You will have played a full match and understood every
            mechanic the game shows you in the first session.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {quickStart.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="flex flex-col rounded-md border border-[#ded6c4] bg-[#f6f3ea] p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-2xl font-bold text-[#287c63]">{s.step}</span>
                    <Icon className="h-5 w-5 text-[#5d584b]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#151512]">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5d584b]">{s.body}</p>
                  <p className="mt-3 text-xs leading-5 text-[#5d584b] opacity-80">{s.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="border-b border-[#ded6c4] bg-[#f6f3ea]">
        <div className="container py-14">
          <h2 className="text-2xl font-bold leading-tight md:text-3xl">Controls cheat sheet</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5d584b]">
            Print this. Stick it next to your monitor for the first three matches. By the fourth you
            will not need it.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {controls.map((c) => (
              <div key={c.key} className="rounded-md border border-[#ded6c4] bg-white p-4">
                <kbd className="rounded-sm bg-[#151512] px-2 py-1 font-mono text-xs font-bold text-white">
                  {c.key}
                </kbd>
                <p className="mt-2 text-xs leading-5 text-[#5d584b]">{c.action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="border-b border-[#ded6c4] bg-white">
        <div className="container py-14">
          <h2 className="text-2xl font-bold leading-tight md:text-3xl">Roles: what you do as a Hider vs. Seeker</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5d584b]">
            Each round assigns you one of two roles. Hiders paint and freeze; Seekers scan and find.
            The role balance is 70/30 in Classic — 7 hiders, 3 seekers for an 8-player lobby.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.title} className="rounded-md border border-[#ded6c4] bg-[#f6f3ea] p-6">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-md ${r.color}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-xl font-bold">{r.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[#5d584b]">{r.body}</p>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-[#5d584b]">
                    {r.tips.map((t) => (
                      <li key={t} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#287c63]" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* First match timeline */}
      <section className="border-b border-[#ded6c4] bg-[#16211e] text-white">
        <div className="container py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7ed0b4]">First match</p>
          <h2 className="mt-1 text-2xl font-bold leading-tight md:text-3xl">
            What a single round actually looks like, minute by minute
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
            A 5-minute walkthrough of one Classic Hide &amp; Seek round. Use this to set expectations
            before your first public matchmaking queue.
          </p>
          <ol className="mt-8 space-y-4">
            {firstMatch.map((m, i) => (
              <li key={m.label} className="flex gap-4 rounded-md border border-white/10 bg-white/5 p-4">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7ed0b4] text-sm font-bold text-[#16211e]">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="rounded-sm bg-white/10 px-2 py-0.5 font-mono font-semibold">
                      {m.time}
                    </span>
                    <span className="font-semibold">{m.label}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-white/80">{m.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pro tips */}
      <section className="border-b border-[#ded6c4] bg-white">
        <div className="container py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#287c63]">Pro tips</p>
          <h2 className="mt-1 text-2xl font-bold leading-tight md:text-3xl">
            Six tips that instantly improve your game
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {proTips.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.title} className="rounded-md border border-[#ded6c4] bg-[#f6f3ea] p-5">
                  <Icon className="h-5 w-5 text-[#287c63]" />
                  <h3 className="mt-3 text-base font-semibold text-[#151512]">{t.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5d584b]">{t.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8 Rookie Mistakes */}
      <section className="border-b border-[#ded6c4] bg-[#f6f3ea]">
        <div className="container py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c45b38]">Rookie mistakes</p>
          <h2 className="mt-1 text-2xl font-bold leading-tight md:text-3xl">
            Don&apos;t make these 8 mistakes — they get you caught in 30 seconds
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {mistakes.map((m, i) => (
              <div key={i} className="rounded-md border border-[#ded6c4] bg-white p-5">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#c45b38]">
                  <XCircle className="h-4 w-4" />
                  The mistake
                </div>
                <p className="text-sm leading-6 text-[#5d584b] line-through opacity-70">{m.bad}</p>
                <div className="my-3 border-t border-dashed border-[#ded6c4]" />
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#287c63]">
                  <CheckCircle2 className="h-4 w-4" />
                  What to do instead
                </div>
                <p className="text-sm leading-6 text-[#151512]">{m.good}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-[#ded6c4] bg-white">
        <div className="container py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#287c63]">FAQ</p>
          <h2 className="mt-1 text-2xl font-bold leading-tight md:text-3xl">
            New player questions, answered
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="group rounded-md border border-[#ded6c4] bg-[#f6f3ea] p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-[#151512]">
                  {f.q}
                  <span className="ml-auto text-[#287c63] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-[#5d584b]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-link to multiplayer + CTA */}
      <section className="bg-[#f6f3ea]">
        <div className="container flex flex-col items-start gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#151512] text-white">
              <PartyPopper className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-[#151512]">Ready to actually queue up?</h3>
              <p className="mt-1 max-w-xl text-sm leading-6 text-[#5d584b]">
                Now that you know the controls and the round structure, read the multiplayer playbook
                for how to get a friend group — local, long-distance, or matchmaking — into the
                same lobby.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={atHowToPlay}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-[#151512] px-4 text-sm font-semibold text-white transition hover:bg-[#2a2a26]"
            >
              <Sparkles className="h-4 w-4" />
              Multiplayer playbook
            </a>
            <a
              href={steamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-[#151512] bg-white px-4 text-sm font-semibold text-[#151512] transition hover:border-[#287c63] hover:text-[#287c63]"
            >
              Buy on Steam
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
