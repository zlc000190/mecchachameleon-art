import { Calendar, Sparkles, Wrench, PartyPopper } from 'lucide-react';

// Latest Meccha Chameleon updates + this site's own changelog.
// We render this statically so the landing page stays SSG-friendly
// (upstream news can come from a build-time fetch that lives in
// scripts/fetch-update-news.ts; see docs/maintenance.md).

type GameUpdate = {
  date: string;
  label: string;
  title: string;
  body: string;
  variant: 'feature' | 'fix' | 'milestone';
};

// Pinned to recent public update notes as of build time.
const gameUpdates: GameUpdate[] = [
  {
    date: '2026-06-22',
    label: '1.7.0',
    title: 'New map "Osaka" + report feature',
    body:
      'A Japan-themed map joins the rotation, plus a built-in player report flow. Discord link on the title screen is fixed.',
    variant: 'feature',
  },
  {
    date: '2026-06-22',
    label: '1.6.1',
    title: 'Cloud save and BGM fix',
    body:
      'Fixes the infinite-loading cloud save screen and a BGM regression that affected some players.',
    variant: 'fix',
  },
  {
    date: '2026-06-22',
    label: 'Milestone',
    title: '7 million copies sold',
    body:
      'LEMORION confirmed 7M units shipped. The Osaka map was teased alongside the announcement.',
    variant: 'milestone',
  },
  {
    date: '2026-06-21',
    label: '1.6.0',
    title: 'Hider size option + cloud save hardening',
    body:
      'Hiders can now be resized client-side, and the dev team added countermeasures for the recurring cloud save error.',
    variant: 'feature',
  },
  {
    date: '2026-06-21',
    label: '1.5.1',
    title: 'Re-spawn and clip fixes',
    body:
      'Already-found hiders no longer reappear mid-round, and seekers can no longer clip through unloaded maps to eliminate players.',
    variant: 'fix',
  },
];

type SiteUpdate = {
  date: string;
  title: string;
  body: string;
};

const siteUpdates: SiteUpdate[] = [
  {
    date: '2026-06-23',
    title: 'Atlas: 50+ hiding spot thumbnails on the home page',
    body:
      'Each map card now shows all 10 spot thumbnails inline (5x2 grid) so the home page surfaces every hiding spot at a glance.',
  },
  {
    date: '2026-06-23',
    title: 'Browser play: Meccha Chameleon entry',
    body:
      'The home page now opens with one Meccha Chameleon play entry and a simpler click-to-play action.',
  },
  {
    date: '2026-06-23',
    title: 'Logo + branding replaced',
    body:
      'The ShipAny default logo is gone. New macaron-color chameleon icon, preview image, and favicon are live.',
  },
  {
    date: '2026-06-23',
    title: 'Light mode is now the only mode',
    body:
      'Removed the dark/light theme switch. The site is always light to match the camo lab + map screenshots.',
  },
  {
    date: '2026-06-22',
    title: 'Initial Atlas import',
    body:
      'Claude imported 50 hiding-spot screenshots and wired 5 maps x 10 spots into the per-map pages with RGB, difficulty, and tip copy.',
  },
];

function variantIcon(v: GameUpdate['variant']) {
  if (v === 'fix') return <Wrench className="h-3.5 w-3.5" />;
  if (v === 'milestone') return <PartyPopper className="h-3.5 w-3.5" />;
  return <Sparkles className="h-3.5 w-3.5" />;
}

function variantClasses(v: GameUpdate['variant']) {
  if (v === 'fix')
    return 'border-[#AA776E]/40 bg-[#F4DCD0] text-[#7c2f1c]';
  if (v === 'milestone')
    return 'border-[#7D6D69]/40 bg-[#EFE2DA] text-[#5C3D33]';
  return 'border-[#7D6D69]/40 bg-[#EFE2DA] text-[#5C3D33]';
}

export function UpdatesSection() {
  return (
    <section
      id="updates"
      className="scroll-mt-28 border-b border-[#D8CFC6] bg-[#F6F0EA]"
    >
      <div className="container py-14">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7D6D69]">
              Latest updates
            </p>
            <h2 className="mt-1 text-2xl font-bold leading-tight text-[#29211D] md:text-3xl">
              What changed in the game, and on this site
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4C3B35]">
              We watch game updates and refresh the home page each time
              LEMORION ships a new version. Below: patch notes on the left,
              guide and atlas edits on the right.
            </p>
          </div>
          <a
            href="#search-answers"
            className="inline-flex min-h-10 w-fit items-center gap-1.5 rounded-md border border-[#D8CFC6] bg-white px-3 text-sm font-semibold text-[#29211D] transition hover:border-[#7D6D69]"
          >
            View updates
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Game updates */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#29211D]">
              <span className="inline-flex h-6 items-center rounded-sm bg-[#ff8fb3] px-2 text-[10px] font-bold uppercase tracking-wider text-white">
                Game
              </span>
              Patch notes
            </h3>
            <ol className="relative space-y-4 border-l-2 border-[#D8CFC6] pl-5">
              {gameUpdates.map((u) => (
                <li key={u.title} className="relative">
                  <span className="absolute -left-[27px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#7D6D69] ring-4 ring-[#F6F0EA]"></span>
                  <div className="rounded-md border border-[#D8CFC6] bg-white p-4 shadow-sm">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 text-[#4C3B35]">
                        <Calendar className="h-3 w-3" />
                        {u.date}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 font-semibold ${variantClasses(u.variant)}`}
                      >
                        {variantIcon(u.variant)}
                        {u.label}
                      </span>
                    </div>
                    <div className="text-sm font-semibold leading-5 text-[#29211D]">
                      {u.title}
                    </div>
                    <p className="mt-1 text-xs leading-5 text-[#4C3B35]">
                      {u.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Site updates */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#29211D]">
              <span className="inline-flex h-6 items-center rounded-sm bg-[#61a8ff] px-2 text-[10px] font-bold uppercase tracking-wider text-white">
                Site
              </span>
              Meccha Chameleon Play Online changelog
            </h3>
            <ol className="relative space-y-4 border-l-2 border-[#D8CFC6] pl-5">
              {siteUpdates.map((u) => (
                <li key={u.title} className="relative">
                  <span className="absolute -left-[27px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#AA776E] ring-4 ring-[#F6F0EA]"></span>
                  <div className="rounded-md border border-[#D8CFC6] bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2 text-xs text-[#4C3B35]">
                      <Calendar className="h-3 w-3" />
                      <span>{u.date}</span>
                    </div>
                    <p className="text-sm font-semibold leading-5 text-[#29211D]">
                      {u.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#4C3B35]">
                      {u.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
