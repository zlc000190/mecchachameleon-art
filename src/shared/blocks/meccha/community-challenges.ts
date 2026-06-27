export type CommunityChallengeStatus = 'approved' | 'rejected';

export type CommunityExpansionPrompt = {
  emoji: string;
  count: number;
};

export type CommunityChallenge = {
  id: string;
  mapSlug: string;
  mapName: string;
  title: string;
  playerName: string;
  minutesHidden: number;
  likes: number;
  dislikes: number;
  screenshotUrl: string;
  images: string[];
  description: string;
  fullStory: string;
  expansionPrompts: CommunityExpansionPrompt[];
  status: CommunityChallengeStatus;
  createdAt: string;
  updatedAt?: string;
  ownerToken?: string;
};

export const COMMUNITY_R2_BUCKET = 'mecchachameleon-art-community';
export const COMMUNITY_KV_NAMESPACE_NAME = 'mecchachameleon-art-community';
export const COMMUNITY_R2_PUBLIC_DOMAIN = 'https://pub-fac2b1301830469db5a7a5a2b9c52694.r2.dev';
export const COMMUNITY_RATE_LIMIT_PER_HOUR = 5;
export const COMMUNITY_CHALLENGES_KEY = 'community:challenges:v1';
export const COMMUNITY_OWNER_TOKEN_HEADER = 'x-community-owner-token';
export const COMMUNITY_MAX_IMAGES_PER_CHALLENGE = 8;
export const COMMUNITY_MAX_FULL_STORY_LENGTH = 2000;

export const EXPANSION_EMOJIS = ['🥺', '🤩', '🔥', '👏', '😂', '😱', '🫶', '🕵️'] as const;
export type ExpansionEmoji = (typeof EXPANSION_EMOJIS)[number];

export const demoCommunityChallenge: CommunityChallenge = {
  id: 'demo-mansion-library-30m',
  mapSlug: 'hide-and-seek-mansion',
  mapName: 'Hide and Seek Mansion',
  title: 'Mansion Library — 30 min undiscovered',
  playerName: 'PlayerXYZ',
  minutesHidden: 30,
  likes: 1247,
  dislikes: 18,
  screenshotUrl: '/meccha/atlas/maps/hide-and-seek-mansion/mansion-03.jpg',
  images: ['/meccha/atlas/maps/hide-and-seek-mansion/mansion-03.jpg'],
  description:
    'I hid for 30 minutes behind the bookshelf in the Mansion Library. Nobody found me. Want to try your own 30-minute challenge?',
  fullStory:
    'Round 3 of the weekly hide and seek tournament. Spawned in the Mansion Library, and my whole plan was to wait it out behind the long bookshelf next to the reading lamp.\n\nI crouched behind the brass lampshade so my color matched the cream wall. First seeker ran past twice in the first 4 minutes. After that I only moved once, when a hider got found on the balcony and the entire lobby swarmed in. I slid two tiles south behind the curtain and stayed frozen until the round ended.\n\nFinal: 30m 12s undiscovered, screenshot attached. The bookshelf spot only works if no one checks the shadow line — I watched three seekers pass within 2m.',
  expansionPrompts: [
    { emoji: '🥺', count: 12 },
    { emoji: '🔥', count: 5 },
    { emoji: '👏', count: 3 },
  ],
  status: 'approved',
  createdAt: '2026-06-26T00:00:00.000Z',
};

export function approvedChallenges(challenges: CommunityChallenge[]) {
  return challenges
    .filter((challenge) => challenge.status === 'approved')
    .sort(
      (a, b) =>
        b.likes - a.likes ||
        b.likes + b.expansionPrompts.reduce((sum, p) => sum + p.count, 0) -
          (a.likes + a.expansionPrompts.reduce((sum, p) => sum + p.count, 0)) ||
        Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );
}

export function challengesWithDemo(challenges: CommunityChallenge[]) {
  const approved = approvedChallenges(challenges);
  if (approved.some((challenge) => challenge.id === demoCommunityChallenge.id)) {
    return approved;
  }
  return [demoCommunityChallenge, ...approved];
}

export function sanitizeChallengeText(value: FormDataEntryValue | null, fallback = '') {
  return String(value ?? fallback)
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 240);
}

export function sanitizeLongText(value: FormDataEntryValue | null, fallback = '') {
  return String(value ?? fallback)
    .replace(/[<>]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, COMMUNITY_MAX_FULL_STORY_LENGTH);
}

export function isGameScreenshot(file: File) {
  return file.type.startsWith('image/');
}

export function getIpRateLimitKey(ip: string, date = new Date()) {
  const hour = date.toISOString().slice(0, 13);
  return `community:rate:${ip}:${hour}`;
}

export function generateOwnerToken() {
  const bytes = new Uint8Array(18);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  let raw = '';
  for (let i = 0; i < bytes.length; i += 1) {
    raw += bytes[i].toString(16).padStart(2, '0');
  }
  return `co-${raw}`;
}

export function bumpEmojiPrompt(prompts: CommunityExpansionPrompt[], emoji: string): CommunityExpansionPrompt[] {
  const existing = prompts.find((prompt) => prompt.emoji === emoji);
  if (existing) {
    return prompts.map((prompt) =>
      prompt.emoji === emoji ? { ...prompt, count: prompt.count + 1 } : prompt,
    );
  }
  return [...prompts, { emoji, count: 1 }];
}

export function totalPromptCount(prompts: CommunityExpansionPrompt[]) {
  return prompts.reduce((sum, prompt) => sum + prompt.count, 0);
}

export function ownerTokenStorageKey(challengeId: string) {
  return `community:owner:${challengeId}`;
}