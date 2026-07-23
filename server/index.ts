import { Server } from 'colyseus';
import { HideSeekRoom } from './room';

// Fixed port for Colyseus; Next.js uses PORT env var (3000)
const port = Number(process.env.COLYSEUS_PORT || 2567);

const gameServer = new Server();
gameServer.define('hide_seek', HideSeekRoom);

gameServer
  .listen(port)
  .then(() => {
    console.log(`✅ Colyseus server listening on ws://localhost:${port}`);
  })
  .catch((err) => {
    console.error('❌ Failed to start Colyseus server:', err);
    process.exit(1);
  });
