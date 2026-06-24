import React, { useEffect, useRef, useState } from 'react';

interface PhysicsSimulationProps {
  courseTitle: string;
  topicName: string;
}

type SimTab = 'modulation' | 'interference' | 'rc-circuit';

interface SimParams {
  tab: SimTab;
  // Wave simulation
  carrierFreq: number;
  modFreq: number;
  modIndex: number;
  modMode: 'am' | 'fm';
  freq1: number;
  freq2: number;
  phase: number;
  // RC circuit
  resistance: number;   // kΩ (1–100)
  capacitance: number;  // µF (10–1000)
  switchClosed: boolean;
}

const STRIP_H = 100;
const CANVAS_H = STRIP_H * 3;
const N = 512;
const SPEED = 0.8;

const C = {
  grid:   '#1e293b',
  wave1:  '#6366f1',
  wave2:  '#10b981',
  result: '#22d3ee',
};

// ─── Wave simulation ──────────────────────────────────────────────────────────

function computeSamples(t: number, p: SimParams): [number[], number[], number[]] {
  const a = new Array<number>(N);
  const b = new Array<number>(N);
  const r = new Array<number>(N);
  for (let i = 0; i < N; i++) {
    const x = i / (N - 1);
    if (p.tab === 'modulation') {
      const carrier = Math.cos(2 * Math.PI * p.carrierFreq * x - SPEED * t);
      const mod     = Math.cos(2 * Math.PI * p.modFreq * x - SPEED * 0.3 * t);
      a[i] = carrier;
      b[i] = mod;
      r[i] = p.modMode === 'am'
        ? (1 + p.modIndex * mod) * carrier
        : Math.cos(
            2 * Math.PI * p.carrierFreq * x
            + p.modIndex * Math.PI * 2 * Math.sin(2 * Math.PI * p.modFreq * x - SPEED * 0.3 * t)
            - SPEED * t,
          );
    } else {
      a[i] = Math.sin(2 * Math.PI * p.freq1 * x - SPEED * t);
      b[i] = Math.sin(2 * Math.PI * p.freq2 * x - SPEED * 0.8 * t + p.phase);
      r[i] = (a[i]! + b[i]!) / 2;
    }
  }
  return [a, b, r];
}

function drawStrip(
  ctx: CanvasRenderingContext2D,
  w: number,
  idx: number,
  pts: number[],
  color: string,
  label: string,
) {
  const cy  = idx * STRIP_H + STRIP_H / 2;
  const amp = (STRIP_H / 2) * 0.82;

  if (idx > 0) {
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, idx * STRIP_H);
    ctx.lineTo(w, idx * STRIP_H);
    ctx.stroke();
  }

  ctx.strokeStyle = C.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(w, cy);
  ctx.stroke();

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let i = 0; i < pts.length; i++) {
    const x = (i / (pts.length - 1)) * w;
    const y = cy - pts[i]! * amp;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = 'bold 9px ui-monospace,monospace';
  ctx.fillText(label, 6, idx * STRIP_H + 13);
}

// ─── RC Circuit drawing ───────────────────────────────────────────────────────

function drawRCCircuit(
  ctx: CanvasRenderingContext2D,
  w: number,
  p: SimParams,
  vc: number,
  I_norm: number,
  particles: number[],
  vcHistory: number[],
): void {
  const Vs = 12;
  const chargeLevel = vc / Vs;
  const tau = (p.resistance * 1000) * (p.capacitance * 1e-6);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, CANVAS_H);

  // ── Layout constants ──────────────────────────────────────
  const cxl = 26;          // circuit left x
  const cxr = w * 0.56;    // circuit right x
  const cyt = 30;           // circuit top y
  const cyb = 218;          // circuit bottom y
  const cw  = cxr - cxl;
  const ch  = cyb - cyt;

  const batCY   = (cyt + cyb) / 2;
  const batHH   = 22;        // battery symbol half-height
  const resX    = cxl + cw * 0.34;
  const resW    = 40;
  const swX1    = cxl + cw * 0.22;
  const swX2    = swX1 + 36;
  const capCY   = (cyt + cyb) / 2;
  const capGap  = 16;        // gap between capacitor plates
  const capPHW  = 22;        // plate half-width

  // Meter bar
  const mxl  = w * 0.63;
  const mxr  = w - 10;
  const barW = 20;
  const barX = mxl + (mxr - mxl) / 2 - barW / 2;
  const barT = cyt;
  const barB = cyb;

  // Time chart strip
  const chtT = 228;
  const chtB = CANVAS_H - 6;
  const chtL = 38;
  const chtR = w - 10;

  // ── Wires ─────────────────────────────────────────────────
  ctx.strokeStyle = '#334155';
  ctx.lineWidth   = 2;
  ctx.lineJoin    = 'round';
  ctx.lineCap     = 'round';

  const wire = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  };

  wire(cxl, cyt, resX, cyt);                          // top-left segment
  wire(resX + resW, cyt, cxr, cyt);                   // top-right segment
  wire(cxl, cyb, swX1, cyb);                          // bottom-left segment
  wire(swX2, cyb, cxr, cyb);                          // bottom-right segment
  wire(cxl, cyt, cxl, batCY - batHH);                 // left-top segment
  wire(cxl, batCY + batHH, cxl, cyb);                 // left-bottom segment
  wire(cxr, cyt, cxr, capCY - capGap / 2 - 2);       // right-top segment
  wire(cxr, capCY + capGap / 2 + 2, cxr, cyb);        // right-bottom segment

  // ── Battery ───────────────────────────────────────────────
  const bLong = 15, bShort = 9;
  ctx.lineWidth = 2.5;
  const batLines: [number, number][] = [
    [bLong,  batCY - 14],
    [bShort, batCY - 6],
    [bShort, batCY + 6],
    [bLong,  batCY + 14],
  ];
  for (const [hw, y] of batLines) {
    ctx.strokeStyle = '#64748b';
    ctx.beginPath(); ctx.moveTo(cxl - hw, y); ctx.lineTo(cxl + hw, y); ctx.stroke();
  }
  ctx.font = 'bold 7px ui-monospace,monospace'; ctx.textAlign = 'right';
  ctx.fillStyle = '#475569'; ctx.fillText('12V', cxl - 12, batCY + 3);
  ctx.fillStyle = '#f43f5e'; ctx.font = 'bold 9px sans-serif';
  ctx.fillText('+', cxl - 9, batCY - 17);
  ctx.fillStyle = '#60a5fa';
  ctx.fillText('−', cxl - 9, batCY + 23);

  // ── Resistor (IEC rectangle) ──────────────────────────────
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(resX, cyt - 7, resW, 14);
  ctx.strokeStyle = '#818cf8'; ctx.lineWidth = 1.5;
  ctx.strokeRect(resX, cyt - 7, resW, 14);
  ctx.fillStyle = '#818cf8'; ctx.font = 'bold 8px ui-monospace,monospace'; ctx.textAlign = 'center';
  ctx.fillText(`${p.resistance}kΩ`, resX + resW / 2, cyt - 10);

  // ── Switch ────────────────────────────────────────────────
  const swColor = p.switchClosed ? '#34d399' : '#f59e0b';
  ctx.fillStyle = swColor;
  ctx.beginPath(); ctx.arc(swX1, cyb, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(swX2, cyb, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = swColor; ctx.lineWidth = 2;
  if (p.switchClosed) {
    wire(swX1, cyb, swX2, cyb);
  } else {
    ctx.beginPath(); ctx.moveTo(swX1, cyb); ctx.lineTo(swX2, cyb - 17); ctx.stroke();
  }
  ctx.fillStyle = swColor; ctx.font = 'bold 7px ui-monospace,monospace'; ctx.textAlign = 'center';
  ctx.fillText(p.switchClosed ? 'SW ●' : 'SW ○', (swX1 + swX2) / 2, cyb + 14);

  // ── Capacitor plates ──────────────────────────────────────
  const plateFillW = capPHW * 2 * chargeLevel;

  // + plate (top)
  ctx.fillStyle = `rgba(244,63,94,${0.12 + chargeLevel * 0.5})`;
  ctx.fillRect(cxr - capPHW, capCY - capGap / 2 - 5, plateFillW, 5);
  ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 3;
  wire(cxr - capPHW, capCY - capGap / 2, cxr + capPHW, capCY - capGap / 2);

  // − plate (bottom)
  ctx.fillStyle = `rgba(96,165,250,${0.12 + chargeLevel * 0.5})`;
  ctx.fillRect(cxr - capPHW, capCY + capGap / 2, plateFillW, 5);
  ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 3;
  wire(cxr - capPHW, capCY + capGap / 2, cxr + capPHW, capCY + capGap / 2);

  // Charge symbols
  const nSyms = Math.floor(chargeLevel * 4);
  ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center';
  for (let i = 0; i < nSyms; i++) {
    const sx = cxr - capPHW + (i + 0.5) * (capPHW * 2 / 4);
    ctx.fillStyle = `rgba(251,113,133,${chargeLevel})`;
    ctx.fillText('+', sx, capCY - capGap / 2 - 8);
    ctx.fillStyle = `rgba(96,165,250,${chargeLevel})`;
    ctx.fillText('−', sx, capCY + capGap / 2 + 14);
  }

  ctx.fillStyle = '#22d3ee'; ctx.font = 'bold 7px ui-monospace,monospace'; ctx.textAlign = 'left';
  ctx.fillText(`${p.capacitance}µF`, cxr + capPHW + 4, capCY + 4);
  ctx.fillStyle = '#475569'; ctx.textAlign = 'left';
  ctx.fillText(`τ=${tau.toFixed(2)}s`, cxl + 2, cyb + 15);

  // ── Electron particles ────────────────────────────────────
  if (p.switchClosed && I_norm > 0.01) {
    const perim = 2 * (cw + ch);
    const topF  = cw / perim;
    const sideF = ch / perim;

    for (const pos of particles) {
      let px: number, py: number;
      if (pos < topF) {
        // Top wire: left → right
        px = cxl + (pos / topF) * cw; py = cyt;
      } else if (pos < topF + sideF) {
        // Right wire: top → bottom
        px = cxr; py = cyt + ((pos - topF) / sideF) * ch;
      } else if (pos < topF * 2 + sideF) {
        // Bottom wire: right → left
        px = cxr - ((pos - topF - sideF) / topF) * cw; py = cyb;
      } else {
        // Left wire: bottom → top
        px = cxl; py = cyb - ((pos - topF * 2 - sideF) / sideF) * ch;
      }

      const alpha = 0.3 + I_norm * 0.7;
      ctx.shadowBlur    = 10;
      ctx.shadowColor   = '#22d3ee';
      ctx.fillStyle     = `rgba(103,232,249,${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // ── Voltage bar meter ─────────────────────────────────────
  ctx.fillStyle = '#334155'; ctx.font = 'bold 7px ui-monospace,monospace'; ctx.textAlign = 'center';
  ctx.fillText('Vc', barX + barW / 2, barT - 5);

  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
  ctx.strokeRect(barX, barT, barW, barB - barT);

  const bfh = (barB - barT) * chargeLevel;
  if (bfh > 0) {
    const grad = ctx.createLinearGradient(barX, barB - bfh, barX, barB);
    grad.addColorStop(0, '#22d3ee');
    grad.addColorStop(1, '#0e7490');
    ctx.fillStyle = grad;
    ctx.fillRect(barX, barB - bfh, barW, bfh);
  }

  ctx.fillStyle = '#1e293b'; ctx.font = '7px ui-monospace,monospace'; ctx.textAlign = 'right';
  for (const v of [0, 3, 6, 9, 12]) {
    const vy = barB - ((v / Vs) * (barB - barT));
    ctx.fillText(`${v}V`, barX - 3, vy + 3);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(barX - 2, vy); ctx.lineTo(barX, vy); ctx.stroke();
  }

  ctx.fillStyle = '#22d3ee'; ctx.font = 'bold 10px ui-monospace,monospace'; ctx.textAlign = 'center';
  ctx.fillText(`${vc.toFixed(1)}V`, barX + barW / 2, barB + 14);

  const I_mA = p.switchClosed ? ((Vs - vc) / (p.resistance * 1000)) * 1000 : 0;
  ctx.fillStyle = '#475569'; ctx.font = '7px ui-monospace,monospace';
  ctx.fillText(`${I_mA.toFixed(2)}mA`, barX + barW / 2, barB + 24);

  // ── Vc(t) time chart ──────────────────────────────────────
  ctx.fillStyle = '#030b14';
  ctx.fillRect(0, chtT - 6, w, CANVAS_H - chtT + 6);
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, chtT - 8); ctx.lineTo(w, chtT - 8); ctx.stroke();

  // Axes
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(chtL, chtT); ctx.lineTo(chtL, chtB);
  ctx.lineTo(chtR, chtB);
  ctx.stroke();

  ctx.fillStyle = '#334155'; ctx.font = '7px ui-monospace,monospace';
  ctx.textAlign = 'right';
  ctx.fillText('12', chtL - 2, chtT + 4);
  ctx.fillText('0V', chtL - 2, chtB);
  ctx.textAlign = 'left';
  ctx.fillText('Vc(t)', chtL + 2, chtT - 1);
  ctx.textAlign = 'center';
  ctx.fillText('t →', (chtL + chtR) / 2, chtB + 9);

  // Asymptote line at Vs
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 0.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(chtL, chtT); ctx.lineTo(chtR, chtT); ctx.stroke();
  ctx.setLineDash([]);

  if (vcHistory.length > 1) {
    const chartW = chtR - chtL;
    const chartH = chtB - chtT;
    ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < vcHistory.length; i++) {
      const cx2 = chtL + (i / (vcHistory.length - 1)) * chartW;
      const cy2 = chtB - (vcHistory[i]! / Vs) * chartH;
      i === 0 ? ctx.moveTo(cx2, cy2) : ctx.lineTo(cx2, cy2);
    }
    ctx.stroke();
  }

  if (chargeLevel > 0.99) {
    ctx.fillStyle = '#34d399'; ctx.font = 'bold 8px ui-monospace,monospace'; ctx.textAlign = 'center';
    ctx.fillText('✓ טעון מלא', w / 2, chtT - 10);
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PhysicsSimulation({ topicName }: PhysicsSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef<number>(0);

  // RC-specific refs
  const rcTRef        = useRef<number>(0);
  const vcRef         = useRef<number>(0);
  const particlesRef  = useRef<number[]>(Array.from({ length: 10 }, (_, i) => i / 10));
  const vcHistoryRef  = useRef<number[]>([]);
  const lastFrameRef  = useRef<number>(0);

  const paramsRef = useRef<SimParams>({
    tab: 'modulation',
    carrierFreq: 4,
    modFreq: 0.6,
    modIndex: 0.7,
    modMode: 'am',
    freq1: 2,
    freq2: 2.5,
    phase: 0,
    resistance: 10,
    capacitance: 100,
    switchClosed: false,
  });
  const [ui, setUi] = useState({ ...paramsRef.current });

  const set = <K extends keyof SimParams>(key: K, val: SimParams[K]) => {
    paramsRef.current = { ...paramsRef.current, [key]: val };
    setUi({ ...paramsRef.current });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width  = canvas.offsetWidth * dpr;
      canvas.height = CANVAS_H * dpr;
      canvas.getContext('2d')?.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = (timestamp: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) { rafRef.current = requestAnimationFrame(loop); return; }
      const w = canvas.offsetWidth;
      const p = paramsRef.current;

      // Real dt for RC simulation
      const dt = lastFrameRef.current
        ? Math.min((timestamp - lastFrameRef.current) / 1000, 0.05)
        : 0.016;
      lastFrameRef.current = timestamp;

      if (p.tab === 'rc-circuit') {
        const Vs  = 12;
        const R   = p.resistance * 1000;
        const Cf  = p.capacitance * 1e-6;
        const tau = R * Cf;

        if (p.switchClosed) {
          rcTRef.current += dt;
        }

        const vc     = p.switchClosed ? Vs * (1 - Math.exp(-rcTRef.current / tau)) : vcRef.current;
        const I_norm = p.switchClosed ? Math.exp(-rcTRef.current / tau) : 0;
        vcRef.current = vc;

        if (p.switchClosed) {
          const speed = I_norm * 0.28; // max fraction of path per second
          for (let i = 0; i < particlesRef.current.length; i++) {
            particlesRef.current[i] = ((particlesRef.current[i]! + speed * dt) % 1 + 1) % 1;
          }
          vcHistoryRef.current.push(vc);
          if (vcHistoryRef.current.length > 160) vcHistoryRef.current.shift();
        }

        drawRCCircuit(ctx, w, p, vc, I_norm, particlesRef.current, vcHistoryRef.current);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // Wave simulation
      tRef.current += 0.04;
      ctx.fillStyle = 'rgba(15,23,42,0.6)';
      ctx.fillRect(0, 0, w, CANVAS_H);

      const [a, b, r] = computeSamples(tRef.current, p);

      if (p.tab === 'modulation') {
        drawStrip(ctx, w, 0, a, C.wave1,  `נושא fc=${p.carrierFreq.toFixed(1)}`);
        drawStrip(ctx, w, 1, b, C.wave2,  `מידול fm=${p.modFreq.toFixed(1)}`);
        drawStrip(ctx, w, 2, r, C.result, `${p.modMode.toUpperCase()} m=${p.modIndex.toFixed(2)}`);
      } else {
        const deg = ((p.phase / Math.PI) * 180).toFixed(0);
        drawStrip(ctx, w, 0, a, C.wave1,  `גל 1  f₁=${p.freq1.toFixed(1)}`);
        drawStrip(ctx, w, 1, b, C.wave2,  `גל 2  f₂=${p.freq2.toFixed(1)}  φ=${deg}°`);
        drawStrip(ctx, w, 2, r, C.result, 'סופרפוזיציה');
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  const TAB_META: Record<SimTab, { label: string; color: string; active: string }> = {
    modulation:   { label: '📡 AM/FM',    color: 'indigo',  active: 'bg-indigo-600/30 text-indigo-300 border border-indigo-600/40' },
    interference: { label: '〜 הפרעה',    color: 'emerald', active: 'bg-emerald-600/30 text-emerald-300 border border-emerald-600/40' },
    'rc-circuit': { label: '⚡ מעגל RC',  color: 'cyan',    active: 'bg-cyan-600/30 text-cyan-300 border border-cyan-600/40' },
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/60 overflow-hidden mt-4">
      {/* Header + tab switcher */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-800">
        <span className="text-[10px] font-bold text-slate-400">🧪 {topicName}</span>
        <div className="flex gap-1">
          {(Object.keys(TAB_META) as SimTab[]).map(t => (
            <button
              key={t}
              onClick={() => set('tab', t)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                ui.tab === t ? TAB_META[t].active : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {TAB_META[t].label}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: CANVAS_H, display: 'block' }}
      />

      {/* Controls */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        {ui.tab === 'modulation' ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold">מצב מידול</span>
              <div className="flex gap-1">
                {(['am', 'fm'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => set('modMode', m)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                      ui.modMode === m
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <Slider label="תדר נושא (fc)"  value={ui.carrierFreq} min={1}   max={10}         step={0.5}        color={C.wave1}  onChange={v => set('carrierFreq', v)} />
            <Slider label="תדר מידול (fm)" value={ui.modFreq}     min={0.1} max={5}           step={0.1}        color={C.wave2}  onChange={v => set('modFreq', v)} />
            <Slider label="מדד מידול (m)"  value={ui.modIndex}    min={0}   max={1}           step={0.05}       color={C.result} onChange={v => set('modIndex', v)} />
          </>
        ) : ui.tab === 'interference' ? (
          <>
            <Slider label="תדר גל 1 (f₁)" value={ui.freq1} min={0.5} max={8} step={0.5} color={C.wave1}  onChange={v => set('freq1', v)} />
            <Slider label="תדר גל 2 (f₂)" value={ui.freq2} min={0.5} max={8} step={0.5} color={C.wave2}  onChange={v => set('freq2', v)} />
            <Slider
              label={`פאזה (φ) ${((ui.phase / Math.PI) * 180).toFixed(0)}°`}
              value={ui.phase} min={0} max={2 * Math.PI} step={Math.PI / 12}
              color={C.result} onChange={v => set('phase', v)}
            />
          </>
        ) : (
          <>
            {/* Switch */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold">מתג (SW)</span>
              <button
                onClick={() => {
                  const willClose = !ui.switchClosed;
                  if (willClose) {
                    rcTRef.current = 0;
                    vcRef.current  = 0;
                    vcHistoryRef.current = [];
                    particlesRef.current = Array.from({ length: 10 }, (_, i) => i / 10);
                  }
                  set('switchClosed', willClose);
                }}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                  ui.switchClosed
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                    : 'bg-slate-800 text-amber-400 border border-amber-600/30 hover:bg-slate-700'
                }`}
              >
                {ui.switchClosed ? '⚡ סגור — טוען' : '○  פתוח'}
              </button>
            </div>

            <Slider
              label="התנגדות R"
              value={ui.resistance}
              min={1} max={100} step={1}
              color="#818cf8"
              onChange={v => set('resistance', v)}
              unit="kΩ"
            />
            <Slider
              label="קיבול C"
              value={ui.capacitance}
              min={10} max={1000} step={10}
              color="#22d3ee"
              onChange={v => set('capacitance', v)}
              unit="µF"
            />

            {/* τ readout */}
            <div className="flex items-center justify-between px-1 pt-1 border-t border-slate-800/60">
              <span className="text-[10px] text-slate-500 font-mono">τ = R · C</span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">
                {((ui.resistance * 1000) * (ui.capacitance * 1e-6)).toFixed(2)} s
              </span>
            </div>
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] text-slate-600 font-mono">Vc(t) = 12·(1 − e^(−t/τ))</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Slider ───────────────────────────────────────────────────────────────────

function Slider({
  label, value, min, max, step, color, onChange, unit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  onChange: (v: number) => void;
  unit?: string;
}) {
  const display = unit
    ? `${value.toFixed(step < 1 ? 1 : 0)}${unit}`
    : value.toFixed(step < 0.1 ? 2 : step < 1 ? 1 : 0);

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-slate-400 w-36 text-right shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="flex-1 h-1 appearance-none rounded-full cursor-pointer"
        style={{ accentColor: color }}
      />
      <span className="text-[10px] font-mono text-slate-300 w-14 text-left shrink-0">
        {display}
      </span>
    </div>
  );
}
