'use client';

import { useEffect, useRef } from 'react';
import {
  Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight,
  MeshBuilder, StandardMaterial, Color3, Color4,
  Animation, PointerEventTypes, ActionManager,
  Mesh, PBRMaterial, GlowLayer, ShadowGenerator,
} from '@babylonjs/core';
import { AdvancedDynamicTexture, TextBlock, Rectangle, Control } from '@babylonjs/gui';

// ─── Game State ───────────────────────────────────────────────────────────────
type GamePhase = 'intro' | 'lobby' | 'prep' | 'seek' | 'result' | 'gameover';

interface GameState {
  phase: GamePhase;
  timer: number;
  playerColor: Color3;
  isEyedropper: boolean;
  wins: number;
  round: number;
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const ROOM_SIZE = 40;
const WALL_HEIGHT = 12;

// ─── Main Component ────────────────────────────────────────────────────────────

export default function BabylonGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Game state
    const state: GameState = {
      phase: 'prep',
      timer: 25,
      playerColor: new Color3(1, 1, 1),
      isEyedropper: false,
      wins: 0,
      round: 1,
    };

    // Initialize Engine
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

    // Create Scene
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.05, 0.05, 0.1, 1);
    scene.shadowsEnabled = true;

    // ─── Camera ───────────────────────────────────────────────────────────────
    const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 3, 35, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 20;
    camera.upperRadiusLimit = 60;
    camera.upperBetaLimit = Math.PI / 2.2;

    // ─── Lighting ─────────────────────────────────────────────────────────────
    const hemiLight = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.6;
    hemiLight.groundColor = new Color3(0.2, 0.2, 0.3);

    const dirLight = new DirectionalLight('dir', new Vector3(-1, -2, -1), scene);
    dirLight.position = new Vector3(20, 40, 20);
    dirLight.intensity = 0.8;
    
    const shadowGen = new ShadowGenerator(1024, dirLight);
    shadowGen.useBlurExponentialShadowMap = true;
    shadowGen.blurKernel = 32;

    // ─── Environment / Room ───────────────────────────────────────────────────
    createRoom(scene, shadowGen);

    // ─── Player (White Chameleon Character) ───────────────────────────────────
    const player = createPlayer(scene, shadowGen);
    player.position = new Vector3(0, 2, 0);

    // ─── AI Seeker (Red Oni) ──────────────────────────────────────────────────
    const seeker = createSeeker(scene, shadowGen);
    seeker.position = new Vector3(15, 2, -15);

    // ─── GUI ──────────────────────────────────────────────────────────────────
    const gui = AdvancedDynamicTexture.CreateFullscreenUI('UI');
    
    // Top bar
    const topBar = new Rectangle('topBar');
    topBar.width = '100%';
    topBar.height = '60px';
    topBar.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    topBar.background = 'rgba(0,0,0,0.5)';
    topBar.thickness = 0;
    gui.addControl(topBar);

    // Phase text
    const phaseText = new TextBlock('phaseText');
    phaseText.text = '⏱ PREP — HIDE & PAINT!';
    phaseText.color = '#4ade80';
    phaseText.fontSize = 20;
    phaseText.fontWeight = 'bold';
    phaseText.left = '-100px';
    topBar.addControl(phaseText);

    // Timer
    const timerText = new TextBlock('timerText');
    timerText.text = '25s';
    timerText.color = 'white';
    timerText.fontSize = 28;
    timerText.fontWeight = 'bold';
    timerText.left = '100px';
    topBar.addControl(timerText);

    // Color indicator
    const colorBox = new Rectangle('colorBox');
    colorBox.width = '40px';
    colorBox.height = '40px';
    colorBox.background = 'white';
    colorBox.left = '-150px';
    colorBox.top = '80px';
    colorBox.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    colorBox.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    colorBox.cornerRadius = 5;
    colorBox.thickness = 2;
    colorBox.color = 'white';
    gui.addControl(colorBox);

    // Controls hint
    const hintText = new TextBlock('hintText');
    hintText.text = 'WASD = Move | E = Eyedropper | Click = Sample Color';
    hintText.color = 'rgba(255,255,255,0.6)';
    hintText.fontSize = 14;
    hintText.bottom = '20px';
    hintText.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    gui.addControl(hintText);

    // ─── Input Handling ───────────────────────────────────────────────────────
    const inputMap: { [key: string]: boolean } = {};
    scene.actionManager = new ActionManager(scene);

    const keyDown = (e: KeyboardEvent) => {
      inputMap[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'e') {
        state.isEyedropper = !state.isEyedropper;
        hintText.text = state.isEyedropper 
          ? 'EYEDROPPER ACTIVE — Click any surface to sample color' 
          : 'WASD = Move | E = Eyedropper | Click = Sample Color';
      }
    };

    const keyUp = (e: KeyboardEvent) => {
      inputMap[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    // Click to sample color
    scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === PointerEventTypes.POINTERDOWN && state.isEyedropper) {
        const pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult.hit && pickResult.pickedMesh) {
          const mat = pickResult.pickedMesh.material as PBRMaterial;
          if (mat && mat.albedoColor) {
            state.playerColor = mat.albedoColor.clone();
            // Update player material
            const playerMat = player.material as PBRMaterial;
            if (playerMat) {
              playerMat.albedoColor = state.playerColor;
            }
            // Update color indicator
            const r = Math.round(state.playerColor.r * 255);
            const g = Math.round(state.playerColor.g * 255);
            const b = Math.round(state.playerColor.b * 255);
            colorBox.background = `rgb(${r},${g},${b})`;
            state.isEyedropper = false;
            hintText.text = 'WASD = Move | E = Eyedropper | Click = Sample Color';
          }
        }
      }
    });

    // Movement in render loop
    scene.registerBeforeRender(() => {
      if (state.phase !== 'prep') return;

      const speed = 8 * (scene.getEngine().getDeltaTime() / 1000);
      let moved = false;

      if (inputMap['w'] || inputMap['arrowup']) {
        player.position.z += speed;
        moved = true;
      }
      if (inputMap['s'] || inputMap['arrowdown']) {
        player.position.z -= speed;
        moved = true;
      }
      if (inputMap['a'] || inputMap['arrowleft']) {
        player.position.x -= speed;
        moved = true;
      }
      if (inputMap['d'] || inputMap['arrowright']) {
        player.position.x += speed;
        moved = true;
      }

      // Clamp to room bounds
      player.position.x = Math.max(-18, Math.min(18, player.position.x));
      player.position.z = Math.max(-18, Math.min(18, player.position.z));

      // Bobbing animation when moving
      if (moved) {
        player.position.y = 2 + Math.sin(performance.now() / 200) * 0.1;
      }
    });

    // ─── Game Loop ────────────────────────────────────────────────────────────
    let lastTime = performance.now();

    scene.registerBeforeRender(() => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Timer countdown
      if (state.phase === 'prep' || state.phase === 'seek') {
        state.timer -= dt;
        timerText.text = `${Math.ceil(state.timer)}s`;
        timerText.color = state.timer <= 5 ? '#FF4444' : 'white';

        if (state.timer <= 0) {
          if (state.phase === 'prep') {
            state.phase = 'seek';
            state.timer = 45;
            phaseText.text = '🔴 SEEKING — STAY HIDDEN!';
            phaseText.color = '#ef4444';
          } else {
            state.phase = 'result';
            state.wins++;
            phaseText.text = '🎉 SURVIVED!';
            phaseText.color = '#4ade80';
          }
        }
      }

      // Seeker AI during seek phase
      if (state.phase === 'seek') {
        const dx = player.position.x - seeker.position.x;
        const dz = player.position.z - seeker.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > 2) {
          seeker.position.x += (dx / dist) * 5 * dt;
          seeker.position.z += (dz / dist) * 5 * dt;
        }

        // Check catch
        if (dist < 3) {
          state.phase = 'gameover';
          phaseText.text = '💀 CAUGHT!';
          phaseText.color = '#ef4444';
        }

        // Camera follow seeker
        camera.target = seeker.position;
      } else {
        // Camera follow player
        camera.target = player.position;
      }
    });

    // ─── Render Loop ──────────────────────────────────────────────────────────
    engine.runRenderLoop(() => scene.render());

    // ─── Resize Handler ───────────────────────────────────────────────────────
    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      engine.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ outline: 'none', display: 'block' }}
    />
  );
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

function createRoom(scene: Scene, shadowGen: ShadowGenerator) {
  // Floor
  const floor = MeshBuilder.CreateGround('floor', { width: ROOM_SIZE, height: ROOM_SIZE }, scene);
  const floorMat = new PBRMaterial('floorMat', scene);
  floorMat.albedoColor = new Color3(0.9, 0.85, 0.8);
  floorMat.roughness = 0.8;
  floor.material = floorMat;
  floor.receiveShadows = true;

  // Create three zones with different colors
  const zones = [
    { x: -ROOM_SIZE/3, z: 0, color: new Color3(0.96, 0.78, 0.67), name: 'peach' },
    { x: 0, z: 0, color: new Color3(0.52, 0.7, 0.83), name: 'blue' },
    { x: ROOM_SIZE/3, z: 0, color: new Color3(0.58, 0.78, 0.58), name: 'green' },
  ];

  zones.forEach((zone, i) => {
    const zoneFloor = MeshBuilder.CreateGround(`zone${i}`, { width: ROOM_SIZE/3 - 0.5, height: ROOM_SIZE - 1 }, scene);
    zoneFloor.position.x = zone.x;
    const zoneMat = new PBRMaterial(`zoneMat${i}`, scene);
    zoneMat.albedoColor = zone.color;
    zoneMat.roughness = 0.9;
    zoneFloor.material = zoneMat;
    zoneFloor.receiveShadows = true;
  });

  // Walls
  const wallMat = new PBRMaterial('wallMat', scene);
  wallMat.albedoColor = new Color3(0.7, 0.5, 0.4);
  wallMat.roughness = 0.9;

  const backWall = MeshBuilder.CreateBox('backWall', { width: ROOM_SIZE, height: WALL_HEIGHT, depth: 1 }, scene);
  backWall.position.z = -ROOM_SIZE/2;
  backWall.position.y = WALL_HEIGHT/2;
  backWall.material = wallMat;
  backWall.receiveShadows = true;
  shadowGen.addShadowCaster(backWall);

  const leftWall = MeshBuilder.CreateBox('leftWall', { width: 1, height: WALL_HEIGHT, depth: ROOM_SIZE }, scene);
  leftWall.position.x = -ROOM_SIZE/2;
  leftWall.position.y = WALL_HEIGHT/2;
  leftWall.material = wallMat;
  leftWall.receiveShadows = true;
  shadowGen.addShadowCaster(leftWall);

  const rightWall = MeshBuilder.CreateBox('rightWall', { width: 1, height: WALL_HEIGHT, depth: ROOM_SIZE }, scene);
  rightWall.position.x = ROOM_SIZE/2;
  rightWall.position.y = WALL_HEIGHT/2;
  rightWall.material = wallMat;
  rightWall.receiveShadows = true;
  shadowGen.addShadowCaster(rightWall);

  createProps(scene, shadowGen);
}

function createProps(scene: Scene, shadowGen: ShadowGenerator) {
  const props = [
    { type: 'couch', x: -10, z: -5, color: new Color3(0.75, 0.22, 0.17) },
    { type: 'bookshelf', x: -12, z: 5, color: new Color3(0.43, 0.3, 0.12) },
    { type: 'plant', x: -8, z: -10, color: new Color3(0.15, 0.68, 0.38) },
    { type: 'rug', x: -10, z: 8, color: new Color3(0.56, 0.27, 0.68) },
    { type: 'couch', x: 0, z: -8, color: new Color3(0.14, 0.42, 0.64) },
    { type: 'bookshelf', x: 5, z: -5, color: new Color3(0.17, 0.24, 0.31) },
    { type: 'table', x: -3, z: 5, color: new Color3(0.58, 0.32, 0.09) },
    { type: 'plant', x: 8, z: 8, color: new Color3(0.12, 0.52, 0.4) },
    { type: 'couch', x: 12, z: -5, color: new Color3(0.08, 0.33, 0.53) },
    { type: 'bathtub', x: 10, z: 5, color: new Color3(0.99, 0.99, 0.99) },
    { type: 'plant', x: 13, z: -10, color: new Color3(0.07, 0.48, 0.4) },
  ];

  props.forEach((prop, i) => {
    let mesh: Mesh;
    const mat = new PBRMaterial(`propMat${i}`, scene);
    mat.albedoColor = prop.color;
    mat.roughness = 0.7;

    switch (prop.type) {
      case 'couch':
        mesh = MeshBuilder.CreateBox(`couch${i}`, { width: 4, height: 1.5, depth: 2 }, scene);
        mesh.position.y = 0.75;
        const backrest = MeshBuilder.CreateBox(`back${i}`, { width: 4, height: 1.5, depth: 0.5 }, scene);
        backrest.position = new Vector3(0, 1.5, -0.75);
        backrest.parent = mesh;
        backrest.material = mat;
        break;
      case 'bookshelf':
        mesh = MeshBuilder.CreateBox(`shelf${i}`, { width: 2, height: 4, depth: 1 }, scene);
        mesh.position.y = 2;
        break;
      case 'plant':
        mesh = MeshBuilder.CreateCylinder(`pot${i}`, { diameter: 1.5, height: 1.5 }, scene);
        mesh.position.y = 0.75;
        for (let j = 0; j < 5; j++) {
          const leaf = MeshBuilder.CreateSphere(`leaf${i}_${j}`, { diameter: 1 }, scene);
          const angle = (j / 5) * Math.PI * 2;
          leaf.position = new Vector3(Math.cos(angle) * 0.8, 2 + Math.random() * 0.5, Math.sin(angle) * 0.8);
          leaf.parent = mesh;
          const leafMat = new PBRMaterial(`leafMat${i}_${j}`, scene);
          leafMat.albedoColor = new Color3(0.15 + Math.random() * 0.1, 0.6 + Math.random() * 0.2, 0.2);
          leaf.material = leafMat;
        }
        break;
      case 'rug':
        mesh = MeshBuilder.CreateGround(`rug${i}`, { width: 3, height: 4 }, scene);
        mesh.position.y = 0.02;
        break;
      case 'table':
        mesh = MeshBuilder.CreateBox(`table${i}`, { width: 3, height: 2, depth: 2 }, scene);
        mesh.position.y = 1;
        break;
      case 'bathtub':
        mesh = MeshBuilder.CreateBox(`tub${i}`, { width: 3, height: 1.5, depth: 5 }, scene);
        mesh.position.y = 0.75;
        break;
      default:
        mesh = MeshBuilder.CreateBox(`prop${i}`, { size: 2 }, scene);
        mesh.position.y = 1;
    }

    mesh.position.x = prop.x;
    mesh.position.z = prop.z;
    mesh.material = mat;
    mesh.receiveShadows = true;
    shadowGen.addShadowCaster(mesh);
  });
}

function createPlayer(scene: Scene, shadowGen: ShadowGenerator): Mesh {
  const body = MeshBuilder.CreateCylinder('playerBody', { height: 3, diameter: 1.2 }, scene);
  body.position.y = 2;

  const topSphere = MeshBuilder.CreateSphere('playerTop', { diameter: 1.2 }, scene);
  topSphere.position.y = 1.5;
  topSphere.parent = body;

  const bottomSphere = MeshBuilder.CreateSphere('playerBottom', { diameter: 1.2 }, scene);
  bottomSphere.position.y = -1.5;
  bottomSphere.parent = body;

  const head = MeshBuilder.CreateSphere('playerHead', { diameter: 1.4 }, scene);
  head.position.y = 2.2;
  head.parent = body;

  const leftEye = MeshBuilder.CreateSphere('leftEye', { diameter: 0.4 }, scene);
  leftEye.position = new Vector3(-0.3, 2.3, 0.6);
  leftEye.parent = body;
  const eyeMat = new StandardMaterial('eyeMat', scene);
  eyeMat.diffuseColor = new Color3(1, 1, 1);
  leftEye.material = eyeMat;

  const rightEye = MeshBuilder.CreateSphere('rightEye', { diameter: 0.4 }, scene);
  rightEye.position = new Vector3(0.3, 2.3, 0.6);
  rightEye.parent = body;
  rightEye.material = eyeMat;

  const leftPupil = MeshBuilder.CreateSphere('leftPupil', { diameter: 0.2 }, scene);
  leftPupil.position = new Vector3(-0.3, 2.3, 0.8);
  leftPupil.parent = body;
  const pupilMat = new StandardMaterial('pupilMat', scene);
  pupilMat.diffuseColor = new Color3(0, 0, 0);
  leftPupil.material = pupilMat;

  const rightPupil = MeshBuilder.CreateSphere('rightPupil', { diameter: 0.2 }, scene);
  rightPupil.position = new Vector3(0.3, 2.3, 0.8);
  rightPupil.parent = body;
  rightPupil.material = pupilMat;

  const bodyMat = new PBRMaterial('playerMat', scene);
  bodyMat.albedoColor = new Color3(1, 1, 1);
  bodyMat.roughness = 0.4;
  bodyMat.metallic = 0;
  body.material = bodyMat;
  topSphere.material = bodyMat;
  bottomSphere.material = bodyMat;
  head.material = bodyMat;

  shadowGen.addShadowCaster(body);
  shadowGen.addShadowCaster(head);

  return body;
}

function createSeeker(scene: Scene, shadowGen: ShadowGenerator): Mesh {
  const body = MeshBuilder.CreateSphere('seekerBody', { diameter: 2.5 }, scene);
  body.position.y = 2;

  const head = MeshBuilder.CreateSphere('seekerHead', { diameter: 2 }, scene);
  head.position.y = 2.5;
  head.parent = body;

  const leftHorn = MeshBuilder.CreateCylinder('leftHorn', { diameterTop: 0, diameterBottom: 0.4, height: 1.5 }, scene);
  leftHorn.position = new Vector3(-0.6, 3, 0);
  leftHorn.rotation.z = -0.3;
  leftHorn.parent = body;

  const rightHorn = MeshBuilder.CreateCylinder('rightHorn', { diameterTop: 0, diameterBottom: 0.4, height: 1.5 }, scene);
  rightHorn.position = new Vector3(0.6, 3, 0);
  rightHorn.rotation.z = 0.3;
  rightHorn.parent = body;

  const leftEye = MeshBuilder.CreateSphere('seekerLeftEye', { diameter: 0.5 }, scene);
  leftEye.position = new Vector3(-0.4, 2.8, 0.9);
  leftEye.parent = body;
  const eyeMat = new StandardMaterial('seekerEyeMat', scene);
  eyeMat.emissiveColor = new Color3(1, 0.9, 0);
  leftEye.material = eyeMat;

  const rightEye = MeshBuilder.CreateSphere('seekerRightEye', { diameter: 0.5 }, scene);
  rightEye.position = new Vector3(0.4, 2.8, 0.9);
  rightEye.parent = body;
  rightEye.material = eyeMat;

  const bodyMat = new PBRMaterial('seekerMat', scene);
  bodyMat.albedoColor = new Color3(0.7, 0.15, 0.1);
  bodyMat.roughness = 0.5;
  bodyMat.metallic = 0.1;
  body.material = bodyMat;
  head.material = bodyMat;
  leftHorn.material = bodyMat;
  rightHorn.material = bodyMat;

  const gl = new GlowLayer('glow', scene);
  gl.intensity = 0.6;

  shadowGen.addShadowCaster(body);
  shadowGen.addShadowCaster(head);

  return body;
}
