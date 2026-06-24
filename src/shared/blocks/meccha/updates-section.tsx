import { Calendar, ExternalLink, Sparkles, Wrench, PartyPopper } from 'lucide-react';

// Latest Meccha Chameleon Steam updates + this site's own changelog.
// We render this statically so the landing page stays SSG-friendly
// (Steam news comes from a build-time fetch that lives in
// scripts/fetch-steam-news.ts; see docs/maintenance.md).

type SteamUpdate = {
  date: string;
  label: string;
  title: string;
  body: string;
  href: string;
  variant: 'feature' | 'fix' | 'milestone';
};

// Pinned to recent Steam community posts as of build time.
const steamUpdates: SteamUpdate[] = [
  {
    date: '2026-06-22',
    label: '1.7.0',
    title: 'New map "Osaka" + report feature',
    body:
      'A Japan-themed map joins the rotation, plus a built-in player report flow. Discord link on the title screen is fixed.',
    href: 'https://store.steampowered.com/news/app/4704690',
    variant: 'feature',
  },
  {
    date: '2026-06-22',
    label: '1.6.1',
    title: 'Cloud save and BGM fix',
    body:
      'Fixes the infinite-loading cloud save screen and a BGM regression that affected some players.',
    href: 'https://store.steampowered.com/news/app/4704690',
    variant: 'fix',
  },
  {
    date: '2026-06-22',
    label: 'Milestone',
    title: '7 million copies sold',
    body:
      'LEMORION confirmed 7M units shipped on Steam. The Osaka map was teased alongside the announcement.',
    href: 'https://store.steampowered.com/news/app/4704690',
    variant: 'milestone',
  },
  {
    date: '2026-06-21',
    label: '1.6.0',
    title: 'Hider size option + cloud save hardening',
    body:
      'Hiders can now be resized client-side, and the dev team added countermeasures for the recurring cloud save error.',
    href: 'https://store.steampowered.com/news/app/4704690',
    variant: 'feature',
  },
  {
    date: '2026-06-21',
    label: '1.5.1',
    title: 'Re-spawn and clip fixes',
    body:
      'Already-found hiders no longer reappear mid-round, and seekers can no longer clip through unloaded maps to eliminate players.',
    href: 'https://store.steampowered.com/news/app/4704690',
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
    title: 'Browser play: Find It / Hidden Objects / Hard',
    body:
      'Replaced unstable embedded games with a cleaner selector and a more reliable default game source.',
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
      'Claude imported 50 hiding-spot screenshots from the Steam game and wired 5 maps x 10 spots into the per-map pages with RGB, difficulty, and tip copy.',
  },
];

function variantIcon(v: SteamUpdate['variant']) {
  if (v === 'fix') return <Wrench className="h-3.5 w-3.5" />;
  if (v === 'milestone') return <PartyPopper className="h-3.5 w-3.5" />;
  return <Sparkles className="h-3.5 w-3.5" />;
}

function variantClasses(v: SteamUpdate['variant']) {
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
              We watch the Steam community announcements and refresh the home
              page each time LEMORION ships a new version. Below: Steam
              patches on the left, guide and atlas edits on the right.
            </p>
          </div>
          <a
            href="https://store.steampowered.com/news/app/4704690"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 w-fit items-center gap-1.5 rounded-md border border-[#D8CFC6] bg-white px-3 text-sm font-semibold text-[#29211D] transition hover:border-[#7D6D69]"
          >
            Full Steam news
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Steam updates */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#29211D]">
              <span className="inline-flex h-6 items-center rounded-sm bg-[#ff8fb3] px-2 text-[10px] font-bold uppercase tracking-wider text-white">
                Steam
              </span>
              Steam patch notes
            </h3>
            <ol className="relative space-y-4 border-l-2 border-[#D8CFC6] pl-5">
              {steamUpdates.map((u) => (
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
                    <a
                      href={u.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold leading-5 text-[#29211D] hover:text-[#7D6D69]"
                    >
                      {u.title}
                    </a>
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
