/**
 * Meccha Chameleon Style Game — PlayCanvas 单机原型
 * 玩法：玩家控制变色龙在房间内移动，按空格取样周围颜色给身体上色，
 *       躲避 AI seeker，被发现则 game over。
 * 技术栈：PlayCanvas 官方 engine.js（CDN）+ 纯 TypeScript
 */

import { useEffect, useRef } from 'react';

export default function GamePlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── 动态加载 PlayCanvas Engine ──────────────────────────────────────────
    const script = document.createElement('script');
    script.src = 'https://code.playcanvas.com/playcanvas-stable.min.js';
    script.onload = () => startGame(canvas);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  function startGame(canvas: HTMLCanvasElement) {
    if (typeof (window as unknown as { pc?: unknown }).pc === 'undefined') return;
    const pc = (window as unknown as { pc: typeof import('playcanvas') }).pc;

    // ── App 初始化 ─────────────────────────────────────────────────────────
    const app = new pc.Application(canvas, {
      mouse: new pc.Mouse(canvas),
      keyboard: new pc.Keyboard(window as unknown as HTMLElement),
    });
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);
    window.addEventListener('resize', () => app.resizeCanvas());

    // ── 场景光照 ───────────────────────────────────────────────────────────
    app.scene.ambientLight = new pc.Color(0.3, 0.3, 0.4);

    const dirLight = new pc.Entity('dir');
    dirLight.addComponent('light', {
      type: 'directional',
      color: new pc.Color(1, 0.95, 0.85),
      intensity: 1.2,
      castShadows: true,
      shadowBias: 0.05,
      shadowDistance: 40,
      shadowResolution: 1024,
    });
    dirLight.setEulerAngles(45, 30, 0);
    app.root.addChild(dirLight);

    // ── 地板（彩色格子） ───────────────────────────────────────────────────
    const floorColors = [
      '#FF6B6B','#FFE66D','#4ECDC4','#95E1D3',
      '#A8E6CF','#F8B500','#6C5CE7','#FD79A8',
      '#74B9FF','#55A3FF','#FF9F43','#EE5A24',
    ];

    const floor = new pc.Entity('floor');
    app.root.addChild(floor);

    const mapSize = 6; // 6×6 格子
    const tileSize = 3;
    for (let row = 0; row < mapSize; row++) {
      for (let col = 0; col < mapSize; col++) {
        const tile = new pc.Entity(`tile_${row}_${col}`);
        tile.addComponent('render', { type: 'box' });
        tile.addComponent('collision', { type: 'box', halfExtents: new pc.Vec3(tileSize / 2, 0.1, tileSize / 2) });
        const colorHex = floorColors[(row * mapSize + col) % floorColors.length];
        const r = parseInt(colorHex.slice(1, 3), 16) / 255;
        const g = parseInt(colorHex.slice(3, 5), 16) / 255;
        const b = parseInt(colorHex.slice(5, 7), 16) / 255;
        tile.render.material = createColorMaterial(app, r, g, b);
        tile.setPosition(
          (col - mapSize / 2 + 0.5) * tileSize,
          0,
          (row - mapSize / 2 + 0.5) * tileSize
        );
        floor.addChild(tile);
      }
    }

    // ── 墙体 ───────────────────────────────────────────────────────────────
    function createWall(x: number, y: number, z: number, w: number, h: number, d: number) {
      const wall = new pc.Entity('wall');
      wall.addComponent('render', { type: 'box' });
      wall.addComponent('collision', { type: 'box', halfExtents: new pc.Vec3(w / 2, h / 2, d / 2) });
      wall.render.material = createColorMaterial(app, 0.5, 0.45, 0.42);
      wall.setLocalPosition(x, y, z);
      app.root.addChild(wall);
      return wall;
    }

    const wallH = 4, wallT = 0.5;
    const halfMap = (mapSize * tileSize) / 2;
    createWall(0, wallH / 2, -halfMap - wallT / 2, mapSize * tileSize + wallT * 2, wallH, wallT); // N
    createWall(0, wallH / 2,  halfMap + wallT / 2, mapSize * tileSize + wallT * 2, wallH, wallT); // S
    createWall(-halfMap - wallT / 2, wallH / 2, 0, wallT, wallH, mapSize * tileSize); // W
    createWall( halfMap + wallT / 2, wallH / 2, 0, wallT, wallH, mapSize * tileSize); // E

    // ── 遮挡物（可藏身的箱子） ─────────────────────────────────────────────
    const obstacles: pc.Entity[] = [];
    const obstaclePositions = [
      [1, 1], [4, 1], [1, 4], [4, 4], [2, 2], [3, 3], [0, 3], [5, 2]
    ];
    for (const [row, col] of obstaclePositions) {
      const box = new pc.Entity('obstacle');
      box.addComponent('render', { type: 'box' });
      box.addComponent('collision', { type: 'box', halfExtents: new pc.Vec3(1, 1, 1) });
      const colorHex = floorColors[Math.floor(Math.random() * floorColors.length)];
      const r = parseInt(colorHex.slice(1, 3), 16) / 255;
      const g = parseInt(colorHex.slice(3, 5), 16) / 255;
      const b = parseInt(colorHex.slice(5, 7), 16) / 255;
      box.render.material = createColorMaterial(app, r, g, b);
      box.setPosition(
        (col - mapSize / 2 + 0.5) * tileSize,
        1,
        (row - mapSize / 2 + 0.5) * tileSize
      );
      app.root.addChild(box);
      obstacles.push(box);
    }

    // ── 玩家（变色龙） ─────────────────────────────────────────────────────
    const player = new pc.Entity('player');
    player.addComponent('render', { type: 'sphere' });
    player.addComponent('collision', { type: 'sphere', radius: 0.8 });
    player.render.material = createColorMaterial(app, 0.2, 0.8, 0.4);
    player.setPosition(0, 0.8, 0);
    app.root.addChild(player);

    // 眼睛
    const eye1 = new pc.Entity('eye1');
    eye1.addComponent('render', { type: 'sphere' });
    eye1.render.material = createColorMaterial(app, 1, 1, 1);
    eye1.setLocalPosition(0.35, 0.4, 0.35);
    player.addChild(eye1);
    const pupil1 = new pc.Entity('pupil1');
    pupil1.addComponent('render', { type: 'sphere' });
    pupil1.render.material = createColorMaterial(app, 0.1, 0.1, 0.1);
    pupil1.setLocalPosition(0.1, 0, 0);
    eye1.addChild(pupil1);

    // ── AI Seeker（红色方块） ───────────────────────────────────────────────
    const seeker = new pc.Entity('seeker');
    seeker.addComponent('render', { type: 'box' });
    seeker.addComponent('collision', { type: 'box', halfExtents: new pc.Vec3(0.8, 0.8, 0.8) });
    seeker.render.material = createColorMaterial(app, 0.9, 0.15, 0.15);
    seeker.setPosition(8, 0.8, -8);
    app.root.addChild(seeker);

    // ── 摄像机（俯视跟随） ─────────────────────────────────────────────────
    const cam = new pc.Entity('camera');
    cam.addComponent('camera', {
      clearColor: new pc.Color(0.05, 0.05, 0.1),
      fov: 55,
    });
    app.root.addChild(cam);

    // ── 游戏状态 ────────────────────────────────────────────────────────────
    let phase: 'ready' | 'play' | 'caught' | 'win' = 'ready';
    let timer = 60;
    let playerSpeed = 7;
    let playerColor = { r: 0.2, g: 0.8, b: 0.4 };
    let seekerPos = new pc.Vec3(8, 0.8, -8);
    let playerPos = new pc.Vec3(0, 0.8, 0);
    let seekerTimer = 0;
    const timerInterval = setInterval(() => {
      if (phase === 'play') {
        timer--;
        updateHUD();
        if (timer <= 0) {
          phase = 'win';
          updateHUD();
        }
      }
    }, 1000);

    // ── HUD ─────────────────────────────────────────────────────────────────
    function updateHUD() {
      const statusEl = document.getElementById('game-status');
      const timerEl = document.getElementById('game-timer');
      const phaseEl = document.getElementById('game-phase');
      if (statusEl) {
        if (phase === 'ready') statusEl.textContent = '🎮 Press SPACE or tap to start!';
        else if (phase === 'play') statusEl.textContent = `⏱ Time: ${timer}s | Color match: ${Math.round(colorMatch() * 100)}%`;
        else if (phase === 'caught') statusEl.textContent = '💀 CAUGHT! Press SPACE to retry';
        else if (phase === 'win') statusEl.textContent = '🏆 SURVIVED! You blended in!';
      }
      if (timerEl) timerEl.textContent = `Time: ${timer}s`;
      if (phaseEl) {
        if (phase === 'ready') phaseEl.textContent = '⏳ READY';
        else if (phase === 'play') phaseEl.textContent = '🏃 HIDE & PAINT';
        else if (phase === 'caught') phaseEl.textContent = '❌ CAUGHT';
        else if (phase === 'win') phaseEl.textContent = '✅ WIN';
      }
    }

    function colorMatch(): number {
      const px = Math.round((playerPos.x + (mapSize * tileSize) / 2) / tileSize);
      const pz = Math.round((playerPos.z + (mapSize * tileSize) / 2) / tileSize);
      const idx = Math.max(0, Math.min(mapSize - 1, pz)) * mapSize + Math.max(0, Math.min(mapSize - 1, px));
      const floorColorHex = floorColors[idx % floorColors.length];
      const fr = parseInt(floorColorHex.slice(1, 3), 16) / 255;
      const fg = parseInt(floorColorHex.slice(3, 5), 16) / 255;
      const fb = parseInt(floorColorHex.slice(5, 7), 16) / 255;
      const dr = Math.abs(playerColor.r - fr);
      const dg = Math.abs(playerColor.g - fg);
      const db = Math.abs(playerColor.b - fb);
      return Math.max(0, 1 - (dr + dg + db) / 3);
    }

    function sampleColor() {
      // 取样脚下格子的颜色并给玩家上色
      const px = Math.round((playerPos.x + (mapSize * tileSize) / 2) / tileSize);
      const pz = Math.round((playerPos.z + (mapSize * tileSize) / 2) / tileSize);
      const idx = Math.max(0, Math.min(mapSize - 1, pz)) * mapSize + Math.max(0, Math.min(mapSize - 1, px));
      const colorHex = floorColors[idx % floorColors.length];
      playerColor.r = parseInt(colorHex.slice(1, 3), 16) / 255;
      playerColor.g = parseInt(colorHex.slice(3, 5), 16) / 255;
      playerColor.b = parseInt(colorHex.slice(5, 7), 16) / 255;
      player.render.material = createColorMaterial(app, playerColor.r, playerColor.g, playerColor.b);
      // 特效：缩放弹跳
      player.setLocalScale(1.3, 1.3, 1.3);
      setTimeout(() => player.setLocalScale(1, 1, 1), 200);
    }

    function resetGame() {
      phase = 'ready';
      timer = 60;
      playerPos.set(0, 0.8, 0);
      player.setPosition(playerPos.x, playerPos.y, playerPos.z);
      playerColor = { r: 0.2, g: 0.8, b: 0.4 };
      player.render.material = createColorMaterial(app, 0.2, 0.8, 0.4);
      seekerPos.set(8, 0.8, -8);
      seeker.setPosition(seekerPos.x, seekerPos.y, seekerPos.z);
      updateHUD();
    }

    // 空格/点击开始
    app.keyboard.on(pc.EVENT_KEYDOWN, (e: { key: number }) => {
      if (e.key === pc.KEY_SPACE) {
        if (phase === 'ready') { phase = 'play'; updateHUD(); }
        else if (phase === 'caught' || phase === 'win') resetGame();
        else if (phase === 'play') sampleColor();
      }
    });
    canvas.addEventListener('pointerdown', () => {
      if (phase === 'ready') { phase = 'play'; updateHUD(); }
      else if (phase === 'caught' || phase === 'win') resetGame();
      else if (phase === 'play') sampleColor();
    });

    // ── 辅助函数 ─────────────────────────────────────────────────────────────
    function createColorMaterial(app: pc.Application, r: number, g: number, b: number): pc.StandardMaterial {
      const mat = new pc.StandardMaterial();
      mat.diffuse = new pc.Color(r, g, b);
      mat.update();
      return mat;
    }

    // ── 移动辅助（带碰撞） ───────────────────────────────────────────────────
    function tryMove(entity: pc.Entity, dx: number, dz: number, speed: number): void {
      const half = (mapSize * tileSize) / 2 - 1.5;
      const nx = Math.max(-half, Math.min(half, entity.getPosition().x + dx * speed));
      const nz = Math.max(-half, Math.min(half, entity.getPosition().z + dz * speed));
      // 障碍物碰撞
      for (const obs of obstacles) {
        const op = obs.getPosition();
        if (Math.abs(nx - op.x) < 1.8 && Math.abs(nz - op.z) < 1.8) return;
      }
      entity.setPosition(nx, 0.8, nz);
    }

    // ── 主循环 ───────────────────────────────────────────────────────────────
    let lastX = 0, lastZ = 0;
    app.on('update', (dt: number) => {
      // 摄像机跟随
      const lp = player.getPosition();
      cam.setPosition(lp.x + 0, 22, lp.z + 12);
      cam.lookAt(new pc.Vec3(lp.x, 0, lp.z));

      if (phase !== 'play') return;

      // 玩家移动
      const speed = playerSpeed * dt;
      const kb = app.keyboard;
      if (kb.isPressed(pc.KEY_W) || kb.isPressed(pc.KEY_UP))    tryMove(player, 0, -1, speed);
      if (kb.isPressed(pc.KEY_S) || kb.isPressed(pc.KEY_DOWN))  tryMove(player, 0,  1, speed);
      if (kb.isPressed(pc.KEY_A) || kb.isPressed(pc.KEY_LEFT))  tryMove(player,-1,  0, speed);
      if (kb.isPressed(pc.KEY_D) || kb.isPressed(pc.KEY_RIGHT)) tryMove(player, 1,  0, speed);

      playerPos.copy(player.getPosition());

      // 玩家旋转（面向移动方向）
      if (lastX !== playerPos.x || lastZ !== playerPos.z) {
        const angle = Math.atan2(playerPos.x - lastX, playerPos.z - lastZ) * 180 / Math.PI;
        player.setEulerAngles(0, angle, 0);
        lastX = playerPos.x; lastZ = playerPos.z;
      }

      // Seeker AI：朝玩家移动
      seekerTimer += dt;
      if (seekerTimer > 0.5) {
        seekerTimer = 0;
        const sp = seeker.getPosition();
        const dx = playerPos.x - sp.x;
        const dz = playerPos.z - sp.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist > 1.2) {
          const seekSpeed = 3.5 * dt;
          seekerPos.x += (dx / dist) * seekSpeed;
          seekerPos.z += (dz / dist) * seekSpeed;
          seeker.setPosition(seekerPos.x, 0.8, seekerPos.z);
          // seeker 颜色随接近程度变深
          const intensity = Math.min(1, dist / 15);
          seeker.render.material = createColorMaterial(app, 0.9, 0.15 * (1 - intensity * 0.7), 0.15 * (1 - intensity * 0.7));
        }

        // 碰撞检测：发现玩家
        if (dist < 2.0) {
          phase = 'caught';
          updateHUD();
        }
      }

      // HUD 更新
      updateHUD();
    });

    app.start();
    updateHUD();
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#0a0a1a]">
      {/* HUD Overlay */}
      <div className="absolute left-0 top-0 z-10 flex flex-col gap-1 p-3">
        <div id="game-phase" className="rounded bg-black/60 px-2 py-1 text-xs font-bold text-white">⏳ READY</div>
        <div id="game-timer"  className="rounded bg-black/60 px-2 py-1 text-xs font-bold text-white">Time: 60s</div>
      </div>
      <div id="game-status" className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-black/70 px-4 py-2 text-center text-sm font-semibold text-white">
        🎮 Press SPACE or tap to start!
      </div>

      {/* Controls hint */}
      <div className="absolute right-3 top-1/2 z-10 -translate-y-1/2 space-y-1 text-right">
        {['WASD / Arrows — Move', 'SPACE — Sample color + start/retry', 'Tap — Same as SPACE'].map(t => (
          <div key={t} className="rounded bg-black/50 px-2 py-0.5 text-[10px] text-white/70">{t}</div>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ display: 'block' }}
      />
    </div>
  );
}
