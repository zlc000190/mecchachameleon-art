'use client';

import dynamic from 'next/dynamic';

const GameCanvas = dynamic(() => import('@/game/game'), { ssr: false });

export default function Page() {
  return (
    <div className="w-full h-screen bg-[#0a0a1a] overflow-hidden flex items-center justify-center">
      <GameCanvas />
    </div>
  );
}
