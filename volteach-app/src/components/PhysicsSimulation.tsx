import React, { useEffect, useRef, useState } from 'react';

interface PhysicsSimulationProps {
  courseTitle: string;
  topicName: string;
}

type SimTab = 'modulation' | 'interference';

interface SimParams {
  tab: SimTab;
  carrierFreq: number;
  modFreq: number;
  modIndex: number;
  modMode: 'am' | 'fm';
  freq1: number;
  freq2: number;
  phase: number;
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
      r[i] = (a[i] + b[i]) / 2;
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

export function PhysicsSimulation({ topicName }: PhysicsSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef<number>(0);
  const paramsRef = useRef<SimParams>({
    tab: 'modulation',
    carrierFreq: 4,
    modFreq: 0.6,
    modIndex: 0.7,
    modMode: 'am',
    freq1: 2,
    freq2: 2.5,
    phase: 0,
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

    const loop = () => {
      tRef.current += 0.04;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.offsetWidth;
      const p = paramsRef.current;

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

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/60 overflow-hidden mt-4">
      {/* Header + tab switcher */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-800">
        <span className="text-[10px] font-bold text-slate-400">🧪 {topicName}</span>
        <div className="flex gap-1">
          {(['modulation', 'interference'] as SimTab[]).map(t => (
            <button
              key={t}
              onClick={() => set('tab', t)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                ui.tab === t
                  ? t === 'modulation'
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-600/40'
                    : 'bg-emerald-600/30 text-emerald-300 border border-emerald-600/40'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t === 'modulation' ? '📡 AM/FM' : '〜 הפרעה'}
            </button>
          ))}
        </div>
      </div>

      {/* Oscilloscope canvas */}
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
        ) : (
          <>
            <Slider label="תדר גל 1 (f₁)" value={ui.freq1} min={0.5} max={8}          step={0.5}         color={C.wave1}  onChange={v => set('freq1', v)} />
            <Slider label="תדר גל 2 (f₂)" value={ui.freq2} min={0.5} max={8}          step={0.5}         color={C.wave2}  onChange={v => set('freq2', v)} />
            <Slider
              label={`פאזה (φ) ${((ui.phase / Math.PI) * 180).toFixed(0)}°`}
              value={ui.phase} min={0} max={2 * Math.PI} step={Math.PI / 12}
              color={C.result} onChange={v => set('phase', v)}
            />
          </>
        )}
      </div>
    </div>
  );
}

function Slider({
  label, value, min, max, step, color, onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  onChange: (v: number) => void;
}) {
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
      <span className="text-[10px] font-mono text-slate-300 w-10 text-left shrink-0">
        {value.toFixed(step < 0.1 ? 2 : step < 1 ? 1 : 0)}
      </span>
    </div>
  );
}
