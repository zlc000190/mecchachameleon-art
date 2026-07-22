'use client';

import { useEffect, useRef } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────
const W = 1008, H = 648;   // canvas logical resolution
const TILE = 36;
const MAP_COLS = 28, MAP_ROWS = 18;

const PREP_TIME = 25;
const SEEK_TIME = 45;

// ── Map ───────────────────────────────────────────────────────────────────────
// 0=floor, 1=N-wall, 2=S-wall, 3=W-wall, 4=E-wall, 5=NW, 6=NE, 7=SW, 8=SE
const MAP: number[][] = [
  [5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [7,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,8],
];

// Zone color palettes
const ZONES = [
  { x0: 1, x1: 9,  wall: '#D4A574', floor: '#F5DEB3', name: 'Peach' },
  { x0: 9, x1: 19, wall: '#7FB3D3', floor: '#D6EAF8', name: 'Blue' },
  { x0: 19, x1: 27, wall: '#82C782', floor: '#D5F5E3', name: 'Green' },
];

function getZone(tx: number) {
  for (const z of ZONES) if (tx >= z.x0 && tx < z.x1) return z;
  return ZONES[0];
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Prop {
  x: number; y: number; w: number; h: number;
  color: string; topColor: string; accent: string;
  kind: 'couch' | 'plant' | 'bookshelf' | 'lamp' | 'rug' | 'table' | 'bathtub' | 'shelf';
}

const PROPS: Prop[] = [
  // Left — Peach zone
  { x:2, y:2, w:3, h:1, color:'#C0392B', topColor:'#E74C3C', accent:'#922B21', kind:'couch' },
  { x:2, y:5, w:1, h:3, color:'#6E4C1E', topColor:'#8B5E3C', accent:'#5D3A1A', kind:'bookshelf' },
  { x:6, y:2, w:1, h:1, color:'#27AE60', topColor:'#2ECC71', accent:'#1E8449', kind:'plant' },
  { x:7, y:7, w:2, h:1, color:'#8E44AD', topColor:'#9B59B6', accent:'#6C3483', kind:'rug' },
  { x:2, y:10, w:1, h:1, color:'#F39C12', topColor:'#F1C40F', accent:'#D68910', kind:'lamp' },
  { x:5, y:12, w:2, h:1, color:'#935116', topColor:'#A04000', accent:'#6E2C00', kind:'table' },
  // Center — Blue zone
  { x:11, y:3, w:3, h:1, color:'#2471A3', topColor:'#3498DB', accent:'#1A5276', kind:'couch' },
  { x:15, y:2, w:1, h:3, color:'#2C3E50', topColor:'#34495E', accent:'#1C2833', kind:'bookshelf' },
  { x:10, y:7, w:2, h:1, color:'#CA6F1E', topColor:'#E67E22', accent:'#A04000', kind:'rug' },
  { x:14, y:10, w:1, h:1, color:'#1E8449', topColor:'#27AE60', accent:'#145A32', kind:'plant' },
  { x:11, y:13, w:2, h:1, color:'#7B241C', topColor:'#922B21', accent:'#641E16', kind:'table' },
  { x:17, y:6, w:1, h:2, color:'#D4AC0D', topColor:'#F1C40F', accent:'#9A7D0A', kind:'shelf' },
  // Right — Green zone
  { x:21, y:3, w:3, h:1, color:'#154360', topColor:'#2471A3', accent:'#1A5276', kind:'couch' },
  { x:22, y:7, w:1, h:2, color:'#FDFEFE', topColor:'#FFFFFF', accent:'#D5DBDB', kind:'bathtub' },
  { x:19, y:11, w:1, h:1, color:'#117A65', topColor:'#148F77', accent:'#0E6655', kind:'plant' },
  { x:24, y:6, w:1, h:3, color:'#4A235A', topColor:'#7D3C98', accent:'#6C3483', kind:'bookshelf' },
  { x:20, y:14, w:2, h:1, color:'#1A5276', topColor:'#2980B9', accent:'#154360', kind:'rug' },
  { x:25, y:10, w:1, h:1, color:'#AED6F1', topColor:'#D6EAF8', accent:'#85C1E9', kind:'shelf' },
];

function px(col: number) { return col * TILE; }
function py(row: number) { return row * TILE; }
function propPx(p: Prop) { return p.x * TILE; }
function propPy(p: Prop) { return p.y * TILE; }

// ── Color Utils ───────────────────────────────────────────────────────────────
function hexRgb(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n>>16)&255, (n>>8)&255, n&255];
}
function colorDist(a: string, b: string): number {
  const [r,g,b1]=hexRgb(a), [r2,g2,b3]=hexRgb(b);
  return Math.sqrt((r-r2)**2+(g-g2)**2+(b1-b3)**2)/441;
}
function brighten(h: string, n: number): string {
  const [r,g,b]=hexRgb(h);
  const c = (v: number) => Math.min(255,Math.max(0,v+n));
  return `rgb(${c(r)},${c(g)},${c(b)})`;
}
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);
  ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r);
  ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h);
  ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.lineTo(x,y+r);
  ctx.arcTo(x,y,x+r,y,r);
  ctx.closePath();
}

// ── Drawing ───────────────────────────────────────────────────────────────────

function drawRoom(ctx: CanvasRenderingContext2D) {
  for (let row = 0; row < MAP_ROWS; row++) {
    for (let col = 0; col < MAP_COLS; col++) {
      const cell = MAP[row][col];
      const zone = getZone(col);
      const x = col*TILE, y = row*TILE;
      const light = (col+row)%2===0;

      if (cell === 0) {
        // Floor tile
        ctx.fillStyle = light ? zone.floor : brighten(zone.floor,-10);
        ctx.fillRect(x,y,TILE,TILE);
        ctx.strokeStyle = brighten(zone.floor,-18);
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x+0.5,y+0.5,TILE-1,TILE-1);
      } else {
        // Wall
        ctx.fillStyle = zone.wall;
        ctx.fillRect(x,y,TILE,TILE);
        // Brick pattern
        ctx.strokeStyle = brighten(zone.wall,-15);
        ctx.lineWidth = 0.4;
        if (cell===1) {
          ctx.fillStyle = brighten(zone.wall,-25);
          ctx.fillRect(x,y+TILE-5,TILE,5);
        } else if (cell===2) {
          ctx.fillStyle = brighten(zone.wall,-25);
          ctx.fillRect(x,y,5,TILE);
        } else if (cell===3) {
          ctx.fillStyle = brighten(zone.wall,-25);
          ctx.fillRect(x+TILE-5,y,5,TILE);
        }
      }
    }
  }
}

function drawProp(ctx: CanvasRenderingContext2D, p: Prop, t: number) {
  const x = propPx(p), y = propPy(p), w = p.w*TILE, h = p.h*TILE;
  const cx = x+w/2, cy = y+h/2;

  switch (p.kind) {
    case 'couch': {
      ctx.fillStyle = p.accent;
      roundRect(ctx, x+4, y, w-8, h*0.35, 4); ctx.fill();
      ctx.fillStyle = p.color;
      roundRect(ctx, x, y+h*0.2, w, h*0.65, 6); ctx.fill();
      ctx.strokeStyle = p.accent; ctx.lineWidth=1.5;
      ctx.beginPath();
      const mid = x+w*0.33;
      ctx.moveTo(mid, y+h*0.2); ctx.lineTo(mid, y+h*0.85);
      ctx.moveTo(mid+w*0.33/0.33, y+h*0.2); ctx.lineTo(mid+w*0.33/0.33, y+h*0.85);
      ctx.stroke();
      break;
    }
    case 'bookshelf': {
      ctx.fillStyle = p.color; ctx.fillRect(x,y,w,h);
      ctx.fillStyle = p.accent;
      const shelves = 3;
      for (let s=1;s<=shelves;s++) ctx.fillRect(x, y+s*h/(shelves+1)-1, w, 3);
      const bc=['#C0392B','#2471A3','#1E8449','#F39C12','#8E44AD','#17A589'];
      for (let s=0;s<shelves;s++) {
        const sy=y+s*h/(shelves+1)+3, bh=h/(shelves+1)-5;
        let bx=x+4;
        for (let b=0;b<4;b++) {
          ctx.fillStyle=bc[(s*4+b)%bc.length];
          ctx.fillRect(bx, sy, (w-8)/4-2, bh);
          bx+=(w-8)/4;
        }
      }
      break;
    }
    case 'plant': {
      // Pot
      ctx.fillStyle='#8D6E63';
      ctx.beginPath();
      ctx.moveTo(x+w*0.25,y+h*0.4);
      ctx.lineTo(x+w*0.75,y+h*0.4);
      ctx.lineTo(x+w*0.65,y+h);
      ctx.lineTo(x+w*0.35,y+h);
      ctx.closePath(); ctx.fill();
      // Leaves
      for (let i=0;i<5;i++) {
        const a=(i/5)*Math.PI*2+Math.sin(t*1.2+i)*0.08;
        const lx=cx+Math.cos(a)*w*0.38, ly=y+h*0.3+Math.sin(a)*h*0.35;
        ctx.fillStyle=i%2===0?p.color:p.accent;
        ctx.beginPath();
        ctx.ellipse(lx,ly,w*0.2,h*0.28,a,0,Math.PI*2); ctx.fill();
      }
      break;
    }
    case 'lamp': {
      ctx.fillStyle='#666'; ctx.fillRect(cx-2,y+h*0.3,4,h*0.7);
      ctx.fillStyle=p.color;
      ctx.beginPath();
      ctx.moveTo(cx-w*0.4,y+h*0.3);
      ctx.lineTo(cx+w*0.4,y+h*0.3);
      ctx.lineTo(cx+w*0.25,y); ctx.lineTo(cx-w*0.25,y);
      ctx.closePath(); ctx.fill();
      const grd=ctx.createRadialGradient(cx,y+h*0.15,0,cx,y+h*0.15,w*0.6);
      grd.addColorStop(0,'rgba(255,240,160,0.35)'); grd.addColorStop(1,'rgba(255,240,160,0)');
      ctx.fillStyle=grd;
      ctx.beginPath(); ctx.ellipse(cx,y+h*0.15,w*0.6,h*0.5,0,0,Math.PI*2); ctx.fill();
      break;
    }
    case 'rug': {
      ctx.fillStyle=p.color;
      roundRect(ctx,x,y,w,h,8); ctx.fill();
      ctx.strokeStyle=p.accent; ctx.lineWidth=2;
      roundRect(ctx,x+8,y+8,w-16,h-16,4); ctx.stroke();
      ctx.fillStyle=p.accent;
      ctx.beginPath(); ctx.arc(cx,cy,Math.min(w,h)*0.12,0,Math.PI*2); ctx.fill();
      break;
    }
    case 'table': {
      ctx.fillStyle=p.color;
      roundRect(ctx,x,y,w,h*0.28,4); ctx.fill();
      ctx.fillStyle=p.accent;
      ctx.fillRect(x+5,y+h*0.28,5,h*0.72);
      ctx.fillRect(x+w-10,y+h*0.28,5,h*0.72);
      break;
    }
    case 'bathtub': {
      ctx.fillStyle='#bbb'; roundRect(ctx,x,y,w,h,10); ctx.fill();
      ctx.fillStyle='#f5f5f5'; roundRect(ctx,x+6,y+6,w-12,h-12,8); ctx.fill();
      ctx.fillStyle='#85C1E9'; roundRect(ctx,x+8,y+8,w-16,h-22,6); ctx.fill();
      ctx.fillStyle='#aaa'; ctx.fillRect(cx-2,y-10,4,12);
      break;
    }
    case 'shelf': {
      ctx.fillStyle=p.color; ctx.fillRect(x,y,w,h);
      ctx.fillStyle=p.accent; ctx.fillRect(x,y+h*0.5,w,3);
      const ic=['#E74C3C','#3498DB','#2ECC71','#F1C40F'];
      for (let i=0;i<4;i++) {
        ctx.fillStyle=ic[i];
        ctx.beginPath(); ctx.arc(x+8+i*(w-16)/4+(w-16)/8, y+h*0.25, 5, 0, Math.PI*2); ctx.fill();
      }
      break;
    }
  }
}

function drawChameleon(
  ctx: CanvasRenderingContext2D,
  wx: number, wy: number,
  bodyColor: string,
  flatten: boolean
) {
  ctx.save();
  ctx.translate(wx, wy);

  const bw = flatten ? 32 : 24, bh = flatten ? 10 : 20;

  // Shadow
  ctx.fillStyle='rgba(0,0,0,0.12)';
  ctx.beginPath(); ctx.ellipse(2,bh/2+5,bw/2+2,5,0,0,Math.PI*2); ctx.fill();

  // Tail
  ctx.strokeStyle=bodyColor; ctx.lineWidth=4; ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(0,bh/2-2);
  ctx.quadraticCurveTo(-bw/2-10,bh/2+6,-bw/2-5,bh/2-4);
  ctx.quadraticCurveTo(-bw/2,bh/2-12,-bw/2+6,bh/2-4);
  ctx.stroke();

  // Legs
  ctx.fillStyle=brighten(bodyColor,15);
  ctx.beginPath(); ctx.ellipse(-bw/3,bh/2,5,7,-0.3,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(bw/3,bh/2,5,7,0.3,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-bw/2.5,bh/2+3,4,5,-0.5,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(bw/2.5,bh/2+3,4,5,0.5,0,Math.PI*2); ctx.fill();

  // Body
  ctx.fillStyle=bodyColor;
  ctx.beginPath(); ctx.ellipse(0,0,bw/2,bh/2,0,0,Math.PI*2); ctx.fill();

  // Highlight
  const grd=ctx.createRadialGradient(-bw/6,-bh/4,0,0,0,bw/2);
  grd.addColorStop(0,'rgba(255,255,255,0.35)'); grd.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=grd;
  ctx.beginPath(); ctx.ellipse(0,0,bw/2,bh/2,0,0,Math.PI*2); ctx.fill();

  // Head
  const hs=flatten?9:13;
  ctx.fillStyle=bodyColor;
  ctx.beginPath(); ctx.ellipse(bw/2+hs/2-2,-2,hs/2,hs/2*0.82,0,0,Math.PI*2); ctx.fill();

  // Eyes
  const ex=bw/2+hs/2+1, ey1=-6, ey2=3;
  ctx.fillStyle='#fff';
  ctx.beginPath(); ctx.ellipse(ex,ey1,4,4,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(ex,ey2,4,4,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#1a1a1a';
  ctx.beginPath(); ctx.ellipse(ex+1,ey1,2,2,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(ex+1,ey2,2,2,0,0,Math.PI*2); ctx.fill();

  ctx.restore();
}

function drawSeeker(ctx: CanvasRenderingContext2D, wx: number, wy: number, t: number) {
  ctx.save();
  ctx.translate(wx,wy);

  // Body
  ctx.fillStyle='#B03A2E';
  ctx.beginPath(); ctx.ellipse(0,0,20,16,0,0,Math.PI*2); ctx.fill();

  // Horns
  ctx.fillStyle='#7B241C';
  ctx.beginPath(); ctx.moveTo(-9,-14); ctx.lineTo(-5,-26); ctx.lineTo(-1,-14); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(9,-14); ctx.lineTo(5,-26); ctx.lineTo(1,-14); ctx.closePath(); ctx.fill();

  // Eyes
  ctx.fillStyle='#FFEB3B';
  ctx.beginPath(); ctx.ellipse(-7,-4,5,4,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(7,-4,5,4,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath(); ctx.ellipse(-7,-3,2.5,2.5,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(7,-3,2.5,2.5,0,0,Math.PI*2); ctx.fill();

  // Angry brows
  ctx.strokeStyle='#7B241C'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(-13,-9); ctx.lineTo(-4,-7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(13,-9); ctx.lineTo(4,-7); ctx.stroke();

  // Mouth
  ctx.strokeStyle='#7B241C'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(0,5,7,0.2,Math.PI-0.2); ctx.stroke();

  // Alert
  ctx.fillStyle=`rgba(255,0,0,${0.5+0.5*Math.sin(t*9)})`;
  ctx.font='bold 16px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='bottom';
  ctx.fillText('!',0,-28);

  ctx.restore();
}

// Get pixel color at world position
function getPixelColor(wx: number, wy: number): string {
  const tx=Math.floor(wx/TILE), ty=Math.floor(wy/TILE);
  if (tx<0||tx>=MAP_COLS||ty<0||ty>=MAP_ROWS) return '#888888';
  if (MAP[ty][tx]!==0) return getZone(tx).wall;
  for (const p of PROPS) {
    if (wx>=propPx(p)&&wx<=propPx(p)+p.w*TILE&&wy>=propPy(p)&&wy<=propPy(p)+p.h*TILE) {
      return wy<propPy(p)+p.h*TILE*0.4 ? p.topColor : p.color;
    }
  }
  return getZone(tx).floor;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const mouseRef = useRef({ x: 0, y: 0, clicked: false });

  const phaseRef = useRef<'intro'|'prep'|'seek'|'result'|'gameover'>('intro');
  const timerRef = useRef(0);
  const timerSecRef = useRef(PREP_TIME);
  const playerRef = useRef({ x: 14*TILE, y: 9*TILE });
  const playerColorRef = useRef('#FFFFFF');
  const seekerRef = useRef({ x: 14*TILE, y: 2*TILE, angle: Math.PI, wanderT: 0 });
  const isEyedropperRef = useRef(false);
  const hoveredColorRef = useRef<string|null>(null);
  const winsRef = useRef(0);
  const roundRef = useRef(1);
  const lastTsRef = useRef(0);
  const rafRef = useRef(0);
  const overlayRef = useRef<{vis: number; text: string}>({vis:0,text:''});

  function startRound() {
    phaseRef.current = 'prep';
    timerSecRef.current = PREP_TIME;
    timerRef.current = 0;
    playerRef.current = { x: 14*TILE, y: 9*TILE };
    playerColorRef.current = '#FFFFFF';
    isEyedropperRef.current = false;
    hoveredColorRef.current = null;
    seekerRef.current = { x: 14*TILE, y: 2*TILE, angle: Math.PI, wanderT: 0 };
    overlayRef.current = { vis: 0, text: '' };
    // Update UI
    const ph = document.getElementById('phase-banner');
    const tm = document.getElementById('timer');
    const col = document.getElementById('player-color');
    const ey = document.getElementById('eyedropper-hint');
    const vis = document.getElementById('visibility-bar');
    const res = document.getElementById('result-screen');
    const go = document.getElementById('gameover-screen');
    [ph,tm,col,ey,vis,res,go].forEach(el=>{ if(el) el.style.display='none'; });
    if(ph) { ph.style.display=''; ph.textContent='⏱ PREP — HIDE & PAINT!'; ph.style.background='rgba(39,174,96,0.9)'; }
    if(tm) { tm.style.display=''; tm.textContent=`${PREP_TIME}s`; }
    if(col) { col.style.display=''; (col as HTMLDivElement).style.setProperty('--c','#FFFFFF'); }
    if(ey) { ey.style.display=''; }
    if(vis) vis.style.display='none';
    if(res) res.style.display='none';
    if(go) go.style.display='none';
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = W; canvas.height = H;

    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      if (e.key.toLowerCase()==='e') {
        if (phaseRef.current==='prep') isEyedropperRef.current = !isEyedropperRef.current;
      }
      if (e.key===' ') {
        e.preventDefault();
        const ph = phaseRef.current;
        if (ph==='intro'||ph==='result'||ph==='gameover') startRound();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase());

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const sx = W / rect.width, sy = H / rect.height;
      mouseRef.current = {
        x: (e.clientX-rect.left)*sx,
        y: (e.clientY-rect.top)*sy,
      };
      if (isEyedropperRef.current) {
        hoveredColorRef.current = getPixelColor(mouseRef.current.x, mouseRef.current.y);
      }
      canvas.style.cursor = isEyedropperRef.current ? 'none' : 'default';
    };

    const onClick = () => {
      const ph = phaseRef.current;
      if (ph==='intro'||ph==='result'||ph==='gameover') { startRound(); return; }
      if (ph==='prep' && isEyedropperRef.current) {
        playerColorRef.current = getPixelColor(mouseRef.current.x, mouseRef.current.y);
        isEyedropperRef.current = false;
        // Update color UI
        const col = document.getElementById('player-color');
        if (col) col.style.background = playerColorRef.current;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);

    function update(dt: number) {
      const ph = phaseRef.current;
      if (ph==='intro'||ph==='result'||ph==='gameover') return;

      // Timer countdown
      timerRef.current += dt;
      if (timerRef.current >= 1) {
        timerRef.current = 0;
        timerSecRef.current--;
        const tm = document.getElementById('timer');
        if (tm) {
          tm.textContent = `${timerSecRef.current}s`;
          tm.style.color = timerSecRef.current <= 5 ? '#FF4444' : '#fff';
        }

        if (ph==='prep' && timerSecRef.current <= 0) {
          phaseRef.current = 'seek';
          timerSecRef.current = SEEK_TIME;
          const ph2 = document.getElementById('phase-banner');
          const ey = document.getElementById('eyedropper-hint');
          if (ph2) { ph2.textContent='🔴 SEEKING — STAY HIDDEN!'; ph2.style.background='rgba(192,57,43,0.9)'; }
          if (ey) ey.style.display='none';
          const vis = document.getElementById('visibility-bar');
          if (vis) vis.style.display='';
        } else if (ph==='seek' && timerSecRef.current <= 0) {
          phaseRef.current = 'result';
          winsRef.current++;
          roundRef.current++;
          const res = document.getElementById('result-screen');
          const ph2 = document.getElementById('phase-banner');
          const tm = document.getElementById('timer');
          const vis = document.getElementById('visibility-bar');
          [ph2,tm,vis].forEach(el=>{ if(el) el.style.display='none'; });
          if (res) {
            res.style.display='';
            const winsEl = res.querySelector('[data-wins]') as HTMLSpanElement;
            const roundEl = res.querySelector('[data-round]') as HTMLSpanElement;
            if (winsEl) winsEl.textContent=`Wins: ${winsRef.current}`;
            if (roundEl) roundEl.textContent=`Round ${roundRef.current}`;
          }
          return;
        }
      }

      const SPEED = 160;

      // Player movement
      if (ph==='prep') {
        const keys = keysRef.current;
        let dx=0, dy=0;
        if (keys.has('w')||keys.has('arrowup')) dy=-1;
        if (keys.has('s')||keys.has('arrowdown')) dy=1;
        if (keys.has('a')||keys.has('arrowleft')) dx=-1;
        if (keys.has('d')||keys.has('arrowright')) dx=1;
        if (dx||dy) {
          const len=Math.sqrt(dx*dx+dy*dy);
          dx/=len; dy/=len;
          const nx=playerRef.current.x+dx*SPEED*dt;
          const ny=playerRef.current.y+dy*SPEED*dt;
          const tx=Math.floor(nx/TILE), ty=Math.floor(ny/TILE);
          if (tx>=1&&tx<MAP_COLS-1&&ty>=1&&ty<MAP_ROWS-1&&MAP[ty][tx]===0) {
            let blocked=false;
            for (const p of PROPS) {
              const px=propPx(p), py=propPy(p);
              if (nx+18>px&&nx-18<px+p.w*TILE&&ny+14>py&&ny-14<py+p.h*TILE) { blocked=true; break; }
            }
            if (!blocked) { playerRef.current.x=nx; playerRef.current.y=ny; }
          }
        }
      }

      // Seeker AI
      const sk = seekerRef.current;
      if (ph==='seek') {
        const dx=playerRef.current.x-sk.x, dy=playerRef.current.y-sk.y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        sk.angle=Math.atan2(dy,dx);
        const SEEK_SPD=85;

        // Proximity catch
        if (dist<75) {
          phaseRef.current='gameover';
          const go = document.getElementById('gameover-screen');
          const ph2 = document.getElementById('phase-banner');
          const tm = document.getElementById('timer');
          const vis = document.getElementById('visibility-bar');
          [ph2,tm,vis].forEach(el=>{ if(el) el.style.display='none'; });
          if (go) go.style.display='';
          return;
        }

        // Visibility-based detection
        const envColor=getPixelColor(playerRef.current.x, playerRef.current.y);
        const vis=1-colorDist(playerColorRef.current, envColor);
        const DETECT_RANGE=220;
        if (dist<DETECT_RANGE && Math.random()<(1-vis)*0.015) {
          phaseRef.current='gameover';
          const go = document.getElementById('gameover-screen');
          const ph2 = document.getElementById('phase-banner');
          const tm = document.getElementById('timer');
          const vis_el = document.getElementById('visibility-bar');
          [ph2,tm,vis_el].forEach(el=>{ if(el) el.style.display='none'; });
          if (go) go.style.display='';
          return;
        }

        sk.x += (dx/dist)*SEEK_SPD*dt;
        sk.y += (dy/dist)*SEEK_SPD*dt;

        // Update visibility meter
        const visEl = document.getElementById('visibility-bar-fill');
        const visTextEl = document.getElementById('visibility-pct');
        if (visEl) visEl.style.width=`${Math.round(vis*100)}%`;
        if (visEl) visEl.style.background = vis>0.7?'#22c55e':vis>0.4?'#eab308':'#ef4444';
        if (visTextEl) visTextEl.textContent=`${Math.round(vis*100)}%`;

      } else {
        // Wander
        sk.wanderT += dt;
        if (sk.wanderT>1.8) {
          sk.wanderT=0;
          sk.angle += (Math.random()-0.5)*Math.PI*0.9;
        }
        const nx=sk.x+Math.cos(sk.angle)*40*dt;
        const ny=sk.y+Math.sin(sk.angle)*40*dt;
        const tx=Math.floor(nx/TILE), ty=Math.floor(ny/TILE);
        if (tx>1&&tx<MAP_COLS-2&&ty>1&&ty<MAP_ROWS-2) {
          sk.x=nx; sk.y=ny;
        } else {
          sk.angle+=Math.PI+(Math.random()-0.5)*0.5;
          sk.x=Math.max(TILE*2,Math.min((MAP_COLS-2)*TILE,sk.x));
          sk.y=Math.max(TILE*2,Math.min((MAP_ROWS-2)*TILE,sk.y));
        }
      }
    }

    function draw(t: number) {
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0,0,W,H);

      if (phaseRef.current==='intro') {
        // Intro screen
        const grd=ctx.createLinearGradient(0,0,W,H);
        grd.addColorStop(0,'#1a0533'); grd.addColorStop(0.5,'#0d1b3e'); grd.addColorStop(1,'#0a2618');
        ctx.fillStyle=grd; ctx.fillRect(0,0,W,H);

        // Particles
        for (let i=0;i<40;i++) {
          const px=((i*173+t*18)%W);
          const py=((i*271+t*11+Math.sin(t+i)*18)%H);
          ctx.fillStyle=`hsla(${(i*37)%360},80%,65%,0.55)`;
          ctx.beginPath(); ctx.arc(px,py,3,0,Math.PI*2); ctx.fill();
        }

        ctx.textAlign='center';
        ctx.font='bold 50px sans-serif';
        ctx.fillStyle='#fff';
        ctx.shadowColor='#a855f7'; ctx.shadowBlur=24;
        ctx.fillText('MECCHA CHAMELEON', W/2, H/2-90);
        ctx.shadowBlur=0;

        ctx.font='20px sans-serif';
        ctx.fillStyle='#c4b5fd';
        ctx.fillText('Hide & Seek · Paint · Survive', W/2, H/2-50);

        drawChameleon(ctx, W/2, H/2+20, '#FFFFFF', false);

        ctx.font='17px sans-serif';
        ctx.fillStyle='#a78bfa';
        ctx.fillText('Press SPACE or click to start', W/2, H/2+80);

        ctx.font='12px sans-serif';
        ctx.fillStyle='rgba(255,255,255,0.45)';
        ctx.fillText('WASD = Move  ·  E = Eyedropper (pick color)  ·  Click = Sample color', W/2, H/2+115);
        ctx.fillText('Match your body color to the environment to hide!', W/2, H/2+135);

        ctx.textAlign='left';
        return;
      }

      // Camera: follow player, clamped
      const p = playerRef.current;
      const CAM_W=W, CAM_H=H;
      let camX=Math.max(0,Math.min(MAP_COLS*TILE-CAM_W, p.x-CAM_W/2));
      let camY=Math.max(0,Math.min(MAP_ROWS*TILE-CAM_H, p.y-CAM_H/2));

      ctx.save();
      ctx.translate(-camX,-camY);

      drawRoom(ctx);
      for (const prop of PROPS) drawProp(ctx, prop, t);

      const isFlattened = phaseRef.current==='seek';
      drawChameleon(ctx, p.x, p.y, playerColorRef.current, isFlattened);
      drawSeeker(ctx, seekerRef.current.x, seekerRef.current.y, t);

      // Seeker vision cone during seek
      if (phaseRef.current==='seek') {
        const sk=seekerRef.current;
        const coneA=0.7, coneR=180;
        ctx.save();
        ctx.translate(sk.x,sk.y); ctx.rotate(sk.angle);
        const grd=ctx.createRadialGradient(0,0,0,0,0,coneR);
        grd.addColorStop(0,'rgba(255,60,60,0.12)'); grd.addColorStop(1,'rgba(255,60,60,0)');
        ctx.fillStyle=grd;
        ctx.beginPath(); ctx.moveTo(0,0);
        ctx.arc(0,0,coneR,-coneA/2,coneA/2); ctx.closePath(); ctx.fill();
        ctx.restore();
      }

      ctx.restore();

      // ── Eyedropper cursor ───────────────────────────────────────────────
      if (isEyedropperRef.current && hoveredColorRef.current) {
        const mx=mouseRef.current.x, my=mouseRef.current.y;
        const hc=hoveredColorRef.current;
        ctx.save(); ctx.translate(mx,my);
        ctx.strokeStyle=hc; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-18);
        ctx.moveTo(-4,-14); ctx.lineTo(4,-14); ctx.stroke();
        ctx.fillStyle=hc;
        ctx.beginPath(); ctx.arc(0,4,9,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle='#fff'; ctx.lineWidth=1.5; ctx.stroke();
        ctx.restore();
      }
    }

    function loop(ts: number) {
      const t=ts/1000;
      const dt=Math.min(t-lastTsRef.current, 0.05);
      lastTsRef.current=t;
      update(dt);
      draw(t);
      rafRef.current=requestAnimationFrame(loop);
    }

    rafRef.current=requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-[#0a0a1a] flex items-center justify-center overflow-hidden">

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }}
      />

      {/* ── Phase Banner ── */}
      <div
        id="phase-banner"
        className="absolute top-3 left-1/2 -translate-x-1/2 rounded-lg px-6 py-2 text-white text-sm font-bold tracking-wide hidden"
        style={{ background: 'rgba(39,174,96,0.9)' }}
      >
        ⏱ PREP — HIDE & PAINT!
      </div>

      {/* ── Timer ── */}
      <div
        id="timer"
        className="absolute top-3 right-4 rounded-lg bg-black/60 px-4 py-1 text-white font-mono text-xl font-bold hidden"
      >
        25s
      </div>

      {/* ── Round Info ── */}
      <div className="absolute top-3 left-3 rounded-lg bg-black/60 px-3 py-1 text-white text-xs hidden">
        <div id="round-info">Round 1</div>
        <div id="wins-info" className="text-green-400">Wins: 0</div>
      </div>

      {/* ── Player Color Swatch ── */}
      <div
        id="player-color"
        className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-2 flex items-center gap-2 hidden"
      >
        <div className="w-6 h-6 rounded border-2 border-white/50" style={{background:'#FFFFFF'}} />
        <span className="text-white text-xs font-mono">#FFFFFF</span>
      </div>

      {/* ── E Key Hint ── */}
      <div
        id="eyedropper-hint"
        className="absolute bottom-4 right-4 rounded-lg bg-black/60 px-3 py-2 text-white text-xs text-right leading-tight hidden"
      >
        <div className="opacity-60">Press</div>
        <div className="font-bold">E = Eyedropper</div>
      </div>

      {/* ── Visibility Meter ── */}
      <div
        id="visibility-bar"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 rounded-full bg-black/60 px-3 py-2 hidden"
      >
        <div className="flex justify-between text-white text-xs mb-1">
          <span>Visibility</span>
          <span id="visibility-pct">0%</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div id="visibility-bar-fill" className="h-full rounded-full" style={{width:'0%', background:'#22c55e'}} />
        </div>
      </div>

      {/* ── Result Screen ── */}
      <div
        id="result-screen"
        className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg hidden"
      >
        <div className="text-5xl mb-4">🎉</div>
        <div className="text-white text-3xl font-bold mb-2">SURVIVED!</div>
        <div className="text-gray-300 text-lg mb-6">You blended in perfectly</div>
        <div className="text-green-400 text-sm mb-1">
          <span data-wins>Wins: 0</span>
          <span className="mx-4">·</span>
          <span data-round>Round 1</span>
        </div>
        <div className="text-purple-400 text-sm mt-6">Press SPACE or click to continue</div>
      </div>

      {/* ── Game Over Screen ── */}
      <div
        id="gameover-screen"
        className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 rounded-lg hidden"
      >
        <div className="text-5xl mb-4">💀</div>
        <div class="text-red-400 text-3xl font-bold mb-2">CAUGHT!</div>
        <div class="text-gray-300 text-base mb-6">The seeker found you</div>
        <div class="text-purple-400 text-sm">Press SPACE or click to retry</div>
      </div>

    </div>
  );
}
