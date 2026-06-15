import React, { useState, useEffect, useRef } from 'react';
import { Minimize2, Maximize2, X, LogOut, ChevronLeft, Loader2 } from 'lucide-react';
import {
  initiateSpotifyLogin,
  isSpotifyConnected,
  disconnectSpotify,
  getMyPlaylists,
  getSpotifyUser,
  type SpotifyPlaylist,
} from '../utils/spotify';

// ── Curated stations ──────────────────────────────────────────────────────────

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

const PANEL_W = 300;
const BTN_SIZE = 44;

// ── Component ─────────────────────────────────────────────────────────────────

export default function MusicPlayer() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [tab, setTab] = useState<'curated' | 'spotify'>('curated');
  const [stationIdx, setStationIdx] = useState(0);

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
  const dragRef = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);

  useEffect(() => {
    setPos({ x: 24, y: window.innerHeight - 72 });
  }, []);

  // Load Spotify playlists when tab becomes active
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

  // ── Drag handlers ──────────────────────────────────────────────────────────

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

  // Panel position — opens up or down depending on button location
  const panelX = Math.max(8, Math.min(window.innerWidth - PANEL_W - 8, pos.x - PANEL_W / 2 + BTN_SIZE / 2));
  const openUpward = pos.y > window.innerHeight * 0.55;
  const approxH = minimized ? 88 : 420;
  const panelTop = openUpward
    ? Math.max(8, pos.y - approxH - 10)
    : pos.y + BTN_SIZE + 8;

  const handleDisconnect = () => {
    disconnectSpotify();
    setSpConnected(false);
    setPlaylists([]);
    setSelectedPl(null);
    setSpUser('');
  };

  return (
    <>
      {/* Draggable ♪ button */}
      <button
        style={{ left: pos.x, top: pos.y, position: 'fixed' }}
        onMouseDown={onMouseDown}
        onClick={() => { if (!didDrag) setOpen(o => !o); }}
        className={`z-50 h-11 w-11 rounded-full flex items-center justify-center text-2xl shadow-xl select-none transition-all duration-150 print:hidden ${
          open
            ? `bg-gradient-to-br ${station.color} text-white`
            : 'bg-slate-900/90 border border-slate-700 text-slate-300 hover:border-indigo-500/50 hover:text-white'
        } ${dragging ? 'cursor-grabbing scale-90' : 'cursor-grab hover:scale-110'}`}
        title={open ? 'סגור נגן' : 'נגן מוזיקה — גרור להזזה'}
        aria-label="נגן מוזיקה"
      >
        ♪
      </button>

      {/* Player panel */}
      {open && (
        <div
          style={{ left: panelX, top: panelTop, position: 'fixed', width: PANEL_W }}
          className="z-40 rounded-2xl border border-slate-700/60 bg-slate-900/98 shadow-2xl backdrop-blur-xl overflow-hidden print:hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">♪</span>
              <span className="text-xs font-bold text-white">Focus Music</span>
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
              {/* Tab bar */}
              <div className="flex gap-1.5 px-4 pb-3">
                <button
                  onClick={() => setTab('curated')}
                  className={`flex-1 rounded-lg py-1.5 text-[10px] font-bold transition-all ${tab === 'curated' ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  🎶 תחנות
                </button>
                <button
                  onClick={() => setTab('spotify')}
                  className={`flex-1 rounded-lg py-1.5 text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${tab === 'spotify' ? 'bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                  Spotify שלי
                </button>
              </div>

              {/* ── Curated tab ── */}
              {tab === 'curated' && (
                <>
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
                    {station.provider === 'spotify' ? 'נדרש חשבון Spotify לניגון מלא' : 'SoundCloud — ניגון חינמי'}
                  </p>
                </>
              )}

              {/* ── Spotify tab ── */}
              {tab === 'spotify' && (
                <div className="px-4 pb-4">
                  {!spConnected ? (
                    /* Not connected */
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
                    /* Playlist embed */
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
                    /* Playlist list */
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
                                <img
                                  src={pl.images[0].url}
                                  alt={pl.name}
                                  className="h-9 w-9 rounded-lg object-cover shrink-0"
                                />
                              ) : (
                                <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center text-base shrink-0">🎵</div>
                              )}
                              <div className="flex-1 min-w-0 text-right">
                                <p className="text-xs font-bold text-white truncate group-hover:text-[#1DB954] transition-colors">{pl.name}</p>
                                <p className="text-[9px] text-slate-500">{pl.tracks.total} שירים</p>
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
            <div className="flex gap-1.5 px-4 pb-3">
              {STATIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setStationIdx(i); setTab('curated'); }}
                  title={s.label}
                  className={`flex-1 rounded-lg py-1.5 text-base transition-all ${
                    i === stationIdx && tab === 'curated'
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
