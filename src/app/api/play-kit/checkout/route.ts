import { NextResponse } from 'next/server';

import {
  getAppUrl,
  getPlayKitCheckoutAmount,
  getPlayKitCurrency,
  getPlayKitPriceLabel,
  getStripeClient,
} from '@/shared/lib/play-kit';

export async function POST() {
  try {
    const stripe = getStripeClient();
    const appUrl = getAppUrl().replace(/\/$/, '');
    const amount = getPlayKitCheckoutAmount();
    const currency = getPlayKitCurrency();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      submit_type: 'pay',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: amount,
            product_data: {
              name: 'Meccha Chameleon Tools Pack',
              description: 'One-time download pack for maps-first tools and references.',
            },
          },
        },
      ],
      metadata: {
        product: 'play-kit',
        price_label: getPlayKitPriceLabel(),
      },
      success_url: `${appUrl}/tools/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/tools`,
    });

    if (!session.url) {
      throw new Error('Stripe session url missing');
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Play Kit checkout failed:', error);
    return NextResponse.json(
      { error: error?.message || 'checkout failed' },
      { status: 500 }
    );
  }
}
