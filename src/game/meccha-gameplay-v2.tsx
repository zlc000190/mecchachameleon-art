'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight,
  MeshBuilder, Color3, Color4,
  Mesh, PBRMaterial, StandardMaterial, ShadowGenerator, PointerEventTypes,
  UniversalCamera, Animation, ParticleSystem, Texture, Scalar
} from '@babylonjs/core';
import { ArrowLeft, Palette, Clock, Eye, EyeOff, Volume2, VolumeX, Move, Hand, Zap } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type GamePhase = 'prep' | 'seek' | 'result';
type RoleType = 'hider' | 'seeker';

interface GameProps {
  mode: string;
  role: RoleType;
  onExit: () => void;
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const PREP_TIME = 25;
const SEEK_TIME = 60;
const MAP_SIZE = 60;
const WALL_HEIGHT = 8;

// ─── Audio URLs (placeholder - will use Web Audio API for generated sounds) ────
const BG_MUSIC_URL = '';

export default function MecchaGameplay({ mode, role, onExit }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const playerRef = useRef<Mesh | null>(null);
  const playerBodyPartsRef = useRef<Mesh[]>([]);
  const cameraRef = useRef<ArcRotateCamera | null>(null);
  const inputMapRef = useRef<{ [key: string]: boolean }>({});
  const paintParticlesRef = useRef<ParticleSystem | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const [gamePhase, setGamePhase] = useState<GamePhase>('prep');
  const [timeLeft, setTimeLeft] = useState(PREP_TIME);
  const [isPaintMode, setIsPaintMode] = useState(false);
  const [currentColor, setCurrentColor] = useState('#FFFFFF');
  const [score, setScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [hiddenDuration, setHiddenDuration] = useState(0);

  // Initialize Audio Context
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Play a simple tone (placeholder for real music)
  const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'sine') => {
    if (isMuted || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [isMuted]);

  // Play background music loop
  const playBackgroundMusic = useCallback(() => {
    if (isMuted) return;
    
    const ctx = initAudio();
    if (!ctx) return;

    // Simple ambient loop using oscillators
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.05, startTime + 0.1);
      gain.gain.setValueAtTime(0.05, startTime + duration - 0.1);
      gain.gain.linearRampToValueAtTime(0, startTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Play a simple melody loop
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C major scale
    let time = ctx.currentTime;
    
    const loopMusic = () => {
      if (!isMuted && gamePhase !== 'result') {
        notes.forEach((note, i) => {
          playNote(note, time + i * 0.5, 0.4);
        });
        time += notes.length * 0.5;
        setTimeout(loopMusic, notes.length * 500);
      }
    };
    
    loopMusic();
  }, [isMuted, gamePhase, initAudio]);

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize Engine
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    engineRef.current = engine;
    
    const scene = new Scene(engine);
    sceneRef.current = scene;
    scene.clearColor = new Color4(0.1, 0.1, 0.15, 1);
    scene.shadowsEnabled = true;
    scene.fogEnabled = true;
    scene.fogDensity = 0.008;

    // Third person camera (sees the player character)
    const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 3, 25, Vector3.Zero(), scene);
    camera.lowerRadiusLimit = 15;
    camera.upperRadiusLimit = 50;
    camera.upperBetaLimit = Math.PI / 2.2;
    camera.attachControl(canvas, true);
    cameraRef.current = camera;

    // Lighting
    const hemiLight = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.6;
    hemiLight.groundColor = new Color3(0.3, 0.3, 0.4);

    const dirLight = new DirectionalLight('dir', new Vector3(-1, -2, -1), scene);
    dirLight.position = new Vector3(30, 50, 30);
    dirLight.intensity = 0.8;
    
    const shadowGen = new ShadowGenerator(2048, dirLight);
    shadowGen.useBlurExponentialShadowMap = true;
    shadowGen.blurKernel = 32;

    // Create large map with multiple zones
    createLargeMap(scene, shadowGen);

    // Create player character (visible from third person view)
    const player = createPlayerCharacter(scene, shadowGen);
    player.position = new Vector3(0, 0, 0);
    playerRef.current = player;

    // Camera follows player
    scene.registerBeforeRender(() => {
      if (playerRef.current && cameraRef.current) {
        cameraRef.current.target = playerRef.current.position.add(new Vector3(0, 2, 0));
      }
    });

    // Input handling
    const keyDown = (e: KeyboardEvent) => {
      inputMapRef.current[e.key.toLowerCase()] = true;
      
      // Toggle paint mode with E key
      if (e.key.toLowerCase() === 'e') {
        setIsPaintMode(prev => !prev);
        playTone(440, 0.1, 'square');
      }
    };
    const keyUp = (e: KeyboardEvent) => {
      inputMapRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    // Click to paint
    scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === PointerEventTypes.POINTERDOWN && isPaintMode) {
        const pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult.hit && pickResult.pickedMesh) {
          // Sample color from clicked surface
          const mat = pickResult.pickedMesh.material as PBRMaterial;
          if (mat && mat.albedoColor) {
            const color = mat.albedoColor;
            const hex = '#' + 
              Math.round(color.r * 255).toString(16).padStart(2, '0') +
              Math.round(color.g * 255).toString(16).padStart(2, '0') +
              Math.round(color.b * 255).toString(16).padStart(2, '0');
            setCurrentColor(hex);
            
            // Apply to all body parts
            playerBodyPartsRef.current.forEach(part => {
              const partMat = part.material as PBRMaterial;
              if (partMat) {
                partMat.albedoColor = color.clone();
              }
            });
            
            playTone(660, 0.15, 'sine');
            setIsPaintMode(false);
          }
        }
      }
    });

    // Movement
    let lastTime = performance.now();
    scene.registerBeforeRender(() => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!playerRef.current || gamePhase === 'result') return;

      const speed = 12 * dt;
      const input = inputMapRef.current;
      
      let moved = false;
      if (input['w'] || input['arrowup']) { playerRef.current.position.z += speed; moved = true; }
      if (input['s'] || input['arrowdown']) { playerRef.current.position.z -= speed; moved = true; }
      if (input['a'] || input['arrowleft']) { playerRef.current.position.x -= speed; moved = true; }
      if (input['d'] || input['arrowright']) { playerRef.current.position.x += speed; moved = true; }

      // Clamp to map bounds
      playerRef.current.position.x = Math.max(-MAP_SIZE/2 + 2, Math.min(MAP_SIZE/2 - 2, playerRef.current.position.x));
      playerRef.current.position.z = Math.max(-MAP_SIZE/2 + 2, Math.min(MAP_SIZE/2 - 2, playerRef.current.position.z));

      // Walking animation (bobbing)
      if (moved) {
        playerRef.current.position.y = Math.sin(now / 150) * 0.15;
        playerRef.current.rotation.y += 0.05;
      } else {
        playerRef.current.position.y = 0;
      }
    });

    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());

    // Start background music on first interaction
    canvas.addEventListener('click', playBackgroundMusic, { once: true });

    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      engine.dispose();
    };
  }, [role, playTone, playBackgroundMusic]);

  // Game timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (gamePhase === 'prep') {
            setGamePhase('seek');
            return SEEK_TIME;
          } else if (gamePhase === 'seek') {
            setGamePhase('result');
            setScore(prev => prev + 500); // Survival bonus
            return 0;
          }
        }
        
        if (gamePhase === 'prep') {
          // Track hidden time for scoring
          setHiddenDuration(d => d + 1);
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gamePhase]);

  // Play sound on phase change
  useEffect(() => {
    if (gamePhase === 'seek') {
      // Alert sound
      playTone(220, 0.3, 'sawtooth');
      playTone(196, 0.3, 'sawtooth');
    }
  }, [gamePhase, playTone]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-auto">
          <button 
            onClick={onExit}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/90 hover:bg-red-500 rounded-lg font-bold backdrop-blur-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> EXIT
          </button>

          <div className="flex items-center gap-4">
            {/* Role Badge */}
            <div className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${
              role === 'hider' ? 'bg-white text-black' : 'bg-red-600 text-white'
            }`}>
              {role === 'hider' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {role.toUpperCase()}
            </div>

            {/* Timer */}
            <div className={`px-4 py-2 rounded-lg backdrop-blur-sm flex items-center gap-2 ${
              timeLeft <= 5 ? 'bg-red-600/90 animate-pulse' : 'bg-black/60'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-bold text-xl">{timeLeft}s</span>
            </div>

            {/* Score */}
            <div className="px-4 py-2 bg-yellow-600/90 rounded-lg backdrop-blur-sm">
              <span className="font-bold">{score} PTS</span>
            </div>

            {/* Mute */}
            <button 
              onClick={toggleMute}
              className="p-2 bg-black/60 hover:bg-black/80 rounded-lg backdrop-blur-sm"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2">
          <div className={`px-6 py-3 rounded-full font-bold text-xl shadow-lg ${
            gamePhase === 'prep' ? 'bg-green-500/90 text-black' : 
            gamePhase === 'seek' ? 'bg-red-500/90 text-white animate-pulse' : 
            'bg-yellow-500/90 text-black'
          }`}>
            {gamePhase === 'prep' ? '⏱ HIDE & PAINT!' : 
             gamePhase === 'seek' ? '🔴 HUNTING PHASE!' : 
             '🎉 SURVIVED!'}
          </div>
        </div>

        {/* Hider UI */}
        {role === 'hider' && (
          <>
            {/* Paint Tool Button */}
            <button
              onClick={() => setIsPaintMode(!isPaintMode)}
              className={`pointer-events-auto absolute bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                isPaintMode 
                  ? 'bg-green-500 text-black scale-110 shadow-lg shadow-green-500/50' 
                  : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              <Palette className="w-5 h-5" />
              {isPaintMode ? 'CLICK TO SAMPLE COLOR' : 'E = PAINT MODE'}
            </button>

            {/* Current Color Preview */}
            <div className="absolute bottom-24 right-4 flex items-center gap-3 bg-black/60 backdrop-blur-sm rounded-lg p-3 pointer-events-auto">
              <Hand className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-400">Your Color:</span>
              <div 
                className="w-12 h-12 rounded-lg border-2 border-white shadow-lg"
                style={{ backgroundColor: currentColor }}
              />
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-300 flex items-center gap-4">
                <span className="flex items-center gap-1"><Move className="w-4 h-4" /> WASD = Move</span>
                <span className="flex items-center gap-1"><Palette className="w-4 h-4" /> E = Paint</span>
                <span className="flex items-center gap-1"><Hand className="w-4 h-4" /> Click = Sample</span>
              </p>
            </div>
          </>
        )}

        {/* Seeker UI */}
        {role === 'seeker' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-300 flex items-center gap-4">
              <span className="flex items-center gap-1"><Move className="w-4 h-4" /> WASD = Move</span>
              <span className="flex items-center gap-1"><Zap className="w-4 h-4" /> Mouse = Aim</span>
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> Click = Shoot</span>
            </p>
          </div>
        )}
      </div>

      {/* Result Modal */}
      {gamePhase === 'result' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-800 to-blue-900 rounded-3xl p-8 max-w-md w-full mx-4 text-center border border-purple-400/30">
            <h2 className="text-4xl font-black mb-2">
              {role === 'hider' ? '🎉 SURVIVED!' : '🏆 HUNT COMPLETE!'}
            </h2>
            
            <p className="text-gray-400 mb-4">
              {role === 'hider' ? 'You evaded the seekers!' : 'You found all the hiders!'}
            </p>
            
            <div className="bg-black/30 rounded-xl p-4 mb-6">
              <p className="text-3xl font-black text-yellow-400 mb-2">{score}</p>
              <p className="text-sm text-gray-400">FINAL SCORE</p>
              {role === 'hider' && (
                <p className="text-sm text-green-400 mt-2">
                  Hidden for {hiddenDuration} seconds
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 py-3 bg-gradient-to-r from-green-400 to-green-600 rounded-xl font-bold text-black"
              >
                PLAY AGAIN
              </button>
              <button 
                onClick={onExit}
                className="flex-1 py-3 bg-gray-700 rounded-xl font-bold"
              >
                LOBBY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Map Creation ─────────────────────────────────────────────────────────────

function createLargeMap(scene: Scene, shadowGen: ShadowGenerator) {
  // Large floor
  const floor = MeshBuilder.CreateGround('floor', { width: MAP_SIZE, height: MAP_SIZE }, scene);
  const floorMat = new PBRMaterial('floorMat', scene);
  floorMat.albedoColor = new Color3(0.75, 0.7, 0.65);
  floorMat.roughness = 0.9;
  floor.material = floorMat;
  floor.receiveShadows = true;

  // Create 4 themed zones
  const zones = [
    { x: -MAP_SIZE/4, z: -MAP_SIZE/4, color: new Color3(0.96, 0.78, 0.67), name: 'Peach', props: 'furniture' },
    { x: MAP_SIZE/4, z: -MAP_SIZE/4, color: new Color3(0.52, 0.7, 0.83), name: 'Blue', props: 'office' },
    { x: -MAP_SIZE/4, z: MAP_SIZE/4, color: new Color3(0.58, 0.78, 0.58), name: 'Green', props: 'nature' },
    { x: MAP_SIZE/4, z: MAP_SIZE/4, color: new Color3(0.75, 0.6, 0.8), name: 'Purple', props: 'decor' },
  ];

  zones.forEach((zone, i) => {
    // Zone floor marker
    const zoneFloor = MeshBuilder.CreateGround(`zone${i}`, { width: MAP_SIZE/2 - 4, height: MAP_SIZE/2 - 4 }, scene);
    zoneFloor.position = new Vector3(zone.x, 0.01, zone.z);
    const zoneMat = new PBRMaterial(`zoneMat${i}`, scene);
    zoneMat.albedoColor = zone.color;
    zoneMat.roughness = 0.95;
    zoneFloor.material = zoneMat;
    zoneFloor.receiveShadows = true;

    // Add props based on zone type
    addZoneProps(scene, shadowGen, zone.x, zone.z, zone.props, i);
  });

  // Outer walls
  const wallMat = new PBRMaterial('wallMat', scene);
  wallMat.albedoColor = new Color3(0.55, 0.35, 0.25);
  wallMat.roughness = 0.95;

  // Create boundary walls
  const wallPositions = [
    { w: MAP_SIZE + 2, h: WALL_HEIGHT, d: 2, x: 0, z: -MAP_SIZE/2 - 1, ry: 0 },
    { w: MAP_SIZE + 2, h: WALL_HEIGHT, d: 2, x: 0, z: MAP_SIZE/2 + 1, ry: 0 },
    { w: 2, h: WALL_HEIGHT, d: MAP_SIZE + 2, x: -MAP_SIZE/2 - 1, z: 0, ry: 0 },
    { w: 2, h: WALL_HEIGHT, d: MAP_SIZE + 2, x: MAP_SIZE/2 + 1, z: 0, ry: 0 },
  ];

  wallPositions.forEach((pos, i) => {
    const wall = MeshBuilder.CreateBox(`boundaryWall${i}`, { width: pos.w, height: pos.h, depth: pos.d }, scene);
    wall.position = new Vector3(pos.x, pos.h/2, pos.z);
    wall.rotation.y = pos.ry;
    wall.material = wallMat;
    wall.receiveShadows = true;
    shadowGen.addShadowCaster(wall);
  });

  // Add some interior walls/obstacles
  const interiorWalls = [
    { w: 15, h: 6, d: 1, x: -10, z: 0 },
    { w: 15, h: 6, d: 1, x: 10, z: 0 },
    { w: 1, h: 6, d: 15, x: 0, z: -10 },
    { w: 1, h: 6, d: 15, x: 0, z: 10 },
  ];

  interiorWalls.forEach((pos, i) => {
    const wall = MeshBuilder.CreateBox(`interiorWall${i}`, { width: pos.w, height: pos.h, depth: pos.d }, scene);
    wall.position = new Vector3(pos.x, pos.h/2, pos.z);
    wall.material = wallMat;
    wall.receiveShadows = true;
    shadowGen.addShadowCaster(wall);
  });
}

function addZoneProps(scene: Scene, shadowGen: ShadowGenerator, centerX: number, centerZ: number, type: string, zoneIndex: number) {
  const props: Mesh[] = [];

  const furniture = [
    // Living room items
    { type: 'couch', x: centerX - 8, z: centerZ - 8, color: new Color3(0.7, 0.2, 0.15), scale: 1 },
    { type: 'couch', x: centerX + 8, z: centerZ - 8, color: new Color3(0.15, 0.4, 0.6), scale: 1 },
    { type: 'bookshelf', x: centerX - 10, z: centerZ + 5, color: new Color3(0.4, 0.25, 0.1), scale: 1 },
    { type: 'bookshelf', x: centerX + 10, z: centerZ + 5, color: new Color3(0.3, 0.2, 0.15), scale: 1 },
    { type: 'table', x: centerX, z: centerZ, color: new Color3(0.55, 0.3, 0.08), scale: 1 },
    { type: 'plant', x: centerX - 5, z: centerZ + 10, color: new Color3(0.15, 0.6, 0.35), scale: 1 },
    { type: 'plant', x: centerX + 5, z: centerZ + 10, color: new Color3(0.1, 0.5, 0.3), scale: 1 },
    { type: 'rug', x: centerX, z: centerZ - 5, color: new Color3(0.5, 0.25, 0.6), scale: 1 },
    { type: 'lamp', x: centerX + 12, z: centerZ - 12, color: new Color3(0.9, 0.8, 0.6), scale: 1 },
    { type: 'cabinet', x: centerX - 12, z: centerZ - 3, color: new Color3(0.35, 0.2, 0.1), scale: 1 },
    // Hotel/Party items
    { type: 'piano', x: centerX + 15, z: centerZ + 5, color: new Color3(0.1, 0.1, 0.1), scale: 1 },
    { type: 'fridge', x: centerX - 15, z: centerZ + 8, color: new Color3(0.85, 0.85, 0.9), scale: 1 },
    { type: 'staircase', x: centerX + 20, z: centerZ - 10, color: new Color3(0.4, 0.25, 0.15), scale: 1 },
    { type: 'chandelier', x: centerX, z: centerZ - 10, color: new Color3(1, 0.9, 0.6), scale: 1 },
    { type: 'balloons', x: centerX + 5, z: centerZ - 15, color: new Color3(1, 0.3, 0.5), scale: 1 },
    { type: 'bed', x: centerX - 8, z: centerZ + 12, color: new Color3(0.6, 0.3, 0.5), scale: 1 },
    { type: 'dresser', x: centerX - 12, z: centerZ + 12, color: new Color3(0.35, 0.2, 0.1), scale: 1 },
    { type: 'mirror', x: centerX + 8, z: centerZ + 12, color: new Color3(0.8, 0.9, 1), scale: 1 },
  ];

  furniture.forEach((item, i) => {
    let mesh: Mesh;
    const mat = new PBRMaterial(`propMat${zoneIndex}_${i}`, scene);
    mat.albedoColor = item.color;
    mat.roughness = 0.7;

    switch (item.type) {
      case 'couch':
        mesh = MeshBuilder.CreateBox(`couch${zoneIndex}_${i}`, { width: 4, height: 1.2, depth: 2 }, scene);
        mesh.position.y = 0.6;
        const backrest = MeshBuilder.CreateBox(`back${zoneIndex}_${i}`, { width: 4, height: 1.2, depth: 0.4 }, scene);
        backrest.position = new Vector3(0, 1.2, -0.8);
        backrest.parent = mesh;
        backrest.material = mat;
        break;
      case 'bookshelf':
        mesh = MeshBuilder.CreateBox(`shelf${zoneIndex}_${i}`, { width: 3, height: 4, depth: 1 }, scene);
        mesh.position.y = 2;
        break;
      case 'table':
        mesh = MeshBuilder.CreateBox(`table${zoneIndex}_${i}`, { width: 3, height: 2, depth: 3 }, scene);
        mesh.position.y = 1;
        break;
      case 'plant':
        mesh = MeshBuilder.CreateCylinder(`pot${zoneIndex}_${i}`, { diameter: 1.5, height: 1.5 }, scene);
        mesh.position.y = 0.75;
        // Leaves
        for (let j = 0; j < 6; j++) {
          const leaf = MeshBuilder.CreateSphere(`leaf${zoneIndex}_${i}_${j}`, { diameter: 1.2 }, scene);
          const angle = (j / 6) * Math.PI * 2;
          leaf.position = new Vector3(Math.cos(angle) * 0.8, 1.5 + Math.random() * 0.5, Math.sin(angle) * 0.8);
          leaf.parent = mesh;
          const leafMat = new PBRMaterial(`leafMat${zoneIndex}_${i}_${j}`, scene);
          leafMat.albedoColor = new Color3(0.1 + Math.random() * 0.15, 0.5 + Math.random() * 0.2, 0.15);
          leaf.material = leafMat;
          shadowGen.addShadowCaster(leaf);
        }
        break;
      case 'rug':
        mesh = MeshBuilder.CreateGround(`rug${zoneIndex}_${i}`, { width: 5, height: 4 }, scene);
        mesh.position.y = 0.02;
        break;
      case 'lamp':
        mesh = MeshBuilder.CreateCylinder(`lamp${zoneIndex}_${i}`, { diameter: 0.3, height: 4 }, scene);
        mesh.position.y = 2;
        const shade = MeshBuilder.CreateCylinder(`shade${zoneIndex}_${i}`, { diameterTop: 1.5, diameterBottom: 0.5, height: 1 }, scene);
        shade.position.y = 4;
        shade.parent = mesh;
        const shadeMat = new PBRMaterial(`shadeMat${zoneIndex}_${i}`, scene);
        shadeMat.albedoColor = item.color;
        shadeMat.emissiveColor = new Color3(1, 0.95, 0.8);
        shade.material = shadeMat;
        break;
      case 'cabinet':
        mesh = MeshBuilder.CreateBox(`cab${zoneIndex}_${i}`, { width: 2, height: 3, depth: 1 }, scene);
        mesh.position.y = 1.5;
        break;
      case 'piano':
        // Piano body
        mesh = MeshBuilder.CreateBox(`piano${zoneIndex}_${i}`, { width: 4, height: 1.5, depth: 2 }, scene);
        mesh.position.y = 0.75;
        // Piano keys
        const keys = MeshBuilder.CreateBox(`pianoKeys${zoneIndex}_${i}`, { width: 4, height: 0.1, depth: 0.5 }, scene);
        keys.position = new Vector3(0, 1.6, 0.8);
        keys.parent = mesh;
        const keysMat = new PBRMaterial(`pianoKeysMat${zoneIndex}_${i}`, scene);
        keysMat.albedoColor = new Color3(0.95, 0.95, 0.95);
        keys.material = keysMat;
        // Piano lid
        const lid = MeshBuilder.CreateBox(`pianoLid${zoneIndex}_${i}`, { width: 4, height: 0.1, depth: 2 }, scene);
        lid.position = new Vector3(0, 3, -0.5);
        lid.rotation.x = 0.3;
        lid.parent = mesh;
        lid.material = mat;
        break;
      case 'fridge':
        mesh = MeshBuilder.CreateBox(`fridge${zoneIndex}_${i}`, { width: 2, height: 4, depth: 2 }, scene);
        mesh.position.y = 2;
        // Handle
        const handle = MeshBuilder.CreateBox(`fridgeHandle${zoneIndex}_${i}`, { width: 0.1, height: 1, depth: 0.1 }, scene);
        handle.position = new Vector3(0.9, 0, 1.05);
        handle.parent = mesh;
        const handleMat = new PBRMaterial(`handleMat${zoneIndex}_${i}`, scene);
        handleMat.albedoColor = new Color3(0.3, 0.3, 0.3);
        handle.material = handleMat;
        break;
      case 'staircase':
        mesh = MeshBuilder.CreateBox(`stairsBase${zoneIndex}_${i}`, { width: 6, height: 0.5, depth: 8 }, scene);
        mesh.position.y = 0.25;
        // Steps
        for (let s = 0; s < 8; s++) {
          const step = MeshBuilder.CreateBox(`step${zoneIndex}_${i}_${s}`, { width: 6, height: 0.3, depth: 1 }, scene);
          step.position = new Vector3(0, 0.5 + s * 0.4, -3.5 + s);
          step.parent = mesh;
          step.material = mat;
          shadowGen.addShadowCaster(step);
        }
        // Railing
        const railing = MeshBuilder.CreateBox(`railing${zoneIndex}_${i}`, { width: 0.2, height: 4, depth: 8 }, scene);
        railing.position = new Vector3(2.8, 2, 0);
        railing.parent = mesh;
        const railingMat = new PBRMaterial(`railingMat${zoneIndex}_${i}`, scene);
        railingMat.albedoColor = new Color3(0.6, 0.4, 0.2);
        railing.material = railingMat;
        break;
      case 'chandelier':
        // Ceiling mount
        mesh = MeshBuilder.CreateCylinder(`chandelierBase${zoneIndex}_${i}`, { diameter: 1, height: 0.5 }, scene);
        mesh.position.y = 7;
        // Chain
        const chain = MeshBuilder.CreateCylinder(`chain${zoneIndex}_${i}`, { diameter: 0.1, height: 3 }, scene);
        chain.position.y = 5.5;
        chain.parent = mesh;
        // Main body
        const body = MeshBuilder.CreateSphere(`chandelierBody${zoneIndex}_${i}`, { diameter: 2 }, scene);
        body.position.y = 3;
        body.parent = mesh;
        body.material = mat;
        // Lights
        for (let l = 0; l < 6; l++) {
          const light = MeshBuilder.CreateSphere(`light${zoneIndex}_${i}_${l}`, { diameter: 0.3 }, scene);
          const angle = (l / 6) * Math.PI * 2;
          light.position = new Vector3(Math.cos(angle) * 1.2, 2.5, Math.sin(angle) * 1.2);
          light.parent = mesh;
          const lightMat = new PBRMaterial(`lightMat${zoneIndex}_${i}_${l}`, scene);
          lightMat.albedoColor = new Color3(1, 0.95, 0.8);
          lightMat.emissiveColor = new Color3(1, 0.9, 0.5);
          light.material = lightMat;
        }
        break;
      case 'balloons':
        mesh = MeshBuilder.CreateBox(`balloonAnchor${zoneIndex}_${i}`, { width: 0.5, height: 0.1, depth: 0.5 }, scene);
        mesh.position.y = 0.05;
        // Balloons
        const balloonColors = [new Color3(1, 0.3, 0.5), new Color3(0.3, 0.7, 1), new Color3(1, 0.9, 0.3), new Color3(0.5, 1, 0.3)];
        for (let b = 0; b < 4; b++) {
          const balloon = MeshBuilder.CreateSphere(`balloon${zoneIndex}_${i}_${b}`, { diameter: 1.5 }, scene);
          balloon.position = new Vector3((Math.random() - 0.5) * 2, 3 + Math.random() * 2, (Math.random() - 0.5) * 2);
          balloon.parent = mesh;
          const balloonMat = new PBRMaterial(`balloonMat${zoneIndex}_${i}_${b}`, scene);
          balloonMat.albedoColor = balloonColors[b];
          balloonMat.roughness = 0.2;
          balloon.material = balloonMat;
          // String
          const string = MeshBuilder.CreateCylinder(`string${zoneIndex}_${i}_${b}`, { diameter: 0.02, height: 3 }, scene);
          string.position = new Vector3(0, -1.5, 0);
          string.parent = balloon;
        }
        break;
      case 'bed':
        // Mattress
        mesh = MeshBuilder.CreateBox(`bed${zoneIndex}_${i}`, { width: 3, height: 0.8, depth: 4 }, scene);
        mesh.position.y = 0.4;
        // Headboard
        const headboard = MeshBuilder.CreateBox(`headboard${zoneIndex}_${i}`, { width: 3, height: 2, depth: 0.3 }, scene);
        headboard.position = new Vector3(0, 1, -2);
        headboard.parent = mesh;
        headboard.material = mat;
        // Pillow
        const pillow = MeshBuilder.CreateBox(`pillow${zoneIndex}_${i}`, { width: 2, height: 0.3, depth: 1 }, scene);
        pillow.position = new Vector3(0, 0.9, -1.3);
        pillow.parent = mesh;
        const pillowMat = new PBRMaterial(`pillowMat${zoneIndex}_${i}`, scene);
        pillowMat.albedoColor = new Color3(0.95, 0.95, 0.95);
        pillow.material = pillowMat;
        break;
      case 'dresser':
        mesh = MeshBuilder.CreateBox(`dresser${zoneIndex}_${i}`, { width: 3, height: 2.5, depth: 1.5 }, scene);
        mesh.position.y = 1.25;
        // Drawers
        for (let d = 0; d < 3; d++) {
          const drawer = MeshBuilder.CreateBox(`drawer${zoneIndex}_${i}_${d}`, { width: 2.8, height: 0.6, depth: 0.1 }, scene);
          drawer.position = new Vector3(0, -0.6 + d * 0.7, 0.75);
          drawer.parent = mesh;
          const drawerMat = new PBRMaterial(`drawerMat${zoneIndex}_${i}_${d}`, scene);
          drawerMat.albedoColor = new Color3(item.color.r * 1.1, item.color.g * 1.1, item.color.b * 1.1);
          drawer.material = drawerMat;
        }
        break;
      case 'mirror':
        mesh = MeshBuilder.CreateBox(`mirrorFrame${zoneIndex}_${i}`, { width: 2, height: 3, depth: 0.2 }, scene);
        mesh.position.y = 1.5;
        // Mirror surface
        const mirrorSurface = MeshBuilder.CreateBox(`mirror${zoneIndex}_${i}`, { width: 1.6, height: 2.6, depth: 0.05 }, scene);
        mirrorSurface.position = new Vector3(0, 0, 0.1);
        mirrorSurface.parent = mesh;
        const mirrorMat = new PBRMaterial(`mirrorMat${zoneIndex}_${i}`, scene);
        mirrorMat.albedoColor = new Color3(0.9, 0.95, 1);
        mirrorMat.metallic = 0.9;
        mirrorMat.roughness = 0.1;
        mirrorSurface.material = mirrorMat;
        break;
      default:
        mesh = MeshBuilder.CreateBox(`prop${zoneIndex}_${i}`, { size: 2 }, scene);
        mesh.position.y = 1;
    }

    mesh.position.x = item.x;
    mesh.position.z = item.z;
    mesh.material = mat;
    mesh.receiveShadows = true;
    shadowGen.addShadowCaster(mesh);
    props.push(mesh);
  });

  return props;
}

function createPlayerCharacter(scene: Scene, shadowGen: ShadowGenerator): Mesh {
  const bodyParts: Mesh[] = [];

  // Body (capsule-like)
  const body = MeshBuilder.CreateCapsule('playerBody', { height: 2.5, radius: 0.6 }, scene);
  body.position.y = 1.5;

  // Head
  const head = MeshBuilder.CreateSphere('playerHead', { diameter: 1.2 }, scene);
  head.position.y = 3.1;
  head.parent = body;

  // Eyes
  const leftEye = MeshBuilder.CreateSphere('leftEye', { diameter: 0.3 }, scene);
  leftEye.position = new Vector3(-0.25, 3.2, 0.55);
  leftEye.parent = body;
  
  const rightEye = MeshBuilder.CreateSphere('rightEye', { diameter: 0.3 }, scene);
  rightEye.position = new Vector3(0.25, 3.2, 0.55);
  rightEye.parent = body;

  // Arms
  const leftArm = MeshBuilder.CreateCapsule('leftArm', { height: 1.5, radius: 0.2 }, scene);
  leftArm.position = new Vector3(-0.9, 2, 0);
  leftArm.rotation.z = 0.3;
  leftArm.parent = body;

  const rightArm = MeshBuilder.CreateCapsule('rightArm', { height: 1.5, radius: 0.2 }, scene);
  rightArm.position = new Vector3(0.9, 2, 0);
  rightArm.rotation.z = -0.3;
  rightArm.parent = body;

  // Legs
  const leftLeg = MeshBuilder.CreateCapsule('leftLeg', { height: 1.2, radius: 0.25 }, scene);
  leftLeg.position = new Vector3(-0.35, 0.3, 0);
  leftLeg.parent = body;

  const rightLeg = MeshBuilder.CreateCapsule('rightLeg', { height: 1.2, radius: 0.25 }, scene);
  rightLeg.position = new Vector3(0.35, 0.3, 0);
  rightLeg.parent = body;

  // Material - white rubber/slime look
  const mat = new PBRMaterial('playerMat', scene);
  mat.albedoColor = new Color3(1, 1, 1);
  mat.roughness = 0.3;
  mat.metallic = 0;
  mat.subSurface.isRefractionEnabled = true;
  mat.subSurface.indexOfRefraction = 1.4;

  // White material for eyes
  const eyeMat = new StandardMaterial('eyeMat', scene);
  eyeMat.diffuseColor = new Color3(1, 1, 1);
  eyeMat.emissiveColor = new Color3(0.3, 0.3, 0.3);

  body.material = mat;
  head.material = mat;
  leftArm.material = mat;
  rightArm.material = mat;
  leftLeg.material = mat;
  rightLeg.material = mat;
  leftEye.material = eyeMat;
  rightEye.material = eyeMat;

  // Collect body parts for color changing
  bodyParts.push(body, head, leftArm, rightArm, leftLeg, rightLeg);

  // Add to global ref (will be populated in component)
  (window as unknown as { playerBodyParts: Mesh[] }).playerBodyParts = bodyParts;

  shadowGen.addShadowCaster(body);
  shadowGen.addShadowCaster(head);

  return body;
}

// Helper to get body parts
function getPlayerBodyParts(): Mesh[] {
  return (window as unknown as { playerBodyParts: Mesh[] }).playerBodyParts || [];
}
