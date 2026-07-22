'use client';

import { useState, useEffect, useRef } from 'react';
import { Gamepad2, Trophy, User, Lock, BarChart3, MessageSquare, X, ChevronRight, Crown, Star, Zap, Ghost, Target } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type TabType = 'lobby' | 'challenges' | 'locker' | 'profile' | 'leaderboards';
type GameMode = 'solo' | 'duo' | 'trio' | 'squad';
type RoleType = 'hider' | 'seeker' | null;

interface PlayerStats {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  tag: string;
  wins: number;
  rounds: number;
  painted: number;
  items: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: string;
  type: 'daily' | 'weekly' | 'paint' | 'hide' | 'social';
  completed: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PLAYER: PlayerStats = {
  name: 'Player5139',
  level: 1,
  xp: 0,
  maxXp: 1000,
  tag: '#PAINTER',
  wins: 0,
  rounds: 1,
  painted: 0,
  items: 62,
};

const CHALLENGES: Challenge[] = [
  { id: '1', title: 'Room Sweeper', description: 'Paint every wall in a single room', progress: 0, maxProgress: 1, reward: '+150 XP', type: 'paint', completed: false },
  { id: '2', title: 'Splash Zone', description: 'Paint 50 surfaces in a single round', progress: 50, maxProgress: 50, reward: '+150 XP +30 V', type: 'paint', completed: true },
  { id: '3', title: 'Camouflage King', description: 'Paint your skin to match a wall & stay hidden for 60s', progress: 42, maxProgress: 60, reward: '+150 XP +25 V', type: 'hide', completed: false },
  { id: '4', title: 'Hide & Seek', description: 'Survive 90 seconds while hidden in a single room', progress: 60, maxProgress: 90, reward: '+200 XP', type: 'hide', completed: false },
  { id: '5', title: 'Color Theory', description: 'Paint yourself with 6 different colors', progress: 4, maxProgress: 6, reward: '+175 XP', type: 'paint', completed: false },
  { id: '6', title: 'Room Explorer', description: 'Visit 6 different themed rooms in one match', progress: 4, maxProgress: 6, reward: '+125 XP', type: 'daily', completed: false },
];

const LEADERBOARD = [
  { rank: 1, name: 'NEOPAINT', points: 12480 },
  { rank: 2, name: 'GHOST_42', points: 11920 },
  { rank: 3, name: 'ARTIST_X', points: 10500 },
  { rank: 4, name: 'PIXEL_QUEEN', points: 9840 },
  { rank: 5, name: 'BRUSHLORD', points: 9210 },
  { rank: 6, name: 'Player5139', points: 8210, isYou: true },
  { rank: 7, name: 'SHADOW77', points: 7980 },
  { rank: 8, name: 'CHROMA', points: 7440 },
];

// ─── Main Component ───────────────────────────────────────────────────────────

interface MecchaLobbyProps {
  onStartGame: (mode: GameMode, role: RoleType) => void;
}

export default function MecchaLobby({ onStartGame }: MecchaLobbyProps) {
  const [activeTab, setActiveTab] = useState<TabType>('lobby');
  const [selectedMode, setSelectedMode] = useState<GameMode>('solo');
  const [selectedRole, setSelectedRole] = useState<RoleType>(null);
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [emoteAnimating, setEmoteAnimating] = useState(false);

  const handleStartClick = () => {
    setShowRoleSelect(true);
  };

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    setShowRoleSelect(false);
    onStartGame(selectedMode, role);
  };

  const handleEmote = () => {
    setEmoteAnimating(true);
    setTimeout(() => setEmoteAnimating(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0f2e] via-[#0d0d1a] to-[#0a0a12] text-white overflow-hidden">
      {/* Background Brick Wall Effect */}
      <div 
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 28px,
              rgba(139, 69, 19, 0.3) 28px,
              rgba(139, 69, 19, 0.3) 30px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 58px,
              rgba(139, 69, 19, 0.3) 58px,
              rgba(139, 69, 19, 0.3) 60px
            )
          `,
          backgroundSize: '60px 30px'
        }}
      />

      {/* Top Navigation */}
      <nav className="relative z-10 flex items-center justify-center gap-1 p-2 bg-gradient-to-b from-black/60 to-transparent">
        {[
          { id: 'lobby', label: 'LOBBY', icon: Gamepad2 },
          { id: 'challenges', label: 'CHALLENGES', icon: Target },
          { id: 'locker', label: 'LOCKER', icon: Lock, badge: 1 },
          { id: 'profile', label: 'PROFILE', icon: User },
          { id: 'leaderboards', label: 'LEADERBOARDS', icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`
              relative px-6 py-2 font-bold text-sm tracking-wider transition-all duration-200
              ${activeTab === tab.id 
                ? 'bg-gradient-to-b from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/30' 
                : 'bg-gradient-to-b from-blue-600 to-blue-800 text-white hover:from-blue-500 hover:to-blue-700'
              }
              clip-path-polygon
            `}
            style={{
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)'
            }}
          >
            <span className="flex items-center gap-2">
              {tab.label}
              {tab.badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex h-[calc(100vh-80px)]">
        {/* Left Side - Player Card */}
        <div className="w-80 p-4">
          <div className="bg-gradient-to-br from-purple-600/80 to-blue-800/80 rounded-2xl p-4 border border-purple-400/30 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center border-2 border-white/20">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{PLAYER.name}</span>
                  <button className="text-xs bg-white/20 px-2 py-0.5 rounded">EDIT</button>
                </div>
                <span className="text-xs bg-purple-500/50 px-2 py-0.5 rounded">{PLAYER.tag}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs mb-1">
              <span>LVL {PLAYER.level}</span>
              <span>{PLAYER.xp} / {PLAYER.maxXp} XP</span>
              <span>LVL {PLAYER.level + 1}</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                style={{ width: `${(PLAYER.xp / PLAYER.maxXp) * 100}%` }}
              />
            </div>
            
            <button className="w-full mt-3 text-xs text-purple-300 hover:text-purple-200 flex items-center justify-center gap-1">
              VIEW ROADMAP <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Center - Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {activeTab === 'lobby' && (
            <>
              {/* 3D Character Display */}
              <div className="relative mb-8">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-yellow-400">YOU</span>
                </div>
                
                {/* Character Model */}
                <div 
                  className={`
                    w-32 h-48 bg-gradient-to-b from-white to-gray-200 rounded-3xl relative
                    shadow-2xl shadow-white/20 border-2 border-white/30
                    transition-transform duration-300
                    ${emoteAnimating ? 'animate-bounce' : ''}
                  `}
                  style={{
                    boxShadow: '0 20px 60px rgba(255,255,255,0.3), inset 0 -10px 30px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* Head */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-b from-white to-gray-100 rounded-full shadow-lg" />
                  {/* Arms */}
                  <div className="absolute top-12 -left-4 w-8 h-24 bg-gradient-to-r from-white to-gray-200 rounded-full -rotate-12" />
                  <div className="absolute top-12 -right-4 w-8 h-24 bg-gradient-to-l from-white to-gray-200 rounded-full rotate-12" />
                  {/* Legs */}
                  <div className="absolute -bottom-8 left-4 w-10 h-20 bg-gradient-to-b from-gray-100 to-gray-300 rounded-full" />
                  <div className="absolute -bottom-8 right-4 w-10 h-20 bg-gradient-to-b from-gray-100 to-gray-300 rounded-full" />
                </div>

                {/* Color Pickers */}
                <button className="absolute top-1/2 -left-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform">
                  +
                </button>
                <button className="absolute top-1/2 -right-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform">
                  +
                </button>
              </div>

              {/* MECCHA CHAMELEON Logo */}
              <div className="flex flex-wrap justify-center gap-1 mb-8 max-w-2xl">
                {'MECCHA'.split('').map((char, i) => (
                  <span 
                    key={i}
                    className="text-5xl font-black drop-shadow-2xl"
                    style={{
                      color: ['#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'][i],
                      textShadow: '4px 4px 0px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.3)'
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-1 mb-8 max-w-2xl">
                {'CHAMELEON'.split('').map((char, i) => (
                  <span 
                    key={i}
                    className="text-5xl font-black drop-shadow-2xl"
                    style={{
                      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'][i],
                      textShadow: '4px 4px 0px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.3)'
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </>
          )}

          {activeTab === 'challenges' && <ChallengesView />}
          {activeTab === 'locker' && <LockerView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'leaderboards' && <LeaderboardsView />}
        </div>

        {/* Right Side - Game Mode Panel */}
        <div className="w-80 p-4">
          <div className="bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-2xl p-4 border border-pink-400/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-pink-500 text-xs px-2 py-1 rounded font-bold">NEW!</span>
              <span className="text-xs text-gray-400">v2.6</span>
            </div>
            
            <h3 className="text-2xl font-black mb-1 text-center bg-gradient-to-r from-yellow-300 to-pink-400 bg-clip-text text-transparent">
              BE READY
            </h3>
            <p className="text-xs text-center text-gray-400 mb-4">MEGA UPDATE · ALL-IN-ONE</p>

            {/* Map Preview */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { name: 'FARM', icon: '☀️', color: 'from-green-400 to-green-600' },
                { name: 'HOME', icon: '🏠', color: 'from-blue-400 to-blue-600' },
                { name: 'HALLOWEEN', icon: '🎃', color: 'from-orange-400 to-orange-600' },
              ].map((map) => (
                <div key={map.name} className={`bg-gradient-to-br ${map.color} rounded-lg p-2 text-center cursor-pointer hover:scale-105 transition-transform`}>
                  <div className="text-2xl mb-1">{map.icon}</div>
                  <div className="text-xs font-bold">{map.name}</div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex justify-around text-center mb-4 text-xs">
              <div>
                <div className="text-xl font-bold text-cyan-400">3</div>
                <div className="text-gray-400">BIOMES</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-400">16</div>
                <div className="text-gray-400">PLAYERS</div>
              </div>
              <div>
                <div className="text-xs bg-red-500 px-2 py-1 rounded">NEW</div>
                <div className="text-gray-400">PROPS</div>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="flex gap-1 mb-4">
              {(['solo', 'duo', 'trio', 'squad'] as GameMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={`
                    flex-1 py-1 text-xs font-bold rounded transition-all
                    ${selectedMode === mode 
                      ? 'bg-yellow-400 text-black' 
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }
                  `}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Play Button */}
            <button
              onClick={handleStartClick}
              className="w-full py-3 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-xl font-black text-lg hover:scale-105 transition-transform shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-5 h-5" />
              PLAY NOW →
            </button>
            
            <p className="text-xs text-center text-gray-500 mt-2">
              FREE • NO DOWNLOAD • 16P
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Buttons */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        <button 
          onClick={() => setShowFriends(true)}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform"
        >
          <MessageSquare className="w-5 h-5" />
          CHAT
        </button>
        <button 
          onClick={handleEmote}
          className="px-8 py-3 bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400 rounded-xl font-bold text-black shadow-lg hover:scale-105 transition-transform"
        >
          EMOTE
        </button>
      </div>

      {/* Role Selection Modal */}
      {showRoleSelect && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-800 to-blue-900 rounded-3xl p-8 max-w-md w-full mx-4 border border-purple-400/30">
            <h2 className="text-3xl font-black text-center mb-2">CHOOSE YOUR ROLE</h2>
            <p className="text-center text-gray-400 mb-8">Select how you want to play</p>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleSelect('hider')}
                className="p-6 bg-gradient-to-br from-white to-gray-200 rounded-2xl hover:scale-105 transition-transform group"
              >
                <Ghost className="w-16 h-16 mx-auto mb-4 text-gray-800 group-hover:animate-bounce" />
                <h3 className="text-xl font-black text-gray-800">HIDER</h3>
                <p className="text-sm text-gray-600 mt-2">Hide & Paint</p>
                <p className="text-xs text-gray-500">Blend into the environment</p>
              </button>
              
              <button
                onClick={() => handleRoleSelect('seeker')}
                className="p-6 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl hover:scale-105 transition-transform group"
              >
                <Target className="w-16 h-16 mx-auto mb-4 text-white group-hover:animate-pulse" />
                <h3 className="text-xl font-black text-white">SEEKER</h3>
                <p className="text-sm text-red-200 mt-2">Hunt & Shoot</p>
                <p className="text-xs text-red-300">Find hidden players</p>
              </button>
            </div>
            
            <button
              onClick={() => setShowRoleSelect(false)}
              className="w-full mt-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Friends Panel */}
      {showFriends && (
        <div className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 to-black border-l border-gray-700 z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">YOUR ID</h3>
            <button onClick={() => setShowFriends(false)}><X className="w-5 h-5" /></button>
          </div>
          <p className="text-sm text-gray-400 mb-1">PLAYER#8743</p>
          <p className="text-xs text-green-400 mb-6">Online · Level 24</p>
          
          <div className="flex gap-2 mb-4">
            <button className="flex-1 py-2 bg-blue-600 rounded-lg text-sm font-bold">FRIENDS (0)</button>
            <button className="flex-1 py-2 bg-gray-800 rounded-lg text-sm">REQUESTS</button>
            <button className="px-3 py-2 bg-gray-800 rounded-lg text-sm">ADD</button>
          </div>
          
          <input 
            type="text" 
            placeholder="Search friends..."
            className="w-full p-3 bg-gray-800 rounded-lg text-sm mb-4"
          />
          
          <p className="text-center text-gray-500 text-sm">No friends yet. Add some!</p>
        </div>
      )}
    </div>
  );
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function ChallengesView() {
  const [filter, setFilter] = useState('all');
  
  const filteredChallenges = filter === 'all' 
    ? CHALLENGES 
    : CHALLENGES.filter(c => c.type === filter || (filter === 'daily' && c.type === 'daily'));

  return (
    <div className="w-full max-w-4xl p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400">QUESTS</p>
          <h2 className="text-2xl font-black">DAILY QUESTS</h2>
          <p className="text-xs text-gray-500">RESETS IN 03H 12M · 0/23 CLAIMED · 2 READY</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-yellow-400">+3,860</p>
          <p className="text-xs text-gray-400">XP</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['DAILY', 'WEEKLY', 'SEASON', 'ALL', 'HIDE', 'PAINT', 'SURVIVE'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f.toLowerCase())}
            className={`
              px-4 py-2 rounded-lg text-xs font-bold transition-all
              ${filter === f.toLowerCase() 
                ? 'bg-yellow-400 text-black' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }
            `}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredChallenges.map((challenge) => (
          <div 
            key={challenge.id}
            className={`
              p-4 rounded-xl border ${challenge.completed ? 'bg-green-900/20 border-green-500/30' : 'bg-gray-800/50 border-gray-700'}
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center
                ${challenge.type === 'paint' ? 'bg-pink-500/20' : challenge.type === 'hide' ? 'bg-blue-500/20' : 'bg-yellow-500/20'}
              `}>
                {challenge.type === 'paint' ? <Zap className="w-6 h-6 text-pink-400" /> : <Ghost className="w-6 h-6 text-blue-400" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`
                    text-xs px-2 py-0.5 rounded
                    ${challenge.type === 'paint' ? 'bg-pink-500/30 text-pink-300' : challenge.type === 'hide' ? 'bg-blue-500/30 text-blue-300' : 'bg-yellow-500/30 text-yellow-300'}
                  `}>
                    {challenge.type.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-bold">{challenge.title}</h3>
                <p className="text-xs text-gray-400 mb-2">{challenge.description}</p>
                
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full rounded-full ${challenge.completed ? 'bg-green-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'}`}
                    style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{challenge.progress} / {challenge.maxProgress}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">{challenge.reward}</span>
                    {challenge.completed && (
                      <button className="px-3 py-1 bg-yellow-400 text-black rounded font-bold text-xs">
                        CLAIM
                      </button>
                    )}
                    {!challenge.completed && challenge.progress < challenge.maxProgress && (
                      <span className="px-3 py-1 bg-gray-700 rounded text-xs">LOCKED</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LockerView() {
  const [activeTab, setActiveTab] = useState('shape');
  
  return (
    <div className="w-full max-w-4xl p-4">
      <div className="flex items-center gap-4 mb-6">
        <button className="px-6 py-2 bg-blue-600 rounded-lg font-bold flex items-center gap-2">
          <User className="w-4 h-4" /> PLAYER
        </button>
        <button className="px-6 py-2 bg-gray-800 rounded-lg font-bold flex items-center gap-2 text-gray-400">
          <Target className="w-4 h-4" /> ENEMY
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {['SHAPE', 'EMOTE WHEEL', 'BRUSH', 'WEARABLES'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`
              px-4 py-2 rounded-lg text-xs font-bold transition-all
              ${activeTab === tab.toLowerCase() 
                ? 'bg-yellow-400 text-black' 
                : 'bg-gray-800 text-gray-400'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Items Grid */}
        <div>
          <p className="text-xs text-gray-400 mb-2">SHAPE · 2 ITEMS</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border-2 border-green-500/50">
              <div className="aspect-square bg-gradient-to-b from-white to-gray-300 rounded-lg mb-2 flex items-center justify-center">
                <div className="w-16 h-24 bg-white rounded-2xl shadow-lg" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">COMMON</p>
                  <p className="font-bold text-sm">DEFAULT</p>
                </div>
                <span className="text-xs bg-green-500 px-2 py-1 rounded">EQUIPPED</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
              <div className="aspect-square bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg mb-2 flex items-center justify-center">
                <div className="w-16 h-20 bg-white rounded-lg shadow-lg" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }} />
              </div>
              <div>
                <p className="text-xs text-gray-400">RARE</p>
                <p className="font-bold text-sm">BLOCKY</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gradient-to-b from-gray-800 to-black rounded-2xl p-6">
          <p className="text-xs text-center text-gray-400 mb-4">LIVE PREVIEW · YOUR LOADOUT</p>
          <div className="flex items-center justify-center h-64">
            <div className="w-24 h-36 bg-gradient-to-b from-white to-gray-200 rounded-3xl relative shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full" />
              <div className="absolute top-10 -left-3 w-6 h-16 bg-white rounded-full -rotate-12" />
              <div className="absolute top-10 -right-3 w-6 h-16 bg-white rounded-full rotate-12" />
            </div>
          </div>
          <div className="flex justify-around text-xs text-gray-400 mt-4">
            <span>BRUSH</span>
            <span>TRAIL</span>
            <span>EMOTE</span>
          </div>
          <p className="text-center text-xs text-gray-500 mt-1">T-POSE</p>
        </div>
      </div>
    </div>
  );
}

function ProfileView() {
  return (
    <div className="w-full max-w-3xl p-4">
      <div className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-yellow-400 rounded-xl flex items-center justify-center text-black font-black text-2xl">
            1
          </div>
          <div>
            <h2 className="text-2xl font-bold">{PLAYER.name}</h2>
            <p className="text-sm text-gray-400">LVL {PLAYER.level} · 0 XP TOTAL</p>
            <div className="flex gap-2 mt-2">
              {['FIRST WIN', 'PAINT MASTER', 'IMPOSTOR', 'VETERAN', 'STYLIST'].map((badge) => (
                <span key={badge} className="text-xs px-2 py-1 bg-gray-700 rounded-full">{badge}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'ROUNDS', value: PLAYER.rounds },
          { label: 'WINS', value: PLAYER.wins },
          { label: 'IMPOSTOR WINS', value: 0 },
          { label: 'PAINTED', value: PLAYER.painted },
          { label: 'WIN RATE', value: '0%' },
          { label: 'ITEMS', value: PLAYER.items },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className="text-3xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardsView() {
  return (
    <div className="w-full max-w-2xl p-4">
      <p className="text-xs text-gray-400 mb-1">RANKINGS</p>
      <h2 className="text-2xl font-black mb-6">LEADERBOARDS</h2>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 mb-8">
        {[
          { rank: 2, name: 'GHOST_42', points: 11920, color: 'from-gray-400 to-gray-600' },
          { rank: 1, name: 'NEOPAINT', points: 12480, color: 'from-yellow-400 to-yellow-600', crown: true },
          { rank: 3, name: 'ARTIST_X', points: 10500, color: 'from-orange-400 to-orange-600' },
        ].map((player) => (
          <div key={player.rank} className={`text-center ${player.rank === 1 ? 'order-2' : player.rank === 2 ? 'order-1' : 'order-3'}`}>
            {player.crown && <Crown className="w-6 h-6 text-yellow-400 mx-auto mb-1" />}
            <div className={`w-16 h-16 bg-gradient-to-br ${player.color} rounded-full flex items-center justify-center font-black text-xl mb-2`}>
              {player.rank}
            </div>
            <p className="font-bold text-sm">{player.name}</p>
            <p className="text-xs text-gray-400">{player.points.toLocaleString()} PTS</p>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {LEADERBOARD.slice(3).map((player) => (
          <div 
            key={player.rank}
            className={`
              flex items-center justify-between p-3 rounded-xl
              ${player.isYou ? 'bg-yellow-400/20 border border-yellow-400/50' : 'bg-gray-800/50'}
            `}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center font-bold text-sm">
                {player.rank}
              </span>
              <span className={`font-bold ${player.isYou ? 'text-yellow-400' : ''}`}>
                {player.name} {player.isYou && '(YOU)'}
              </span>
            </div>
            <span className="font-bold text-yellow-400">{player.points.toLocaleString()} PTS</span>
          </div>
        ))}
      </div>
    </div>
  );
}
