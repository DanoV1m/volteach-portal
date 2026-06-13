import React, { useState, useEffect } from 'react';
import { subscribeVitals, getVitalsSnapshot, type VitalEntry } from '../utils/vitals';

interface NavTiming {
  domReady: number;
  pageLoad: number;
  resources: number;
}

function readNavTiming(): NavTiming | null {
  const nav = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (!nav || nav.loadEventEnd === 0) return null;
  return {
    domReady: Math.round(nav.domContentLoadedEventEnd - nav.fetchStart),
    pageLoad: Math.round(nav.loadEventEnd - nav.fetchStart),
    resources: performance.getEntriesByType('resource').length,
  };
}

const RATING_ROW: Record<string, string> = {
  good: 'border-emerald-500/25 bg-emerald-500/8',
  'needs-improvement': 'border-amber-500/25 bg-amber-500/8',
  poor: 'border-red-500/25 bg-red-500/8',
};

const RATING_VALUE: Record<string, string> = {
  good: 'text-emerald-400',
  'needs-improvement': 'text-amber-400',
  poor: 'text-red-400',
};

function VitalRow({ entry }: { entry: VitalEntry }) {
  const display =
    entry.unit === 'ms'
      ? `${Math.round(entry.value)} ms`
      : entry.value.toFixed(3);
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 ${RATING_ROW[entry.rating] ?? ''}`}
    >
      <span className="text-[10px] font-bold text-slate-300">{entry.name}</span>
      <span className={`text-[10px] font-mono font-bold ${RATING_VALUE[entry.rating] ?? 'text-slate-400'}`}>
        {display}
      </span>
    </div>
  );
}

export function DevPerfOverlay() {
  const [collapsed, setCollapsed] = useState(false);
  const [vitals, setVitals] = useState<VitalEntry[]>(getVitalsSnapshot);
  const [navTiming, setNavTiming] = useState<NavTiming | null>(readNavTiming);

  useEffect(() => {
    return subscribeVitals(() => setVitals(getVitalsSnapshot()));
  }, []);

  // Refresh nav timing once the page load event fires
  useEffect(() => {
    const refresh = () => setNavTiming(readNavTiming());
    if (document.readyState === 'complete') {
      refresh();
    } else {
      window.addEventListener('load', refresh, { once: true });
    }
  }, []);

  return (
    <div className="fixed bottom-20 left-4 z-50 w-48 font-mono select-none print:hidden">
      {/* Toggle header */}
      <button
        onClick={() => setCollapsed(p => !p)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-900/95 px-2.5 py-1.5 text-[9px] font-bold text-indigo-400 hover:bg-slate-800 transition-colors"
      >
        <span>⚡ Web Vitals</span>
        <span className="text-slate-500">{collapsed ? '▲' : '▼'}</span>
      </button>

      {!collapsed && (
        <div className="mt-1 space-y-1 rounded-xl border border-slate-800 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-sm">
          {/* Core Web Vitals */}
          {vitals.length === 0 ? (
            <p className="py-2 text-center text-[9px] text-slate-500">
              ממתין למדידות...
            </p>
          ) : (
            vitals.map(v => <VitalRow key={v.name} entry={v} />)
          )}

          {/* Navigation Timing */}
          {navTiming && (
            <div className="mt-1 space-y-1 border-t border-slate-800 pt-1.5">
              {[
                { label: 'DOM Ready', value: `${navTiming.domReady} ms` },
                { label: 'Page Load', value: `${navTiming.pageLoad} ms` },
                { label: 'Resources', value: String(navTiming.resources) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between px-1">
                  <span className="text-[9px] text-slate-500">{label}</span>
                  <span className="text-[9px] font-bold text-slate-400">{value}</span>
                </div>
              ))}
            </div>
          )}

          <p className="pt-0.5 text-center text-[8px] text-slate-700">DEV only</p>
        </div>
      )}
    </div>
  );
}
