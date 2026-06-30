import Stripe from 'stripe';

const PLAY_KIT_PRICE_CENTS = 700;
const PLAY_KIT_CURRENCY = 'usd';

export function getPlayKitPriceLabel() {
  return '$7';
}

export function getPlayKitCheckoutAmount() {
  return PLAY_KIT_PRICE_CENTS;
}

export function getPlayKitCurrency() {
  return PLAY_KIT_CURRENCY;
}

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY || '';
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is required');
  }

  return new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || 'https://mecchachameleon.art';
}
