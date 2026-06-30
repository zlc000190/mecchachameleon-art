import { NextRequest, NextResponse } from 'next/server';

import { getStripeClient } from '@/shared/lib/play-kit';

const ORIGINAL_DOWNLOAD_URL =
  'https://pub-df9b5ddb7c4049af9616db9a99a48adf.r2.dev/mecchachameleon.art-ass/MecchaCamouflage.exe';

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

    return NextResponse.redirect(ORIGINAL_DOWNLOAD_URL, 302);
  } catch (error: any) {
    console.error('Play Kit download failed:', error);
    return NextResponse.json(
      { error: error?.message || 'download failed' },
      { status: 500 }
    );
  }
}
