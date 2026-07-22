'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Engine, Scene, FollowCamera, Vector3, HemisphericLight, DirectionalLight,
  MeshBuilder, Color3, Color4, Texture, DynamicTexture,
  Mesh, StandardMaterial, ShadowGenerator, PointerEventTypes,
  Animation, ParticleSystem, Scalar
} from '@babylonjs/core';
import { ArrowLeft, Palette, Clock, MessageCircle, Users, Zap, Star, Sparkles } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type GamePhase = 'prep' | 'seek' | 'result';
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

// ─── Map Constants ─────────────────────────────────────────────────────────────
const MAP_WIDTH = 40;
const MAP_DEPTH = 30;
const WALL_HEIGHT = 12;

// ─── Colors from screenshot ────────────────────────────────────────────────────
const COLORS = {
  floorWhite: new Color3(0.95, 0.95, 0.95),
  floorBlue: new Color3(0.4, 0.6, 0.9),
  floorPurple: new Color3(0.7, 0.5, 0.8),
  floorGreen: new Color3(0.5, 0.8, 0.5),
  wallBrown: new Color3(0.6, 0.45, 0.35),
  chalkboardGreen: new Color3(0.2, 0.4, 0.25),
  deskBrown: new Color3(0.7, 0.5, 0.3),
  chairCyan: new Color3(0.3, 0.8, 0.9),
  chairYellow: new Color3(0.95, 0.9, 0.4),
  chairPink: new Color3(0.95, 0.5, 0.7),
  bookshelfBrown: new Color3(0.5, 0.35, 0.25),
  playerRed: new Color3(0.9, 0.2, 0.15),
  playerWheel: new Color3(0.15, 0.15, 0.15),
};

export default function MecchaGameplayV4({ mode, role, onExit }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const playerRef = useRef<Mesh | null>(null);
  const cameraRef = useRef<FollowCamera | null>(null);
  
  const [phase, setPhase] = useState<GamePhase>('prep');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [matchPercent, setMatchPercent] = useState(0);
  const [playerColor, setPlayerColor] = useState('#ff3333');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', player: 'Ryn', message: 'Anyone in the classroom?', time: '2m ago' },
    { id: '2', player: 'Alex', message: 'Joining now!', time: '1m ago' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [lives, setLives] = useState(5);
  
  const keysRef = useRef({ w: false, a: false, s: false, d: false, space: false });
  const playerSpeed = 0.15;
  const playerVelocity = useRef(new Vector3(0, 0, 0));

  // ─── Create Classroom Map (exactly like screenshot) ──────────────────────────
  const createClassroom = useCallback((scene: Scene) => {
    const shadowGen = new ShadowGenerator(1024, new DirectionalLight('dir', new Vector3(-1, -2, -1), scene));
    shadowGen.useBlurExponentialShadowMap = true;

    // Floor - colored tile pattern like screenshot
    const tileSize = 4;
    const cols = Math.ceil(MAP_WIDTH / tileSize);
    const rows = Math.ceil(MAP_DEPTH / tileSize);
    
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        const tile = MeshBuilder.CreateBox(`tile_${x}_${z}`, { width: tileSize, height: 0.2, depth: tileSize }, scene);
        tile.position.x = (x - cols/2) * tileSize + tileSize/2;
        tile.position.z = (z - rows/2) * tileSize + tileSize/2;
        tile.position.y = 0;
        
        const mat = new StandardMaterial(`tileMat_${x}_${z}`, scene);
        // Create colorful pattern like screenshot
        const colorPattern = (x + z) % 4;
        if (colorPattern === 0) mat.diffuseColor = COLORS.floorWhite;
        else if (colorPattern === 1) mat.diffuseColor = COLORS.floorBlue;
        else if (colorPattern === 2) mat.diffuseColor = COLORS.floorPurple;
        else mat.diffuseColor = COLORS.floorGreen;
        mat.specularColor = new Color3(0.1, 0.1, 0.1);
        tile.material = mat;
        tile.receiveShadows = true;
      }
    }

    // Walls
    const createWall = (name: string, w: number, h: number, d: number, x: number, y: number, z: number) => {
      const wall = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
      wall.position.set(x, y, z);
      const mat = new StandardMaterial(name + 'Mat', scene);
      mat.diffuseColor = COLORS.wallBrown;
      wall.material = mat;
      wall.checkCollisions = true;
      return wall;
    };

    // Back wall with chalkboard
    createWall('backWall', MAP_WIDTH, WALL_HEIGHT, 1, 0, WALL_HEIGHT/2, -MAP_DEPTH/2 - 0.5);
    
    // Side walls
    createWall('leftWall', 1, WALL_HEIGHT, MAP_DEPTH, -MAP_WIDTH/2 - 0.5, WALL_HEIGHT/2, 0);
    createWall('rightWall', 1, WALL_HEIGHT, MAP_DEPTH, MAP_WIDTH/2 + 0.5, WALL_HEIGHT/2, 0);
    
    // Front wall with door opening
    createWall('frontWallLeft', MAP_WIDTH/2 - 3, WALL_HEIGHT, 1, -MAP_WIDTH/4 - 3, WALL_HEIGHT/2, MAP_DEPTH/2 + 0.5);
    createWall('frontWallRight', MAP_WIDTH/2 - 3, WALL_HEIGHT, 1, MAP_WIDTH/4 + 3, WALL_HEIGHT/2, MAP_DEPTH/2 + 0.5);

    // ─── CHALKBOARD (like screenshot) ───────────────────────────────────────────
    const chalkboard = MeshBuilder.CreateBox('chalkboard', { width: 24, height: 10, depth: 0.3 }, scene);
    chalkboard.position.set(0, 7, -MAP_DEPTH/2 + 0.5);
    const cbMat = new StandardMaterial('chalkboardMat', scene);
    cbMat.diffuseColor = COLORS.chalkboardGreen;
    
    // Create text texture for chalkboard
    const textTexture = new DynamicTexture('chalkText', { width: 512, height: 256 }, scene);
    const ctx = textTexture.getContext();
    ctx.fillStyle = '#2d5a3d';
    ctx.fillRect(0, 0, 512, 256);
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#e8dcc0';
    ctx.textAlign = 'center';
    ctx.fillText('ROOM 3 CLASSROOM', 256, 60);
    ctx.font = '24px Arial';
    ctx.fillText('A B C  1 2 3  •  C O L O R S', 256, 100);
    ctx.fillText('R E A D  D R A W  P L A Y', 256, 140);
    ctx.font = '18px Arial';
    ctx.fillText('BIG COLORFUL CLASS', 256, 190);
    textTexture.update();
    cbMat.diffuseTexture = textTexture;
    chalkboard.material = cbMat;

    // ─── DESKS AND CHAIRS (like screenshot) ─────────────────────────────────────
    const createDesk = (x: number, z: number, chairColor: Color3) => {
      // Desk top
      const desk = MeshBuilder.CreateBox('desk', { width: 3, height: 0.15, depth: 2 }, scene);
      desk.position.set(x, 2.5, z);
      const deskMat = new StandardMaterial('deskMat', scene);
      deskMat.diffuseColor = COLORS.deskBrown;
      desk.material = deskMat;
      desk.checkCollisions = true;
      shadowGen.addShadowCaster(desk);

      // Desk legs
      const legPositions = [[-1.3, -0.8], [1.3, -0.8], [-1.3, 0.8], [1.3, 0.8]];
      legPositions.forEach(([lx, lz], i) => {
        const leg = MeshBuilder.CreateCylinder(`leg_${i}`, { diameter: 0.1, height: 2.5 }, scene);
        leg.position.set(x + lx, 1.25, z + lz);
        leg.material = deskMat;
      });

      // Chair
      const chair = MeshBuilder.CreateBox('chair', { width: 1.2, height: 0.1, depth: 1.2 }, scene);
      chair.position.set(x, 1.3, z + 2);
      const chairMat = new StandardMaterial('chairMat', scene);
      chairMat.diffuseColor = chairColor;
      chair.material = chairMat;
      chair.checkCollisions = true;

      // Chair back
      const chairBack = MeshBuilder.CreateBox('chairBack', { width: 1.2, height: 1.5, depth: 0.1 }, scene);
      chairBack.position.set(x, 2, z + 2.55);
      chairBack.material = chairMat;
    };

    // Create rows of desks like screenshot
    const deskColors = [COLORS.chairCyan, COLORS.chairYellow, COLORS.chairPink, COLORS.chairCyan];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        createDesk(
          -12 + col * 8,
          -5 + row * 6,
          deskColors[col % deskColors.length]
        );
      }
    }

    // ─── BOOKSHELF (like screenshot) ────────────────────────────────────────────
    const createBookshelf = (x: number, z: number) => {
      const shelf = MeshBuilder.CreateBox('bookshelf', { width: 6, height: 8, depth: 1.5 }, scene);
      shelf.position.set(x, 4, z);
      const shelfMat = new StandardMaterial('shelfMat', scene);
      shelfMat.diffuseColor = COLORS.bookshelfBrown;
      shelf.material = shelfMat;
      shelf.checkCollisions = true;

      // Colorful books
      const bookColors = [
        new Color3(1, 0.2, 0.2), new Color3(0.2, 0.6, 1), new Color3(1, 0.9, 0.2),
        new Color3(0.8, 0.2, 0.8), new Color3(0.2, 0.8, 0.4), new Color3(1, 0.6, 0.2),
      ];
      for (let shelfRow = 0; shelfRow < 4; shelfRow++) {
        for (let book = 0; book < 8; book++) {
          const bookMesh = MeshBuilder.CreateBox(`book_${shelfRow}_${book}`, { 
            width: 0.4, height: 1.2, depth: 1.2 
          }, scene);
          bookMesh.position.set(
            x - 2.5 + book * 0.7,
            1.5 + shelfRow * 1.8,
            z
          );
          const bookMat = new StandardMaterial(`bookMat_${shelfRow}_${book}`, scene);
          bookMat.diffuseColor = bookColors[book % bookColors.length];
          bookMesh.material = bookMat;
        }
      }
    };

    createBookshelf(12, -8);

    // ─── TEACHER DESK ────────────────────────────────────────────────────────────
    const teacherDesk = MeshBuilder.CreateBox('teacherDesk', { width: 5, height: 3, depth: 3 }, scene);
    teacherDesk.position.set(0, 1.5, -8);
    const tdMat = new StandardMaterial('tdMat', scene);
    tdMat.diffuseColor = COLORS.deskBrown;
    teacherDesk.material = tdMat;
    teacherDesk.checkCollisions = true;

    // Globe on teacher desk
    const globe = MeshBuilder.CreateSphere('globe', { diameter: 1 }, scene);
    globe.position.set(-1.5, 4, -8);
    const globeMat = new StandardMaterial('globeMat', scene);
    globeMat.diffuseColor = new Color3(0.2, 0.4, 0.8);
    globe.material = globeMat;

    // Ceiling beams (like screenshot)
    for (let i = 0; i < 4; i++) {
      const beam = MeshBuilder.CreateBox(`beam_${i}`, { width: MAP_WIDTH, height: 0.5, depth: 0.8 }, scene);
      beam.position.set(0, 11, -8 + i * 6);
      const beamMat = new StandardMaterial(`beamMat_${i}`, scene);
      beamMat.diffuseColor = new Color3(0.2, 0.2, 0.2);
      beam.material = beamMat;
    }

    return shadowGen;
  }, []);

  // ─── Create Blocky Player Character (like screenshot) ─────────────────────────
  const createPlayer = useCallback((scene: Scene, shadowGen: ShadowGenerator) => {
    const playerRoot = new Mesh('playerRoot', scene);
    playerRoot.position.set(0, 2, 8);

    // Body - red block (like screenshot)
    const body = MeshBuilder.CreateBox('body', { width: 1.2, height: 1.5, depth: 0.8 }, scene);
    body.position.y = 1.5;
    body.parent = playerRoot;
    const bodyMat = new StandardMaterial('bodyMat', scene);
    bodyMat.diffuseColor = COLORS.playerRed;
    body.material = bodyMat;
    shadowGen.addShadowCaster(body);

    // Head
    const head = MeshBuilder.CreateBox('head', { width: 0.9, height: 0.9, depth: 0.9 }, scene);
    head.position.y = 3;
    head.parent = playerRoot;
    const headMat = new StandardMaterial('headMat', scene);
    headMat.diffuseColor = COLORS.playerRed;
    head.material = headMat;

    // Eyes
    const leftEye = MeshBuilder.CreateSphere('leftEye', { diameter: 0.2 }, scene);
    leftEye.position.set(-0.25, 3.1, 0.4);
    leftEye.parent = playerRoot;
    const eyeMat = new StandardMaterial('eyeMat', scene);
    eyeMat.diffuseColor = new Color3(1, 1, 1);
    leftEye.material = eyeMat;

    const rightEye = leftEye.clone('rightEye');
    rightEye!.position.set(0.25, 3.1, 0.4);
    rightEye!.parent = playerRoot;

    // Wheels/legs (black cylinders like screenshot)
    const wheelPositions = [[-0.5, 0.5], [0.5, 0.5], [-0.5, -0.3], [0.5, -0.3]];
    wheelPositions.forEach(([wx, wz], i) => {
      const wheel = MeshBuilder.CreateCylinder(`wheel_${i}`, { diameter: 0.6, height: 0.3 }, scene);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, 0.3, wz);
      wheel.parent = playerRoot;
      const wheelMat = new StandardMaterial(`wheelMat_${i}`, scene);
      wheelMat.diffuseColor = COLORS.playerWheel;
      wheel.material = wheelMat;
    });

    // Color changeable parts reference
    (playerRoot as any).colorableMeshes = [body, head];

    return playerRoot;
  }, []);

  // ─── Initialize Game ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true);
    engineRef.current = engine;

    const scene = new Scene(engine);
    sceneRef.current = scene;
    scene.collisionsEnabled = true;
    scene.clearColor = new Color4(0.1, 0.1, 0.15, 1);

    // Lighting
    const hemiLight = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.6;
    
    const dirLight = new DirectionalLight('dir', new Vector3(-1, -2, -1), scene);
    dirLight.intensity = 0.8;
    dirLight.position = new Vector3(20, 40, 20);

    // Create classroom
    const shadowGen = createClassroom(scene);

    // Create player
    const player = createPlayer(scene, shadowGen);
    playerRef.current = player;

    // Follow Camera - behind player, smooth follow
    const camera = new FollowCamera('followCam', new Vector3(0, 5, 15), scene);
    camera.lockedTarget = player;
    camera.radius = 12;
    camera.heightOffset = 6;
    camera.rotationOffset = 180;
    camera.cameraAcceleration = 0.05;
    camera.maxCameraSpeed = 10;
    cameraRef.current = camera;

    // Keyboard input
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': keysRef.current.w = true; break;
        case 'a': keysRef.current.a = true; break;
        case 's': keysRef.current.s = true; break;
        case 'd': keysRef.current.d = true; break;
        case ' ': keysRef.current.space = true; break;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': keysRef.current.w = false; break;
        case 'a': keysRef.current.a = false; break;
        case 's': keysRef.current.s = false; break;
        case 'd': keysRef.current.d = false; break;
        case ' ': keysRef.current.space = false; break;
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
        // Movement
        const forward = player.forward;
        const right = player.right;
        let moveVector = Vector3.Zero();

        if (keysRef.current.w) moveVector = moveVector.add(forward);
        if (keysRef.current.s) moveVector = moveVector.subtract(forward);
        if (keysRef.current.a) {
          player.rotation.y -= 2 * delta;
        }
        if (keysRef.current.d) {
          player.rotation.y += 2 * delta;
        }

        if (moveVector.length() > 0) {
          moveVector.normalize().scaleInPlace(playerSpeed);
          const newPos = player.position.add(moveVector);
          
          // Boundary check
          newPos.x = Math.max(-MAP_WIDTH/2 + 1, Math.min(MAP_WIDTH/2 - 1, newPos.x));
          newPos.z = Math.max(-MAP_DEPTH/2 + 1, Math.min(MAP_DEPTH/2 - 1, newPos.z));
          
          player.position = newPos;
        }
      }
    });

    // Render loop
    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', () => engine.resize());
      scene.onBeforeRenderObservable.remove(observer);
      engine.dispose();
    };
  }, [createClassroom, createPlayer, phase]);

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

  // ─── Color Picker ────────────────────────────────────────────────────────────
  const applyColor = (color: string) => {
    setPlayerColor(color);
    if (playerRef.current && (playerRef.current as any).colorableMeshes) {
      const meshes = (playerRef.current as any).colorableMeshes as Mesh[];
      meshes.forEach(mesh => {
        const mat = mesh.material as StandardMaterial;
        if (mat) {
          const c = Color3.FromHexString(color);
          mat.diffuseColor = c;
        }
      });
    }
    setIsColorPickerOpen(false);
  };

  // ─── Chat ────────────────────────────────────────────────────────────────────
  const sendChat = () => {
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      player: 'You',
      message: chatInput,
      time: 'now',
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  const colorOptions = ['#ff3333', '#33ff33', '#3333ff', '#ffff33', '#ff33ff', '#33ffff', '#ff9933', '#ffffff', '#333333'];

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Game Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none">
        {/* Lives */}
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-white font-bold text-sm">LIVES</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < lives ? 'text-red-500' : 'text-gray-600'}>♥</span>
            ))}
          </div>
        </div>

        {/* Score */}
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-6 py-2">
          <span className="text-yellow-400 font-bold text-xl">{score.toLocaleString()}</span>
        </div>

        {/* Timer */}
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-white" />
          <span className="text-white font-bold text-lg">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end pointer-events-none">
        {/* Left - Back & Chat */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          <button onClick={onExit} className="bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-3 transition">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`${showChat ? 'bg-green-600' : 'bg-black/60 hover:bg-black/80'} backdrop-blur-sm rounded-full p-3 transition`}
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Center - Color Match */}
        <div className="flex flex-col items-center gap-2 pointer-events-auto">
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-white text-sm">Match: {matchPercent}%</span>
          </div>
          <button 
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-4 shadow-lg hover:scale-105 transition"
          >
            <Palette className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Right - Players */}
        <div className="pointer-events-auto">
          <button className="bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-3 transition">
            <Users className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Color Picker Modal */}
      {isColorPickerOpen && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-white text-xl font-bold mb-4 text-center">Choose Your Color</h3>
            <div className="grid grid-cols-3 gap-3">
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
              onClick={() => setIsColorPickerOpen(false)}
              className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {showChat && (
        <div className="absolute left-4 top-20 bottom-24 w-80 bg-black/80 backdrop-blur-md rounded-2xl flex flex-col z-40">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-bold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Chat
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map(msg => (
              <div key={msg.id} className="bg-white/10 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-green-400 font-bold text-sm">{msg.player}</span>
                  <span className="text-gray-500 text-xs">{msg.time}</span>
                </div>
                <p className="text-white text-sm">{msg.message}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChat()}
                placeholder="Type a message..."
                className="flex-1 bg-white/10 text-white px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button 
                onClick={sendChat}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phase Overlay */}
      {phase === 'prep' && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">HIDE!</h2>
            <p className="text-gray-300 mb-6">Find a spot and match the floor color</p>
            <button 
              onClick={() => setPhase('seek')}
              className="bg-green-500 hover:bg-green-400 text-white px-8 py-3 rounded-full font-bold text-lg transition"
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">Round Complete!</h2>
            <p className="text-yellow-400 text-2xl font-bold mb-6">Score: {score.toLocaleString()}</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => { setPhase('prep'); setTimeLeft(60); setScore(0); }}
                className="bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded-full font-bold transition"
              >
                Play Again
              </button>
              <button 
                onClick={onExit}
                className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-full font-bold transition"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Controls Hint */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/50 text-sm pointer-events-none">
        WASD to move • Space to jump
      </div>
    </div>
  );
}
