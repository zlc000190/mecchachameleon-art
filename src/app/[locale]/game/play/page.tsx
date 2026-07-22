'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const MecchaLobby = dynamic(() => import('@/game/meccha-lobby'), { ssr: false });
const MecchaGameplay = dynamic(() => import('@/game/meccha-gameplay-v5'), { ssr: false });

type GameMode = 'solo' | 'duo' | 'trio' | 'squad';
type RoleType = 'hider' | 'seeker';

interface GameState {
  isPlaying: boolean;
  mode: GameMode;
  role: RoleType;
}

export default function Page() {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    mode: 'solo',
    role: null,
  });

  const handleStartGame = (mode: GameMode, role: RoleType) => {
    if (role) {
      setGameState({
        isPlaying: true,
        mode,
        role,
      });
    }
  };

  const handleExitGame = () => {
    setGameState({
      isPlaying: false,
      mode: 'solo',
      role: null,
    });
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#0a0a12] overflow-hidden">
      {gameState.isPlaying && gameState.role ? (
        <MecchaGameplay 
          mode={gameState.mode}
          role={gameState.role}
          onExit={handleExitGame}
        />
      ) : (
        <MecchaLobby onStartGame={handleStartGame} />
      )}
    </div>
  );
}
