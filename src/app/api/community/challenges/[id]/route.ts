import { NextResponse } from 'next/server';

import {
  challengesWithDemo,
  COMMUNITY_OWNER_TOKEN_HEADER,
  COMMUNITY_MAX_FULL_STORY_LENGTH,
  COMMUNITY_MAX_IMAGES_PER_CHALLENGE,
  EXPANSION_EMOJIS,
  bumpEmojiPrompt,
  demoCommunityChallenge,
  isGameScreenshot,
  sanitizeChallengeText,
  sanitizeLongText,
} from '@/shared/blocks/meccha/community-challenges';
import {
  readCommunityChallenges,
  uploadCommunityScreenshot,
  writeCommunityChallenges,
} from '@/shared/blocks/meccha/community-store';

export const runtime = 'nodejs';

type Params = Promise<{ id: string }>;

function unauthorized() {
  return NextResponse.json({ ok: false, error: 'Owner token required' }, { status: 401 });
}

function notFound(id: string) {
  return NextResponse.json({ ok: false, error: `Challenge ${id} not found` }, { status: 404 });
}

function publicChallenge<T extends { ownerToken?: string }>(challenge: T) {
  const { ownerToken: _omitted, ...rest } = challenge;
  return rest;
}

export async function GET(_req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const stored = await readCommunityChallenges();
    const challenge = challengesWithDemo(stored).find((item) => item.id === id);
    if (!challenge) return notFound(id);
    return NextResponse.json({ ok: true, challenge: publicChallenge(challenge) });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to read challenge' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const stored = await readCommunityChallenges();
    const challenges = challengesWithDemo(stored);
    const index = challenges.findIndex((challenge) => challenge.id === id);
    if (index === -1) return notFound(id);

    const url = new URL(req.url);
    const action = (url.searchParams.get('action') || 'like').toLowerCase();

    if (action === 'like' || action === 'dislike') {
      const target = challenges[index];
      const updated =
        action === 'like'
          ? { ...target, likes: target.likes + 1 }
          : { ...target, dislikes: (target.dislikes ?? 0) + 1 };
      const next = [...challenges];
      next[index] = updated;
      // Skip persisting the demo card so its counters stay at their seeded values
      // while still letting the in-memory updated copy flow to the caller.
      if (target.id !== demoCommunityChallenge.id) {
        await writeCommunityChallenges(stored.map((existing) => (existing.id === id ? updated : existing)));
      }
      return NextResponse.json({
        ok: true,
        id,
        likes: updated.likes,
        dislikes: updated.dislikes,
        challenge: publicChallenge(updated),
      });
    }

    if (action === 'prompt') {
      const body = await req.json().catch(() => ({}));
      const emoji = String(body?.emoji || '').trim();
      if (!EXPANSION_EMOJIS.includes(emoji as (typeof EXPANSION_EMOJIS)[number])) {
        return NextResponse.json({ ok: false, error: 'Unsupported reaction emoji' }, { status: 400 });
      }
      const target = challenges[index];
      const updated = {
        ...target,
        expansionPrompts: bumpEmojiPrompt(target.expansionPrompts ?? [], emoji),
      };
      const next = [...challenges];
      next[index] = updated;
      if (target.id !== demoCommunityChallenge.id) {
        await writeCommunityChallenges(stored.map((existing) => (existing.id === id ? updated : existing)));
      }
      return NextResponse.json({
        ok: true,
        id,
        expansionPrompts: updated.expansionPrompts,
        challenge: publicChallenge(updated),
      });
    }

    return NextResponse.json(
      { ok: false, error: `Unknown action '${action}'` },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to update challenge' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const token = req.headers.get(COMMUNITY_OWNER_TOKEN_HEADER) || '';
    if (!token) return unauthorized();

    const challenges = await readCommunityChallenges();
    const index = challenges.findIndex((challenge) => challenge.id === id);
    if (index === -1) return notFound(id);

    const target = challenges[index];
    if (!target.ownerToken || target.ownerToken !== token) return unauthorized();

    const contentType = req.headers.get('content-type') || '';
    let title = target.title;
    let description = target.description;
    let fullStory = target.fullStory;
    let playerName = target.playerName;
    let minutesHidden = target.minutesHidden;
    let newImages: string[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      if (formData.has('title')) {
        title = sanitizeChallengeText(formData.get('title'), target.title).slice(0, 90);
      }
      if (formData.has('description')) {
        description = sanitizeChallengeText(formData.get('description'), target.description).slice(0, 240);
      }
      if (formData.has('fullStory')) {
        fullStory = sanitizeLongText(formData.get('fullStory'), target.fullStory);
      }
      if (formData.has('playerName')) {
        playerName = sanitizeChallengeText(formData.get('playerName'), target.playerName).slice(0, 40);
      }
      if (formData.has('minutesHidden')) {
        minutesHidden = Math.max(30, Number(formData.get('minutesHidden')) || target.minutesHidden);
      }
      const newFiles = formData.getAll('newImages').filter((file): file is File => file instanceof File);
      const remainingSlots = COMMUNITY_MAX_IMAGES_PER_CHALLENGE - target.images.length;
      if (newFiles.length > remainingSlots) {
        return NextResponse.json(
          {
            ok: false,
            error: `You can upload up to ${remainingSlots} more images (max ${COMMUNITY_MAX_IMAGES_PER_CHALLENGE} per challenge).`,
          },
          { status: 400 },
        );
      }
      const startSuffix = target.images.length;
      for (let i = 0; i < newFiles.length; i += 1) {
        const file = newFiles[i];
        if (!isGameScreenshot(file)) {
          return NextResponse.json(
            { ok: false, error: 'Please upload image files only.' },
            { status: 400 },
          );
        }
        const url = await uploadCommunityScreenshot(file, target.id, String(startSuffix + i + 1));
        newImages.push(url);
      }
    } else {
      const body = await req.json().catch(() => ({}));
      if (typeof body?.title === 'string') {
        title = sanitizeChallengeText(body.title, target.title).slice(0, 90);
      }
      if (typeof body?.description === 'string') {
        description = sanitizeChallengeText(body.description, target.description).slice(0, 240);
      }
      if (typeof body?.fullStory === 'string') {
        fullStory = sanitizeLongText(body.fullStory, target.fullStory).slice(0, COMMUNITY_MAX_FULL_STORY_LENGTH);
      }
      if (typeof body?.playerName === 'string') {
        playerName = sanitizeChallengeText(body.playerName, target.playerName).slice(0, 40);
      }
      if (typeof body?.minutesHidden === 'number') {
        minutesHidden = Math.max(30, Math.floor(body.minutesHidden));
      }
    }

    if (!description.trim() && fullStory.trim()) {
      description = fullStory.slice(0, 240);
    }

    const updated = {
      ...target,
      title,
      description,
      fullStory,
      playerName,
      minutesHidden,
      images: [...target.images, ...newImages],
      updatedAt: new Date().toISOString(),
    };

    const next = [...challenges];
    next[index] = updated;
    await writeCommunityChallenges(next);

    return NextResponse.json({ ok: true, challenge: publicChallenge(updated) });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to edit challenge' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const token = req.headers.get('x-community-review-token') || new URL(req.url).searchParams.get('token');
    const expected = process.env.COMMUNITY_REVIEW_TOKEN || '';
    if (!expected || token !== expected) {
      return NextResponse.json({ ok: false, error: 'Unauthorized review action' }, { status: 401 });
    }

    const { id } = await params;
    const challenges = await readCommunityChallenges();
    await writeCommunityChallenges(challenges.filter((challenge) => challenge.id !== id));
    return NextResponse.json({ ok: true, deleted: id });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to delete challenge' },
      { status: 500 },
    );
  }
}