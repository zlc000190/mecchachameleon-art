import { NextResponse } from 'next/server';

import { readCommunityChallenges, writeCommunityChallenges } from '@/shared/blocks/meccha/community-store';

export const runtime = 'nodejs';

type Params = Promise<{ id: string }>;

export async function POST(_req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const challenges = await readCommunityChallenges();
    const updated = challenges.map((challenge) =>
      challenge.id === id ? { ...challenge, likes: challenge.likes + 1 } : challenge
    );
    await writeCommunityChallenges(updated);
    return NextResponse.json({ ok: true, id, likes: updated.find((item) => item.id === id)?.likes ?? 0 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to like challenge' },
      { status: 500 }
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
      { status: 500 }
    );
  }
}
