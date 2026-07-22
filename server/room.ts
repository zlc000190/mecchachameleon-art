import { Room, Client } from 'colyseus';
import { GameRoomState, Player } from './schema';

export class HideSeekRoom extends Room<GameRoomState> {
  onCreate() {
    this.setState(new GameRoomState());

    // Client sends its transform ~20x/sec
    this.onMessage('move', (client, data: any) => {
      const p = this.state.players.get(client.sessionId);
      if (!p) return;
      if (typeof data.x === 'number') p.x = data.x;
      if (typeof data.y === 'number') p.y = data.y;
      if (typeof data.z === 'number') p.z = data.z;
      if (typeof data.rotY === 'number') p.rotY = data.rotY;
      if (typeof data.color === 'string') p.color = data.color;
    });

    // Role / color / name changes
    this.onMessage('update', (client, data: any) => {
      const p = this.state.players.get(client.sessionId);
      if (!p) return;
      if (data.role === 'seeker' || data.role === 'hider') p.role = data.role;
      if (typeof data.color === 'string') p.color = data.color;
      if (typeof data.name === 'string') p.name = data.name;
    });
  }

  onJoin(client: Client, options: any = {}) {
    const p = new Player();
    p.sessionId = client.sessionId;
    p.name = options?.name || 'Player';
    p.role = options?.role === 'seeker' ? 'seeker' : 'hider';
    p.color = options?.color || '#ffffff';
    p.x = 0;
    p.y = 2;
    p.z = 15;
    this.state.players.set(client.sessionId, p);
    console.log(`[hide_seek] ${client.sessionId} joined as ${p.role} (${this.state.players.size} total)`);
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
    console.log(`[hide_seek] ${client.sessionId} left (${this.state.players.size} total)`);
  }
}
