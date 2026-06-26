export type CommunityChallengeStatus = 'approved' | 'rejected';

export type CommunityChallenge = {
  id: string;
  mapSlug: string;
  mapName: string;
  title: string;
  playerName: string;
  minutesHidden: number;
  likes: number;
  screenshotUrl: string;
  description: string;
  status: CommunityChallengeStatus;
  createdAt: string;
};

export const COMMUNITY_R2_BUCKET = 'mecchachameleon-art-community';
export const COMMUNITY_KV_NAMESPACE_NAME = 'mecchachameleon-art-community';
export const COMMUNITY_R2_PUBLIC_DOMAIN = 'https://pub-fac2b1301830469db5a7a5a2b9c52694.r2.dev';
export const COMMUNITY_RATE_LIMIT_PER_HOUR = 5;
export const COMMUNITY_CHALLENGES_KEY = 'community:challenges:v1';

export const demoCommunityChallenge: CommunityChallenge = {
  id: 'demo-mansion-library-30m',
  mapSlug: 'hide-and-seek-mansion',
  mapName: 'Hide and Seek Mansion',
  title: 'Mansion Library — 30 min undiscovered',
  playerName: 'PlayerXYZ',
  minutesHidden: 30,
  likes: 1247,
  screenshotUrl: '/meccha/atlas/maps/hide-and-seek-mansion/mansion-03.jpg',
  description:
    'I hid for 30 minutes behind the bookshelf in the Mansion Library. Nobody found me. Want to try your own 30-minute challenge?',
  status: 'approved',
  createdAt: '2026-06-26T00:00:00.000Z',
};

export function approvedChallenges(challenges: CommunityChallenge[]) {
  return challenges
    .filter((challenge) => challenge.status === 'approved')
    .sort((a, b) => b.likes - a.likes || Date.parse(b.createdAt) - Date.parse(a.createdAt));
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

export function isGameScreenshot(file: File) {
  return file.type.startsWith('image/');
}

export function getIpRateLimitKey(ip: string, date = new Date()) {
  const hour = date.toISOString().slice(0, 13);
  return `community:rate:${ip}:${hour}`;
}
