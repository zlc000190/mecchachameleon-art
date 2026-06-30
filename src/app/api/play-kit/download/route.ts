import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { NextRequest, NextResponse } from 'next/server';

import { getStripeClient } from '@/shared/lib/play-kit';

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');
    if (!sessionId) {
      return NextResponse.json({ error: 'missing session_id' }, { status: 400 });
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'payment not completed' }, { status: 402 });
    }

    const filePath = path.join(process.cwd(), 'public', 'downloads', 'play-kit.zip');
    const file = await readFile(filePath);

    return new NextResponse(new Uint8Array(file), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="play-kit.zip"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    console.error('Play Kit download failed:', error);
    return NextResponse.json(
      { error: error?.message || 'download failed' },
      { status: 500 }
    );
  }
}
