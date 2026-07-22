'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight,
  MeshBuilder, StandardMaterial, Color3, Color4,
  Mesh, PBRMaterial, ShadowGenerator, PointerEventTypes,
  UniversalCamera, Animation, Tools
} from '@babylonjs/core';
import { AdvancedDynamicTexture, TextBlock, Rectangle, Control, Button } from '@babylonjs/gui';
import { ArrowLeft, Crosshair, Palette, Clock, Users, Eye, EyeOff } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type GamePhase = 'prep' | 'seek' | 'result' | 'gameover';
type RoleType = 'hider' | 'seeker';

interface GameProps {
  mode: string;
  role: RoleType;
  onExit: () => void;
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const PREP_TIME = 30; // 30 seconds to hide
const SEEK_TIME = 60; // 60 seconds to seek
const ROOM_SIZE = 30;

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MecchaGameplay({ mode, role, onExit }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('prep');
  const [timeLeft, setTimeLeft] = useState(PREP_TIME);
  const [isEyedropperActive, setIsEyedropperActive] = useState(false);
  const [playerColor, setPlayerColor] = useState('#FFFFFF');
  const [score, setScore] = useState(0);
  const [foundPlayers, setFoundPlayers] = useState(0);
  const [ammo, setAmmo] = useState(20);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize Engine
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.05, 0.05, 0.1, 1);
    scene.shadowsEnabled = true;

    // Camera setup based on role
    let camera: ArcRotateCamera | UniversalCamera;
    if (role === 'hider') {
      camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 20, Vector3.Zero(), scene);
      camera.attachControl(canvas, true);
      camera.lowerRadiusLimit = 15;
      camera.upperRadiusLimit = 40;
    } else {
      // Seeker gets first-person view
      camera = new UniversalCamera('seekerCam', new Vector3(0, 3, -15), scene);
      camera.setTarget(Vector3.Zero());
      camera.attachControl(canvas, true);
      (camera as UniversalCamera).speed = 0.4;
    }

    // Lighting
    const hemiLight = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.5;

    const dirLight = new DirectionalLight('dir', new Vector3(-1, -2, -1), scene);
    dirLight.position = new Vector3(20, 40, 20);
    dirLight.intensity = 0.7;
    
    const shadowGen = new ShadowGenerator(1024, dirLight);
    shadowGen.useBlurExponentialShadowMap = true;

    // Create Room
    const { player, aiPlayers, props } = createGameRoom(scene, shadowGen, role);

    // GUI
    const gui = AdvancedDynamicTexture.CreateFullscreenUI('GameUI');

    // Timer Text
    const timerText = new TextBlock('timer');
    timerText.text = `${PREP_TIME}s`;
    timerText.color = 'white';
    timerText.fontSize = 36;
    timerText.fontWeight = 'bold';
    timerText.top = '-40%';
    gui.addControl(timerText);

    // Phase Text
    const phaseText = new TextBlock('phase');
    phaseText.text = role === 'hider' ? '⏱ HIDE & PAINT!' : '⏳ WAIT FOR HUNT...';
    phaseText.color = role === 'hider' ? '#4ade80' : '#fbbf24';
    phaseText.fontSize = 18;
    phaseText.top = '-35%';
    gui.addControl(phaseText);

    // Instructions
    const hintText = new TextBlock('hint');
    hintText.text = role === 'hider' 
      ? 'WASD = Move | E = Eyedropper | Click = Paint' 
      : 'WASD = Move | Mouse = Aim | Click = Shoot';
    hintText.color = 'rgba(255,255,255,0.6)';
    hintText.fontSize = 14;
    hintText.bottom = '10%';
    gui.addControl(hintText);

    // Input handling
    const inputMap: { [key: string]: boolean } = {};
    
    const keyDown = (e: KeyboardEvent) => {
      inputMap[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'e' && role === 'hider' && gamePhase === 'prep') {
        setIsEyedropperActive(prev => !prev);
      }
    };
    const keyUp = (e: KeyboardEvent) => inputMap[e.key.toLowerCase()] = false;

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    // Click handling
    scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
        if (role === 'hider' && gamePhase === 'prep' && isEyedropperActive) {
          // Sample color from clicked surface
          const pickResult = scene.pick(scene.pointerX, scene.pointerY);
          if (pickResult.hit && pickResult.pickedMesh) {
            const mat = pickResult.pickedMesh.material as PBRMaterial;
            if (mat && mat.albedoColor) {
              const color = mat.albedoColor;
              setPlayerColor(`#${Math.round(color.r * 255).toString(16).padStart(2, '0')}${Math.round(color.g * 255).toString(16).padStart(2, '0')}${Math.round(color.b * 255).toString(16).padStart(2, '0')}`);
              
              // Apply to player
              const playerMat = player.material as PBRMaterial;
              if (playerMat) {
                playerMat.albedoColor = color.clone();
              }
              setIsEyedropperActive(false);
            }
          }
        } else if (role === 'seeker' && gamePhase === 'seek') {
          // Shoot paint
          if (ammo > 0) {
            setAmmo(prev => prev - 1);
            const pickResult = scene.pick(scene.pointerX, scene.pointerY);
            if (pickResult.hit && pickResult.pickedMesh) {
              // Check if hit an AI player
              const hitMesh = pickResult.pickedMesh;
              aiPlayers.forEach((ai, index) => {
                if (hitMesh === ai || hitMesh.parent === ai) {
                  // Found a player!
                  setFoundPlayers(prev => prev + 1);
                  setScore(prev => prev + 100);
                  // Make them visible
                  const aiMat = ai.material as PBRMaterial;
                  if (aiMat) {
                    aiMat.albedoColor = new Color3(1, 0, 0);
                  }
                }
              });
            }
          }
        }
      }
    });

    // Game loop
    let lastTime = performance.now();
    let phaseTimer = PREP_TIME;
    let currentPhase: GamePhase = 'prep';

    scene.registerBeforeRender(() => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Timer logic
      phaseTimer -= dt;
      setTimeLeft(Math.ceil(phaseTimer));
      timerText.text = `${Math.ceil(phaseTimer)}s`;

      // Phase transitions
      if (currentPhase === 'prep' && phaseTimer <= 0) {
        currentPhase = 'seek';
        setGamePhase('seek');
        phaseTimer = SEEK_TIME;
        phaseText.text = role === 'hider' ? '🔴 STAY HIDDEN!' : '🔴 HUNT THEM DOWN!';
        phaseText.color = '#ef4444';
        
        if (role === 'seeker') {
          hintText.text = 'WASD = Move | Mouse = Aim | Click = Shoot';
        }
      } else if (currentPhase === 'seek' && phaseTimer <= 0) {
        currentPhase = 'result';
        setGamePhase('result');
        setShowResult(true);
        phaseText.text = '🎉 ROUND OVER!';
        phaseText.color = '#4ade80';
      }

      // Movement for hider
      if (role === 'hider' && currentPhase === 'prep') {
        const speed = 8 * (scene.getEngine().getDeltaTime() / 1000);
        const cam = camera as ArcRotateCamera;
        
        if (inputMap['w']) player.position.z += speed;
        if (inputMap['s']) player.position.z -= speed;
        if (inputMap['a']) player.position.x -= speed;
        if (inputMap['d']) player.position.x += speed;

        // Clamp bounds
        player.position.x = Math.max(-14, Math.min(14, player.position.x));
        player.position.z = Math.max(-14, Math.min(14, player.position.z));
        cam.target = player.position;
      }

      // AI movement during seek phase
      if (currentPhase === 'seek') {
        aiPlayers.forEach((ai, i) => {
          if (ai.metadata && ai.metadata.velocity) {
            ai.position.addInPlace(ai.metadata.velocity);
            // Bounce off walls
            if (Math.abs(ai.position.x) > 13) ai.metadata.velocity.x *= -1;
            if (Math.abs(ai.position.z) > 13) ai.metadata.velocity.z *= -1;
          }
        });
      }
    });

    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());

    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      engine.dispose();
    };
  }, [role, gamePhase, isEyedropperActive, ammo]);

  return (
    <div className="fixed inset-0 bg-black">
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <button 
            onClick={onExit}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg font-bold backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" /> EXIT
          </button>

          <div className="flex items-center gap-4">
            {/* Role Badge */}
            <div className={`px-4 py-2 rounded-lg font-bold ${role === 'hider' ? 'bg-white text-black' : 'bg-red-600 text-white'}`}>
              {role === 'hider' ? <EyeOff className="w-4 h-4 inline mr-2" /> : <Crosshair className="w-4 h-4 inline mr-2" />}
              {role.toUpperCase()}
            </div>

            {/* Timer */}
            <div className="px-4 py-2 bg-black/60 rounded-lg backdrop-blur-sm">
              <Clock className="w-4 h-4 inline mr-2" />
              <span className="font-bold text-xl">{timeLeft}s</span>
            </div>

            {/* Score */}
            <div className="px-4 py-2 bg-yellow-600/80 rounded-lg backdrop-blur-sm">
              <span className="font-bold">{score} PTS</span>
            </div>
          </div>
        </div>

        {/* Role-specific UI */}
        {role === 'hider' && (
          <>
            {/* Eyedropper Tool */}
            <button
              onClick={() => setIsEyedropperActive(!isEyedropperActive)}
              className={`pointer-events-auto absolute bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                isEyedropperActive 
                  ? 'bg-green-500 text-black scale-110' 
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <Palette className="w-5 h-5" />
              {isEyedropperActive ? 'EYEDROPPER ACTIVE' : 'E = Eyedropper'}
            </button>

            {/* Current Color */}
            <div className="absolute bottom-24 right-4 flex items-center gap-2">
              <span className="text-sm text-gray-400">Current Color:</span>
              <div 
                className="w-10 h-10 rounded-lg border-2 border-white shadow-lg"
                style={{ backgroundColor: playerColor }}
              />
            </div>
          </>
        )}

        {role === 'seeker' && (
          <>
            {/* Ammo Counter */}
            <div className="absolute bottom-24 left-4 px-4 py-2 bg-blue-600/80 rounded-lg backdrop-blur-sm">
              <span className="font-bold">{ammo} / 20 AMMO</span>
            </div>

            {/* Found Counter */}
            <div className="absolute bottom-24 right-4 px-4 py-2 bg-green-600/80 rounded-lg backdrop-blur-sm">
              <Users className="w-4 h-4 inline mr-2" />
              <span className="font-bold">{foundPlayers} FOUND</span>
            </div>

            {/* Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <Crosshair className="w-8 h-8 text-white/50" />
            </div>
          </>
        )}

        {/* Phase Indicator */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2">
          <div className={`px-6 py-2 rounded-full font-bold text-lg ${
            gamePhase === 'prep' ? 'bg-green-500/80 text-black' : 
            gamePhase === 'seek' ? 'bg-red-500/80 text-white' : 
            'bg-yellow-500/80 text-black'
          }`}>
            {gamePhase === 'prep' ? '⏱ PREPARATION PHASE' : 
             gamePhase === 'seek' ? '🔴 SEEKING PHASE' : 
             '🎉 ROUND COMPLETE'}
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-800 to-blue-900 rounded-3xl p-8 max-w-md w-full mx-4 text-center">
            <h2 className="text-4xl font-black mb-4">
              {role === 'hider' ? (score > 0 ? '🎉 SURVIVED!' : '💀 CAUGHT!') : '🏆 HUNT COMPLETE!'}
            </h2>
            
            <div className="space-y-2 mb-6">
              <p className="text-xl">Score: <span className="text-yellow-400 font-bold">{score}</span></p>
              {role === 'seeker' && <p className="text-lg">Found: <span className="text-green-400 font-bold">{foundPlayers}</span> players</p>}
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

// ─── Helper Functions ─────────────────────────────────────────────────────────

function createGameRoom(scene: Scene, shadowGen: ShadowGenerator, playerRole: RoleType) {
  const props: Mesh[] = [];

  // Floor with different zones
  const floor = MeshBuilder.CreateGround('floor', { width: ROOM_SIZE, height: ROOM_SIZE }, scene);
  const floorMat = new PBRMaterial('floorMat', scene);
  floorMat.albedoColor = new Color3(0.85, 0.8, 0.75);
  floorMat.roughness = 0.9;
  floor.material = floorMat;
  floor.receiveShadows = true;

  // Create colored zones
  const zones = [
    { x: -8, z: -8, color: new Color3(0.96, 0.78, 0.67), size: 10 }, // Peach corner
    { x: 8, z: -8, color: new Color3(0.52, 0.7, 0.83), size: 10 },   // Blue corner
    { x: -8, z: 8, color: new Color3(0.58, 0.78, 0.58), size: 10 },  // Green corner
    { x: 8, z: 8, color: new Color3(0.75, 0.6, 0.8), size: 10 },     // Purple corner
  ];

  zones.forEach((zone, i) => {
    const zoneMesh = MeshBuilder.CreateGround(`zone${i}`, { width: zone.size, height: zone.size }, scene);
    zoneMesh.position = new Vector3(zone.x, 0.01, zone.z);
    const zoneMat = new PBRMaterial(`zoneMat${i}`, scene);
    zoneMat.albedoColor = zone.color;
    zoneMat.roughness = 0.95;
    zoneMesh.material = zoneMat;
    zoneMesh.receiveShadows = true;
    props.push(zoneMesh);
  });

  // Walls
  const wallMat = new PBRMaterial('wallMat', scene);
  wallMat.albedoColor = new Color3(0.65, 0.45, 0.35);
  wallMat.roughness = 0.95;

  ['back', 'left', 'right'].forEach((side) => {
    const wall = MeshBuilder.CreateBox(`${side}Wall`, { 
      width: side === 'back' ? ROOM_SIZE : 1, 
      height: 10, 
      depth: side === 'back' ? 1 : ROOM_SIZE 
    }, scene);
    
    if (side === 'back') wall.position.z = -ROOM_SIZE/2;
    if (side === 'left') wall.position.x = -ROOM_SIZE/2;
    if (side === 'right') wall.position.x = ROOM_SIZE/2;
    wall.position.y = 5;
    wall.material = wallMat;
    wall.receiveShadows = true;
    shadowGen.addShadowCaster(wall);
    props.push(wall);
  });

  // Furniture props
  const furnitureConfigs = [
    { type: 'couch', x: -5, z: -5, color: new Color3(0.7, 0.2, 0.15), rot: 0 },
    { type: 'couch', x: 5, z: -5, color: new Color3(0.15, 0.4, 0.6), rot: 0 },
    { type: 'bookshelf', x: -10, z: 0, color: new Color3(0.4, 0.25, 0.1), rot: Math.PI/2 },
    { type: 'bookshelf', x: 10, z: 0, color: new Color3(0.4, 0.25, 0.1), rot: -Math.PI/2 },
    { type: 'plant', x: -5, z: 5, color: new Color3(0.15, 0.6, 0.35), rot: 0 },
    { type: 'plant', x: 5, z: 5, color: new Color3(0.1, 0.5, 0.3), rot: 0 },
    { type: 'table', x: 0, z: 0, color: new Color3(0.55, 0.3, 0.08), rot: 0 },
    { type: 'rug', x: 0, z: 0, color: new Color3(0.5, 0.25, 0.6), rot: 0 },
  ];

  furnitureConfigs.forEach((config, i) => {
    const mesh = createFurniture(config.type, config.color, scene, shadowGen, i);
    mesh.position.x = config.x;
    mesh.position.z = config.z;
    mesh.rotation.y = config.rot;
    props.push(mesh);
  });

  // Player character
  const player = createCharacter(scene, shadowGen, true);
  player.position = new Vector3(0, 1.5, 0);

  // AI Players (bots)
  const aiPlayers: Mesh[] = [];
  const aiPositions = [
    { x: -7, z: -7 }, { x: 7, z: -7 }, { x: -7, z: 7 }, { x: 7, z: 7 },
    { x: -3, z: -8 }, { x: 3, z: -8 }, { x: -8, z: 3 }, { x: 8, z: 3 },
  ];

  aiPositions.forEach((pos, i) => {
    const ai = createCharacter(scene, shadowGen, false);
    ai.position = new Vector3(pos.x, 1.5, pos.z);
    
    // Random color for AI
    const colors = [
      new Color3(0.96, 0.78, 0.67), // Peach
      new Color3(0.52, 0.7, 0.83),  // Blue
      new Color3(0.58, 0.78, 0.58), // Green
      new Color3(0.65, 0.45, 0.35), // Wall
      new Color3(0.7, 0.2, 0.15),   // Couch
      new Color3(0.15, 0.6, 0.35),  // Plant
    ];
    const aiMat = ai.material as PBRMaterial;
    if (aiMat) {
      aiMat.albedoColor = colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Add velocity for movement
    ai.metadata = {
      velocity: new Vector3(
        (Math.random() - 0.5) * 0.05,
        0,
        (Math.random() - 0.5) * 0.05
      )
    };
    
    aiPlayers.push(ai);
  });

  return { player, aiPlayers, props };
}

function createFurniture(type: string, color: Color3, scene: Scene, shadowGen: ShadowGenerator, index: number): Mesh {
  let mesh: Mesh;
  const mat = new PBRMaterial(`furnitureMat${index}`, scene);
  mat.albedoColor = color;
  mat.roughness = 0.8;

  switch (type) {
    case 'couch':
      mesh = MeshBuilder.CreateBox(`couch${index}`, { width: 3, height: 1.2, depth: 1.5 }, scene);
      mesh.position.y = 0.6;
      const backrest = MeshBuilder.CreateBox(`back${index}`, { width: 3, height: 1.2, depth: 0.4 }, scene);
      backrest.position = new Vector3(0, 1.2, -0.55);
      backrest.parent = mesh;
      backrest.material = mat;
      break;
    case 'bookshelf':
      mesh = MeshBuilder.CreateBox(`shelf${index}`, { width: 2, height: 3.5, depth: 0.8 }, scene);
      mesh.position.y = 1.75;
      break;
    case 'plant':
      mesh = MeshBuilder.CreateCylinder(`pot${index}`, { diameter: 1, height: 1 }, scene);
      mesh.position.y = 0.5;
      for (let j = 0; j < 4; j++) {
        const leaf = MeshBuilder.CreateSphere(`leaf${index}_${j}`, { diameter: 0.8 }, scene);
        const angle = (j / 4) * Math.PI * 2;
        leaf.position = new Vector3(Math.cos(angle) * 0.6, 1.5 + Math.random() * 0.3, Math.sin(angle) * 0.6);
        leaf.parent = mesh;
        const leafMat = new PBRMaterial(`leafMat${index}_${j}`, scene);
        leafMat.albedoColor = new Color3(0.1 + Math.random() * 0.1, 0.5 + Math.random() * 0.2, 0.2);
        leaf.material = leafMat;
      }
      break;
    case 'table':
      mesh = MeshBuilder.CreateBox(`table${index}`, { width: 2.5, height: 1.5, depth: 1.5 }, scene);
      mesh.position.y = 0.75;
      break;
    case 'rug':
      mesh = MeshBuilder.CreateGround(`rug${index}`, { width: 4, height: 3 }, scene);
      mesh.position.y = 0.02;
      break;
    default:
      mesh = MeshBuilder.CreateBox(`prop${index}`, { size: 1.5 }, scene);
      mesh.position.y = 0.75;
  }

  mesh.material = mat;
  mesh.receiveShadows = true;
  shadowGen.addShadowCaster(mesh);
  return mesh;
}

function createCharacter(scene: Scene, shadowGen: ShadowGenerator, isPlayer: boolean): Mesh {
  // Body
  const body = MeshBuilder.CreateCapsule('charBody', { height: 2, radius: 0.5 }, scene);
  body.position.y = 1;

  // Head
  const head = MeshBuilder.CreateSphere('charHead', { diameter: 1 }, scene);
  head.position.y = 2.2;
  head.parent = body;

  // Arms
  const leftArm = MeshBuilder.CreateCapsule('leftArm', { height: 1.2, radius: 0.2 }, scene);
  leftArm.position = new Vector3(-0.7, 1.2, 0);
  leftArm.rotation.z = 0.3;
  leftArm.parent = body;

  const rightArm = MeshBuilder.CreateCapsule('rightArm', { height: 1.2, radius: 0.2 }, scene);
  rightArm.position = new Vector3(0.7, 1.2, 0);
  rightArm.rotation.z = -0.3;
  rightArm.parent = body;

  // Material
  const mat = new PBRMaterial(isPlayer ? 'playerMat' : 'aiMat', scene);
  mat.albedoColor = new Color3(1, 1, 1);
  mat.roughness = 0.4;
  mat.metallic = 0;
  body.material = mat;
  head.material = mat;
  leftArm.material = mat;
  rightArm.material = mat;

  shadowGen.addShadowCaster(body);
  shadowGen.addShadowCaster(head);

  return body;
}
