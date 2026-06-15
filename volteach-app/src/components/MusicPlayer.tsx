import React, { useState } from 'react';
import { Music2, Minimize2, Maximize2, X } from 'lucide-react';

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

export default function MusicPlayer() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [stationIdx, setStationIdx] = useState(0);

  const station = STATIONS[stationIdx]!;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title="פתח נגן מוזיקה"
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full border border-indigo-500/30 bg-slate-900/90 px-4 py-2.5 text-xs font-bold text-indigo-300 shadow-lg backdrop-blur-md hover:border-indigo-400 hover:text-white transition-all"
      >
        <Music2 className="h-3.5 w-3.5 text-indigo-400" />
        <span>Focus Music</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 w-72 rounded-2xl border border-slate-700/60 bg-slate-900/97 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <Music2 className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-xs font-bold text-white">Focus Music</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 ${station.textColor}`}>
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
          {/* Station tabs */}
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

          {/* Embed player */}
          <div className="px-3 pb-3">
            <iframe
              key={stationIdx}
              src={station.src}
              width="100%"
              height={station.height}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-xl border-0"
              title={`${station.label} player`}
            />
          </div>

          <div className="px-4 pb-3 text-center text-[9px] text-slate-600">
            {station.provider === 'spotify'
              ? 'נדרש חשבון Spotify לניגון מלא'
              : 'SoundCloud — ניגון חינמי'}
          </div>
        </>
      )}

      {minimized && (
        <div className="flex items-center gap-2 px-4 pb-3">
          {STATIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => setStationIdx(i)}
              title={s.label}
              className={`flex-1 rounded-lg py-1.5 text-sm transition-all ${
                i === stationIdx
                  ? `bg-gradient-to-r ${s.color} shadow-sm`
                  : 'bg-slate-800 text-slate-500 hover:text-white'
              }`}
            >
              {s.emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
