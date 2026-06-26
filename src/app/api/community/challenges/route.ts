import { NextResponse } from 'next/server';

import {
  challengesWithDemo,
  isGameScreenshot,
  sanitizeChallengeText,
  type CommunityChallenge,
} from '@/shared/blocks/meccha/community-challenges';
import { atlasMaps } from '@/shared/blocks/meccha/atlas-data';
import {
  checkAndIncrementRateLimit,
  getCommunityRuntimeStatus,
  readCommunityChallenges,
  uploadCommunityScreenshot,
  writeCommunityChallenges,
} from '@/shared/blocks/meccha/community-store';

export const runtime = 'nodejs';

function getClientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return req.headers.get('x-real-ip') || 'unknown';
}

export async function GET() {
  try {
    const challenges = await readCommunityChallenges();
    return NextResponse.json({
      ok: true,
      runtime: getCommunityRuntimeStatus(),
      challenges: challengesWithDemo(challenges),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to read community challenges',
        runtime: getCommunityRuntimeStatus(),
        challenges: challengesWithDemo([]),
      },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rate = await checkAndIncrementRateLimit(ip);
    if (!rate.ok) {
      return NextResponse.json(
        { ok: false, error: 'Too many submissions from this IP. Try again in an hour.' },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const screenshot = formData.get('screenshot');
    if (!(screenshot instanceof File) || !isGameScreenshot(screenshot)) {
      return NextResponse.json({ ok: false, error: 'Please upload a game screenshot image.' }, { status: 400 });
    }

    const mapSlug = sanitizeChallengeText(formData.get('mapSlug'), 'hide-and-seek-mansion');
    const map = atlasMaps.find((item) => item.slug === mapSlug) || atlasMaps[0];
    const id = `ugc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const screenshotUrl = await uploadCommunityScreenshot(screenshot, id);

    const minutesHidden = Math.max(30, Number(formData.get('minutesHidden')) || 30);
    const challenge: CommunityChallenge = {
      id,
      mapSlug: map.slug,
      mapName: map.name,
      title: sanitizeChallengeText(formData.get('title'), `${map.name} — 30 min undiscovered`).slice(0, 90),
      playerName: sanitizeChallengeText(formData.get('playerName'), 'Anonymous Chameleon').slice(0, 40),
      minutesHidden,
      likes: 0,
      screenshotUrl,
      description: sanitizeChallengeText(
        formData.get('description'),
        `I stayed hidden for ${minutesHidden} minutes. Can you beat this spot?`
      ).slice(0, 240),
      status: 'approved',
      createdAt: new Date().toISOString(),
    };

    const existing = await readCommunityChallenges();
    await writeCommunityChallenges([challenge, ...existing].slice(0, 200));

    return NextResponse.json({ ok: true, challenge, rate, runtime: getCommunityRuntimeStatus() });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to submit challenge',
        runtime: getCommunityRuntimeStatus(),
      },
      { status: 500 }
    );
  }
}
