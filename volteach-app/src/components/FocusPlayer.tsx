import React, { useState, useRef, useEffect } from 'react';
import { Wifi, Volume2, VolumeX, Minimize2, Maximize2, Play, Pause, X } from 'lucide-react';

const STATIONS = [
  {
    label: 'Lofi Study Beats',
    videoId: 'jfKfPfyJRdk',
    color: 'from-violet-500 to-purple-600',
  },
  {
    label: 'Jazz Cafe Vibes',
    videoId: '5qap5aO4i9A',
    color: 'from-amber-500 to-orange-600',
  },
  {
    label: 'Chillhop Radio',
    videoId: 'Dx5qFachd3A',
    color: 'from-emerald-500 to-teal-600',
  },
];

export default function FocusPlayer() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [stationIdx, setStationIdx] = useState(0);
  const [muted, setMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // stationIdx is always a valid index (0-2), cast away undefined
  const station = (STATIONS[stationIdx] ?? STATIONS[0])!;

  // Pulse the progress bar width for visual rhythm
  const [progress, setProgress] = useState(30);
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + 0.05;
        return next > 100 ? 0 : next;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [playing]);

  const handlePlay = () => {
    if (!open) {
      setOpen(true);
      setPlaying(true);
      return;
    }
    setPlaying(p => !p);
  };

  const switchStation = (idx: number) => {
    setStationIdx(idx);
    setPlaying(true);
  };

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setPlaying(true); }}
        title="פתח נגן מוזיקה"
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full border border-violet-500/40 bg-slate-900/90 px-4 py-2.5 text-xs font-bold text-violet-300 shadow-lg backdrop-blur-md hover:border-violet-400 hover:text-white transition-all group"
      >
        <Wifi className="h-3.5 w-3.5 text-violet-400 animate-pulse" />
        <span>Focus Player</span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 w-72 rounded-2xl border border-slate-700/60 bg-slate-900/95 shadow-2xl backdrop-blur-xl transition-all ${minimized ? 'h-auto' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <Wifi className={`h-3.5 w-3.5 text-violet-400 ${playing ? 'animate-pulse' : 'opacity-40'}`} />
          <span className="text-xs font-bold text-white">Focus Player</span>
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
            onClick={() => { setOpen(false); setPlaying(false); }}
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
          <div className="flex gap-1.5 px-4 pb-2">
            {STATIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => switchStation(i)}
                className={`flex-1 rounded-lg py-1 text-[10px] font-semibold transition-all ${
                  i === stationIdx
                    ? `bg-gradient-to-r ${s.color} text-white shadow-md`
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {i === 0 ? 'Lofi' : i === 1 ? 'Jazz' : 'Chill'}
              </button>
            ))}
          </div>

          {/* Now playing label */}
          <div className="px-4 pb-1.5">
            <div className="text-[10px] text-slate-500">מנגן כעת</div>
            <div className="text-sm font-bold text-white truncate">{station.label}</div>
          </div>

          {/* Progress bar */}
          <div className="px-4 pb-3">
            <div className="h-1 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${station.color} transition-all`}
                style={{ width: playing ? `${progress}%` : '0%' }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-4 pb-4">
            <button
              onClick={() => setMuted(m => !m)}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
              title={muted ? 'בטל השתקה' : 'השתק'}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            <button
              onClick={handlePlay}
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${station.color} text-white shadow-lg hover:scale-105 transition-transform`}
              title={playing ? 'השהה' : 'נגן'}
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>

            <div className="text-[10px] text-slate-500 font-mono">LIVE</div>
          </div>

          {/* Hidden YouTube iframe */}
          <iframe
            ref={iframeRef}
            key={`${stationIdx}-${playing}`}
            src={
              playing
                ? `https://www.youtube.com/embed/${station.videoId}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&loop=1&playlist=${station.videoId}`
                : ''
            }
            allow="autoplay"
            className="hidden"
            title="focus player audio"
          />
        </>
      )}

      {minimized && (
        <div className="flex items-center gap-3 px-4 pb-3">
          <div className="flex-1 text-xs font-semibold text-white truncate">{station.label}</div>
          <button
            onClick={handlePlay}
            className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${station.color} text-white`}
          >
            {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 ml-0.5" />}
          </button>
        </div>
      )}
    </div>
  );
}
