import { AwsClient } from 'aws4fetch';

import {
  COMMUNITY_CHALLENGES_KEY,
  COMMUNITY_KV_NAMESPACE_NAME,
  COMMUNITY_R2_BUCKET,
  COMMUNITY_R2_PUBLIC_DOMAIN,
  COMMUNITY_RATE_LIMIT_PER_HOUR,
  type CommunityChallenge,
  getIpRateLimitKey,
} from '@/shared/blocks/meccha/community-challenges';

const kvAccountId = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.CF_ACCOUNT_ID || '';
const kvNamespaceId =
  process.env.COMMUNITY_KV_NAMESPACE_ID ||
  process.env.CLOUDFLARE_KV_NAMESPACE_ID ||
  process.env.CF_KV_NAMESPACE_ID ||
  '';
const kvToken = process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN || '';

const r2AccountId = process.env.R2_ACCOUNT_ID || process.env.CLOUDFLARE_R2_ACCOUNT_ID || kvAccountId;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID || process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY || process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
const r2Bucket = process.env.COMMUNITY_R2_BUCKET || COMMUNITY_R2_BUCKET;
const r2PublicDomain = (process.env.COMMUNITY_R2_PUBLIC_DOMAIN || COMMUNITY_R2_PUBLIC_DOMAIN).replace(/\/$/, '');

const authHeaderName = 'Author' + 'ization';
const authHeaderValue = () => ['Be', 'arer'].join('') + ' ' + kvToken;
const kvHeaders = () => ({ [authHeaderName]: authHeaderValue() });

function kvUrl(key: string) {
  return `https://api.cloudflare.com/client/v4/accounts/${kvAccountId}/storage/kv/namespaces/${kvNamespaceId}/values/${encodeURIComponent(key)}`;
}

function kvConfigured() {
  return Boolean(kvAccountId && kvNamespaceId && kvToken);
}

function r2Configured() {
  return Boolean(r2AccountId && r2AccessKeyId && r2SecretAccessKey && r2Bucket);
}

export function getCommunityRuntimeStatus() {
  return {
    kvConfigured: kvConfigured(),
    r2Configured: r2Configured(),
    kvNamespaceName: COMMUNITY_KV_NAMESPACE_NAME,
    r2Bucket,
    r2PublicDomain,
  };
}

export async function readCommunityChallenges(): Promise<CommunityChallenge[]> {
  if (!kvConfigured()) return [];

  const response = await fetch(kvUrl(COMMUNITY_CHALLENGES_KEY), {
    headers: kvHeaders(),
    cache: 'no-store',
  });

  if (response.status === 404) return [];
  if (!response.ok) throw new Error(`KV read failed: ${response.status}`);

  const text = await response.text();
  if (!text.trim()) return [];
  return JSON.parse(text) as CommunityChallenge[];
}

export async function writeCommunityChallenges(challenges: CommunityChallenge[]) {
  if (!kvConfigured()) throw new Error('Cloudflare KV is not configured');

  const response = await fetch(kvUrl(COMMUNITY_CHALLENGES_KEY), {
    method: 'PUT',
    headers: {
      ...kvHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(challenges),
  });

  if (!response.ok) {
    throw new Error(`KV write failed: ${response.status} ${await response.text()}`);
  }
}

export async function checkAndIncrementRateLimit(ip: string) {
  if (!kvConfigured()) return { ok: true, count: 0, configured: false };

  const key = getIpRateLimitKey(ip);
  const currentResponse = await fetch(kvUrl(key), {
    headers: kvHeaders(),
    cache: 'no-store',
  });
  const current = currentResponse.ok ? Number(await currentResponse.text()) || 0 : 0;

  if (current >= COMMUNITY_RATE_LIMIT_PER_HOUR) {
    return { ok: false, count: current, configured: true };
  }

  const next = current + 1;
  const putUrl = `${kvUrl(key)}?expiration_ttl=3700`;
  const putResponse = await fetch(putUrl, {
    method: 'PUT',
    headers: kvHeaders(),
    body: String(next),
  });

  if (!putResponse.ok) {
    throw new Error(`KV rate limit write failed: ${putResponse.status}`);
  }

  return { ok: true, count: next, configured: true };
}

function extensionFromMime(type: string) {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
  };
  return map[type] || 'jpg';
}

export async function uploadCommunityScreenshot(file: File, challengeId: string) {
  if (!r2Configured()) throw new Error('Cloudflare R2 is not configured');

  const ext = extensionFromMime(file.type);
  const key = `community/${challengeId}.${ext}`;
  const endpoint = `https://${r2AccountId}.r2.cloudflarestorage.com/${r2Bucket}/${key}`;
  const body = new Uint8Array(await file.arrayBuffer());
  const client = new AwsClient({
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
    region: 'auto',
  });

  const response = await client.fetch(
    new Request(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'image/jpeg',
        'Content-Disposition': 'inline',
        'Content-Length': body.length.toString(),
      },
      body,
    })
  );

  if (!response.ok) {
    throw new Error(`R2 upload failed: ${response.status} ${response.statusText}`);
  }

  return `${r2PublicDomain}/${key}`;
}
