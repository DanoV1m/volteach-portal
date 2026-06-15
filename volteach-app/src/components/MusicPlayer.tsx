import React, { useState, useEffect, useRef } from 'react';
import { Minimize2, Maximize2, X } from 'lucide-react';

const STATIONS = [
  {
    label: 'Lofi Beats',
    emoji: '🎵',
    color: 'from-violet-500 to-purple-600',
    textColor: 'text-violet-400',
    provider: 'spotify',
    src: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0',
    height: 152,
  },
  {
    label: 'Chillhop',
    emoji: '☕',
    color: 'from-amber-500 to-orange-600',
    textColor: 'text-amber-400',
    provider: 'soundcloud',
    src: 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chillhopdotcom&color=%23a855f7&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false',
    height: 165,
  },
  {
    label: 'Classical',
    emoji: '🎼',
    color: 'from-emerald-500 to-teal-600',
    textColor: 'text-emerald-400',
    provider: 'spotify',
    src: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWEJlAGA9gs0?utm_source=generator&theme=0',
    height: 152,
  },
] as const;

const PANEL_W = 288;
const BTN_SIZE = 44;

export default function MusicPlayer() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [stationIdx, setStationIdx] = useState(0);

  // Position — null until mounted (avoids SSR mismatch)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [didDrag, setDidDrag] = useState(false);
  const dragRef = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);

  useEffect(() => {
    setPos({ x: 24, y: window.innerHeight - 72 });
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!pos) return;
    e.preventDefault();
    dragRef.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    setDidDrag(false);
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.mx;
      const dy = e.clientY - dragRef.current.my;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) setDidDrag(true);
      setPos({
        x: Math.max(8, Math.min(window.innerWidth - BTN_SIZE - 8, dragRef.current.px + dx)),
        y: Math.max(8, Math.min(window.innerHeight - BTN_SIZE - 8, dragRef.current.py + dy)),
      });
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging]);

  if (!pos) return null;

  const station = STATIONS[stationIdx]!;

  // Panel position — opens up or down depending on where the button is
  const panelX = Math.max(8, Math.min(window.innerWidth - PANEL_W - 8, pos.x - PANEL_W / 2 + BTN_SIZE / 2));
  const openUpward = pos.y > window.innerHeight * 0.55;
  const approxH = minimized ? 88 : station.height + 130;
  const panelTop = openUpward
    ? Math.max(8, pos.y - approxH - 10)
    : pos.y + BTN_SIZE + 8;

  return (
    <>
      {/* Draggable ♪ button — always visible */}
      <button
        style={{ left: pos.x, top: pos.y, position: 'fixed' }}
        onMouseDown={onMouseDown}
        onClick={() => { if (!didDrag) setOpen(o => !o); }}
        className={`z-50 h-11 w-11 rounded-full flex items-center justify-center text-2xl shadow-xl select-none transition-all duration-150 print:hidden ${
          open
            ? `bg-gradient-to-br ${station.color} text-white shadow-indigo-500/30`
            : 'bg-slate-900/90 border border-slate-700 text-slate-300 hover:border-indigo-500/50 hover:text-white'
        } ${dragging ? 'cursor-grabbing scale-90' : 'cursor-grab hover:scale-110'}`}
        title={open ? 'סגור נגן' : 'פתח נגן מוזיקה — גרור להזזה'}
        aria-label="נגן מוזיקה"
      >
        ♪
      </button>

      {/* Player panel — appears when open */}
      {open && (
        <div
          style={{ left: panelX, top: panelTop, position: 'fixed' }}
          className="z-40 w-72 rounded-2xl border border-slate-700/60 bg-slate-900/97 shadow-2xl backdrop-blur-xl overflow-hidden print:hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">♪</span>
              <span className="text-xs font-bold text-white">Focus Music</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-800 ${station.textColor}`}>
                {station.provider === 'spotify' ? 'Spotify' : 'SoundCloud'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimized(m => !m)}
                className="p-1 text-slate-400 hover:text-white transition-colors rounded"
                title={minimized ? 'הרחב' : 'מזער'}
              >
                {minimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-slate-400 hover:text-red-400 transition-colors rounded"
                title="סגור"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Station selector */}
              <div className="flex gap-1.5 px-4 pb-3">
                {STATIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setStationIdx(i)}
                    className={`flex-1 rounded-lg py-1.5 text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                      i === stationIdx
                        ? `bg-gradient-to-r ${s.color} text-white shadow-md`
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{s.emoji}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Embedded player */}
              <div className="px-3 pb-2">
                <iframe
                  key={stationIdx}
                  src={station.src}
                  width="100%"
                  height={station.height}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl border-0 block"
                  title={`${station.label} player`}
                />
              </div>

              <p className="px-4 pb-3 text-center text-[9px] text-slate-600">
                {station.provider === 'spotify'
                  ? 'נדרש חשבון Spotify לניגון מלא'
                  : 'SoundCloud — ניגון חינמי ללא חשבון'}
              </p>
            </>
          )}

          {minimized && (
            <div className="flex gap-1.5 px-4 pb-3">
              {STATIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setStationIdx(i)}
                  title={s.label}
                  className={`flex-1 rounded-lg py-1.5 text-base transition-all ${
                    i === stationIdx
                      ? `bg-gradient-to-r ${s.color}`
                      : 'bg-slate-800 text-slate-500 hover:text-white'
                  }`}
                >
                  {s.emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
