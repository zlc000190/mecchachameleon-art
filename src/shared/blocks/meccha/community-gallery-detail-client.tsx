'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Edit3,
  Heart,
  ImagePlus,
  KeyRound,
  Loader2,
  MessageCircleWarning,
  Send,
  ThumbsDown,
} from 'lucide-react';

import {
  COMMUNITY_MAX_IMAGES_PER_CHALLENGE,
  COMMUNITY_OWNER_TOKEN_HEADER,
  EXPANSION_EMOJIS,
  ownerTokenStorageKey,
  totalPromptCount,
  type CommunityChallenge,
  type CommunityExpansionPrompt,
  type ExpansionEmoji,
} from '@/shared/blocks/meccha/community-challenges';

type OwnerMode = 'view' | 'edit';

export function CommunityGalleryDetailClient({
  initialChallenge,
  galleryPath,
}: {
  initialChallenge: CommunityChallenge;
  galleryPath: string;
}) {
  const [challenge, setChallenge] = useState<CommunityChallenge>(initialChallenge);
  const [activeImage, setActiveImage] = useState<string>(
    initialChallenge.images[0] || initialChallenge.screenshotUrl,
  );
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [voteBusy, setVoteBusy] = useState(false);
  const [ownerMode, setOwnerMode] = useState<OwnerMode>('view');
  const [ownerTokenInput, setOwnerTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [editStory, setEditStory] = useState(initialChallenge.fullStory || initialChallenge.description);
  const [editTitle, setEditTitle] = useState(initialChallenge.title);
  const [editPlayerName, setEditPlayerName] = useState(initialChallenge.playerName);
  const [editBusy, setEditBusy] = useState(false);
  const [editMessage, setEditMessage] = useState('');
  const [pendingNewImages, setPendingNewImages] = useState<File[]>([]);
  const [promptBusy, setPromptBusy] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');

  const ownerTokenAvailable = useMemo(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = window.localStorage.getItem(ownerTokenStorageKey(initialChallenge.id));
      return Boolean(stored);
    } catch {
      return false;
    }
  }, [initialChallenge.id]);

  useEffect(() => {
    // Default into owner edit mode automatically when a token is already saved locally
    // so the original author lands straight on their editable form.
    if (ownerTokenAvailable) {
      setOwnerMode('edit');
    }
  }, [ownerTokenAvailable]);

  const remainingImageSlots = COMMUNITY_MAX_IMAGES_PER_CHALLENGE - challenge.images.length;

  async function sendVote(action: 'like' | 'dislike') {
    if (voteBusy) return;
    setVoteBusy(true);
    if (action === 'like') {
      setLiked(true);
      setChallenge((prev) => ({ ...prev, likes: prev.likes + 1 }));
    } else {
      setDisliked(true);
      setChallenge((prev) => ({ ...prev, dislikes: prev.dislikes + 1 }));
    }
    try {
      const response = await fetch(`/api/community/challenges/${challenge.id}?action=${action}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok && data.challenge) {
        setChallenge((prev) => ({
          ...prev,
          likes: data.challenge.likes ?? prev.likes,
          dislikes: data.challenge.dislikes ?? prev.dislikes,
        }));
      }
    } catch {
      // keep optimistic count
    } finally {
      setVoteBusy(false);
    }
  }

  async function sendPrompt(emoji: ExpansionEmoji) {
    if (promptBusy) return;
    setPromptBusy(true);
    setPromptMessage('');
    setChallenge((prev) => ({
      ...prev,
      expansionPrompts: bumpLocal(prev.expansionPrompts, emoji),
    }));
    try {
      const response = await fetch(`/api/community/challenges/${challenge.id}?action=prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji }),
      });
      const data = await response.json();
      if (response.ok && data.challenge) {
        setChallenge((prev) => ({
          ...prev,
          expansionPrompts: data.challenge.expansionPrompts ?? prev.expansionPrompts,
        }));
      }
    } catch {
      // keep optimistic bump
    } finally {
      setPromptBusy(false);
    }
  }

  async function loadOwnerToken(token: string) {
    if (!token.trim()) {
      setTokenError('Paste the owner token you got when you submitted this entry.');
      return;
    }
    setTokenError('');
    try {
      const response = await fetch(`/api/community/challenges/${challenge.id}?action=ping`, {
        method: 'POST',
        headers: { [COMMUNITY_OWNER_TOKEN_HEADER]: token.trim() },
      });
      if (response.status === 404) {
        setTokenError('Challenge no longer exists.');
        return;
      }
      if (response.status === 401) {
        setTokenError('Token does not match this challenge.');
        return;
      }
      window.localStorage.setItem(ownerTokenStorageKey(challenge.id), token.trim());
      setOwnerMode('edit');
    } catch (error) {
      setTokenError(error instanceof Error ? error.message : 'Could not verify token');
    }
  }

  async function saveOwnerEdits(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editBusy) return;
    setEditBusy(true);
    setEditMessage('');
    try {
      const storedToken = window.localStorage.getItem(ownerTokenStorageKey(challenge.id)) || '';
      if (!storedToken) {
        setEditMessage('Owner token missing. Re-enter your token.');
        setEditBusy(false);
        return;
      }
      const formData = new FormData();
      formData.append('title', editTitle);
      formData.append('playerName', editPlayerName);
      formData.append('fullStory', editStory);
      for (const file of pendingNewImages) {
        formData.append('newImages', file);
      }
      const response = await fetch(`/api/community/challenges/${challenge.id}`, {
        method: 'PATCH',
        headers: { [COMMUNITY_OWNER_TOKEN_HEADER]: storedToken },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Could not save edits');
      }
      setChallenge((prev) => ({
        ...prev,
        title: data.challenge.title,
        playerName: data.challenge.playerName,
        fullStory: data.challenge.fullStory,
        description: data.challenge.description,
        images: data.challenge.images,
      }));
      setPendingNewImages([]);
      setEditMessage('Story saved. New images are live in the gallery.');
    } catch (error) {
      setEditMessage(error instanceof Error ? error.message : 'Could not save edits');
    } finally {
      setEditBusy(false);
    }
  }

  function addPendingImage(file: File) {
    if (pendingNewImages.length >= remainingImageSlots) return;
    setPendingNewImages((prev) => [...prev, file]);
  }

  function removePendingImage(index: number) {
    setPendingNewImages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <article className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-[#E8D7CC] bg-white shadow-sm">
          <div className="relative aspect-[16/10] bg-[#29211D]">
            <Image
              src={activeImage}
              alt={challenge.title}
              fill
              sizes="(min-width: 1024px) 70vw, 100vw"
              priority
              className="object-contain"
            />
          </div>
          {challenge.images.length > 1 ? (
            <div className="flex gap-2 overflow-x-auto bg-[#FFF7F1] p-3">
              {challenge.images.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(src)}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border ${
                    activeImage === src ? 'border-[#29211D]' : 'border-transparent'
                  }`}
                >
                  <Image src={src} alt={`${challenge.title} image ${index + 1}`} fill sizes="96px" className="object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-[#E8D7CC] bg-white p-5 shadow-sm md:p-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#AA776E]">Full story</p>
          <h2 className="mt-1 text-2xl font-black text-[#29211D]">
            {challenge.fullStory ? challenge.title : 'Story coming soon'}
          </h2>
          {challenge.fullStory ? (
            <div className="mt-4 space-y-3 whitespace-pre-line text-sm leading-7 text-[#4C3B35]">
              {challenge.fullStory}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-[#4C3B35]">
              The author has not written the full story yet. Use the emoji prompts to ask them to share more.
            </p>
          )}
          {challenge.updatedAt ? (
            <p className="mt-4 text-xs text-[#7D6D69]">Last updated {new Date(challenge.updatedAt).toLocaleString()}</p>
          ) : null}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-[#E8D7CC] bg-white p-5 shadow-sm md:p-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#AA776E]">Challenge</p>
          <h1 className="mt-1 text-2xl font-black text-[#29211D]">{challenge.title}</h1>
          <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{challenge.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold text-[#29211D]">
            <span className="rounded-full bg-[#FFF1CC] px-3 py-1">{challenge.mapName}</span>
            <span className="rounded-full bg-[#FFE2D1] px-3 py-1">{challenge.minutesHidden}+ min hidden</span>
            <span className="rounded-full bg-[#E5F0FF] px-3 py-1">by {challenge.playerName}</span>
            <span className="rounded-full bg-[#F6F0EA] px-3 py-1 text-[#7D6D69]">
              {new Date(challenge.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={liked || voteBusy}
              onClick={() => sendVote('like')}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#FF6F9A] px-4 text-sm font-black text-white transition hover:bg-[#E95A88] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Heart className="h-4 w-4" />
              {liked ? 'Liked' : 'Like'} {challenge.likes.toLocaleString()}
            </button>
            <button
              type="button"
              disabled={disliked || voteBusy}
              onClick={() => sendVote('dislike')}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#E8D7CC] bg-white px-4 text-sm font-black text-[#29211D] transition hover:bg-[#FFF1CC] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <ThumbsDown className="h-4 w-4" />
              {disliked ? 'Disliked' : 'Dislike'} {challenge.dislikes.toLocaleString()}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E8D7CC] bg-[#FFF7F1] p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-2">
            <MessageCircleWarning className="h-4 w-4 text-[#AA776E]" />
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#AA776E]">
              Ask the author for more
            </p>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
            Tap an emoji to send a reaction. If the story is short, the author sees your emoji prompt and gets a
            nudge to expand it.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {EXPANSION_EMOJIS.map((emoji) => {
              const count = challenge.expansionPrompts.find((prompt) => prompt.emoji === emoji)?.count ?? 0;
              return (
                <button
                  key={emoji}
                  type="button"
                  disabled={promptBusy}
                  onClick={() => sendPrompt(emoji)}
                  className="inline-flex min-h-10 items-center gap-1 rounded-full border border-[#E8D7CC] bg-white px-3 py-1 text-base font-bold text-[#29211D] transition hover:border-[#29211D] hover:bg-white disabled:opacity-60"
                >
                  <span>{emoji}</span>
                  {count > 0 ? <span className="text-xs text-[#7D6D69]">{count}</span> : null}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-[#7D6D69]">
            {totalPromptCount(challenge.expansionPrompts)} total prompts · {' '}
            {challenge.expansionPrompts.length} reactions used
          </p>
          {promptMessage ? <p className="mt-3 text-xs font-bold text-[#29211D]">{promptMessage}</p> : null}
        </div>

        <div className="rounded-2xl border border-[#E8D7CC] bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-[#AA776E]" />
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#AA776E]">Are you the author?</p>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
            Paste your owner token (the one shown right after submission) to edit your story and upload more
            screenshots. Once saved on this device, you skip this step next time.
          </p>
          {ownerMode === 'view' ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                loadOwnerToken(ownerTokenInput);
              }}
              className="mt-4 space-y-2"
            >
              <input
                value={ownerTokenInput}
                onChange={(event) => setOwnerTokenInput(event.target.value)}
                placeholder="co-xxxxxxxxxxxxxxxxxxxx"
                className="w-full rounded-md border border-[#D8CFC6] bg-white px-3 py-2 text-sm font-mono text-[#29211D] placeholder:text-[#7D6D69]"
              />
              {tokenError ? <p className="text-xs text-[#B23A48]">{tokenError}</p> : null}
              <button
                type="submit"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#29211D] px-4 text-sm font-black text-white transition hover:bg-[#4C3B35]"
              >
                <Send className="h-4 w-4" />
                Sign in to edit
              </button>
            </form>
          ) : (
            <p className="mt-4 rounded-md bg-[#FFF1CC] p-3 text-xs font-bold text-[#29211D]">
              Owner token detected for this device. You can edit your story below.
            </p>
          )}
        </div>

        {ownerMode === 'edit' ? (
          <form
            onSubmit={saveOwnerEdits}
            className="space-y-4 rounded-2xl border border-[#29211D] bg-white p-5 shadow-sm md:p-6"
          >
            <div className="flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-[#29211D]" />
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#29211D]">Edit your story</p>
            </div>
            <label className="block text-sm font-bold text-[#29211D]">
              Title
              <input
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                maxLength={90}
                className="mt-2 min-h-11 w-full rounded-lg border border-[#D8CFC6] bg-white px-3 text-[#29211D]"
              />
            </label>
            <label className="block text-sm font-bold text-[#29211D]">
              Player name
              <input
                value={editPlayerName}
                onChange={(event) => setEditPlayerName(event.target.value)}
                maxLength={40}
                className="mt-2 min-h-11 w-full rounded-lg border border-[#D8CFC6] bg-white px-3 text-[#29211D]"
              />
            </label>
            <label className="block text-sm font-bold text-[#29211D]">
              Full story
              <textarea
                value={editStory}
                onChange={(event) => setEditStory(event.target.value)}
                rows={8}
                maxLength={2000}
                className="mt-2 w-full rounded-lg border border-[#D8CFC6] bg-white px-3 py-3 text-[#29211D]"
              />
              <span className="mt-1 block text-xs text-[#7D6D69]">{editStory.length} / 2000</span>
            </label>

            <div>
              <p className="text-sm font-bold text-[#29211D]">Upload more screenshots</p>
              <p className="mt-1 text-xs text-[#7D6D69]">
                {remainingImageSlots > 0
                  ? `You can add up to ${remainingImageSlots} more image${remainingImageSlots === 1 ? '' : 's'} (current: ${challenge.images.length}).`
                  : 'You have reached the maximum number of images.'}
              </p>
              {pendingNewImages.length > 0 ? (
                <ul className="mt-2 space-y-1 text-xs text-[#4C3B35]">
                  {pendingNewImages.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded border border-[#E8D7CC] bg-[#FFF7F1] px-2 py-1"
                    >
                      <span className="truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removePendingImage(index)}
                        className="text-xs font-bold text-[#B23A48] hover:underline"
                      >
                        remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              {remainingImageSlots > 0 ? (
                <label className="mt-3 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#D8CFC6] bg-[#FFF7F1] px-3 py-2 text-sm font-bold text-[#29211D] transition hover:bg-[#FFE9D8]">
                  <ImagePlus className="h-4 w-4" />
                  Add image
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                      const files = Array.from(event.target.files || []);
                      for (const file of files) addPendingImage(file);
                      event.currentTarget.value = '';
                    }}
                  />
                </label>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={editBusy}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#29211D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#4C3B35] disabled:opacity-60"
            >
              {editBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Save changes
            </button>
            {editMessage ? (
              <p className="rounded-md bg-[#FFF1CC] p-3 text-xs font-bold text-[#29211D]">{editMessage}</p>
            ) : null}
          </form>
        ) : null}

        <Link
          href={galleryPath}
          className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#b9af9e] bg-white px-3 py-2 text-sm font-semibold text-[#29211D] transition hover:bg-[#ece5d8]"
        >
          ← Back to gallery
        </Link>
      </aside>
    </article>
  );
}

function bumpLocal(prompts: CommunityExpansionPrompt[], emoji: string): CommunityExpansionPrompt[] {
  const existing = prompts.find((prompt) => prompt.emoji === emoji);
  if (existing) {
    return prompts.map((prompt) =>
      prompt.emoji === emoji ? { ...prompt, count: prompt.count + 1 } : prompt,
    );
  }
  return [...prompts, { emoji, count: 1 }];
}