'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Engine, Scene, FollowCamera, Vector3, HemisphericLight, DirectionalLight,
  MeshBuilder, Color3, Color4, Texture, DynamicTexture,
  Mesh, StandardMaterial, ShadowGenerator, PointerEventTypes,
  Animation, ParticleSystem, Scalar
} from '@babylonjs/core';
import { ArrowLeft, Palette, Clock, MessageCircle, Users, Zap, Star, Sparkles } from 'lucide-react';
import { joinGameRoom } from './network';

// ─── Types ────────────────────────────────────────────────────────────────────
type GamePhase = 'prep' | 'seek' | 'result';
type RoleType = 'hider' | 'seeker';

type RemotePlayer = {
  mesh: Mesh;
  target: { x: number; y: number; z: number; rotY: number };
  color: string;
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
type RoomType = 'lobby' | 'classroom';

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
const LOBBY_WIDTH = 50;
const LOBBY_DEPTH = 40;
const CLASSROOM_WIDTH = 40;
const CLASSROOM_DEPTH = 30;
const WALL_HEIGHT = 12;

// ─── Colors ────────────────────────────────────────────────────────────────────
const COLORS = {
  // Hotel lobby
  floorBlack: new Color3(0.1, 0.1, 0.1),
  floorWhite: new Color3(0.95, 0.95, 0.95),
  wallCream: new Color3(0.9, 0.85, 0.75),
  wallGold: new Color3(0.8, 0.7, 0.4),
  stairRed: new Color3(0.7, 0.2, 0.2),
  stairCarpet: new Color3(0.9, 0.1, 0.1),
  tableBrown: new Color3(0.5, 0.35, 0.25),
  chairRed: new Color3(0.8, 0.15, 0.15),
  pianoBlack: new Color3(0.1, 0.1, 0.1),
  chandelierGold: new Color3(0.9, 0.8, 0.3),
  
  // Classroom
  chalkboardGreen: new Color3(0.2, 0.4, 0.25),
  deskBrown: new Color3(0.7, 0.5, 0.3),
  chairCyan: new Color3(0.3, 0.8, 0.9),
  chairYellow: new Color3(0.95, 0.9, 0.4),
  chairPink: new Color3(0.95, 0.5, 0.7),
  bookshelfBrown: new Color3(0.5, 0.35, 0.25),
  
  // Player
  playerRed: new Color3(0.9, 0.2, 0.15),
  playerWheel: new Color3(0.15, 0.15, 0.15),
};

export default function MecchaGameplayV5({ mode, role, onExit }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const playerRef = useRef<Mesh | null>(null);
  const cameraRef = useRef<FollowCamera | null>(null);
  const currentRoomRef = useRef<RoomType>('lobby');
  
  const [phase, setPhase] = useState<GamePhase>('prep');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [matchPercent, setMatchPercent] = useState(0);
  const [playerColor, setPlayerColor] = useState('#ffffff');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', player: 'Ryn', message: 'Anyone in the lobby?', time: '2m ago' },
    { id: '2', player: 'Alex', message: 'Going upstairs to classroom!', time: '1m ago' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [lives, setLives] = useState(5);
  const [currentRoom, setCurrentRoom] = useState<RoomType>('lobby');
  
  const keysRef = useRef({ w: false, a: false, s: false, d: false, space: false });
  const playerSpeed = 0.15;
  const playerVelocity = useRef(new Vector3(0, 0, 0));
  const phaseRef = useRef<GamePhase>('prep');
  const projectilesRef = useRef<Mesh[]>([]);
  const targetsRef = useRef<Mesh[]>([]);

  // ─── Networking (Colyseus) ──────────────────────────────────────────────────
  const roomRef = useRef<any>(null);
  const remotePlayersRef = useRef<Map<string, RemotePlayer>>(new Map());
  const playerColorRef = useRef(playerColor);
  const [netStatus, setNetStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
  useEffect(() => { playerColorRef.current = playerColor; }, [playerColor]);

  // ─── Create Hotel Lobby (Room 1) ─────────────────────────────────────────────
  const createHotelLobby = useCallback((scene: Scene, shadowGen: ShadowGenerator) => {
    const lobbyRoot = new Mesh('lobbyRoot', scene);

    // Black and white checkerboard floor
    const tileSize = 4;
    const cols = Math.ceil(LOBBY_WIDTH / tileSize);
    const rows = Math.ceil(LOBBY_DEPTH / tileSize);
    
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        const tile = MeshBuilder.CreateBox(`lobby_tile_${x}_${z}`, { width: tileSize, height: 0.2, depth: tileSize }, scene);
        tile.position.x = (x - cols/2) * tileSize + tileSize/2;
        tile.position.z = (z - rows/2) * tileSize + tileSize/2;
        tile.position.y = 0;
        tile.parent = lobbyRoot;
        
        const mat = new StandardMaterial(`lobbyTileMat_${x}_${z}`, scene);
        // Checkerboard pattern
        const isBlack = (x + z) % 2 === 0;
        mat.diffuseColor = isBlack ? COLORS.floorBlack : COLORS.floorWhite;
        mat.specularColor = new Color3(0.2, 0.2, 0.2);
        tile.material = mat;
        tile.receiveShadows = true;
      }
    }

    // Cream walls with gold trim
    const createWall = (name: string, w: number, h: number, d: number, x: number, y: number, z: number) => {
      const wall = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
      wall.position.set(x, y, z);
      wall.parent = lobbyRoot;
      const mat = new StandardMaterial(name + 'Mat', scene);
      mat.diffuseColor = COLORS.wallCream;
      wall.material = mat;
      wall.checkCollisions = true;
      return wall;
    };

    // Back wall
    createWall('lobby_backWall', LOBBY_WIDTH, WALL_HEIGHT, 1, 0, WALL_HEIGHT/2, -LOBBY_DEPTH/2 - 0.5);
    // Side walls
    createWall('lobby_leftWall', 1, WALL_HEIGHT, LOBBY_DEPTH, -LOBBY_WIDTH/2 - 0.5, WALL_HEIGHT/2, 0);
    createWall('lobby_rightWall', 1, WALL_HEIGHT, LOBBY_DEPTH, LOBBY_WIDTH/2 + 0.5, WALL_HEIGHT/2, 0);
    // Front wall with entrance
    createWall('lobby_frontWallLeft', LOBBY_WIDTH/2 - 4, WALL_HEIGHT, 1, -LOBBY_WIDTH/4 - 4, WALL_HEIGHT/2, LOBBY_DEPTH/2 + 0.5);
    createWall('lobby_frontWallRight', LOBBY_WIDTH/2 - 4, WALL_HEIGHT, 1, LOBBY_WIDTH/4 + 4, WALL_HEIGHT/2, LOBBY_DEPTH/2 + 0.5);

    // Gold trim on walls
    const createTrim = (name: string, w: number, h: number, d: number, x: number, y: number, z: number) => {
      const trim = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
      trim.position.set(x, y, z);
      trim.parent = lobbyRoot;
      const mat = new StandardMaterial(name + 'Mat', scene);
      mat.diffuseColor = COLORS.wallGold;
      trim.material = mat;
    };
    createTrim('lobby_trim1', LOBBY_WIDTH, 0.5, 0.3, 0, 3, -LOBBY_DEPTH/2 + 0.3);
    createTrim('lobby_trim2', LOBBY_WIDTH, 0.5, 0.3, 0, 8, -LOBBY_DEPTH/2 + 0.3);

    // ─── "Mecha Mike" style paintings on walls ─────────────────────────────────
    const createPainting = (x: number, y: number, z: number, rotY: number, frameColor: Color3) => {
      const frame = MeshBuilder.CreateBox('paintingFrame', { width: 4, height: 5, depth: 0.3 }, scene);
      frame.position.set(x, y, z);
      frame.rotation.y = rotY;
      frame.parent = lobbyRoot;
      const frameMat = new StandardMaterial('frameMat', scene);
      frameMat.diffuseColor = frameColor;
      frame.material = frameMat;

      // Canvas with "painted over" famous art style
      const canvas = MeshBuilder.CreatePlane('paintingCanvas', { width: 3.5, height: 4.5 }, scene);
      canvas.position.set(x, y, z + (rotY === 0 ? 0.2 : -0.2));
      canvas.rotation.y = rotY;
      canvas.parent = lobbyRoot;
      
      const canvasTexture = new DynamicTexture('paintingTex', { width: 256, height: 320 }, scene);
      const ctx = canvasTexture.getContext();
      // Abstract colorful painting
      ctx.fillStyle = '#2d1b4e';
      ctx.fillRect(0, 0, 256, 320);
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(20, 40, 100, 120);
      ctx.fillStyle = '#f39c12';
      ctx.fillRect(140, 80, 80, 100);
      ctx.fillStyle = '#27ae60';
      ctx.beginPath();
      ctx.arc(128, 200, 60, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#8e44ad';
      ctx.fillRect(50, 240, 150, 60);
      canvasTexture.update();
      
      const canvasMat = new StandardMaterial('canvasMat', scene);
      canvasMat.diffuseTexture = canvasTexture;
      canvas.material = canvasMat;
    };

    createPainting(-18, 6, -LOBBY_DEPTH/2 + 0.5, 0, new Color3(0.6, 0.4, 0.2));
    createPainting(18, 6, -LOBBY_DEPTH/2 + 0.5, 0, new Color3(0.6, 0.4, 0.2));
    createPainting(-LOBBY_WIDTH/2 + 0.5, 6, -5, Math.PI/2, new Color3(0.6, 0.4, 0.2));
    createPainting(LOBBY_WIDTH/2 - 0.5, 6, 5, -Math.PI/2, new Color3(0.6, 0.4, 0.2));

    // ─── GRAND STAIRCASE ────────────────────────────────────────────────────────
    const createStair = (width: number, height: number, depth: number, x: number, y: number, z: number) => {
      const stair = MeshBuilder.CreateBox('stair', { width, height, depth }, scene);
      stair.position.set(x, y, z);
      stair.parent = lobbyRoot;
      const mat = new StandardMaterial('stairMat', scene);
      mat.diffuseColor = COLORS.stairRed;
      stair.material = mat;
      stair.checkCollisions = true;
      return stair;
    };

    // Main staircase going up to classroom
    for (let i = 0; i < 12; i++) {
      createStair(10, 0.5, 1.5, 0, 0.25 + i * 0.5, -LOBBY_DEPTH/2 + 5 + i * 1.5);
    }

    // Stair railings
    const createRailing = (x: number, z: number, height: number) => {
      const post = MeshBuilder.CreateCylinder('railing', { diameter: 0.15, height }, scene);
      post.position.set(x, height/2, z);
      post.parent = lobbyRoot;
      const mat = new StandardMaterial('railingMat', scene);
      mat.diffuseColor = new Color3(0.8, 0.7, 0.4);
      post.material = mat;
    };

    for (let i = 0; i < 12; i++) {
      const y = 0.5 + i * 0.5;
      const z = -LOBBY_DEPTH/2 + 5 + i * 1.5;
      createRailing(-5, z, y + 1);
      createRailing(5, z, y + 1);
    }

    // ─── DINING TABLES ──────────────────────────────────────────────────────────
    const createDiningTable = (x: number, z: number) => {
      // Table top
      const table = MeshBuilder.CreateCylinder('table', { diameter: 4, height: 0.2 }, scene);
      table.position.set(x, 2.5, z);
      table.parent = lobbyRoot;
      const tableMat = new StandardMaterial('tableMat', scene);
      tableMat.diffuseColor = COLORS.tableBrown;
      table.material = tableMat;
      table.checkCollisions = true;
      shadowGen.addShadowCaster(table);

      // Table leg
      const leg = MeshBuilder.CreateCylinder('tableLeg', { diameter: 0.4, height: 2.5 }, scene);
      leg.position.set(x, 1.25, z);
      leg.parent = lobbyRoot;
      leg.material = tableMat;

      // Chairs around table
      const chairPositions = [[0, 2.5], [2.5, 0], [0, -2.5], [-2.5, 0]];
      chairPositions.forEach(([cx, cz], i) => {
        const chair = MeshBuilder.CreateBox(`chair_${i}`, { width: 1, height: 1.2, depth: 1 }, scene);
        chair.position.set(x + cx, 0.6, z + cz);
        chair.parent = lobbyRoot;
        const chairMat = new StandardMaterial(`chairMat_${i}`, scene);
        chairMat.diffuseColor = COLORS.chairRed;
        chair.material = chairMat;
        chair.checkCollisions = true;
      });
    };

    createDiningTable(-15, 5);
    createDiningTable(15, 5);
    createDiningTable(-15, -5);
    createDiningTable(15, -5);

    // ─── GRAND PIANO ────────────────────────────────────────────────────────────
    const piano = MeshBuilder.CreateBox('piano', { width: 3, height: 2, depth: 1.5 }, scene);
    piano.position.set(-20, 1, -12);
    piano.parent = lobbyRoot;
    const pianoMat = new StandardMaterial('pianoMat', scene);
    pianoMat.diffuseColor = COLORS.pianoBlack;
    piano.material = pianoMat;
    piano.checkCollisions = true;

    // Piano keys
    const keys = MeshBuilder.CreateBox('pianoKeys', { width: 2.8, height: 0.1, depth: 0.4 }, scene);
    keys.position.set(-20, 2.05, -11.2);
    keys.parent = lobbyRoot;
    const keysMat = new StandardMaterial('keysMat', scene);
    keysMat.diffuseColor = new Color3(0.9, 0.9, 0.9);
    keys.material = keysMat;

    // ─── CHANDELIER ─────────────────────────────────────────────────────────────
    const chandelier = MeshBuilder.CreateSphere('chandelier', { diameter: 3 }, scene);
    chandelier.position.set(0, 9, 0);
    chandelier.parent = lobbyRoot;
    const chandMat = new StandardMaterial('chandMat', scene);
    chandMat.diffuseColor = COLORS.chandelierGold;
    chandMat.emissiveColor = new Color3(0.3, 0.25, 0.1);
    chandelier.material = chandMat;

    // Chandelier arms
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const arm = MeshBuilder.CreateCylinder(`arm_${i}`, { diameter: 0.1, height: 2 }, scene);
      arm.rotation.z = Math.PI / 2;
      arm.rotation.y = angle;
      arm.position.set(Math.cos(angle) * 1.5, 9, Math.sin(angle) * 1.5);
      arm.parent = lobbyRoot;
      arm.material = chandMat;
    }

    return lobbyRoot;
  }, []);

  // ─── Create Classroom (Room 2 - upstairs) ────────────────────────────────────
  const createClassroom = useCallback((scene: Scene, shadowGen: ShadowGenerator) => {
    const classroomRoot = new Mesh('classroomRoot', scene);
    classroomRoot.position.y = 100; // Place high up, accessible via stairs

    // Floor - colored tiles
    const tileSize = 4;
    const cols = Math.ceil(CLASSROOM_WIDTH / tileSize);
    const rows = Math.ceil(CLASSROOM_DEPTH / tileSize);
    
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        const tile = MeshBuilder.CreateBox(`class_tile_${x}_${z}`, { width: tileSize, height: 0.2, depth: tileSize }, scene);
        tile.position.x = (x - cols/2) * tileSize + tileSize/2;
        tile.position.z = (z - rows/2) * tileSize + tileSize/2;
        tile.position.y = 0;
        tile.parent = classroomRoot;
        
        const mat = new StandardMaterial(`classTileMat_${x}_${z}`, scene);
        const colorPattern = (x + z) % 4;
        if (colorPattern === 0) mat.diffuseColor = new Color3(0.95, 0.95, 0.95);
        else if (colorPattern === 1) mat.diffuseColor = new Color3(0.4, 0.6, 0.9);
        else if (colorPattern === 2) mat.diffuseColor = new Color3(0.7, 0.5, 0.8);
        else mat.diffuseColor = new Color3(0.5, 0.8, 0.5);
        mat.specularColor = new Color3(0.1, 0.1, 0.1);
        tile.material = mat;
        tile.receiveShadows = true;
      }
    }

    // Walls
    const createWall = (name: string, w: number, h: number, d: number, x: number, y: number, z: number) => {
      const wall = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
      wall.position.set(x, y, z);
      wall.parent = classroomRoot;
      const mat = new StandardMaterial(name + 'Mat', scene);
      mat.diffuseColor = new Color3(0.6, 0.45, 0.35);
      wall.material = mat;
      wall.checkCollisions = true;
      return wall;
    };

    createWall('class_backWall', CLASSROOM_WIDTH, WALL_HEIGHT, 1, 0, WALL_HEIGHT/2, -CLASSROOM_DEPTH/2 - 0.5);
    createWall('class_leftWall', 1, WALL_HEIGHT, CLASSROOM_DEPTH, -CLASSROOM_WIDTH/2 - 0.5, WALL_HEIGHT/2, 0);
    createWall('class_rightWall', 1, WALL_HEIGHT, CLASSROOM_DEPTH, CLASSROOM_WIDTH/2 + 0.5, WALL_HEIGHT/2, 0);
    createWall('class_frontWallLeft', CLASSROOM_WIDTH/2 - 3, WALL_HEIGHT, 1, -CLASSROOM_WIDTH/4 - 3, WALL_HEIGHT/2, CLASSROOM_DEPTH/2 + 0.5);
    createWall('class_frontWallRight', CLASSROOM_WIDTH/2 - 3, WALL_HEIGHT, 1, CLASSROOM_WIDTH/4 + 3, WALL_HEIGHT/2, CLASSROOM_DEPTH/2 + 0.5);

    // Chalkboard
    const chalkboard = MeshBuilder.CreateBox('chalkboard', { width: 24, height: 10, depth: 0.3 }, scene);
    chalkboard.position.set(0, 7, -CLASSROOM_DEPTH/2 + 0.5);
    chalkboard.parent = classroomRoot;
    const cbMat = new StandardMaterial('chalkboardMat', scene);
    cbMat.diffuseColor = COLORS.chalkboardGreen;
    
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

    // Desks and chairs
    const createDesk = (x: number, z: number, chairColor: Color3) => {
      const desk = MeshBuilder.CreateBox('desk', { width: 3, height: 0.15, depth: 2 }, scene);
      desk.position.set(x, 2.5, z);
      desk.parent = classroomRoot;
      const deskMat = new StandardMaterial('deskMat', scene);
      deskMat.diffuseColor = COLORS.deskBrown;
      desk.material = deskMat;
      desk.checkCollisions = true;
      shadowGen.addShadowCaster(desk);

      const legPositions = [[-1.3, -0.8], [1.3, -0.8], [-1.3, 0.8], [1.3, 0.8]];
      legPositions.forEach(([lx, lz], i) => {
        const leg = MeshBuilder.CreateCylinder(`leg_${i}`, { diameter: 0.1, height: 2.5 }, scene);
        leg.position.set(x + lx, 1.25, z + lz);
        leg.parent = classroomRoot;
        leg.material = deskMat;
      });

      const chair = MeshBuilder.CreateBox('chair', { width: 1.2, height: 0.1, depth: 1.2 }, scene);
      chair.position.set(x, 1.3, z + 2);
      chair.parent = classroomRoot;
      const chairMat = new StandardMaterial('chairMat', scene);
      chairMat.diffuseColor = chairColor;
      chair.material = chairMat;
      chair.checkCollisions = true;

      const chairBack = MeshBuilder.CreateBox('chairBack', { width: 1.2, height: 1.5, depth: 0.1 }, scene);
      chairBack.position.set(x, 2, z + 2.55);
      chairBack.parent = classroomRoot;
      chairBack.material = chairMat;
    };

    const deskColors = [COLORS.chairCyan, COLORS.chairYellow, COLORS.chairPink, COLORS.chairCyan];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        createDesk(-12 + col * 8, -5 + row * 6, deskColors[col % deskColors.length]);
      }
    }

    // Bookshelf
    const createBookshelf = (x: number, z: number) => {
      const shelf = MeshBuilder.CreateBox('bookshelf', { width: 6, height: 8, depth: 1.5 }, scene);
      shelf.position.set(x, 4, z);
      shelf.parent = classroomRoot;
      const shelfMat = new StandardMaterial('shelfMat', scene);
      shelfMat.diffuseColor = COLORS.bookshelfBrown;
      shelf.material = shelfMat;
      shelf.checkCollisions = true;

      const bookColors = [
        new Color3(1, 0.2, 0.2), new Color3(0.2, 0.6, 1), new Color3(1, 0.9, 0.2),
        new Color3(0.8, 0.2, 0.8), new Color3(0.2, 0.8, 0.4), new Color3(1, 0.6, 0.2),
      ];
      for (let shelfRow = 0; shelfRow < 4; shelfRow++) {
        for (let book = 0; book < 8; book++) {
          const bookMesh = MeshBuilder.CreateBox(`book_${shelfRow}_${book}`, { width: 0.4, height: 1.2, depth: 1.2 }, scene);
          bookMesh.position.set(x - 2.5 + book * 0.7, 1.5 + shelfRow * 1.8, z);
          bookMesh.parent = classroomRoot;
          const bookMat = new StandardMaterial(`bookMat_${shelfRow}_${book}`, scene);
          bookMat.diffuseColor = bookColors[book % bookColors.length];
          bookMesh.material = bookMat;
        }
      }
    };

    createBookshelf(12, -8);

    // Teacher desk
    const teacherDesk = MeshBuilder.CreateBox('teacherDesk', { width: 5, height: 3, depth: 3 }, scene);
    teacherDesk.position.set(0, 1.5, -8);
    teacherDesk.parent = classroomRoot;
    const tdMat = new StandardMaterial('tdMat', scene);
    tdMat.diffuseColor = COLORS.deskBrown;
    teacherDesk.material = tdMat;
    teacherDesk.checkCollisions = true;

    const globe = MeshBuilder.CreateSphere('globe', { diameter: 1 }, scene);
    globe.position.set(-1.5, 4, -8);
    globe.parent = classroomRoot;
    const globeMat = new StandardMaterial('globeMat', scene);
    globeMat.diffuseColor = new Color3(0.2, 0.4, 0.8);
    globe.material = globeMat;

    // Ceiling beams
    for (let i = 0; i < 4; i++) {
      const beam = MeshBuilder.CreateBox(`beam_${i}`, { width: CLASSROOM_WIDTH, height: 0.5, depth: 0.8 }, scene);
      beam.position.set(0, 11, -8 + i * 6);
      beam.parent = classroomRoot;
      const beamMat = new StandardMaterial(`beamMat_${i}`, scene);
      beamMat.diffuseColor = new Color3(0.2, 0.2, 0.2);
      beam.material = beamMat;
    }

    return classroomRoot;
  }, []);

  // ─── Create Player (iconic white humanoid by default) ────────────────────────
  const createPlayer = useCallback((scene: Scene, shadowGen: ShadowGenerator, playerRole: RoleType) => {
    const playerRoot = new Mesh('playerRoot', scene);
    playerRoot.position.set(0, 2, 15);

    const isSeeker = playerRole === 'seeker';
    // Hider = iconic little white person. Seeker = distinct orange + paint gun.
    const baseColor = isSeeker ? new Color3(0.95, 0.35, 0.1) : new Color3(0.95, 0.95, 0.95);

    // Torso (capsule)
    const torso = MeshBuilder.CreateCapsule('torso', { radius: 0.4, height: 1.4 }, scene);
    torso.position.y = 1.4;
    torso.parent = playerRoot;
    const bodyMat = new StandardMaterial('bodyMat', scene);
    bodyMat.diffuseColor = baseColor;
    torso.material = bodyMat;
    shadowGen.addShadowCaster(torso);

    // Head
    const head = MeshBuilder.CreateSphere('head', { diameter: 0.7 }, scene);
    head.position.y = 2.5;
    head.parent = playerRoot;
    const headMat = new StandardMaterial('headMat', scene);
    headMat.diffuseColor = baseColor;
    head.material = headMat;

    // Eyes
    const leftEye = MeshBuilder.CreateSphere('leftEye', { diameter: 0.12 }, scene);
    leftEye.position.set(-0.15, 2.55, 0.32);
    leftEye.parent = playerRoot;
    const eyeMat = new StandardMaterial('eyeMat', scene);
    eyeMat.diffuseColor = new Color3(0.1, 0.1, 0.1);
    leftEye.material = eyeMat;
    const rightEye = leftEye.clone('rightEye');
    rightEye!.position.set(0.15, 2.55, 0.32);
    rightEye!.parent = playerRoot;

    // Arms
    const leftArm = MeshBuilder.CreateCapsule('leftArm', { radius: 0.13, height: 1.1 }, scene);
    leftArm.position.set(-0.5, 1.4, 0);
    leftArm.parent = playerRoot;
    leftArm.material = bodyMat;
    const rightArm = leftArm.clone('rightArm');
    rightArm!.position.set(0.5, 1.4, 0);
    rightArm!.parent = playerRoot;

    // Legs
    const leftLeg = MeshBuilder.CreateCapsule('leftLeg', { radius: 0.16, height: 1.1 }, scene);
    leftLeg.position.set(-0.2, 0.55, 0);
    leftLeg.parent = playerRoot;
    leftLeg.material = bodyMat;
    const rightLeg = leftLeg.clone('rightLeg');
    rightLeg!.position.set(0.2, 0.55, 0);
    rightLeg!.parent = playerRoot;

    // Seeker paint gun
    let gunTip: Mesh | null = null;
    if (isSeeker) {
      const gunBody = MeshBuilder.CreateBox('gunBody', { width: 0.25, height: 0.25, depth: 0.7 }, scene);
      gunBody.position.set(0.5, 1.4, 0.6);
      gunBody.parent = playerRoot;
      const gunMat = new StandardMaterial('gunMat', scene);
      gunMat.diffuseColor = new Color3(0.2, 0.2, 0.2);
      gunBody.material = gunMat;
      shadowGen.addShadowCaster(gunBody);

      const barrel = MeshBuilder.CreateCylinder('barrel', { diameter: 0.14, height: 0.6 }, scene);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0.5, 1.4, 1.1);
      barrel.parent = playerRoot;
      barrel.material = gunMat;

      gunTip = barrel;
    }

    (playerRoot as any).colorableMeshes = [torso, head, leftArm, rightArm, leftLeg, rightLeg];
    (playerRoot as any).isSeeker = isSeeker;
    (playerRoot as any).gunTip = gunTip;

    return playerRoot;
  }, []);

  // ─── Seeker shooting (paint projectiles) ─────────────────────────────────────
  const shoot = useCallback(() => {
    const scene = sceneRef.current;
    const player = playerRef.current;
    if (!scene || !player || role !== 'seeker') return;
    if (phaseRef.current !== 'seek') return;

    const gunTip = (player as any).gunTip as Mesh | null;
    const origin = gunTip ? gunTip.getAbsolutePosition() : player.position.add(new Vector3(0, 1.4, 0.6));
    const dir = player.forward.clone().normalize();

    const ball = MeshBuilder.CreateSphere('paintBall', { diameter: 0.4 }, scene);
    ball.position.copyFrom(origin);
    const mat = new StandardMaterial('paintMat_' + Date.now(), scene);
    mat.diffuseColor = new Color3(1, 0.2, 0.2);
    mat.emissiveColor = new Color3(0.35, 0, 0);
    ball.material = mat;

    (ball as any).velocity = dir.scale(30);
    (ball as any).life = 2.5;
    projectilesRef.current.push(ball);
  }, [role]);

  // ─── Initialize Game ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return;
    let networkDisposed = false;

    targetsRef.current = [];
    projectilesRef.current = [];

    const engine = new Engine(canvasRef.current, true);
    engineRef.current = engine;

    const scene = new Scene(engine);
    sceneRef.current = scene;
    scene.collisionsEnabled = true;
    scene.clearColor = new Color4(0.1, 0.1, 0.15, 1);

    const hemiLight = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.6;
    
    const dirLight = new DirectionalLight('dir', new Vector3(-1, -2, -1), scene);
    dirLight.intensity = 0.8;
    dirLight.position = new Vector3(20, 40, 20);

    const shadowGen = new ShadowGenerator(1024, dirLight);
    shadowGen.useBlurExponentialShadowMap = true;

    // Create both rooms
    const lobby = createHotelLobby(scene, shadowGen);
    const classroom = createClassroom(scene, shadowGen);

    // Targets for the Seeker to shoot paint at (core gameplay)
    const createTarget = (x: number, z: number, y: number) => {
      const target = MeshBuilder.CreateBox('target', { width: 1.5, height: 2.5, depth: 0.5 }, scene);
      target.position.set(x, y, z);
      const mat = new StandardMaterial('targetMat', scene);
      mat.diffuseColor = new Color3(0.3, 0.3, 0.3);
      target.material = mat;
      shadowGen.addShadowCaster(target);
      targetsRef.current.push(target);
    };
    createTarget(-15, 0, 1.25);
    createTarget(15, 0, 1.25);
    createTarget(0, 12, 1.25);
    createTarget(-8, -10, 1.25);

    // Create player
    const player = createPlayer(scene, shadowGen, role);
    playerRef.current = player;

    // ─── Networking: connect to Colyseus (Phase A — see other players) ─────────
    let sendAccum = 0;
    (async () => {
      try {
        const room = await joinGameRoom({ name: 'You', role, color: playerColorRef.current });
        if (networkDisposed) { room.leave(); return; }
        roomRef.current = room;
        setNetStatus('online');

        const addRemote = (p: any, key: string) => {
          if (key === room.sessionId || remotePlayersRef.current.has(key)) return;
          const mesh = createPlayer(scene, shadowGen, p.role === 'seeker' ? 'seeker' : 'hider');
          const c = Color3.FromHexString(p.color || '#ffffff');
          (mesh as any).colorableMeshes?.forEach((m: Mesh) => {
            const mat = (m.material as StandardMaterial) || new StandardMaterial(`rm_${m.name}`, m.getScene());
            mat.diffuseColor = c;
            m.material = mat;
          });
          mesh.position.set(p.x, p.y, p.z);
          mesh.rotation.y = p.rotY || 0;
          remotePlayersRef.current.set(key, {
            mesh,
            target: { x: p.x, y: p.y, z: p.z, rotY: p.rotY || 0 },
            color: p.color || '#ffffff',
          });
          p.onChange = () => {
            const rp = remotePlayersRef.current.get(key);
            if (!rp) return;
            rp.target.x = p.x; rp.target.y = p.y; rp.target.z = p.z; rp.target.rotY = p.rotY || 0;
            if (p.color !== rp.color) {
              rp.color = p.color;
              const nc = Color3.FromHexString(p.color || '#ffffff');
              (mesh as any).colorableMeshes?.forEach((m: Mesh) => {
                const mat = (m.material as StandardMaterial) || new StandardMaterial(`rm_${m.name}`, m.getScene());
                mat.diffuseColor = nc;
                m.material = mat;
              });
            }
          };
        };

        room.state.players.onAdd = addRemote;
        room.state.players.forEach(addRemote);
        room.state.players.onRemove = (_p: any, key: string) => {
          const rp = remotePlayersRef.current.get(key);
          if (rp) { rp.mesh.dispose(); remotePlayersRef.current.delete(key); }
        };
      } catch (err) {
        console.warn('[network] Colyseus unreachable — single-player mode', err);
        setNetStatus('offline');
      }
    })();

    // Follow Camera
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
        case ' ':
          keysRef.current.space = true;
          if (role === 'seeker') shoot();
          break;
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

    // Seeker: click to shoot paint
    scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === PointerEventTypes.POINTERDOWN && role === 'seeker') {
        shoot();
      }
    });

    // Game loop
    let lastTime = performance.now();
    const observer = scene.onBeforeRenderObservable.add(() => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Network: smoothly interpolate remote players + send our transform
      remotePlayersRef.current.forEach((rp) => {
        rp.mesh.position.x = lerp(rp.mesh.position.x, rp.target.x, 0.2);
        rp.mesh.position.y = lerp(rp.mesh.position.y, rp.target.y, 0.2);
        rp.mesh.position.z = lerp(rp.mesh.position.z, rp.target.z, 0.2);
        rp.mesh.rotation.y = lerp(rp.mesh.rotation.y, rp.target.rotY, 0.2);
      });
      if (playerRef.current && roomRef.current) {
        sendAccum += delta;
        if (sendAccum > 0.05) {
          sendAccum = 0;
          const lp = playerRef.current;
          roomRef.current.send('move', {
            x: lp.position.x, y: lp.position.y, z: lp.position.z,
            rotY: lp.rotation.y, color: playerColorRef.current,
          });
        }
      }

      if (player && phase === 'seek') {
        const forward = player.forward;
        let moveVector = Vector3.Zero();

        if (keysRef.current.w) moveVector = moveVector.add(forward);
        if (keysRef.current.s) moveVector = moveVector.subtract(forward);
        if (keysRef.current.a) player.rotation.y -= 2 * delta;
        if (keysRef.current.d) player.rotation.y += 2 * delta;

        if (moveVector.length() > 0) {
          moveVector.normalize().scaleInPlace(playerSpeed);
          const newPos = player.position.add(moveVector);
          
          // Boundary check for lobby
          newPos.x = Math.max(-LOBBY_WIDTH/2 + 1, Math.min(LOBBY_WIDTH/2 - 1, newPos.x));
          newPos.z = Math.max(-LOBBY_DEPTH/2 + 1, Math.min(LOBBY_DEPTH/2 - 1, newPos.z));
          
          player.position = newPos;
        }

        // Check if player reached stairs to go to classroom
        if (player.position.z < -10 && Math.abs(player.position.x) < 5) {
          // Teleport to classroom
          player.position.set(0, 102, 10);
          setCurrentRoom('classroom');
          currentRoomRef.current = 'classroom';
        }

        // Update paint projectiles (Seeker gameplay)
        const activeProjectiles: Mesh[] = [];
        for (const ball of projectilesRef.current) {
          const vel = (ball as any).velocity as Vector3;
          ball.position.addInPlace(vel.scale(delta));
          (ball as any).life -= delta;
          let hit = false;
          for (const target of targetsRef.current) {
            if (Vector3.Distance(ball.position, target.getAbsolutePosition()) < 1.6) {
              hit = true;
              const tmat = target.material as StandardMaterial;
              if (tmat) tmat.diffuseColor = new Color3(1, 0.2, 0.2);
              setScore(s => s + 100);
              break;
            }
          }
          if ((ball as any).life > 0 && !hit) {
            activeProjectiles.push(ball);
          } else {
            ball.dispose();
          }
        }
        projectilesRef.current = activeProjectiles;
      }
    });

    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());

    return () => {
      networkDisposed = true;
      if (roomRef.current) { roomRef.current.leave(); roomRef.current = null; }
      remotePlayersRef.current.forEach((rp) => rp.mesh.dispose());
      remotePlayersRef.current.clear();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      scene.onBeforeRenderObservable.remove(observer);
      engine.dispose();
    };
  }, [createHotelLobby, createClassroom, createPlayer, phase]);

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

  // Keep a ref of current phase for use inside Babylon callbacks
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // ─── Color Picker ────────────────────────────────────────────────────────────
  const applyColor = (color: string) => {
    setPlayerColor(color);
    if (playerRef.current && (playerRef.current as any).colorableMeshes) {
      const meshes = (playerRef.current as any).colorableMeshes as Mesh[];
      meshes.forEach(mesh => {
        const mat = mesh.material as StandardMaterial;
        if (mat) {
          mat.diffuseColor = Color3.FromHexString(color);
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
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-2">
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-white font-bold text-sm">LIVES</span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < lives ? 'text-red-500' : 'text-gray-600'}>♥</span>
              ))}
            </div>
          </div>
          <div className={`rounded-full px-3 py-1 text-xs font-bold text-white text-center ${netStatus === 'online' ? 'bg-green-600/80' : netStatus === 'offline' ? 'bg-red-600/80' : 'bg-yellow-600/80'}`}>
            {netStatus === 'online' ? '● 联机' : netStatus === 'offline' ? '● 离线' : '● 连接中'}
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
          <span className="text-yellow-400 font-bold text-xl">{score.toLocaleString()}</span>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-white" />
          <span className="text-white font-bold text-lg">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Room indicator */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
        <span className="text-white font-bold">{currentRoom === 'lobby' ? '🏨 Hotel Lobby' : '📚 Classroom'}</span>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end pointer-events-none">
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

        <div className="flex flex-col items-center gap-2 pointer-events-auto">
          {role === 'hider' ? (
            <>
              <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-white text-sm">Match: {matchPercent}%</span>
              </div>
              <button 
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-4 shadow-lg hover:scale-105 transition"
              >
                <Palette className="w-8 h-8 text-white" />
              </button>
            </>
          ) : (
            <>
              <div className="bg-red-600/80 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-white text-sm font-bold">🔫 Shoot the targets!</span>
              </div>
              <button 
                onClick={shoot}
                className="bg-red-600 hover:bg-red-500 rounded-full p-4 shadow-lg hover:scale-105 transition"
              >
                <Zap className="w-8 h-8 text-white" />
              </button>
            </>
          )}
        </div>

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
            {role === 'seeker' ? (
              <>
                <h2 className="text-4xl font-bold text-white mb-4">SEEK!</h2>
                <p className="text-gray-300 mb-2">Find the hidden players</p>
                <p className="text-yellow-400 mb-6">Click / Space to shoot paint at targets!</p>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-white mb-4">HIDE!</h2>
                <p className="text-gray-300 mb-2">Match your color to the environment</p>
                <p className="text-yellow-400 mb-6">Walk to the red stairs to go upstairs!</p>
              </>
            )}
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

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/50 text-sm pointer-events-none text-center">
        {role === 'seeker'
          ? 'WASD to move • Click / Space to SHOOT paint at targets'
          : 'WASD to move • Open palette to camouflage • Walk to red stairs'}
      </div>
    </div>
  );
}
