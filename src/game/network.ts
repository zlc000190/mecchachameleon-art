import { Client, Room } from 'colyseus.js';

export interface JoinOptions {
  name: string;
  role: 'hider' | 'seeker';
  color: string;
  endpoint?: string;
}

/**
 * Resolves the Colyseus endpoint.
 *
 * Priority:
 *   1. explicit `opts.endpoint`
 *   2. NEXT_PUBLIC_COLYSEUS_URL (build/runtime env)
 *   3. derived from the current page origin (wss://host:2567 in prod,
 *      ws://localhost:2567 in dev) — keeps deployment config-free
 *   4. ws://localhost:2567 fallback (SSR / unknown)
 */
function resolveEndpoint(): string {
  if (typeof window !== 'undefined') {
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${proto}//${window.location.hostname}:2567`;
  }
  return 'ws://localhost:2567';
}

export async function joinGameRoom(opts: JoinOptions): Promise<Room> {
  const endpoint =
    opts.endpoint ||
    process.env.NEXT_PUBLIC_COLYSEUS_URL ||
    resolveEndpoint();

  const client = new Client(endpoint);
  const room = await client.joinOrCreate('hide_seek', {
    name: opts.name,
    role: opts.role,
    color: opts.color,
  });
  return room;
}
