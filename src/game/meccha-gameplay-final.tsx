'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Engine, Scene, FollowCamera, Vector3, HemisphericLight, DirectionalLight,
  MeshBuilder, Color3, Color4, Texture, DynamicTexture,
  Mesh, StandardMaterial, ShadowGenerator,
  Animation
} from '@babylonjs/core';

// ─── Types ────────────────────────────────────────────────────────────────────
type GamePhase = 'loading' | 'lobby' | 'prep' | 'seek' | 'result';
type RoleType = 'hider' | 'seeker';

interface GameProps {
  mode: string;
  role: RoleType;
  onExit: () => void;
}

interface ChatMessage {
  id: string;
  player: string;
  message: string;
  time: string;
}

// ─── Colors ────────────────────────────────────────────────────────────────────
const COLORS = {
  grass: new Color3(0.4, 0.7, 0.3),
  dirt: new Color3(0.6, 0.45, 0.35),
  barnRed: new Color3(0.8, 0.2, 0.15),
  barnWhite: new Color3(0.95, 0.95, 0.9),
  woodBrown: new Color3(0.5, 0.35, 0.25),
  water: new Color3(0.3, 0.6, 0.9),
  playerDefault: new Color3(0.2, 0.8, 0.4),
};

export default function MecchaGameplayFinal({ mode, role, onExit }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const playerRef = useRef<Mesh | null>(null);
  
  const [phase, setPhase] = useState<GamePhase>('loading');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [score, setScore] = useState(0);
  const [playerColor, setPlayerColor] = useState('#33ff57');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', player: 'Sage', message: 'on god this map is huge 🗺️', time: '2m' },
    { id: '2', player: 'Reaper', message: 'hello prey 😈', time: '1m' },
    { id: '3', player: 'Milo', message: 'wsp fam 😎', time: '30s' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [lives, setLives] = useState(5);
  const [isImpostor, setIsImpostor] = useState(true);
  const [showPaintPanel, setShowPaintPanel] = useState(false);
  const [compassAngle, setCompassAngle] = useState(0);
  
  const keysRef = useRef({ w: false, a: false, s: false, d: false, space: false, shift: false });
  const playerSpeed = 0.12;
  const isRunning = useRef(false);

  // ─── Loading Simulation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'loading') return;
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        setLoadingProgress(100);
        clearInterval(interval);
        setTimeout(() => setPhase('lobby'), 500);
      } else {
        setLoadingProgress(Math.floor(progress));
      }
    }, 200);
    return () => clearInterval(interval);
  }, [phase]);

  // ─── Create Farm Map ─────────────────────────────────────────────────────────
  const createFarmMap = useCallback((scene: Scene, shadowGen: ShadowGenerator) => {
    // Ground - grass
    const ground = MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, scene);
    const groundMat = new StandardMaterial('groundMat', scene);
    groundMat.diffuseColor = COLORS.grass;
    ground.material = groundMat;
    ground.receiveShadows = true;

    // Dirt paths
    const createPath = (x: number, z: number, w: number, d: number) => {
      const path = MeshBuilder.CreateGround('path', { width: w, height: d }, scene);
      path.position.set(x, 0.02, z);
      const mat = new StandardMaterial('pathMat', scene);
      mat.diffuseColor = COLORS.dirt;
      path.material = mat;
      path.receiveShadows = true;
    };
    createPath(0, 10, 8, 30);
    createPath(-15, 0, 20, 6);
    createPath(15, -10, 6, 25);

    // ─── BARN ───────────────────────────────────────────────────────────────────
    const createBarn = (x: number, z: number) => {
      const barnGroup = new Mesh('barn', scene);
      barnGroup.position.set(x, 0, z);

      // Main barn body
      const body = MeshBuilder.CreateBox('barnBody', { width: 12, height: 8, depth: 16 }, scene);
      body.position.y = 4;
      body.parent = barnGroup;
      const barnMat = new StandardMaterial('barnMat', scene);
      barnMat.diffuseColor = COLORS.barnRed;
      body.material = barnMat;
      body.checkCollisions = true;
      shadowGen.addShadowCaster(body);

      // Barn roof
      const roof = MeshBuilder.CreateCylinder('barnRoof', { diameter: 14, height: 18, tessellation: 3 }, scene);
      roof.rotation.z = Math.PI / 2;
      roof.rotation.y = Math.PI / 2;
      roof.position.y = 10;
      roof.parent = barnGroup;
      const roofMat = new StandardMaterial('roofMat', scene);
      roofMat.diffuseColor = COLORS.barnRed;
      roof.material = roofMat;
      shadowGen.addShadowCaster(roof);

      // White trim
      const trim = MeshBuilder.CreateBox('barnTrim', { width: 12.5, height: 0.5, depth: 16.5 }, scene);
      trim.position.y = 6;
      trim.parent = barnGroup;
      const trimMat = new StandardMaterial('trimMat', scene);
      trimMat.diffuseColor = COLORS.barnWhite;
      trim.material = trimMat;

      // Barn door
      const door = MeshBuilder.CreateBox('barnDoor', { width: 6, height: 5, depth: 0.5 }, scene);
      door.position.set(0, 2.5, 8);
      door.parent = barnGroup;
      const doorMat = new StandardMaterial('doorMat', scene);
      doorMat.diffuseColor = COLORS.barnWhite;
      door.material = doorMat;

      // Door X pattern
      const x1 = MeshBuilder.CreateBox('x1', { width: 5, height: 0.3, depth: 0.6 }, scene);
      x1.rotation.z = Math.PI / 4;
      x1.position.set(0, 2.5, 8);
      x1.parent = barnGroup;
      x1.material = barnMat;

      return barnGroup;
    };

    createBarn(-25, -20);

    // ─── POND ───────────────────────────────────────────────────────────────────
    const pond = MeshBuilder.CreateGround('pond', { width: 15, height: 12 }, scene);
    pond.position.set(20, 0.05, 15);
    const pondMat = new StandardMaterial('pondMat', scene);
    pondMat.diffuseColor = COLORS.water;
    pondMat.alpha = 0.8;
    pond.material = pondMat;

    // ─── TREES ──────────────────────────────────────────────────────────────────
    const createTree = (x: number, z: number) => {
      const trunk = MeshBuilder.CreateCylinder('trunk', { diameter: 1, height: 4 }, scene);
      trunk.position.set(x, 2, z);
      const trunkMat = new StandardMaterial('trunkMat', scene);
      trunkMat.diffuseColor = COLORS.woodBrown;
      trunk.material = trunkMat;
      shadowGen.addShadowCaster(trunk);

      const leaves = MeshBuilder.CreateSphere('leaves', { diameter: 5 }, scene);
      leaves.position.set(x, 5, z);
      const leavesMat = new StandardMaterial('leavesMat', scene);
      leavesMat.diffuseColor = new Color3(0.2, 0.6, 0.2);
      leaves.material = leavesMat;
      shadowGen.addShadowCaster(leaves);
    };

    createTree(-35, 10);
    createTree(30, -15);
    createTree(-20, 25);
    createTree(35, 5);

    // ─── HAY BALES ──────────────────────────────────────────────────────────────
    const createHayBale = (x: number, z: number) => {
      const bale = MeshBuilder.CreateBox('hay', { width: 3, height: 2, depth: 2 }, scene);
      bale.position.set(x, 1, z);
      const hayMat = new StandardMaterial('hayMat', scene);
      hayMat.diffuseColor = new Color3(0.9, 0.8, 0.3);
      bale.material = hayMat;
      bale.checkCollisions = true;
      shadowGen.addShadowCaster(bale);
    };

    createHayBale(10, -20);
    createHayBale(15, -18);
    createHayBale(-10, 20);

    // ─── FENCE ──────────────────────────────────────────────────────────────────
    for (let i = 0; i < 10; i++) {
      const post = MeshBuilder.CreateBox(`fence_${i}`, { width: 0.3, height: 3, depth: 0.3 }, scene);
      post.position.set(-40 + i * 4, 1.5, -35);
      const fenceMat = new StandardMaterial('fenceMat', scene);
      fenceMat.diffuseColor = COLORS.woodBrown;
      post.material = fenceMat;
    }
  }, []);

  // ─── Create Player ───────────────────────────────────────────────────────────
  const createPlayer = useCallback((scene: Scene, shadowGen: ShadowGenerator) => {
    const playerRoot = new Mesh('playerRoot', scene);
    playerRoot.position.set(0, 1, 20);

    // Body - chameleon shape
    const body = MeshBuilder.CreateSphere('body', { diameter: 1.5 }, scene);
    body.position.y = 0.75;
    body.parent = playerRoot;
    const bodyMat = new StandardMaterial('bodyMat', scene);
    bodyMat.diffuseColor = Color3.FromHexString(playerColor);
    body.material = bodyMat;
    shadowGen.addShadowCaster(body);

    // Head
    const head = MeshBuilder.CreateSphere('head', { diameter: 1 }, scene);
    head.position.set(0, 1.2, 0.8);
    head.parent = playerRoot;
    const headMat = new StandardMaterial('headMat', scene);
    headMat.diffuseColor = Color3.FromHexString(playerColor);
    head.material = headMat;

    // Eyes
    const leftEye = MeshBuilder.CreateSphere('leftEye', { diameter: 0.3 }, scene);
    leftEye.position.set(-0.3, 1.4, 1.1);
    leftEye.parent = playerRoot;
    const eyeMat = new StandardMaterial('eyeMat', scene);
    eyeMat.diffuseColor = new Color3(1, 1, 1);
    leftEye.material = eyeMat;

    const rightEye = leftEye.clone('rightEye');
    rightEye!.position.set(0.3, 1.4, 1.1);
    rightEye!.parent = playerRoot;

    // Pupils
    const leftPupil = MeshBuilder.CreateSphere('leftPupil', { diameter: 0.15 }, scene);
    leftPupil.position.set(-0.3, 1.4, 1.25);
    leftPupil.parent = playerRoot;
    const pupilMat = new StandardMaterial('pupilMat', scene);
    pupilMat.diffuseColor = new Color3(0, 0, 0);
    leftPupil.material = pupilMat;

    const rightPupil = leftPupil.clone('rightPupil');
    rightPupil!.position.set(0.3, 1.4, 1.25);
    rightPupil!.parent = playerRoot;

    // Tail
    const tail = MeshBuilder.CreateTorus('tail', { diameter: 1.2, thickness: 0.3 }, scene);
    tail.position.set(0, 0.5, -0.8);
    tail.rotation.x = Math.PI / 2;
    tail.parent = playerRoot;
    const tailMat = new StandardMaterial('tailMat', scene);
    tailMat.diffuseColor = Color3.FromHexString(playerColor);
    tail.material = tailMat;

    (playerRoot as any).colorableMeshes = [body, head, tail];

    return playerRoot;
  }, [playerColor]);

  // ─── Initialize Game ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current || phase === 'loading' || phase === 'lobby') return;

    const engine = new Engine(canvasRef.current, true);
    engineRef.current = engine;

    const scene = new Scene(engine);
    sceneRef.current = scene;
    scene.collisionsEnabled = true;
    scene.clearColor = new Color4(0.5, 0.7, 0.9, 1);

    // Lighting
    const hemiLight = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.7;
    hemiLight.groundColor = new Color3(0.3, 0.5, 0.2);
    
    const dirLight = new DirectionalLight('dir', new Vector3(-1, -2, -1), scene);
    dirLight.intensity = 0.8;
    dirLight.position = new Vector3(50, 100, 50);

    const shadowGen = new ShadowGenerator(1024, dirLight);
    shadowGen.useBlurExponentialShadowMap = true;

    // Create map
    createFarmMap(scene, shadowGen);

    // Create player
    const player = createPlayer(scene, shadowGen);
    playerRef.current = player;

    // Follow Camera
    const camera = new FollowCamera('followCam', new Vector3(0, 5, 25), scene);
    camera.lockedTarget = player;
    camera.radius = 15;
    camera.heightOffset = 8;
    camera.rotationOffset = 180;
    camera.cameraAcceleration = 0.03;
    camera.maxCameraSpeed = 15;

    // Keyboard input
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': keysRef.current.w = true; break;
        case 'a': keysRef.current.a = true; break;
        case 's': keysRef.current.s = true; break;
        case 'd': keysRef.current.d = true; break;
        case ' ': keysRef.current.space = true; break;
        case 'shift': keysRef.current.shift = true; break;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': keysRef.current.w = false; break;
        case 'a': keysRef.current.a = false; break;
        case 's': keysRef.current.s = false; break;
        case 'd': keysRef.current.d = false; break;
        case ' ': keysRef.current.space = false; break;
        case 'shift': keysRef.current.shift = false; break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Game loop
    let lastTime = performance.now();
    const observer = scene.onBeforeRenderObservable.add(() => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (player && phase === 'seek') {
        const forward = player.forward;
        let moveVector = Vector3.Zero();

        if (keysRef.current.w) moveVector = moveVector.add(forward);
        if (keysRef.current.s) moveVector = moveVector.subtract(forward);
        if (keysRef.current.a) player.rotation.y -= 2.5 * delta;
        if (keysRef.current.d) player.rotation.y += 2.5 * delta;

        isRunning.current = keysRef.current.shift;
        const speed = isRunning.current ? playerSpeed * 1.8 : playerSpeed;

        if (moveVector.length() > 0) {
          moveVector.normalize().scaleInPlace(speed);
          const newPos = player.position.add(moveVector);
          newPos.x = Math.max(-48, Math.min(48, newPos.x));
          newPos.z = Math.max(-48, Math.min(48, newPos.z));
          player.position = newPos;
        }

        // Update compass
        const angle = Math.atan2(player.forward.x, player.forward.z) * (180 / Math.PI);
        setCompassAngle(Math.round((angle + 360) % 360));
      }
    });

    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      scene.onBeforeRenderObservable.remove(observer);
      engine.dispose();
    };
  }, [createFarmMap, createPlayer, phase]);

  // ─── Timer ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'seek') return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setPhase('result');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // ─── Chat ────────────────────────────────────────────────────────────────────
  const sendChat = () => {
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      player: 'You',
      message: chatInput,
      time: 'now',
    };
    setChatMessages(prev => [...prev.slice(-4), newMsg]);
    setChatInput('');
  };

  // ─── Apply Color ─────────────────────────────────────────────────────────────
  const applyColor = (color: string) => {
    setPlayerColor(color);
    if (playerRef.current && (playerRef.current as any).colorableMeshes) {
      const meshes = (playerRef.current as any).colorableMeshes as Mesh[];
      meshes.forEach(mesh => {
        const mat = mesh.material as StandardMaterial;
        if (mat) mat.diffuseColor = Color3.FromHexString(color);
      });
    }
    setShowPaintPanel(false);
  };

  const colorOptions = ['#33ff57', '#ff3333', '#3333ff', '#ffff33', '#ff33ff', '#33ffff', '#ff9933', '#8B4513', '#ffffff'];

  // ─── LOADING SCREEN ──────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md w-full px-6">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-green-400 to-yellow-400 mb-2">
            MECHA CHAMELEON
          </h1>
          <div className="text-teal-400 text-lg font-bold mb-8">LOADING</div>
          
          <div className="relative mb-4">
            <div className="text-6xl font-black text-white">{loadingProgress}%</div>
          </div>
          
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-gradient-to-r from-teal-400 to-green-400 transition-all duration-200"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          
          <p className="text-slate-400 text-sm mb-2">Preparing arena · Syncing servers · Warming shaders</p>
          <p className="text-teal-400 text-xs italic">TIP: Climb walls — verticality wins matches.</p>
        </div>
      </div>
    );
  }

  // ─── LOBBY SCREEN ────────────────────────────────────────────────────────────
  if (phase === 'lobby') {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-4 border border-teal-500/30">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🦎</div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400">
              HIDE AND SEEK
            </h2>
            <p className="text-slate-400 mt-2">Camouflage, Stealth & Combat</p>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">MODE</span>
              <span className="text-white font-bold">{mode.toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">ROLE</span>
              <span className="text-teal-400 font-bold">{role.toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">MAP</span>
              <span className="text-white font-bold">FARM BARN</span>
            </div>
          </div>
          
          <button 
            onClick={() => setPhase('prep')}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold py-4 rounded-xl transition transform hover:scale-105"
          >
            ▶ START GAME
          </button>
          
          <button 
            onClick={onExit}
            className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 rounded-xl transition"
          >
            RETURN TO LOBBY
          </button>
        </div>
      </div>
    );
  }

  // ─── GAME SCREEN ─────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Top Left Controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-auto">
        <button onClick={() => setPhase('lobby')} className="bg-blue-600 hover:bg-blue-500 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold">
          ||
        </button>
        <div className="bg-yellow-500/90 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          ☀️ MORNING
        </div>
        <button className="bg-yellow-500/90 hover:bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          🖱️ ESC / TAB = MOUSE
        </button>
      </div>

      {/* Top Center Status */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            👤 ⏳ {timeLeft}
          </div>
          <div className="bg-black/70 text-white px-4 py-1 rounded-full text-sm font-bold">
            ROUND 1 · SERVER #25 · 1/10
          </div>
          <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            LIVES {Array.from({ length: lives }).map((_, i) => <span key={i} className="text-red-500">♥</span>)}
          </div>
        </div>
        
        {isImpostor && (
          <div className="bg-yellow-500/90 text-black px-4 py-1 rounded-full text-sm font-bold animate-pulse">
            ⚠ YOU ARE THE IMPOSTOR
          </div>
        )}
      </div>

      {/* Top Right */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <button className="bg-red-600/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold border-2 border-red-400">
          Havoc 🔫
        </button>
      </div>

      {/* Chat Toggle */}
      <div className="absolute top-20 left-4 pointer-events-auto">
        <button 
          onClick={() => setShowChat(!showChat)}
          className={`${showChat ? 'bg-green-600' : 'bg-black/60'} backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-green-500 transition`}
        >
          💬 Party chat
        </button>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <div className="absolute top-32 left-4 w-72 bg-black/80 backdrop-blur-md rounded-xl overflow-hidden z-50">
          <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
            {chatMessages.map(msg => (
              <div key={msg.id} className="text-sm">
                <span className="text-teal-400 font-bold">{msg.player}</span>
                <span className="text-slate-400 mx-1">:</span>
                <span className="text-white">{msg.message}</span>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChat()}
              placeholder="Type..."
              className="flex-1 bg-white/10 text-white px-3 py-1 rounded text-sm focus:outline-none"
            />
            <button onClick={sendChat} className="bg-green-600 text-white px-3 py-1 rounded text-sm">
              Send
            </button>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-auto">
        {/* Left - Virtual Joystick Placeholder */}
        <div className="w-24 h-24 rounded-full border-2 border-white/30 bg-white/10 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/50" />
        </div>

        {/* Center - Action Buttons */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <button className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-black/80">
              😀 Emotes
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-500">
              ⬆️ Jump
            </button>
            <button className="bg-slate-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-500">
              ⬇️ DOWN
            </button>
            <button 
              className={`${isRunning.current ? 'bg-yellow-500' : 'bg-slate-600'} text-white px-4 py-2 rounded-full text-sm font-bold`}
            >
              🏃 RUN {isRunning.current ? 'ON' : 'OFF'}
            </button>
            <button 
              onClick={() => setShowPaintPanel(!showPaintPanel)}
              className={`${showPaintPanel ? 'bg-green-500' : 'bg-purple-600'} text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-purple-500`}
            >
              🎨 Open paint panel
            </button>
            <button className="bg-slate-600 text-white px-4 py-2 rounded-full text-sm font-bold">
              📢 Whistle
            </button>
          </div>
          
          {/* Compass */}
          <div className="bg-black/60 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-4">
            <span className={compassAngle >= 315 || compassAngle < 45 ? 'text-yellow-400' : ''}>N</span>
            <span className={compassAngle >= 45 && compassAngle < 135 ? 'text-yellow-400' : ''}>E</span>
            <span className={compassAngle >= 135 && compassAngle < 225 ? 'text-yellow-400' : ''}>S</span>
            <span className={compassAngle >= 225 && compassAngle < 315 ? 'text-yellow-400' : ''}>W</span>
            <span className="ml-2 text-yellow-400">{['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(compassAngle / 45) % 8]} {compassAngle.toString().padStart(3, '0')}°</span>
          </div>
        </div>

        {/* Right - Action Buttons */}
        <div className="flex gap-3">
          <button className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl">
            😊
          </button>
          <button className="w-20 h-20 rounded-full bg-red-600 border-4 border-red-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            🔫
          </button>
        </div>
      </div>

      {/* Paint Panel */}
      {showPaintPanel && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full mx-4 border border-teal-500/30">
            <h3 className="text-white text-xl font-bold mb-4 text-center">🎨 Paint Your Chameleon</h3>
            <p className="text-slate-400 text-sm mb-4 text-center">Match the environment to hide!</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {colorOptions.map(color => (
                <button
                  key={color}
                  onClick={() => applyColor(color)}
                  className="w-full aspect-square rounded-xl border-4 border-transparent hover:border-white transition"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <button 
              onClick={() => setShowPaintPanel(false)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-bold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Result Screen */}
      {phase === 'result' && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-slate-800/90 rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-gradient-to-r from-teal-400 via-green-400 to-yellow-400 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400 mb-2">
              VICTORY
            </h2>
            <p className="text-slate-400 mb-6">The crew survived.</p>
            
            <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white" />
                  <div>
                    <div className="text-white font-bold">Player5139 <span className="text-teal-400">(YOU)</span></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="bg-slate-600 text-white px-2 py-1 rounded text-xs">CREW</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">WIN</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => { setPhase('lobby'); setTimeLeft(180); setScore(0); }}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold"
              >
                ▶ RETURN TO LOBBY
              </button>
              <button 
                onClick={() => { setPhase('prep'); setTimeLeft(180); setScore(0); }}
                className="flex-1 bg-teal-500 text-white py-3 rounded-xl font-bold"
              >
                ↻ REPLAY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prep Screen */}
      {phase === 'prep' && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
          <div className="text-center">
            <h2 className="text-5xl font-black text-white mb-4">HIDE!</h2>
            <p className="text-slate-300 mb-2">Find a spot and match the environment color</p>
            <p className="text-yellow-400 mb-6">Press 🎨 Open paint panel to change color</p>
            <button 
              onClick={() => setPhase('seek')}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:scale-105 transition"
            >
              ▶ START HIDING
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
