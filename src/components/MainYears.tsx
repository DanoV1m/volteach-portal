import React from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Institution } from '../types';

interface MainYearsProps {
  institution: Institution;
  onBack: () => void;
  onSelectYearSemester: (year: number, sem: number) => void;
  cacheBadgeInfo: {
    ageText: string;
    isFresh: boolean;
  } | null;
  onRefreshCache: () => void;
  selectedTrack?: 'regular' | 'spread';
  onTrackChange?: (track: 'regular' | 'spread') => void;
}

export default function MainYears({
  institution,
  onBack,
  onSelectYearSemester,
  cacheBadgeInfo,
  onRefreshCache,
  selectedTrack = 'regular',
  onTrackChange
}: MainYearsProps) {
  // Determine number of study years based on institution and track selection
  const numYears = institution.key === 'ruppin' && selectedTrack === 'spread' ? 5 : 4;
  const years = Array.from({ length: numYears }, (_, i) => i + 1);

  const YEAR_LABELS: Record<number, string> = {
    1: "א'",
    2: "ב'",
    3: "ג'",
    4: "ד'",
    5: "ה'"
  };

  const YEAR_DESCS: Record<number, string> = {
    1: "בסיסי — מתמטיקה ופיזיקה",
    2: "ביניים — חשמל ומערכות",
    3: "מתקדם — אלקטרוניקה ותקשורת",
    4: "התמחות ועיבוד אותות",
    5: "פרויקט גמר והתמחות מורחבת"
  };

  return (
    <section className="px-6 py-12 md:px-12">
      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 hover:bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>חזור לרשימת המוסדות</span>
      </button>

      {/* SECTION HEADER */}
      <div className="mb-12 text-center">
        <div className="inline-block rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1 text-xs font-bold text-indigo-400">
          📅 בחירת שנת לימודים וסמסטר
        </div>
        <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
          {institution.fullName}
        </h2>
        <p className="mt-2 text-slate-400">📍 {institution.location}</p>

        {/* Ruppin specific track toggle */}
        {institution.key === 'ruppin' && (
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => onTrackChange?.('regular')}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all border ${
                selectedTrack === 'regular'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-650/30'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              מסלול רגיל (4 שנים)
            </button>
            <button
              onClick={() => onTrackChange?.('spread')}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all border ${
                selectedTrack === 'spread'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-650/30'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              מסלול מורחב פריסה חמש-שנתית
            </button>
          </div>
        )}
      </div>

      {/* CACHE METADATA STRIP */}
      {cacheBadgeInfo && (
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <div className="rounded-full border border-slate-800 bg-slate-900/30 px-3 py-1">
            סטטוס אחסון מקומי: {cacheBadgeInfo.isFresh ? '✅ עדכני (מקוון)' : '⚠️ פג תוקף (דורש רענון)'} ({cacheBadgeInfo.ageText})
          </div>
          <button
            onClick={onRefreshCache}
            className="flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-400 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>רענן Cache</span>
          </button>
        </div>
      )}

      {/* GRID */}
      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 md:grid-cols-4">
        {years.map((y, idx) => (
          <div
            key={y}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-slate-900/60"
            style={{
              animation: 'slideUpFade 0.4s ease-out forwards',
              animationDelay: `${idx * 0.05}s`
            }}
          >
            <div className="mb-6">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-5xl font-black text-transparent opacity-80 group-hover:opacity-100 transition-opacity">
                {y}
              </span>
              <h3 className="mt-3 text-lg font-bold text-white">שנה {YEAR_LABELS[y]}</h3>
              <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {YEAR_DESCS[y] || 'קורסי התמחות מתקדמים'}
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => onSelectYearSemester(y, 1)}
                className="w-full rounded-2xl bg-indigo-650 hover:bg-indigo-600 border border-indigo-500/30 p-2.5 text-xs font-bold text-white transition-all shadow-md active:scale-95"
              >
                סמסטר א'
              </button>
              <button
                onClick={() => onSelectYearSemester(y, 2)}
                className="w-full rounded-2xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 p-2.5 text-xs font-bold text-slate-300 transition-all hover:text-white hover:border-slate-700 active:scale-95"
              >
                סמסטר ב'
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Helper to bridge global notification callback locally
const showToast = (msg: string, type: 'info' | 'error' | 'success') => {
  const customEvent = new CustomEvent('show-toast', { detail: { msg, type } });
  window.dispatchEvent(customEvent);
};
