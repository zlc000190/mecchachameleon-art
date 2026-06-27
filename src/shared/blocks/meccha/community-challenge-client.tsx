'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Heart, ImagePlus, Loader2, Plus, UploadCloud } from 'lucide-react';

import type { AtlasMap } from '@/shared/blocks/meccha/atlas-data';
import {
  COMMUNITY_MAX_IMAGES_PER_CHALLENGE,
  COMMUNITY_R2_PUBLIC_DOMAIN,
  ownerTokenStorageKey,
  type CommunityChallenge,
} from '@/shared/blocks/meccha/community-challenges';

type RuntimeStatus = {
  kvConfigured: boolean;
  r2Configured: boolean;
  kvNamespaceName: string;
  r2Bucket: string;
  r2PublicDomain: string;
};

type SubmitResult = {
  ok: boolean;
  challenge?: CommunityChallenge & { ownerToken?: string };
  ownerToken?: string;
  error?: string;
};

export function CommunityChallengeClient({
  maps,
  galleryPath,
}: {
  maps: AtlasMap[];
  locale: string;
  galleryPath: string;
}) {
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);
  const [runtime, setRuntime] = useState<RuntimeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [extraImageCount, setExtraImageCount] = useState(0);
  const [includeStory, setIncludeStory] = useState(false);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  async function loadChallenges() {
    setLoading(true);
    const response = await fetch('/api/community/challenges', { cache: 'no-store' });
    const data = await response.json();
    setChallenges(data.challenges || []);
    setRuntime(data.runtime || null);
    setLoading(false);
  }

  useEffect(() => {
    loadChallenges().catch(() => {
      setMessage('Could not load community challenges. The demo card is still visible on the homepage.');
      setLoading(false);
    });
  }, []);

  const topChallenge = useMemo(() => challenges[0], [challenges]);

  async function submitChallenge(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/community/challenges', {
        method: 'POST',
        body: formData,
      });
      const data: SubmitResult = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Submission failed');
      }
      if (data.challenge?.id && data.ownerToken) {
        try {
          window.localStorage.setItem(
            ownerTokenStorageKey(data.challenge.id),
            data.ownerToken,
          );
        } catch {
          // localStorage may be disabled; the user can still see the token in this success message.
        }
      }
      setMessage(
        `Challenge submitted. Your owner token: ${data.ownerToken ?? '(none)'} — save it to edit your story later.`,
      );
      form.reset();
      setExtraImageCount(0);
      setIncludeStory(false);
      await loadChallenges();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function likeChallenge(id: string) {
    setLikedIds((prev) => ({ ...prev, [id]: true }));
    setChallenges((prev) => prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item)));
    try {
      await fetch(`/api/community/challenges/${id}?action=like`, { method: 'POST' });
    } catch {
      // Likes are intentionally lightweight for the demo; keep optimistic UI.
    }
  }

  const maxExtras = Math.max(0, COMMUNITY_MAX_IMAGES_PER_CHALLENGE - 1);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-[#E8D7CC] bg-white p-5 shadow-sm md:p-7">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#FFF1CC] px-3 py-1 text-sm font-bold text-[#29211D]">
          <ImagePlus className="h-4 w-4" />
          Submit your hiding win
        </div>
        <h2 className="text-3xl font-black tracking-tight text-[#29211D]">Upload a 30-minute hiding challenge</h2>
        <p className="mt-3 text-sm leading-6 text-[#4C3B35]">
          Pick the map, upload one or more Meccha Chameleon screenshots, and tell players why this hiding spot
          survived 30 minutes. Submissions are public immediately for this demo; unsuitable entries can be removed
          by the agent review endpoint. Use the gallery page to browse, like, dislike, and request a longer story.
        </p>

        <form onSubmit={submitChallenge} className="mt-6 space-y-4">
          <label className="block text-sm font-bold text-[#29211D]">
            Map
            <select name="mapSlug" className="mt-2 min-h-11 w-full rounded-lg border border-[#D8CFC6] bg-white px-3 text-[#29211D]" required>
              {maps.map((map) => (
                <option key={map.id} value={map.slug}>
                  {map.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-bold text-[#29211D]">
            Challenge title
            <input
              name="title"
              maxLength={90}
              placeholder="Mansion Library — 30 min undiscovered"
              className="mt-2 min-h-11 w-full rounded-lg border border-[#D8CFC6] bg-white px-3 text-[#29211D] placeholder:text-[#7D6D69]"
              required
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-bold text-[#29211D]">
              Player name
              <input
                name="playerName"
                maxLength={40}
                placeholder="Anonymous Chameleon"
                className="mt-2 min-h-11 w-full rounded-lg border border-[#D8CFC6] bg-white px-3 text-[#29211D] placeholder:text-[#7D6D69]"
              />
            </label>
            <label className="block text-sm font-bold text-[#29211D]">
              Minutes hidden
              <input
                name="minutesHidden"
                type="number"
                min={30}
                defaultValue={30}
                className="mt-2 min-h-11 w-full rounded-lg border border-[#D8CFC6] bg-white px-3 text-[#29211D]"
                required
              />
            </label>
          </div>

          <label className="block text-sm font-bold text-[#29211D]">
            Cover screenshot (required)
            <input
              name="screenshot"
              type="file"
              accept="image/*"
              className="mt-2 block w-full rounded-lg border border-dashed border-[#D8CFC6] bg-[#FFF7F1] p-3 text-sm text-[#29211D] file:mr-3 file:rounded-md file:border-0 file:bg-[#29211D] file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
              required
            />
          </label>

          {Array.from({ length: extraImageCount }).map((_, index) => (
            <label key={`extra-${index}`} className="block text-sm font-bold text-[#29211D]">
              Gallery image #{index + 2}
              <input
                name="extraImages"
                type="file"
                accept="image/*"
                className="mt-2 block w-full rounded-lg border border-dashed border-[#D8CFC6] bg-[#FFF7F1] p-3 text-sm text-[#29211D] file:mr-3 file:rounded-md file:border-0 file:bg-[#29211D] file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
              />
            </label>
          ))}

          {extraImageCount < maxExtras ? (
            <button
              type="button"
              onClick={() => setExtraImageCount((count) => Math.min(count + 1, maxExtras))}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-dashed border-[#D8CFC6] bg-[#FFF7F1] px-4 py-2 text-sm font-bold text-[#29211D] transition hover:bg-[#FFE9D8]"
            >
              <Plus className="h-4 w-4" />
              Add gallery image ({extraImageCount + 1}/{maxExtras})
            </button>
          ) : (
            <p className="text-xs text-[#7D6D69]">
              Maximum {COMMUNITY_MAX_IMAGES_PER_CHALLENGE} images per challenge reached.
            </p>
          )}

          <label className="block text-sm font-bold text-[#29211D]">
            Short story
            <textarea
              name="description"
              rows={3}
              maxLength={240}
              placeholder="I hid behind the bookshelf for 30 minutes. Nobody checked the shadow line."
              className="mt-2 w-full rounded-lg border border-[#D8CFC6] bg-white px-3 py-3 text-[#29211D] placeholder:text-[#7D6D69]"
              required
            />
          </label>

          <label className="flex items-center gap-2 text-sm font-bold text-[#29211D]">
            <input
              type="checkbox"
              checked={includeStory}
              onChange={(event) => setIncludeStory(event.target.checked)}
              className="h-4 w-4 rounded border-[#D8CFC6]"
            />
            Add a full story now (optional)
          </label>

          {includeStory ? (
            <label className="block text-sm font-bold text-[#29211D]">
              Full story (shown on the gallery detail page)
              <textarea
                name="fullStory"
                rows={6}
                maxLength={2000}
                placeholder="Tell players how you picked the spot, what you saw while waiting, and what the seekers did..."
                className="mt-2 w-full rounded-lg border border-[#D8CFC6] bg-white px-3 py-3 text-[#29211D] placeholder:text-[#7D6D69]"
              />
            </label>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#29211D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#4C3B35] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            Submit challenge
          </button>
        </form>

        {message ? <p className="mt-4 rounded-lg bg-[#FFF1CC] p-3 text-sm font-semibold text-[#29211D]">{message}</p> : null}
        {runtime && (!runtime.kvConfigured || !runtime.r2Configured) ? (
          <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
            Runtime needs Cloudflare envs before real uploads work: R2 bucket <b>{runtime.r2Bucket}</b>, KV namespace{' '}
            <b>{runtime.kvNamespaceName}</b>. The public demo card still works without those secrets.
          </p>
        ) : null}
      </section>

      <section className="space-y-4">
        <div className="rounded-2xl border border-[#E8D7CC] bg-[#FFF7F1] p-5 shadow-sm md:p-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#AA776E]">Current top challenge</p>
          {topChallenge ? (
            <article className="mt-4 overflow-hidden rounded-xl border border-[#E8D7CC] bg-white">
              <Image src={topChallenge.screenshotUrl} alt={topChallenge.title} width={800} height={512} className="h-64 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-black text-[#29211D]">{topChallenge.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{topChallenge.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-bold text-[#29211D]">
                  <span>{topChallenge.mapName}</span>
                  <span>{topChallenge.minutesHidden}+ min hidden</span>
                  <span>by {topChallenge.playerName}</span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => likeChallenge(topChallenge.id)}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#FF6F9A] px-4 text-sm font-black text-white hover:bg-[#E95A88]"
                  >
                    <Heart className="h-4 w-4" />
                    {likedIds[topChallenge.id] ? 'Liked' : 'Like'} {topChallenge.likes.toLocaleString()}
                  </button>
                  <Link
                    href={`${galleryPath}/${topChallenge.id}`}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#29211D] bg-white px-4 text-sm font-black text-[#29211D] transition hover:bg-[#FFF1CC]"
                  >
                    Open in gallery
                  </Link>
                </div>
              </div>
            </article>
          ) : loading ? (
            <p className="mt-4 text-sm text-[#4C3B35]">Loading community challenges...</p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-[#E8D7CC] bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-[#29211D]">Recent approved challenges</h2>
            <Link
              href={galleryPath}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#29211D] px-4 py-2 text-sm font-black text-white transition hover:bg-[#4C3B35]"
            >
              Go To Gallery
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <p className="mt-2 text-xs leading-5 text-[#7D6D69]">
            Browse the full 30-minute challenges gallery, like or dislike entries, react with emojis, and ask
            authors to expand their story.
          </p>
          <div className="mt-4 space-y-3">
            {challenges.slice(1, 8).map((challenge) => (
              <Link
                key={challenge.id}
                href={`${galleryPath}/${challenge.id}`}
                className="flex gap-3 rounded-lg border border-[#E8D7CC] p-3 transition hover:border-[#29211D] hover:bg-[#FFF7F1]"
              >
                <Image src={challenge.screenshotUrl} alt={challenge.title} width={160} height={128} className="h-16 w-20 rounded-md object-cover" />
                <div className="min-w-0">
                  <div className="truncate font-black text-[#29211D]">{challenge.title}</div>
                  <div className="text-xs text-[#4C3B35]">
                    {challenge.likes.toLocaleString()} likes · {challenge.minutesHidden}+ min · {challenge.mapName}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-[11px] leading-5 text-[#7D6D69]">
            R2 bucket{' '}
            <a className="underline" href={`${COMMUNITY_R2_PUBLIC_DOMAIN}/`} target="_blank" rel="noopener noreferrer">
              mecchachameleon-art-community
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}