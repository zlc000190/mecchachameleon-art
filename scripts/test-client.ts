import { Client } from 'colyseus.js';

const hardTimeout = setTimeout(() => { console.error('⏰ TIMEOUT'); process.exit(2); }, 10000);

function waitForState(room: any): Promise<any> {
  return new Promise((resolve) => {
    const check = () => {
      if (room.state && room.state.players) resolve(room.state);
      else setTimeout(check, 50);
    };
    check();
  });
}

async function main() {
  const client = new Client('ws://localhost:2567');
  console.log('🔌 connecting...');
  const room = await client.joinOrCreate('hide_seek', { name: 'Tester', role: 'hider', color: '#ff0000' });
  clearTimeout(hardTimeout);
  console.log('✅ joined, sessionId =', room.sessionId);

  const state = await waitForState(room);
  console.log('📦 state synced, players =', state.players.size);
  state.players.onAdd = (p: any, key: string) => console.log('   ➕ onAdd', key, JSON.stringify({ x: p.x, y: p.y, z: p.z, rotY: p.rotY, role: p.role, color: p.color }));
  state.players.onRemove = (_p: any, key: string) => console.log('   ➖ onRemove', key);

  setTimeout(() => {
    room.send('move', { x: 5, y: 2, z: -3, rotY: 1.5, color: '#00ff00' });
    console.log('📤 sent move {x:5,y:2,z:-3,rotY:1.5,color:#00ff00}');
  }, 800);

  setTimeout(() => {
    const me = room.state.players.get(room.sessionId);
    console.log('🔎 my synced pos =', me ? `(${me.x}, ${me.y}, ${me.z}) rotY=${me.rotY} color=${me.color}` : 'MISSING', '| players =', room.state.players.size);
    room.leave();
    console.log('✅ test complete');
    process.exit(0);
  }, 2200);
}

main().catch((e) => { console.error('❌ test failed:', e); process.exit(1); });
