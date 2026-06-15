import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Minimize2, Maximize2, X, LogOut, ChevronLeft, Loader2, Play, Pause, RotateCcw } from 'lucide-react';
import {
  initiateSpotifyLogin,
  isSpotifyConnected,
  disconnectSpotify,
  getMyPlaylists,
  getSpotifyUser,
  type SpotifyPlaylist,
} from '../utils/spotify';

// ── Curated stations ──────────────────────────────────────────────────────────

const CURATED = [
  {
    label: 'Lofi',
    emoji: '🎵',
    color: 'from-violet-500 to-purple-600',
    src: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0',
    height: 152,
    provider: 'spotify' as const,
  },
  {
    label: 'Chillhop',
    emoji: '☕',
    color: 'from-amber-500 to-orange-600',
    src: 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chillhopdotcom&color=%23a855f7&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false',
    height: 165,
    provider: 'soundcloud' as const,
  },
  {
    label: 'Classical',
    emoji: '🎼',
    color: 'from-emerald-500 to-teal-600',
    src: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWEJlAGA9gs0?utm_source=generator&theme=0',
    height: 152,
    provider: 'spotify' as const,
  },
] as const;

// ── SoundCloud stations ───────────────────────────────────────────────────────

const SC_STATIONS = [
  {
    label: 'Chillhop',
    emoji: '☕',
    color: 'from-amber-500 to-orange-500',
    src: 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chillhopdotcom&color=%23f59e0b&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true',
  },
  {
    label: 'Lofi',
    emoji: '🎵',
    color: 'from-violet-500 to-purple-600',
    src: 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chillhopdotcom/sets/chillhop-essentials-fall-2024&color=%238b5cf6&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true',
  },
  {
    label: 'Ambient',
    emoji: '🌊',
    color: 'from-cyan-500 to-blue-600',
    src: 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/ambient-worlds&color=%2306b6d4&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true',
  },
  {
    label: 'Jazz',
    emoji: '🎷',
    color: 'from-orange-500 to-red-600',
    src: 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jazzvibes&color=%23f97316&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true',
  },
  {
    label: 'Focus',
    emoji: '🧠',
    color: 'from-emerald-500 to-teal-600',
    src: 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/focusmusic&color=%2310b981&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true',
  },
] as const;

const PANEL_W = 300;
const BTN_SIZE = 44;

// ── Component ─────────────────────────────────────────────────────────────────

export default function MusicPlayer() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [tab, setTab] = useState<'curated' | 'spotify' | 'soundcloud' | 'pomodoro'>('curated');

  // Pomodoro state
  const WORK_SECS = 25 * 60;
  const BREAK_SECS = 5 * 60;
  const [pomMode, setPomMode] = useState<'work' | 'break'>('work');
  const [pomSecs, setPomSecs] = useState(WORK_SECS);
  const [pomRunning, setPomRunning] = useState(false);
  const [pomSession, setPomSession] = useState(1);
  const pomRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [curatedIdx, setCuratedIdx] = useState(0);
  const [scIdx, setScIdx] = useState(0);

  // Spotify state
  const [spConnected, setSpConnected] = useState(isSpotifyConnected);
  const [spUser, setSpUser] = useState('');
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [selectedPl, setSelectedPl] = useState<SpotifyPlaylist | null>(null);
  const [spLoading, setSpLoading] = useState(false);

  // Drag state
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [didDrag, setDidDrag] = useState(false);
  const dragRef = useRef<{ mx: number; my: number; px: number; py: number; _nx?: number; _ny?: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setPos({ x: 24, y: window.innerHeight - 72 });
  }, []);

  const pomBeep = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start(); osc.stop(ctx.currentTime + 0.8);
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    if (!pomRunning) { if (pomRef.current) clearInterval(pomRef.current); return; }
    pomRef.current = setInterval(() => {
      setPomSecs(s => {
        if (s <= 1) {
          pomBeep();
          if (pomMode === 'work') {
            setPomMode('break');
            setPomSecs(BREAK_SECS);
            setPomSession(n => n + 1);
          } else {
            setPomMode('work');
            setPomSecs(WORK_SECS);
          }
          setPomRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (pomRef.current) clearInterval(pomRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pomRunning, pomMode]);

  const pomReset = () => {
    setPomRunning(false);
    setPomSecs(pomMode === 'work' ? WORK_SECS : BREAK_SECS);
  };

  const pomToggleMode = (mode: 'work' | 'break') => {
    setPomMode(mode);
    setPomRunning(false);
    setPomSecs(mode === 'work' ? WORK_SECS : BREAK_SECS);
  };

  useEffect(() => {
    const handler = () => {
      setSpConnected(true);
      setPlaylists([]);
    };
    window.addEventListener('spotify-connected', handler);
    return () => window.removeEventListener('spotify-connected', handler);
  }, []);

  useEffect(() => {
    if (tab !== 'spotify' || !spConnected || playlists.length > 0) return;
    setSpLoading(true);
    Promise.all([getMyPlaylists(), getSpotifyUser()])
      .then(([pls, user]) => {
        setPlaylists(pls);
        setSpUser(user?.display_name ?? '');
      })
      .finally(() => setSpLoading(false));
  }, [tab, spConnected, playlists.length]);

  // ── Drag handlers — direct DOM update during drag, state only on release ──

  const onMouseDown = (e: React.MouseEvent) => {
    if (!pos) return;
    e.preventDefault();
    dragRef.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    setDidDrag(false);
    setDragging(true);

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current || !btnRef.current) return;
      const dx = ev.clientX - dragRef.current.mx;
      const dy = ev.clientY - dragRef.current.my;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setDidDrag(true);
      const nx = Math.max(8, Math.min(window.innerWidth - BTN_SIZE - 8, dragRef.current.px + dx));
      const ny = Math.max(8, Math.min(window.innerHeight - BTN_SIZE - 8, dragRef.current.py + dy));
      btnRef.current.style.left = `${nx}px`;
      btnRef.current.style.top = `${ny}px`;
      dragRef.current._nx = nx;
      dragRef.current._ny = ny;
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setDragging(false);
      if (dragRef.current?._nx !== undefined && dragRef.current?._ny !== undefined) {
        setPos({ x: dragRef.current._nx, y: dragRef.current._ny });
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
  };

  if (!pos) return null;

  const curated = CURATED[curatedIdx]!;
  const scStation = SC_STATIONS[scIdx]!;
  const activeColor = tab === 'soundcloud' ? scStation.color : curated.color;

  const panelX = Math.max(8, Math.min(window.innerWidth - PANEL_W - 8, pos.x - PANEL_W / 2 + BTN_SIZE / 2));
  const openUpward = pos.y > window.innerHeight * 0.55;
  const approxH = minimized ? 88 : 460;
  const panelTop = openUpward ? Math.max(8, pos.y - approxH - 10) : pos.y + BTN_SIZE + 8;

  const handleDisconnect = () => {
    disconnectSpotify();
    setSpConnected(false);
    setPlaylists([]);
    setSelectedPl(null);
    setSpUser('');
  };

  return (
    <>
      {/* Draggable ♪ button — visible only when panel is fully closed */}
      {!open && (
        <button
          ref={btnRef}
          style={{ left: pos.x, top: pos.y, position: 'fixed' }}
          onMouseDown={onMouseDown}
          onClick={() => { if (!didDrag) setOpen(true); }}
          className={`z-50 h-11 w-11 rounded-full flex items-center justify-center text-2xl shadow-xl select-none transition-all duration-150 print:hidden bg-slate-900/90 border border-slate-700 text-slate-300 hover:border-indigo-500/50 hover:text-white ${dragging ? 'cursor-grabbing scale-90' : 'cursor-grab hover:scale-110'}`}
          title="נגן מוזיקה — גרור להזזה"
          aria-label="נגן מוזיקה"
        >
          ♪
        </button>
      )}

      {/* Player panel */}
      {open && (
        <div
          style={{ left: panelX, top: panelTop, position: 'fixed', width: PANEL_W }}
          className="z-40 rounded-2xl border border-slate-700/60 bg-slate-900/98 shadow-2xl backdrop-blur-xl overflow-hidden print:hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Studying Music ♪</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMinimized(m => !m)} className="p-1 text-slate-400 hover:text-white transition-colors rounded" title={minimized ? 'הרחב' : 'מזער'}>
                {minimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
              </button>
              <button onClick={() => setOpen(false)} className="p-1 text-slate-400 hover:text-red-400 transition-colors rounded" title="סגור">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Tab bar — RTL order: Spotify | SoundCloud | תחנות | טיימר */}
              <div className="flex gap-1 px-3 pb-3">
                <button
                  onClick={() => setTab('spotify')}
                  className={`flex-1 rounded-lg py-1.5 text-[10px] font-bold transition-all flex items-center justify-center ${tab === 'spotify' ? 'bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                </button>
                <button
                  onClick={() => setTab('soundcloud')}
                  className={`flex-1 rounded-lg py-1.5 text-[10px] font-bold transition-all flex items-center justify-center ${tab === 'soundcloud' ? 'bg-[#ff5500]/20 text-[#ff5500] border border-[#ff5500]/30' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.56 8.87V17h8.76c1.46 0 2.65-1.19 2.65-2.65a2.65 2.65 0 00-2.18-2.63c.05-.28.08-.57.08-.87a4.56 4.56 0 00-4.56-4.56c-.91 0-1.76.27-2.46.73A4.67 4.67 0 007.17 4.3 4.67 4.67 0 002.5 8.97c0 .14.01.27.03.4A2.65 2.65 0 000 11.92 2.65 2.65 0 002.65 14.57h8.91V8.87z"/></svg>
                </button>
                <button
                  onClick={() => setTab('curated')}
                  className={`flex-1 rounded-lg py-1.5 text-[10px] font-bold transition-all ${tab === 'curated' ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  🎶 תחנות
                </button>
                <button
                  onClick={() => setTab('pomodoro')}
                  className={`flex-1 rounded-lg py-1.5 text-[10px] font-bold transition-all ${tab === 'pomodoro' ? (pomMode === 'work' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30') : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  ⏱ טיימר
                </button>
              </div>

              {/* ── Curated tab ── */}
              {tab === 'curated' && (
                <>
                  <div className="flex gap-1.5 px-4 pb-3">
                    {CURATED.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setCuratedIdx(i)}
                        className={`flex-1 rounded-lg py-1.5 text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                          i === curatedIdx
                            ? `bg-gradient-to-r ${s.color} text-white shadow-md`
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{s.emoji}</span>
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="px-3 pb-2">
                    <iframe
                      key={curatedIdx}
                      src={curated.src}
                      width="100%"
                      height={curated.height}
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="rounded-xl border-0 block"
                      title={`${curated.label} player`}
                    />
                  </div>
                  <p className="px-4 pb-3 text-center text-[9px] text-slate-600">
                    {curated.provider === 'spotify' ? 'נדרש חשבון Spotify לניגון מלא' : 'SoundCloud — ניגון חינמי'}
                  </p>
                </>
              )}

              {/* ── SoundCloud tab ── */}
              {tab === 'soundcloud' && (
                <>
                  <div className="flex gap-1 px-3 pb-3 flex-wrap">
                    {SC_STATIONS.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setScIdx(i)}
                        className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-bold transition-all ${
                          i === scIdx
                            ? `bg-gradient-to-r ${s.color} text-white shadow-md`
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{s.emoji}</span>
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="px-3 pb-2">
                    <iframe
                      key={scIdx}
                      src={scStation.src}
                      width="100%"
                      height={166}
                      allow="autoplay"
                      loading="lazy"
                      className="rounded-xl border-0 block"
                      title={`${scStation.label} — SoundCloud`}
                    />
                  </div>
                  <p className="px-4 pb-3 text-center text-[9px] text-slate-600">
                    SoundCloud · ניגון חינמי ללא הרשמה
                  </p>
                </>
              )}

              {/* ── Pomodoro tab ── */}
              {tab === 'pomodoro' && (() => {
                const total = pomMode === 'work' ? WORK_SECS : BREAK_SECS;
                const pct = ((total - pomSecs) / total) * 100;
                const mins = String(Math.floor(pomSecs / 60)).padStart(2, '0');
                const secs = String(pomSecs % 60).padStart(2, '0');
                const color = pomMode === 'work' ? '#ef4444' : '#10b981';
                const r = 44, circ = 2 * Math.PI * r;
                return (
                  <div className="px-4 pb-4 flex flex-col items-center gap-4">
                    {/* Mode toggle */}
                    <div className="flex gap-1 w-full">
                      <button onClick={() => pomToggleMode('work')} className={`flex-1 rounded-lg py-1.5 text-[10px] font-bold transition-all ${pomMode === 'work' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-500'}`}>
                        עבודה 25 דק׳
                      </button>
                      <button onClick={() => pomToggleMode('break')} className={`flex-1 rounded-lg py-1.5 text-[10px] font-bold transition-all ${pomMode === 'break' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
                        הפסקה 5 דק׳
                      </button>
                    </div>

                    {/* Circular timer */}
                    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
                      <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="60" cy="60" r={r} fill="none" stroke="#1e293b" strokeWidth="6" />
                        <circle
                          cx="60" cy="60" r={r} fill="none"
                          stroke={color} strokeWidth="6"
                          strokeDasharray={circ}
                          strokeDashoffset={circ - (pct / 100) * circ}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dashoffset 0.8s linear' }}
                        />
                      </svg>
                      <div className="absolute text-center">
                        <p className="text-2xl font-black text-white tabular-nums">{mins}:{secs}</p>
                        <p className="text-[9px] font-bold" style={{ color }}>{pomMode === 'work' ? 'עבודה' : 'הפסקה'}</p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                      <button onClick={pomReset} className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setPomRunning(r => !r)}
                        className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg transition-all hover:scale-105"
                        style={{ backgroundColor: color }}
                      >
                        {pomRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5" />}
                      </button>
                      <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
                        #{pomSession}
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-600 text-center">
                      {pomMode === 'work' ? 'התמקד · הנגן ממשיך ברקע' : 'קח הפסקה — קום לשתות מים 💧'}
                    </p>
                  </div>
                );
              })()}

              {/* ── Spotify tab ── */}
              {tab === 'spotify' && (
                <div className="px-4 pb-4">
                  {!spConnected ? (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <div className="h-12 w-12 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center">
                        <svg className="h-6 w-6 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                      </div>
                      <p className="text-xs text-slate-300 font-bold text-center">חבר את Spotify שלך</p>
                      <p className="text-[10px] text-slate-500 text-center leading-relaxed">גש לכל הפלייליסטים האישיים שלך ישירות מתוך הנגן</p>
                      <button
                        onClick={initiateSpotifyLogin}
                        className="w-full rounded-xl bg-[#1DB954] hover:bg-[#1ed760] py-2.5 text-xs font-black text-black transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                        התחבר עם Spotify
                      </button>
                    </div>
                  ) : selectedPl ? (
                    <>
                      <button
                        onClick={() => setSelectedPl(null)}
                        className="mb-2 flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span>כל הפלייליסטים</span>
                      </button>
                      <p className="text-xs font-bold text-white mb-2 truncate">{selectedPl.name}</p>
                      <iframe
                        key={selectedPl.id}
                        src={`https://open.spotify.com/embed/playlist/${selectedPl.id}?utm_source=generator&theme=0`}
                        width="100%"
                        height={152}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-xl border-0 block"
                        title={selectedPl.name}
                      />
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] text-slate-400">
                          {spUser ? `שלום, ${spUser}` : 'הפלייליסטים שלי'}
                        </p>
                        <button
                          onClick={handleDisconnect}
                          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-red-400 transition-colors"
                          title="התנתק מ-Spotify"
                        >
                          <LogOut className="h-3 w-3" />
                          <span>התנתק</span>
                        </button>
                      </div>

                      {spLoading ? (
                        <div className="flex justify-center py-6">
                          <Loader2 className="h-5 w-5 animate-spin text-[#1DB954]" />
                        </div>
                      ) : playlists.length === 0 ? (
                        <p className="text-[10px] text-slate-500 text-center py-4">לא נמצאו פלייליסטים</p>
                      ) : (
                        <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar">
                          {playlists.map(pl => (
                            <button
                              key={pl.id}
                              onClick={() => setSelectedPl(pl)}
                              className="w-full flex items-center gap-2.5 rounded-xl p-2 hover:bg-slate-800 transition-colors text-right group"
                            >
                              {pl.images[0] ? (
                                <img src={pl.images[0].url} alt={pl.name} className="h-9 w-9 rounded-lg object-cover shrink-0" />
                              ) : (
                                <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center text-base shrink-0">🎵</div>
                              )}
                              <div className="flex-1 min-w-0 text-right">
                                <p className="text-xs font-bold text-white truncate group-hover:text-[#1DB954] transition-colors">{pl.name}</p>
                                <p className="text-[9px] text-slate-500">{pl.tracks?.total ?? 0} שירים</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {minimized && (
            <div className="flex gap-2 px-4 pb-3">
              {/* Spotify random */}
              <button
                onClick={() => {
                  if (!spConnected) { setMinimized(false); setTab('spotify'); return; }
                  const rand = playlists.length > 0
                    ? playlists[Math.floor(Math.random() * playlists.length)]!
                    : null;
                  if (rand) setSelectedPl(rand);
                  setMinimized(false); setTab('spotify');
                }}
                title="נגן פלייליסט אקראי מ-Spotify"
                className="flex-1 flex flex-col items-center justify-center gap-1 rounded-xl bg-[#1DB954]/10 hover:bg-[#1DB954]/20 border border-[#1DB954]/20 hover:border-[#1DB954]/40 py-2 transition-all"
              >
                <svg className="h-4 w-4 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                <span className="text-[9px] text-[#1DB954] font-bold">רנדום</span>
              </button>

              {/* SoundCloud random */}
              <button
                onClick={() => {
                  const rand = Math.floor(Math.random() * SC_STATIONS.length);
                  setScIdx(rand);
                  setMinimized(false); setTab('soundcloud');
                }}
                title="נגן תחנת SoundCloud אקראית"
                className="flex-1 flex flex-col items-center justify-center gap-1 rounded-xl bg-[#ff5500]/10 hover:bg-[#ff5500]/20 border border-[#ff5500]/20 hover:border-[#ff5500]/40 py-2 transition-all"
              >
                <svg className="h-4 w-4 text-[#ff5500]" viewBox="0 0 24 24" fill="currentColor"><path d="M11.56 8.87V17h8.76c1.46 0 2.65-1.19 2.65-2.65a2.65 2.65 0 00-2.18-2.63c.05-.28.08-.57.08-.87a4.56 4.56 0 00-4.56-4.56c-.91 0-1.76.27-2.46.73A4.67 4.67 0 007.17 4.3 4.67 4.67 0 002.5 8.97c0 .14.01.27.03.4A2.65 2.65 0 000 11.92 2.65 2.65 0 002.65 14.57h8.91V8.87z"/></svg>
                <span className="text-[9px] text-[#ff5500] font-bold">רנדום</span>
              </button>

              {/* Timer */}
              <button
                onClick={() => { setMinimized(false); setTab('pomodoro'); }}
                title={pomRunning ? 'טיימר פועל' : 'פתח טיימר'}
                className={`flex-1 flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition-all border ${
                  pomRunning
                    ? pomMode === 'work'
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span className="text-sm">⏱</span>
                <span className="text-[9px] font-black tabular-nums">
                  {pomRunning
                    ? `${String(Math.floor(pomSecs / 60)).padStart(2,'0')}:${String(pomSecs % 60).padStart(2,'0')}`
                    : 'טיימר'}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
