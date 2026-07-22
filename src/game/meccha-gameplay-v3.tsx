'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight,
  MeshBuilder, Color3, Color4,
  Mesh, PBRMaterial, ShadowGenerator, PointerEventTypes,
  Animation, ParticleSystem, Scalar, StandardMaterial
} from '@babylonjs/core';
import { ArrowLeft, Palette, Clock, EyeOff, Volume2, VolumeX, Move, Hand, Zap, Star, Sparkles, Shield, Zap as ZapIcon, Snowflake, Timer } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type GamePhase = 'prep' | 'seek' | 'result' | 'between-waves' | 'game-over';
type RoleType = 'hider' | 'seeker';
type SeekerMode = 'patrol' | 'chase' | 'search';
type PowerUpType = 'invisibility' | 'speed' | 'smoke' | 'freeze' | 'double';

interface WaveConfig {
  wave: number;
  seekers: number;
  speedMult: number;
  trapZones: boolean;
  prepTime: number;
  seekTime: number;
}

interface PowerUp {
  id: string;
  type: PowerUpType;
  position: Vector3;
  mesh: Mesh;
  active: boolean;
}

interface GameProps {
  mode: string;
  role: RoleType;
  onExit: () => void;
}

// ─── Wave Configuration (Layer 1) ──────────────────────────────────────────────
const WAVE_CONFIG: WaveConfig[] = [
  { wave: 1, seekers: 1, speedMult: 0.6,  trapZones: false, prepTime: 25, seekTime: 30 },
  { wave: 2, seekers: 1, speedMult: 0.8,  trapZones: false, prepTime: 15, seekTime: 30 },
  { wave: 3, seekers: 2, speedMult: 1.0,  trapZones: false, prepTime: 10, seekTime: 30 },
  { wave: 4, seekers: 2, speedMult: 1.3,  trapZones: true,  prepTime: 8,  seekTime: 30 },
  { wave: 5, seekers: 3, speedMult: 1.5,  trapZones: true,  prepTime: 5,  seekTime: 45 },
];

// ─── Map Constants (Layer 3) ───────────────────────────────────────────────────
const MAP_SIZE = 72; // 12×12 zones
const ZONE_SIZE = 18; // each zone is 18 units
const WALL_HEIGHT = 10;

// ─── Power-up Config (Layer 5) ─────────────────────────────────────────────────
const POWERUP_DURATION: Record<PowerUpType, number> = {
  invisibility: 5,
  speed: 6,
  smoke: 3,
  freeze: 4,
  double: 8,
};

// ─── Power-up Icon Map ─────────────────────────────────────────────────────────
const POWERUP_ICONS: Record<PowerUpType, string> = {
  invisibility: '👻',
  speed: '👟',
  smoke: '💨',
  freeze: '❄️',
  double: '✨',
};

// ─── Zone definitions (Layer 3) ───────────────────────────────────────────────
interface Zone {
  name: string;
  cx: number; cz: number;
  floorColor: Color3;
  wallColor: Color3;
  props: { type: string; ox: number; oz: number; color: Color3; scale?: number; rotY?: number }[];
}

const ZONES: Zone[] = [
  {
    name: 'Kitchen',
    cx: -18, cz: -18,
    floorColor: new Color3(0.9, 0.55, 0.3),   // warm orange
    wallColor: new Color3(0.85, 0.7, 0.5),
    props: [
      { type: 'counter', ox: -5, oz: -4, color: new Color3(0.6, 0.55, 0.5) },
      { type: 'counter', ox: 5, oz: -4, color: new Color3(0.6, 0.55, 0.5) },
      { type: 'fridge', ox: -7, oz: 2, color: new Color3(0.8, 0.8, 0.85) },
      { type: 'stove', ox: -3, oz: -5, color: new Color3(0.2, 0.2, 0.2) },
      { type: 'table', ox: 0, oz: 2, color: new Color3(0.7, 0.45, 0.2) },
      { type: 'chair', ox: -2, oz: 2, color: new Color3(0.6, 0.35, 0.15) },
      { type: 'chair', ox: 2, oz: 2, color: new Color3(0.6, 0.35, 0.15) },
      { type: 'plant', ox: 7, oz: -2, color: new Color3(0.2, 0.65, 0.3) },
      { type: 'shelf', ox: 7, oz: 5, color: new Color3(0.5, 0.3, 0.15) },
    ],
  },
  {
    name: 'Garden',
    cx: 18, cz: -18,
    floorColor: new Color3(0.35, 0.65, 0.3),   // grass green
    wallColor: new Color3(0.55, 0.75, 0.45),
    props: [
      { type: 'tree', ox: -6, oz: -4, color: new Color3(0.25, 0.5, 0.2) },
      { type: 'tree', ox: 6, oz: -4, color: new Color3(0.2, 0.55, 0.25) },
      { type: 'bush', ox: -3, oz: 5, color: new Color3(0.3, 0.6, 0.25) },
      { type: 'bush', ox: 3, oz: 5, color: new Color3(0.28, 0.58, 0.22) },
      { type: 'fountain', ox: 0, oz: 0, color: new Color3(0.7, 0.7, 0.75) },
      { type: 'bench', ox: -7, oz: 2, color: new Color3(0.45, 0.3, 0.12) },
      { type: 'bench', ox: 7, oz: 2, color: new Color3(0.45, 0.3, 0.12) },
      { type: 'flowerbed', ox: 0, oz: 6, color: new Color3(0.8, 0.2, 0.5) },
    ],
  },
  {
    name: 'Bathroom',
    cx: -18, cz: 18,
    floorColor: new Color3(0.75, 0.88, 0.95),  // light blue tile
    wallColor: new Color3(0.6, 0.75, 0.85),
    props: [
      { type: 'bathtub', ox: -4, oz: 0, color: new Color3(0.95, 0.95, 1) },
      { type: 'toilet', ox: 5, oz: -4, color: new Color3(0.92, 0.93, 0.94) },
      { type: 'sink', ox: -4, oz: -5, color: new Color3(0.9, 0.9, 0.92) },
      { type: 'cabinet', ox: 4, oz: 5, color: new Color3(0.4, 0.3, 0.25) },
      { type: 'mirror', ox: 0, oz: -6, color: new Color3(0.75, 0.88, 0.95), scale: 1.5 },
      { type: 'plant', ox: 6, oz: 2, color: new Color3(0.3, 0.6, 0.35) },
    ],
  },
  {
    name: 'Party Hall',
    cx: 18, cz: 18,
    floorColor: new Color3(0.45, 0.3, 0.55),   // deep purple
    wallColor: new Color3(0.35, 0.2, 0.45),
    props: [
      { type: 'piano', ox: -5, oz: -3, color: new Color3(0.1, 0.08, 0.08) },
      { type: 'balloons', ox: 3, oz: -5, color: new Color3(1, 0.2, 0.4) },
      { type: 'balloons', ox: 6, oz: -2, color: new Color3(0.3, 0.5, 1) },
      { type: 'chandelier', ox: 0, oz: 3, color: new Color3(1, 0.9, 0.5) },
      { type: 'sofa', ox: -4, oz: 5, color: new Color3(0.6, 0.15, 0.4) },
      { type: 'sofa', ox: 4, oz: 5, color: new Color3(0.6, 0.15, 0.4) },
      { type: 'table', ox: 0, oz: 6, color: new Color3(0.3, 0.2, 0.35) },
      { type: 'dj_stand', ox: 6, oz: -5, color: new Color3(0.15, 0.1, 0.2) },
    ],
  },
];

export default function MecchaGameplay({ mode, role, onExit }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const playerRef = useRef<Mesh | null>(null);
  const playerBodyPartsRef = useRef<Mesh[]>([]);
  const cameraRef = useRef<ArcRotateCamera | null>(null);
  const inputMapRef = useRef<{ [k: string]: boolean }>({});
  const seekersRef = useRef<Mesh[]>([]);
  const seekerStatesRef = useRef<{ mesh: Mesh; mode: SeekerMode; target: Vector3; patrolAngle: number; lastKnownPlayerPos: Vector3 | null; freezeTimer: number }[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const activePowerUpsRef = useRef<{ type: PowerUpType; endTime: number }[]>([]);
  const trapZonesRef = useRef<Mesh[]>([]);
  const comboTimerRef = useRef(0);
  const comboCountRef = useRef(0);
  const nearMissRef = useRef(false);
  const nearMissCooldownRef = useRef(0);
  const colorMatchTimerRef = useRef(0);
  const scoreAnimRef = useRef<number>(0);
  const screenShakeRef = useRef(0);
  const particlesRef = useRef<ParticleSystem[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const waveRef = useRef(0);
  const phaseRef = useRef<GamePhase>('prep');

  // ─── State ──────────────────────────────────────────────────────────────────
  const [wave, setWave] = useState(1);
  const [phase, setPhase] = useState<GamePhase>('prep');
  const [timeLeft, setTimeLeft] = useState(WAVE_CONFIG[0].prepTime);
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaintMode, setIsPaintMode] = useState(false);
  const [currentColor, setCurrentColor] = useState('#FFFFFF');
  const [combo, setCombo] = useState(1);
  const [comboFlash, setComboFlash] = useState(false);
  const [waveStars, setWaveStars] = useState<number[]>([]);
  const [nearMissFlash, setNearMissFlash] = useState(false);
  const [caught, setCaught] = useState(false);
  const [activePowerUps, setActivePowerUps] = useState<{ type: PowerUpType; remaining: number }[]>([]);
  const [powerUpSpawn, setPowerUpSpawn] = useState(false);
  const [waveAnnounce, setWaveAnnounce] = useState('');
  const [colorMatchPct, setColorMatchPct] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // ─── Audio ──────────────────────────────────────────────────────────────────
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.08) => {
    if (isMuted || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }, [isMuted]);

  const playCombo = useCallback(() => {
    playTone(523, 0.1, 'square', 0.06);
    setTimeout(() => playTone(659, 0.1, 'square', 0.06), 80);
    setTimeout(() => playTone(784, 0.15, 'square', 0.06), 160);
  }, [playTone]);

  // ─── Map creation (Layer 3) ────────────────────────────────────────────────
  const createThemedMap = useCallback((scene: Scene, shadowGen: ShadowGenerator) => {
    // ── Floor (checkerboard per zone) ──
    const floorMat = new StandardMaterial('floorMat', scene);
    floorMat.diffuseColor = new Color3(0.5, 0.5, 0.55);

    ZONES.forEach((zone, zi) => {
      const zf = MeshBuilder.CreateGround(`zone_floor_${zi}`, { width: ZONE_SIZE - 1, height: ZONE_SIZE - 1 }, scene);
      zf.position = new Vector3(zone.cx, 0.01, zone.cz);
      const mat = new PBRMaterial(`zone_floor_mat_${zi}`, scene);
      mat.albedoColor = zone.floorColor;
      mat.roughness = 0.85;
      mat.metallic = 0;
      zf.material = mat;
      zf.receiveShadows = true;

      // Zone walls (partial, with doorways)
      const wallMat = new PBRMaterial(`zone_wall_mat_${zi}`, scene);
      wallMat.albedoColor = zone.wallColor;
      wallMat.roughness = 0.9;

      // Create 4 walls around zone (with door openings)
      const wallDefs = [
        // top, bottom, left, right walls
        { w: ZONE_SIZE, h: WALL_HEIGHT, d: 1, x: zone.cx, z: zone.cz - ZONE_SIZE / 2 + 0.5 },
        { w: ZONE_SIZE, h: WALL_HEIGHT, d: 1, x: zone.cx, z: zone.cz + ZONE_SIZE / 2 - 0.5 },
        { w: 1, h: WALL_HEIGHT, d: ZONE_SIZE, x: zone.cx - ZONE_SIZE / 2 + 0.5, z: zone.cz },
        { w: 1, h: WALL_HEIGHT, d: ZONE_SIZE, x: zone.cx + ZONE_SIZE / 2 - 0.5, z: zone.cz },
      ];

      wallDefs.forEach((wd, wi) => {
        const wall = MeshBuilder.CreateBox(`zone_wall_${zi}_${wi}`, { width: wd.w, height: wd.h, depth: wd.d }, scene);
        wall.position = new Vector3(wd.x, wd.h / 2, wd.z);
        wall.material = wallMat;
        wall.receiveShadows = true;
        shadowGen.addShadowCaster(wall);
      });

      // ── Props ──
      zone.props.forEach((prop, pi) => {
        const px = zone.cx + prop.ox;
        const pz = zone.cz + prop.oz;
        const sc = prop.scale || 1;
        const propMat = new PBRMaterial(`prop_mat_${zi}_${pi}`, scene);
        propMat.albedoColor = prop.color;
        propMat.roughness = 0.7;

        let mesh: Mesh;
        switch (prop.type) {
          case 'counter':
            mesh = MeshBuilder.CreateBox(`prop_${zi}_${pi}`, { width: 6 * sc, height: 2.5 * sc, depth: 2 * sc }, scene);
            mesh.position = new Vector3(px, 1.25 * sc, pz);
            break;
          case 'fridge':
            mesh = MeshBuilder.CreateBox(`prop_${zi}_${pi}`, { width: 2 * sc, height: 4 * sc, depth: 2 * sc }, scene);
            mesh.position = new Vector3(px, 2 * sc, pz);
            break;
          case 'stove':
            mesh = MeshBuilder.CreateBox(`prop_${zi}_${pi}`, { width: 2.5 * sc, height: 2 * sc, depth: 2 * sc }, scene);
            mesh.position = new Vector3(px, 1 * sc, pz);
            break;
          case 'table':
            mesh = MeshBuilder.CreateBox(`prop_${zi}_${pi}`, { width: 4 * sc, height: 1.8 * sc, depth: 4 * sc }, scene);
            mesh.position = new Vector3(px, 0.9 * sc, pz);
            break;
          case 'chair':
            mesh = MeshBuilder.CreateBox(`prop_${zi}_${pi}`, { width: 1.2 * sc, height: 2 * sc, depth: 1.2 * sc }, scene);
            mesh.position = new Vector3(px, 1 * sc, pz);
            if (prop.rotY) mesh.rotation.y = prop.rotY;
            break;
          case 'plant':
            mesh = MeshBuilder.CreateCylinder(`prop_${zi}_${pi}`, { diameter: 2 * sc, height: 1.5 * sc }, scene);
            mesh.position = new Vector3(px, 0.75 * sc, pz);
            propMat.albedoColor = new Color3(0.4, 0.25, 0.1);
            for (let l = 0; l < 5; l++) {
              const leaf = MeshBuilder.CreateSphere(`leaf_${zi}_${pi}_${l}`, { diameter: 1.5 * sc }, scene);
              leaf.position = new Vector3(px + Math.cos(l * 1.25) * 0.8 * sc, 2 * sc, pz + Math.sin(l * 1.25) * 0.8 * sc);
              const leafMat = new PBRMaterial(`leaf_mat_${zi}_${pi}_${l}`, scene);
              leafMat.albedoColor = prop.color;
              leaf.material = leafMat;
              leaf.receiveShadows = true;
              shadowGen.addShadowCaster(leaf);
            }
            break;
          case 'bush':
            mesh = MeshBuilder.CreateSphere(`prop_${zi}_${pi}`, { diameter: 2.5 * sc }, scene);
            mesh.position = new Vector3(px, 1.2 * sc, pz);
            mesh.scaling.y = 0.7;
            break;
          case 'tree':
            mesh = MeshBuilder.CreateCylinder(`prop_${zi}_${pi}`, { diameterTop: 0, diameterBottom: 2 * sc, height: 4 * sc }, scene);
            mesh.position = new Vector3(px, 2 * sc, pz);
            propMat.albedoColor = new Color3(0.35, 0.2, 0.1);
            const top = MeshBuilder.CreateSphere(`tree_top_${zi}_${pi}`, { diameter: 4 * sc }, scene);
            top.position = new Vector3(px, 5 * sc, pz);
            top.scaling.y = 0.8;
            const topMat = new PBRMaterial(`tree_top_mat_${zi}_${pi}`, scene);
            topMat.albedoColor = prop.color;
            top.material = topMat;
            top.receiveShadows = true;
            shadowGen.addShadowCaster(top);
            break;
          case 'fountain':
            mesh = MeshBuilder.CreateCylinder(`prop_${zi}_${pi}`, { diameter: 4 * sc, height: 1 * sc }, scene);
            mesh.position = new Vector3(px, 0.5 * sc, pz);
            propMat.albedoColor = prop.color;
            break;
          case 'bench':
            mesh = MeshBuilder.CreateBox(`prop_${zi}_${pi}`, { width: 4 * sc, height: 1 * sc, depth: 1.5 * sc }, scene);
            mesh.position = new Vector3(px, 0.5 * sc, pz);
            break;
          case 'flowerbed':
            mesh = MeshBuilder.CreateBox(`prop_${zi}_${pi}`, { width: 5 * sc, height: 0.5 * sc, depth: 2 * sc }, scene);
            mesh.position = new Vector3(px, 0.25 * sc, pz);
            propMat.albedoColor = prop.color;
            break;
          case 'bathtub':
            mesh = MeshBuilder.CreateBox(`prop_${zi}_${pi}`, { width: 2.5 * sc, height: 1.2 * sc, depth: 5 * sc }, scene);
            mesh.position = new Vector3(px, 0.6 * sc, pz);
            propMat.albedoColor = prop.color;
            break;
          case 'toilet':
            mesh = MeshBuilder.CreateBox(`prop_${zi}_${pi}`, { width: 1.5 * sc, height: 1.5 * sc, depth: 2 * sc }, scene);
            mesh.position = new Vector3(px, 0.75 * sc, pz);
            break;
          case 'sink':
            mesh = MeshBuilder.CreateBox(`prop_${zi}_${pi}`, { width: 2 * sc, height: 2 * sc, depth: 1.5 * sc }, scene);
            mesh.position = new Vector3(px, 1 * sc, pz);
            break;
          case 'cabinet':
            mesh = MeshBuilder.CreateBox(`prop_${zi}_${pi}`, { width: 2.5 * sc, height: 2.5 * sc, depth: 1.5 * sc }, scene);
            mesh.position = new Vector3(px, 1.25 * sc, pz);
            break;
          case 'mirror':
            mesh = MeshBuilder.CreateBox(`prop_${zi}_${pi}`, { width: 0.1 * sc, height: 3 * sc, depth: 2 * sc }, scene);
            mesh.position = new Vector3(px, 1.5 * sc, pz);
            propMat.albedoColor = prop.color;
            propMat.metallic = 0.8;
            propMat.roughness = 0.15;
            break;
          case 'piano':
            mesh = MeshBuilder.CreateBox(`prop_${zi}_${pi}`, { width: 4 * sc, height: 1.5 * sc, depth: 5 * sc }, scene);
            mesh.position = new Vector3(px, 0.75 * sc, pz);
            if (prop.rotY) mesh.rotation.y = prop.rotY;
            break;
          case 'balloons':
            mesh = MeshBuilder.CreateBox(`prop_${zi}_${pi}`, { width: 0.3, height: 0.3, depth: 0.3 }, scene);
            mesh.position = new Vector3(px, 0.15, pz);
            for (let b = 0; b < 4; b++) {
              const bal = MeshBuilder.CreateSphere(`bal_${zi}_${pi}_${b}`, { diameter: 1.2 * sc }, scene);
              bal.position = new Vector3(px + (b % 2) * 1.5 - 0.75, 2 + b * 0.8, pz + Math.floor(b / 2) * 1.5 - 0.75);
              const balMat = new PBRMaterial(`bal_mat_${zi}_${pi}_${b}`, scene);
              balMat.albedoColor = new Color3(
                0.5 + b * 0.15, 0.2 + b * 0.1, 0.5 + b * 0.1
              );
              balMat.roughness = 0.25;
              bal.material = balMat;
              bal.receiveShadows = true;
              shadowGen.addShadowCaster(bal);
            }
            break;
          case 'chandelier':
            mesh = MeshBuilder.CreateSphere(`prop_${zi}_${pi}`, { diameter: 3 * sc }, scene);
            mesh.position = new Vector3(px, WALL_HEIGHT - 2, pz);
            propMat.emissiveColor = new Color3(1, 0.9, 0.5);
            break;
          case 'sofa':
            mesh = MeshBuilder.CreateBox(`prop_${zi}_${pi}`, { width: 4 * sc, height: 1.2 * sc, depth: 2 * sc }, scene);
            mesh.position = new Vector3(px, 0.6 * sc, pz);
            if (prop.rotY) mesh.rotation.y = prop.rotY;
            break;
          case 'dj_stand':
            mesh = MeshBuilder.CreateBox(`prop_${zi}_${pi}`, { width: 2 * sc, height: 3 * sc, depth: 2 * sc }, scene);
            mesh.position = new Vector3(px, 1.5 * sc, pz);
            break;
          default:
            mesh = MeshBuilder.CreateBox(`prop_${zi}_${pi}`, { size: 2 * sc }, scene);
            mesh.position = new Vector3(px, 1 * sc, pz);
        }
        mesh.material = propMat;
        mesh.receiveShadows = true;
        shadowGen.addShadowCaster(mesh);
      });
    });

    // ── Outer boundary walls ──
    const outerMat = new PBRMaterial('outerWallMat', scene);
    outerMat.albedoColor = new Color3(0.3, 0.25, 0.2);
    outerMat.roughness = 0.95;

    const half = MAP_SIZE / 2 + 1;
    const wallDefs = [
      { w: MAP_SIZE + 4, d: 2, x: 0, z: -half },
      { w: MAP_SIZE + 4, d: 2, x: 0, z: half },
      { w: 2, d: MAP_SIZE + 4, x: -half, z: 0 },
      { w: 2, d: MAP_SIZE + 4, x: half, z: 0 },
    ];
    wallDefs.forEach((wd, wi) => {
      const wall = MeshBuilder.CreateBox(`outer_wall_${wi}`, { width: wd.w, height: WALL_HEIGHT, depth: wd.d }, scene);
      wall.position = new Vector3(wd.x, WALL_HEIGHT / 2, wd.z);
      wall.material = outerMat;
      shadowGen.addShadowCaster(wall);
    });

    // ── Trap zones (visible markers) ──
    const trapMat = new StandardMaterial('trapMat', scene);
    trapMat.diffuseColor = new Color3(0.8, 0.1, 0.1);
    trapMat.alpha = 0.25;

    // Place 3 trap zones at corners
    const trapPositions = [
      new Vector3(-25, 0.05, -25),
      new Vector3(25, 0.05, 25),
      new Vector3(-25, 0.05, 25),
    ];
    trapPositions.forEach((pos, ti) => {
      const trap = MeshBuilder.CreateGround(`trap_${ti}`, { width: 8, height: 8 }, scene);
      trap.position = pos;
      trap.material = trapMat;
      trapZonesRef.current.push(trap);
    });
  }, []);

  // ─── Player character ────────────────────────────────────────────────────────
  const createPlayer = useCallback((scene: Scene, shadowGen: ShadowGenerator): Mesh => {
    const body = MeshBuilder.CreateCapsule('playerBody', { height: 2.5, radius: 0.6 }, scene);
    body.position.y = 1.5;

    const head = MeshBuilder.CreateSphere('playerHead', { diameter: 1.2 }, scene);
    head.position.y = 3.1;
    head.parent = body;

    const leftEye = MeshBuilder.CreateSphere('lEye', { diameter: 0.28 }, scene);
    leftEye.position = new Vector3(-0.25, 3.2, 0.55);
    leftEye.parent = body;
    const rightEye = MeshBuilder.CreateSphere('rEye', { diameter: 0.28 }, scene);
    rightEye.position = new Vector3(0.25, 3.2, 0.55);
    rightEye.parent = body;

    const leftArm = MeshBuilder.CreateCapsule('lArm', { height: 1.5, radius: 0.18 }, scene);
    leftArm.position = new Vector3(-0.9, 2, 0);
    leftArm.rotation.z = 0.3;
    leftArm.parent = body;

    const rightArm = MeshBuilder.CreateCapsule('rArm', { height: 1.5, radius: 0.18 }, scene);
    rightArm.position = new Vector3(0.9, 2, 0);
    rightArm.rotation.z = -0.3;
    rightArm.parent = body;

    const leftLeg = MeshBuilder.CreateCapsule('lLeg', { height: 1.2, radius: 0.22 }, scene);
    leftLeg.position = new Vector3(-0.35, 0.3, 0);
    leftLeg.parent = body;

    const rightLeg = MeshBuilder.CreateCapsule('rLeg', { height: 1.2, radius: 0.22 }, scene);
    rightLeg.position = new Vector3(0.35, 0.3, 0);
    rightLeg.parent = body;

    const parts = [body, head, leftEye, rightEye, leftArm, rightArm, leftLeg, rightLeg];

    // White rubber-like material
    const mat = new PBRMaterial('playerMat', scene);
    mat.albedoColor = new Color3(1, 1, 1);
    mat.roughness = 0.35;
    mat.metallic = 0.0;
    parts.forEach(p => {
      p.material = mat;
      p.receiveShadows = true;
      shadowGen.addShadowCaster(p);
      playerBodyPartsRef.current.push(p);
    });

    return body;
  }, []);

  // ─── Seeker creation ────────────────────────────────────────────────────────
  const createSeeker = useCallback((scene: Scene, shadowGen: ShadowGenerator, index: number): { mesh: Mesh; state: { mesh: Mesh; mode: SeekerMode; target: Vector3; patrolAngle: number; lastKnownPlayerPos: Vector3 | null; freezeTimer: number } } => {
    const body = MeshBuilder.CreateCapsule(`seeker_${index}`, { height: 2.8, radius: 0.65 }, scene);
    body.position = new Vector3(20 + index * 5, 1.5, 20 + index * 3);

    const head = MeshBuilder.CreateSphere(`seeker_head_${index}`, { diameter: 1.3 }, scene);
    head.position.y = 3.2;
    head.parent = body;

    // Angry eyes
    const eyeL = MeshBuilder.CreateSphere(`seeker_eye_l_${index}`, { diameter: 0.35 }, scene);
    eyeL.position = new Vector3(-0.28, 3.3, 0.6);
    eyeL.parent = body;
    const eyeR = MeshBuilder.CreateSphere(`seeker_eye_r_${index}`, { diameter: 0.35 }, scene);
    eyeR.position = new Vector3(0.28, 3.3, 0.6);
    eyeR.parent = body;

    const mat = new PBRMaterial(`seeker_mat_${index}`, scene);
    mat.albedoColor = new Color3(0.9, 0.15, 0.1);
    mat.roughness = 0.3;
    mat.metallic = 0.0;

    const eyeMat = new PBRMaterial(`seeker_eye_mat_${index}`, scene);
    eyeMat.albedoColor = new Color3(1, 1, 0);
    eyeMat.emissiveColor = new Color3(0.8, 0.8, 0);

    [body, head, eyeL, eyeR].forEach(m => {
      m.material = m === body || m === head ? mat : eyeMat;
      m.receiveShadows = true;
      shadowGen.addShadowCaster(m);
    });

    const state = {
      mesh: body,
      mode: 'patrol' as SeekerMode,
      target: new Vector3(Math.random() * 40 - 20, 1.5, Math.random() * 40 - 20),
      patrolAngle: Math.random() * Math.PI * 2,
      lastKnownPlayerPos: null,
      freezeTimer: 0,
    };

    return { mesh: body, state };
  }, []);

  // ─── Power-up spawner ───────────────────────────────────────────────────────
  const spawnPowerUp = useCallback((scene: Scene) => {
    const types: PowerUpType[] = ['invisibility', 'speed', 'smoke', 'freeze', 'double'];
    const type = types[Math.floor(Math.random() * types.length)];

    const px = (Math.random() - 0.5) * (MAP_SIZE - 10);
    const pz = (Math.random() - 0.5) * (MAP_SIZE - 10);
    const pos = new Vector3(px, 1.5, pz);

    const mesh = MeshBuilder.CreateBox(`powerup_${Date.now()}`, { size: 1.5 }, scene);
    mesh.position = pos;

    const mat = new PBRMaterial(`powerup_mat_${Date.now()}`, scene);
    mat.albedoColor = new Color3(1, 0.9, 0.2);
    mat.emissiveColor = new Color3(0.8, 0.7, 0);
    mesh.material = mat;
    mesh.isPickable = false;

    // Floating animation
    let t = 0;
    const floatAnim = scene.onBeforeRenderObservable.add(() => {
      t += 0.05;
      mesh.position.y = 1.5 + Math.sin(t) * 0.3;
      mesh.rotation.y += 0.03;
    });
    void floatAnim;

    const pu: PowerUp = { id: `pu_${Date.now()}`, type, position: pos, mesh, active: true };
    powerUpsRef.current.push(pu);
    setPowerUpSpawn(true);
    setTimeout(() => setPowerUpSpawn(false), 500);
  }, []);

  // ─── Main useEffect ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Load high score
    const saved = localStorage.getItem('meccha_highscore');
    if (saved) setHighScore(parseInt(saved, 10));

    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    engineRef.current = engine;

    const scene = new Scene(engine);
    sceneRef.current = scene;
    scene.clearColor = new Color4(0.06, 0.04, 0.08, 1);
    scene.shadowsEnabled = true;
    scene.fogEnabled = true;
    scene.fogDensity = 0.005;

    // Camera - third person
    const camera = new ArcRotateCamera('cam', -Math.PI / 2, Math.PI / 3.2, 28, Vector3.Zero(), scene);
    camera.lowerRadiusLimit = 18;
    camera.upperRadiusLimit = 55;
    camera.upperBetaLimit = Math.PI / 2.1;
    camera.attachControl(canvas, true);
    cameraRef.current = camera;

    // Lighting
    const hemi = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
    hemi.intensity = 0.5;
    hemi.groundColor = new Color3(0.2, 0.2, 0.3);

    const dirLight = new DirectionalLight('dir', new Vector3(-1, -2, -1), scene);
    dirLight.position = new Vector3(40, 60, 40);
    dirLight.intensity = 0.9;

    const shadowGen = new ShadowGenerator(2048, dirLight);
    shadowGen.useBlurExponentialShadowMap = true;
    shadowGen.blurKernel = 32;

    // Create map (Layer 3)
    createThemedMap(scene, shadowGen);

    // Create player
    const player = createPlayer(scene, shadowGen);
    player.position = new Vector3(0, 0, 0);
    playerRef.current = player;

    // Camera follows player
    scene.registerBeforeRender(() => {
      if (playerRef.current && cameraRef.current) {
        cameraRef.current.target = playerRef.current.position.add(new Vector3(0, 2, 0));

        // Screen shake
        if (screenShakeRef.current > 0) {
          const shake = screenShakeRef.current;
          cameraRef.current.target.x += (Math.random() - 0.5) * shake * 0.5;
          cameraRef.current.target.y += (Math.random() - 0.5) * shake * 0.3;
          screenShakeRef.current *= 0.85;
          if (screenShakeRef.current < 0.05) screenShakeRef.current = 0;
        }
      }
    });

    // Input
    const keyDown = (e: KeyboardEvent) => {
      inputMapRef.current[e.key.toLowerCase()] = true;
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

    // Click to sample color (paint mode)
    scene.onPointerObservable.add((pi) => {
      if (pi.type === PointerEventTypes.POINTERDOWN && isPaintMode && role === 'hider') {
        const pr = scene.pick(scene.pointerX, scene.pointerY);
        if (pr.hit && pr.pickedMesh && pr.pickedMesh !== player) {
          const mat = pr.pickedMesh.material as PBRMaterial;
          if (mat && mat.albedoColor) {
            const c = mat.albedoColor;
            const hex = '#' +
              Math.round(c.r * 255).toString(16).padStart(2, '0') +
              Math.round(c.g * 255).toString(16).padStart(2, '0') +
              Math.round(c.b * 255).toString(16).padStart(2, '0');
            setCurrentColor(hex);
            playerBodyPartsRef.current.forEach(p => {
              const pm = p.material as PBRMaterial;
              if (pm) pm.albedoColor = c.clone();
            });
            playTone(660, 0.15, 'sine');
            setIsPaintMode(false);
          }
        }
      }
    });

    // ─── Game loop ────────────────────────────────────────────────────────────
    let lastTime = performance.now();
    let powerUpTimer = 0;

    scene.registerBeforeRender(() => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (!playerRef.current) return;

      const currentWave = waveRef.current;
      const cfg = WAVE_CONFIG[currentWave - 1] || WAVE_CONFIG[0];
      const speedMult = cfg.speedMult;
      phaseRef.current = phase as GamePhase;

      // Power-up timers
      const nowMs = Date.now();
      activePowerUpsRef.current = activePowerUpsRef.current.filter(pu => {
        if (nowMs >= pu.endTime) return false;
        return true;
      });

      const hasSpeed = activePowerUpsRef.current.some(p => p.type === 'speed');
      const hasInvis = activePowerUpsRef.current.some(p => p.type === 'invisibility');
      const hasDouble = activePowerUpsRef.current.some(p => p.type === 'double');

      // ── Player movement ──
      const baseSpeed = 14;
      const moveSpeed = baseSpeed * (hasSpeed ? 2 : 1) * dt;
      const input = inputMapRef.current;
      let moved = false;

      if (input['w'] || input['arrowup']) { playerRef.current.position.z += moveSpeed; moved = true; }
      if (input['s'] || input['arrowdown']) { playerRef.current.position.z -= moveSpeed; moved = true; }
      if (input['a'] || input['arrowleft']) { playerRef.current.position.x -= moveSpeed; moved = true; }
      if (input['d'] || input['arrowright']) { playerRef.current.position.x += moveSpeed; moved = true; }

      // Clamp to map
      const half = MAP_SIZE / 2 - 2;
      playerRef.current.position.x = Math.max(-half, Math.min(half, playerRef.current.position.x));
      playerRef.current.position.z = Math.max(-half, Math.min(half, playerRef.current.position.z));

      // Walking bob
      if (moved) {
        playerRef.current.position.y = Math.sin(now / 140) * 0.18;
        playerRef.current.rotation.y += 0.04;
      } else {
        playerRef.current.position.y = 0;
      }

      // ── Trap zone check (Layer 3) ──
      if (cfg.trapZones && phase === 'seek') {
        trapZonesRef.current.forEach(trap => {
          const dx = playerRef.current!.position.x - trap.position.x;
          const dz = playerRef.current!.position.z - trap.position.z;
          if (Math.sqrt(dx * dx + dz * dz) < 4) {
            // Lose 5 seconds worth of score
            setTimeLeft(prev => Math.max(1, prev - 5 * dt * 60));
            playTone(150, 0.2, 'sawtooth', 0.15);
          }
        });
      }

      // ── Color matching score (Layer 2) ──
      if (role === 'hider' && phase === 'seek') {
        colorMatchTimerRef.current += dt;
        if (colorMatchTimerRef.current >= 1) {
          colorMatchTimerRef.current = 0;
          // Estimate color match by checking player albedo vs nearest zone floor
          const px = playerRef.current!.position.x;
          const pz = playerRef.current!.position.z;
          const nearestZone = ZONES.reduce((nearest, z) => {
            const d = Math.sqrt((z.cx - px) ** 2 + (z.cz - pz) ** 2);
            return d < nearest.dist ? { zone: z, dist: d } : nearest;
          }, { zone: ZONES[0], dist: Infinity });

          const pm = (playerBodyPartsRef.current[0]?.material as PBRMaterial);
          let matchPct = 0;
          if (pm?.albedoColor) {
            const pa = pm.albedoColor;
            const za = nearestZone.zone.floorColor;
            const diff = Math.abs(pa.r - za.r) + Math.abs(pa.g - za.g) + Math.abs(pa.b - za.b);
            matchPct = Math.max(0, Math.round((1 - diff / 1.5) * 100));
          }
          setColorMatchPct(matchPct);

          // Combo logic (Layer 2)
          if (matchPct >= 90 && comboCountRef.current >= 2) {
            const newCombo = Math.min(5, comboCountRef.current);
            comboCountRef.current++;
            if (newCombo > combo) {
              setCombo(newCombo);
              setComboFlash(true);
              setTimeout(() => setComboFlash(false), 300);
              playCombo();
            }
          } else if (matchPct < 50) {
            if (comboCountRef.current > 0) {
              screenShakeRef.current = 0.8;
            }
            comboCountRef.current = 0;
            setCombo(1);
          }

          // Survival score
          const basePoints = 10 * (hasDouble ? 2 : 1);
          const matchBonus = matchPct > 80 ? 5 * (hasDouble ? 2 : 1) : 0;
          const comboMult = combo;
          const earned = (basePoints + matchBonus) * comboMult;
          setScore(prev => prev + earned);
        }
      }

      // ── Near-miss detection (Layer 2) ──
      if (role === 'hider' && phase === 'seek' && !nearMissCooldownRef.current) {
        let nearestDist = Infinity;
        seekersRef.current.forEach(s => {
          const dx = playerRef.current!.position.x - s.position.x;
          const dz = playerRef.current!.position.z - s.position.z;
          const d = Math.sqrt(dx * dx + dz * dz);
          if (d < nearestDist) nearestDist = d;
        });

        if (nearestDist < 4 && !nearMissRef.current) {
          nearMissRef.current = true;
          setNearMissFlash(true);
          setTimeout(() => setNearMissFlash(false), 200);
          setScore(prev => prev + 100 * (activePowerUpsRef.current.some(p => p.type === 'double') ? 2 : 1));
          playTone(880, 0.1, 'sine', 0.12);
        } else if (nearestDist >= 6) {
          nearMissRef.current = false;
        }
      }

      // ── Seeker AI (Layer 4) ──
      if (phase === 'seek') {
        const frozen = activePowerUpsRef.current.some(p => p.type === 'freeze');
        seekersRef.current.forEach((seekerMesh, i) => {
          const state = seekerStatesRef.current[i];
          if (!state || frozen) {
            if (frozen && state) state.freezeTimer += dt;
            return;
          }

          const baseSeekSpeed = 8 * speedMult;
          const dx = playerRef.current!.position.x - seekerMesh.position.x;
          const dz = playerRef.current!.position.z - seekerMesh.position.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          // Catch check
          if (role === 'hider' && dist < 2.5 && !hasInvis) {
            setCaught(true);
            setPhase('game-over');
            playTone(220, 0.4, 'sawtooth', 0.15);
            playTone(196, 0.5, 'sawtooth', 0.15);
            return;
          }

          // Vision cone check (behind seeker is blind spot)
          const seekerToPlayer = new Vector3(dx, 0, dz).normalize();
          const seekerFacing = new Vector3(
            Math.sin(seekerMesh.rotation.y),
            0,
            Math.cos(seekerMesh.rotation.y)
          );
          const dot = Vector3.Dot(seekerToPlayer, seekerFacing);

          // Mode transitions
          if (dist < 10 && !hasInvis && dot > -0.3) {
            state.mode = 'chase';
            state.lastKnownPlayerPos = playerRef.current!.position.clone();
          } else if (state.mode === 'chase' && dist > 15) {
            state.mode = 'search';
          }

          let moveTarget: Vector3;
          switch (state.mode) {
            case 'patrol': {
              state.patrolAngle += dt * 0.8;
              const radius = 15;
              moveTarget = new Vector3(
                state.target.x + Math.cos(state.patrolAngle) * dt * 4,
                1.5,
                state.target.z + Math.sin(state.patrolAngle) * dt * 4
              );
              // Clamp patrol
              const patrolHalf = MAP_SIZE / 2 - 5;
              moveTarget.x = Math.max(-patrolHalf, Math.min(patrolHalf, moveTarget.x));
              moveTarget.z = Math.max(-patrolHalf, Math.min(patrolHalf, moveTarget.z));
              break;
            }
            case 'chase': {
              moveTarget = playerRef.current!.position.clone();
              break;
            }
            case 'search': {
              if (state.lastKnownPlayerPos) {
                moveTarget = state.lastKnownPlayerPos.clone();
                if (Vector3.Distance(seekerMesh.position, moveTarget) < 2) {
                  state.mode = 'patrol';
                }
              } else {
                state.mode = 'patrol';
                moveTarget = seekerMesh.position.clone();
              }
              break;
            }
            default:
              moveTarget = seekerMesh.position.clone();
          }

          // Move toward target
          if (moveTarget) {
            const tdx = moveTarget.x - seekerMesh.position.x;
            const tdz = moveTarget.z - seekerMesh.position.z;
            const td = Math.sqrt(tdx * tdx + tdz * tdz);
            if (td > 0.5) {
              const ms = baseSeekSpeed * dt;
              seekerMesh.position.x += (tdx / td) * ms;
              seekerMesh.position.z += (tdz / td) * ms;
              seekerMesh.rotation.y = Math.atan2(tdx, tdz);
            }
          }

          // Seeker shadow under them
          seekerMesh.position.y = 0;
        });
      }

      // ── Power-up spawn ──
      if (phase === 'seek') {
        powerUpTimer += dt;
        if (powerUpTimer >= 15 && powerUpsRef.current.filter(p => p.active).length < 2) {
          powerUpTimer = 0;
          spawnPowerUp(scene);
        }

        // Power-up pickup
        powerUpsRef.current.forEach((pu, i) => {
          if (!pu.active) return;
          const dx = playerRef.current!.position.x - pu.position.x;
          const dz = playerRef.current!.position.z - pu.position.z;
          if (Math.sqrt(dx * dx + dz * dz) < 2.5) {
            pu.active = false;
            pu.mesh.dispose();
            powerUpsRef.current.splice(i, 1);

            const endTime = Date.now() + POWERUP_DURATION[pu.type] * 1000;
            activePowerUpsRef.current.push({ type: pu.type, endTime });

            const label = POWERUP_ICONS[pu.type];
            setActivePowerUps(prev => [
              ...prev.filter(p => p.type !== pu.type),
              { type: pu.type, remaining: POWERUP_DURATION[pu.type] }
            ]);

            playTone(880, 0.1, 'sine', 0.1);
            playTone(1100, 0.15, 'sine', 0.1);
            screenShakeRef.current = 0.5;
          }
        });

        // Update active power-up remaining times
        const remaining = activePowerUpsRef.current.map(p => ({
          type: p.type,
          remaining: Math.ceil((p.endTime - Date.now()) / 1000),
        }));
        setActivePowerUps(remaining);
      }

      // Power-up float animation
      powerUpsRef.current.forEach(pu => {
        if (pu.active) {
          pu.mesh.position.y = 1.5 + Math.sin(performance.now() / 300) * 0.3;
        }
      });
    });

    // ─── Wave/seeker management ──────────────────────────────────────────────
    const setupWave = (waveNum: number) => {
      // Clear old seekers
      seekersRef.current.forEach(s => { try { s.dispose(); } catch {} });
      seekersRef.current = [];
      seekerStatesRef.current = [];

      // Spawn new seekers
      const cfg = WAVE_CONFIG[waveNum - 1];
      for (let i = 0; i < cfg.seekers; i++) {
        const { mesh, state } = createSeeker(scene, shadowGen, i);
        seekersRef.current.push(mesh);
        seekerStatesRef.current.push(state);
      }

      waveRef.current = waveNum;
      setWave(waveNum);
      setPhase('prep');
      setTimeLeft(cfg.prepTime);
      setIsPaintMode(false);
      playerRef.current!.position = new Vector3(0, 0, 0);

      // Reset combo
      comboCountRef.current = 0;
      setCombo(1);
      setColorMatchPct(0);
    };

    setupWave(1);

    // ─── Game timer ───────────────────────────────────────────────────────────
    let interval: ReturnType<typeof setInterval>;

    const startTimer = () => {
      interval = setInterval(() => {
        const currentPhase = phase;
        const currentWave = waveRef.current;
        const cfg = WAVE_CONFIG[currentWave - 1];

        setTimeLeft(prev => {
          if (prev <= 1) {
            if (currentPhase === 'prep') {
              setPhase('seek');
              phaseRef.current = 'seek';
              playTone(220, 0.3, 'sawtooth');
              playTone(196, 0.3, 'sawtooth');
              return cfg.seekTime;
            } else if (currentPhase === 'seek') {
              if (currentWave < 5) {
                // Wave complete!
                const stars = prev <= 10 ? 3 : prev <= 20 ? 2 : 1;
                const waveBonus = prev * currentWave * 10;
                setScore(s => s + waveBonus);
                setWaveStars(prev2 => [...prev2, stars]);
                setWaveAnnounce(`🌊 WAVE ${currentWave} CLEAR!`);
                setTimeout(() => setWaveAnnounce(''), 2500);
                playTone(523, 0.15, 'sine');
                setTimeout(() => playTone(659, 0.15, 'sine'), 150);
                setTimeout(() => playTone(784, 0.2, 'sine'), 300);

                // Next wave
                setPhase('between-waves');
                setTimeout(() => {
                  setupWave(currentWave + 1);
                }, 3000);
              } else {
                // All 5 waves complete!
                const finalScore = score;
                if (finalScore > highScore) {
                  setHighScore(finalScore);
                  setIsNewHighScore(true);
                  localStorage.setItem('meccha_highscore', finalScore.toString());
                }
                setPhase('result');
                playTone(523, 0.2, 'sine');
                setTimeout(() => playTone(659, 0.2, 'sine'), 200);
                setTimeout(() => playTone(784, 0.2, 'sine'), 400);
                setTimeout(() => playTone(1047, 0.4, 'sine'), 600);
              }
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    };

    startTimer();

    // ─── Score animation ─────────────────────────────────────────────────────
    const scoreAnimInterval = setInterval(() => {
      setDisplayScore(prev => {
        if (prev < score) return Math.min(score, prev + Math.ceil((score - prev) / 5));
        return prev;
      });
    }, 50);

    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());

    canvas.addEventListener('click', () => { initAudio(); }, { once: true });

    return () => {
      clearInterval(interval);
      clearInterval(scoreAnimInterval);
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      engine.dispose();
    };
  }, [role, playTone, playCombo, createThemedMap, createPlayer, createSeeker, spawnPowerUp, phase, score, highScore, combo]);

  // ─── Animated score display ────────────────────────────────────────────────
  const animatedScore = displayScore;

  // ─── Wave progress ──────────────────────────────────────────────────────────
  const totalWaves = 5;
  const waveProgress = waveStars.reduce((sum, s) => sum + s, 0);
  const maxStars = totalWaves * 3;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* ── Near-miss gold flash ── */}
      {nearMissFlash && (
        <div className="absolute inset-0 pointer-events-none z-40">
          <div className="absolute inset-0 bg-yellow-400/20 animate-pulse" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-yellow-400 font-black text-3xl animate-bounce">
            💨 NEAR MISS +100!
          </div>
        </div>
      )}

      {/* ── Game over / result overlay ── */}
      {(phase === 'result' || phase === 'game-over') && (
        <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-black rounded-3xl p-8 max-w-md w-full mx-4 text-center border-2 border-purple-400/40 shadow-2xl">
            {phase === 'result' ? (
              <>
                <h2 className="text-5xl font-black mb-2 text-white">🏆 ALL WAVES CLEAR!</h2>
                <p className="text-gray-400 mb-4">Total Stars: {waveStars.map((s, i) => '⭐'.repeat(s)).join('')}</p>
              </>
            ) : (
              <>
                <h2 className="text-5xl font-black mb-2 text-red-400">💀 CAUGHT!</h2>
                <p className="text-gray-400 mb-4">Survived to Wave {wave} — {phase === 'game-over' ? 'You were spotted!' : 'Well played!'}</p>
              </>
            )}

            {isNewHighScore && (
              <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-xl p-3 mb-4 animate-pulse">
                <p className="text-yellow-400 font-black text-xl">🎉 NEW HIGH SCORE!</p>
              </div>
            )}

            <div className="bg-black/40 rounded-2xl p-5 mb-6">
              <p className="text-5xl font-black text-yellow-400 mb-1">{animatedScore.toLocaleString()}</p>
              <p className="text-sm text-gray-400">SCORE</p>
              <div className="mt-3 flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map(w => (
                  <div key={w} className={`text-2xl ${w <= wave ? 'opacity-100' : 'opacity-30'}`}>
                    {w <= wave ? (waveStars[w - 1] ? '⭐' : '☆') : '☆'}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Total Stars: {waveStars.reduce((a, b) => a + b, 0)} / {maxStars}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 bg-gradient-to-r from-green-400 to-emerald-600 rounded-xl font-black text-black text-lg"
              >
                ▶ PLAY AGAIN
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-lg"
              >
                LOBBY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Between-waves transition ── */}
      {phase === 'between-waves' && (
        <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/70 pointer-events-none">
          <div className="text-center">
            <p className="text-6xl font-black text-white animate-bounce">🌊 WAVE {wave} COMPLETE!</p>
            <p className="text-2xl text-yellow-400 mt-4 font-bold">
              Next wave in 3... 2... 1...
            </p>
          </div>
        </div>
      )}

      {/* ── Wave announcement ── */}
      {waveAnnounce && (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
          <div className="text-5xl font-black text-white animate-bounce shadow-2xl">
            {waveAnnounce}
          </div>
        </div>
      )}

      {/* ── HUD Overlay ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between pointer-events-auto">
          <button
            onClick={onExit}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/90 hover:bg-red-500 rounded-xl font-bold backdrop-blur-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> EXIT
          </button>

          {/* Wave indicator */}
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-sm rounded-xl px-4 py-2">
            <span className="text-white font-bold text-sm">🌊</span>
            {[1, 2, 3, 4, 5].map(w => (
              <div key={w} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                w < wave ? 'bg-green-500 text-black' :
                w === wave ? 'bg-yellow-500 text-black animate-pulse' :
                'bg-gray-700 text-gray-400'
              }`}>
                {w}
              </div>
            ))}
          </div>

          {/* Role badge */}
          <div className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${
            role === 'hider' ? 'bg-white text-black' : 'bg-red-600 text-white'
          }`}>
            {role === 'hider' ? <EyeOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
            {role.toUpperCase()}
          </div>

          {/* Timer */}
          <div className={`px-5 py-2 rounded-xl backdrop-blur-sm flex items-center gap-2 text-xl font-black ${
            timeLeft <= 5 ? 'bg-red-600/90 animate-pulse' :
            phase === 'prep' ? 'bg-green-600/80' :
            'bg-black/60'
          }`}>
            <Timer className="w-5 h-5" />
            {timeLeft}s
          </div>

          {/* Score */}
          <div className="px-5 py-2 bg-gradient-to-r from-yellow-600/90 to-amber-600/90 rounded-xl backdrop-blur-sm">
            <span className="font-black text-xl text-white">{animatedScore.toLocaleString()}</span>
            <span className="text-xs text-yellow-200 ml-1">PTS</span>
          </div>

          {/* Mute */}
          <button
            onClick={() => setIsMuted(m => !m)}
            className="p-2 bg-black/60 hover:bg-black/80 rounded-xl backdrop-blur-sm pointer-events-auto"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Phase indicator */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2">
          <div className={`px-6 py-3 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 ${
            phase === 'prep' ? 'bg-green-500/90 text-black' :
            phase === 'seek' ? 'bg-red-500/90 text-white animate-pulse' :
            'bg-yellow-500/90 text-black'
          }`}>
            {phase === 'prep' ? (
              <><Palette className="w-5 h-5" /> HIDE & PAINT!</>
            ) : phase === 'seek' ? (
              <><Zap className="w-5 h-5" /> HUNTING PHASE!</>
            ) : (
              <><Star className="w-5 h-5" /> WAVE CLEAR!</>
            )}
          </div>
        </div>

        {/* Combo display (Layer 2) */}
        {combo > 1 && (
          <div className={`absolute top-32 left-1/2 -translate-x-1/2 transition-all ${comboFlash ? 'scale-125' : 'scale-100'}`}>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-2 rounded-full shadow-lg animate-bounce">
              <span className="font-black text-2xl text-black">
                COMBO ×{combo}!
              </span>
            </div>
          </div>
        )}

        {/* Color match bar (Layer 2) */}
        {role === 'hider' && (
          <div className="absolute top-32 right-4 bg-black/60 backdrop-blur-sm rounded-xl p-3 min-w-[140px] pointer-events-auto">
            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Camo Match</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
              <div
                className={`h-2.5 rounded-full transition-all ${
                  colorMatchPct >= 90 ? 'bg-green-400' :
                  colorMatchPct >= 60 ? 'bg-yellow-400' :
                  'bg-red-400'
                }`}
                style={{ width: `${colorMatchPct}%` }}
              />
            </div>
            <p className="text-right text-sm font-bold text-white">{colorMatchPct}%</p>
          </div>
        )}

        {/* Active power-ups (Layer 5) */}
        {activePowerUps.length > 0 && (
          <div className="absolute top-40 right-4 flex flex-col gap-2 pointer-events-auto">
            {activePowerUps.map(pu => (
              <div key={pu.type} className="bg-black/70 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 border border-white/20">
                <span className="text-xl">{POWERUP_ICONS[pu.type]}</span>
                <span className="text-sm font-bold text-white">{pu.remaining}s</span>
              </div>
            ))}
          </div>
        )}

        {/* Power-up spawn hint */}
        {powerUpSpawn && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="text-2xl animate-bounce">✨ POWER-UP! ✨</div>
          </div>
        )}

        {/* High score */}
        {highScore > 0 && phase === 'seek' && (
          <div className="absolute top-40 left-4 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2 text-xs text-gray-400">
            🏅 Best: {highScore.toLocaleString()}
          </div>
        )}

        {/* Hider controls */}
        {role === 'hider' && (
          <>
            <button
              onClick={() => setIsPaintMode(p => !p)}
              className={`pointer-events-auto absolute bottom-28 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                isPaintMode
                  ? 'bg-green-500 text-black scale-110 shadow-green-500/50'
                  : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              <Palette className="w-5 h-5" />
              {isPaintMode ? '🎯 CLICK TO SAMPLE COLOR' : 'E = PAINT MODE'}
            </button>

            {/* Color preview */}
            <div className="absolute bottom-28 right-4 flex items-center gap-3 bg-black/60 backdrop-blur-sm rounded-xl p-3 pointer-events-auto">
              <Hand className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-400">Color:</span>
              <div
                className="w-12 h-12 rounded-xl border-2 border-white shadow-lg"
                style={{ backgroundColor: currentColor }}
              />
            </div>

            {/* Controls hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl">
              <p className="text-xs text-gray-300 flex items-center gap-4">
                <span className="flex items-center gap-1"><Move className="w-3 h-3" /> WASD Move</span>
                <span className="flex items-center gap-1"><Palette className="w-3 h-3" /> E Paint</span>
                <span className="flex items-center gap-1"><Hand className="w-3 h-3" /> Click Sample</span>
              </p>
            </div>
          </>
        )}

        {/* Seeker controls */}
        {role === 'seeker' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl">
            <p className="text-xs text-gray-300 flex items-center gap-4">
              <span className="flex items-center gap-1"><Move className="w-3 h-3" /> WASD Move</span>
              <span className="flex items-center gap-1"><ZapIcon className="w-3 h-3" /> Mouse Aim</span>
              <span className="flex items-center gap-1"><EyeOff className="w-3 h-3" /> Click Shoot</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
